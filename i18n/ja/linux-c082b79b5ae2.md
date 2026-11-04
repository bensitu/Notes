# Linuxとネットワークのトラブルシューティング：リクエストの経路で問題を特定する :id=h-1655eed479aa

学習目標：サーバー上のプロセス、ポート、設定、ログの問題を特定します。先にファイルパスとHTTPリクエストを理解してください。

**適用範囲：**&#x30B5;ーバーコマンドは一般的なLinuxを例にbashと表示し、Windows用にはPowerShellを併記します。異なるディストリビューションのインストールコマンドを混用しないでください。

[ドキュメント一覧](README.md) · [一貫したサンプルプロジェクトと実行手順](examples/taskboard/README.md)

**目次**

- [リクエストが通る場所](#section-1)
- [最小限の練習：ローカルサービスを確認する](#section-2)
- [よく使う調査コマンド](#section-3)
- [症状から原因を調べる](#section-4)
- [権限、環境変数、終了](#section-5)
- [検証と開発の早見表](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## リクエストが通る場所 :id=h-a7b9b122d5e2

ブラウザー → DNS解決 → サーバーのポート → Nginx → バックエンドプロセス → データベース。まずどの区間で失敗するかを判断し、対応する設定を変更します。

ファイルパスは大文字と小文字を区別します。/はルートディレクトリ、\~は通常現在のユーザーのホームです。相対パスは現在のディレクトリから始まります。Windowsのパスや大文字と小文字の規則をそのまま使えると仮定しないでください。

<a id="section-2"></a>

## 最小限の練習：ローカルサービスを確認する :id=h-a274c7cc5759

[プロジェクトの説明](examples/taskboard/README.md)に従ってバックエンドを起動し、Linuxで次を実行します。

```bash
pwd
java -version
ps -ef
ss -lnt
curl -i --connect-timeout 3 --max-time 10 http://127.0.0.1:8080/actuator/health
curl -i --connect-timeout 3 --max-time 10 http://127.0.0.1:8080/api/tasks
```

ヘルスチェックはHTTP 200、未ログインのタスク読み取りは401を想定します。これはサーバーに到達でき、後者の失敗原因がポート接続ではなく認証であることを示します。

Windowsでの対応コマンド：

```powershell
Get-Location
Get-Process java -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
Test-NetConnection 127.0.0.1 -Port 8080
curl.exe -i http://127.0.0.1:8080/actuator/health
```

<a id="section-3"></a>

## よく使う調査コマンド :id=h-fbd84794a418

次のsystemctlとjournalctlは、systemdを使用しtaskboardサービスが作成済みのサーバー専用で、このサンプルのインストール手順ではありません。

```bash
systemctl status taskboard --no-pager
journalctl -u taskboard -n 100 --no-pager
df -h
df -i
free -h
getent hosts example.com
```

コンテナーではdocker compose ps、docker compose logsを使用します。コンテナー内のlocalhostはそのコンテナー自身を指し、他のサービスへはComposeのサービス名を使用します。

<a id="section-4"></a>

## 症状から原因を調べる :id=h-3d5eaf3e0d49

| 症状                 | 最初の確認事項                       | すぐに決めつけてはいけないこと |
| ------------------ | ----------------------------- | --------------- |
| 名前を解決できない          | DNS、ドメインの綴り、ローカルのhosts        | バックエンドコードの不具合   |
| Connection refused | プロセスの生存、待ち受けアドレス、ポート          | 必ずファイアウォールが原因   |
| 接続タイムアウト           | 経路、ファイアウォール、セキュリティグループ、サービス負荷 | 必ずクライアントの問題     |
| HTTP 502           | Nginxから上流への接続と上流ログ            | ブラウザーキャッシュの問題   |
| HTTP 504           | 上流の応答、リクエストの経路、タイムアウト設定       | タイムアウトを延ばせば解決する |
| HTTP 401 / 403     | ログイン状態、権限、CSRF                | ネットワークに接続できない   |
| No space left      | ディスク容量とinode                  | 再起動だけで復旧する      |

外部からのアクセス前にサーバー上で127.0.0.1へアクセスし、プロキシ経由の前にバックエンドへ直接アクセスします。条件は1つずつ変更し、時刻、リクエストパス、ステータスコード、関連ログを残します。

<a id="section-5"></a>

## 権限、環境変数、終了 :id=h-e5efa421086e

プロセスには必要なディレクトリ権限だけを与えます。chmod 777は権限を広げる操作で、デプロイ問題の標準的な解決策ではありません。通常のアプリは一般にrootで実行する必要がありません。

環境変数はプロセスの環境に属し、現在のターミナルを変更しても実行中のサービスは自動変更されません。systemdではサービスのEnvironmentFileを確認し、コンテナーでは設定変更後にデプロイ方法に従って再作成します。

まず正常終了を要求し、接続とタスクの終了を待ちます。強制終了は最後の手段です。シグナル送信前にPIDとコマンドを確認し、曖昧な一致結果をまとめて終了しないでください。

<a id="section-6"></a>

## 検証と開発の早見表 :id=h-139549e559f4

修正後は元のリクエストで再検証し、エラー率、応答時間、ログを確認します。起動成功だけでは、データベースアクセス、認証、書き込みのすべてが正常とは限りません。

ログには個人情報や認証情報が含まれる場合があるため、共有前に調査に必要な部分だけを残します。システム、実行環境、起動方法を記録し、開発マシンの現象がすべてのサーバーで同じだと考えないようにします。

<a id="section-7"></a>

## 公式リファレンス :id=h-f6c7c5602dc7

- [systemdのサービス管理](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html)
- [curlマニュアル](https://curl.se/docs/manpage.html)
