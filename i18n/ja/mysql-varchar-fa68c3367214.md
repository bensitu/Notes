# MySQL：接頭辞付きの業務番号を生成する :id=h-1762a4e27916

接頭辞付きの業務番号を生成し、番号の割り当て、並行処理、トランザクションの制約を理解します。

**前提知識とバージョン：** AUTO_INCREMENT、主キー、トランザクションの基礎が必要です。例は MySQL 8.x / InnoDB を対象とします。DELIMITER は mysql クライアントのコマンドで、JDBC から送る SQL ではありません。

**サンプルの使い方：** 全ファイルと実行手順を明示したプロジェクトを除き、各コードブロックは節ごとの独立した断片です。省略部分や仮の名前を補ってください。誤りと示した行は問題の説明用です。同じ節の代替実装を混ぜないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://dev.mysql.com/doc/refman/8.4/en/innodb-auto-increment-handling.html)

**このページの目次**

- [主キーと業務番号を区別する](#section-1)
- [方法 1：数値の主キーを検索時に整形する](#section-2)
- [方法 2：文字列の番号を保存する](#section-3)
- [トリガーとトランザクションの違い](#section-4)

<a id="section-1"></a>

## 主キーと業務番号を区別する :id=h-2fde99c9bbe5

BH0001、BH0002 のような番号を生成したいとします。VARCHAR の列には AUTO_INCREMENT を設定できません。「最大の番号を検索して 1 を足す」方法は避けてください。空のテーブルには最大値がなく、同時リクエストが同じ値を読む場合もあります。

以下の例は MySQL 8.x と InnoDB を使います。独立した練習用データベースで実行してください。

<a id="section-2"></a>

## 方法 1：数値の主キーを検索時に整形する :id=h-11d5ebe5c1d0

表示だけに使う番号なら、データベースには自動採番した数値だけを保存します。

```sql
CREATE TABLE employee (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO employee (username) VALUES ('Tom'), ('Mary');

SELECT id,
       CONCAT('BH', LPAD(CAST(id AS CHAR),
           GREATEST(4, CHAR_LENGTH(CAST(id AS CHAR))), '0')) AS employee_code,
       username
FROM employee
ORDER BY id;
```

1 は BH0001、10000 は BH10000 と表示します。「最低 4 桁」に整形し、LPAD('10000', 4, '0') によって 1000 へ切り詰められないようにします。

AUTO_INCREMENT は欠番のない連番を保証しません。トランザクションのロールバックやレコード削除などで間隔が空くため、欠番が許されない請求書番号として扱ってはいけません。

<a id="section-3"></a>

## 方法 2：文字列の番号を保存する :id=h-d3696fecf827

業務上、文字列の番号を主キーとして保存する必要があるなら、独立したシーケンステーブルで番号を割り当てられます。以下のトリガー例には、作成手順と範囲の確認を含めています。

```sql
CREATE TABLE business_sequence (
    sequence_name VARCHAR(50) NOT NULL,
    next_value BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (sequence_name)
) ENGINE=InnoDB;

INSERT INTO business_sequence (sequence_name, next_value)
VALUES ('employee', 1);

CREATE TABLE employee_with_code (
    id VARCHAR(22) NOT NULL,
    username VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER employee_code_before_insert
BEFORE INSERT ON employee_with_code
FOR EACH ROW
BEGIN
    DECLARE allocated_value BIGINT UNSIGNED DEFAULT NULL;

    SELECT next_value INTO allocated_value
    FROM business_sequence
    WHERE sequence_name = 'employee'
    FOR UPDATE;

    IF allocated_value IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sequence is missing';
    END IF;

    IF allocated_value = 18446744073709551615 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sequence is exhausted';
    END IF;

    UPDATE business_sequence
    SET next_value = next_value + 1
    WHERE sequence_name = 'employee';

    SET NEW.id = CONCAT('BH', LPAD(CAST(allocated_value AS CHAR),
        GREATEST(4, CHAR_LENGTH(CAST(allocated_value AS CHAR))), '0'));
END //
DELIMITER ;

INSERT INTO employee_with_code (username) VALUES ('Tom'), ('Mary');
SELECT * FROM employee_with_code ORDER BY id;
```

DELIMITER は mysql クライアントのコマンドです。JDBC でトリガーを作るときは、DELIMITER をサーバーへ送らないでください。

FOR UPDATE がシーケンステーブルの該当行をロックし、ほかの採番トランザクションは待機します。トリガーによるシーケンス更新と従業員の追加は同じトランザクションに属するため、両方のテーブルで InnoDB を使う必要があります。同じ種類の番号の割り当ては直列化されるので、並行する採番を無制限に増やせる方法ではありません。

トリガーは、呼び出し元から渡された id を上書きします。従業員を削除しても、シーケンステーブルはリセットされません。番号が 4 桁から 5 桁になると、文字列順と数値順が一致しない場合があります。数値順が必要なら、別の数値列も保存してください。

<a id="section-4"></a>

## トリガーとトランザクションの違い :id=h-40f7f068f47f

トリガーは、INSERT、UPDATE、DELETE の発生時にデータベースが実行するコードです。1 つの文にも、BEGIN ... END で囲んだ複数の文にもできます。

トリガーは業務上のトランザクションの代わりにはなりません。商品と在庫を追加する場合も、どの変更をまとめて成功させるか、関連テーブルがトランザクションに対応しているかを明確にする必要があります。

参考：[AUTO_INCREMENT](https://dev.mysql.com/doc/refman/8.0/en/example-auto-increment.html)、[ロック読み取り](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html)、[文字列関数](https://dev.mysql.com/doc/refman/8.0/en/string-functions.html)。
