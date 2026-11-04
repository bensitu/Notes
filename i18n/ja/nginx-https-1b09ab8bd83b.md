# NginxリバースプロキシとHTTPS :id=h-30cc88c5c528

学習目標：ブラウザーが1つの入口からページとAPIにアクセスできるようにし、パス、転送ヘッダー、タイムアウト、キャッシュ、証明書を理解します。

**適用範囲：**&#x4E00;貫したサンプルはNginx公式のstable-alpineイメージを使用し、ローカルの入口はHTTP 8088です。HTTPS設定はドメインと有効な証明書を用意してから有効にする拡張です。

[ドキュメント一覧](README.md) · [一貫したサンプルプロジェクトと実行手順](examples/taskboard/README.md)

**目次**

- [リバースプロキシの役割](#section-1)
- [最小限の実行手順](#section-2)
- [パス末尾のスラッシュが重要](#section-3)
- [静的キャッシュとページルーティング](#section-4)
- [HTTPS設定テンプレート](#section-5)
- [検証とトラブルシューティングの早見表](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## リバースプロキシの役割 :id=h-84f20df41628

ブラウザーはNginxにアクセスし、静的ページはNginxが返し、/apiリクエストはJavaバックエンドへ転送します。ブラウザーには同じオリジンとして見え、コンテナーのデータベースや内部バックエンドのアドレスへ直接接続する必要はありません。

Nginxは業務上の権限検証の代わりにはなりません。フロントエンドのページにアクセスできても、タスクAPIに匿名アクセスできるとは限りません。

<a id="section-2"></a>

## 最小限の実行手順 :id=h-dd40cac97511

```powershell
Set-Location examples/taskboard
docker compose --env-file .env up -d --build
docker compose exec web nginx -t
curl.exe -i http://127.0.0.1:8088/
curl.exe -i http://127.0.0.1:8088/api/tasks
```

ホームページは200、未ログインのAPIは401を想定します。2つ目の応答はパスがバックエンドへ転送されたことを示します。完全な設定は[nginx.conf](examples/taskboard/frontend/nginx.conf)を参照してください。

<a id="section-3"></a>

## パス末尾のスラッシュが重要 :id=h-e7275b29da89

サンプルでは次を使用します。

```nginx
location /api/ {
    proxy_pass http://backend:8080;
}
```

/api/tasksの転送では/api/tasksを保持します。URI付きのproxy_pass [http://backend:8080/にすると、一致した](http://backend:8080/，匹配的) /api/の接頭辞が置換され、バックエンドが受け取るパスは/tasksになる場合があります。

パスマッピングの変更後は、設定構文だけでなく実際のURLで検証します。

<a id="section-4"></a>

## 静的キャッシュとページルーティング :id=h-63ec1d39c865

Viteが生成するハッシュ付きassetsは長期間キャッシュできますが、HTMLのエントリーポイントは適時再検証する必要があります。ログイン応答、ユーザーデータ、すべての/api応答に一律で共有キャッシュを設定してはいけません。

SPAページの再読み込みでは、存在しないフロントエンドルートをNginxがindex.htmlへフォールバックします。APIパスは独立したlocationが必要で、同じくHTMLに戻して成功を装ってはいけません。

ブラウザーで「JSONの解析に失敗」と表示されたら、実際の応答が誤って返されたindex.htmlでないか確認します。

<a id="section-5"></a>

## HTTPS設定テンプレート :id=h-55f1b3b49238

次のserverの抜粋は、Nginxのhttp設定コンテキスト内に配置します。先にドメインDNSを設定し、実際の証明書と秘密鍵をこれらのパスへ安全にマウントしてください。ローカルのComposeで有効化済みの設定ではありません。

```nginx
server {
    listen 443 ssl;
    server_name tasks.example.com;
    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
```

静的ページ、80から443への明示的なリダイレクト、証明書更新、正常性の検証も設定します。バックエンドは既知のプロキシの転送ヘッダーだけを信頼し、HTTPSの経路でSecureなセッションCookieを設定します。ヘッダーを追加するだけで元のプロトコルが正しく認識されるわけではありません。

秘密鍵をイメージやリポジトリに入れないでください。HSTSはドメイン全体と関連サブドメインが長期間HTTPSを使用できることを確認してから有効にし、includeSubDomainsを安易に適用しないでください。

<a id="section-6"></a>

## 検証とトラブルシューティングの早見表 :id=h-1a1c0bca24b9

| 症状             | 確認事項                                      |
| -------------- | ----------------------------------------- |
| 502            | 上流アドレス、コンテナーのDNS、待ち受けポート、バックエンドプロセス       |
| 504            | 処理時間、ブロック箇所、タイムアウト、呼び出し経路                 |
| リクエストパスの一部が欠ける | proxy_passにURIがあるか、locationがどう一致するか確認     |
| 設定変更が反映されない    | nginx -t後にreloadまたはイメージの再ビルドを行ったか確認       |
| 証明書が信頼されない     | ドメイン、有効期間、証明書チェーン、クライアントの信頼を確認し、検証を無効にしない |
| アップロードが失敗する    | Nginxとバックエンド両方のサイズ制限を満たすか確認               |

Nginxのadd_headerには設定階層と継承の規則があります。子のlocationにキャッシュヘッダーを追加する際は、必要なセキュリティヘッダーが残るか確認します。再読み込み前に設定を検証し、コンテナー内の一時的な編集は次のイメージに自動で含まれないことに注意してください。

この例の上流サービス名はNginxの設定読み込み時に解決されます。backendコンテナーだけの置換でIPが変わった場合は、再確認してwebを再読み込みまたは再構築してください。既存のNginxプロセスが直ちにDocker DNSを再解決すると仮定しないでください。

<a id="section-7"></a>

## 公式リファレンス :id=h-f8d4934fee49

- [Nginx proxyモジュール](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [HTTPSの設定](https://nginx.org/en/docs/http/configuring_https_servers.html)
- [応答ヘッダーモジュール](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
