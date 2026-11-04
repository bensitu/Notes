# MySQL データベース :id=h-aeb5ddfd0fb2

データベースとテーブルの作成、列の型、追加・更新・削除を学び、開発時に構文とトランザクションへの影響を確認します。

**前提知識とバージョン：** MySQL 8.x を対象に、InnoDB でトランザクションを練習します。過去の 5.7 の例は別途説明します。まず自分の練習用データベースを作成してください。employees などのクエリ例には対応するデータセットが必要です。

**サンプルの使い方：** 全ファイルと実行手順を明示したものを除き、コードブロックは節ごとの独立した断片です。省略部分や仮の名前を補ってください。誤りと示した行は問題の説明用です。同じ節の代替実装を混ぜないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://dev.mysql.com/doc/refman/8.4/en/)

**目次**

- [コメント](#section-1)
- [命名規則](#section-2)
- [データのインポートコマンド](#section-3)
- [データベースの基本操作](#section-4)
- [基礎知識](#section-5)
- [データベースの作成と管理](#section-6)
- [テーブルの基本操作](#section-7)
- [テーブルの作成と管理](#section-8)
- [テーブル内のデータの基本操作](#section-9)
- [生成列（MySQL 5.7 以降に対応）](#section-10)
- [テーブルの発展的な話題](#section-11)
- [その他のコマンド](#section-12)

<a id="section-1"></a>

## コメント :id=h-cd57bc57c579

1 行コメント：# Comment text（MySQL 独自の方式）
1 行コメント：-- Comment text（-- の後ろには空白が必要）
複数行コメント：/\* Comment text \*/

<a id="section-2"></a>

## 命名規則 :id=h-81458ffb7afa

- データベース名、テーブル名、列名は通常最大 64 文字です。オブジェクトごとに制限が異なるため、ほかのデータベースの規則を MySQL に当てはめないでください。

- 環境をまたいで共同作業しやすいよう、小文字の英字、数字、アンダースコアを勧めます。これは命名規約であり、MySQL が許可する文字の全一覧ではありません。

- データベース名、テーブル名、列名などのオブジェクト名に空白を含めないでください。

- 同じ MySQL 内ではデータベース名、同じデータベース内ではテーブル名、同じテーブル内では列名を重複させられません。

- 列名が予約語、システム名、よく使う関数名と衝突しないようにします。使用する場合は SQL 文でバッククォート（\`）で囲んでください。

- 列名と型の一貫性を保ちます。列の命名とデータ型の指定では、同じデータを一方のテーブルで整数、別のテーブルで文字列にしないでください。

- テーブル名と列名には小文字の英字や数字を使います。キャメルケースを避け、数字で始めず、2 つのアンダースコアの間を数字だけにしないでください。

  > データベース名とテーブル名の大文字・小文字の扱いは、OS と lower_case_table_names によります。列名は通常区別しません。小文字への統一は移行の問題を減らしますが、大文字の名前が構文上不正という意味ではありません。
  >
  > 良い例：aliyun_admin、rdc_config、level3_name
  >
  > 悪い例：AliyunAdmin、rdcConfig、level_3_name

例：

```sql
# See note 1 below.
show databases;
SHOW DATABASES;
# See note 2 below.
# See note 3 below.
create table student_info(...);
# See note 4 below.
CREATE TABLE `order` (id INT);
select id as "编号",name AS "姓名" from t_stu; # See note 5 below.
select id as 编号,name AS 姓名 from t_stu; # See note 6 below.
select id as 编 号,name as 姓 名 from t_stu; # See note 7 below.
```

例の説明：

1. 次の 2 文は同じ意味で、大文字と小文字を区別しません。
2. テーブルを作成する
3. create table student info(...); # Invalid table name: contains a space
4. order はシステムのキーワードや関数名などの定義済み識別子と重なるため、バッククォートで囲みます。
5. 別名を付けるとき、AS は省略できます。
6. 列の別名に空白がなければ、二重引用符を省略できます。
7. 誤り：列の別名に空白がある場合、二重引用符を省略できません。

<a id="section-3"></a>

## データのインポートコマンド :id=h-b1be3c2bb395

コマンドラインクライアントで MySQL にログインし、source コマンドでインポートします。

```mysql
mysql> source d:\mysqldb.sql
```

<a id="section-4"></a>

# データベースの基本操作 :id=h-15ced04ab640

<a id="section-5"></a>

## 基礎知識 :id=h-b21704bece99

### データ型 :id=h-bb7ea6eeca19

| 型        | 型の例                                                                                                 |
| -------- | --------------------------------------------------------------------------------------------------- |
| 整数型      | TINYINT、SMALLINT、MEDIUMINT、INT（または INTEGER）、BIGINT                                                  |
| 浮動小数点型   | FLOAT、DOUBLE                                                                                        |
| 固定小数点型   | DECIMAL                                                                                             |
| ビット型     | BIT                                                                                                 |
| 日付と時刻の型  | YEAR、TIME、DATE、DATETIME、TIMESTAMP                                                                   |
| 文字列型     | CHAR、VARCHAR、TINYTEXT、TEXT、MEDIUMTEXT、LONGTEXT                                                      |
| 列挙型      | ENUM                                                                                                |
| 集合型      | SET                                                                                                 |
| バイナリ文字列型 | BINARY、VARBINARY、TINYBLOB、BLOB、MEDIUMBLOB、LONGBLOB                                                  |
| JSON 型   | JSON オブジェクト、JSON 配列                                                                                 |
| 空間データ型   | 単一値：GEOMETRY、POINT、LINESTRING、POLYGON。集合：MULTIPOINT、MULTILINESTRING、MULTIPOLYGON、GEOMETRYCOLLECTION |

よく使う型をいくつか紹介します。

| データ型                    | 意味と制限                                                              |
| ----------------------- | ------------------------------------------------------------------ |
| INT                     | 符号付きの範囲は -2^31 から 2^31-1、4 バイトです。表示幅は最大桁数ではありません。                  |
| BIGINT                  | 符号付きで 8 バイトです。UNSIGNED は正の範囲を広げますが、負の値を許可しません。                     |
| CHAR(n)                 | 固定長文字列型です。n は文字数で、最大 255 です。                                       |
| VARCHAR(n)              | 可変長文字列型です。n は文字数で、実際の容量は文字セットや行サイズの制限にも左右されます。                     |
| FLOAT / DOUBLE          | 近似の浮動小数点数で、通常は 4 / 8 バイトです。正確さが必要な金額計算には適しません。                     |
| DECIMAL(M,D)            | 正確な小数です。M は総桁数、D は小数部の桁数で、最大値は M が 65、D が 30 です。保存サイズは両部分の桁数によります。 |
| DATE                    | 日付です。一般的な入力形式は 'YYYY-MM-DD' です。                                    |
| DATETIME                | 日付と時刻。セッションのタイムゾーンによる自動変換は行わない                                     |
| TIMESTAMP               | 日付と時刻。保存・取得にセッションのタイムゾーンが関わり、範囲は DATETIME と異なる                     |
| BLOB / TEXT             | 通常の型は最大 65,535 バイトで、それぞれバイナリとテキストに使います。                            |
| MEDIUMBLOB / MEDIUMTEXT | 最大 16,777,215 バイト                                                  |
| LONGBLOB / LONGTEXT     | 理論上は最大 4,294,967,295 バイトですが、実際にはクライアント、パケット、ストレージの制限も受けます。         |

従来の FLOAT(M,D)、DOUBLE(M,D) は非推奨です。金額には例えば DECIMAL(10,2) を使え、総計 10 桁のうち 2 桁が小数部です。整数部に 10 桁使える意味ではありません。

参考：[MySQL のデータ型とストレージ要件](https://dev.mysql.com/doc/refman/8.0/en/storage-requirements.html)。

<a id="section-6"></a>

## データベースの作成と管理 :id=h-4ea9e97d7442

### データベースを作成する :id=h-f445aab59866

- 方法 1：データベースを作成する

```sql
CREATE DATABASE 数据库名;
```

- 方法 2：文字セットを指定してデータベースを作成する

```sql
CREATE DATABASE 数据库名 CHARACTER SET 字符集;
```

- 方法 3：既存か確認し、存在しなければ作成する（推奨）

```sql
CREATE DATABASE IF NOT EXISTS 数据库名;
```

- MySQL にそのデータベースがあれば、作成文を無視して新規作成しません。

> DATABASE は直接名前を変更できません。一部の GUI ツールは、新しいデータベースを作り、全テーブルをコピーして古いデータベースを削除することで実現します。

### データベースの確認と使用 :id=h-e1b94c588595

- 現在の全データベースを表示する

```sql
SHOW DATABASES; # See note 1 below.
```

例の説明：

1. S が付き、複数のデータベースを表します。

> - information_schema は MySQL 組み込みのデータベースで、MySQL サーバーのデータベース名、テーブル名、列名、アクセス権、データファイルのディレクトリ、システム用ディレクトリなどの情報を保存します。
> - performance_schema は MySQL 組み込みのデータベースで、MySQL の各種性能指標を監視できます。
> - sys は MySQL 組み込みのデータベースです。MySQL サーバーの性能指標を分かりやすく示し、管理者や開発者が MySQL の性能を監視するのに役立ちます。
> - mysql データベースは、データディレクトリ、現在の文字セット、制約チェック情報など、MySQL サーバーの実行に必要なシステム情報を保存します。

- 現在使用中のデータベースを表示する

```sql
SELECT DATABASE();	# See note 1 below.
```

例の説明：

1. MySQL のグローバル関数を使用する

- 指定したデータベースの全テーブルを表示する

```sql
SHOW TABLES FROM 数据库名;
```

- データベースの作成情報を表示する

```sql
SHOW CREATE DATABASE 数据库名;
# See note 1 below.
SHOW CREATE DATABASE 数据库名\G
```

例の説明：

1. または：

- データベースの使用・切り替え

```sql
USE 数据库名;
```

> テーブルやデータを操作する前に対象のデータベースを指定してください。指定しない場合、すべてのオブジェクトに「データベース名.」を付ける必要があります。

### データベースを変更する :id=h-bfdfdc0ac2fb

- データベースの文字セットを変更する

```sql
ALTER DATABASE 数据库名 CHARACTER SET 字符集;	# See note 1 below.
```

例の説明：

1. 例えば gbk、utf8 など

### データベースを削除する :id=h-431a5d26916b

- 方法 1：指定したデータベースを削除する

```sql
DROP DATABASE 数据库名;
```

- 方法 2：指定したデータベースを削除する（推奨）

```sql
DROP DATABASE IF EXISTS 数据库名;
```

<a id="section-7"></a>

# テーブルの基本操作 :id=h-334ae323778e

<a id="section-8"></a>

## テーブルの作成と管理 :id=h-7a0229b08e6e

### 新しいテーブルを作成する :id=h-88cc829db8a1

構文：

```sql
CREATE TABLE 表名称(字段名 数据类型, 字段名 数据类型);

例：
CREATE TABLE peoples(
id int,      # See note 1 below.
name varchar(20), 	# See note 2 below.
sex varchar(1)
);
```

例の説明：

1. MySQL 8.x では、INT の表示幅の指定は推奨されません。
2. 名前は 20 文字以内

次の方法を推奨します。

```sql
CREATE TABLE [IF NOT EXISTS] 表名(
字段1, 数据类型 [约束条件] [默认值],
字段2, 数据类型 [约束条件] [默认值],
字段3, 数据类型 [约束条件] [默认值],
……
[表约束条件]
);
```

> IF NOT EXISTS を付けると、現在のデータベースに対象テーブルがない場合だけ作成します。すでにあれば、作成文を無視して新規作成しません。

MySQL が id を int(11) に設定する場合、11 は表示幅を表し、デフォルトの表示幅も 11 です。テーブル作成時に表示幅を指定することもできます。MySQL 8.x では INT の表示幅指定は推奨されず、将来のバージョンで構文が削除される可能性があります。

### テーブルの作成文を表示する :id=h-e07100eb4d75

構文：

```sql
SHOW CREATE TABLE 表名;
```

### テーブル構造を表示する :id=h-e3a269dbd059

DESCRIBE または DESC コマンドでテーブル構造を表示します。

```sql
DESCRIBE employees;
或
DESC employees;
```

各項目の意味は次のとおりです。
Field：列名。
Type：列の型。ここでは barcode、goodsname は文字列、price は整数です。
Null：NULL を保存できるかどうか。
Key：インデックスの情報。PRI は主キーの一部、UNI は UNIQUE インデックスの一部、MUL は同じ値が複数回現れることを許す列を表します。
Default：デフォルト値の有無とその値。
Extra：AUTO_INCREMENT など、その列の付加情報。

### テーブルを変更する :id=h-2c0ba8104f59

#### 列を追加する :id=h-95123f7d2c72

**ALTER ... ADD ...** の構文は次のとおりです。

```sql
ALTER TABLE 表名 ADD [COLUMN] 字段名 字段类型 [FIRST|AFTER 字段名];
```

例：

```sql
ALTER TABLE dept80 ADD job_id varchar(15);
```

#### 列を変更する :id=h-4f4dbc924a37

**ALTER ... MODIFY ...** を使います。

- 列のデータ型、長さ、デフォルト値、位置を変更できます。
- データ型、長さ、デフォルト値、位置を変更する構文は次のとおりです。

```sql
ALTER TABLE 表名 MODIFY 字段名1 字段类型 [DEFAULT 默认值][FIRST|AFTER 字段名2];
```

例：

```sql
ALTER TABLE dept80 MODIFY last_name VARCHAR(30);
```

注意：この方法では列名を変更できません。

#### 列名を変更する :id=h-c3a85dff78e4

**CHANGE** old_column new_column dataType で列名を変更します。構文は次のとおりです。

```sql
ALTER TABLE 表名 CHANGE 列名 新列名 新数据类型;
```

例：

```sql
ALTER TABLE dept80 CHANGE department_name dept_name varchar(15);
```

#### 列を削除する :id=h-c3a6210eae22

**ALTER ... DROP ...** で列を削除する構文は次のとおりです。

```sql
ALTER TABLE 表名 DROP 字段名
```

例：

```sql
ALTER TABLE dept80 DROP COLUMN job_id;
```

### テーブルを削除する :id=h-80576b5e623b

- MySQL では、ほかのテーブルとの関連がなければ、そのテーブルを直接削除できます。
- データと構造の両方を削除します。
- 通常の DROP TABLE は現在のセッションのトランザクションを暗黙にコミットします。ほかの接続の関連トランザクションをすべてコミットする意味ではありません。一時テーブルは規則が異なります。
- 関連するインデックスもすべて削除します。

構文：

```sql
DROP TABLE 表名称;
```

推奨する書き方：

```sql
DROP TABLE IF EXISTS 表名1 [, 表名2, …, 表名n];
```

> IF EXISTS は、現在のデータベースに対象テーブルがあれば削除し、なければ削除文を無視して操作しません。

### テーブルを空にする :id=h-f79a27946aba

TRUNCATE TABLE 文：

- テーブル内の全データを削除する
- テーブルの保存領域を解放する

```sql
TRUNCATE TABLE detail_dept;
```

**通常の TRUNCATE TABLE は暗黙にコミットし、通常の DML のようにロールバックできません。DELETE はトランザクション対応のテーブルで、未コミットの場合だけロールバックできます。**

### テーブル名を変更する :id=h-bac3b7acd5ef

- 方法 1：RENAME を使う

```sql
RENAME TABLE emp TO myemp;
```

- 方法 2：

```sql
ALTER table dept
RENAME [TO] detail_dept;	-- See note 1 below.
```

例の説明：

1. \[TO] は省略できます。

<a id="section-9"></a>

## テーブル内のデータの基本操作 :id=h-3da510a5dab0

### データを追加する :id=h-59caba76d8d4

#### 1：VALUES で追加する :id=h-49cac083daee

VALUES の後ろには 1 組以上の値を書けます。1 組で 1 行を挿入し、複数の組はカンマで区切ります。

**ケース 1：全列のデータをデフォルトの順序で挿入する**

```sql
INSERT INTO 目标表名 VALUES (value1,value2,....);
```

例：

```sql
INSERT INTO peoples VALUES(1, 'Tom','m');

INSERT INTO peoples VALUES(2, 'Mary','f');
```

中国語を正しく保存できるかは、接続、データベース、列の文字セットによります。MySQL 5.7 自体が中国語に非対応なわけではありません。通常は utf8mb4 を使い、クライアントの文字コードも一致させます。

**各列の値を、テーブルで定義した列と同じ順序ですべて指定する必要があります。**

**ケース 2：指定した列にデータを挿入する**

```sql
INSERT INTO 目标表名(column1 [, column2, …, columnn])
VALUES (value1 [,value2, …, valuen]);
```

指定した列への挿入では、INSERT 文で一部の列だけに値を渡し、ほかの列にはテーブル定義のデフォルト値を使います。

INSERT 句では列名を任意の順序で並べられますが、VALUES の value1,…,valuen は column1,…,columnn と 1 対 1 で対応する必要があります。型が適合しなければ挿入できず、MySQL がエラーを返します。

**ケース 3：複数のレコードを一括挿入する**

INSERT 文は、カンマ区切りの複数の値リストを指定して、複数レコードを同時に挿入できます。基本構文は次のとおりです。

```sql
INSERT INTO 目标表名
VALUES
(value1 [,value2, …, valuen]),
(value1 [,value2, …, valuen]),
……
(value1 [,value2, …, valuen]);
```

または

```sql
INSERT INTO 目标表名(column1 [, column2, …, columnn])
VALUES
(value1 [,value2, …, valuen]),
(value1 [,value2, …, valuen]),
……
(value1 [,value2, …, valuen]);
```

複数行を挿入する 1 つの INSERT は、単一行の INSERT を複数実行することに相当しますが、複数行の INSERT の方が効率的です。MySQL では 1 つの INSERT で複数行を挿入する方が複数の INSERT より速いため、一括挿入には 1 つの INSERT を使うとよいでしょう。

#### 2：クエリ結果をテーブルに挿入する :id=h-1c34b607d041

INSERT では SELECT の結果も挿入できます。各レコードの値を個別入力せず、INSERT と SELECT を組み合わせ、1 つ以上のテーブルから複数行を素早く挿入できます。

基本構文：

```sql
INSERT INTO 目标表名
(tar_column1 [, tar_column2, …, tar_columnn])
SELECT
src_column1 [, src_column2, …, src_columnn]
FROM 源表名
[WHERE condition]
```

- INSERT 文にサブクエリを追加します。
- VALUES 句は不要です。
- サブクエリの値リストは INSERT 句の列名と対応する必要があります。

#### 3：挿入または置換 :id=h-44f963078284

新しいレコードを挿入（INSERT）し、既存なら元のレコードを **先に削除** して挿入したい場合、`REPLACE` ���使えます。事前に検索し、削除してから挿入するか判断する必要がありません。

```sql
REPLACE INTO 目标表名
(column1, column2, column3...)
VALUES
(value1, value2, value3...);
```

主キーや UNIQUE インデックスに衝突しなければ、`REPLACE` は新規挿入します。衝突した場合、主キーまたは UNIQUE インデックスが衝突するレコードを削除してから新しい行を挿入します。

#### 4：挿入または更新 :id=h-ec27b57ad315

新しいレコードを挿入（INSERT）し、既存なら **更新** したい場合、`INSERT INTO ... ON DUPLICATE KEY UPDATE ...` を使います。

```sql
INSERT INTO 目标表名
(column1, column2, column3...)
VALUES
(value1, value2, value3...)
ON DUPLICATE KEY UPDATE column3=value3, column4=value4, column5=value5;
```

主キーや UNIQUE インデックスに衝突しなければ、`INSERT ` は挿入します。衝突した場合は主キーまたは UNIQUE インデックスが衝突するレコードを更新し、更新対象の列は `UPDATE` で指定します。

#### 5：挿入または無視 :id=h-b1680e9fa550

新しいレコードを挿入（INSERT）し、既存なら何もせず無視したい場合、`INSERT IGNORE INTO ...` を使います。

```sql
INSERT IGNORE INTO 目标表名
(column1, column2, column3...)
VALUES
(value1, value2, value3...);
```

主キーや UNIQUE インデックスに衝突しなければ、`INSERT` は挿入します。主キーや UNIQUE の衝突時は通常その行を無視します。IGNORE はほかの一部のエラーも警告に変えるため、「既存ならスキップ」だけの機能と考えてはいけません。

### データの更新 :id=h-6cb20d470a80

UPDATE 文でデータを更新します。構文は次のとおりです。

```sql
UPDATE 目标表名
SET column1=value1, column2=value2, … , column=valuen
WHERE condition
```

例えば：

```sql
UPDATE t_employee
SET name = 'Tom'
WHERE id = 00001;
```

- 複数のデータを一度に更新できます。
- データをロールバックするには、DML の前に set autocommit = FALSE; を設定する必要があります。

WHERE 句で更新対象を指定します。WHERE を省略すると、テーブルの全データを更新します。

### データを削除する :id=h-0992366a99e7

DELETE 文でテーブルのデータを削除します。構文は次のとおりです。

```sql
DELETE FROM 目标表名 [WHERE <condition>];
```

対象テーブル名は削除するテーブルを指定します。「\[WHERE ]」は任意の削除条件です。WHERE 句がなければ、DELETE は全レコードを削除します。

### データを検索する :id=h-579d716ba32f

#### 基本的なクエリ :id=h-7c09abecd8ce

構文：**SELECT … FROM ...**

```sql
SELECT 标识选择哪些列
FROM 标识从哪个表中选择
```

全列を選択する：

```sql
SELECT *
FROM departments;
```

特定の列を選択する：

```sql
SELECT department_id, location_id
FROM departments;
```

MySQL の SQL 文は大文字と小文字を区別しないため、SELECT と select は同じ働きをします。

#### クエリの絞り込み :id=h-11e8b5797810

構文：

```sql
SELECT 字段1,字段2
FROM 表名
WHERE 过滤条件
```

WHERE 句で条件に合わない行を除外します。WHERE 句は FROM 句の直後に置きます。

> WHERE は FROM の直後に置く必要があります。

例：

```sql
# 1
SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90;

# 2
SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90 ORDER BY employee_id DESC;
```

#### 列の別名 :id=h-585fa328310e

**... AS name**

- 列名を変更する
- 計算を扱いやすくする
- 列名の直後に別名を書き、間に AS を入れることもできます。別名を二重引用符で囲むと、空白や特殊文字を含め、大文字と小文字を区別できます。
- AS は省略できます。
- 別名は短く、意味の分かるものを勧めます。

例

```sql
SELECT last_name AS name, commission_pct comm
FROM employees;

SELECT employee_id,last_name,department_id
FROM employees;

SELECT employee_id id ,last_name l_nm ,department_id AS dept_id
FROM employees;

SELECT last_name "Name", salary*12 "Annual Salary"
FROM employees;
```

#### 重複行を除く :id=h-0f2589414df0

デフォルトでは重複を含む全行を返します。SELECT 文で DISTINCT を使うと重複行を除けます。

```sql
SELECT DISTINCT department_id
FROM employees;
```

対象：

```sql
SELECT DISTINCT department_id, salary
FROM employees;
```

> 次の 2 点に注意してください。
>
> 1. DISTINCT はすべての列名の前に置きます。SELECT salary, DISTINCT department_id FROM employees と書くとエラーになります。
> 2. DISTINCT は選択した列の組み合わせ全体で重複を除きます。例えば（department_id, salary）の両方が同じ行だけをまとめます。結果件数はデータによって決まり、部署数とは限りません。異なる部署を数えたい場合は DISTINCT department_id だけを選びます。

#### NULL を含む演算 :id=h-e60638450768

NULL は欠けている、または不明な値を表します。通常の算術演算や比較は一般に NULL になります。ただし IS NULL、NULL 安全等価演算子 <=>、COALESCE、一部の論理演算には別の規則があり、すべての演算が NULL を返すわけではありません。

```sql
SELECT employee_id, salary, commission_pct,
12 * salary * (1 + commission_pct) "annual_sal"
FROM employees;
```

MySQL では NULL と空文字列は異なります。空文字列の長さは 0 ですが、LENGTH(NULL) は NULL です。また MySQL では NULL も領域を使います。null は 0、' '、'null' とも異なります。

#### バッククォート :id=h-ba45bed8d6b8

**一対のバッククォート（\`）で囲みます。**

誤り：

```sql
SELECT * FROM ORDER;
```

正しい例：

```sql
SELECT * FROM `ORDER`;
```

結論：
列名やテーブル名が予約語、システム名、一般的な関数名と衝突しないようにします。同じ名前を使う場合は、SQL 文で一対のバッククォート（\`\`）で囲んでください。

#### 定数を検索する :id=h-210d96bdef0d

SELECT は定数も検索できます。つまり SELECT の結果に固定値の列を追加します。値はテーブルから動的に取得せず、自分で指定します。
なぜ定数を検索するのでしょうか。
SQL の SELECT はこの機能を提供します。単一テーブルの検索では通常不要ですが、複数のデータ元を統合するとき、定数列をテーブルの目印にできます。例えば employees の社員名を検索し、**固定の corporation 列を追加** して、その値を「尚硅谷」にする場合は次のように書きます。

```sql
SELECT 'Atguigu' as corporation, last_name
FROM employees;
```

<a id="section-10"></a>

## 生成列（MySQL 5.7 以降に対応） :id=h-2542a404e7ad

MySQL 8.0 では、CREATE TABLE と ALTER TABLE の両方で計算列を追加できます。

例：tb1 に id、a、b、c を定義し、c を a+b の計算列にします。まず次の文でテストテーブル tb1 を作成します。

```sql
CREATE TABLE tb1(
id INT,
a INT, b INT,
c INT GENERATED ALWAYS AS (a + b) VIRTUAL );
```

次の文でサンプルデータを挿入します。

```sql
INSERT INTO tb1(a,b) VALUES (100,200);
```

tb1 を検索すると、次の結果になります。

```sql
SELECT * FROM	tb1;
```

id	a	b	c

NULL	100	200	300

<a id="section-11"></a>

## テーブルの発展的な話題 :id=h-d4ec4b50a6ae

【必須】テーブル名と列名は小文字の英字や数字を使い、数字で始めず、アンダースコアの間を数字だけにしないでください。データベースの列名変更は事前リリースができずコストが高いため、慎重に検討します。

- 良い例：aliyun_admin、rdc_config、level3_name

- 悪い例：AliyunAdmin、rdcConfig、level_3_name

【必須】desc、range、match、delayed などの予約語を使わず、MySQL の公式予約語一覧を参照します。
【必須】テーブルには id、gmt_create、gmt_modified の 3 列を設けます。

- id は主キーで BIGINT UNSIGNED 型とし、単一テーブルでは 1 ずつ自動増分します。gmt_create と gmt_modified はどちらも DATETIME 型で、前者の現在形は能動的な作成、後者の過去分詞は受動的な更新を表します。

【推奨】テーブル名は「業務名_テーブルの役割」に従います。

- 良い例：alipay_task、force_project、trade_config
  【推奨】データベース名はできるだけアプリケーション名と一致させます。
  【参考】適切な文字列長は、テーブルやインデックスの保存領域を節約し、さらに検索速度を高めます。
- 良い例：符号なしの値は負数の誤保存を防ぎ、表現範囲を広げます。

<a id="section-12"></a>

## その他のコマンド :id=h-9d51b0abe7e0

### 文字コードの確認コマンド :id=h-7d708124ba1c

```sql
SHOW variables like 'character_%';

SHOW variables like 'collation_%';
```

### 文字コードの問題 :id=h-f1c848142a34

MySQL のデータディレクトリにある my.ini 設定ファイルを変更します。

\[client] または \[mysql] セクションに追加します。特定の行番号に依存しません。

```ini
default-character-set=utf8mb4
```

\[mysqld] セクションに追加します。サーバー設定の変更後はサービスの再起動が必要です。

```ini
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
```
