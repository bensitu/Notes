# 現代のSpring Bootプロジェクトの実践 :id=h-f08e280889d5

学習目標：起動クラスから、検証、トランザクション、エラー応答、セキュリティ制御を備えたAPIへ進みます。先にJava、Maven、HTTP、JDBCを習得してください。

**適用範囲：**&#x30B5;ンプルはSpring Boot 4.1.2に固定しています。Javaのソースは17向けにコンパイルし、JDK 25でも実行できます。既定のH2インメモリDBは入門用で、mysqlプロファイルはMySQL 8.4を使用します。

[ドキュメント一覧](README.md) · [一貫したサンプルプロジェクトと実行手順](examples/taskboard/README.md)

**目次**

- [リクエストがDBに届くまで](#section-1)
- [最小限の実行手順](#section-2)
- [APIの取り決め](#section-3)
- [検証、トランザクション、競合変更](#section-4)
- [設定と起動方法](#section-5)
- [検証、よくあるエラー、早見表](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## リクエストがDBに届くまで :id=h-d21afb58f137

ブラウザー → Spring Securityフィルター → Controllerのパラメーターバインドと検証 → JDBC操作 → DB → JSON応答。

初心者の参照先移動を減らすため、この例では短いトランザクションの業務処理をControllerに記述します。複雑になったらServiceへ抽出し、トランザクションの境界と依存方向を明確にします。すべての業務をControllerに書くという意味ではありません。

完全なファイルは[pom.xml](examples/taskboard/backend/pom.xml)、[TaskController.java](examples/taskboard/backend/src/main/java/example/tasks/TaskController.java)を参照してください。

<a id="section-2"></a>

## 最小限の実行手順 :id=h-78aa98e3547f

先にJDKとMavenをインストールし、リポジトリのルートからバックエンドへ移動します。

```powershell
Set-Location examples/taskboard/backend
$env:APP_PASSWORD = 'local-demo-change-me'
mvn -B -ntp verify
mvn spring-boot:run
```

別のターミナルからアクセスします。

```powershell
curl.exe -i http://127.0.0.1:8080/actuator/health
```

HTTP 200とUPを想定します。タスクAPIはログインが必要で、サンプルのフロントエンドからログインして操作します。既定のH2のデータはプロセス終了で消えるため、練習向けであり本番ストレージの設定ではありません。

<a id="section-3"></a>

## APIの取り決め :id=h-3bd99be3972e

| リクエスト                  | リクエスト本文または結果                     | 期待する結果                 |
| ---------------------- | -------------------------------- | ---------------------- |
| GET /api/tasks         | 最新100件、idの降順                     | 200                    |
| POST /api/tasks        | title                            | 201、Locationは新しいタスクを指す |
| GET /api/tasks/{id}    | 単一タスク                            | 200または404              |
| PUT /api/tasks/{id}    | title、done、version               | 200または409              |
| DELETE /api/tasks/{id} | 削除は管理者のみ                         | 204または404              |
| GET /api/csrf          | headerName、token                 | ログイン前後にそれぞれ取得          |
| POST /api/login        | URLでエンコードしたフォームusername、password | 204または401              |

titleは空白のみではなく100文字以下で、Updateのdoneとversionは必須です。作成と変更は異なるDTOを使用し、DBフィールドをすべてそのままクライアントに公開しないようにします。

<a id="section-4"></a>

## 検証、トランザクション、競合変更 :id=h-bbf896ff9404

@NotBlankと@Sizeはバインド後のフィールドを確認し、@Validはリクエスト本文の検証を起動します。フロントエンドの検証はフィードバック用で、サーバーの検証やDB制約の代わりにはなりません。

バージョン更新の中心となるSQLは実際のソースからの抜粋です。

```sql
UPDATE task
SET title = :title, done = :done, version = version + 1
WHERE id = :id AND version = :version;
```

これはJdbcClientの名前付きパラメーターの抜粋で、mysqlクライアントへ直接貼り付ける文ではありません。同じ旧バージョンを使う2つのリクエストのうち、先に成功した方だけが1行を更新します。他方は409を受け、再読み取り後にユーザーが判断します。

@TransactionalはSpringのプロキシ経由で呼び出して初めて有効です。同一オブジェクト内の自己呼び出し、非同期スレッド、別サービスへのHTTPリクエストは、このローカルトランザクションを自動共有しません。

<a id="section-5"></a>

## 設定と起動方法 :id=h-709ae59bc9c0

[application.yml](examples/taskboard/backend/src/main/resources/application.yml)はローカルの既定値で、[application-mysql.yml](examples/taskboard/backend/src/main/resources/application-mysql.yml)は環境変数から接続情報を取得します。

MySQL設定の起動時には、SPRING_PROFILES_ACTIVE=mysql、DB_URL、DB_USER、DB_PASSWORDを同時に指定します。ポートやパスワードの環境変数は、実際にJVMを起動するプロセスの環境へ設定します。

本番はテスト済みのJARまたはイメージで起動し、開発コマンドでその場で依存関係をダウンロードしません。必要な管理エンドポイントだけを公開し、設定全体や詳細な正常性情報は公開しません。

<a id="section-6"></a>

## 検証、よくあるエラー、早見表 :id=h-f7e0fb0be1eb

未ログイン、CSRF不足、不正入力、更新競合、削除権限、リソース不存在をmvn verifyで検証します。H2のテスト後もMySQLで移行、ロック、方言を確認し、両DBを完全に同等と考えないでください。

| 問題                    | 確認事項                                       |
| --------------------- | ------------------------------------------ |
| 起動時にテーブルが見つからない       | Flywayの依存関係、移行ファイルの場所、接続先DB                |
| 作成に失敗する               | 検証応答、データ長、DB制約                             |
| 旧バージョンの書き込みが409になる    | 通常の競合処理であり、無条件上書きに変更しない                    |
| トランザクションがロールバックされない   | 例外の外部伝播、プロキシ経由、同一データソースかを確認                |
| クライアントに不明なエラーしか表示されない | HTTPステータスを保持し、ProblemDetailを業務成功と扱っていないか確認 |

この例にはマルチテナント、ユーザーの自己登録、完全なページング、アップロードはありません。拡張ごとに境界とテストを追加し、実装済みであるかのように示さないでください。

<a id="section-7"></a>

## 公式リファレンス :id=h-d3852c4b31f3

- [Spring Bootのシステム要件](https://docs.spring.io/spring-boot/system-requirements.html)
- [Spring JDBC](https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html)
- [パラメーターの検証](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html)
