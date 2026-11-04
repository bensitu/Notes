# データベースのインデックス、トランザクション、マイグレーション :id=h-9bdf5d93ba20

学習目標：「SQLが動く」段階から、クエリを説明でき、並行処理に対応でき、構造を変更でき、データを復旧できる段階へ進みます。先にSQLとJDBCを習得してください。

**適用範囲：**&#x4D;ySQL 8.4 / InnoDBです。サンプルはFlywayのバージョン管理されたマイグレーションを使います。既定のH2は簡単な実行と一部のテスト専用です。

[ドキュメント一覧](README.md) · [一貫したサンプルプロジェクトと実行手順](examples/taskboard/README.md)

**目次**

- [クエリ性能で最初に確認するもの](#section-1)
- [最小限の練習：独立したテーブルを作り実行計画を観察する](#section-2)
- [並行処理：2つの接続で同じ操作をする](#section-3)
- [楽観ロック、再試行、トランザクションの境界](#section-4)
- [Flywayの移行とバックアップからの復元](#section-5)
- [検証と開発の早見表](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## クエリ性能で最初に確認するもの :id=h-e47270ce5043

SQL、パラメーターの形、データ量、実行時間、呼び出し頻度を記録してから、インデックスを追加するか判断します。インデックスは容量と書き込みコストを増やし、多ければよいわけではありません。

実行計画の推定行数は実際の行数とは異なります。小さいテーブルでは全件走査が合理的な場合もあり、ALLが出るだけで必ず悪いクエリだとは判断できません。

<a id="section-2"></a>

## 最小限の練習：独立したテーブルを作り実行計画を観察する :id=h-230e4358098a

自分の練習用DBで実行します。audit_taskはメインプロジェクトのtaskとは別です。

```sql
CREATE TABLE audit_task (
 id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 owner_id BIGINT NOT NULL,
 title VARCHAR(100) NOT NULL,
 done BOOLEAN NOT NULL DEFAULT FALSE,
 version BIGINT NOT NULL DEFAULT 0,
 INDEX ix_owner_done_id (owner_id, done, id)
) ENGINE=InnoDB;

INSERT INTO audit_task (owner_id, title)
VALUES (1, 'Learn indexes'), (1, 'Test transactions'), (2, 'Write docs');

EXPLAIN SELECT id, title FROM audit_task
WHERE owner_id = 1 AND done = FALSE ORDER BY id LIMIT 20;
```

3行だけでは本番性能を評価できません。代表的なデータ分布で比較してください。EXPLAIN ANALYZEは対応する文を実際に実行するため、先に動作とコストを確認します。

複合インデックスは通常、等価条件、範囲条件、並べ替えを中心に設計します。左端の接頭辞は理解の出発点ですが、実際に使われるかは実行計画で確認します。関数、暗黙の型変換、低い選択性などでも計画は変わります。

<a id="section-3"></a>

## 並行処理：2つの接続で同じ操作をする :id=h-7a5d055be550

独立した2つのmysqlセッションで同じ練習用レコードを操作します。まずセッションAで実行します。

```sql
START TRANSACTION;
SELECT id, version FROM audit_task WHERE id = 1 FOR UPDATE;
```

Aのトランザクションが終了する前に、セッションBで実行します。

```sql
UPDATE audit_task SET done = TRUE WHERE id = 1;
```

Bは通常Aの行ロックを待ち、ロック待機設定によってはタイムアウトします。Aに戻ってCOMMITまたはROLLBACKを実行し、Bの結果を観察します。開いたままのトランザクションを忘れないでください。

通常の一貫性読み取りとFOR UPDATEのロック読み取りは異なります。「リピータブルリード」は他のトランザクションによる変更を禁止するものではありません。分離レベル、読み取り方式、インデックスが可視性とロック範囲に影響します。

<a id="section-4"></a>

## 楽観ロック、再試行、トランザクションの境界 :id=h-24eda20fd75b

サンプルのversion条件付き更新は更新行数を確認し、旧バージョンの失敗に409を返します。黙って上書きするのを防ぎますが、2つの業務変更を自動統合はしません。

デッドロックは並行処理で起こり得ます。トランザクションを短くし、ロック順序を統一します。再試行が必要ならトランザクション全体を回数制限付きで再試行し、安全に再試行できる業務操作だけに適用します。

DBのトランザクションはRedis、メッセージキュー、第三者のHTTPリクエストを自動的に対象にしません。信頼できるシステム間通知にはトランザクションアウトボックスなどを検討し、@Transactionalをシステム全体のロールバックと考えないでください。

<a id="section-5"></a>

## Flywayの移行とバックアップからの復元 :id=h-be55ddea06ec

プロジェクトの[V1__create_task.sql](examples/taskboard/backend/src/main/resources/db/migration/V1__create_task.sql)が初期テーブルを作成します。新しい構造変更は新しいV2ファイルに記述し、検証を回避するために適用済み移行を勝手に編集しないでください。

リリースは「互換性を保って拡張、データ移行、最後に旧構造を削除」の順で行います。1回のデプロイですぐ旧フィールドを削除すると、ロールバックした旧アプリが動かなくなる場合があります。

バックアップには復元練習も必要です。独立したインスタンスへ復元し、テーブル数、重要なレコード、アプリの読み書きを確認します。論理バックアップの整合性は、エンジン、トランザクション、DDLの実行状況、バックアップ引数を合わせて判断します。ファイルが存在するだけでは復元できる証明にはなりません。

<a id="section-6"></a>

## 検証と開発の早見表 :id=h-d9559d4f4c68

| 状況                         | 重点                             |
| -------------------------- | ------------------------------ |
| ページングで重複や欠落がある             | 並べ替えの確定性、カーソルの必要性、その間の追加や変更    |
| インデックスがあるのに使われない           | パラメーター型、選択性、関数、統計、実際の実行計画      |
| トランザクションのロールバック後も外部の副作用が残る | 副作用がDBの外で起きていないか確認             |
| マイグレーションの検証に失敗             | 適用済みファイルの編集や接続先DBの誤りを確認        |
| データボリュームを「復元」しても空          | 正しいインスタンスへのマウントとバックアップ、復元記録を確認 |

本番前に、実際のMySQLでDB作成と移行、繰り返し起動、競合更新、失敗時のロールバックを最低限テストします。H2での成功をMySQLの並行処理検証の代わりにしないでください。

<a id="section-7"></a>

## 公式リファレンス :id=h-ea078aaeaf6e

- [MySQL EXPLAIN](https://dev.mysql.com/doc/refman/8.4/en/explain.html)
- [InnoDBのロック](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html)
- [Flywayのマイグレーション](https://documentation.red-gate.com/flyway/flyway-concepts/migrations)
