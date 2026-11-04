# MySQL: generating business identifiers with a prefix :id=h-1762a4e27916

Generate business identifiers with a prefix and understand sequence allocation, concurrency, and transaction limitations.

**Prerequisites and versions:** Understand AUTO_INCREMENT, primary keys, and transactions first. These examples target MySQL 8.x / InnoDB. DELIMITER is a mysql client command, not SQL to send through JDBC.

**Using the examples:** Unless a project explicitly lists every file and all steps to run it, code blocks are separate examples for their respective sections. Fill in omitted code and placeholder names. Lines marked as incorrect illustrate a problem. Do not combine alternative implementations from the same section.

[Documentation index](README.md) · [Official references](https://dev.mysql.com/doc/refman/8.4/en/innodb-auto-increment-handling.html)

**On this page**

- [Primary keys versus business identifiers](#section-1)
- [Option 1: numeric key, formatted during queries](#section-2)
- [Option 2: storing a string identifier](#section-3)
- [Triggers versus transactions](#section-4)

<a id="section-1"></a>

## Primary keys versus business identifiers :id=h-2fde99c9bbe5

The requirement is to generate identifiers such as BH0001 and BH0002. A VARCHAR column cannot use AUTO_INCREMENT. Do not query the largest identifier and add one: an empty table has no maximum, and concurrent requests can read the same value.

The examples use MySQL 8.x and InnoDB. Run them in a separate practice database.

<a id="section-2"></a>

## Option 1: numeric key, formatted during queries :id=h-11d5ebe5c1d0

If the identifier is only for display, store just the auto-incrementing number in the database.

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

1 is displayed as BH0001, and 10000 as BH10000. Pad to at least four digits; LPAD('10000', 4, '0') would truncate the value to 1000.

AUTO_INCREMENT does not guarantee consecutive numbers without gaps. A rolled-back transaction, deleted records, and other operations can leave gaps. Do not use it as a gap-free invoice sequence.

<a id="section-3"></a>

## Option 2: storing a string identifier :id=h-d3696fecf827

If the business requires a string identifier as the primary key, allocate numbers using a separate sequence table. The trigger example below includes setup and boundary checks.

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

DELIMITER is a mysql client command. When creating a trigger through JDBC, do not send DELIMITER to the server.

FOR UPDATE locks the sequence-table row, so other number-allocation transactions must wait. The sequence update and employee insert performed by the trigger belong to the same transaction; both tables must use InnoDB. This serializes allocation for one kind of identifier, so it does not scale to unlimited concurrent allocation.

The trigger overwrites the id supplied by the caller. Deleting an employee does not reset the sequence table. Once a four-digit identifier grows to five digits, string order may differ from numeric order. Store a separate numeric column if numeric ordering is required.

<a id="section-4"></a>

## Triggers versus transactions :id=h-40f7f068f47f

A trigger is code the database runs when an INSERT, UPDATE, or DELETE occurs. It can be a single statement or several statements inside BEGIN ... END.

A trigger is not a replacement for a business transaction. When adding a product and its stock record, still define which changes must succeed together and whether the tables support transactions.

References: [AUTO_INCREMENT](https://dev.mysql.com/doc/refman/8.0/en/example-auto-increment.html), [locking reads](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html), and [string functions](https://dev.mysql.com/doc/refman/8.0/en/string-functions.html).
