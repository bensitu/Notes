# Mybatis の概要 :id=h-06be47b199d6

Mapper インターフェースを通して、パラメーターのバインド、結果マッピング、動的 SQL、キャッシュを学びます。

**前提知識とバージョン：** まず SQL と JDBC を学んでください。本記事は MyBatis 3 の概念を使用し、従来の POM と画像を残しています。古い依存関係は保守時の比較用です。パラメーターバインドの例は完全なログインシステムではなく、実際のログインで平文パスワードを SQL で比較してはいけません。

**スクリーンショットについて：** 画像には元の学習環境での操作手順を残しています。画像内の古い書き方が本文と異なる場合は、改訂した本文と使用するバージョンの公式ドキュメントに従ってください。

**例の使い方：** 全ファイルと実行手順を明示したプロジェクト以外では、コードブロックは各節の独立した断片です。省略箇所や仮の名前を補ってください。誤りと明記した行は問題を説明するためのものです。同じ節にある代替の書き方を組み合わせないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://mybatis.org/mybatis-3/zh/index.html)

**目次**

- [MyBatis の歴史](#section-1)
- [MyBatis の特徴](#section-2)
- [MyBatis のダウンロード](#section-3)
- [ほかの永続化技術との比較](#section-4)
- [MyBatis の構築](#section-5)
- [開発環境](#section-6)
- [maven プロジェクトの作成](#section-7)
- [MyBatis のコア設定ファイルの作成](#section-8)
- [mapper インターフェースの作成](#section-9)
- [MyBatis のマッピングファイルの作成](#section-10)
- [junit による機能のテスト](#section-11)
- [log4j のログ機能の追加](#section-12)
- [コア設定ファイルの詳細](#section-13)
- [既定の型エイリアス](#section-14)
- [MyBatis による CRUD](#section-15)
- [1. 設定ファイルによる CRUD の実装](#section-16)
- [2. アノテーションによる CRUD の実装](#section-17)
- [MyBatis でパラメーター値を取得する2つの方法（重要）](#section-18)
- [単一のリテラル型パラメーター](#section-19)
- [複数のリテラル型パラメーター](#section-20)
- [map 型のパラメーター](#section-21)
- [エンティティ型のパラメーター](#section-22)
- [@Param によるパラメーターの識別](#section-23)
- [要点の確認](#section-24)
- [MyBatis の各種検索機能](#section-25)
- [エンティティオブジェクトの検索](#section-26)
- [List コレクションの検索](#section-27)
- [単一の値の検索](#section-28)
- [1件のデータを map として検索](#section-29)
- [複数のデータを map として検索](#section-30)
- [特殊な SQL の実行](#section-31)
- [あいまい検索](#section-32)
- [一括削除](#section-33)
- [テーブル名の動的な設定](#section-34)
- [追加時に自動採番された主キーを取得](#section-35)
- [resultMap による独自のマッピング](#section-36)
- [resultMap によるカラムとプロパティの対応付け](#section-37)
- [多対一のマッピング](#section-38)
- [一対多のマッピング](#section-39)
- [遅延読み込み](#section-40)
- [動的 SQL](#section-41)
- [if](#section-42)
- [where](#section-43)
- [trim](#section-44)
- [choose、when、otherwise](#section-45)
- [foreach](#section-46)
- [SQL フラグメント](#section-47)
- [MyBatis のキャッシュ](#section-48)
- [第1レベルキャッシュ：同じ SqlSession 内で結果を再利用](#section-49)
- [第2レベルキャッシュ：Mapper の namespace ごとに管理](#section-50)
- [検索の参照順序](#section-51)
- [外部キャッシュ EHCache の連携（概要）](#section-52)
- [MyBatis によるリバースエンジニアリング](#section-53)
- [リバースエンジニアリングの設定手順](#section-54)
- [QBC](#section-55)
- [ページングプラグイン](#section-56)
- [ページングプラグインの使用手順](#section-57)
- [ページングプラグインの使用](#section-58)

<a id="section-1"></a>

## MyBatis の歴史 :id=h-d61adf6e4ae3

- MyBatis は、Apache のオープンソースプロジェクト iBatis として始まりました。2010年6月に Apache Software Foundation から Google Code へ移行し、開発チームの移動に伴って iBatis3.x は正式に MyBatis に改称されました。コードは2013年11月に Github へ移行しました。
- iBatis という名前は「internet」と「abatis」の組み合わせに由来します。Java ベースの永続化フレームワークで、iBatis が提供する永続化の仕組みには SQL Maps と Data Access Objects（DAO）があります。
  <a id="section-2"></a>

## MyBatis の特徴 :id=h-2683846c18cd

1. MyBatis は、独自の SQL、ストアドプロシージャ、高度なマッピングをサポートする優れた永続化フレームワークです。
2. MyBatis は、ほぼすべての JDBC コードと、パラメーター設定や結果セット取得の手作業を不要にします。
3. MyBatis は、シンプルな XML やアノテーションで設定と基本的なマッピングを行い、インターフェースと Java の POJO（Plain Old Java Objects、通常の Java オブジェクト）をデータベースのレコードに対応付けます。
4. MyBatis は、半自動の ORM（Object Relation Mapping）フレームワークです。
   <a id="section-3"></a>

## MyBatis のダウンロード :id=h-236c83b28a0a

- [MyBatis のダウンロード先](https://github.com/mybatis/mybatis-3)
- ![](Resources/MyBatis下载.png)
  <a id="section-4"></a>

## ほかの永続化技術との比較 :id=h-9941aa49403c

- JDBC
  - SQL が Java コードに混在し、結合が強くなってハードコーディングの問題が生じます。
  - 保守が難しく、実際の開発要件では SQL の変更が頻繁に発生します。
  - コードが冗長で、開発効率が低い
- Hibernate と JPA
  - 操作が簡単で、開発効率が高い
  - 長く複雑な SQL を扱う場合は、フレームワークを迂回する必要があります。
  - 内部で自動生成する SQL は、特定の要件に応じて最適化しにくくなります。
  - 完全なマッピングを基本とする全自動のフレームワークでは、多数のフィールドを持つ POJO の部分的なマッピングが難しくなります。
  - リフレクションが多すぎると、データベースの性能が低下します。
- MyBatis
  - 軽量で、性能が優れている
  - SQL と Java のコードを分離し、役割を明確にします。Java コードは業務ロジック、SQL 文はデータに専念します。
  - 開発効率は HIbernate よりやや劣りますが、十分に許容できる範囲です。
    <a id="section-5"></a>

# MyBatis の構築 :id=h-98f56da232e1

<a id="section-6"></a>

## 開発環境 :id=h-473cdb4c81e5

- IDE：idea 2019.2
- ビルドツール：maven 3.5.4
- MySQL のバージョン：MySQL 5.7
- MyBatis のバージョン：MyBatis 3.5.7
  <a id="section-7"></a>

## maven プロジェクトの作成 :id=h-906b3b90afa5

- パッケージ形式：jar
- 依存関係を導入する

  ```xml
  <dependencies>
      <!-- See note 1 below. -->
      <dependency>
          <groupId>org.mybatis</groupId>
          <artifactId>mybatis</artifactId>
          <version>3.5.7</version>
      </dependency>
      <!-- See note 2 below. -->
      <dependency>
          <groupId>junit</groupId>
          <artifactId>junit</artifactId>
          <version>4.12</version>
          <scope>test</scope>
      </dependency>
      <!-- See note 3 below. -->
      <dependency>
          <groupId>mysql</groupId>
          <artifactId>mysql-connector-java</artifactId>
          <version>5.1.3</version>
          </dependency>
  </dependencies>
  ```

例の説明：

1. Mybatis のコア
2. junit テスト
3. MySQL ドライバー

<a id="section-8"></a>

## MyBatis のコア設定ファイルの作成 :id=h-ef9e8b98f66b

> 慣例では `mybatis-config.xml` という名前にしますが、推奨にすぎず必須ではありません。後で Spring と連携すれば省略できるファイルなので、演習ではコピーして使用して構いません。
> コア設定ファイルは主にデータベース接続環境と MyBatis のグローバル設定に使用します。
> 配置場所は src/main/resources ディレクトリです。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- See note 1 below. -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/MyBatis"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
    <!-- See note 2 below. -->
    <mappers>
        <mapper resource="mappers/UserMapper.xml"/>
    </mappers>
</configuration>
```

例の説明：

1. データベース接続環境を設定する
2. マッピングファイルを読み込む

<a id="section-9"></a>

## mapper インターフェースの作成 :id=h-17819eeee969

> MyBatis の mapper インターフェースは、以前の dao に相当します。ただし、mapper はインターフェースだけで、実装クラスを用意しない点が異なります。

```java
package com.atguigu.mybatis.mapper;

public interface UserMapper {
    /* See note 1 below. */
    int insertUser();
}
```

例の説明：

1. ユーザー情報を追加する

<a id="section-10"></a>

## MyBatis のマッピングファイルの作成 :id=h-0fe2930a5b14

- 関連概念：ORM（Object Relationship Mapping、オブジェクト関係マッピング）。
  - オブジェクト：Java のエンティティオブジェクト
  - 関係：リレーショナルデータベース
  - マッピング：両者の対応関係

| Java の概念 | データベースの概念 |
| -------- | --------- |
| クラス      | テーブル      |
| プロパティ    | フィールド／カラム |
| オブジェクト   | レコード／行    |

- マッピングファイルの命名規則
  - テーブルに対応するエンティティクラス名 + Mapper.xml
  - 例えば、テーブル t_user に対応するエンティティは User で、マッピングファイルは UserMapper.xml です。
  - つまり、1つのマッピングファイルは、1つのエンティティクラスと1つのテーブルの操作に対応します。
  - エンティティクラスの命名は、Java のキャメルケース規則に従います。例：userName、employeeId など。
  - MyBatis のマッピングファイルは、テーブルのデータにアクセスし操作する SQL を記述するために使用します。
  - MyBatis のマッピングファイルは src/main/resources/mappers ディレクトリに配置します。
- MyBatis でインターフェースを使ってデータを操作するには、次の2点を一致させる必要があります。
  - mapper インターフェースの完全修飾名と、マッピングファイルの名前空間（namespace）を一致させます。
  - mapper インターフェースのメソッド名と、マッピングファイルで SQL を記述するタグの id 属性を一致させます。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.atguigu.mybatis.mapper.UserMapper">
    <!--int insertUser();-->
    <insert id="insertUser">
        insert into t_user values(null,'张三','123',23,'女')
    </insert>
</mapper>
```

<a id="section-11"></a>

## junit による機能のテスト :id=h-9004e3348326

- SqlSession は Java プログラムとデータベース間のセッションを表します。（HttpSession は Java プログラムとブラウザー間のセッションです。）
- SqlSessionFactory は SqlSession を生成する「工場」です。
- ファクトリーパターン：オブジェクトを生成する手順がほぼ定型的であれば、そのコードを「ファクトリークラス」にまとめ、必要なオブジェクトをそのクラスで生成できます。

```java
public class UserMapperTest {
    @Test
    public void testInsertUser() throws IOException {
        // See note 1 below.
        InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
        // See note 2 below.
        SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
        // See note 3 below.
        SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(is);
        // See note 4 below.
        //SqlSession sqlSession = sqlSessionFactory.openSession();
        // See note 5 below.
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        // See note 6 below.
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        // See note 7 below.
        int result = userMapper.insertUser();
        // See note 8 below.
        //sqlSession.commit();
        System.out.println("result:" + result);
    }
}
```

例の説明：

1. MyBatis のコア設定ファイルを読み込む
2. SqlSessionFactoryBuilder オブジェクトを取得する
3. コア設定ファイルのバイト入力ストリームからファクトリー SqlSessionFactory を作成し、SqlSession オブジェクトを生成する
4. sqlSession を取得する。この SqlSession で実行する SQL は、トランザクション を手動でコミットまたはロールバックする必要がある
5. SqlSession を作成する。この SqlSession で実行する SQL は自動コミットされる
6. プロキシパターンを使って、UserMapper インターフェースのプロキシ実装オブジェクトを作成する
7. UserMapper インターフェースのメソッドを呼ぶと、UserMapper の完全修飾名でマッピングファイルを特定し、メソッド名で SQL タグを特定して、その SQL 文を実行する
8. トランザクション をコミットする

- ここでは トランザクション の手動コミットが必要です。トランザクション を自動コミットするには、sqlSession の取得時に `SqlSession sqlSession = sqlSessionFactory.openSession(true);` を使用し、Boolean 型の値 true を渡します。
  <a id="section-12"></a>

## log4j のログ機能の追加 :id=h-97c7fe2b6219

1. 依存関係を追加する
   ```xml
   <!-- See note 1 below. -->
   <dependency>
   <groupId>log4j</groupId>
   <artifactId>log4j</artifactId>
   <version>1.2.17</version>
   </dependency>
   ```

例の説明：

1. log4j のログ

2. log4j の設定ファイルを追加する
   - log4j の設定ファイル名は log4j.xml で、src/main/resources ディレクトリに配置します。
   - ログレベル：FATAL（致命的）> ERROR（エラー）> WARN（警告）> INFO（情報）> DEBUG（デバッグ）。左から右に向かって、出力がより詳細になります。
   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
   <log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">
       <appender name="STDOUT" class="org.apache.log4j.ConsoleAppender">
           <param name="Encoding" value="UTF-8" />
           <layout class="org.apache.log4j.PatternLayout">
               <param name="ConversionPattern" value="%-5p %d{MM-dd HH:mm:ss,SSS} %m (%F:%L) \n" />
           </layout>
       </appender>
       <logger name="java.sql">
           <level value="debug" />
       </logger>
       <logger name="org.apache.ibatis">
           <level value="info" />
       </logger>
       <root>
           <level value="debug" />
           <appender-ref ref="STDOUT" />
       </root>
   </log4j:configuration>
   ```

<a id="section-13"></a>

# コア設定ファイルの詳細 :id=h-689a1539915c

> コア設定ファイルのタグには固定の順序があります（一部は省略できますが、順序は変更できません）。
> properties、settings、typeAliases、typeHandlers、objectFactory、objectWrapperFactory、reflectorFactory、plugins、environments、databaseIdProvider、mappers

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//MyBatis.org//DTD Config 3.0//EN"
        "http://MyBatis.org/dtd/MyBatis-3-config.dtd">
<configuration>
    <!-- See note 1 below. -->
    <properties resource="jdbc.properties"></properties>
    <settings>
        <!-- See note 2 below. -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
        <!-- See note 3 below. -->
        <setting name="lazyLoadingEnabled" value="true"/>
    </settings>
    <typeAliases>
        <!-- See note 4 below. -->
        <!--<typeAlias type="com.atguigu.mybatis.bean.User"></typeAlias>-->
        <!--<typeAlias type="com.atguigu.mybatis.bean.User" alias="user">
        </typeAlias>-->
        <!-- See note 5 below. -->
        <package name="com.atguigu.mybatis.bean"/>
    </typeAliases>
    <!-- See note 6 below. -->
    <environments default="mysql_test">
        <!-- See note 7 below. -->
        <environment id="mysql_test">
            <!-- See note 8 below. -->
            <transactionManager type="JDBC"/>
            <!-- See note 9 below. -->
            <dataSource type="POOLED">
                <!-- See note 10 below. -->
                <property name="driver" value="${jdbc.driver}"/>
                <!-- See note 11 below. -->
                <property name="url" value="${jdbc.url}"/>
                <!-- See note 12 below. -->
                <property name="username" value="${jdbc.username}"/>
                <!-- See note 13 below. -->
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>
    <!-- See note 14 below. -->
    <mappers>
        <!-- <mapper resource="UserMapper.xml"/> -->
        <!-- See note 15 below. -->
        <package name="com.atguigu.mybatis.mapper"/>
    </mappers>
</configuration>
```

例の説明：

1. properties ファイルを読み込み、${プロパティ名} の形式で値にアクセスする
2. テーブルのアンダースコア区切りのカラム名を、自動的にキャメルケースへ変換する
3. 遅延読み込みを有効にする
4. typeAlias：特定の型のエイリアスを設定する。属性：type は対象の型の完全修飾名。alias は大文字小文字を区別しない別名を指定する。省略した場合、クラス名が既定のエイリアスになる。
5. パッケージ内のすべての型に既定のエイリアスを設定する。エイリアスはクラス名で、大文字小文字を区別しない。
6. environments：複数のデータベース接続環境を設定する。属性：default で既定の環境の id を指定する。
7. environment：具体的なデータベース接続環境を設定する。属性：id は環境の一意の識別子。environments タグの default にその id を設定すると、既定の環境になる。
8. transactionManager：トランザクション の管理方式を設定する。属性：type は トランザクション の管理方式で、type="JDBC|MANAGED"。type="JDBC" では現在の環境の トランザクション を手動で管理する。type="MANAGED" では トランザクション の管理を委ねる。例：Spring の AOP。
9. dataSource：データソースを設定する。属性：type は種類を指定し、type="POOLED|UNPOOLED|JNDI"。type="POOLED" は接続プールを使い、作成した接続をキャッシュして再利用するため、作り直す必要がない。type="UNPOOLED" はプールを使わず、毎回接続を作成する。type="JNDI" はコンテキストのデータソースを取得する。
10. ドライバーの完全修飾クラス名を設定する
11. データベースの接続 URL を設定する
12. データベース接続のユーザー名を設定する
13. データベース接続のパスワードを設定する
14. マッピングファイルを読み込む
15. パッケージ内のすべてのマッピングファイルをコア設定に読み込む。注意：1. mapper インターフェースとマッピングファイルを同じパッケージに置く必要がある。2. mapper インターフェースとマッピングファイルの名前を一致させる必要がある。

- ![](Resources/mapper接口和mapper映射文件在同一包下.png)

<a id="section-14"></a>

# 既定の型エイリアス :id=h-53a3bd5aca0c

マッピング設定の `resultType` 属性には、データを格納する型（クラスの完全修飾名）を指定します。毎回記述するのは手間がかかるため、Mybatis は簡略化のための `类型别名`（typeAliases）を提供します。

まず、コア設定ファイルで型エイリアスを設定します。pojo パッケージ内の全クラスに、クラス名と同じ、大文字小文字を区別しないエイリアスを付けます。

```xml
<typeAliases>
    <!-- See note 1 below. -->
    <package name="com.itheima.pojo"/>
</typeAliases>

```

例の説明：

1. name 属性の値はエンティティクラスのパッケージ

この設定により、マッピング設定ファイルの `resultType` 属性値を簡略化できます。

```xml
<mapper namespace="com.itheima.mapper.UserMapper">
    <select id="selectAll" resultType="user">
        select * from tb_user;
    </select>
</mapper>
```

![](Resources/默认的类型别名1.png)
![](Resources/默认的类型别名2.png)

<a id="section-15"></a>

# MyBatis による CRUD :id=h-5d6ba39e92cb

1. 追加
   ```xml
   <!--int insertUser();-->
   <insert id="insertUser">
       insert into t_user values(null,'admin','123456',23,'男','12345@qq.com')
   </insert>
   ```
2. 削除
   ```xml
   <!--int deleteUser();-->
   <delete id="deleteUser">
       delete from t_user where id = 6
   </delete>
   ```
3. 更新
   ```xml
   <!--int updateUser();-->
   <update id="updateUser">
       update t_user set username = '张三' where id = 5
   </update>
   ```
4. エンティティオブジェクトの検索
   ```xml
   <!--User getUserById();-->
   <select id="getUserById" resultType="com.atguigu.mybatis.bean.User">
       select * from t_user where id = 2
   </select>
   ```
5. コレクションの検索
   ```xml
   <!--List<User> getUserList();-->
   <select id="getUserList" resultType="com.atguigu.mybatis.bean.User">
       select * from t_user
   </select>
   ```

- 注意：

  1. 検索用の select タグには、エンティティとテーブルの対応を定義する resultType または resultMap 属性が必要です。
     - resultType：プロパティ名とテーブルのカラム名が一致する場合の自動マッピング
     - resultMap：一対多、多対一、またはカラム名とプロパティ名が異なる場合の独自のマッピング
  2. 複数件を検索する場合は、戻り値をエンティティではなくコレクションにする必要があります。そうしなければ TooManyResultsException が発生します。1件だけなら、エンティティでもコレクションでも返せます。

<a id="section-16"></a>

## 1. 設定ファイルによる CRUD の実装 :id=h-29cc920636af

![image-20210729111159534](Resources/image-20210729111159534.png)

上の製品プロトタイプには、ブランドデータの `查询`、`按条件查询`、`添加`、`删除`、`批量删除`、`修改` などがあり、いずれもデータベースの CRUD 操作です。次に、Mybatis でブランドデータの CRUD を実装します。機能一覧は次のとおりです。

> - 検索
>   - 全データの検索
>   - 詳細の検索
>   - 条件付き検索
> - 追加
> - 更新
>   - 全フィールドの更新
>   - フィールドの動的な更新
> - 削除
>   - 1件削除
>   - 一括削除

まず必要な環境を準備します。

### 1.1 環境の準備 :id=h-c9f69e29eca9

- データベースのテーブル（tb_brand）とデータの準備

  ```sql
  -- See note 1 below.
  drop table if exists tb_brand;
  -- See note 2 below.
  create table tb_brand
  (
      -- See note 3 below.
      id           int primary key auto_increment,
      -- See note 4 below.
      brand_name   varchar(20),
      -- See note 5 below.
      company_name varchar(20),
      -- See note 6 below.
      ordered      int,
      -- See note 7 below.
      description  varchar(100),
      -- See note 8 below.
      status       int
  );
  -- See note 9 below.
  insert into tb_brand (brand_name, company_name, ordered, description, status)
  values ('三只松鼠', '三只松鼠股份有限公司', 5, '好吃不上火', 0),
         ('华为', '华为技术有限公司', 100, '华为致力于把数字世界带入每个人、每个家庭、每个组织，构建万物互联的智能世界', 1),
         ('小米', '小米科技有限公司', 50, 'are you ok', 1);
  ```

例の説明：

1. tb_brand テーブルを削除する
2. tb_brand テーブルを作成する
3. id 主キー
4. ブランド名
5. 企業名
6. 並び替え用のフィールド
7. 説明情報
8. 状態：0＝無効、1＝有効
9. データを追加する

- Brand エンティティクラス

  `com.itheima.pojo` パッケージに Brand エンティティクラスを作成します。

  ```java
  public class Brand {
      // See note 1 below.
      private Integer id;
      // See note 2 below.
      private String brandName;
      // See note 3 below.
      private String companyName;
      // See note 4 below.
      private Integer ordered;
      // See note 5 below.
      private String description;
      // See note 6 below.
      private Integer status;

      // See note 7 below.
  }
  ```

例の説明：

1. id 主キー
2. ブランド名
3. 企業名
4. 並び替え用のフィールド
5. 説明情報
6. 状態：0＝無効、1＝有効
7. setter と getter は省略しています。自分で記述するときは補ってください。

- テストケースの作成

  `test/java` ディレクトリにパッケージとテストケースを作成します。構成は次のとおりです。

  <img src="Resources/image-20210729112907106.png" alt="image-20210729112907106" style="zoom:80%;" />

- MyBatisX プラグインのインストール

  - MybatisX は、IDEA を基盤とし、効率向上を目的とする高速開発プラグインです。

  - 主な機能

    - XML のマッピングファイルとインターフェースのメソッド間を相互に移動する
    - インターフェースのメソッドから statement を生成する

  - インストール方法

    `file` をクリックし、`settings` を選択すると、次の画面が表示されます。

    <img src="Resources/image-20210729113304743.png" alt="image-20210729113304743" style="zoom:80%;" />

    > 注意：インストール後は IDEA を再起動してください。

  - プラグインの動作

    <img src="Resources/image-20210729164450524.png" alt="image-20210729164450524" style="zoom:70%;" />

    赤いリボンのアイコンはマッピングファイル、青いリボンは mapper インターフェースを表します。mapper インターフェースで赤いリボンの鳥アイコンを押すと対応するマッピングファイルへ、マッピングファイルで青いリボンを押すと対応する mapper インターフェースへ移動します。また、下図のようにインターフェースにメソッドを定義し、マッピングファイルの `statement` を自動生成できます。

    ![image-20210729165337223](Resources/image-20210729165337223.png)

### 1.2 全データの検索 :id=h-879eee9890f2

<img src="Resources/image-20210729165724838.png" alt="image-20210729165724838" style="zoom:80%;" />

上図のページに表示するデータは、データベースから検索する必要があります。全件検索機能は、次の手順で実装します。

- インターフェースのメソッドを作成する：Mapper インターフェース

  - 引数：なし

    全件検索には条件がないため、このメソッドには引数が不要です。

    <img src="Resources/image-20210729171208737.png" alt="image-20210729171208737" style="zoom:80%;" />

  - 結果：List<Brand>

    検索した各レコードを `Brand` オブジェクトに格納します。複数件なら複数の `Brand` オブジェクトになるため、List コレクションにまとめて返します。

    <img src="Resources/image-20210729171146911.png" alt="image-20210729171146911" style="zoom:80%;" />

  - メソッドを実行してテストする

#### 1.2.1 インターフェースのメソッドの作成 :id=h-c371505186d4

`com.itheima.mapper` パッケージに `BrandMapper` インターフェースを作成し、`List<Brand> selectAll()` メソッドを定義します。

```java
public interface BrandMapper {

    /* See note 1 below. */
    List<Brand> selectAll();
}
```

例の説明：

1. 全件検索

#### 1.2.2 SQL 文の記述 :id=h-36af81fae153

`reources` の下に `com/itheima/mapper` というディレクトリ構成を作成し、その中に `BrandMapper.xml` マッピング設定ファイルを作成します。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.itheima.mapper.BrandMapper">
    <select id="selectAll" resultType="brand">
        select *
        from tb_brand;
    </select>
</mapper>
```

#### 1.2.3 テストメソッドの作成 :id=h-a2d4e460ff88

`MybatisTest` クラスに、全件検索をテストするメソッドを作成します。

```java
@Test
public void testSelectAll() throws IOException {
    // See note 1 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

    // See note 2 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();

    // See note 3 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);

    // See note 4 below.
    List<Brand> brands = brandMapper.selectAll();
    System.out.println(brands);

    // See note 5 below.
    sqlSession.close();

}
```

例の説明：

1. 1. SqlSessionFactory を取得する
2. 2. SqlSession オブジェクトを取得する
3. 3. Mapper インターフェースのプロキシオブジェクトを取得する
4. 4. メソッドを実行する
5. 5. リソースを解放する

> 今はテストコードの記述が面倒に感じるかもしれませんが、もう少し進めてみましょう。今後は上の手順3だけを書けばよく、ほかの処理を自分で記述する必要はなくなります。

テストメソッドの実行結果は次のとおりです。

![image-20210729172544230](Resources/image-20210729172544230.png)

結果を見ると、一部のデータは格納されていますが、一部は格納されていません。なぜでしょうか。

解決方法は2つあります。

- カラムに別名を付ける
- resultMap でカラムとプロパティの対応を定義する

#### 1.2.4 別名による解決 :id=h-a39ecf704a06

`brandName` と `companyName` のデータが格納されていません。エンティティのプロパティ名は `brandName` と `companyName` ですが、テーブルのカラム名は `brand_name` と `company_name` です。下図のこの2組の名前を一致させれば解決します。

<img src="Resources/image-20210729173210433.png" alt="image-20210729173210433" style="zoom:80%;" />

SQL 文で、この2つのカラムにプロパティ名と同じ別名を付けます。

```xml
<select id="selectAll" resultType="brand">
    select
    id, brand_name as brandName, company_name as companyName, ordered, description, status
    from tb_brand;
</select>
```

上の SQL 文のカラム一覧は記述が面倒です。カラムが増え、ほかの機能でも同じカラムを検索する場合、コードが冗長になります。Mybatis の `sql` フラグメントで SQL の再利用性を高められます。

**SQL フラグメント：**

- 再利用する SQL の部分を `sql` タグに切り出します。

  ```xml
  <sql id="brand_column">
      id, brand_name as brandName, company_name as companyName, ordered, description, status
  </sql>
  ```

  id 属性が一意の識別子であり、参照するときにもこの値を使用します。

- 元の SQL 文から参照します。

  `include` タグで SQL フラグメントを参照し、`refid` にその SQL フラグメントの id を指定します。

  ```xml
  <select id="selectAll" resultType="brand">
      select
      <include refid="brand_column" />
      from tb_brand;
  </select>
  ```

#### 1.2.5 resultMap による解決 :id=h-589d45f8ce86

別名と SQL フラグメントで解決できますが、制約もあります。一部のカラムだけを検索する機能では、別の SQL フラグメントを定義する必要があり、柔軟性に欠けます。

別の方法として、resultMap でカラムとプロパティの対応を定義できます。

- マッピング設定ファイルの resultMap で、カラムとプロパティの対応を定義する

  ```xml
  <resultMap id="brandResultMap" type="brand">
      <!-- See note 1 below. -->
      <result column="brand_name" property="brandName"/>
      <result column="company_name" property="companyName"/>
  </resultMap>
  ```

例の説明：

1. id：主キーカラムをマッピングする。column：テーブルのカラム名。property：エンティティのプロパティ名。result：通常のカラムをマッピングする。column：テーブルのカラム名。property：エンティティのプロパティ名。

> 注意：カラム名とプロパティ名が異なるものだけを定義します。同じ名前なら、個別の定義は不要です。

- SQL 文は通常どおり記述します。

  ```xml
  <select id="selectAll" resultMap="brandResultMap">
      select *
      from tb_brand;
  </select>
  ```

#### 1.2.6 まとめ :id=h-d8a9f9970f47

エンティティのプロパティ名とテーブルのカラム名が異なると、自動でデータを格納できません。

- \==別名：== SQL 文で、異なるカラム名にエンティティのプロパティ名と同じ別名を付けます。
  - <sql> フラグメントを定義して再利用性を高められます。
- \==resultMap：== <resultMap> を定義し、異なるプロパティ名とカラム名を対応付けます。

最終的に resultMap を使用します。マッピング設定ファイルの全件検索用の statement は次のとおりです。

```xml
 <resultMap id="brandResultMap" type="brand">
     <!-- See note 1 below. -->
     <result column="brand_name" property="brandName"/>
     <result column="company_name" property="companyName"/>
</resultMap>



<select id="selectAll" resultMap="brandResultMap">
    select *
    from tb_brand;
</select>
```

例の説明：

1. id：主キーカラムをマッピングする。column：テーブルのカラム名。property：エンティティのプロパティ名。result：通常のカラムをマッピングする。column：テーブルのカラム名。property：エンティティのプロパティ名。

### 1.3 詳細の検索 :id=h-19e09cd0e83a

<img src="Resources/image-20210729180118287.png" alt="image-20210729180118287" style="zoom:80%;" />

プロパティが多いデータでは、ページの表には一部しか表示できません。残りのプロパティは、上図のように `查看详情` で検索できます。

詳細表示機能の実装手順：

- インターフェースのメソッドを作成する：Mapper インターフェース

  <img src="Resources/image-20210729180604529.png" alt="image-20210729180604529" style="zoom:80%;" />

  - 引数：id

    詳細表示は1行のデータを検索するため、id で検索します。id は後でページから渡されます。

  - 結果：Brand

    id で検索すると1件だけ取得するため、Brand オブジェクト1つに格納できます。

- SQL 文を記述する：SQL マッピングファイル

  <img src="Resources/image-20210729180709318.png" alt="image-20210729180709318" style="zoom:80%;" />

- メソッドを実行してテストする

#### 1.3.1 インターフェースのメソッドの作成 :id=h-2e55a7139a87

`BrandMapper` インターフェースに、id で検索するメソッドを定義します。

```java
/* See note 1 below. */
Brand selectById(int id);
```

例の説明：

1. 詳細表示：Id による検索

#### 1.3.2 SQL 文の記述 :id=h-30559ef666b1

`BrandMapper.xml` マッピング設定ファイルに `statement` を記述し、`resultType` ではなく `resultMap` を使用します。

```xml
<select id="selectById"  resultMap="brandResultMap">
    select *
    from tb_brand where id = #{id};
</select>
```

> 注意：上の SQL 内の #{id} は、今はこのまま記述します。後ほど詳しく説明します。

#### 1.3.3 テストメソッドの作成 :id=h-651cf6f7004c

`test/java` の下の `com.itheima.mapper` パッケージにある `MybatisTest类中` にテストメソッドを定義します。

```java
 @Test
public void testSelectById() throws IOException {
    // See note 1 below.
    int id = 1;

    // See note 2 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

    // See note 3 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();

    // See note 4 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);

    // See note 5 below.
    Brand brand = brandMapper.selectById(id);
    System.out.println(brand);

    // See note 6 below.
    sqlSession.close();
}
```

例の説明：

1. 引数を受け取る。この id は後で外部から渡される
2. 1. SqlSessionFactory を取得する
3. 2. SqlSession オブジェクトを取得する
4. 3. Mapper インターフェースのプロキシオブジェクトを取得する
5. 4. メソッドを実行する
6. 5. リソースを解放する

テストメソッドの実行結果は次のとおりです。

<img src="Resources/image-20210729182223137.png" alt="image-20210729182223137" style="zoom:70%;" />

#### 1.3.4 パラメーターのプレースホルダー :id=h-a7586c9f2b5e

結果は id が1の行です。コンソールの SQL 文を見ると、? がプレースホルダーとして使われています。つまり、マッピング設定ファイルの `#{id}` は最終的に ? になります。次に、このパラメーターのプレースホルダーを説明します。

mybatis は2種類のパラメータープレースホルダーを提供します。

- \#{}：SQL の実行時に #{} を ? に置き換え、自動でパラメーター値を設定します。上の例のように、#{} は内部で `PreparedStatement` を使用します。

- ${}：テキストを SQL に直接連結するため、SQL インジェクションの原因になります。使用する JDBC 文の種類は statementType が決め、既定値は PreparedStatement です。${} を使っても、自動で Statement に切り替わるわけではありません。下図のように #{} を ${} に置き換えて動作を確認します。

  ```xml
  <select id="selectById"  resultMap="brandResultMap">
      select *
      from tb_brand where id = ${id};
  </select>
  ```

  再実行すると、結果は次のようになります。

  <img src="Resources/image-20210729184156019.png" alt="image-20210729184156019" style="zoom:70%;" />

> \==注意：== この2つの例から、今後の開発では #{} のパラメータープレースホルダーを使用します。

#### 1.3.5 parameterType の使用 :id=h-a1b22b887c47

引数のある mapper メソッドでは、マッピング設定ファイルの `ParameterType` で引数の型を指定します。ただし、下図のようにこの属性は省略できます。

```xml
<select id="selectById" parameterType="int" resultMap="brandResultMap">
    select *
    from tb_brand where id = ${id};
</select>
```

#### 1.3.6 SQL 文の特殊文字の扱い :id=h-3ea4f26bd133

SQL 文では、下図のようにカラムがある値より大きいかを比較するなど、特殊文字を使用する場合があります。

<img src="Resources/image-20210729184756094.png" alt="image-20210729184756094" style="zoom:80%;" />

エラーが出るのは、マッピング設定ファイルが XML であり、> や < が特別な意味を持つためです。次の2つの方法でこれらをエスケープできます。

- エスケープ表記

  下図の `&lt;` は、`<` のエスケープ表記です。

  <img src="Resources/image-20210729185128686.png" alt="image-20210729185128686" style="zoom:60%;" />

- <![CDATA[内容]]>

  <img src="Resources/image-20210729185030318.png" alt="image-20210729185030318" style="zoom:60%;" />

### 1.4 複数条件の検索 :id=h-307c99fc650c

![image-20210729203804276](Resources/image-20210729203804276.png)

上図のように複数条件で検索し、その結果を下の一覧に表示する機能はよくあります。実装するには、最終的な SQL 文について次の2点を考えます。

- 条件式
- 条件の結合方法

条件のカラム `企业名称` と `品牌名称` はあいまい検索が必要なので、条件は次のようになります。

<img src="Resources/image-20210729204458815.png" alt="image-20210729204458815" style="zoom:70%;" />

簡単に分析できたので、実装手順を見てみます。

- インターフェースのメソッドを作成する
  - 引数：すべての検索条件
  - 結果：List<Brand>

- マッピング設定ファイルに SQL 文を記述する

- テストメソッドを作成して実行する

#### 1.4.1 インターフェースのメソッドの作成 :id=h-26dbe9979403

`BrandMapper` インターフェースに、複数条件で検索するメソッドを定義します。

この機能には3つの引数があるため、インターフェースでの定義方法を考える必要があります。Mybatis は複数引数に対していくつかの方法を提供します。

- 各引数に `@Param("参数名称")` を付け、マッピング設定ファイルでは `#{参数名称}` をプレースホルダーとして使用します。

  ```java
  List<Brand> selectByCondition(@Param("status") int status, @Param("companyName") String companyName,@Param("brandName") String brandName);
  ```

- 複数の値を1つのエンティティオブジェクトにまとめ、メソッドの引数にします。マッピング設定ファイルの SQL で `#{内容}` を使うとき、中の名前はエンティティのプロパティ名と一致させます。

  ```java
  List<Brand> selectByCondition(Brand brand);
  ```

- 複数の値を map にまとめ、メソッドの引数にします。マッピング設定ファイルの SQL で `#{内容}` を使うとき、中の名前は map のキーと一致させます。

  ```
  List<Brand> selectByCondition(Map map);
  ```

#### 1.4.2 SQL 文の記述 :id=h-195ad6e98b54

`BrandMapper.xml` マッピング設定ファイルに `statement` を記述し、`resultType` ではなく `resultMap` を使用します。

```xml
<select id="selectByCondition" resultMap="brandResultMap">
    select *
    from tb_brand
    where status = #{status}
    and company_name like #{companyName}
    and brand_name like #{brandName}
</select>
```

#### 1.4.3 テストメソッドの作成 :id=h-025bfbfed913

`test/java` の下の `com.itheima.mapper` パッケージにある `MybatisTest类中` にテストメソッドを定義します。

```java
@Test
public void testSelectByCondition() throws IOException {
    // See note 1 below.
    int status = 1;
    String companyName = "华为";
    String brandName = "华为";

    // See note 2 below.
    companyName = "%" + companyName + "%";
    brandName = "%" + brandName + "%";

    // See note 3 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    // See note 4 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();
    // See note 5 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);

    // See note 6 below.
    // See note 7 below.
    //List<Brand> brands = brandMapper.selectByCondition(status, companyName, brandName);
    // See note 8 below.
     // See note 9 below.
    /* Brand brand = new Brand();
        brand.setStatus(status);
        brand.setCompanyName(companyName);
        brand.setBrandName(brandName);*/

    //List<Brand> brands = brandMapper.selectByCondition(brand);

    // See note 10 below.
    Map map = new HashMap();
    map.put("status" , status);
    map.put("companyName", companyName);
    map.put("brandName" , brandName);
    List<Brand> brands = brandMapper.selectByCondition(map);
    System.out.println(brands);

    // See note 11 below.
    sqlSession.close();
}
```

例の説明：

1. 引数を受け取る
2. 引数を処理する
3. 1. SqlSessionFactory を取得する
4. 2. SqlSession オブジェクトを取得する
5. 3. Mapper インターフェースのプロキシオブジェクトを取得する
6. 4. メソッドを実行する
7. 方法1：引数に @Param を使うインターフェースのメソッドを呼ぶ
8. 方法2：引数がエンティティオブジェクトのメソッドを呼ぶ
9. データをオブジェクトに格納する
10. 方法3：引数が map オブジェクトのメソッドを呼ぶ
11. 5. リソースを解放する

#### 1.4.4 動的 SQL :id=h-22435506342f

上の実装には大きな問題があります。ユーザーがすべての条件を入力するとは限らないため、SQL 文を固定したままにはできません。

現在の状態だけを指定した場合、SQL 文は次のようになります。

```sql
select * from tb_brand where status = #{status}
```

企業名だけを入力した場合、SQL 文は次のようになります。

```sql
select * from tb_brand where company_name like #{companName}
```

`当前状态` と `企业名称 ` を入力した場合は、SQL 文がまた変わります。

```sql
select * from tb_brand where status = #{status} and company_name like #{companName}
```

このような要件に対応するため、Mybatis は動的 SQL を強力にサポートしています。

> - if
>
> - choose (when, otherwise)
>
> - trim (where, set)
>
> - foreach

まず if タグと where タグを学びます。

- if タグ：条件判定

  - test 属性：論理式

  ```xml
  <select id="selectByCondition" resultMap="brandResultMap">
      select *
      from tb_brand
      where
          <if test="status != null">
              and status = #{status}
          </if>
          <if test="companyName != null and companyName != '' ">
              and company_name like #{companyName}
          </if>
          <if test="brandName != null and brandName != '' ">
              and brand_name like #{brandName}
          </if>
  </select>
  ```

  この SQL 文は、渡した引数に応じて動的に組み立てられます。status と companyName に値があれば、この2つの条件だけを連結します。

  実行結果は次のとおりです。

  ![image-20210729212510291](Resources/image-20210729212510291.png)

  ただし、引数の値が次の場合に問題が生じます。

  ```java
  Map map = new HashMap();
  // map.put("status" , status);
  map.put("companyName", companyName);
  map.put("brandName" , brandName);
  ```

  組み立てた SQL 文は次のようになります。

  ```sql
  select * from tb_brand where and company_name like ? and brand_name like ?
  ```

  上の文では where の直後に and が続き、不正な SQL になります。where タグで解決できます。

- where タグ

  - 役割：
    - where キーワードを置き換える
    - 最初の条件の前にある and を動的に除去する
    - すべての引数に値がなければ、where を追加しない

  ```xml
  <select id="selectByCondition" resultMap="brandResultMap">
      select *
      from tb_brand
      <where>
          <if test="status != null">
              and status = #{status}
          </if>
          <if test="companyName != null and companyName != '' ">
              and company_name like #{companyName}
          </if>
          <if test="brandName != null and brandName != '' ">
              and brand_name like #{brandName}
          </if>
      </where>
  </select>
  ```

  > 注意：各条件の前に and を付ける必要があります。

### 1.5 単一条件（動的 SQL） :id=h-1ba926a2538b

<img src="Resources/image-20210729213613029.png" alt="image-20210729213613029" style="zoom:80%;" />

上図では `品牌名称`、`当前状态`、`企业名称` のうち1つだけを選んで検索しますが、どれを選ぶかは事前に分かりません。これが単一条件の動的 SQL です。

この要件は `choose（when，otherwise）标签` で実装します。`choose` タグは、Java の switch 文に似ています。

例を通してこれらのタグを使ってみます。

#### 1.5.1 インターフェースのメソッドの作成 :id=h-b68476efb750

`BrandMapper` インターフェースに、単一条件で検索するメソッドを定義します。

```java
/* See note 1 below. */
List<Brand> selectByConditionSingle(Brand brand);
```

例の説明：

1. 単一条件の動的な検索；@param brand；@return

#### 1.5.2 SQL 文の記述 :id=h-211e1f6c9637

`BrandMapper.xml` マッピング設定ファイルに `statement` を記述し、`resultType` ではなく `resultMap` を使用します。

```xml
<select id="selectByConditionSingle" resultMap="brandResultMap">
    select *
    from tb_brand
    <where>
        <choose><!-- See note 1 below. -->
            <when test="status != null"><!-- See note 2 below. -->
                status = #{status}
            </when>
            <when test="companyName != null and companyName != '' "><!-- See note 3 below. -->
                company_name like #{companyName}
            </when>
            <when test="brandName != null and brandName != ''"><!-- See note 4 below. -->
                brand_name like #{brandName}
            </when>
        </choose>
    </where>
</select>
```

例の説明：

1. switch に相当する
2. case に相当する
3. case に相当する
4. case に相当する

#### 1.5.3 テストメソッドの作成 :id=h-af0b7c4dfd73

`test/java` の下の `com.itheima.mapper` パッケージにある `MybatisTest类中` にテストメソッドを定義します。

```java
@Test
public void testSelectByConditionSingle() throws IOException {
    // See note 1 below.
    int status = 1;
    String companyName = "华为";
    String brandName = "华为";

    // See note 2 below.
    companyName = "%" + companyName + "%";
    brandName = "%" + brandName + "%";

    // See note 3 below.
    Brand brand = new Brand();
    //brand.setStatus(status);
    brand.setCompanyName(companyName);
    //brand.setBrandName(brandName);

    // See note 4 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    // See note 5 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();
    // See note 6 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);
    // See note 7 below.
    List<Brand> brands = brandMapper.selectByConditionSingle(brand);
    System.out.println(brands);

    // See note 8 below.
    sqlSession.close();
}
```

例の説明：

1. 引数を受け取る
2. 引数を処理する
3. データをオブジェクトに格納する
4. 1. SqlSessionFactory を取得する
5. 2. SqlSession オブジェクトを取得する
6. 3. Mapper インターフェースのプロキシオブジェクトを取得する
7. 4. メソッドを実行する
8. 5. リソースを解放する

テストメソッドの実行結果は次のとおりです。

<img src="Resources/image-20210729214548756.png" alt="image-20210729214548756" style="zoom:70%;" />

### 1.6 データの追加 :id=h-87c7dd18b6f7

<img src="Resources/image-20210729214917317.png" alt="image-20210729214917317" style="zoom:70%;" />

上図は、通常データを追加するときの画面です。値を入力して `提交` ボタンを押すと、データベースに追加されます。この操作を実装します。

- インターフェースのメソッドを作成する

  <img src="Resources/image-20210729215351651.png" alt="image-20210729215351651" style="zoom:80%;" />

  引数：id 以外のすべてのデータ。id はテーブルの主キーで、==自動採番== で生成します。

- SQL 文を記述する

  <img src="Resources/image-20210729215537167.png" alt="image-20210729215537167" style="zoom:80%;" />

- テストメソッドを作成して実行する

実装手順が分かったので、具体的な操作に進みます。

#### 1.6.1 インターフェースのメソッドの作成 :id=h-36f6c58b02d0

`BrandMapper` インターフェースに追加メソッドを定義します。

```java
 /* See note 1 below. */
void add(Brand brand);
```

例の説明：

1. 追加

#### 1.6.2 SQL 文の記述 :id=h-21b31ff5c4a6

`BrandMapper.xml` マッピング設定ファイルに、データを追加する `statement` を記述します。

```xml
<insert id="add">
    insert into tb_brand (brand_name, company_name, ordered, description, status)
    values (#{brandName}, #{companyName}, #{ordered}, #{description}, #{status});
</insert>
```

#### 1.6.3 テストメソッドの作成 :id=h-dfc1f7b9d89d

`test/java` の下の `com.itheima.mapper` パッケージにある `MybatisTest类中` にテストメソッドを定義します。

```java
@Test
public void testAdd() throws IOException {
    // See note 1 below.
    int status = 1;
    String companyName = "波导手机";
    String brandName = "波导";
    String description = "手机中的战斗机";
    int ordered = 100;

    // See note 2 below.
    Brand brand = new Brand();
    brand.setStatus(status);
    brand.setCompanyName(companyName);
    brand.setBrandName(brandName);
    brand.setDescription(description);
    brand.setOrdered(ordered);

    // See note 3 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    // See note 4 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();
    // See note 5 below.
    // See note 6 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);
    // See note 7 below.
    brandMapper.add(brand);
    // See note 8 below.
    sqlSession.commit();
    // See note 9 below.
    sqlSession.close();
}
```

例の説明：

1. 引数を受け取る
2. データをオブジェクトに格納する
3. 1. SqlSessionFactory を取得する
4. 2. SqlSession オブジェクトを取得する
5. SqlSession sqlSession = sqlSessionFactory.openSession(true); // Enable automatic トランザクション commit; no manual トランザクション commit is needed
6. 3. Mapper インターフェースのプロキシオブジェクトを取得する
7. 4. メソッドを実行する
8. トランザクション をコミットする
9. 5. リソースを解放する

実行結果は次のとおりです。

![image-20210729220348255](Resources/image-20210729220348255.png)

#### 1.6.4 追加：主キーの取得 :id=h-dd906c42cf11

データの追加後に、自動採番された主キーを取得する必要がある場合があります。

例えば、注文と注文明細の追加です。下図は JD.com の注文を示しています。

<img src="Resources/image-20210729221207962.png" alt="image-20210729221207962" style="zoom:80%;" />

注文データは注文テーブル、注文明細は注文明細テーブルに保存します。

- 注文データを追加する

  <img src="Resources/image-20210729221049462.png" alt="image-20210729221049462" style="zoom:80%;" />

- 注文明細に所属する注文の id を設定して追加する

  <img src="Resources/image-20210729221058898.png" alt="image-20210729221058898" style="zoom:80%;" />

`主键返回` が必要な場面が分かりました。追加後に id プロパティの値を表示して、取得できたことを確認します。

ブランド追加例のマッピング設定ファイル内の `statement` を、次のように変更します。

```xml
<insert id="add" useGeneratedKeys="true" keyProperty="id">
    insert into tb_brand (brand_name, company_name, ordered, description, status)
    values (#{brandName}, #{companyName}, #{ordered}, #{description}, #{status});
</insert>
```

> insert タグに次の属性を追加します。
>
> - useGeneratedKeys：自動採番された主キーを取得するかどうか。true で取得する
> - keyProperty：取得した主キーを格納するプロパティ

### 1.7 更新 :id=h-d6a08d1b2003

<img src="Resources/image-20210729222642700.png" alt="image-20210729222642700" style="zoom:80%;" />

図の編集画面で値を入力し、`提交` ボタンを押すと、対応するデータベースのデータを更新します。入力欄が空なら、そのカラムを空にするか、元の値を残すかを考える必要があります。ここでは元のデータを残します。

次に実装します。

#### 1.7.1 インターフェースのメソッドの作成 :id=h-422bef540f96

`BrandMapper` インターフェースに更新メソッドを定義します。

```java
 /* See note 1 below. */
void update(Brand brand);
```

例の説明：

1. 更新

> 引数 Brand は更新するデータを保持します。追加メソッドと異なり、id にも必ず値があります。

#### 1.7.2 SQL 文の記述 :id=h-bac4984faaec

`BrandMapper.xml` マッピング設定ファイルに、更新用の `statement` を記述します。

```xml
<update id="update">
    update tb_brand
    <set>
        <if test="brandName != null and brandName != ''">
            brand_name = #{brandName},
        </if>
        <if test="companyName != null and companyName != ''">
            company_name = #{companyName},
        </if>
        <if test="ordered != null">
            ordered = #{ordered},
        </if>
        <if test="description != null and description != ''">
            description = #{description},
        </if>
        <if test="status != null">
            status = #{status}
        </if>
    </set>
    where id = #{id};
</update>
```

> *set* タグは、更新するカラムを動的に含め、更新しないカラムを除外できます。

#### 1.7.3 テストメソッドの作成 :id=h-a47ee1dfdcd2

`test/java` の下の `com.itheima.mapper` パッケージにある `MybatisTest类中` にテストメソッドを定義します。

```java
@Test
public void testUpdate() throws IOException {
    // See note 1 below.
    int status = 0;
    String companyName = "波导手机";
    String brandName = "波导";
    String description = "波导手机,手机中的战斗机";
    int ordered = 200;
    int id = 6;

    // See note 2 below.
    Brand brand = new Brand();
    brand.setStatus(status);
    //        brand.setCompanyName(companyName);
    //        brand.setBrandName(brandName);
    //        brand.setDescription(description);
    //        brand.setOrdered(ordered);
    brand.setId(id);

    // See note 3 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    // See note 4 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();
    //SqlSession sqlSession = sqlSessionFactory.openSession(true);
    // See note 5 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);
    // See note 6 below.
    int count = brandMapper.update(brand);
    System.out.println(count);
    // See note 7 below.
    sqlSession.commit();
    // See note 8 below.
    sqlSession.close();
}
```

例の説明：

1. 引数を受け取る
2. データをオブジェクトに格納する
3. 1. SqlSessionFactory を取得する
4. 2. SqlSession オブジェクトを取得する
5. 3. Mapper インターフェースのプロキシオブジェクトを取得する
6. 4. メソッドを実行する
7. トランザクション をコミットする
8. 5. リソースを解放する

テストメソッドの実行結果は次のとおりです。

![image-20210729224205522](Resources/image-20210729224205522.png)

結果の SQL 文を見ると、Brand の `status` プロパティだけに値を設定したため、`status` だけが更新されています。これが `set` タグの役割です。

### 1.8 1行の削除 :id=h-a5b7f9512a90

![image-20210729224549305](Resources/image-20210729224549305.png)

上図の各行には `删除` ボタンがあり、押すとその行を削除します。削除対象の特定には、テーブル内のデータを一意に識別する主キー id を使います。

次に、この機能を実装します。

#### 1.8.1 インターフェースのメソッドの作成 :id=h-2cfe338844f2

`BrandMapper` インターフェースに、id で削除するメソッドを定義します。

```java
/* See note 1 below. */
void deleteById(int id);
```

例の説明：

1. id による削除

#### 1.8.2 SQL 文の記述 :id=h-0453e7c196ba

`BrandMapper.xml` マッピング設定ファイルに、1行削除用の `statement` を記述します。

```xml
<delete id="deleteById">
    delete from tb_brand where id = #{id};
</delete>
```

#### 1.8.3 テストメソッドの作成 :id=h-7348a39c258c

`test/java` の下の `com.itheima.mapper` パッケージにある `MybatisTest类中` にテストメソッドを定義します。

```java
 @Test
public void testDeleteById() throws IOException {
    // See note 1 below.
    int id = 6;

    // See note 2 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    // See note 3 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();
    //SqlSession sqlSession = sqlSessionFactory.openSession(true);
    // See note 4 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);
    // See note 5 below.
    brandMapper.deleteById(id);
    // See note 6 below.
    sqlSession.commit();
    // See note 7 below.
    sqlSession.close();
}
```

例の説明：

1. 引数を受け取る
2. 1. SqlSessionFactory を取得する
3. 2. SqlSession オブジェクトを取得する
4. 3. Mapper インターフェースのプロキシオブジェクトを取得する
5. 4. メソッドを実行する
6. トランザクション をコミットする
7. 5. リソースを解放する

実行中にエラーがなければ、データベースを直接検索し、データが残っているか確認します。

### 1.9 一括削除 :id=h-580ff9dad357

<img src="Resources/image-20210729225713894.png" alt="image-20210729225713894" style="zoom:70%;" />

上図では複数のデータを選択し、上部の `删除` ボタンを押すと、対応する複数行をデータベースから削除できます。

#### 1.9.1 インターフェースのメソッドの作成 :id=h-30918aa86815

`BrandMapper` インターフェースに、複数行を削除するメソッドを定義します。

```java
/* See note 1 below. */
void deleteByIds(int[] ids);
```

例の説明：

1. 一括削除

> 引数は、複数のデータの id を格納する配列です。

#### 1.9.2 SQL 文の記述 :id=h-6362a5f02f31

`BrandMapper.xml` マッピング設定ファイルに、複数行削除用の `statement` を記述します。

SQL を記述するときは、配列を反復して SQL 文を組み立てます。Mybatis はそのための `foreach` タグを提供します。

**foreach タグ**

配列やコレクションなど、反復可能なオブジェクトを処理します。

- collection 属性：
  - mybatis は配列の引数を Map に格納します。
    - 既定：array = 配列
    - @Param アノテーションで、map の既定のキー名を変更します。
- item 属性：今回の反復で取得した要素。
- separator 属性：反復する要素間の区切り文字。`foreach` タグは余分な区切りを付けないため、最後の反復の後には追加されません。
- open 属性：SQL 文を組み立てる前に、1回だけ付加する文字列。
- close 属性：SQL 文を組み立てた後に、1回だけ付加する文字列。

```xml
<delete id="deleteByIds">
    delete from tb_brand where id
    in
    <foreach collection="array" item="id" separator="," open="(" close=")">
        #{id}
    </foreach>
    ;
</delete>
```

> id の配列が {1,2,3} の場合、組み立てた SQL 文は次のようになります。
>
> ```sql
> delete from tb_brand where id in (1,2,3);
> ```

#### 1.9.3 テストメソッドの作成 :id=h-b34189b09df5

`test/java` の下の `com.itheima.mapper` パッケージにある `MybatisTest类中` にテストメソッドを定義します。

```java
@Test
public void testDeleteByIds() throws IOException {
    // See note 1 below.
    int[] ids = {5,7,8};

    // See note 2 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    // See note 3 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();
    //SqlSession sqlSession = sqlSessionFactory.openSession(true);
    // See note 4 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);
    // See note 5 below.
    brandMapper.deleteByIds(ids);
    // See note 6 below.
    sqlSession.commit();
    // See note 7 below.
    sqlSession.close();
}
```

例の説明：

1. 引数を受け取る
2. 1. SqlSessionFactory を取得する
3. 2. SqlSession オブジェクトを取得する
4. 3. Mapper インターフェースのプロキシオブジェクトを取得する
5. 4. メソッドを実行する
6. トランザクション をコミットする
7. 5. リソースを解放する

### 1.10 Mybatis の引数の受け渡し :id=h-e2d53169bf09

Mybatis のインターフェースメソッドは、次のような引数を受け取れます。

- 複数の引数
- 単一の引数：次の型がある
  - POJO 型
  - Map コレクション型
  - Collection コレクション型
  - List コレクション型
  - Array 型
  - その他の型

#### 1.10.1 複数の引数 :id=h-2b516aec3036

次のコードは2つの引数を受け取ります。複数の引数では `@Param` アノテーションが必要ですが、なぜでしょうか。Mybatis 内部の引数処理を確認します。

```java
User select(@Param("username") String username,@Param("password") String password);
```

```xml
<select id="select" resultType="user">
    select *
    from tb_user
    where
        username=#{username}
        and password=#{password}
</select>
```

Mybatis は複数の引数を Map に格納します。値は各引数の値で、`@Param` を付けない場合、キーには次の命名規則を使用します。

- arg で始まる名前：最初は arg0、2番目は arg1、という順になります。例：

  > map.put("arg0", 引数値1);
  >
  > map.put("arg1", 引数値2);

- param で始まる名前：最初は param1、2番目は param2、という順になります。例：

  > map.put("param1", 引数値1);
  >
  > map.put("param2", 引数値2);

**コードで確認：**

- `UserMapper` インターフェースに、次のメソッドを定義します。

  ```java
  User select(String username,String password);
  ```

- `UserMapper.xml` マッピング設定ファイルに SQL を定義します。

  ```xml
  <select id="select" resultType="user">
      select *
      from tb_user
      where
          username=#{arg0}
          and password=#{arg1}
  </select>
  ```

  または

  ```xml
  <select id="select" resultType="user">
      select *
      from tb_user
      where
          username=#{param1}
          and password=#{param2}
  </select>
  ```

- コードの実行結果は次のとおりです。

  <img src="Resources/image-20210805230303461.png" alt="image-20210805230303461" style="zoom:80%;" />

  マッピング設定ファイルの SQL 文で `arg` や `param` の名前を使うと、可読性が低くなります。そこで `@Param` アノテーションを使用できます。

インターフェースの引数に `@Param` を付けると、Mybatis は `arg` で始まるキーを、アノテーションの値に置き換えます。

**コードで確認：**

- `UserMapper` インターフェースに次のメソッドを定義し、`username` 引数に `@Param` を付けます。

  ```java
  User select(@Param("username") String username, String password);
  ```

  Mybatis が Map を作成するとき、キーは次のようになります。

  > map.put("username", 引数値1);
  >
  > map.put("arg1", 引数値2);
  >
  > map.put("param1", 引数値1);
  >
  > map.put("param2", 引数値2);

- `UserMapper.xml` マッピング設定ファイルに SQL を定義します。

  ```xml
  <select id="select" resultType="user">
      select *
      from tb_user
      where
          username=#{username}
          and password=#{param2}
  </select>
  ```

- プログラムはエラーなく実行できます。ただし、`#{}` の `username` を `arg0` のままにすると、

  ```xml
  <select id="select" resultType="user">
      select *
      from tb_user
      where
          username=#{arg0}
          and password=#{param2}
  </select>
  ```

- 実行時にエラーが表示されます。

  ![image-20210805231727206](Resources/image-20210805231727206.png)

\==結論：インターフェースに複数の引数がある場合は、各引数に `@Param` を付けて可読性を高めます。==

#### 1.10.2 単一の引数 :id=h-6b3e7abb2d1e

- POJO 型

  そのまま使用します。`属性名` と `参数占位符名称` を一致させる必要があります。

- Map コレクション型

  そのまま使用します。`map集合的键名` と `参数占位符名称` を一致させる必要があります。

- Collection コレクション型

  Mybatis はコレクションを次のように map に格納します。

  > map.put("arg0", collection コレクション);
  >
  > map.put("collection", collection コレクション;

  \==`@Param` アノテーションで、map の既定の arg キー名を置き換えられます。==

- List コレクション型

  Mybatis はコレクションを次のように map に格納します。

  > map.put("arg0", list コレクション);
  >
  > map.put("collection", list コレクション);
  >
  > map.put("list", list コレクション);

  \==`@Param` アノテーションで、map の既定の arg キー名を置き換えられます。==

- Array 型

  Mybatis はコレクションを次のように map に格納します。

  > map.put("arg0", 配列);
  >
  > map.put("array", 配列);

  \==`@Param` アノテーションで、map の既定の arg キー名を置き換えられます。==

- その他の型

  int などの型では、`参数占位符名称` の名前は自由です。意味の分かる名前にしましょう。

<a id="section-17"></a>

## 2. アノテーションによる CRUD の実装 :id=h-780a0c79de5e

設定ファイルよりも、アノテーションを使う方が簡単に開発できます。例を示します。

```java
@Select(value = "select * from tb_user where id = #{id}")
public User select(int id);
```

> \==注意：==
>
> - アノテーションはマッピング設定ファイルの代替なので、対応する `statement` をマッピングファイルに記述する必要はありません。

Mybatis は CURD 操作用に、名前から意味が分かるアノテーションを提供します。

- 検索：@Select
- 追加：@Insert
- 更新：@Update
- 削除：@Delete

次に、例を通して Mybatis のアノテーション開発を行います。

**コードの実装：**

- 前の例の `UserMapper.xml` にある、id 検索用の `statement` をコメントアウトします。

  <img src="Resources/image-20210805235229938.png" alt="image-20210805235229938" style="zoom:70%;" />

- `UserMapper` インターフェースの `selectById` メソッドにアノテーションを追加します。

  <img src="Resources/image-20210805235405070.png" alt="image-20210805235405070" style="zoom:70%;" />

- テストを実行すると、同じようにデータを取得できます。

ここでは検索のアノテーションだけを実演します。ほかの操作も同様に簡単なので、練習として実装してみてください。

\==注意：== 公式ドキュメントの `入门` には、次の説明があります。

![image-20210805234302849](Resources/image-20210805234302849.png)

そのため、==単純な機能にはアノテーション、複雑な機能には設定ファイルを使用します。==

以前の動的 SQL は複雑な機能です。アノテーションで実装するには、Mybatis の SQL ビルダーを使い、次のように記述します。

<img src="Resources/image-20210805234842497.png" alt="image-20210805234842497" style="zoom:70%;" />

このコードは Java と SQL 文が混在し、可読性が大きく下がります。

<a id="section-18"></a>

# MyBatis でパラメーター値を取得する2つの方法（重要） :id=h-6637756c2de2

- MyBatis でパラメーター値を取得する方法は、${} と #{} の2つです。
- ${} は文字列の連結、#{} はプレースホルダーへの値のバインドです。
- ${} は文字列を連結して SQL を作るため、文字列型や日付型の値には手動で単一引用符を付ける必要があります。#{} はプレースホルダーに値をバインドするため、文字列や日付の値を自動で処理でき、単一引用符を手動で付ける必要はありません。
  <a id="section-19"></a>

## 単一のリテラル型パラメーター :id=h-2fb02fd1ec44

- mapper メソッドの引数が単一のリテラル型なら、${} と #{} で任意の名前を使って値を取得できます。意味の分かる名前が望ましく、${} には手動の単一引用符が必要です。

```xml
<!--User getUserByUsername(String username);-->
<select id="getUserByUsername" resultType="User">
    select * from t_user where username = #{username}
</select>
```

```xml
<!--User getUserByUsername(String username);-->
<select id="getUserByUsername" resultType="User">
    select * from t_user where username = '${username}'
</select>
```

<a id="section-20"></a>

## 複数のリテラル型パラメーター :id=h-c6aab81f35d9

- mapper メソッドの引数が複数ある場合、MyBatis は自動で map に格納します。

  1. arg0、arg1... をキー、引数を値にします。
  2. param1、param2... をキー、引数を値にします。
- ${} または #{} で map のキーにアクセスすれば、対応する値を取得できます。${} には手動の単一引用符が必要です。
- arg と param のどちらも使用できますが、arg は arg0、param は param1 から始まります。

```xml
<!--User checkLogin(String username,String password);-->
<select id="checkLogin" resultType="User">
    select * from t_user where username = #{arg0} and password = #{arg1}
</select>
```

```xml
<!--User checkLogin(String username,String password);-->
<select id="checkLogin" resultType="User">
    select * from t_user where username = '${param1}' and password = '${param2}'
</select>
```

<a id="section-21"></a>

## map 型のパラメーター :id=h-3b3b1f89d892

- mapper メソッドに複数の値を渡す場合、自分で map を作成して格納できます。${} または #{} でキーにアクセスすれば値を取得でき、${} には手動の単一引用符が必要です。

```xml
<!--User checkLoginByMap(Map<String,Object> map);-->
<select id="checkLoginByMap" resultType="User">
    select * from t_user where username = #{username} and password = #{password}
</select>
```

```java
@Test
public void checkLoginByMap() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    ParameterMapper mapper = sqlSession.getMapper(ParameterMapper.class);
    Map<String,Object> map = new HashMap<>();
    map.put("usermane","admin");
    map.put("password","123456");
    User user = mapper.checkLoginByMap(map);
    System.out.println(user);
}
```

<a id="section-22"></a>

## エンティティ型のパラメーター :id=h-cd15ba511ba1

- 引数がエンティティオブジェクトなら、${} または #{} でプロパティ名にアクセスして値を取得できます。${} には手動の単一引用符が必要です。

```xml
<!--int insertUser(User user);-->
<insert id="insertUser">
    insert into t_user values(null,#{username},#{password},#{age},#{sex},#{email})
</insert>
```

```java
@Test
public void insertUser() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    ParameterMapper mapper = sqlSession.getMapper(ParameterMapper.class);
    User user = new User(null,"Tom","123456",12,"男","123@321.com");
    mapper.insertUser(user);
}
```

<a id="section-23"></a>

## @Param による引数の識別 :id=h-7ab544ea7ee2

- mapper メソッドの引数を @Param で識別すると、map に格納されます。

  1. @Param の value 属性をキー、引数を値にします。
  2. param1、param2... をキー、引数を値にします。
- ${} または #{} で map のキーにアクセスすれば値を取得できます。${} には手動の単一引用符が必要です。

```xml
<!--User CheckLoginByParam(@Param("username") String username, @Param("password") String password);-->
    <select id="CheckLoginByParam" resultType="User">
        select * from t_user where username = #{username} and password = #{password}
    </select>
```

```java
@Test
public void checkLoginByParam() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    ParameterMapper mapper = sqlSession.getMapper(ParameterMapper.class);
    mapper.CheckLoginByParam("admin","123456");
}
```

<a id="section-24"></a>

## まとめ :id=h-babcaf88289f

- 次の2種類に分けて扱うことを推奨します。

  1. エンティティ型のパラメーター
  2. @Param による引数の識別

<a id="section-25"></a>

# MyBatis の各種検索機能 :id=h-2ad26506c580

1. 検索結果が1件だけの場合、次の方法で受け取れます。
   1. エンティティオブジェクト
   2. List コレクション
   3. Map コレクション。結果は `{password=123456, sex=男, id=1, age=23, username=admin}`
2. 検索結果が複数件なら、エンティティオブジェクトでは受け取れず、TooManyResultsException が発生します。次の方法を使用します。
   1. エンティティ型の LIst コレクション
   2. Map 型の LIst コレクション
   3. mapper メソッドに @MapKey を追加します。
      <a id="section-26"></a>

## エンティティオブジェクトの検索 :id=h-125c6169b04f

```java
/* See note 1 below. */
User getUserById(@Param("id") int id);
```

例の説明：

1. ユーザー id によるユーザー情報の検索；@param id；@return

```xml
<!--User getUserById(@Param("id") int id);-->
<select id="getUserById" resultType="User">
    select * from t_user where id = #{id}
</select>
```

<a id="section-27"></a>

## List コレクションの検索 :id=h-9bd352533f4e

```java
/* See note 1 below. */
List<User> getUserList();
```

例の説明：

1. 全ユーザー情報の検索；@return

```xml
<!--List<User> getUserList();-->
<select id="getUserList" resultType="User">
    select * from t_user
</select>
```

<a id="section-28"></a>

## 単一の値の検索 :id=h-9ffbd7ff6b0b

```java
/* See note 1 below. */
int getCount();
```

例の説明：

1. ユーザーの総件数を検索する；@return。MyBatis では、Java のよく使う型にエイリアスが定義されています。例：java.lang.Integer → int|integer、int → \_int|\_integer、Map → map、List → list。

```xml
<!--int getCount();-->
<select id="getCount" resultType="_integer">
    select count(id) from t_user
</select>
```

<a id="section-29"></a>

## 1件のデータを map として検索 :id=h-829d8666e7c2

```java
/* See note 1 below. */
Map<String, Object> getUserToMap(@Param("id") int id);
```

例の説明：

1. ユーザー id によりユーザー情報を map として検索する；@param id；@return

```xml
<!--Map<String, Object> getUserToMap(@Param("id") int id);-->
<select id="getUserToMap" resultType="map">
    select * from t_user where id = #{id}
</select>
<!-- See note 1 below. -->
```

例の説明：

1. 結果：{password=123456, sex=男性, id=1, age=23, username=admin}

<a id="section-30"></a>

## 複数のデータを map として検索 :id=h-a5b278759a22

### 方法1 :id=h-7367f8d69ba3

```java
/* See note 1 below. */
List<Map<String, Object>> getAllUserToMap();
```

例の説明：

1. 全ユーザー情報を map として検索する；@return。1件が1つの map に対応します。複数件なら複数の map を作成し、list にまとめて取得できます。

```xml
<!--Map<String, Object> getAllUserToMap();-->
<select id="getAllUserToMap" resultType="map">
    select * from t_user
</select>
<!-- See note 1 below. -->
```

例の説明：

1. 結果：\[{password=123456, sex=男性, id=1, age=23, username=admin}, {password=123456, sex=男性, id=2, age=23, username=張三}, {password=123456, sex=男性, id=3, age=23, username=張三}]

### 方法2 :id=h-2f8870fcb873

```java
/* See note 1 below. */
@MapKey("id")
Map<String, Object> getAllUserToMap();
```

例の説明：

1. 全ユーザー情報を map として検索する；@return。1件が1つの map になります。複数の map を最終的に1つの map として返すには、@MapKey でキーを設定します。値は各行に対応する map です。

```xml
<!--Map<String, Object> getAllUserToMap();-->
<select id="getAllUserToMap" resultType="map">
    select * from t_user
</select>
<!-- See note 1 below. -->
```

例の説明：

1. 結果：{1={password=123456, sex=男性, id=1, age=23, username=admin}, 2={password=123456, sex=男性, id=2, age=23, username=張三}, 3={password=123456, sex=男性, id=3, age=23, username=張三}}

<a id="section-31"></a>

# 特殊な SQL の実行 :id=h-9cf1ed312fd7

<a id="section-32"></a>

## あいまい検索 :id=h-1a32c5b91283

```java
/* See note 1 below. */
List<User> getUserByLike(@Param("username") String username);
```

例の説明：

1. ユーザー名によるあいまい検索；@param username；@return java.util.List\<com.atguigu.mybatis.pojo.User>；@date 2022/2/26 21:56

```xml
<!--List<User> getUserByLike(@Param("username") String username);-->
<select id="getUserByLike" resultType="User">
    <!--select * from t_user where username like '%${mohu}%'-->
    <!--select * from t_user where username like concat('%',#{mohu},'%')-->
    select * from t_user where username like concat('%', #{username}, '%')
</select>
```

- 最もよく使われるのは `select * from t_user where username like concat('%', #{username}, '%')` です。
  <a id="section-33"></a>

## 一括削除 :id=h-054feb479839

1つの #{} は1つの値だけをバインドし、文字列 "1,2,3" を3つの引数には展開できません。ID コレクションを渡し、foreach で各 ID のプレースホルダーを作成します。ユーザーが渡した ID のテキストを直接連結してはいけません。

次のメソッドは Mapper インターフェースに定義し、java.util.List と org.apache.ibatis.annotations.Param をインポートします。呼び出し前に null と空リストを拒否してください。空リストによって削除条件が省略されてはいけません。

```java
/* See note 1 below. */
int deleteMore(@Param("ids") List<Integer> ids);
```

例の説明：

1. id による一括削除；@param ids；@return int；@date 2022/2/26 22:06

```xml
<delete id="deleteMore">
    delete from t_user where id in
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</delete>
```

```java
// See note 1 below.
@Test
public void deleteMore() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    SQLMapper mapper = sqlSession.getMapper(SQLMapper.class);
    int result = mapper.deleteMore(java.util.Arrays.asList(1, 2, 3, 8));
    System.out.println(result);
}
```

例の説明：

1. テストクラス

<a id="section-34"></a>

## テーブル名の動的な設定 :id=h-19d8c4095183

- テーブル名はデータの値ではないため、#{} でバインドできません。${} による置き換えが必要なら、プログラムで事前に許可したテーブル名だけに入力を制限します。リクエストパラメーターを直接 SQL に連結してはいけません。固定のテーブルごとにメソッドを作る方法を優先してください。

```java
/* See note 1 below. */
List<User> getUserByTable(@Param("tableName") String tableName);
```

例の説明：

1. 指定したテーブルから検索する；@param tableName；@return java.util.List\<com.atguigu.mybatis.pojo.User>；@date 2022/2/27 14:41

```xml
<!--List<User> getUserByTable(@Param("tableName") String tableName);-->
<select id="getUserByTable" resultType="User">
    select * from ${tableName}
</select>
```

<a id="section-35"></a>

## 追加時に自動採番された主キーを取得 :id=h-b285e80ffcc4

- 使用場面
  - t_clazz(clazz_id,clazz_name)
  - t_student(student_id,student_name,clazz_id)
  1. クラス情報を追加する
  2. 追加したクラスの id を取得する
  3. 生徒の所属クラス id を、新しく追加したクラスの id に更新して、そのクラスに割り当てる
- mapper.xml に2つの属性を設定します。
  - useGeneratedKeys：自動採番の主キーを使用するように設定する
  * keyProperty：追加、更新、削除の戻り値は影響行数で統一されているため、自動採番の主キーは渡した user オブジェクトのプロパティに格納する。

```java
/* See note 1 below. */
void insertUser(User user);
```

例の説明：

1. ユーザー情報の追加；@param user；@date 2022/2/27 15:04

```xml
<!--void insertUser(User user);-->
<insert id="insertUser" useGeneratedKeys="true" keyProperty="id">
    insert into t_user values (null,#{username},#{password},#{age},#{sex},#{email})
</insert>
```

```java
// See note 1 below.
@Test
public void insertUser() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    SQLMapper mapper = sqlSession.getMapper(SQLMapper.class);
    User user = new User(null, "ton", "123", 23, "男", "123@321.com");
    mapper.insertUser(user);
    System.out.println(user);
    // See note 2 below.
}
```

例の説明：

1. テストクラス
2. 出力：user{id=10, username='ton', password='123', age=23, sex='男性', email='<123@321.com>'}。自動採番された主キーが user の id プロパティに格納されています。

<a id="section-36"></a>

# resultMap による独自のマッピング :id=h-7deb5025be51

<a id="section-37"></a>

## resultMap によるカラムとプロパティの対応付け :id=h-eb38e63cd456

- resultMap：独自のマッピングを設定する
  - 属性：
    - id：独自のマッピングの一意の識別子。重複は不可
    - type：検索結果をマッピングするエンティティの型
  - 子タグ：
    - id：主キーのマッピングを設定する
    - result：通常のカラムのマッピングを設定する
    - 子タグの属性：
      - property：マッピング対象のエンティティのプロパティ名
      - column：マッピング対象のテーブルのカラム名
- カラム名とプロパティ名が異なる場合、resultMap で独自のマッピングを設定できます。この例では、名前が一致するプロパティも含め、すべてのプロパティを列挙して対応付けます。

```xml
<resultMap id="empResultMap" type="Emp">
    <id property="eid" column="eid"></id>
    <result property="empName" column="emp_name"></result>
    <result property="age" column="age"></result>
    <result property="sex" column="sex"></result>
    <result property="email" column="email"></result>
</resultMap>
<!--List<Emp> getAllEmp();-->
<select id="getAllEmp" resultMap="empResultMap">
    select * from t_emp
</select>
```

- カラム名はデータベースの規則（\_ 区切り）、プロパティ名は Java の規則（キャメルケース）に従っていて一致しない場合、次の2つの方法でも対応付けられます。

  1. カラムにエンティティのプロパティ名と同じ別名を付けます。
     ```xml
     <!--List<Emp> getAllEmp();-->
     <select id="getAllEmp" resultType="Emp">
         select eid,emp_name empName,age,sex,email from t_emp
     </select>
     ```
  2. MyBatis のコア設定の `setting` タグで、グローバル設定 mapUnderscoreToCamelCase を指定すると、検索時に \_ 区切りのカラム名を自動でキャメルケースに変換します。例えば user_name は、mapUnderscoreToCamelCase を設定すると userName になります。[コア設定ファイルの詳細](#核心配置文件详解)
     ```xml
     ```

    <settings>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>
        ```

<a id="section-38"></a>

## 多対一のマッピング :id=h-a2740435ad51

> 従業員情報と、所属する部門の情報を検索する

```java
public class Emp {
    private Integer eid;
    private String empName;
    private Integer age;
    private String sex;
    private String email;
    private Dept dept;
    // See note 1 below.
}
```

例の説明：

1. …コンストラクター、get、set メソッドなど

### プロパティパスによるマッピング :id=h-a3d5aa93bd8f

```xml
<resultMap id="empAndDeptResultMapOne" type="Emp">
    <id property="eid" column="eid"></id>
    <result property="empName" column="emp_name"></result>
    <result property="age" column="age"></result>
    <result property="sex" column="sex"></result>
    <result property="email" column="email"></result>
    <result property="dept.did" column="did"></result>
    <result property="dept.deptName" column="dept_name"></result>
</resultMap>
<!--Emp getEmpAndDept(@Param("eid")Integer eid);-->
<select id="getEmpAndDept" resultMap="empAndDeptResultMapOne">
    select * from t_emp left join t_dept on t_emp.did = t_dept.did where t_emp.eid = #{eid}
</select>
```

### association によるマッピング :id=h-59ffb20af231

- association：多対一のマッピングを処理する
- property：多対一のマッピング対象のプロパティ名
- javaType：そのプロパティの型

```xml
<resultMap id="empAndDeptResultMapTwo" type="Emp">
    <id property="eid" column="eid"></id>
    <result property="empName" column="emp_name"></result>
    <result property="age" column="age"></result>
    <result property="sex" column="sex"></result>
    <result property="email" column="email"></result>
    <association property="dept" javaType="Dept">
        <id property="did" column="did"></id>
        <result property="deptName" column="dept_name"></result>
    </association>
</resultMap>
<!--Emp getEmpAndDept(@Param("eid")Integer eid);-->
<select id="getEmpAndDept" resultMap="empAndDeptResultMapTwo">
    select * from t_emp left join t_dept on t_emp.did = t_dept.did where t_emp.eid = #{eid}
</select>
```

### 段階的な検索 :id=h-1bc23c5b87ff

#### 1. 従業員情報の検索 :id=h-7e1cfb776e7b

- select：段階的な検索に使う SQL の一意の識別子（namespace.SQLId または mapper インターフェースの完全修飾名.メソッド名）
- column：段階的な検索に使用する条件

```java
// See note 1 below.
/* See note 2 below. */
Emp getEmpAndDeptByStepOne(@Param("eid") Integer eid);
```

例の説明：

1. EmpMapper 内のメソッド
2. 従業員と所属部門を段階的に検索する。第1段階：従業員情報の検索；@param；@return com.atguigu.mybatis.pojo.Emp；@date 2022/2/27 20:17

```xml
<resultMap id="empAndDeptByStepResultMap" type="Emp">
    <id property="eid" column="eid"></id>
    <result property="empName" column="emp_name"></result>
    <result property="age" column="age"></result>
    <result property="sex" column="sex"></result>
    <result property="email" column="email"></result>
    <association property="dept"
                 select="com.atguigu.mybatis.mapper.DeptMapper.getEmpAndDeptByStepTwo"
                 column="did"></association>
</resultMap>
<!--Emp getEmpAndDeptByStepOne(@Param("eid") Integer eid);-->
<select id="getEmpAndDeptByStepOne" resultMap="empAndDeptByStepResultMap">
    select * from t_emp where eid = #{eid}
</select>
```

#### 2. 部門情報の検索 :id=h-c84619b94812

```java
// See note 1 below.
/* See note 2 below. */
Dept getEmpAndDeptByStepTwo(@Param("did") Integer did);
```

例の説明：

1. DeptMapper 内のメソッド
2. 従業員と所属部門を段階的に検索する。第2段階：did による所属部門の検索；@param；@return com.atguigu.mybatis.pojo.Emp；@date 2022/2/27 20:23

```xml
<!-- See note 1 below. -->
<resultMap id="EmpAndDeptByStepTwoResultMap" type="Dept">
    <id property="did" column="did"></id>
    <result property="deptName" column="dept_name"></result>
</resultMap>
<!--Dept getEmpAndDeptByStepTwo(@Param("did") Integer did);-->
<select id="getEmpAndDeptByStepTwo" resultMap="EmpAndDeptByStepTwoResultMap">
    select * from t_dept where did = #{did}
</select>
```

例の説明：

1. ここでの resultMap は、カラムとプロパティの対応付けだけを行います。

<a id="section-39"></a>

## 一対多のマッピング :id=h-47403238bad0

```java
public class Dept {
    private Integer did;
    private String deptName;
    private List<Emp> emps;
    // See note 1 below.
}
```

例の説明：

1. …コンストラクター、get、set メソッドなど

### collection :id=h-b95033f02065

- collection：一対多のマッピングを処理する
- ofType：このプロパティのコレクションに格納するデータの型

```xml
<resultMap id="DeptAndEmpResultMap" type="Dept">
    <id property="did" column="did"></id>
    <result property="deptName" column="dept_name"></result>
    <collection property="emps" ofType="Emp">
        <id property="eid" column="eid"></id>
        <result property="empName" column="emp_name"></result>
        <result property="age" column="age"></result>
        <result property="sex" column="sex"></result>
        <result property="email" column="email"></result>
    </collection>
</resultMap>
<!--Dept getDeptAndEmp(@Param("did") Integer did);-->
<select id="getDeptAndEmp" resultMap="DeptAndEmpResultMap">
    select * from t_dept left join t_emp on t_dept.did = t_emp.did where t_dept.did = #{did}
</select>
```

### 段階的な検索 :id=h-38bf91a4fc50

#### 1. 部門情報の検索 :id=h-c78a01805cfc

```java
/* See note 1 below. */
Dept getDeptAndEmpByStepOne(@Param("did") Integer did);
```

例の説明：

1. 部門と所属する全従業員を段階的に検索する。第1段階：部門情報の検索；@param did；@return com.atguigu.mybatis.pojo.Dept；@date 2022/2/27 22:04

```xml
<resultMap id="DeptAndEmpByStepOneResultMap" type="Dept">
    <id property="did" column="did"></id>
    <result property="deptName" column="dept_name"></result>
    <collection property="emps"
                select="com.atguigu.mybatis.mapper.EmpMapper.getDeptAndEmpByStepTwo"
                column="did"></collection>
</resultMap>
<!--Dept getDeptAndEmpByStepOne(@Param("did") Integer did);-->
<select id="getDeptAndEmpByStepOne" resultMap="DeptAndEmpByStepOneResultMap">
    select * from t_dept where did = #{did}
</select>
```

#### 2. 部門 id により、部門内の全従業員を検索する :id=h-35933fac8856

```java
/* See note 1 below. */
List<Emp> getDeptAndEmpByStepTwo(@Param("did") Integer did);
```

例の説明：

1. 部門と所属する全従業員を段階的に検索する。第2段階：部門 id による全従業員の検索；@param did；@return java.util.List\<com.atguigu.mybatis.pojo.Emp>；@date 2022/2/27 22:10

```xml
<!--List<Emp> getDeptAndEmpByStepTwo(@Param("did") Integer did);-->
<select id="getDeptAndEmpByStepTwo" resultType="Emp">
    select * from t_emp where did = #{did}
</select>
```

<a id="section-40"></a>

## 遅延読み込み :id=h-556efc5e5ef2

- 段階的な検索には、遅延読み込みを実現できる利点があります。ただし、コア設定ファイルで次のグローバル設定が必要です。
  - lazyLoadingEnabled：遅延読み込みのグローバルな切り替え。オンにすると、関連オブジェクトを遅延読み込みする
  - aggressiveLazyLoading：オンの場合、いずれかのメソッドを呼ぶとオブジェクトの全プロパティを読み込む。オフなら各プロパティを必要に応じて読み込む
- これで必要なデータに対応する SQL だけを実行できます。association や collection の fetchType 属性で、個別の検索の遅延読み込みを設定できます。fetchType="lazy（遅延読み込み）|eager（即時読み込み）"。

```xml
<settings>
    <!-- See note 1 below. -->
    <setting name="lazyLoadingEnabled" value="true"/>
</settings>
```

例の説明：

1. 遅延読み込みを有効にする

```java
@Test
public void getEmpAndDeptByStepOne() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
    Emp emp = mapper.getEmpAndDeptByStepOne(1);
    System.out.println(emp.getEmpName());
}
```

- 遅延読み込みをオフにすると、2つの SQL 文が実行されます。![](Resources/延迟加载测试1.png)
- 遅延読み込みをオンにすると、emp を取得する SQL 文だけが実行されます。
  ![](Resources/延迟加载测试2.png)

```java
@Test
public void getEmpAndDeptByStepOne() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
    Emp emp = mapper.getEmpAndDeptByStepOne(1);
    System.out.println(emp.getEmpName());
    System.out.println("----------------");
    System.out.println(emp.getDept());
}
```

- オンにすると、dept の情報が必要になったときにだけ、対応する SQL 文が呼び出されます。![](Resources/延迟加载测试3.png)
- fetchType：association または collection でグローバルな遅延読み込み設定を上書きできる。fetchType="lazy（遅延読み込み）|eager（即時読み込み）"。

  ```xml
  <resultMap id="empAndDeptByStepResultMap" type="Emp">
      <id property="eid" column="eid"></id>
      <result property="empName" column="emp_name"></result>
      <result property="age" column="age"></result>
      <result property="sex" column="sex"></result>
      <result property="email" column="email"></result>
      <association property="dept"
                   select="com.atguigu.mybatis.mapper.DeptMapper.getEmpAndDeptByStepTwo"
                   column="did"
                   fetchType="lazy"></association>
  </resultMap>
  ```

<a id="section-41"></a>

# 動的 SQL :id=h-6d8d59c7efc5

- Mybatis の動的 SQL は、特定の条件に応じて SQL 文を組み立てる機能です。SQL 文の文字列連結に伴う問題を解決します。
  <a id="section-42"></a>

## if :id=h-6be7f7d5e886

- if タグは test 属性の式（渡されたデータを使う式）を評価します。結果が true ならタグ内の内容を実行し、そうでなければ実行しません。
- where の後に、常に真になる条件 `1=1` を追加します。
  - この常に真になる条件は、検索結果に影響しません。
  - `1=1` は `and` 文の組み立てに使えます。例えば empName が null の場合です。
    - 常に真になる条件がなければ、SQL 文は `select * from t_emp where and age = ? and sex = ? and email = ?` になります。`where` と `and` が続くため、SQL 文でエラーが出ます。
    - 常に真になる条件を追加すると、SQL 文は `select * from t_emp where 1= 1 and age = ? and sex = ? and email = ?` となり、エラーは発生しません。

```xml
<!--List<Emp> getEmpByCondition(Emp emp);-->
<select id="getEmpByCondition" resultType="Emp">
    select * from t_emp where 1=1
    <if test="empName != null and empName !=''">
        and emp_name = #{empName}
    </if>
    <if test="age != null">
        and age = #{age}
    </if>
    <if test="sex != null and sex !=''">
        and sex = #{sex}
    </if>
    <if test="email != null and email !=''">
        and email = #{email}
    </if>
</select>
```

<a id="section-43"></a>

## where :id=h-83aa14bd6e3e

- where と if は、通常組み合わせて使用します。
  - where 内の if 条件がすべて不成立なら、where タグは何もせず、where キーワードを追加しません。
  - if 条件が成立すれば、where タグは where キーワードを追加し、条件の先頭にある余分な and/or を除去します。

```xml
<!--List<Emp> getEmpByCondition(Emp emp);-->
<select id="getEmpByCondition" resultType="Emp">
    select * from t_emp
    <where>
        <if test="empName != null and empName !=''">
            emp_name = #{empName}
        </if>
        <if test="age != null">
            and age = #{age}
        </if>
        <if test="sex != null and sex !=''">
            and sex = #{sex}
        </if>
        <if test="email != null and email !=''">
            and email = #{email}
        </if>
    </where>
</select>
```

- 注意：where タグは、条件の後ろにある余分な and/or は除去できません。

  ```xml
  <!-- See note 1 below. -->
  <if test="empName != null and empName !=''">
  emp_name = #{empName} and
  </if>
  <if test="age != null">
      age = #{age}
  </if>
  ```

例の説明：

1. この使い方は誤りです。条件の前の and/or だけを除去でき、後ろのものは除去できません。

<a id="section-44"></a>

## trim :id=h-d1a5fe79a597

- trim は、タグ内の内容を削除または追加します。
- よく使う属性
  - prefix：trim タグ内の内容の前に文字列を追加する
  - suffix：trim タグ内の内容の後に文字列を追加する
  - prefixOverrides：trim タグ内の内容の先頭から指定の文字列を除去する
  - suffixOverrides：trim タグ内の内容の末尾から指定の文字列を除去する
- trim 内の条件がすべて不成立なら、trim タグは何もせず、`select * from t_emp` だけが残ります。

```xml
<!--List<Emp> getEmpByCondition(Emp emp);-->
<select id="getEmpByCondition" resultType="Emp">
    select * from t_emp
    <trim prefix="where" suffixOverrides="and|or">
        <if test="empName != null and empName !=''">
            emp_name = #{empName} and
        </if>
        <if test="age != null">
            age = #{age} and
        </if>
        <if test="sex != null and sex !=''">
            sex = #{sex} or
        </if>
        <if test="email != null and email !=''">
            email = #{email}
        </if>
    </trim>
</select>
```

```java
// See note 1 below.
@Test
public void getEmpByCondition() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    DynamicSQLMapper mapper = sqlSession.getMapper(DynamicSQLMapper.class);
    List<Emp> emps= mapper.getEmpByCondition(new Emp(null, "张三", null, null, null, null));
    System.out.println(emps);
}
```

例の説明：

1. テストクラス

![](Resources/trim测试结果.png)
<a id="section-45"></a>

## choose、when、otherwise :id=h-fea6026f0d75

- `choose、when、otherwise` は `if...else if..else` に相当します。
- when は少なくとも1つ、otherwise は最大1つです。

```xml
<select id="getEmpByChoose" resultType="Emp">
    select * from t_emp
    <where>
        <choose>
            <when test="empName != null and empName != ''">
                emp_name = #{empName}
            </when>
            <when test="age != null and age != ''">
                age = #{age}
            </when>
            <when test="sex != null and sex != ''">
                sex = #{sex}
            </when>
            <when test="email != null and email != ''">
                email = #{email}
            </when>
            <otherwise>
                did = 1
            </otherwise>
        </choose>
    </where>
</select>
```

```java
@Test
public void getEmpByChoose() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    DynamicSQLMapper mapper = sqlSession.getMapper(DynamicSQLMapper.class);
    List<Emp> emps = mapper.getEmpByChoose(new Emp(null, "张三", 23, "男", "123@qq.com", null));
    System.out.println(emps);
}
```

![](Resources/choose测试结果.png)

- `if a else if b else if c else d` と同様に、いずれか1つだけを実行します。
  <a id="section-46"></a>

## foreach :id=h-2e85a5bd268b

- 属性：
  - collection：反復処理する配列またはコレクション
  - item：コレクションまたは配列の各データ
  - separator：反復間の区切り文字。既定では前後に空白が入る。例：`,`
  - open：foreach タグ内の内容の開始文字列
  - close：foreach タグ内の内容の終了文字列
- 一括削除

  ```xml
  <!--int deleteMoreByArray(Integer[] eids);-->
  <delete id="deleteMoreByArray">
      delete from t_emp where eid in
      <foreach collection="eids" item="eid" separator="," open="(" close=")">
          #{eid}
      </foreach>
  </delete>
  ```

  ```java
  @Test
  public void deleteMoreByArray() {
      SqlSession sqlSession = SqlSessionUtils.getSqlSession();
      DynamicSQLMapper mapper = sqlSession.getMapper(DynamicSQLMapper.class);
      int result = mapper.deleteMoreByArray(new Integer[]{6, 7, 8, 9});
      System.out.println(result);
  }
  ```

  ![](Resources/foreach测试结果1.png)
- 一括追加

  ```xml
  <!--int insertMoreByList(@Param("emps") List<Emp> emps);-->
  <insert id="insertMoreByList">
      insert into t_emp values
      <foreach collection="emps" item="emp" separator=",">
          (null,#{emp.empName},#{emp.age},#{emp.sex},#{emp.email},null)
      </foreach>
  </insert>
  ```

  ```java
  @Test
  public void insertMoreByList() {
      SqlSession sqlSession = SqlSessionUtils.getSqlSession();
      DynamicSQLMapper mapper = sqlSession.getMapper(DynamicSQLMapper.class);
      Emp emp1 = new Emp(null,"a",1,"男","123@321.com",null);
      Emp emp2 = new Emp(null,"b",1,"男","123@321.com",null);
      Emp emp3 = new Emp(null,"c",1,"男","123@321.com",null);
      List<Emp> emps = Arrays.asList(emp1, emp2, emp3);
      int result = mapper.insertMoreByList(emps);
      System.out.println(result);
  }
  ```

  ![](Resources/foreach测试结果2.png)
  <a id="section-47"></a>

## SQL フラグメント :id=h-14529b4dcfe2

- sql フラグメントは共通の SQL を記述し、必要な場所で include タグにより読み込めます。
- sql フラグメントの宣言：`<sql>` タグ

```xml
<sql id="empColumns">eid,emp_name,age,sex,email</sql>
```

- sql フラグメントの参照：`<include>` タグ

```xml
<!--List<Emp> getEmpByCondition(Emp emp);-->
<select id="getEmpByCondition" resultType="Emp">
    select <include refid="empColumns"></include> from t_emp
</select>
```

<a id="section-48"></a>

# MyBatis のキャッシュ :id=h-d9aca8ba120b

<a id="section-49"></a>

## 第1レベルキャッシュ：同じ SqlSession 内で結果を再利用 :id=h-482405da9e9a

キャッシュの既定の範囲は SESSION です。同じ SqlSession で同じ検索を繰り返すと、結果を直接再利用する場合があります。キャッシュキーには、文、引数、ページングなどの情報も含まれます。

- SqlSession を変えると、前のセッションの第1レベルキャッシュは使用できません。
- 検索条件が違えば別のキャッシュ項目になりますが、それによって元の項目が消えるわけではありません。
- 更新、コミット、ロールバック、clearCache の呼び出しなどで、ローカルキャッシュを消去します。
- localCacheScope=STATEMENT の場合は、1回の文の実行範囲内だけで再利用します。

キャッシュから返るオブジェクトは同じ参照の場合があり、直接変更すると以後の読み取りに影響します。SqlSession はスレッドセーフではないため、複数のリクエストで1つのインスタンスを共有しないでください。

<a id="section-50"></a>

## 第2レベルキャッシュ：Mapper の namespace ごとに管理 :id=h-31b4738608c4

SqlSessionFactory はキャッシュ管理を提供しますが、既定の第2レベルキャッシュは namespace ごとに分かれています。アプリケーション全体の任意の検索で共有するものではありません。

有効にするには、グローバルの cacheEnabled を true にし、Mapper XML に cache を追加します。通常、検索結果はセッションのコミットや正常終了後に第2レベルキャッシュへ公開されます。ロールバックと トランザクション の状態も結果に影響します。

```xml
<cache eviction="LRU" size="512" readOnly="false"/>
```

この断片は mapper ルート要素内に置きます。既定の読み書き可能なキャッシュは、シリアライズによって結果をコピーするため、結果オブジェクトはシリアライズ可能である必要があります。readOnly=true は参照を共有し、同じコピー処理を必要としませんが、呼び出し側がキャッシュのオブジェクトを変更してはいけません。

| 属性            | 意味                                             |
| ------------- | ---------------------------------------------- |
| eviction      | 削除方針。既定は LRU。ほかに FIFO、SOFT、WEAK がある            |
| size          | キャッシュ項目数。バイト数ではない                              |
| flushInterval | 更新間隔。ミリ秒単位で、既定では未設定                            |
| readOnly      | true はオブジェクトを共有し、false はコピーを返す                 |
| flushCache    | 文がキャッシュを消去するか。追加・更新・削除は既定で true、select は false |
| useCache      | 検索で第2レベルキャッシュを使用するか。select は既定で true           |

更新は通常、現在の namespace の第2レベルキャッシュを消去します。ただし、別の namespace にある結合検索のキャッシュまで更新される保証はありません。複数の Mapper が同じテーブルを操作すると古いデータが残りやすいため、cache-ref を設計するか、第2レベルキャッシュを使わないようにします。

<a id="section-51"></a>

## 検索の参照順序 :id=h-9db972ee86ff

キャッシュが有効な文は、通常、第2レベルキャッシュ、第1レベルキャッシュ、データベースの順に参照します。第2レベルキャッシュはキャッシュ可能な検索結果を集めるもので、第1レベルキャッシュ全体のコピーではありません。

参考：[MyBatis のキャッシュの説明](https://mybatis.org/mybatis-3/zh_CN/sqlmap-xml.html#cache)。

<a id="section-52"></a>

# 外部キャッシュ EHCache の連携（概要） :id=h-9709e6b7cbd2

### 依存関係を追加する :id=h-5578613a99fd

```xml
<!-- See note 1 below. -->
<dependency>
    <groupId>org.mybatis.caches</groupId>
    <artifactId>mybatis-ehcache</artifactId>
    <version>1.2.1</version>
</dependency>
<!-- See note 2 below. -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
</dependency>
```

例の説明：

1. Mybatis と EHCache の連携パッケージ
2. slf4j ロギングファサードの具体的な実装

### 各 jar の役割 :id=h-20e0417419db

| jar ファイル名       | 役割                                |
| --------------- | --------------------------------- |
| mybatis-ehcache | Mybatis と EHCache の連携パッケージ        |
| ehcache         | EHCache のコアパッケージ                  |
| slf4j-api       | SLF4J のロギングファサードのパッケージ            |
| logback-classic | SLF4J ファサードのインターフェースをサポートする具体的な実装 |

### EHCache の設定ファイル ehcache.xml を作成する :id=h-a9470fb4addd

- 既定の設定ファイル名は ehcache.xml です。独自の読み込み方法でパスを変更できます。

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="../config/ehcache.xsd">
    <!-- See note 1 below. -->
    <diskStore path="D:\atguigu\ehcache"/>
    <defaultCache
            maxElementsInMemory="1000"
            maxElementsOnDisk="10000000"
            eternal="false"
            overflowToDisk="true"
            timeToIdleSeconds="120"
            timeToLiveSeconds="120"
            diskExpiryThreadIntervalSeconds="120"
            memoryStoreEvictionPolicy="LRU">
    </defaultCache>
</ehcache>
```

例の説明：

1. ディスクの保存先

### 第2レベルキャッシュの種類を設定する :id=h-848702c14c11

- xxxMapper.xml で第2レベルキャッシュの種類を設定します。

```xml
<cache type="org.mybatis.caches.ehcache.EhcacheCache"/>
```

### logback のログを追加する :id=h-477b75891a52

- SLF4J はログのインターフェースで、Logback はその実装の1つです。ログの動作は MyBatis の logImpl と実際のバインドに依存し、SLF4J の追加だけでほかの実装が必ず無効になるわけではありません。既定の名前 `logback.xml` で logback の設定ファイルを作成します。logback.configurationFile などの設定で別のファイルも指定できます。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="true">
    <!-- See note 1 below. -->
    <appender name="STDOUT"
              class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <!-- See note 2 below. -->
            <!-- See note 3 below. -->
            <pattern>[%d{HH:mm:ss.SSS}] [%-5level] [%thread] [%logger] [%msg]%n</pattern>
        </encoder>
    </appender>
    <!-- See note 4 below. -->
    <!-- See note 5 below. -->
    <root level="DEBUG">
        <!-- See note 6 below. -->
        <appender-ref ref="STDOUT" />
    </root>
    <!-- See note 7 below. -->
    <logger name="com.atguigu.crowd.mapper" level="DEBUG"/>
</configuration>
```

例の説明：

1. ログの出力先を指定する
2. ログの出力形式
3. 順に、時刻、ログレベル、スレッド名、出力したクラス、本文、改行
4. グローバルなログレベルを設定する。順に DEBUG、INFO、WARN、ERROR
5. 指定したレベルと、それ以降のレベルのログだけを出力します。
6. ログの appender を指定します。ここでは STDOUT で前に設定した appender を参照します。
7. 個別の要件に応じて部分的なログレベルを指定する

### EHCache 設定ファイルの説明 :id=h-c37a8c4bdff7

| 属性名                             | 必須か | 役割                                                                                                                                                 |
| ------------------------------- | --- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxElementsInMemory             | はい  | メモリーにキャッシュする要素の最大数                                                                                                                                 |
| maxElementsOnDisk               | はい  | ディスクにキャッシュする要素の最大数。0 は無制限                                                                                                                          |
| eternal                         | はい  | キャッシュの要素を期限切れにしないかを指定します。true なら時間による自動失効はありませんが、明示的な消去や容量による削除はあり、データベースとの一致を保証するものではありません。false なら timeToIdleSeconds と timeToLiveSeconds も参照します。 |
| overflowToDisk                  | はい  | メモリー不足時に、あふれた要素をディスクに保存するか。期限切れ要素の保存専用ではない                                                                                                         |
| timeToIdleSeconds               | いいえ | EhCache 内のデータへの前回と今回のアクセス間隔が timeToIdleSeconds を超えると、そのデータを削除します。既定値0はアイドル時間が無制限であることを意味します。                                                       |
| timeToLiveSeconds               | いいえ | キャッシュ要素の有効期間。既定値0は無制限。                                                                                                                             |
| diskSpoolBufferSizeMB           | いいえ | DiskStore（ディスクキャッシュ）のバッファーサイズ。既定値は30 MB。各 Cache は専用のバッファーを持つ必要があります。                                                                               |
| diskPersistent                  | いいえ | VM の再起動時に EhCache のデータをディスクに保存して維持するか。既定値は false。                                                                                                  |
| diskExpiryThreadIntervalSeconds | いいえ | ディスクキャッシュのクリーンアップスレッドの実行間隔。既定は120秒で、120秒ごとに EhCache 内のデータを整理します。                                                                                   |
| memoryStoreEvictionPolicy       | いいえ | メモリーキャッシュが上限に達して新しい要素が追加されたときの削除方針。既定は LRU（最も長く使われていないもの）。ほかに LFU（使用頻度が最も低いもの）と FIFO（先入れ先出し）があります。                                                 |
| <a id="section-53"></a>         |

# MyBatis によるリバースエンジニアリング :id=h-dea02743a849

- フォワードエンジニアリング：まず Java のエンティティクラスを作り、フレームワークがそれをもとにテーブルを生成します。Hibernate はこれに対応します。
- リバースエンジニアリング：まずデータベースのテーブルを作り、フレームワークがそれをもとに次のリソースを生成します。
  - Java エンティティクラス
  - Mapper インターフェース
  - Mapper マッピングファイル
    <a id="section-54"></a>

## リバースエンジニアリングの設定手順 :id=h-19ab7acbfe40

### 依存関係とプラグインを追加する :id=h-b0bf45bbac6a

```xml
<dependencies>
    <!-- See note 1 below. -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.9</version>
    </dependency>
    <!-- See note 2 below. -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13.2</version>
        <scope>test</scope>
    </dependency>
    <!-- See note 3 below. -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.27</version>
    </dependency>
    <!-- See note 4 below. -->
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.17</version>
    </dependency>
</dependencies>
<!-- See note 5 below. -->
<build>
    <!-- See note 6 below. -->
    <plugins>
        <!-- See note 7 below. -->
        <plugin>
            <groupId>org.mybatis.generator</groupId>
            <artifactId>mybatis-generator-maven-plugin</artifactId>
            <version>1.3.0</version>
            <!-- See note 8 below. -->
            <dependencies>
                <!-- See note 9 below. -->
                <dependency>
                    <groupId>org.mybatis.generator</groupId>
                    <artifactId>mybatis-generator-core</artifactId>
                    <version>1.3.2</version>
                </dependency>
                <!-- See note 10 below. -->
                <dependency>
                    <groupId>com.mchange</groupId>
                    <artifactId>c3p0</artifactId>
                    <version>0.9.2</version>
                </dependency>
                <!-- See note 11 below. -->
                <dependency>
                    <groupId>mysql</groupId>
                    <artifactId>mysql-connector-java</artifactId>
                    <version>8.0.27</version>
                </dependency>
            </dependencies>
        </plugin>
    </plugins>
</build>
```

例の説明：

1. MyBatis のコア依存パッケージ
2. junit テスト
3. MySQL ドライバー
4. log4j のログ
5. Maven のビルド中の設定を制御する
6. ビルド中に使用するプラグイン
7. 具体的なプラグイン。リバースエンジニアリングはビルド時のプラグインとして実行する
8. プラグインの依存関係
9. リバースエンジニアリングのコア依存関係
10. データベース接続プール
11. MySQL ドライバー

### MyBatis のコア設定ファイルの作成 :id=h-d91e7b3768a2

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <properties resource="jdbc.properties"/>
    <typeAliases>
        <package name=""/>
    </typeAliases>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <package name=""/>
    </mappers>
</configuration>
```

### リバースエンジニアリングの設定ファイルを作成する :id=h-91c8bcfe2600

- Maven プラグインは既定で generatorConfig.xml を読み込みます。configurationFile で別のファイルを指定することもできます。下の replace-with-your-local-password は仮の値です。実行前に自分のローカルデータベースのパスワードへ置き換え、実際のパスワードはリポジトリにコミットしないでください。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>
    <!-- See note 1 below. -->
    <context id="DB2Tables" targetRuntime="MyBatis3Simple">
        <!-- See note 2 below. -->
        <jdbcConnection driverClass="com.mysql.cj.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/mybatis"
                        userId="root"
                        password="replace-with-your-local-password">
        </jdbcConnection>
        <!-- See note 3 below. -->
        <javaModelGenerator targetPackage="com.atguigu.mybatis.pojo" targetProject=".\src\main\java">
            <property name="enableSubPackages" value="true" />
            <property name="trimStrings" value="true" />
        </javaModelGenerator>
        <!-- See note 4 below. -->
        <sqlMapGenerator targetPackage="com.atguigu.mybatis.mapper"
                         targetProject=".\src\main\resources">
            <property name="enableSubPackages" value="true" />
        </sqlMapGenerator>
        <!-- See note 5 below. -->
        <javaClientGenerator type="XMLMAPPER"
                             targetPackage="com.atguigu.mybatis.mapper" targetProject=".\src\main\java">
            <property name="enableSubPackages" value="true" />
        </javaClientGenerator>
        <!-- See note 6 below. -->
        <!-- See note 7 below. -->
        <!-- See note 8 below. -->
        <table tableName="t_emp" domainObjectName="Emp"/>
        <table tableName="t_dept" domainObjectName="Dept"/>
    </context>
</generatorConfiguration>
```

例の説明：

1. targetRuntime：リバースエンジニアリングで生成する種類。MyBatis3Simple は基本的な CRUD（シンプル版）、MyBatis3 は条件付きの CRUD（多機能版）を生成する。
2. データベースの接続情報
3. javaBean の生成方針
4. SQL マッピングファイルの生成方針
5. Mapper インターフェースの生成方針
6. リバースエンジニアリングの対象テーブル
7. tableName を \* にすると全テーブルに対応します。この場合、domainObjectName は記述しません。
8. domainObjectName 属性は、生成するエンティティクラス名を指定します。

### MBG プラグインの generate ゴールを実行する :id=h-44212a13bb65

- ![](Resources/执行MBG插件的generate目标.png)
- `Exception getting JDBC Driver` エラーが発生した場合、pom.xml のデータベースドライバー設定が誤っている可能性があります。
  - dependency 内のドライバー ![](Resources/dependency中的驱动.png)
  - mybatis-generator-maven-plugin 内のドライバー ![](Resources/插件中的驱动.png)
  - 両方のドライバーのバージョンを一致させてください。
- 実行結果 ![](Resources/逆向执行结果.png)
  <a id="section-55"></a>

## QBC :id=h-42c616ff3e5b

### 検索 :id=h-e273b35e1005

- `selectByExample`：条件付き検索。example オブジェクトまたは null を渡す。null は条件なし、つまり全件検索を意味する。
- `example.createCriteria().xxx`：条件オブジェクトを作成する。andXXX メソッドで SQL に検索条件を追加し、各条件は and で結合する。
- `example.or().xxx`：追加済みの条件を、別の条件と or で結合する。
  ![](Resources/example的方法.png)

```java
@Test public void testMBG() throws IOException {
    InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(is);
    SqlSession sqlSession = sqlSessionFactory.openSession(true);
    EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
    EmpExample example = new EmpExample();
    // See note 1 below.
    example.createCriteria().andEmpNameEqualTo("张三").andAgeGreaterThanOrEqualTo(20);
    // See note 2 below.
    example.or().andDidIsNotNull();
    List<Emp> emps = mapper.selectByExample(example);
    emps.forEach(System.out::println);
}
```

例の説明：

1. 名前が張三で、年齢が20歳以上
2. または did が null でない

![](Resources/example测试结果.png)

### 追加と更新 :id=h-652bf9f91963

- `updateByPrimaryKey`：主キーで更新する。値が null の場合も、対応するカラムを null に変更する。
  - `mapper.updateByPrimaryKey(new Emp(1,"admin",22,null,"456@qq.com",3));`
  - ![](Resources/增删改测试结果1.png)
- `updateByPrimaryKeySelective()`：主キーで選択的に更新する。値が null のカラムは変更しない。
  - `mapper.updateByPrimaryKeySelective(new Emp(2,"admin2",22,null,"456@qq.com",3));`
  - ![](Resources/增删改测试结果2.png)
    <a id="section-56"></a>

# ページングプラグイン :id=h-62de265465d7

<a id="section-57"></a>

## ページングプラグインの使用手順 :id=h-f7470b97a97b

### 依存関係を追加する :id=h-2cf1e5c4e42b

```xml
<!-- https://mvnrepository.com/artifact/com.github.pagehelper/pagehelper -->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.2.0</version>
</dependency>
```

### ページングプラグインを設定する :id=h-6c519ef0c70a

- MyBatis のコア設定ファイル（mybatis-config.xml）でプラグインを設定します。
- ![](Resources/配置分页插件.png)

```xml
<plugins>
    <!-- See note 1 below. -->
    <plugin interceptor="com.github.pagehelper.PageInterceptor"></plugin>
</plugins>
```

例の説明：

1. ページングプラグインを設定する

<a id="section-58"></a>

## ページングプラグインの使用 :id=h-4c3a9b7ef898

### ページングを有効にする :id=h-533feb82d2de

- 検索処理の前に `PageHelper.startPage(int pageNum, int pageSize)` を使用し、ページングを有効にします。
  - pageNum：現在のページ番号
  - pageSize：1ページあたりの件数

```java
@Test
public void testPageHelper() throws IOException {
    InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(is);
    SqlSession sqlSession = sqlSessionFactory.openSession(true);
    EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
    // See note 1 below.
    PageHelper.startPage(1,4);
    List<Emp> emps = mapper.selectByExample(null);
    emps.forEach(System.out::println);
}
```

例の説明：

1. 1ページ4件で、最初のページを取得する

![](Resources/分页测试结果.png)

### ページングに関するデータ :id=h-6a2a694b79a7

#### 方法1：直接出力する :id=h-1bd342b4c1b4

```java
@Test
public void testPageHelper() throws IOException {
    InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(is);
    SqlSession sqlSession = sqlSessionFactory.openSession(true);
    EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
    // See note 1 below.
    Page<Object> page = PageHelper.startPage(1, 4);
    List<Emp> emps = mapper.selectByExample(null);
    // See note 2 below.
    System.out.println(page);
}
```

例の説明：

1. 1ページ4件で、最初のページを取得する
2. List を検索した後、ページングのデータを出力します。

- ページングに関するデータ：

  ```
  Page{count=true, pageNum=1, pageSize=4, startRow=0, endRow=4, total=8, pages=2, reasonable=false, pageSizeZero=false}[Emp{eid=1, empName='admin', age=22, sex='男', email='456@qq.com', did=3}, Emp{eid=2, empName='admin2', age=22, sex='男', email='456@qq.com', did=3}, Emp{eid=3, empName='王五', age=12, sex='女', email='123@qq.com', did=3}, Emp{eid=4, empName='赵六', age=32, sex='男', email='123@qq.com', did=1}]
  ```

#### 方法2：PageInfo を使用する :id=h-8f1140a93985

- list を検索した後、`PageInfo<T> pageInfo = new PageInfo<>(List<T> list, intnavigatePages)` でページングに関するデータを取得します。
  - list：ページング後のデータ
  - navigatePages：ナビゲーションに表示するページ番号の数

```java
@Test
public void testPageHelper() throws IOException {
    InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(is);
    SqlSession sqlSession = sqlSessionFactory.openSession(true);
    EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
    PageHelper.startPage(1, 4);
    List<Emp> emps = mapper.selectByExample(null);
    PageInfo<Emp> page = new PageInfo<>(emps,5);
    System.out.println(page);
}
```

- ページングに関するデータ：

  ```
  PageInfo{
  pageNum=1, pageSize=4, size=4, startRow=1, endRow=4, total=8, pages=2,
  list=Page{count=true, pageNum=1, pageSize=4, startRow=0, endRow=4, total=8, pages=2, reasonable=false, pageSizeZero=false}[Emp{eid=1, empName='admin', age=22, sex='男', email='456@qq.com', did=3}, Emp{eid=2, empName='admin2', age=22, sex='男', email='456@qq.com', did=3}, Emp{eid=3, empName='王五', age=12, sex='女', email='123@qq.com', did=3}, Emp{eid=4, empName='赵六', age=32, sex='男', email='123@qq.com', did=1}],
  prePage=0, nextPage=2, isFirstPage=true, isLastPage=false, hasPreviousPage=false, hasNextPage=true, navigatePages=5, navigateFirstPage=1, navigateLastPage=2, navigatepageNums=[1, 2]}
  ```
- list 内のデータは、方法1で直接出力した page のデータと同じです。

#### よく使うデータ： :id=h-e1102932cedf

- pageNum：現在のページ番号
- pageSize：1ページあたりの件数
- size：現在のページの実際の件数
- total：総件数
- pages：総ページ数
- prePage：前のページ番号
- nextPage：次のページ番号
- isFirstPage/isLastPage：最初／最後のページかどうか
- hasPreviousPage/hasNextPage：前／次のページがあるかどうか
- navigatePages：ナビゲーションに表示するページ番号の数
- navigatepageNums：ナビゲーションのページ番号。\[1,2,3,4,5]
