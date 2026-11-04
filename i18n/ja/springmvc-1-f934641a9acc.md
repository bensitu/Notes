# Spring MVC：リクエストとレスポンスの基礎 :id=h-4558c1789e08

リクエストマッピング、引数の受け取り、レスポンス、REST API を理解し、開発時に対応するアノテーションを調べます。

**前提知識とバージョン：** 本記事は従来の Spring 5.2 / javax / Tomcat 9 の学習環境を残しています。断片は各節のプロジェクトで使用してください。Spring 6 の完全な設定は SSM.md を参照してください。

**スクリーンショットについて：** 画像には元の学習環境での操作手順を残しています。画像内の古い書き方が本文と異なる場合は、改訂した本文と使用するバージョンの公式ドキュメントに従ってください。

**例の使い方：** 全ファイルと実行手順を明示したプロジェクト以外では、コードブロックは各節の独立した断片です。省略箇所や仮の名前を補ってください。誤りと明記した行は問題を説明するためのものです。同じ節にある代替の書き方を組み合わせないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://docs.spring.io/spring-framework/docs/5.2.10.RELEASE/spring-framework-reference/web.html)

**目次**

- [1. SpringMVC の概要](#section-1)
- [2. SpringMVC の入門例](#section-2)
- [3. PostMan ツールの使用](#section-3)
- [4. リクエストとレスポンス](#section-4)
- [5. REST スタイル](#section-5)

**今回の内容**

> - SpringMVC の関連概念を理解する
> - SpringMVC の入門例を完成させる
> - PostMan でリクエストとデータを送信できるようになる
> - SpringMVC のリクエストとデータの受け取り、結果の返し方を習得する
> - RESTful スタイルとその使い方を習得する
> - RESTful に基づく実装例を完成させる

SpringMVC は Spring フレームワークの一部で、主に Web 開発に使用し、Servlet の機能を包んで扱いやすくします。

SpringMVC では主に次の内容を学びます。

- SpringMVC の概要
- \==リクエストとレスポンス==
- \==REST スタイル==
- \==SSM の連携（アノテーション版）==
- インターセプター

SpringMVC は Web 層のフレームワークで、フロントエンドからリクエストとデータを受け取り、処理して結果を返します。そのため、リクエストとレスポンスの扱いは SpringMVC の重要な内容です。

REST は、開発の複雑さを減らし、システムの拡張性を高められるソフトウェアアーキテクチャのスタイルで、今後の開発でも広く使用されます。

SSM の連携は、学んだ SpringMVC + Spring + Mybatis を組み合わせて業務機能を開発するもので、3つのフレームワークの総合的な応用です。

SpringMVC の学習の最終目標は次のとおりです。

1. \==SpringMVC でのリクエストパラメーター取得と json レスポンスを習得する==
2. \==REST スタイルのリクエストパス設定と引数の受け渡しを使いこなす==
3. 実際の業務に応じたフロントエンドとバックエンド間の通信仕様を定義し、実装できるようになる
4. \==SSM の連携技術で任意の業務モジュールを開発する==

<a id="section-1"></a>

## 1. SpringMVC の概要 :id=h-9fcfc7cad577

SpringMVC を学ぶ前に、現在の Web アプリケーションの作り方を振り返ります。多くは3層アーキテクチャで実装します。

3層アーキテクチャ

![1630427303762](Resources/1630427303762.png)

- ブラウザーがバックエンドサーバーにリクエストを送り、現時点では Servlet がリクエストとデータを受け取ります。

- すべてを Servlet で処理すると機能が密結合になり、後の保守や拡張が難しくなります。

- バックエンドの Servlet の処理を、`web`、`service`、`dao` の3層に分けます。
  - web 層は主に servlet でページのリクエストを処理し、データを集め、フロントエンドへ結果を返します。
  - service 層は主に業務ロジックを処理します。
  - dao 層は主にデータの CRUD を担当します。

- Servlet は複数のリクエストを処理できます。Spring MVC は DispatcherServlet で統一的に振り分け、パス判定や引数の解析を手動で書く作業を減らします。

- web 層に MVC デザインパターンを適用し、`controller`、`view`、`Model` に分けて改善します。
  - controller はリクエストとデータを受け取り、service に業務処理を渡します。
  - service は必要に応じて dao を呼び、データの CRUD を行います。
  - dao は処理結果を service に渡し、service は controller に渡します。
  - controller は必要に応じて Model と View を組み立てます。両者でページを生成し、フロントエンドのブラウザーへ転送します。
  - この方法により、controller は複数のリクエストを処理し、振り分けて異なる業務操作を実行できます。

フロントエンドとバックエンドを分離する場合、ブラウザーは fetch や Axios でデータを要求し、フロントエンドでページを更新することが一般的です。ブラウザーの非同期リクエストとサーバーの非同期処理は別のことで、JSON を返すだけで性能向上が保証されるわけではありません。

![1630427769938](Resources/1630427769938.png)

- この分離構成の例では、バックエンドがデータを返し、フロントエンドがページを描画します。Spring MVC は、サーバー側のテンプレートビューも引き続きサポートします。
- この例のデータ形式は JSON ですが、非同期リクエストで HTML、テキスト、ファイルなどを受け取ることもできます。
- SpringMVC が ==主に== 担当するのは次のことです。
  - controller でリクエストとデータを受け取る方法
  - リクエストとデータを業務層に渡す方法
  - レスポンスデータを json に変換してフロントエンドに返す方法

ここまでをもとに、SpringMVC を定義します。

- SpringMVC は、Java に基づいて MVC モデルを実装する軽量な Web フレームワークです。

- 利点

  - Servlet と比べて使いやすく、開発しやすい
  - 柔軟性が高い

  これらの利点は、使いながら理解していきましょう。

<a id="section-2"></a>

## 2. SpringMVC の入門例 :id=h-16ff7e7343ea

Spring MVC は内部で Servlet を使用します。まず Servlet のリクエスト受信を振り返り、その後 DispatcherServlet の統一的な振り分けを学びます。

1\. Web プロジェクトを作成する（Maven 構成）。

2\. Tomcat を設定し、Web プロジェクトを読み込む（Tomcat プラグイン）。

3\. 依存関係を導入する（Servlet）。

4\. リクエスト処理クラスを定義する（UserServlet）。

5\. リクエストマッピングを設定する。

SpringMVC の作成手順もほぼ同じです。具体的な流れを確認します。

1\. Web プロジェクトを作成する（Maven 構成）。

2\. Tomcat を設定し、Web プロジェクトを読み込む（Tomcat プラグイン）。

3\. 依存関係を導入する（==SpringMVC== + Servlet）。

4\. リクエスト処理クラスを定義する（==UserController==）。

5\. ==リクエストマッピングを設定する。==

6\. ==SpringMVC を Tomcat コンテナーに読み込むように設定する。==

### 2.1 要件の分析 :id=h-99425b85252c

### 2.2 例の作成 :id=h-1071db4da616

#### 手順1：Maven プロジェクトを作成する :id=h-5d1366ae484c

IDEA を開き、新しい Web プロジェクトを作成します。

![1630428920116](Resources/1630428920116.png)

#### 手順2：ディレクトリ構成を補う :id=h-56e20dec7f75

アーキタイプで作成した構成は不完全なので、足りないディレクトリを手動で追加します。

![1630429288339](Resources/1630429288339.png)

#### 手順3：jar を導入する :id=h-1a583c000196

pom.xml の不要な内容を削除し、SpringMVC が必要とする依存関係を追加します。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.itheima</groupId>
  <artifactId>springmvc_01_quickstart</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>war</packaging>

  <dependencies>
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>javax.servlet-api</artifactId>
      <version>3.1.0</version>
      <scope>provided</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <version>5.2.10.RELEASE</version>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.tomcat.maven</groupId>
        <artifactId>tomcat7-maven-plugin</artifactId>
        <version>2.1</version>
        <configuration>
          <port>80</port>
          <path>/</path>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>

```

\*\*説明：\*\* servlet の依存関係に `<scope>provided</scope>` が必要なのはなぜでしょうか。

- scope は、maven で jar の依存関係の適用範囲を指定します。

- 省略すると既定は `compile` で、コンパイル、実行、テストで有効です。

- 実行時にも含めると、Tomcat の servlet-api パッケージと競合し、起動エラーになります。

- provided はコンパイルとテストのときだけ有効で、実行時には Tomcat のものを使うため、競合を避けられます。

#### 手順4：設定クラスを作成する :id=h-c8b3dca082ab

```java
@Configuration
@ComponentScan("com.itheima.controller")
public class SpringMvcConfig {
}
```

#### 手順5：Controller クラスを作成する :id=h-2ac3a58d1c6e

```java
@Controller
public class UserController {

    @RequestMapping("/save")
    public void save(){
        System.out.println("user save ...");
    }
}

```

#### 手順6：設定クラスで web.xml を置き換える :id=h-4be8b001f433

web.xml を削除し、ServletContainersInitConfig に置き換えます。

```java
public class ServletContainersInitConfig extends AbstractDispatcherServletInitializer {
    // See note 1 below.
    protected WebApplicationContext createServletApplicationContext() {
        // See note 2 below.
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        // See note 3 below.
        ctx.register(SpringMvcConfig.class);
        return ctx;
    }

    // See note 4 below.
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    // See note 5 below.
    protected WebApplicationContext createRootApplicationContext() {
        return null;
    }
}
```

例の説明：

1. springmvc の設定クラスを読み込む
2. WebApplicationContext オブジェクトを初期化する
3. 指定の設定クラスを読み込む
4. springmvc コントローラーが処理するリクエストのマッピングパスを設定する
5. spring の設定クラスを読み込む

#### 手順7：Tomcat 環境を設定する :id=h-5d9a95479e0d

![1630430302683](Resources/1630430302683.png)

#### 手順8：プロジェクトを起動する :id=h-46ad13ea29db

![1630430345246](Resources/1630430345246.png)

#### 手順9：ブラウザーでアクセスする :id=h-f670f600298d

ブラウザーに `http://localhost/save` を入力すると、次のエラーが表示されます。

![1630430401561](Resources/1630430401561.png)

バックエンドで返すページを指定していないため、ページにエラーが表示されます。今はコンソールで `user save ...` が実行されたかだけを確認してください。

#### 手順10：Controller の戻り値を変更して対処する :id=h-c9301ccb59bd

現在はフロントエンドの非同期リクエストとバックエンドの json レスポンスが中心なので、Controller の save メソッドを変更します。

```java
@Controller
public class UserController {

    @RequestMapping("/save")
    public String save(){
        System.out.println("user save ...");
        return "{'info':'springmvc'}";
    }
}

```

Tomcat を再起動してブラウザーで再確認すると、今度は404エラーが表示されます。

![1630430658028](Resources/1630430658028.png)

メソッドが文字列を返すと、springmvc はそれをページ名として探します。対応する名前のページがないため、リソースが見つからない404エラーになります。

実際には json データを直接返したいので、どのように変更すればよいでしょうか。

#### 手順11：json データを返すように設定する :id=h-0160168ec0bf

```java
@Controller
public class UserController {

    @RequestMapping("/save")
    @ResponseBody
    public String save(){
        System.out.println("user save ...");
        return "{'info':'springmvc'}";
    }
}

```

Tomcat を再起動し、ブラウザーで再びアクセスすると、返されたデータを確認できます。

![1630430835628](Resources/1630430835628.png)

これで SpringMVC の入門例が完成しました。

**注意事項**

- SpringMVC は Spring を基盤としています。pom.xml に `spring-webmvc` だけを導入しているのは、必要な Spring の依存関係が自動的に導入されるためです。
- AbstractDispatcherServletInitializer は、SpringMVC が提供する Web 3.0 コンテナーを簡単に初期化するための抽象クラスです。
- AbstractDispatcherServletInitializer は、実装するための3つのインターフェースメソッドを提供します。
  - createServletApplicationContext メソッドは、Servlet コンテナーの生成時に SpringMVC に対応する bean を読み込み、WebApplicationContext の範囲に格納します。WebApplicationContext のスコープは ServletContext、すなわち Web コンテナー全体です。
  - getServletMappings メソッドは SpringMVC のリクエストマッピングを設定し、SpringMVC が捕捉するリクエストを決めます。
  - Servlet コンテナー生成時に SpringMVC 以外の bean を読み込む場合は、createRootApplicationContext を使用します。使い方は createServletApplicationContext と同じです。
  - createServletApplicationContext は SpringMVC 環境を読み込みます。
  - createRootApplicationContext は Spring 環境を読み込みます。

### 重要事項1：@Controller :id=h-a7f3f773fba9

| 名称 | @Controller                        |
| -- | ---------------------------------- |
| 型  | クラスアノテーション                         |
| 位置 | SpringMVC のコントローラークラス宣言の上          |
| 役割 | SpringMVC の中核となるコントローラー bean を定義する |

### 重要事項2：@RequestMapping :id=h-1c13bf62f1e3

| 名称     | @RequestMapping                   |
| ------ | --------------------------------- |
| 型      | クラスまたはメソッドのアノテーション                |
| 位置     | SpringMVC のコントローラークラスまたはメソッドの宣言の上 |
| 役割     | コントローラーメソッドのリクエストパスを設定する          |
| 関連する属性 | value（既定）：リクエストパス                 |

### 重要事項3：@ResponseBody :id=h-4c82bc8b906f

| 名称 | @ResponseBody                     |
| -- | --------------------------------- |
| 型  | クラスまたはメソッドのアノテーション                |
| 位置 | SpringMVC のコントローラークラスまたはメソッドの宣言の上 |
| 役割 | ビューとして解決せず、メソッドの戻り値をレスポンス本文として返す  |

### 2.3 入門例のまとめ :id=h-c2281e285b0c

- 1回だけの作業
  - プロジェクトを作成し、サーバーを設定して読み込む
  - 依存関係を導入する
  - Web コンテナーの初期化クラスを作成し、SpringMVC 設定を読み込んで SpringMVC の対象パスを設定する
  - SpringMVC のコア設定クラス（設定クラスを指定し、controller パッケージをスキャンして Controller bean を読み込む）
- 繰り返し行う作業
  - リクエストを処理するコントローラークラスを定義する
  - リクエスト処理メソッドを定義し、マッピングパス（@RequestMapping）と json の返却（@ResponseBody）を設定する

### 2.4 処理の流れの解説 :id=h-0e82a1dad0e4

SpringMVC をよりよく使うため、SpringMVC の処理を `启动服务器初始化过程` と `单次请求过程` の2つの段階に分けて分析します。

![1630432494752](Resources/1630432494752.png)

#### 2.4.1 サーバー起動時の初期化 :id=h-45c3d6c48376

1. サーバーが起動し、ServletContainersInitConfig クラスを実行して Web コンテナーを初期化します。

   - 以前の web.xml と同様の役割です。

2. createServletApplicationContext メソッドを実行し、WebApplicationContext オブジェクトを作成します。

   - このメソッドは SpringMVC の設定クラス SpringMvcConfig を読み込み、SpringMVC コンテナーを初期化します。

3. SpringMvcConfig の設定クラスを読み込む

   ![1630433335744](Resources/1630433335744.png)

4. @ComponentScan を実行し、対応する bean を読み込みます。

   - 指定パッケージとサブパッケージの各クラス上のアノテーションをスキャンします。例：Controller クラスの @Controller。

5. UserController を読み込み、各 @RequestMapping の名前を具体的なメソッドに対応付けます。

   ![1630433398932](Resources/1630433398932.png)

   - これで `/save` と save メソッドが対応付けられます。

6. getServletMappings メソッドを実行し、SpringMVC が捕捉するリクエストパスの規則を設定します。

   ![1630433510528](Resources/1630433510528.png)

   - `/` は捕捉するパスの規則です。捕捉されたリクエストだけを SpringMVC に渡して処理できます。

#### 2.4.2 1回のリクエストの処理 :id=h-52b0c01c4687

1. リクエスト `http://localhost/save` を送信する
2. Web コンテナーはリクエストが SpringMVC の規則に一致すると判断し、SpringMVC に渡します。
3. リクエストパス /save を解析する
4. /save に対応する save() メソッドを特定する
   - 上の手順5ですでにパスとメソッドを対応付けているため、/save で save メソッドを見つけられます。
5. save() を実行する
6. @ResponseBody を検出し、save() の戻り値をそのままレスポンス本文として返します。

### 2.5 bean の読み込み制御 :id=h-b131b113a379

#### 2.5.1 問題の分析 :id=h-037a2884647a

入門例では `SpringMvcConfig` の設定クラスを作り、以前の Spring の学習でも `SpringConfig` を作りました。どちらもリソースを読み込みますが、それぞれ何を読み込むべきでしょうか。

まず、現在のプロジェクトのディレクトリ構成を確認します。

![1630459727575](Resources/1630459727575.png)

- config は設定クラスを保存します。これまでに作成したものは次のとおりです。

  - ServletContainersInitConfig
  - SpringConfig
  - SpringMvcConfig
  - JdbcConfig
  - MybatisConfig
- controller は SpringMVC の controller クラスを保存します。
- service は service インターフェースと実装クラスを保存します。
- dao は dao/Mapper インターフェースを保存します。

controller、service、dao はすべてコンテナーに bean として管理させます。SpringMVC と Spring のどちらが読み込むべきでしょうか。

- SpringMVC は、関連するプレゼンテーション層の bean、つまり controller パッケージ内のクラスを読み込みます。
- Spring が管理する bean
  - 業務 bean（Service）
  - 機能 bean（DataSource、SqlSessionFactoryBean、MapperScannerConfigurer など）

管理対象を整理したら、次は Spring と SpringMVC がそれぞれの対象を個別に読み込む方法を考えます。

SpringMVC の設定クラス `SpringMvcConfig` では、`@ComponentScan` アノテーションのスキャン範囲を controller に限定します。例：

![1630460319004](Resources/1630460319004.png)

Spring の設定クラス `SpringConfig` では、以前の `@ComponentScan` のスキャン範囲に controller も含まれています。

![1630460408159](Resources/1630460408159.png)

パッケージ構成を見ると、Spring が SpringMVC の controller までスキャンしています。次に、その解決方法を学びます。

今回の問題は、==役割が違う Spring が、SpringMVC の bean を誤って読み込むのをどう防ぐか== ということです。

#### 2.5.2 方針の検討 :id=h-d1aee2914f7e

解決方法は簡単です。

- Spring の管理対象 bean を読み込むとき、SpringMVC の管理対象 bean を除外します。

具体的には、次の方法で除外します。

- 方法1：Spring のスキャン範囲を service や dao などに限定します。
- 方法2：Spring のスキャン範囲を com.itheima とし、controller の bean を除外します。
- 方法3：Spring と SpringMVC の環境を分けず、同じ環境に読み込みます（概要だけで構いません）。

#### 2.5.4 環境の準備 :id=h-9427e1115184

- Maven の Web プロジェクトを作成する

- pom.xml に Spring の依存関係を追加します。

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>

  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>springmvc_02_bean_load</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
      <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>
      <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
        <version>1.1.16</version>
      </dependency>

      <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.6</version>
      </dependency>

      <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.47</version>
      </dependency>

      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>

      <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>1.3.0</version>
      </dependency>
    </dependencies>

    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.tomcat.maven</groupId>
          <artifactId>tomcat7-maven-plugin</artifactId>
          <version>2.1</version>
          <configuration>
            <port>80</port>
            <path>/</path>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </project>

  ```

- 対応する設定クラスを作成する

  ```java
  public class ServletContainersInitConfig extends AbstractDispatcherServletInitializer {
      protected WebApplicationContext createServletApplicationContext() {
          AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
          ctx.register(SpringMvcConfig.class);
          return ctx;
      }
      protected String[] getServletMappings() {
          return new String[]{"/"};
      }
      protected WebApplicationContext createRootApplicationContext() {
        return null;
      }
  }

  @Configuration
  @ComponentScan("com.itheima.controller")
  public class SpringMvcConfig {
  }

  @Configuration
  @ComponentScan("com.itheima")
  public class SpringConfig {
  }

  ```

- Controller、Service、Dao、Domain クラスを作成します。

  ```java
  @Controller
  public class UserController {

      @RequestMapping("/save")
      @ResponseBody
      public String save(){
          System.out.println("user save ...");
          return "{'info':'springmvc'}";
      }
  }

  public interface UserService {
      public void save(User user);
  }

  @Service
  public class UserServiceImpl implements UserService {
      public void save(User user) {
          System.out.println("user service ...");
      }
  }

  public interface UserDao {
      @Insert("insert into tbl_user(name,age)values(#{name},#{age})")
      public void save(User user);
  }
  public class User {
      private Integer id;
      private String name;
      private Integer age;
      // See note 1 below.
  }
  ```

例の説明：

1. setter..getter..toString を省略

完成したプロジェクトの構成は次のとおりです。

![1630461261820](Resources/1630461261820.png)

#### 2.5.5 bean の読み込み制御の設定 :id=h-ea6431c68e07

方法1：Spring 設定クラスを変更し、スキャン範囲を限定します。

```java
@Configuration
@ComponentScan({"com.itheima.service","comitheima.dao"})
public class SpringConfig {
}
```

**説明：**

この例はパッケージを正確に指定できることを示したものです。実際の開発では Dao のスキャンは `MapperScannerConfigurer` が行うため、Spring は service だけをスキャンすれば十分です。

方法2：Spring 設定のスキャン範囲を com.itheima とし、controller の bean を除外します。

```java
@Configuration
@ComponentScan(value="com.itheima",
    excludeFilters=@ComponentScan.Filter(
        type = FilterType.ANNOTATION,
        classes = Controller.class
    )
)
public class SpringConfig {
}
```

- excludeFilters 属性：スキャンで bean を読み込む際の除外規則

- type 属性：除外規則の種類。ここでは bean の定義に使うアノテーションの型で除外する

  - ANNOTATION：アノテーションで除外する
  - ASSIGNABLE_TYPE：指定の型で絞り込む
  - ASPECTJ：Aspectj 式で除外する。ここではほとんど使用しない
  - REGEX：正規表現で除外する
  - CUSTOM：独自の規則で除外する

  ここでは最初の ANNOTATION を覚えれば十分です。

- classes 属性：除外する具体的なアノテーションのクラス。ここでは @Controller で定義した bean を除外する

controller クラスが除外されたことを、どう確認すればよいでしょうか。

```java
public class App{
    public static void main (String[] args){
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
        System.out.println(ctx.getBean(UserController.class));
    }
}
```

除外されていれば、このメソッドの実行時に bean が未定義だというエラーになります。

![1630462200947](Resources/1630462200947.png)

\==注意：このテストでは SpringMvcConfig 設定クラスの @ComponentScan をコメントアウトしてください。そうしなければ、エラーは発生しません。==

理由は次のとおりです。

- Spring 設定クラスは `com.itheima` をスキャンします。
- SpringMVC の設定クラス `SpringMvcConfig` にも @Configuration が付いているため、Spring がスキャンします。
- SpringMvcConfig の @ComponentScan が、controller を再びスキャンします。
- @ComponentScan をコメントアウトしないと、Spring が Controller を除外しても、SpringMVC 設定クラスを通して再び読み込むため、実演したい結果になりません。
- 解決方法は、SpringMVC の設定クラスを Spring 設定のスキャン範囲外へ移すことです。

最後に、Tomcat 起動時に Spring の設定を読み込むには、ServletContainersInitConfig を変更する必要があります。

```java
public class ServletContainersInitConfig extends AbstractDispatcherServletInitializer {
    protected WebApplicationContext createServletApplicationContext() {
      // See note 1 below.
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.register(SpringMvcConfig.class);
        return ctx;
    }
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }
    protected WebApplicationContext createRootApplicationContext() {
      // See note 2 below.
      AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.register(SpringConfig.class);
        return ctx;
    }
}
```

例の説明：

1. SpringMVC コンテナーを読み込む
2. Spring コンテナーを読み込む

Spring は、`AnnotationConfigWebApplicationContext` を作成せず、設定クラスを手動で `register` しない、さらに簡単な設定方法も提供します。どのように実現するのでしょうか。

```java
public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {

    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{SpringConfig.class};
    }

    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{SpringMvcConfig.class};
    }

    protected String[] getServletMappings() {
        return new String[]{"/"};
    }
}
```

### 重要事項1：@ComponentScan :id=h-7325af04e305

| 名称     | @ComponentScan                                                                                                                |
| ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| 型      | クラスアノテーション                                                                                                                    |
| 位置     | クラス宣言の上                                                                                                                       |
| 役割     | アノテーションで定義した bean を読み込むため、Spring 設定クラスのスキャンパスを設定する                                                                            |
| 関連する属性 | excludeFilters：スキャン対象の bean を除外する。種類（type）と具体的な対象（classes）を指定する。<br/>includeFilters：指定の bean を読み込む。種類（type）と対象（classes）を指定する。 |

<a id="section-3"></a>

## 3. PostMan ツールの使用 :id=h-726d4546f15f

### 3.1 PostMan の概要 :id=h-e2b5bccda3c2

コードのテストでは、ブラウザーを開いて URL を入力すればリクエストを送れます。`GET` なら直接送れますが、`POST` の場合はどうでしょうか。

post リクエストを試すためにページと form を用意するのは手間がかかるため、PostMan などの外部ツールを使います。

- PostMan は、Web のデバッグと HTTP リクエストの送信を行う高機能な Chrome プラグインです。![1630463382386](Resources/1630463382386.png)

- 用途：主に API テストに使用する

- 特徴
  - シンプル
  - 実用的
  - 見やすい
  - すっきりした構成

### 3.2 PostMan のインストール :id=h-ba63eb899b8c

`资料\Postman-win64-8.3.1-Setup.exe` をダブルクリックすると自動的にインストールされます。

インストール後、登録が必要なら案内に従って登録します。下部にスキップのリンクがあれば、登録を省略できます。

![1630463816424](Resources/1630463816424.png)

次の画面が表示されれば、インストール成功です。

![1630463887711](Resources/1630463887711.png)

### 3.3 PostMan の使用 :id=h-832c60624060

#### 3.3.1 WorkSpace ワークスペースの作成 :id=h-68a712efc359

![](Resources/image-20210805150044862.png)

#### 3.3.2 リクエストの送信 :id=h-335c379d9c3c

![1630464489898](Resources/1630464489898.png)

#### 3.3.3 現在のリクエストの保存 :id=h-97be9616d3d8

![1630464783034](Resources/1630464783034.png)

\*\*注意：\*\* 最初のリクエストでは新しいディレクトリを作成します。以後は同じディレクトリに直接保存でき、新しく作る必要はありません。

<a id="section-4"></a>

## 4. リクエストとレスポンス :id=h-f4d3cb4f9745

入門例を終えたので、SpringMVC を体系的に学びます。SpringMVC は Web 層のフレームワークで、リクエストとデータを受け取り、結果を返します。そのため、この章は SpringMVC の ==重要な内容== で、主に次の4つを説明します。

- リクエストのマッピングパス
- リクエストパラメーター
- 日付型の引数の受け渡し
- json データの返却

### 4.1 リクエストマッピングの設定 :id=h-81ff594c466c

#### 4.1.1 環境の準備 :id=h-50063a75ff2c

- Maven の Web プロジェクトを作成する

- pom.xml に Spring の依存関係を追加します。

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>

  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>springmvc_03_request_mapping</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
      <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>
    </dependencies>

    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.tomcat.maven</groupId>
          <artifactId>tomcat7-maven-plugin</artifactId>
          <version>2.1</version>
          <configuration>
            <port>80</port>
            <path>/</path>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </project>

  ```

- 対応する設定クラスを作成する

  ```java
  public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {

      protected Class<?>[] getServletConfigClasses() {
          return new Class[]{SpringMvcConfig.class};
      }
      protected String[] getServletMappings() {
          return new String[]{"/"};
      }
      protected Class<?>[] getRootConfigClasses() {
          return new Class[0];
      }
  }

  @Configuration
  @ComponentScan("com.itheima.controller")
  public class SpringMvcConfig {
  }

  ```

- BookController と UserController を作成する

  ```java
  @Controller
  public class UserController {

      @RequestMapping("/save")
      @ResponseBody
      public String save(){
          System.out.println("user save ...");
          return "{'module':'user save'}";
      }

      @RequestMapping("/delete")
      @ResponseBody
      public String save(){
          System.out.println("user delete ...");
          return "{'module':'user delete'}";
      }
  }

  @Controller
  public class BookController {

      @RequestMapping("/save")
      @ResponseBody
      public String save(){
          System.out.println("book save ...");
          return "{'module':'book save'}";
      }
  }
  ```

完成したプロジェクトの構成は次のとおりです。

![1630466431549](Resources/1630466431549.png)

環境を準備して Tomcat を起動すると、バックエンドでエラーが発生します。

![1630466555934](Resources/1630466555934.png)

エラーの内容から、次のことが分かります。

- UserController の save メソッドのパスは `http://localhost/save` です。
- BookController の save メソッドのパスも `http://localhost/save` です。
- `http://localhost/saved` にアクセスすると、UserController と BookController のどちらを実行すべきでしょうか。

#### 4.1.2 問題の分析 :id=h-7aa2ef523be5

複数人で開発して別々のリクエストパスを設定する場合、競合をどう解決すればよいでしょうか。

方針：モジュール名をリクエストパスの接頭辞にします。

Book モジュールの save のパスを `http://localhost/book/save` にします。

User モジュールの save のパスを `http://localhost/user/save` にします。

これにより、同じモジュール内で名前が競合することが少なくなります。

#### 4.1.3 マッピングパスの設定 :id=h-cc9c682429ae

##### 手順1：Controller を変更する :id=h-52ddcff5fdf6

```java
@Controller
public class UserController {

    @RequestMapping("/user/save")
    @ResponseBody
    public String save(){
        System.out.println("user save ...");
        return "{'module':'user save'}";
    }

    @RequestMapping("/user/delete")
    @ResponseBody
    public String save(){
        System.out.println("user delete ...");
        return "{'module':'user delete'}";
    }
}

@Controller
public class BookController {

    @RequestMapping("/book/save")
    @ResponseBody
    public String save(){
        System.out.println("book save ...");
        return "{'module':'book save'}";
    }
}
```

問題は解決しますが、各メソッドを変更する必要があり、コードも重複します。後で /user が変われば、すべてのメソッドを変更することになり、結合が強すぎます。

##### 手順2：パス設定を改善する :id=h-5323cc959d8a

改善方法：

```java
@Controller
@RequestMapping("/user")
public class UserController {

    @RequestMapping("/save")
    @ResponseBody
    public String save(){
        System.out.println("user save ...");
        return "{'module':'user save'}";
    }

    @RequestMapping("/delete")
    @ResponseBody
    public String save(){
        System.out.println("user delete ...");
        return "{'module':'user delete'}";
    }
}

@Controller
@RequestMapping("/book")
public class BookController {

    @RequestMapping("/save")
    @ResponseBody
    public String save(){
        System.out.println("book save ...");
        return "{'module':'book save'}";
    }
}
```

**注意：**

- クラスとメソッドの両方に `@RequestMapping` を付けた場合、リクエストのパスは2つの value を結合したものに一致させます。
- @RequestMapping の value の先頭の `/` は、付けても付けなくても構いません。

補足：

PostMan の文字が小さく見にくい場合は、`ctrl+=` で大きく、`ctrl+-` で小さくできます。

### 4.2 リクエストパラメーター :id=h-cad01d63d8a5

ページの送信先と Controller のパスが一致すれば、リクエストを受け取れます。では、ページが渡した引数はどう受け取るのでしょうか。

引数の送受信は、リクエストメソッドに関係します。よく使う2つの方法は次のとおりです。

- GET
- POST

それぞれの方法で、フロントエンドはどう送り、バックエンドはどう受け取るのでしょうか。

#### 4.2.1 環境の準備 :id=h-ad524d99cb1d

- Maven の Web プロジェクトを作成する

- pom.xml に Spring の依存関係を追加します。

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>

  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>springmvc_03_request_mapping</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
      <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>
    </dependencies>

    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.tomcat.maven</groupId>
          <artifactId>tomcat7-maven-plugin</artifactId>
          <version>2.1</version>
          <configuration>
            <port>80</port>
            <path>/</path>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </project>

  ```

- 対応する設定クラスを作成する

  ```java
  public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {

      protected Class<?>[] getServletConfigClasses() {
          return new Class[]{SpringMvcConfig.class};
      }
      protected String[] getServletMappings() {
          return new String[]{"/"};
      }
      protected Class<?>[] getRootConfigClasses() {
          return new Class[0];
      }
  }

  @Configuration
  @ComponentScan("com.itheima.controller")
  public class SpringMvcConfig {
  }

  ```

- UserController を作成する

  ```java
  @Controller
  public class UserController {

      @RequestMapping("/commonParam")
      @ResponseBody
      public String commonParam(){
          return "{'module':'commonParam'}";
      }
  }
  ```

* User と Address のモデルクラスを作成する

  ```java
  public class Address {
      private String province;
      private String city;
      // See note 1 below.
  }
  public class User {
      private String name;
      private int age;
      // See note 2 below.
  }
  ```

例の説明：

1. setter...getter... を省略
2. setter...getter... を省略

完成したプロジェクトの構成は次のとおりです。

![1630467830654](Resources/1630467830654.png)

#### 4.2.2 引数の受け渡し :id=h-097f3bb2b302

##### GET 単一の引数の送信 :id=h-e82ea5564664

リクエストと引数を送信する：

```
http://localhost/commonParam?name=itcast
```

![1630467921300](Resources/1630467921300.png)

引数を受け取る：

```java
@Controller
public class UserController {

    @RequestMapping("/commonParam")
    @ResponseBody
    public String commonParam(String name){
        System.out.println("普通参数传递 name ==> "+name);
        return "{'module':'commonParam'}";
    }
}
```

##### GET 複数の引数の送信 :id=h-fe636cf1dd54

リクエストと引数を送信する：

```
http://localhost/commonParam?name=itcast&age=15
```

![1630468045733](Resources/1630468045733.png)

引数を受け取る：

```java
@Controller
public class UserController {

    @RequestMapping("/commonParam")
    @ResponseBody
    public String commonParam(String name,int age){
        System.out.println("普通参数传递 name ==> "+name);
        System.out.println("普通参数传递 age ==> "+age);
        return "{'module':'commonParam'}";
    }
}
```

##### GET リクエストの中国語の文字化け :id=h-f2679c408e5c

引数に中国語が含まれると、受信した値が文字化けする場合があります。

リクエストを送信：`http://localhost/commonParam?name=张三&age=18`

コンソール：

![1630480536510](Resources/1630480536510.png)

Tomcat 8.5 より後のバージョンでは対応済みですが、IDEA の Tomcat プラグインはここでは Tomcat 7 までなので、pom.xml を変更して GET リクエストの中国語の文字化けに対処します。

```xml
<build>
    <plugins>
      <plugin>
        <groupId>org.apache.tomcat.maven</groupId>
        <artifactId>tomcat7-maven-plugin</artifactId>
        <version>2.1</version>
        <configuration>
          <port>80</port><!-- See note 1 below. -->
          <path>/</path> <!-- See note 2 below. -->
          <uriEncoding>UTF-8</uriEncoding><!-- See note 3 below. -->
        </configuration>
      </plugin>
    </plugins>
  </build>
```

例の説明：

1. Tomcat のポート番号
2. コンテキストパス
3. アクセスパスのエンコードとデコードの文字セット

##### POST 引数の送信 :id=h-3788397f4e90

リクエストと引数を送信する：

![1630480812809](Resources/1630480812809.png) 引数を受け取る：

GET と同じで、変更は不要です。

```java
@Controller
public class UserController {

    @RequestMapping("/commonParam")
    @ResponseBody
    public String commonParam(String name,int age){
        System.out.println("普通参数传递 name ==> "+name);
        System.out.println("普通参数传递 age ==> "+age);
        return "{'module':'commonParam'}";
    }
}
```

##### POST リクエストの中国語の文字化け :id=h-40c4b568c9b0

リクエストと引数を送信する：

![1630480964421](Resources/1630480964421.png)

引数を受け取る：

コンソールに出力すると、中国語が文字化けしています。

![1630481008109](Resources/1630481008109.png)

解決方法：フィルターを設定する

```java
public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {
    protected Class<?>[] getRootConfigClasses() {
        return new Class[0];
    }

    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{SpringMvcConfig.class};
    }

    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    // See note 1 below.
    @Override
    protected Filter[] getServletFilters() {
        CharacterEncodingFilter filter = new CharacterEncodingFilter();
        filter.setEncoding("UTF-8");
        return new Filter[]{filter};
    }
}
```

例の説明：

1. 文字化けへの対応

CharacterEncodingFilter は spring-web パッケージにあるため、使用前に対応する jar を導入します。

### 4.3 5種類の引数の受け渡し :id=h-98a3e2c7cb86

GET と POST で単純なリクエストとデータを送れるようになりました。次に、より複雑な引数の受け渡しを学びます。よく使う種類は次のとおりです。

- 通常の引数
- POJO 型の引数
- 入れ子の POJO 型の引数
- 配列型の引数
- コレクション型の引数

これらをどう送り、受け取るのでしょうか。1つずつ学びます。

#### 4.3.1 通常の引数 :id=h-7e37041e19cc

- 通常の URL 引数：URL の引数名と仮引数名が同じなら、仮引数を定義するだけで受け取れます。

![1630481585729](Resources/1630481585729.png)

仮引数と URL の引数名が違う場合は、どうすればよいでしょうか。

リクエストと引数を送信する：

```
http:// See note 1 below.
```

例の説明：

1. localhost/commonParamDifferentName?name=張三\&age=18

バックエンドで引数を受け取る：

```java
@RequestMapping("/commonParamDifferentName")
@ResponseBody
public String commonParamDifferentName(String userName , int age){
    System.out.println("普通参数传递 userName ==> "+userName);
    System.out.println("普通参数传递 age ==> "+age);
    return "{'module':'common param different name'}";
}
```

フロントエンドは `name`、バックエンドは `userName` を使っており、名前が一致しないため受け取れません。

![1630481772035](Resources/1630481772035.png)

解決方法：@RequestParam アノテーションを使用する

```java
@RequestMapping("/commonParamDifferentName")
    @ResponseBody
    public String commonParamDifferentName(@RequestPaam("name") String userName , int age){
        System.out.println("普通参数传递 userName ==> "+userName);
        System.out.println("普通参数传递 age ==> "+age);
        return "{'module':'common param different name'}";
    }
```

**@RequestParam はバインドする名前、必須かどうか、既定値を明示します。フレームワークによる読み取りと変換は必要であり、性能向上が保証されるわけではありません。**

#### 4.3.2 POJO データ型 :id=h-4e24eefaeb4a

引数が少ないリクエストには単純型が適しています。引数が多いと受け取りが複雑になるため、POJO 型を検討できます。

- POJO 引数：リクエストの引数名とオブジェクトのプロパティ名が一致すれば、POJO 型の仮引数を定義して受け取れます。

前に用意した POJO クラスを使用します。まず User を見てみます。

```java
public class User {
    private String name;
    private int age;
    // See note 1 below.
}
```

例の説明：

1. setter...getter... を省略

リクエストと引数を送信する：

![1630482186745](Resources/1630482186745.png)

バックエンドで引数を受け取る：

```java
// See note 1 below.
@RequestMapping("/pojoParam")
@ResponseBody
public String pojoParam(User user){
    System.out.println("pojo参数传递 user ==> "+user);
    return "{'module':'pojo param'}";
}
```

例の説明：

1. POJO 引数：リクエストの引数を、仮引数オブジェクトのプロパティに対応させれば渡せます。

**注意：**

- POJO を受け取る場合も、フロントエンドの GET と POST の送信方法は変わりません。
- \==リクエストのキー名と POJO のプロパティ名を一致させます。一致しないと格納できません。==

#### 4.3.3 入れ子の POJO 型の引数 :id=h-51511b35b684

POJO オブジェクトに別の POJO クラスが入れ子になっている場合の例です。

```java
public class Address {
    private String province;
    private String city;
    // See note 1 below.
}
public class User {
    private String name;
    private int age;
    private Address address;
    // See note 2 below.
}
```

例の説明：

1. setter...getter... を省略
2. setter...getter... を省略

- 入れ子の POJO 引数：リクエスト名をオブジェクトの階層構造に沿ったプロパティ名に一致させれば、入れ子の POJO のプロパティも受け取れます。

リクエストと引数を送信する：

![1630482363291](Resources/1630482363291.png)

バックエンドで引数を受け取る：

```java
// See note 1 below.
@RequestMapping("/pojoParam")
@ResponseBody
public String pojoParam(User user){
    System.out.println("pojo参数传递 user ==> "+user);
    return "{'module':'pojo param'}";
}
```

例の説明：

1. POJO 引数：リクエストの引数を、仮引数オブジェクトのプロパティに対応させれば渡せます。

**注意：**

\==リクエストのキー名と POJO のプロパティ名を一致させます。一致しないと格納できません。==

#### 4.3.4 配列型の引数 :id=h-766c34e2907e

例えば、ユーザーの趣味は通常複数あります。このデータをどう送り、受け取ればよいでしょうか。

- 配列の引数：同じ名前のリクエスト値が複数ある場合、その名前の配列型の仮引数を定義して受け取れます。

リクエストと引数を送信する：

![1630482999626](Resources/1630482999626.png)

バックエンドで引数を受け取る：

```java
  // See note 1 below.
    @RequestMapping("/arrayParam")
    @ResponseBody
    public String arrayParam(String[] likes){
        System.out.println("数组参数传递 likes ==> "+ Arrays.toString(likes));
        return "{'module':'array param'}";
    }
```

例の説明：

1. 同じ名前のリクエストパラメーターは、対応する名前の仮引数の配列に直接マッピングできます。

#### 4.3.5 コレクション型の引数 :id=h-2a6c1db1b020

配列で複数の値を受け取れますが、コレクションでも同じことができるでしょうか。

リクエストと引数を送信する：

![1630484283773](Resources/1630484283773.png)

バックエンドで引数を受け取る：

```java
// See note 1 below.
@RequestMapping("/listParam")
@ResponseBody
public String listParam(List<String> likes){
    System.out.println("集合参数传递 likes ==> "+ likes);
    return "{'module':'list param'}";
}
```

例の説明：

1. コレクションの引数：@RequestParam で、同じ名前の複数のリクエストパラメーターを対応するコレクションにマッピングできます。

実行するとエラーになります。

![1630484339065](Resources/1630484339065.png)

SpringMVC が List を POJO オブジェクトとして扱い、インスタンス化してフロントエンドのデータを格納しようとします。しかし List はインターフェースなので生成できず、エラーになります。

解決方法：`@RequestParam` アノテーションを使用します。

```java
// See note 1 below.
@RequestMapping("/listParam")
@ResponseBody
public String listParam(@RequestParam List<String> likes){
    System.out.println("集合参数传递 likes ==> "+ likes);
    return "{'module':'list param'}";
}
```

例の説明：

1. コレクションの引数：@RequestParam で、同じ名前の複数のリクエストパラメーターを対応するコレクションにマッピングできます。

- 通常の値をコレクションに格納する場合は、仮引数のコレクション名と同じ名前で複数の値を送り、@RequestParam で結び付けます。
- 単純なデータ型では、コレクションより配列の方が簡単です。

### 重要事項1：@RequestParam :id=h-9057a07e1475

| 名称     | @RequestParam                               |
| ------ | ------------------------------------------- |
| 型      | 仮引数のアノテーション                                 |
| 位置     | SpringMVC コントローラーメソッドの仮引数の宣言の前              |
| 役割     | リクエストパラメーターとハンドラーメソッドの仮引数を結び付ける             |
| 関連する設定 | required：必須の引数かどうか。<br/>defaultValue：引数の既定値 |

### 4.4 JSON データの受け渡し :id=h-cfb507da46bd

前に説明したように、非同期呼び出しがよく使われます。フロントエンドとバックエンド間では ==JSON== 形式でデータを交換します。フロントエンドが JSON を送る場合、バックエンドはどう受け取ればよいでしょうか。

JSON のデータには、主に3つの形式があります。

- 通常の値の json 配列（\["value1","value2","value3",...]）
- json オブジェクト（{key1:value1,key2:value2,...}）
- json オブジェクトの配列（\[{key1:value1,...},{key2:value2,...}]）

これらをフロントエンドからどう送り、バックエンドでどう受け取るのでしょうか。

#### JSON の通常の配列 :id=h-7da21e18d33d

###### 手順1：pom.xml に依存関係を追加する :id=h-cd162a18fc1b

SpringMVC は既定で jackson を使って json を変換するため、pom.xml に jackson の依存関係を追加します。

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.9.0</version>
</dependency>
```

###### 手順2：PostMan で JSON データを送信する :id=h-361743632899

![1630485135061](Resources/1630485135061.png)

###### 手順3：SpringMVC のアノテーションサポートを有効にする :id=h-6f522a5aff98

SpringMVC の設定クラスで SpringMVC のアノテーションサポートを有効にします。この機能には、JSON をオブジェクトに変換する処理も含まれます。

```java
@Configuration
@ComponentScan("com.itheima.controller")
// See note 1 below.
@EnableWebMvc
public class SpringMvcConfig {
}
```

例の説明：

1. json データの自動変換を有効にする

###### 手順4：仮引数の前に @RequestBody を付ける :id=h-30af182c03ec

```java
// See note 1 below.
@RequestMapping("/listParamForJson")
@ResponseBody
public String listParamForJson(@RequestBody List<String> likes){
    System.out.println("list common(json)参数传递 list ==> "+likes);
    return "{'module':'list common for json param'}";
}
```

例の説明：

1. @RequestBody で、外部から渡された json 配列のデータを仮引数のコレクションにマッピングします。

###### 手順5：プログラムを起動する :id=h-f997b6932cb1

![1630492624684](Resources/1630492624684.png)

JSON の通常の配列を渡せました。次に、JSON オブジェクトと JSON オブジェクト配列を渡す方法を確認します。

#### JSON オブジェクトのデータ :id=h-f1287df76e78

ここでは、リクエストとデータの送り方、バックエンドでの受け取り方に注目すれば十分です。

リクエストとデータの送信：

```json
{
    "name":"itcast",
    "age":15
}
```

![1630493105450](Resources/1630493105450.png)

バックエンドでデータを受け取る：

```java
@RequestMapping("/pojoParamForJson")
@ResponseBody
public String pojoParamForJson(@RequestBody User user){
    System.out.println("pojo(json)参数传递 user ==> "+user);
    return "{'module':'pojo for json param'}";
}
```

プログラムを起動してアクセステストを行う

![1630493233550](Resources/1630493233550.png)

**説明：**

address が null なのは、フロントエンドが対応するデータを送っていないためです。

address にもデータを格納するには、フロントエンドから送る内容を変更します。

```json
{
    "name":"itcast",
    "age":15,
    "address":{
        "province":"beijing",
        "city":"beijing"
    }
}
```

もう一度リクエストを送ると、address のデータを確認できます。

![1630493450694](Resources/1630493450694.png)

#### JSON オブジェクトの配列 :id=h-2b7275aaa10e

コレクションに複数の POJO を格納するには、どうすればよいでしょうか。

リクエストとデータの送信：

```json
[
    {"name":"itcast","age":15},
    {"name":"itheima","age":12}
]
```

![1630493501205](Resources/1630493501205.png)

バックエンドでデータを受け取る：

```java
@RequestMapping("/listPojoParamForJson")
@ResponseBody
public String listPojoParamForJson(@RequestBody List<User> list){
    System.out.println("list pojo(json)参数传递 list ==> "+list);
    return "{'module':'list pojo for json param'}";
}
```

プログラムを起動してアクセステストを行う

![1630493561137](Resources/1630493561137.png)

**まとめ**

SpringMVC で JSON データを受け取る手順：

(1) jackson パッケージを導入する。

(2) PostMan で JSON データを送信する。

(3) 設定クラスに @EnableWebMvc を追加し、SpringMVC のアノテーション駆動を有効にする。

(4) Controller メソッドの仮引数の前に @RequestBody を付ける。

#### 重要事項1：@EnableWebMvc :id=h-b2c2a67e356c

| 名称 | @EnableWebMvc           |
| -- | ----------------------- |
| 型  | ==設定クラスのアノテーション==       |
| 位置 | SpringMVC の設定クラス宣言の上    |
| 役割 | SpringMVC の各種補助機能を有効にする |

#### 重要事項2：@RequestBody :id=h-4abe6bf097b3

| 名称 | @RequestBody                                   |
| -- | ---------------------------------------------- |
| 型  | ==仮引数のアノテーション==                                |
| 位置 | SpringMVC コントローラーメソッドの仮引数の宣言の前                 |
| 役割 | リクエスト本文のデータを仮引数に渡します。1つのハンドラーメソッドでは1回だけ使用できます。 |

#### @RequestBody と @RequestParam の違い :id=h-b2358104d4dc

- 違い
  - @RequestParam は URL やフォームの引数を受け取ります［application/x-www-form-urlencoded］
  - @RequestBody は json データを受け取ります［application/json］

- 用途
  - 今後の開発では主に json を送るため、@RequestBody を広く使用します。
  - json 以外のデータでは、@RequestParam でリクエストパラメーターを受け取ります。

### 4.5 日付型の引数の受け渡し :id=h-39e3cd664ea3

単純型、POJO、配列、コレクション、JSON を扱いました。次に、開発でよく使う `日期类型` 型を扱います。

日付にはさまざまな入力形式があるため、特別な扱いが必要です。例：

- 2088-08-18
- 2088/08/18
- 08/18/2088
- ......

多くの日付形式を SpringMVC はどう受け取り、適切に処理できるのでしょうか。

#### 手順1：日付データを受け取るメソッドを作成する :id=h-d249b4247e05

UserController クラスに、引数を日付型にしたメソッドを追加します。

```java
@RequestMapping("/dataParam")
@ResponseBody
public String dataParam(Date date) {
    System.out.println("参数传递 date ==> "+date);
    return "{'module':'data param'}";
}
```

#### 手順2：Tomcat を起動する :id=h-6297717ef14a

コンソールでエラーを確認し、発生していれば先に解消します。

#### 手順3：PostMan でリクエストを送信する :id=h-c1141b2893a3

PostMan で GET リクエストを送り、date 引数を指定します。

`http://localhost/dataParam?date=2088/08/08`

![1630494320917](Resources/1630494320917.png)

#### 手順4：コンソールを確認する :id=h-92ab338725b6

![1630494443738](Resources/1630494443738.png)

出力を見ると、SpringMVC が日付型を受け取り、コンソールに表示できることが分かります。

日付の形式を変えても、SpringMVC は処理できるでしょうか。

#### 手順5：日付形式を変更する :id=h-453380f82468

実行結果を分かりやすくするため、日付の引数をもう1つ追加します。

```java
@RequestMapping("/dataParam")
@ResponseBody
public String dataParam(Date date,Date date1) {
    System.out.println("参数传递 date ==> "+date);
    return "{'module':'data param'}";
}
```

PostMan で、異なる2つの日付形式を含むリクエストを送ります。

`http://localhost/dataParam?date=2088/08/08&date1=2088-08-08`

![1630494565970](Resources/1630494565970.png)

送信すると、ページに400、コンソールにエラーが表示されます。

Resolved \[org.springframework.web.method.annotation.==MethodArgumentTypeMismatchException==: Failed to convert value of type 'java.lang.String' to required type 'java.util.Date'; nested exception is org.springframework.core.convert.==ConversionFailedException==: Failed to convert from type \[java.lang.String] to type \[java.util.Date] for value '2088-08-08'; nested exception is java.lang.IllegalArgumentException]

エラーから、`2088-08-08` を日付型に変換できなかったことが分かります。SpringMVC が既定で対応する形式は `yyyy/MM/dd` ですが、送った値が一致しないため、SpringMVC は変換できません。

`@DateTimeFormat` を使えば解決できます。

```java
@RequestMapping("/dataParam")
@ResponseBody
public String dataParam(Date date,
                        @DateTimeFormat(pattern="yyyy-MM-dd") Date date1) {
    System.out.println("参数传递 date ==> "+date);
    System.out.println("参数传递 date1(yyyy-MM-dd) ==> "+date1);
    return "{'module':'data param'}";
}
```

サーバーを再起動してもう一度送信すると、SpringMVC が日付を正しく変換します。

![1630495221038](Resources/1630495221038.png)

#### 手順6：時刻を含む日付 :id=h-5fe451d6051c

次に、時刻を含む日付を送り、SpringMVC の処理を確認します。

UserController クラスを変更し、3つ目の引数を追加します。

```java
@RequestMapping("/dataParam")
@ResponseBody
public String dataParam(Date date,
                        @DateTimeFormat(pattern="yyyy-MM-dd") Date date1,
                        @DateTimeFormat(pattern="yyyy/MM/dd HH:mm:ss") Date date2) {
    System.out.println("参数传递 date ==> "+date);
    System.out.println("参数传递 date1(yyyy-MM-dd) ==> "+date1);
    System.out.println("参数传递 date2(yyyy/MM/dd HH:mm:ss) ==> "+date2);
    return "{'module':'data param'}";
}
```

PostMan で、異なる2つの日付形式を含むリクエストを送ります。

`http://localhost/dataParam?date=2088/08/08&date1=2088-08-08&date2=2088/08/08 8:08:08`

![1630495347289](Resources/1630495347289.png)

サーバーを再起動して再送信すると、SpringMVC が日付と時刻を変換できます。

![1630495507353](Resources/1630495507353.png)

#### 重要事項1：@DateTimeFormat :id=h-56af45ab43d8

| 名称     | @DateTimeFormat             |
| ------ | --------------------------- |
| 型      | ==仮引数のアノテーション==             |
| 位置     | SpringMVC コントローラーメソッドの仮引数の前 |
| 役割     | 日付と時刻のデータ形式を設定する            |
| 関連する属性 | pattern：日付と時刻の書式文字列         |

#### 内部の仕組み :id=h-e048128ffd80

内部の仕組みを説明する前に、次の点を考えます。

- フロントエンドは文字列を送り、バックエンドは Date で受け取ります。
- フロントエンドは JSON を送り、バックエンドはオブジェクトで受け取ります。
- フロントエンドは文字列を送り、バックエンドは Integer で受け取ります。
- バックエンドではさまざまなデータ型が必要です。
- データの受け渡しには、多くの型変換が伴います。

問い：誰が型変換を行うのでしょうか。

答え：SpringMVC

問い：SpringMVC はどう型を変換するのでしょうか。

答え：SpringMVC は、多くの型変換インターフェースと実装クラスを提供しています。

フレームワークの型変換インターフェースには、次のものがあります。

- (1) Converter インターフェース

```java
/**
*	S: the source type
*	T: the target type
*/
public interface Converter<S, T> {
    @Nullable
    // See note 1 below.
    T convert(S source);
}
```

例の説明：

1. このメソッドは、ページから受け取ったデータ（S）を必要な型（T）に変換して返します。

**注意：Converter の所属パッケージは `org.springframework.core.convert.converter` です。**

Converter インターフェースの実装クラス

![1630496385398](Resources/1630496385398.png)

フレームワークは、異なる型の変換に対応する多数の Converter 実装を提供します。例：

年齢のリクエストパラメーター（String → Integer）

日付の変換（String → Date）

- (2) HttpMessageConverter インターフェース

このインターフェースは、オブジェクトと JSON の相互変換を行います。

**この節の Spring MVC の手動設定では @EnableWebMvc を使用します。Spring Boot では通常、自動構成が MVC をサポートします。直接追加すると MVC の構成を引き継ぐため、区別せずにコピーしてはいけません。**

### 4.6 レスポンス :id=h-1e9e0d6dbfac

SpringMVC はリクエストとデータを受け取って処理します。Service に渡し、さらに Dao を呼ぶ場合もあります。どの処理経路でも、終了後は結果をユーザーに返す必要があります。

例：ユーザーの ID による検索、一覧表示、新規追加など。

レスポンスには主に次の2種類があります。

- ページを返す
- データを返す
  - テキストデータ
  - json データ

非同期呼び出しが一般的なため、JSON データの返し方を中心に学びます。ほかの方法は概要を理解すれば十分です。

#### 4.6.1 環境の準備 :id=h-9a1e642f3e7a

- Maven の Web プロジェクトを作成する

- pom.xml に Spring の依存関係を追加します。

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>

  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>springmvc_05_response</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
      <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>
      <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.9.0</version>
      </dependency>
    </dependencies>

    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.tomcat.maven</groupId>
          <artifactId>tomcat7-maven-plugin</artifactId>
          <version>2.1</version>
          <configuration>
            <port>80</port>
            <path>/</path>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </project>

  ```

- 対応する設定クラスを作成する

  ```java
  public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {
      protected Class<?>[] getRootConfigClasses() {
          return new Class[0];
      }

      protected Class<?>[] getServletConfigClasses() {
          return new Class[]{SpringMvcConfig.class};
      }

      protected String[] getServletMappings() {
          return new String[]{"/"};
      }

      // See note 1 below.
      @Override
      protected Filter[] getServletFilters() {
          CharacterEncodingFilter filter = new CharacterEncodingFilter();
          filter.setEncoding("UTF-8");
          return new Filter[]{filter};
      }
  }

  @Configuration
  @ComponentScan("com.itheima.controller")
  // See note 2 below.
  @EnableWebMvc
  public class SpringMvcConfig {
  }


  ```

例の説明：

1. 文字化けへの対応
2. json データの自動変換を有効にする

- User モデルクラスを作成する

  ```java
  public class User {
      private String name;
      private int age;
      // See note 1 below.
  }
  ```

例の説明：

1. getter...setter...toString を省略

- webapp の下に page.jsp を作成する

  ```jsp
  <html>
  <body>
  <h2>Hello Spring MVC!</h2>
  </body>
  </html>
  ```

- UserController を作成する

  ```java
  @Controller
  public class UserController {


  }
  ```

完成したプロジェクトの構成は次のとおりです。

![1630497314131](Resources/1630497314131.png)

#### 4.6.2 ページを返す（概要） :id=h-744e48f7a30d

##### 手順1：返すページを設定する :id=h-d5e3d3eca44e

```java
@Controller
public class UserController {

    @RequestMapping("/toJumpPage")
    // See note 1 below.
    // See note 2 below.
    // See note 3 below.
    public String toJumpPage(){
        System.out.println("跳转页面");
        return "page.jsp";
    }

}
```

例の説明：

1. 注意
2. 1\. ここには @ResponseBody を付けません。付けると page.jsp を文字列として直接返します。
3. 2\. メソッドは String を返す必要があります。

##### 手順2：プログラムを起動してテストする :id=h-b99acba3b355

ページ遷移があるため、このテストでは PostMan を使わず、ブラウザーを開いて次を入力します。

`http://localhost/toJumpPage`

![1630497496785](Resources/1630497496785.png)

#### 4.6.3 テキストデータを返す（概要） :id=h-aada80c5e31c

##### 手順1：返すテキストを設定する :id=h-f45cecc85013

```java
@Controller
public class UserController {

       @RequestMapping("/toText")
    // See note 1 below.
    @ResponseBody
    public String toText(){
        System.out.println("返回纯文本数据");
        return "response text";
    }

}
```

例の説明：

1. ここではアノテーションを省略できません。省略すると response text をページ名として探し、存在しなければ404エラーになります。

##### 手順2：プログラムを起動してテストする :id=h-6d20d6663e07

ページ遷移はありません。GET リクエストなので、ブラウザーまたは PostMan で `http://localhost/toText` にアクセスして確認できます。

![1630497741388](Resources/1630497741388.png)

#### 4.6.4 JSON データを返す :id=h-2a84ac809dc8

##### POJO オブジェクトを返す :id=h-b3a896ecbf1f

```java
@Controller
public class UserController {

    @RequestMapping("/toJsonPOJO")
    @ResponseBody
    public User toJsonPOJO(){
        System.out.println("返回json对象数据");
        User user = new User();
        user.setName("itcast");
        user.setAge(15);
        return user;
    }

}
```

戻り値をエンティティ型にしてオブジェクトを返すと、対応する json データを返せます。==@ResponseBody== と ==@EnableWebMvc== が必要です。

サーバーを再起動し、`http://localhost/toJsonPOJO` にアクセスします。

![1630497954896](Resources/1630497954896.png)

##### POJO コレクションオブジェクトを返す :id=h-c36f48bd4d2f

```java
@Controller
public class UserController {

    @RequestMapping("/toJsonList")
    @ResponseBody
    public List<User> toJsonList(){
        System.out.println("返回json集合数据");
        User user1 = new User();
        user1.setName("传智播客");
        user1.setAge(15);

        User user2 = new User();
        user2.setName("黑马程序员");
        user2.setAge(12);

        List<User> userList = new ArrayList<User>();
        userList.add(user1);
        userList.add(user2);

        return userList;
    }

}

```

サーバーを再起動し、`http://localhost/toJsonList` にアクセスします。

![1630498084047](Resources/1630498084047.png)

#### 重要事項1：@ResponseBody :id=h-45ccf0a62d0d

| 名称     | @ResponseBody                                              |
| ------ | ---------------------------------------------------------- |
| 型      | ==メソッド／クラスのアノテーション==                                       |
| 位置     | SpringMVC のコントローラーメソッドまたはクラス宣言の上                           |
| 役割     | コントローラーの戻り値をレスポンス本文にします。<br/> をクラスに付けると、すべてのメソッドに適用されます。   |
| 関連する属性 | なし。返却形式は HttpMessageConverter とレスポンスの Content-Type で決まります。 |

**説明：**

- このアノテーションはクラスにもメソッドにも付けられます。
- クラスに付けると、全メソッドに @ReponseBody の機能が適用されます。
- メソッドに @ReponseBody がある場合：
  - 戻り値が文字列なら、そのままテキストとしてフロントエンドへ返します。
  - 戻り値がオブジェクトなら、JSON に変換して返します。

ここでも変換を使い、Jackson の JSON コンバーターなど、HttpMessageConverter の実装が処理します。前の機能に加えて、コンバーターは次の変換もできます。

- オブジェクトから Json への変換（POJO → json）
- コレクションから Json への変換（Collection → json）

<a id="section-5"></a>

## 5. REST スタイル :id=h-70980392f15c

REST スタイルでは、次の内容を学びます。

- REST の概要
- REST の入門例
- REST による簡単な開発
- 例：RESTful に基づくページのデータ連携

### 5.1 REST の概要 :id=h-1a51ac79ec3d

- \==REST==（Representational State Transfer、表現状態転送）は、ソフトウェアアーキテクチャの ==スタイル== です。

  ネットワークリソースの表し方には2つあります。

  - 従来のリソース URL
    - `http://localhost/user/getById?id=1` id が1のユーザー情報を検索する
    - `http://localhost/user/saveUser` ユーザー情報を保存する
  - REST スタイルのリソース URL
    - `http://localhost/user/1`
    - `http://localhost/user`

従来は1つのリクエスト URL が1つの操作に対応します。この方法は煩雑なうえ安全性にも問題があり、プログラミングを知っている人なら URL から処理内容をおおよそ推測できます。

REST スタイルではアドレスが簡単になり、リクエストの URL を見るだけでは、その URL の具体的な機能を推測しにくくなります。

REST の利点は次のとおりです。

- アクセスの動作を URL から分離し、アドレスだけではリソースへの操作を判別できない
- 記述が簡単になる

ただし、同じ URL で追加、更新、検索ができるなら、どの操作なのかをどう区別すればよいでしょうか。

- REST スタイルでは、==動作== でリソースへの操作を区別します。
  - `http://localhost/users` 全ユーザー情報の検索 GET（検索）
  - `http://localhost/users/1` 指定ユーザー情報の検索 GET（検索）
  - `http://localhost/users` ユーザー情報の追加 POST（追加／保存）
  - `http://localhost/users` ユーザー情報の更新 PUT（変更／更新）
  - `http://localhost/users/1` ユーザー情報の削除 DELETE（削除）

リクエストメソッドには多くの種類がありますが、よく使うのは `GET`、`POST`、`PUT`、`DELETE` の4つです。

異なるリクエストメソッドで、異なる操作を表します。

- GET リクエストは検索に使います。
- POST リクエストは追加に使います。
- PUT リクエストは更新に使います。
- DELETE リクエストは削除に使います。

ただし、==注意してください。==

- これらの動作は規約であって強制的な仕様ではなく、外すこともできるため、REST の仕様ではなく REST スタイルと呼んでいます。
  - REST のアーキテクチャに従って設計すると、開発の複雑さを減らし、システムの拡張性を高められます。
  - REST では GET/POST/PUT/DELETE を検索／追加／更新／削除に対応させます。ただし、プログラム上は GET で削除を実装することも可能です。
  - 多くの人がこのスタイルに従う中で外れると、他の人がコードを理解しにくくなります。
- モジュール名は通常、users、books、accounts のような複数形にし、単一のものではなくリソースの種類を表します。

REST スタイルが分かったら、次によく出てくる `RESTful` という言葉を確認します。RESTful とは何でしょうか。

- REST スタイルに従ったリソースへのアクセスを ==RESTful== と呼びます。

今後は REST スタイルに従ってバックエンドへアクセスすることが多く、主に RESTful に基づいて開発します。

### 5.2 RESTful の入門例 :id=h-6e4d6143117d

#### 5.2.1 環境の準備 :id=h-f05bd22c977f

- Maven の Web プロジェクトを作成する

- pom.xml に Spring の依存関係を追加します。

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>

  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>springmvc_06_rest</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
      <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>
      <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.9.0</version>
      </dependency>
    </dependencies>

    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.tomcat.maven</groupId>
          <artifactId>tomcat7-maven-plugin</artifactId>
          <version>2.1</version>
          <configuration>
            <port>80</port>
            <path>/</path>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </project>

  ```

- 対応する設定クラスを作成する

  ```java
  public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {
      protected Class<?>[] getRootConfigClasses() {
          return new Class[0];
      }

      protected Class<?>[] getServletConfigClasses() {
          return new Class[]{SpringMvcConfig.class};
      }

      protected String[] getServletMappings() {
          return new String[]{"/"};
      }

      // See note 1 below.
      @Override
      protected Filter[] getServletFilters() {
          CharacterEncodingFilter filter = new CharacterEncodingFilter();
          filter.setEncoding("UTF-8");
          return new Filter[]{filter};
      }
  }

  @Configuration
  @ComponentScan("com.itheima.controller")
  // See note 2 below.
  @EnableWebMvc
  public class SpringMvcConfig {
  }


  ```

例の説明：

1. 文字化けへの対応
2. json データの自動変換を有効にする

- User と Book のモデルクラスを作成する

  ```java
  public class User {
      private String name;
      private int age;
      // See note 1 below.
  }

  public class Book {
      private String name;
      private double price;
       // See note 2 below.
  }
  ```

例の説明：

1. getter...setter...toString を省略
2. getter...setter...toString を省略

- UserController と BookController を作成する

  ```java
  @Controller
  public class UserController {
      @RequestMapping("/save")
      @ResponseBody
      public String save(@RequestBody User user) {
          System.out.println("user save..."+user);
          return "{'module':'user save'}";
      }

      @RequestMapping("/delete")
      @ResponseBody
      public String delete(Integer id) {
          System.out.println("user delete..." + id);
          return "{'module':'user delete'}";
      }

      @RequestMapping("/update")
      @ResponseBody
      public String update(@RequestBody User user) {
          System.out.println("user update..." + user);
          return "{'module':'user update'}";
      }

      @RequestMapping("/getById")
      @ResponseBody
      public String getById(Integer id) {
          System.out.println("user getById..." + id);
          return "{'module':'user getById'}";
      }

      @RequestMapping("/findAll")
      @ResponseBody
      public String getAll() {
          System.out.println("user getAll...");
          return "{'module':'user getAll'}";
      }
  }


  @Controller
  public class BookController {

      @RequestMapping(value = "/books",method = RequestMethod.POST)
      @ResponseBody
      public String save(@RequestBody Book book){
          System.out.println("book save..." + book);
          return "{'module':'book save'}";
      }

      @RequestMapping(value = "/books/{id}",method = RequestMethod.DELETE)
      @ResponseBody
      public String delete(@PathVariable Integer id){
          System.out.println("book delete..." + id);
          return "{'module':'book delete'}";
      }

      @RequestMapping(value = "/books",method = RequestMethod.PUT)
      @ResponseBody
      public String update(@RequestBody Book book){
          System.out.println("book update..." + book);
          return "{'module':'book update'}";
      }

      @RequestMapping(value = "/books/{id}",method = RequestMethod.GET)
      @ResponseBody
      public String getById(@PathVariable Integer id){
          System.out.println("book getById..." + id);
          return "{'module':'book getById'}";
      }

      @RequestMapping(value = "/books",method = RequestMethod.GET)
      @ResponseBody
      public String getAll(){
          System.out.println("book getAll...");
          return "{'module':'book getAll'}";
      }

  }
  ```

完成したプロジェクトの構成は次のとおりです。

![1630503741455](Resources/1630503741455.png)

#### 5.2.2 方針の検討 :id=h-08de1e174641

> 要件：以前の CRUD を、RESTful の方法に置き換えます。
>
> 1\. 操作ごとに異なっていたパスを、共通のパスに変更します。
>
> 変更前：追加 /save、更新 /update、削除 /delete…
>
> 変更後：CRUD は /users
>
> 2\. 検索は GET、追加は POST、更新は PUT、削除は DELETE に、メソッドのリクエスト方式を制限します。
>
> 3\. リクエストの引数をどう設定すればよいでしょうか。

#### 5.2.3 RESTful スタイルへの変更 :id=h-ac1af51bddb9

##### 追加 :id=h-139ed1c14784

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users",method = RequestMethod.POST)
    @ResponseBody
    public String save() {
        System.out.println("user save...");
        return "{'module':'user save'}";
    }
}
```

例の説明：

1. リクエストメソッドを POST に設定し、REST スタイルの追加を表す

- リクエストパスを `/users` に変更します。

  - このメソッドには POST：`http://localhost/users` でアクセスします。

- method 属性でアクセス方式を `POST` に制限します。

  - POST ではなく GET などを送ると、エラーになります。

    ![1630505392070](Resources/1630505392070.png)

##### 削除 :id=h-46b3e2d7c083

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users",method = RequestMethod.DELETE)
    @ResponseBody
    public String delete(Integer id) {
        System.out.println("user delete..." + id);
        return "{'module':'user delete'}";
    }
}
```

例の説明：

1. リクエストメソッドを DELETE に設定し、REST スタイルの削除を表す

- リクエストパスを `/users` に変更します。
  - このメソッドには DELETE：`http://localhost/users` でアクセスします。

アクセスは成功しますが、削除対象の id を渡していません。RESTful の開発ではどうデータを渡すのでしょうか。

###### パスパラメーターの受け渡し :id=h-add8b6964574

フロントエンドは `http://localhost/users/1` で送信します。パス内の `1` が渡したい引数です。

バックエンドで受け取るには、次のように変更します。

- パスに一致させるため、@RequestMapping の value を `/users/{id}` に変更します。
- メソッドの仮引数の前に @PathVariable を付けます。

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users/{id}",method = RequestMethod.DELETE)
    @ResponseBody
    public String delete(@PathVariable Integer id) {
        System.out.println("user delete..." + id);
        return "{'module':'user delete'}";
    }
}
```

例の説明：

1. リクエストメソッドを DELETE に設定し、REST スタイルの削除を表す

**次の2点を考えてみましょう。**

(1) 仮引数名とパス内の `{}` の値が異なる場合はどうすればよいでしょうか。

![1630506231379](Resources/1630506231379.png)

(2) 複数の引数を渡す場合は、どう記述するのでしょうか。

フロントエンドは `http://localhost/users/1/tom` で送信します。パス内の `1` と `tom` が渡したい2つの引数です。

バックエンドで受け取るには、次のように変更します。

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users/{id}/{name}",method = RequestMethod.DELETE)
    @ResponseBody
    public String delete(@PathVariable Integer id,@PathVariable String name) {
        System.out.println("user delete..." + id+","+name);
        return "{'module':'user delete'}";
    }
}
```

例の説明：

1. リクエストメソッドを DELETE に設定し、REST スタイルの削除を表す

##### 更新 :id=h-eda12bccaf46

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users",method = RequestMethod.PUT)
    @ResponseBody
    public String update(@RequestBody User user) {
        System.out.println("user update..." + user);
        return "{'module':'user update'}";
    }
}
```

例の説明：

1. リクエストメソッドを PUT に設定し、REST スタイルの更新を表す

- リクエストパスを `/users` に変更します。

  - このメソッドには PUT：`http://localhost/users` でアクセスします。

- 引数を添えてアクセスする：

  ![1630506507096](Resources/1630506507096.png)

##### ID による検索 :id=h-df00cbe14ced

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users/{id}" ,method = RequestMethod.GET)
    @ResponseBody
    public String getById(@PathVariable Integer id){
        System.out.println("user getById..."+id);
        return "{'module':'user getById'}";
    }
}
```

例の説明：

1. リクエストメソッドを GET に設定し、REST スタイルの検索を表す

リクエストパスを `/users` に変更します。

- このメソッドには GET：`http://localhost/users/666` でアクセスします。

##### 全件検索 :id=h-9944f3d2644b

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users" ,method = RequestMethod.GET)
    @ResponseBody
    public String getAll() {
        System.out.println("user getAll...");
        return "{'module':'user getAll'}";
    }
}
```

例の説明：

1. リクエストメソッドを GET に設定し、REST スタイルの検索を表す

リクエストパスを `/users` に変更します。

- このメソッドには GET：`http://localhost/users` でアクセスします。

**まとめ**

RESTful の入門例では、次の内容を学びます。

(1) HTTP リクエストの動作（動詞）の設定

@RequestMapping(value="",==method== = RequestMethod.==POST|GET|PUT|DELETE==)

(2) リクエストパラメーター（パス変数）の設定

@RequestMapping(value="/users/=={id}==",method = RequestMethod.DELETE)

@ReponseBody

public String delete(==@PathVariable== Integer ==id==){

}

#### 重要事項1：@PathVariable :id=h-14ecd1ce5e54

| 名称 | @PathVariable                                      |
| -- | -------------------------------------------------- |
| 型  | ==仮引数のアノテーション==                                    |
| 位置 | SpringMVC コントローラーメソッドの仮引数の宣言の前                     |
| 役割 | パスパラメーターとハンドラーメソッドの仮引数を結び付けます。名前を1対1で対応させる必要があります。 |

引数を受け取る `@RequestBody`、`@RequestParam`、`@PathVariable` の3つのアノテーションを学びました。違いと用途は何でしょうか。

- 違い
  - @RequestParam は URL またはフォームの引数を受け取ります。
  - @RequestBody は json データを受け取ります。
  - @PathVariable はパスパラメーターを受け取ります。{引数名} で表します。
- 用途
  - 今後、複数の引数を送る場合は主に json を使うため、@RequestBody をよく使用します。
  - json 以外のデータでは、@RequestParam でリクエストパラメーターを受け取ります。
  - RESTful の開発で引数が1つなど少ない場合、@PathVariable でパス変数を受け取れます。通常は id の受け渡しに使います。

### 5.3 RESTful による簡単な開発 :id=h-2fa6e92cfc59

RESTful を実装して、==手間がかかる== と感じたかもしれません。どこが問題でしょうか。

![1630507339724](Resources/1630507339724.png)

問題1：各メソッドの @RequestMapping に /books パスを繰り返し記述しています。

問題2：各メソッドの @RequestMapping で、method 属性にリクエストメソッドを指定しています。

問題3：json を返す各メソッドに、@ResponseBody を繰り返し付けています。

この3つの問題を、どう解決すればよいでしょうか。

```java
@RestController //@Controller + ReponseBody
@RequestMapping("/books")
public class BookController {

    //@RequestMapping(method = RequestMethod.POST)
    @PostMapping
    public String save(@RequestBody Book book){
        System.out.println("book save..." + book);
        return "{'module':'book save'}";
    }

    //@RequestMapping(value = "/{id}",method = RequestMethod.DELETE)
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id){
        System.out.println("book delete..." + id);
        return "{'module':'book delete'}";
    }

    //@RequestMapping(method = RequestMethod.PUT)
    @PutMapping
    public String update(@RequestBody Book book){
        System.out.println("book update..." + book);
        return "{'module':'book update'}";
    }

    //@RequestMapping(value = "/{id}",method = RequestMethod.GET)
    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println("book getById..." + id);
        return "{'module':'book getById'}";
    }

    //@RequestMapping(method = RequestMethod.GET)
    @GetMapping
    public String getAll(){
        System.out.println("book getAll...");
        return "{'module':'book getAll'}";
    }

}
```

それぞれに対応する解決方法があります。

問題1：各メソッドの @RequestMapping に /books パスを繰り返し記述しています。

```
将@RequestMapping提到类上面，用来定义所有方法共同的访问路径。
```

問題2：各メソッドの @RequestMapping で、method 属性にリクエストメソッドを指定しています。

```
使用@GetMapping  @PostMapping  @PutMapping  @DeleteMapping代替
```

問題3：json を返す各メソッドに、@ResponseBody を繰り返し付けています。

```
1.将ResponseBody提到类上面，让所有的方法都有@ResponseBody的功能
2.使用@RestController注解替换@Controller与@ResponseBody注解，简化书写
```

#### 重要事項1：@RestController :id=h-d35411730c1e

| 名称 | @RestController                                                              |
| -- | ---------------------------------------------------------------------------- |
| 型  | ==クラスアノテーション==                                                               |
| 位置 | SpringMVC に基づく RESTful コントローラークラス宣言の上                                        |
| 役割 | コントローラーを RESTful スタイルに設定します。<br/> は @Controller と @ResponseBody を組み合わせた機能です。 |

#### 重要事項2：@GetMapping @PostMapping @PutMapping @DeleteMapping :id=h-8c9bd2cd6ac7

| 名称     | @GetMapping @PostMapping @PutMapping @DeleteMapping                       |
| ------ | ------------------------------------------------------------------------- |
| 型      | ==メソッドアノテーション==                                                           |
| 位置     | SpringMVC に基づく RESTful コントローラーメソッド宣言の上                                    |
| 役割     | リクエストパスと動作を設定します。それぞれ1つの動作に対応します。<br/> 例えば @GetMapping は GET リクエストに対応します。 |
| 関連する属性 | value（既定）：リクエストパス                                                         |

### 5.4 RESTful の例 :id=h-924aaff5c460

#### 5.4.1 要件の分析 :id=h-10936a10e6dd

要件1：画像一覧を検索し、バックエンドのデータをページに表示します。

![1630508310063](Resources/1630508310063.png)

要件2：画像を追加し、新しい図書のデータをバックエンドへ送り、コンソールに出力します。

![1630508367105](Resources/1630508367105.png)

\*\*説明：\*\* この例では、SpringMVC で RESTful を使ってフロントエンドとバックエンドを連携することが中心です。データベースには接続せず、すべて `假` データで開発します。

手順の整理：

> 1\. プロジェクトを構築し、jar を導入する。
>
> 2\. 一覧検索と追加の2つのメソッドを持つ Controller クラスを作成する。
>
> 3\. メソッドに RESTful を付けてパスを設定する。
>
> 4\. リクエストと引数の受け取り、結果の返却を実装する。
>
> 5\. PostMan でテストする。
>
> 6\. フロントエンドのページをプロジェクトへコピーする。
>
> 7\. ページから ajax リクエストを送る。
>
> 8\. ページ上でデータを表示する。

#### 5.4.2 環境の準備 :id=h-540a20142739

- Maven の Web プロジェクトを作成する

- pom.xml に Spring の依存関係を追加します。

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>

  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>springmvc_07_rest_case</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
      <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>
      <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.9.0</version>
      </dependency>
    </dependencies>

    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.tomcat.maven</groupId>
          <artifactId>tomcat7-maven-plugin</artifactId>
          <version>2.1</version>
          <configuration>
            <port>80</port>
            <path>/</path>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </project>

  ```

- 対応する設定クラスを作成する

  ```java
  public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {
      protected Class<?>[] getRootConfigClasses() {
          return new Class[0];
      }

      protected Class<?>[] getServletConfigClasses() {
          return new Class[]{SpringMvcConfig.class};
      }

      protected String[] getServletMappings() {
          return new String[]{"/"};
      }

      // See note 1 below.
      @Override
      protected Filter[] getServletFilters() {
          CharacterEncodingFilter filter = new CharacterEncodingFilter();
          filter.setEncoding("UTF-8");
          return new Filter[]{filter};
      }
  }

  @Configuration
  @ComponentScan("com.itheima.controller")
  // See note 2 below.
  @EnableWebMvc
  public class SpringMvcConfig {
  }


  ```

例の説明：

1. 文字化けへの対応
2. json データの自動変換を有効にする

- Book モデルクラスを作成する

  ```java
  public class Book {
      private Integer id;
      private String type;
      private String name;
      private String description;
      // See note 1 below.
  }
  ```

例の説明：

1. setter...getter...toString を省略

- BookController を作成する

  ```java
  @Controller
  public class BookController {


  }
  ```

完成したプロジェクトの構成は次のとおりです。

![1630508864017](Resources/1630508864017.png)

#### 5.4.2 バックエンド API の開発 :id=h-8fe046a2e216

##### 手順1：Controller クラスを作成し、RESTful で設定する :id=h-07c937cb2193

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @PostMapping
    public String save(@RequestBody Book book){
        System.out.println("book save ==> "+ book);
        return "{'module':'book save success'}";
    }

     @GetMapping
    public List<Book> getAll(){
        System.out.println("book getAll is running ...");
        List<Book> bookList = new ArrayList<Book>();

        Book book1 = new Book();
        book1.setType("计算机");
        book1.setName("SpringMVC入门教程");
        book1.setDescription("小试牛刀");
        bookList.add(book1);

        Book book2 = new Book();
        book2.setType("计算机");
        book2.setName("SpringMVC实战教程");
        book2.setDescription("一代宗师");
        bookList.add(book2);

        Book book3 = new Book();
        book3.setType("计算机丛书");
        book3.setName("SpringMVC实战教程进阶");
        book3.setDescription("一代宗师呕心创作");
        bookList.add(book3);

        return bookList;
    }

}
```

##### 手順2：PostMan でテストする :id=h-4123792c74bb

追加のテスト

```json
{
    "type":"计算机丛书",
    "name":"SpringMVC终极开发",
    "description":"这是一本好书"
}
```

![1630509266954](Resources/1630509266954.png)

検索のテスト

![](Resources/image-20210805140307371.png)

#### 5.4.3 ページへのアクセス対応 :id=h-335ea2cb7737

##### 手順1：静的ページをコピーする :id=h-fa25b5c33388

`资料\功能页面` のすべての内容を、プロジェクトの `webapp` ディレクトリへコピーします。

![1630510166433](Resources/1630510166433.png)

##### 手順2：pages 内の books.html にアクセスする :id=h-01bfb8913514

ブラウザーを開き、`http://localhost/pages/books.html` を入力します。

![1630510225182](Resources/1630510225182.png)

(1) なぜエラーが発生するのでしょうか。

![1630510264650](Resources/1630510264650.png)

SpringMVC が静的リソースを捕捉し、/pages/books.html に対応する controller メソッドを探します。見つからないため404になります。

(2) なぜ SpringMVC が静的リソースを捕捉するのでしょうか。

![1630510397429](Resources/1630510397429.png)

(3) 解決方法は何でしょうか。

- SpringMVC で静的リソースの通過を許可する必要があります。

```java
@Configuration
public class SpringMvcSupport extends WebMvcConfigurationSupport {
    // See note 1 below.
    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        // See note 2 below.
        registry.addResourceHandler("/pages/**").addResourceLocations("/pages/");
        registry.addResourceHandler("/js/**").addResourceLocations("/js/");
        registry.addResourceHandler("/css/**").addResourceLocations("/css/");
        registry.addResourceHandler("/plugins/**").addResourceLocations("/plugins/");
    }
}

```

例の説明：

1. 静的リソースのアクセス処理を設定します。このクラスを設定クラスにし、スキャンで読み込む必要があります。
2. /pages/???? へのアクセスでは、/pages ディレクトリから内容を探します。

- 設定クラスは config にありますが、SpringMVC は controller だけをスキャンしているため、まだ有効ではありません。SpringMvcConfig 設定クラスを変更する必要があります。

```java
@Configuration
@ComponentScan({"com.itheima.controller","com.itheima.config"})
@EnableWebMvc
public class SpringMvcConfig {
}

```

または、次の方法を選べます。どちらか1つにし、同名クラスを重複定義しないでください。

```java

@Configuration
@ComponentScan("com.itheima")
@EnableWebMvc
public class SpringMvcConfig {
}
```

##### 手順3：books.html ページを変更する :id=h-9046d9a91f56

```html
<!DOCTYPE html>

<html>
    <head>
        <!-- See note 1 below. -->
        <meta charset="utf-8">
        <title>SpringMVC案例</title>
        <!-- See note 2 below. -->
        <link rel="stylesheet" href="../plugins/elementui/index.css">
        <link rel="stylesheet" href="../plugins/font-awesome/css/font-awesome.min.css">
        <link rel="stylesheet" href="../css/style.css">
    </head>

    <body class="hold-transition">

        <div id="app">

            <div class="content-header">
                <h1>图书管理</h1>
            </div>

            <div class="app-container">
                <div class="box">
                    <div class="filter-container">
                        <el-input placeholder="图书名称" style="width: 200px;" class="filter-item"></el-input>
                        <el-button class="dalfBut">查询</el-button>
                        <el-button type="primary" class="butT" @click="openSave()">新建</el-button>
                    </div>

                    <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
                        <el-table-column type="index" align="center" label="序号"></el-table-column>
                        <el-table-column prop="type" label="图书类别" align="center"></el-table-column>
                        <el-table-column prop="name" label="图书名称" align="center"></el-table-column>
                        <el-table-column prop="description" label="描述" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini">编辑</el-button>
                                <el-button size="mini" type="danger">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="pagination-container">
                        <el-pagination
                            class="pagiantion"
                            @current-change="handleCurrentChange"
                            :current-page="pagination.currentPage"
                            :page-size="pagination.pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="pagination.total">
                        </el-pagination>
                    </div>

                    <!-- See note 3 below. -->
                    <div class="add-form">
                        <el-dialog title="新增图书" :visible.sync="dialogFormVisible">
                            <el-form ref="dataAddForm" :model="formData" :rules="rules" label-position="right" label-width="100px">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="图书类别" prop="type">
                                            <el-input v-model="formData.type"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="图书名称" prop="name">
                                            <el-input v-model="formData.name"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="描述">
                                            <el-input v-model="formData.description" type="textarea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取消</el-button>
                                <el-button type="primary" @click="saveBook()">确定</el-button>
                            </div>
                        </el-dialog>
                    </div>

                </div>
            </div>
        </div>
    </body>

    <!-- See note 4 below. -->
    <script src="../js/vue.js"></script>
    <script src="../plugins/elementui/index.js"></script>
    <script type="text/javascript" src="../js/jquery.min.js"></script>
    <script src="../js/axios-0.18.0.js"></script>

    <script>
        var vue = new Vue({

            el: '#app',

            data:{
                dataList: [],// See note 5 below.
                formData: {},// See note 6 below.
                dialogFormVisible: false,// See note 7 below.
                dialogFormVisible4Edit:false,// See note 8 below.
                pagination: {},// See note 9 below.
            },

            // See note 10 below.
            created() {
                this.getAll();
            },

            methods: {
                // See note 11 below.
                resetForm() {
                    // See note 12 below.
                    this.formData = {};
                },

                // See note 13 below.
                openSave() {
                    this.dialogFormVisible = true;
                    this.resetForm();
                },

                // See note 14 below.
                saveBook () {
                    axios.post("/books",this.formData).then((res)=>{

                    });
                },

                // See note 15 below.
                getAll() {
                    axios.get("/books").then((res)=>{
                        this.dataList = res.data;
                    });
                },

            }
        })
    </script>
</html>
```

例の説明：

1. ページのメタデータ
2. スタイルを読み込む
3. ラベル追加用のポップアップ
4. コンポーネントライブラリを読み込む
5. 現在のページに表示するページング済みの一覧データ
6. フォームのデータ
7. 追加フォームを表示するかどうか
8. 編集フォームの表示を制御する
9. ページングモデルのデータ。現在は使用しない
10. VUE オブジェクトの初期化後に自動実行されるライフサイクルフック
11. フォームをリセットする
12. 入力欄を空にする
13. 追加ウィンドウを開く
14. 追加
15. メインページの一覧検索
