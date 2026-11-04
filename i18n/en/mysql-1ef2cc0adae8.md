# Operators :id=h-f0a8738de30c

Understand arithmetic, comparison, logical, and bitwise operations, especially NULL and type conversion.

**Prerequisites and versions:** This document targets MySQL 8.x. Exact DECIMAL decimals and approximate floating-point numbers are different types. SQL modes and character collations also affect results.

**Using the examples:** Unless a project explicitly lists all files and run instructions, code blocks are independent snippets for each section. Fill in ellipses and placeholder names; lines marked as incorrect illustrate problems. Do not combine alternative implementations from the same section.

[Documentation index](README.md) · [Official references](https://dev.mysql.com/doc/refman/8.4/en/functions.html)

**Contents**

- [Arithmetic operators](#section-1)
- [Comparison operators](#section-2)
- [Logical operators](#section-3)
- [Bitwise operators](#section-4)

<a id="section-1"></a>

## Arithmetic operators :id=h-d148ea6f7954

Arithmetic operators mainly perform mathematical calculations. They connect two numeric values or expressions and perform addition (+), subtraction (-), multiplication (\*), division (/), or modulo (%) operations.

### Addition and subtraction operators :id=h-a225cb9a62a6

```sql
SELECT 100, 100 + 0, 100 - 0, 100 + 50, 100 + 50 -30, 100 + 35.5, 100 - 35.5
FROM dual;
```

- Adding or subtracting an integer to or from an integer value produces another integer;
- The result type depends on the operands. Exact decimal literals such as 35.5 are normally calculated as DECIMAL. Scientific notation literals such as 1e0 are approximate numbers; not all decimals are floating-point numbers;
- Addition and subtraction have the same precedence and are evaluated from left to right. Parentheses can change the order. For example, 10 - 3 + 2 is 9, while 10 - (3 + 2) is 5;
- In Java, + concatenates strings if either side is a string. In MySQL, however, + only performs numeric addition. For a nonnumeric type, conversion to a number is attempted first; if conversion fails, it is treated as 0. (In MySQL, use the string function CONCAT() for string concatenation.)

### Multiplication and division operators :id=h-b5ad3afef2d6

```sql
SELECT 100, 100 * 1, 100 * 1.0, 100 / 1.0, 100 / 2,100 + 2 * 5 / 2,100 /3, 100 DIV 0
FROM dual;
```

- Multiplying or dividing a number by the integer 1 leaves its value unchanged;
- 1.0 is an exact decimal literal, so the result cannot simply be called floating point. The result type and precision depend on operand types;
- / denotes ordinary division; dividing integers usually produces a DECIMAL result. DIV denotes integer division. For example, 5 / 2 is 2.5000 with default settings, while 5 DIV 2 is 2;
- Division result types and precision depend on operand types and div_precision_increment; four decimal places are not guaranteed;
- Multiplication and division have the same precedence and are evaluated from left to right. Changing parentheses may change the result, and finite-precision calculations may also introduce rounding differences.
- In SELECT, division by 0 produces NULL. Whether a warning is also issued depends on the SQL mode. Write statements may raise an error in strict mode, so check the divisor before calculating.

### Modulo (remainder) operator :id=h-fe986ee694ed

```sql
SELECT 12 % 3, 12 MOD 5
FROM dual;
```

<a id="section-2"></a>

## Comparison operators :id=h-2711c83f8521

- Comparison operators compare the operands on the left and right of an expression. They return 1 if the comparison is true, 0 if false, and NULL otherwise.
- Comparison operators are often used as conditions in SELECT queries to return matching records.

### Equality operator :id=h-a71d32fb38a4

The equality operator (=) checks whether the values, strings, or expressions on either side are equal. **It returns 1 if they are equal and 0 if they are not**.
The equality operator follows these rules:

1. If both values, strings, or expressions are strings, MySQL compares them as strings. The result depends on their character set and collation. For example, 'a' and 'A' are equal under some collations; this cannot be described simply as comparing ANSI codes.
2. If both values are integers, MySQL compares them as integers.
3. If one value is an integer and the other a string, MySQL converts the string to a number for comparison.
4. If either value, string, or expression is NULL, the comparison result is NULL.

**Comparison:** MySQL user variables can be assigned with :=; = can also be used in SET. Column assignments in UPDATE use =.

```sql
SELECT 1 = 1, 1 = '1', 1 = 0, 'a' = 'a', (5 + 3) = (2 + 6), '' = NULL ,NULL = NULL
FROM dual;
```

### NULL-safe equality operator :id=h-eac987a15b59

The NULL-safe equality operator (<=>) works similarly to the equality operator (=). The only difference is that <=> can test NULL. When both operands are NULL, it returns 1 rather than NULL. When exactly one operand is NULL, it returns 0 rather than NULL. **Designed for NULL.**

```sql
SELECT 1 <=> '1', 1 <=> 0, 'a' <=> 'a', (5 + 3) <=> (2 + 6), '' <=> NULL,NULL <=> NULL
FROM dual;
```

### Inequality operators :id=h-249204d47e48

The inequality operators (<> and !=) check whether the numbers, strings, or expression values on either side differ. They return 1 if unequal and 0 if equal. They cannot test NULL values. If either value is NULL, or both are NULL, the result is NULL.

```sql
SELECT 1 <> 1, 1 != 2, 'a' != 'b', (3+4) <> (2+6), 'a' != NULL, NULL <> NULL
FROM dual;
```

### Null test :id=h-dd237ccf382a

The null test (IS NULL or ISNULL) checks whether a value is NULL. It returns 1 if the value is NULL, otherwise 0.

```sql
SELECT NULL IS NULL, ISNULL(NULL), ISNULL('a'), 1 IS NULL;
```

### Non-null test :id=h-76a668e100a3

The non-null test (IS NOT NULL) checks whether a value is not NULL. It returns 1 if the value is not NULL, otherwise 0.

```sql
SELECT NULL IS NOT NULL, 'a' IS NOT NULL, 1 IS NOT NULL;
```

### Minimum-value operator :id=h-2c65b36f54a3

Syntax: LEAST(value1, value2, …, valuen). Here, valuen indicates that the argument list contains n values. With two or more arguments, it returns the smallest value.

```sql
SELECT LEAST (1,0,2), LEAST('b','a','c'), LEAST(1,NULL,2);
```

For integer or floating-point arguments, LEAST returns the smallest value. For strings, it chooses the smallest according to the collation used for comparison. If the list contains NULL, values cannot be ordered and it returns NULL.

### Maximum-value operator :id=h-518ce3ffc40f

Syntax: GREATEST(value1, value2, …, valuen), where n is the number of values in the argument list. With two or more arguments, it returns the largest value. If any argument is NULL, GREATEST() returns NULL.

```sql
SELECT GREATEST(1,0,2), GREATEST('b','a','c'), GREATEST(1,NULL,2);
```

For integer or floating-point arguments, GREATEST returns the largest value. For strings, it chooses the largest according to the collation used for comparison. If the list contains NULL, values cannot be ordered and it returns NULL.

### BETWEEN AND operator :id=h-f45e18711dbd

The BETWEEN operator is commonly used as SELECT D FROM TABLE WHERE C BETWEEN A AND B. The result is 1 when C is greater than or equal to A and less than or equal to B; otherwise it is 0.

```sql
SELECT 1 BETWEEN 0 AND 1, 10 BETWEEN 11 AND 12, 'b' BETWEEN 'a' AND 'c';
```

### IN operator :id=h-453682849768

The IN operator checks whether a given value occurs in the IN list. It returns 1 for a match and 0 otherwise. A NULL left operand produces NULL. If the left operand matches a non-NULL value in the list, it returns 1. It returns NULL only when there is no match and the list contains NULL.

```sql
SELECT 'a' IN ('a','b','c'), 1 IN (2,3), NULL IN ('a','b'), 'a' IN ('a', NULL);
```

### NOT IN operator :id=h-d5ae5cc00d9f

NOT IN is the logical negation of IN. It returns 1 when there is no match and the list contains no NULL, 0 when there is a match, and NULL when there is no match but the list contains NULL. WHERE retains only rows whose condition is true, so NULL in a NOT IN subquery can exclude expected rows. Filter NULL from the subquery according to business requirements, or consider NOT EXISTS with the correct correlation condition.

```sql
SELECT 'a' NOT IN ('a','b','c'), 1 NOT IN (2,3);
```

### LIKE operator :id=h-6d21aadb76b4

The LIKE operator matches strings and is commonly used for **pattern matching**. It returns 1 if the condition matches, otherwise 0. If the value or pattern is NULL, the result is NULL. LIKE commonly uses these wildcards:
“%”: matches zero or more characters.
“\_”: matches exactly one character.

```sql
SELECT NULL LIKE 'abc', 'abc' LIKE NULL;

# See note 1 below.
SELECT name FROM peoples WHERE name LIKE '%a%';

# See note 2 below.
SELECT name FROM peoples WHERE name LIKE 'a%';

# See note 3 below.
SELECT name FROM peoples WHERE name LIKE '__a%';

# See note 4 below.
SELECT name FROM peoples WHERE name LIKE '_a_b%';
```

Example explanations:

1. Find strings containing at least one a; % matches zero or more characters before or after a
2. Find values starting with a
3. Find values whose third character is a
4. Find values whose second character is a and fourth character is b

### ESCAPE :id=h-93bd230563b4

% and \_ have special meanings in LIKE. To match a literal percent sign or underscore, explicitly specify an escape character with ESCAPE to avoid relying on backslashes and the SQL mode.

```sql
SELECT job_id FROM jobs WHERE job_id LIKE 'IT!_%' ESCAPE '!';
SELECT '50% off' LIKE '50!% off' ESCAPE '!';
```

The first statement matches job IDs beginning with IT\_; the second matches a literal %. The escape character itself also needs escaping.

### REGEXP operator :id=h-505b8e2ea299

The REGEXP operator matches strings. Its syntax is:

```sql
expr REGEXP 匹配条件
```

It returns 1 if expr matches the pattern, otherwise 0. If expr or the pattern is NULL, the result is NULL.

The following pattern characters are commonly used with REGEXP:

1. ^ matches strings starting with the characters that follow it.
2. $ matches strings ending with the characters that precede it.
3. . normally matches one character other than a newline. Whether it matches newlines depends on the regular expression options.
4. \[…] matches any character inside the brackets. For example, \[abc] matches a, b, or c. Use - to specify a range: \[a-z] denotes the range a through z, with case behavior determined by the collation and regular expression options; \[0-9] matches any digit.
5. *&#x20;matches zero or more occurrences of the preceding character. For example, x* matches any number of x characters, and \[0-9]*&#x20;matches any number of digits. A standalone \* is not a valid pattern for arbitrary characters; .* means zero or more arbitrary characters.

```sql
SELECT 'shkstart' REGEXP '^s', 'shkstart' REGEXP 't$', 'shkstart' REGEXP 'hk';
```

<a id="section-3"></a>

## Logical operators :id=h-fdff6803980c

Logical operators determine whether expressions are true or false. In MySQL, results are 1, 0, or NULL. In new code, prefer the standard SQL keywords NOT, AND, and OR. !, &&, and || as logical OR are historical extensions. When PIPES_AS_CONCAT is enabled, || means string concatenation. Reference: [MySQL logical operators](https://dev.mysql.com/doc/refman/8.4/en/logical-operators.html).

### Logical NOT operator :id=h-c7fb7d3f4274

Logical NOT (NOT or !) returns 1 when the value is 0 and 0 when it is nonzero.
When the value is NULL, it returns NULL.

```sql
SELECT NOT 1, NOT 0, NOT(1+1), NOT !1, NOT NULL;
```

### Logical AND operator :id=h-57e042b1bf64

Logical AND (AND or &&) returns 1 when all given values are nonzero and none is NULL. It returns 0 if one or more values are 0, and NULL otherwise.

```sql
SELECT 1 AND -1, 0 AND 1, 0 AND NULL, 1 AND NULL;
```

### Logical OR operator :id=h-22e39fa24091

Logical OR (OR or ||) returns 1 when neither value is NULL and at least one is nonzero; otherwise it returns 0. If one value is NULL and the other is nonzero, it returns 1, otherwise NULL. If both values are NULL, it returns NULL.

```sql
SELECT 1 OR -1, 1 OR 0, 1 OR NULL, 0 || NULL, NULL || NULL;
```

**Note:**
OR can be used with AND, but pay attention to precedence. AND has higher precedence than OR, so the operands on either side of AND are evaluated first, then combined with the operands of OR.

### Logical XOR operator :id=h-56280a249dbc

Logical XOR (XOR) returns NULL if either value is NULL. For two non-NULL values, it returns 0 if both are 0 or both are nonzero. It returns 1 if one is 0 and the other is nonzero.

```sql
SELECT 1 XOR -1, 1 XOR 0,0 XOR 0, 1 XOR NULL, 1 XOR 1 XOR  1, 0  XOR 0 XOR 0;
```

<a id="section-4"></a>

## Bitwise operators :id=h-9d2d2dc6b19c

Bitwise operators calculate using binary numbers. They first convert operands to binary, perform bitwise operations, then convert the result back to decimal.

### Bitwise AND operator :id=h-3f163d070321

Bitwise AND (&) performs a logical AND on each corresponding bit of the binary values. A result bit is 1 if both input bits are 1, otherwise 0.

```sql
SELECT 1 & 10, 20 & 30;
```

### Bitwise OR operator :id=h-2979e915fc09

Bitwise OR (|) performs a logical OR on each corresponding bit of the binary values. A result bit is 1 if either or both input bits are 1, otherwise 0.

```sql
SELECT 1 | 10, 20 | 30;
```

### Bitwise XOR operator :id=h-23d447480e17

Bitwise XOR (^) performs a logical XOR on each corresponding bit of the binary values. A result bit is 1 if the input bits differ, otherwise 0.

```sql
SELECT 12 & 5, 12 | 5,12 ^ 5 FROM DUAL;
```

### Bitwise NOT operator :id=h-84b1376be808

Bitwise NOT (\~) inverts every bit of the binary value, changing 1 to 0 and 0 to 1.

```sql
SELECT 10 & ~1;
```

### Bitwise right-shift operator :id=h-f4ac7b1e039b

Bitwise right shift (>>) shifts all bits of the binary value to the right by the specified number of places. Low-order bits shifted out on the right are discarded, and vacant high-order positions on the left are filled with 0.

```sql
SELECT 1>>2, 4>>2;
```

### Bitwise left-shift operator :id=h-d49fbf3f9d8b

Bitwise left shift (<<) shifts all bits of the binary value to the left by the specified number of places. High-order bits shifted out on the left are discarded, and vacant low-order positions on the right are filled with 0.

```sql
SELECT 1 << 2, 4 << 2;
```
