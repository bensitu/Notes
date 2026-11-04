# FastAPIのAPI開発：検証、データベース、テスト :id=h-308b44711d34

学習目標：Pythonで検証可能なHTTP APIを提供し、同期データベース、リクエスト検証、アプリのライフサイクルを理解します。

**適用範囲：**&#x4E00;貫したサンプルはPython 3.15、FastAPI、Pydantic、SQLAlchemy 2を使用し、バージョンはuv.lockに記載されています。学習用の独立した実装で、既定ではローカルの8081とSQLiteデータベースを使用し、Javaバックエンドとはデータを共有しません。

[ドキュメント一覧](README.md) · [一貫したサンプルプロジェクトと実行手順](examples/taskboard/README.md)

**目次**

- [プロジェクトでのFastAPIの役割](#section-1)
- [最小限の実行手順](#section-2)
- [データモデルとデータベースセッション](#section-3)
- [同期、非同期、トランザクション](#section-4)
- [テストと検証](#section-5)
- [よくあるエラーと開発の早見表](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## プロジェクトでのFastAPIの役割 :id=h-581c3193450d

ルートがリクエストを受け取り、Pydanticが入出力を記述して検証し、SQLAlchemyがデータベースにアクセスし、UvicornがASGIアプリを実行します。型注釈だけで任意の外部データを自動的に信頼できるようになるわけではなく、明示的な検証境界が必要です。

完全なファイルは[app.py](examples/taskboard/python/src/task_tools/app.py)を参照してください。この例はタスクの作成、読み取り、バージョンを条件とする変更を提供しますが、ログイン、削除、複数ユーザーの分離はありません。保護されたJavaサービスの代わりにそのまま使用することはできません。

<a id="section-2"></a>

## 最小限の実行手順 :id=h-46780e92f314

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
uv run --locked uvicorn task_tools.app:create_app --factory --host 127.0.0.1 --port 8081
```

[http://127.0.0.1:8081/docs](http://127.0.0.1:8081/docs)を開き、対話型ドキュメントでPOST /api/tasksを送信します。

```json
{"title": "Learn FastAPI"}
```

201が返り、応答にはid、done=false、version=0とLocationが含まれるはずです。続いて返されたidでPUTを呼び出します。

```json
{"title": "Learn FastAPI", "done": true, "version": 0}
```

最初の変更でversionは1になり、古いversionを再送すると409になります。空白のタイトルはフレームワーク既定の422になります。フレームワークごとの検証ステータスはAPIの取り決めで明確にし、Javaの400を機械的に当てはめないでください。

<a id="section-3"></a>

## データモデルとデータベースセッション :id=h-d303df0fc2d7

入力モデルは変更を許可するフィールドのみを受け付け、出力モデルはfrom_attributesでORMオブジェクトから読み取ります。タイトルは前後の空白を除去して長さを検証します。Pydanticは既定で型を変換する場合があるため、厳密な型が必要なら明示的な設定とテストが必要です。

各リクエストは依存関係を通じて自身のSessionを取得し、終了時に閉じます。Sessionは任意の並行リクエストで共有できるグローバルオブジェクトではありません。

起動時のライフサイクルで不足するテーブルを作成し、終了時にエンジンを解放します。create_allは既存テーブルの構造を自動変更しません。本番での変更にはAlembicなどのバージョン管理されたマイグレーションを使用し、旧バージョンとの互換性を設計してください。

<a id="section-4"></a>

## 同期、非同期、トランザクション :id=h-7cbc25d3e4a2

この例は同期のSQLAlchemyを使用するため、async def内で直接イベントループをブロックしないよう、ルートには通常のdefを使います。非同期への切り替えには対応する非同期ドライバー、エンジン、セッションが必要で、関数にasyncを付けるだけでは足りません。

更新はidとversionを条件にし、1つの文で旧バージョンの確認とバージョンの加算を行います。更新行がなければロールバックし、さらに404か409かを判断します。

データベースのコミット、外部のHTTPリクエスト、メッセージ送信は、自動的なグローバルトランザクションではありません。システム間の信頼できる通知には、復旧ロジックが明確な設計を使用します。

<a id="section-5"></a>

## テストと検証 :id=h-2056f7dff953

```powershell
uv run --locked pytest tests/test_app.py
```

テストは独立した一時SQLiteファイルを作成し、TestClientのコンテキストマネージャーでアプリのlifespanを実行します。不正なタイトル、作成、更新、競合、不存在を検証し、ローカルのtasks.dbに依存しません。

SQLiteで成功しても、MySQLやPostgreSQLのSQL方言、ロック、性能が同じとは限りません。データベースを変更する前に、対応するドライバーと実際のデータベースのテストを追加します。

<a id="section-6"></a>

## よくあるエラーと開発の早見表 :id=h-32f416a9bb23

| 現象                  | 確認事項                                         |
| ------------------- | -------------------------------------------- |
| task_toolsが見つからない   | uv syncを実行したか、プロジェクトディレクトリからモジュールパスを使っているか確認 |
| アドレスの競合             | Javaは8080、このサンプルは8081を使用                     |
| 既存テーブルに新しいフィールドがない  | create_allはスキーマのマイグレーションを行わない                |
| APIが「非同期」なのに並行性能が低い | イベントループでブロッキングI/Oを実行していないか確認                 |
| 応答オブジェクトにフィールドがない   | 出力モデル、from_attributes、実際のオブジェクトが一致しているか確認    |

ローカルのサンプルはループバックアドレスにバインドします。外部にサービスを提供する前に、認証、認可、レート制限、HTTPS、マイグレーション、ログ、デプロイ時のプロセス管理を追加してください。開発用のホットリロードを正式なリリース方法として扱わないでください。

<a id="section-7"></a>

## 公式リファレンス :id=h-847dd1226518

- [FastAPIチュートリアル](https://fastapi.tiangolo.com/tutorial/)
- [FastAPIの非同期処理の説明](https://fastapi.tiangolo.com/async/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/en/20/orm/quickstart.html)
- [Pydantic](https://docs.pydantic.dev/latest/)
- [Alembic](https://alembic.sqlalchemy.org/en/latest/)
