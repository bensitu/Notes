# DockerとCompose：アプリと依存サービスをまとめて実行する :id=h-e4f798fc855f

学習目標：イメージ、コンテナー、ネットワーク、ボリュームを区別し、複数サービスの練習環境を起動して問題を調査できるようにします。先にプロセス、ポート、環境変数を理解してください。

**適用範囲：**&#x4C;inuxコンテナーを実行できるDocker Engine / Docker DesktopとCompose v2以降が必要です。WindowsではDocker DesktopのWSL2バックエンドを推奨します。イメージタグは学習用の基準で、ComposeとDockerfileでは今回確認したdigestも固定しています。更新時は再検証して更新してください。

[ドキュメント一覧](README.md) · [一貫したサンプルプロジェクトと実行手順](examples/taskboard/README.md)

**目次**

- [4つの基本概念](#section-1)
- [最小限の実行手順](#section-2)
- [ビルドと設定の連携](#section-3)
- [任意のミドルウェア](#section-4)
- [データ、再構築、削除](#section-5)
- [検証と開発の早見表](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## 4つの基本概念 :id=h-313562e45a49

| 概念              | 理解の仕方                      |
| --------------- | -------------------------- |
| イメージ Image      | アプリファイルと実行環境を含むビルド結果       |
| コンテナー Container | イメージから起動した分離されたプロセス        |
| ネットワーク Network  | コンテナー同士が発見して接続する経路         |
| ボリューム Volume    | コンテナーのライフサイクルから独立したデータ保存場所 |

コンテナーは完全な仮想マシンでもデータのバックアップでもありません。コンテナーを削除して再作成すると、永続化されていない場所のデータは失われる場合があります。

<a id="section-2"></a>

## 最小限の実行手順 :id=h-b8e1c57caec2

Dockerがインストールされ、Linuxコンテナーを実行できる前提で、リポジトリのルートから実行します。

```powershell
Set-Location examples/taskboard
Copy-Item .env.example .env
docker compose --env-file .env --profile tools config --quiet
docker compose --env-file .env up -d --build
docker compose ps
docker compose logs --tail 100 backend
```

.envがすでにある場合は再度上書きせず、内容を確認してください。サンプルのパスワードはローカル練習用で、ホストの全ポートは127.0.0.1のみにバインドします。

ブラウザーで[http://127.0.0.1:8088](http://127.0.0.1:8088)を開き、ユーザー名adminと.envのAPP_PASSWORDのパスワードを使用します。初回のイメージ取得、依存関係のダウンロード、データベース作成には時間がかかる場合があります。ログインを再試行する前にバックエンドの正常性を確認してください。

<a id="section-3"></a>

## ビルドと設定の連携 :id=h-ecd6504f5504

[Composeの完全な設定](examples/taskboard/compose.yml)は、既定でMySQL、Javaバックエンド、Nginxフロントエンドを起動します。toolsプロファイルではRedis、RabbitMQ、MongoDBも提供します。

フロントエンドのビルド段階ではNodeを使用し、実行段階では静的ファイルとNginxのみを残します。バックエンドはMavenでビルドし、実行段階ではJREと非rootユーザーを使用します。本番では先にテストを行い、検証済みイメージをリリースしてください。

コンテナー内のDB_URLはmysql:3306を使用し、Windowsホストから練習用データベースへ接続する場合は127.0.0.1:3307を使用します。ポートのマッピングはコンテナー内部の待ち受けポートを変えません。

<a id="section-4"></a>

## 任意のミドルウェア :id=h-4db4c25c93bb

```powershell
docker compose --env-file .env --profile tools up -d redis rabbit mongo
docker compose --env-file .env --profile tools ps
```

これらのサービスは各独立したPython練習用で、JavaのタスクAPIにはまだ接続されていません。起動してもタスクデータが3つのデータベースに同時に保存されるわけではありません。

MySQLのhealthcheckは実際に練習用データベースへ接続し、SELECT 1を実行します。depends_onは宣言された条件を待つだけで、アプリ実行中の接続復旧やタイムアウト処理の代わりにはなりません。

<a id="section-5"></a>

## データ、再構築、削除 :id=h-593c1ee8f005

```powershell
docker compose stop
docker compose start
docker compose down
```

stopは既存のコンテナーを停止し、startは既存のコンテナーを起動します。downはこのプロジェクトのコンテナーとネットワークを削除しますが、既定で名前付きボリュームは保持します。down --volumesは関連ボリュームの練習データを削除するため、不要であることとバックアップを確認してから実行してください。

データベースの初期化環境変数は通常、空のデータディレクトリで初回起動するときだけ有効です。.envのパスワードを変更して既存のボリュームを再起動しても、データベース内のユーザーは自動変更されません。データベースの手順に従って変更してください。

<a id="section-6"></a>

## 検証と開発の早見表 :id=h-da84bbdf79e7

| 問題           | 確認事項                                  |
| ------------ | ------------------------------------- |
| コンテナーが終了する   | logs、終了コード、変数、ファイル権限                  |
| サービス名を解決できない | 同じComposeネットワークか、名前がserviceと一致しているか確認 |
| ホストのポート競合    | マッピングするホスト側ポートを変更し、クライアント設定も合わせる      |
| コード変更が反映されない | startだけでなくbuild / recreateを行ったか確認     |
| データが「消えた」    | プロジェクト名、ボリューム名、接続先アドレスを変えていないか確認      |

ローカルの設定検証にはコンテナーエンジンへの接続は不要です。実際のイメージのビルド、起動、正常性、永続化の検証にはDockerエンジンが必要です。config --quietの成功をデプロイ成功として扱わないでください。

イメージの更新前にタグとdigestを記録し、バックアップと復元の練習を行います。データベースイメージの更新ではデータ形式と対応する更新経路も確認し、新しいデータボリュームを読むために勝手に古いイメージへ戻さないでください。

<a id="section-7"></a>

## 公式リファレンス :id=h-1d0c8734d7cb

- [Compose入門](https://docs.docker.com/compose/)
- [マルチステージビルド](https://docs.docker.com/build/building/multi-stage/)
- [永続ボリューム](https://docs.docker.com/engine/storage/volumes/)
