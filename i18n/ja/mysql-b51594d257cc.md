# MySQL の基本的な検索 :id=h-86c5eed5b9ad

SELECT、重複の除去、並べ替え、結合、サブクエリ、ページングの書き方を調べます。

**前提知識とバージョン：** MySQL 8.x を対象とします。employees、departments、locations は演習用データセットのテーブルです。Oracle の書き方は明示した比較用であり、MySQL では実行しません。

**例の使い方：** 全ファイルと実行手順を明示したプロジェクト以外では、コードブロックは各節の独立した断片です。省略箇所や仮の名前を補ってください。誤りと明記した行は問題を説明するためのものです。同じ節にある代替の書き方を組み合わせないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://dev.mysql.com/doc/refman/8.4/en/select.html)

**目次**

- [基本的な SELECT 文](#section-1)
- [データの並べ替え](#section-2)
- [並べ替えの規則](#section-3)
- [ページング](#section-4)
- [ページングの仕組み](#section-5)
- [補足](#section-6)
- [MySQL の複数テーブルの検索](#section-7)

<a id="section-1"></a>

## 基本的な SELECT 文 :id=h-ae9c59852b89

**SELECT … FROM ...**

構文：

```sql
SELECT 标识选择哪些列
FROM 标识从哪个表中选择
```

すべてのカラムを選択する：

```sql
SELECT *
FROM departments;
```

特定のカラムを選択する：

```sql
SELECT department_id, location_id
FROM departments;
```

MySQL の SQL 文では大文字と小文字を区別しないため、SELECT と select は同じ働きをします。

### カラムの別名 :id=h-e6401fa4956b

**... AS name**

- カラムの名前を変更する
- 計算を扱いやすくする
- 別名はカラム名の直後に置き、間に AS キーワードを入れることもできます。空白や特殊文字を含め、大文字と小文字を区別するには、別名を二重引用符で囲みます。
- AS は省略できます。
- 別名は短く、意味の分かるものにすることを推奨します。

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

### 重複行の除去 :id=h-706d16c17479

既定では、検索は重複を含むすべての行を返します。SELECT 文で DISTINCT キーワードを使うと、重複行を除去できます。

```sql
SELECT DISTINCT department_id
FROM employees;
```

次の場合について：

```sql
SELECT DISTINCT department_id, salary
FROM employees;
```

> 注意点は2つあります。
>
> 1. DISTINCT はすべてのカラム名の前に置きます。SELECT salary, DISTINCT department_id FROM employees と書くと、エラーになります。
> 2. DISTINCT は、選択したカラム全体の組み合わせで重複を除去します。例えば、(department_id, salary) の両方が同じ行だけが1行にまとまります。結果の行数は現在のデータによって決まり、部門数とは解釈できません。異なる部門だけを調べたい場合は、DISTINCT department_id だけを選択します。

### NULL 値を含む演算 :id=h-4d86365ec917

NULL は、値が欠けている、または不明であることを表します。通常の算術演算や比較は、多くの場合 NULL になります。ただし、IS NULL、NULL 安全等価演算子 <=>、COALESCE、一部の論理演算には独自の規則があり、すべての演算が NULL を返すとはいえません。

```sql
SELECT employee_id, salary, commission_pct,
12 * salary * (1 + commission_pct) "annual_sal"
FROM employees;
```

MySQL では、NULL 値と空文字列は異なります。空文字列の長さは0ですが、LENGTH(NULL) の結果は NULL です。また、MySQL では NULL 値も記憶領域を使用します。null は0、' '、'null' と同じではありません。

### バッククォート :id=h-9c925b35ff1f

**名前を一対のバッククォート（\`）で囲みます。**

誤り：

```sql
SELECT * FROM ORDER;
```

正しい書き方：

```sql
SELECT * FROM `ORDER`;
```

結論：
カラム名やテーブル名などが、予約語、データベースシステムの名前、よく使うメソッドと衝突しないようにします。同じ名前を使う場合は、SQL 文内でバッククォートの対で囲んでください。

### 定数の検索 :id=h-eea6772d1b49

SELECT では定数も検索でき、SELECT の結果に固定値のカラムを追加できます。この値はテーブルから動的に取得するのではなく、自分で指定します。
なぜ定数を検索するのでしょうか。
SQL の SELECT 構文はこの機能を提供します。通常、1つのテーブルだけを検索するなら固定値のカラムは不要ですが、複数のデータソースをまとめる場合は、定数をテーブルの識別用に使えます。例えば employees から従業員名を検索し、同時に **固定値の corporation カラムを追加する** 場合です。値を「尚硅谷」に固定するには、次のように書きます。

```sql
SELECT 'Atguigu' as corporation, last_name
FROM employees;
```

### テーブル構造の表示 :id=h-2ae081dcedc6

DESCRIBE または DESC コマンドで、テーブル構造を表示します。

```sql
DESCRIBE employees;
或
DESC employees;
```

各項目の意味は次のとおりです。
Field：カラム名。
Type：カラムの型。ここでは barcode と goodsname は文字列型で、price は整数型です。
Null：そのカラムに NULL を保存できるか。
Key：そのカラムに索引があるか。PRI は主キーの一部、UNI は UNIQUE 索引の一部であることを表します。MUL は、同じ値が複数回現れることを許可します。
Default：既定値があるか、ある場合はその値。
Extra：AUTO_INCREMENT など、そのカラムに関する追加情報。

### 検索結果の絞り込み :id=h-1ca61c5d832c

構文：

```sql
SELECT 字段1,字段2
FROM 表名
WHERE 过滤条件
```

WHERE 句で、条件を満たさない行を除外します。WHERE 句は FROM 句の直後に置きます。

> WHERE は FROM の直後に置く必要があります。

例：

```sql
SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90;

SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90 ORDER BY employee_id DESC;
```

<a id="section-2"></a>

# データの並べ替え :id=h-feddc492322c

<a id="section-3"></a>

## 並べ替えの規則 :id=h-18252eb7e2a4

### 1つのカラムでの並べ替え :id=h-644641584086

ORDER BY 句で並べ替えます。

```sql
SELECT 列名 FROM 目标表名 ORDER BY 列名 (ASC/DESC);
```

ASC（ascend）：昇順
DESC（descend）：降順
ORDER BY 句は SELECT 文の末尾に置きます。

```sql
SELECT last_name, job_id, department_id, hire_date
FROM employees ORDER BY hire_date ;
```

### 複数のカラムでの並べ替え :id=h-e3e4854e97d6

- SELECT リストに含まれないカラムでも並べ替えられます。
- 複数のカラムで並べ替える場合、最初のカラムの値が同じ行の間でだけ、2番目のカラムの順序が使われます。最初のカラムの値がすべて一意なら、2番目のカラムでの並べ替えは行われません。

```sql
SELECT last_name, department_id, salary
FROM employees ORDER BY department_id, salary DESC;
```

<a id="section-4"></a>

# ページング :id=h-03953991f1e1

<a id="section-5"></a>

## ページングの仕組み :id=h-cab99cc8b7e6

ページング表示とは、指定した条件に従い、データベースの結果セットを部分ごとに表示することです。

MySQL では LIMIT でページングを実装します。

形式：

```sql
SELECT 列名 FROM 目标表名 LIMIT 位置偏移量, 行数;
```

最初の「オフセット」引数は、MySQL がどの行から表示するかを指定する任意の引数です。省略すると最初のレコードから始まります（最初はオフセット0、2件目は1、という順です）。2つ目の「行数」引数は、返すレコード数を指定します。

```sql
SELECT * FROM 目标表名 LIMIT 0,10; (返回第1个到第10个)

SELECT * FROM 目标表名 LIMIT 10,10; (返回第11个到第20个)

SELECT * FROM 目标表名 LIMIT 20,10; (返回第21个到第30个)
```

ページのオフセット =（現在のページ番号 - 1）× 1ページの件数です。先にプログラムで計算してから、オフセットと件数を SQL にバインドします。通常の LIMIT に、この算術式を直接記述することはできません。次の例は1ページ10件の3ページ目を表します。

```sql
SELECT * FROM employees ORDER BY employee_id LIMIT 20, 10;
```

- 注意：LIMIT 句は SELECT 文全体の最後に置きます。
- LIMIT の利点：返す結果数を制限すると、ネットワーク転送量を減らし、検索効率も高められます。結果が1件だけだと分かっているなら LIMIT 1 を使い、SELECT に1件だけ返すように指定します。これにより、SELECT はテーブル全体を走査せず、条件に合う1件が見つかった時点で返せます。

<a id="section-6"></a>

## 補足 :id=h-0f9a32202131

DBMS によってキーワードが異なる場合があります。MySQL、PostgreSQL、MariaDB、SQLite では、SELECT 文の最後に LIMIT を置きます。

- SQL Server と Access では TOP を使います。例：

  ```sql
  SELECT TOP 5 name, hp_max FROM heros ORDER BY hp_max DESC
  ```

- DB2 では、FETCH FIRST 5 ROWS ONLY などを使用します。

  ```sql
  SELECT name, hp_max FROM heros ORDER BY hp_max DESC FETCH FIRST 5 ROWS ONLY
  ```

- Oracle 12c 以降は FETCH FIRST を使用できます。旧式の ROWNUM では、先にサブクエリ内で並べ替え、その外側で件数を制限します。そうしなければ、並べ替えた後の上位の行にはなりません。

  ```sql
  SELECT last_name, salary FROM employees ORDER BY salary DESC FETCH FIRST 5 ROWS ONLY;
  ```

<a id="section-7"></a>

# MySQL の複数テーブルの検索 :id=h-26bef0493dcf

### 等価結合 :id=h-e8ecf5600447

2つのテーブルの関連するカラムを等号で比較します。カラム名は異なっていても構いません。例：employee.department_id = department.id。

```sql
SELECT xxx FROM 表1, 表2
WHERE 表1.某字段=表2.某字段
```

または

```sql
SELECT 表1.xxx, 表3.xxx FROM 表1, 表2, 表3
WHERE 表1.某字段=表2.某字段 AND 表2.某字段=表3.某字段
```

例：

```sql
SELECT employees.employee_id, employees.last_name, employees.department_id, departments.department_id, departments.location_id
FROM employees, departments
WHERE employees.department_id = departments.department_id;
```

- 別名を使うと検索文を簡略化できます。
- テーブル名の接頭辞や別名は、カラム名の曖昧さをなくし、読みやすくするためのものです。それだけで検索が速くなるとは限りません。性能は索引、データ量、実行計画にも依存します。
- n 個のテーブルを結合するには、少なくとも n-1 個の結合条件が必要です。例えば3つのテーブルなら、少なくとも2つの条件が必要です。

### 自己結合 :id=h-8d8d2f597ee7

同じテーブル同士を内部結合します。

例：

```sql
SELECT CONCAT(worker.last_name ,' works for ', manager.last_name)
FROM employees worker, employees manager
WHERE worker.manager_id = manager.employee_id ;
```

- 内部結合：共通するカラムを持つ2つ以上のテーブルの行を結び付けます。一方のテーブルに対応する行がないデータは、結果に含みません。
- 外部結合：結合条件を満たす行に加え、左（または右）のテーブルで条件を満たさない行も返します。これを左（または右）外部結合と呼びます。一致する行がない場合、結果の対応するカラムは NULL になります。
- 左外部結合では、左側を主テーブル、右側を従テーブルとも呼びます。右外部結合では、右側が主テーブル、左側が従テーブルです。

### Oracle の旧式の外部結合構文（概要） :id=h-dbddfd4a7854

- (+) は Oracle の旧式の外部結合演算子で、SQL92 の標準構文ではありません。対応する行が存在しない可能性のある側に付けます。
- MySQL は Oracle の (+) 構文に対応していません。MySQL では LEFT JOIN / RIGHT JOIN を使います。以下の Oracle の例を MySQL で直接実行することはできません。

```sql
# See note 1 below.
SELECT last_name,department_name
FROM employees ,departments
WHERE employees.department_id = departments.department_id(+);
# See note 2 below.
SELECT last_name,department_name
FROM employees ,departments
WHERE employees.department_id(+) = departments.department_id;
```

例の説明：

1. 左外部結合
2. 右外部結合

- 標準 SQL は FULL OUTER JOIN を定義していますが、MySQL は FULL OUTER JOIN を直接サポートしません。2つの外部結合を組み合わせられますが、重複行の扱いを保つ必要があります。

### 標準の JOIN 構文 :id=h-7115475a1e98

#### 基本構文（JOIN ON） :id=h-770992697352

**JOIN…ON** 句で結合を作成する構文：

```sql
SELECT table1.column, table2.column,table3.column
FROM table1
JOIN table2 ON table1 和 table2 的连接条件
JOIN table3 ON table2 和 table3 的连接条件
```

**構文の説明：**

- ON 句で、追加の結合条件を指定できます。
- この結合条件は、ほかの条件とは分けて記述します。
- ON 句で、文が読みやすくなります。
- JOIN は通常 INNER JOIN を意味します。CROSS JOIN は直積を意図することを表します。MySQL の一部の構文では INNER JOIN と置き換えられますが、複数のデータベースに対応するコードで同じ概念として扱ってはいけません。

#### 内部結合（INNER JOIN） :id=h-a6086b9a8a2f

暗黙的な内部結合：

```sql
SELECT 字段列表
FROM A表, B表
WHERE A表与B表相同的字段名;
```

明示的な内部結合：

```sql
SELECT 字段列表
FROM A表 [INNER] JOIN B表
ON 关联条件
WHERE 等其他子句;
```

#### 左外部結合（LEFT OUTER JOIN） :id=h-bffb4d6ab174

左テーブルの全データと、共通部分のデータを検索します。

構文：

```sql
# See note 1 below.
SELECT 字段列表
FROM A表 LEFT [outer] JOIN B表
ON 关联条件
WHERE 等其他子句;
```

例の説明：

1. 検索結果 A を得る

#### 右外部結合（RIGHT OUTER JOIN） :id=h-f941f817d093

右テーブルの全データと、共通部分のデータを検索します。

構文：

```sql
FROM A表 RIGHT [outer] JOIN B表
ON 关联条件
WHERE 等其他子句;
```

#### 完全外部結合（FULL OUTER JOIN） :id=h-d51966bb6e16

- 完全外部結合の結果 = 左右のテーブルで一致するデータ + 左側の一致しないデータ + 右側の一致しないデータ。
- SQL99 は、FULL JOIN または FULL OUTER JOIN による完全外部結合をサポートします。
- **MySQL は FULL JOIN** に対応していませんが、LEFT JOIN UNION RIGHT join の組み合わせで代用できます。

```sql
SELECT last_name,department_name FROM employees e FULL OUTER JOIN departments d ON e.department_id = d.department_id;
```

### UNION の使用 :id=h-4543aa51bdbf

UNION キーワードで複数の SELECT 文の結果を1つの結果セットにまとめられます。両者のカラム数とデータ型を同じにし、位置も相互に対応させる必要があります。各 SELECT 文は UNION または UNION ALL で区切ります。

構文：

```sql
SELECT column,... FROM table1
UNION [ALL]
SELECT column,... FROM table2
```

**UNION 演算子**

UNION 演算子は、2つの結果セットの和集合を返し、重複レコードを除去します。

**UNION ALL 演算子**

UNION ALL は、2つの検索の結果をまとめて返します。結果セット間の重複を除去しません。

> 注意：UNION ALL は UNION より少ないリソースで実行できます。結果に重複がないと分かっている場合や、重複を除く必要がない場合は、検索効率を高めるため UNION ALL を優先します。

```sql
# See note 1 below.
SELECT * FROM employees WHERE email LIKE '%a%' OR department_id>90;

# See note 2 below.
SELECT * FROM employees WHERE email LIKE '%a%'
UNION
SELECT * FROM employees WHERE department_id>90;


# See note 3 below.
SELECT id,cname FROM t_chinamale WHERE csex='男'
UNION ALL
SELECT id,tname FROM t_usmale WHERE tGender='male';
```

例の説明：

1. UNION の方法1
2. UNION の方法2
3. UNIONALL の方法

### 7種類の SQL JOINS の実装 :id=h-411b2ec4f0a4

```sql
# See note 1 below.
SELECT employee_id,last_name,department_name
FROM employees e JOIN departments d
ON e.department_id = d.department_id;


# See note 2 below.
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.department_id = d.department_id;


# See note 3 below.
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.department_id = d.department_id;


# See note 4 below.
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.department_id = d.department_id
WHERE d.department_id IS NULL


# See note 5 below.
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.department_id = d.department_id
WHERE e.department_id IS NULL


# See note 6 below.
# See note 7 below.
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.department_id = d.department_id
WHERE d.department_id IS NULL
UNION ALL	# See note 8 below.
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.department_id = d.department_id;


# See note 9 below.
# See note 10 below.
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.department_id = d.department_id
WHERE d.department_id IS NULL
UNION ALL
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.department_id = d.department_id
WHERE e.department_id IS NULL;
```

例の説明：

1. 中央の図：内部結合 A∩B
2. 左上の図：左外部結合
3. 右上の図：右外部結合
4. 左中央の図：A - A∩B
5. 右中央の図：B-A∩B
6. 左下の図：完全外部結合
7. 左中央の図 + 右上の図：A∪B\*
8. 重複除去を行わないため効率が高い
9. 右下の図
10. 左中央の図 + 右中央の図：A ∪ B - A∩B または (A - A∩B) ∪ (B - A∩B)

### サブクエリ :id=h-6036f3153ad5

別の検索文の中に入れ子にした検索です。

サブクエリの結果が **1行1列** の場合、=、!=、<、> で比較できます。

```sql
SELECT 字段列表 FROM 表1 WHERE 字段名 = (子查询);

例如：
SELECT *
FROM employee
WHERE employee.salary < (SELECT AVG(salary) FROM employee);
```

サブクエリの結果が **複数行1列** の場合、in などのキーワードで判定できます。

```sql
SELECT 字段列表 FROM 表1 WHERE 字段名 IN (子查询);

例如：
SELECT *
FROM employee
WHERE dept_id
IN (SELECT id FROM department WHERE name IN ('财务部', '市场部'));
```

サブクエリの結果が **複数行複数列** の場合、仮想テーブルとして検索に使用できます。

```sql
SELECT 字段列表 FROM (子查询) WHERE 条件;

例如：
SELECT e.*
FROM employees AS e
JOIN (SELECT department_id FROM departments WHERE location_id = 1700) AS d
  ON e.department_id = d.department_id;
```
