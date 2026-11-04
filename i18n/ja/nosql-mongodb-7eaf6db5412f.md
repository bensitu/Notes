# NoSQLとMongoDBの基礎 :id=h-6a8a85a15c1a

学習目標：文書データベースを選ぶ場面を理解し、モデリング、クエリ、インデックス、原子的な更新、トランザクションの境界を習得します。先にデータベースの基本概念とPythonの開発基盤を学んでください。

**適用範囲：**&#x5B66;習用コンテナーはMongoDB 8.0で、PyMongoドライバーの正確なバージョンはuv.lockを参照してください。ローカルはstandaloneで、単一文書の操作のみを練習します。複数文書のトランザクションには適切なレプリカセットまたはシャーディングクラスターが必要です。

[ドキュメント一覧](README.md) · [一貫したサンプルプロジェクトと実行手順](examples/taskboard/README.md)

**目次**

- [NoSQLは単一のデータベース製品ではない](#section-1)
- [文書のモデリング](#section-2)
- [最小限の実行手順](#section-3)
- [クエリとインデックスの練習](#section-4)
- [単一文書の原子的更新とトランザクション](#section-5)
- [構造の検証、セキュリティ、確認](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## NoSQLは単一のデータベース製品ではない :id=h-80883c4f16a3

| モデル    | 一般的な用途             | 学習の重点                |
| ------ | ------------------ | -------------------- |
| キーバリュー | キャッシュ、キーによる高速な読み取り | キー設計、TTL、容量、整合性      |
| 文書     | 構造が変化する業務オブジェクト    | 文書の境界、インデックス、埋め込み、参照 |
| ワイドカラム | 特定の大規模なキーおよび範囲アクセス | パーティションキーとクエリパターン    |
| グラフ    | 関係の探索              | ノード、エッジ、経路クエリ        |

ここではMongoDBで文書モデルを補い、Redisのドキュメントではキャッシュを扱います。NoSQLは構造がない、トランザクションがない、必ずリレーショナルDBより速いという意味ではありません。

<a id="section-2"></a>

## 文書のモデリング :id=h-45779ca2fc6a

一緒に読むことが多く、同時に原子的な変更が必要なデータは、境界のある1つの文書にまとめます。増え続けるコメント、ログ、履歴を同じ配列へ無制限に詰め込まないでください。

埋め込みは読み取り時の結合を減らしますが、データが重複する場合があります。参照は重複を減らす一方、追加クエリや関連付けの設計が必要です。先にクエリと更新のパターンを列挙して境界を決めます。

MongoDBが保存するのはBSONであり、JSONテキストそのものではありません。ObjectId、日付、Decimal128などの型はJSONと完全には一致しないため、API出力時は明確な変換が必要です。

<a id="section-3"></a>

## 最小限の実行手順 :id=h-ce4bff5e2113

サンプルプロジェクトのディレクトリからMongoDBを起動します。

```powershell
docker compose --env-file .env --profile tools up -d mongo
```

Pythonプロジェクトへ移動し、.envと同じデモアカウントを使用します。

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
$env:MONGO_URI = 'mongodb://notes_admin:local_mongo_change_me@127.0.0.1:27017/?authSource=admin'
uv run --locked python -m task_tools.mongo_demo
```

[完全なコード](examples/taskboard/python/src/task_tools/mongo_demo.py)はexternalIdの一意インデックスを作成し、upsertでデモレコードを初期化してから、versionを条件に1つの文書を更新します。デモは初期化用管理者で接続しますが、本番では必要なDBのみにアクセスできるアプリ用アカウントを作成します。

<a id="section-4"></a>

## クエリとインデックスの練習 :id=h-610dbc8a1cf6

次はmongoshの抜粋で、先に同じインスタンスへ接続し、練習用DBを選択する必要があります。

```javascript
const notesDb = db.getSiblingDB('notes_demo');
notesDb.tasks.createIndex({ externalId: 1 }, { unique: true });
notesDb.tasks.find({ done: true }, { title: 1, version: 1 }).sort({ _id: 1 }).limit(20);
notesDb.tasks.find({ externalId: 'notes-demo-1' }).explain('executionStats');
```

クエリ条件と実行計画を照合して複合インデックスを決めます。インデックスは一部の読み取りを速めますが、書き込みと容量のコストを増やします。TTLインデックスの削除はバックグラウンドで行われるため、秒単位で正確な業務タイマーにはできません。

一意インデックス作成前に重複データがあると作成に失敗する場合があります。先に重複の原因と修復方法を確認し、そのままDBを削除して作り直さないでください。

<a id="section-5"></a>

## 単一文書の原子的更新とトランザクション :id=h-8565936668a2

バージョン条件付きの更新が重要です。

```python
result = collection.update_one(
    {"_id": document_id, "version": expected_version},
    {"$set": {"done": True}, "$inc": {"version": 1}},
)
```

これはメソッドの抜粋で、collection、document_id、expected_versionは呼び出し元のコンテキストから渡されます。matched_countが0ならそのバージョンに一致しなかったことを示し、不存在と競合変更をさらに区別する必要があります。

単一文書の原子性は、複数文書、Redis、外部APIも一緒にコミットするという意味ではありません。複数文書のトランザクションにはデプロイ形態、読み書きの保証レベル、再試行、コストも関係し、このstandaloneのデモにそのまま適用できません。

<a id="section-6"></a>

## 構造の検証、セキュリティ、確認 :id=h-65c7f3f5127f

文書DBでもフィールドの取り決め、バージョンの進化、必要なDBのJSON Schema検証が必要です。クライアントからの辞書全体をそのままMongoDBのクエリ条件や更新操作にせず、明示したフィールドと型だけを許可します。

練習では、繰り返し実行しても同じexternalIdの2件目が作られないこと、同じ旧versionでの連続更新は最初の1回だけ成功することを確認します。実行計画を調べ、サービス切断時にクライアントが有限時間内に失敗することも検証します。

| よくある誤解                 | 正しい理解の範囲                       |
| ---------------------- | ------------------------------ |
| 柔軟な構造なら移行は不要           | フィールド名、型、過去データは引き続き変更への対応が必要   |
| 結合しなければ整合性の問題はない       | 重複データの同期と競合は設計が必要              |
| レプリケーションはバックアップ        | 誤削除や誤書き込みも複製される場合がある           |
| 書き込み成功なら絶対に失われない       | 永続化と障害時の保証は構成とwrite concernに依存 |
| MongoDBですべてのSQLテーブルを置換 | 業務クエリ、制約、運用コストで選ぶ              |

実際の利用前に、最小権限、ネットワーク分離、バックアップと復元の練習、代表的なデータでの負荷試験を追加します。ローカルの練習でこれらの作業まで完了したわけではありません。

<a id="section-7"></a>

## 公式リファレンス :id=h-2ef8691d4a19

- [MongoDBの単一文書の原子性](https://www.mongodb.com/docs/manual/tutorial/model-data-for-atomic-operations/)
- [MongoDB トランザクション](https://www.mongodb.com/docs/manual/core/transactions/)
- [PyMongo](https://www.mongodb.com/docs/languages/python/pymongo-driver/current/)
- [MongoDBのデータモデリング](https://www.mongodb.com/docs/manual/data-modeling/)
