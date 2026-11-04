# SSM：Spring、Spring MVC、MyBatis の連携 :id=h-a17aca482531

完全なプロジェクトで Spring、Spring MVC、MyBatis を連携させ、IoC、AOP、トランザクション を確認します。

**前提知識とバージョン：** Java、Maven、SQL、HTTP の基礎知識が必要です。完全な例は Java 17、Spring 6.2、MyBatis-Spring 3.0、Tomcat 10.1 に固定し、jakarta.servlet を使います。

**サンプルの使い方：** 全ファイルと実行手順が明示されたプロジェクトを除き、コードブロックは各節の独立した断片です。省略記号や仮の名前は補ってください。誤りと記された行は問題を説明するためのものです。同じ節の代替コードを組み合わせないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://mybatis.org/spring/)

**目次**

- [まず 3 つのフレームワークの役割を理解する](#section-1)
- [学習順序とバージョンの対応](#section-2)
- [IoC と 依存性の注入](#section-3)
- [Bean のスコープとライフサイクル](#section-4)
- [再現できる連携プロジェクト](#section-5)
- [AOP：繰り返される横断的な処理をまとめる](#section-6)
- [トランザクションの属性と境界](#section-7)
- [JdbcTemplate、XML、発展的な項目](#section-8)

<a id="section-1"></a>

## まず 3 つのフレームワークの役割を理解する :id=h-88956c3b0b70

SSM は 3 つのフレームワークの組み合わせであり、独立した新しいフレームワークではありません。

| フレームワーク    | 主な役割                                               |
| ---------- | -------------------------------------------------- |
| Spring     | オブジェクトの作成・構成を行い、依存性の注入、AOP、トランザクション管理などを提供する       |
| Spring MVC | HTTP リクエストの受信、パラメーターのバインド、コントローラーの呼び出し、レスポンスの出力を行う |
| MyBatis    | SQL を実行し、データベースの結果を Java オブジェクトにマッピングする            |

リクエストは通常 Controller -> Service -> Mapper -> Database の順に進み、逆の順で戻ります。Model は業務データやモデルを意味し、Mapper ではありません。Java のプロパティは通常列に、オブジェクトは通常 1 行に対応します。

<a id="section-2"></a>

## 学習順序とバージョンの対応 :id=h-cc1a3799048d

先に [MVC の階層化](MVC结构.md)、[JDBC](JDBC基础.md)、[MyBatis](MyBatis的使用.md) を学び、それから連携例を読んでください。

| 対象              | Java | Spring | MyBatis-Spring | Servlet コンテナー                      |
| --------------- | ---- | ------ | -------------- | ---------------------------------- |
| この記事の再現用サンプル    | 17+  | 6.2.x  | 3.0.x          | Tomcat 10.1，jakarta.servlet        |
| 旧プロジェクトの保守      | 8+   | 5.x    | 2.1.x          | Tomcat 9，javax.servlet             |
| Spring 7 プロジェクト | 17+  | 7.x    | 4.x            | Servlet / Jakarta のバージョンに合わせて再選定する |

このリポジトリの SpringMVC_1 と SpringMVC_2 には Spring 5 の過去の例があり、javax のインポートや旧ファイルアップロードリゾルバーなどをこの節へそのままコピーすることはできません。以下の固定バージョンは実験の再現用で、現在の最新版を示しません。本番プロジェクトでは保守状況とパッチバージョンを確認してから、依存関係を統一して管理してください。

<a id="section-3"></a>

## IoC と 依存性の注入 :id=h-9bb1f6ef39c3

IoC（制御の反転）は、オブジェクトの作成や連携の構成をコンテナーに任せることです。DI（依存性の注入）は一般的な実現方法で、あるオブジェクトが必要とする別のオブジェクトをコンテナーが渡します。

```java
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

これはコンストラクター注入の構造を示す断片で、UserRepository の定義は別途必要です。メソッド内で安易に new Repository を使うより、実装の差し替えやテストが容易になります。

Spring は XML、@Component、@Bean でオブジェクトを登録できます。同じオブジェクトに 3 つの方法を重ねる必要はありません。

| アノテーション                | 用途                                         |
| ---------------------- | ------------------------------------------ |
| @Component             | 一般的なコンポーネント                                |
| @Service               | 業務コンポーネント                                  |
| @Repository            | 永続化コンポーネント。例外変換の対象になる場合がある                 |
| @Controller            | MVC コントローラー                                |
| @Configuration / @Bean | 設定クラスとファクトリーメソッド                           |
| @Autowired             | 規則に従って依存関係を注入する。required=false は任意であることを示す |
| @Qualifier / @Primary  | 同じ型の候補が複数ある場合の選択を決める                       |

これらのアノテーションは開発者向けの名前だけではありません。Controller は MVC の識別に、Repository は例外変換に関与します。アプリケーションでは BeanFactory を使用できますが、ApplicationContext はその上にイベント、リソース、国際化��どを提供するため、通常はより便利です。

<a id="section-4"></a>

## Bean のスコープとライフサイクル :id=h-165d2b53a6f2

| スコープ        | 意味                                                 |
| ----------- | -------------------------------------------------- |
| singleton   | 同じコンテナー内では通常、1 つの Bean 定義につき 1 インスタンス。デフォルトのスコープ   |
| prototype   | 取得ごとにインスタンスを作成する。通常、コンテナーは破棄を管理しない                 |
| request     | HTTP リクエストごとに 1 インスタンス。Web 環境が必要                   |
| session     | HTTP セッションごとに 1 インスタンス                             |
| application | ServletContext の範囲。通常のコンテナーの singleton と完全には同じではない |

singleton はスレッドセーフを意味しません。通常はデフォルトでコンテナーの初期化時に作成されますが、lazy Bean などの例外があります。Bean の作成は引数なしコンストラクターを使うとは限らず、コンストラクター注入やファクトリーメソッドも利用できます。

一般的なライフサイクル：オブジェクト作成 -> プロパティ注入 -> 初期化コールバック -> 利用 -> コンテナー終了時にシングルトンを破棄。BeanPostProcessor で初期化の前後の処理を拡張できます。すべてのオブジェクトがまったく同じ処理手順を通るわけではありません。

FactoryBean は別の種類のオブジェクトを作るファクトリーです。getBean("name") は通常 getObject の結果、getBean("\&name") はファクトリー自体を返します。SqlSessionFactoryBean はこの仕組みの応用です。

<a id="section-5"></a>

## 再現できる連携プロジェクト :id=h-96d1863cf522

この節では Maven の WAR、外部 Tomcat、JSON レスポンスを使い、Spring Boot は使用しません。データベースは MySQL 8.x、テーブルは InnoDB を使います。

```text
ssm-notes/
  pom.xml
  src/main/java/example/
    config/SpringConfig.java
    config/WebConfig.java
    config/WebInitializer.java
    domain/Book.java
    mapper/BookMapper.java
    service/BookService.java
    controller/BookController.java
  src/main/resources/jdbc.properties
```

### 1. Maven の依存関係 :id=h-703906f5015e

ファイル：pom.xml。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>example</groupId>
    <artifactId>ssm-notes</artifactId>
    <version>1.0.0</version>
    <packaging>war</packaging>
    <properties>
        <maven.compiler.release>17</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <spring.version>6.2.11</spring.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.19</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>3.0.4</version>
        </dependency>
        <dependency>
            <groupId>com.zaxxer</groupId>
            <artifactId>HikariCP</artifactId>
            <version>5.1.0</version>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.4.0</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.18.4</version>
        </dependency>
        <dependency>
            <groupId>jakarta.servlet</groupId>
            <artifactId>jakarta.servlet-api</artifactId>
            <version>6.0.0</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
    <build>
        <finalName>ssm-notes</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.4.0</version>
                <configuration>
                    <failOnMissingWebXml>false</failOnMissingWebXml>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

provided は Tomcat が Servlet API を提供することを示し、別の API を WAR に含めません。JSON 変換には Jackson を使います。この例は最小限の依存関係のみを設定し、ログには SLF4J のバージョンに合う実装を別途追加できます。

### 2. データベースと接続の設定 :id=h-9dd4cc6d38ae

```sql
CREATE TABLE book (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

ファイル：jdbc.properties。study データベースとアクセス権のあるアカウントを先に用意します。以下の仮の値はローカル練習用の設定に置き換えてください。

```properties
jdbc.url=jdbc:mysql://localhost:3306/study?characterEncoding=UTF-8
jdbc.username=study_user
jdbc.password=replace-with-your-local-password
```

### 3. ルートコンテナー：業務処理、データソース、MyBatis、トランザクション :id=h-87f56b848609

ファイル：SpringConfig.java。

```java
package example.config;

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@ComponentScan("example.service")
@MapperScan("example.mapper")
@PropertySource("classpath:jdbc.properties")
@EnableTransactionManagement
public class SpringConfig {
    @Bean
    public static PropertySourcesPlaceholderConfigurer placeholders() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    @Bean(destroyMethod = "close")
    public HikariDataSource dataSource(
            @Value("${jdbc.url}") String url,
            @Value("${jdbc.username}") String username,
            @Value("${jdbc.password}") String password) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setMaximumPoolSize(5);
        return dataSource;
    }

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
        factory.setDataSource(dataSource);
        return factory.getObject();
    }

    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
```

MyBatis と トランザクションマネージャーは同じ DataSource を使う必要があります。この例はアノテーションの SQL を使用するため Mapper XML は不要です。XML に切り替える場合は mapperLocations を設定し、namespace をインターフェースの完全修飾名と一致させます。

### 4. MVC の子コンテナーと Servlet の初期化 :id=h-a065fb6ff262

ファイル：WebConfig.java。

```java
package example.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
@ComponentScan("example.controller")
public class WebConfig implements WebMvcConfigurer {
}
```

ファイル：WebInitializer.java。

```java
package example.config;

import jakarta.servlet.Filter;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class WebInitializer
        extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[] { SpringConfig.class };
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[] { WebConfig.class };
    }

    @Override
    protected String[] getServletMappings() {
        return new String[] { "/" };
    }

    @Override
    protected Filter[] getServletFilters() {
        return new Filter[] { new CharacterEncodingFilter("UTF-8", true) };
    }
}
```

Servlet 3 以降のコンテナーはこの初期化クラスを検出できるため、web.xml で同じ DispatcherServlet を重複登録する必要はありません。MVC の子コンテナーはルートコンテナーの Service にアクセスできますが、ルートコンテナーは子コンテナーの Controller に依存すべきではありません。

### 5. エンティティと Mapper :id=h-39de76c86126

ファイル：Book.java。

```java
package example.domain;

public class Book {
    private Long id;
    private String title;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
```

ファイル：BookMapper.java。

```java
package example.mapper;

import example.domain.Book;
import org.apache.ibatis.annotations.*;

public interface BookMapper {
    @Select("SELECT id, title FROM book WHERE id = #{id}")
    Book findById(@Param("id") long id);

    @Insert("INSERT INTO book (title) VALUES (#{title})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Book book);
}
```

`#{}` はデータ値をバインドし、タイトルを SQL に連結するのを防ぎます。主キーはデータベースが生成して Book.id に書き戻し、insert の戻り値は引き続き影響を受けた行数です。

### 6. 業務処理とコントローラー :id=h-608f77db4e63

ファイル：BookService.java。

```java
package example.service;

import example.domain.Book;
import example.mapper.BookMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookService {
    private final BookMapper mapper;

    public BookService(BookMapper mapper) {
        this.mapper = mapper;
    }

    public Book findById(long id) {
        return mapper.findById(id);
    }

    @Transactional
    public Book create(String title) {
        if (title == null || title.isBlank() || title.length() > 100) {
            throw new IllegalArgumentException("Title must contain 1 to 100 characters");
        }
        Book book = new Book();
        book.setTitle(title);
        if (mapper.insert(book) != 1) {
            throw new IllegalStateException("Book was not inserted");
        }
        return book;
    }
}
```

ファイル：BookController.java。

```java
package example.controller;

import java.net.URI;
import java.util.Map;
import example.domain.Book;
import example.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/books")
public class BookController {
    private final BookService service;

    public BookController(BookService service) {
        this.service = service;
    }

    public record CreateBookRequest(String title) {}

    @GetMapping("/{id}")
    public ResponseEntity<Book> find(@PathVariable("id") long id) {
        Book book = service.findById(id);
        return book == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(book);
    }

    @PostMapping
    public ResponseEntity<Book> create(@RequestBody CreateBookRequest request) {
        Book book = service.create(request.title());
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(book.getId()).toUri();
        return ResponseEntity.created(location).body(book);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> invalidInput(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }
}
```

検索対象がなければ 404、作成成功なら 201 と Location、タイトルの検証に失敗したら 400 を返します。この例は 2 つの操作を示し、完全な CRUD は同じ階層構成で拡張できます。データベース例外の際、詳細な SQL やパスワードをクライアントに返してはいけません。

### 7. ビルドと検証 :id=h-ff3977d7cd48

1. プロジェクトのルートから mvn clean package を実行します。
2. target/ssm-notes.war を Tomcat 10.1 にデプロイします。
3. 起動時に、データソース、Servlet、Mapper が正常に初期化されたか確認します。
4. HTTP クライアントで POST /ssm-notes/books を送信します。Content-Type は application/json、本文は {"title":"Java 入門"} です。
5. 201、ID を含む JSON、Location が返るはずです。そのパスへ GET を送ると、200 が返るはずです。
6. 空白のタイトルを送ると 400、存在しない ID を検索すると 404 が返るはずです。

アドレスの接頭辞は WAR のコンテキストパスによります。ここでは /books に直接アクセスしません。起動に失敗したら、最後のエラーだけを修正するのではなく、最初に出た例外の原因を確認してください。

<a id="section-6"></a>

## AOP：繰り返される横断的な処理をまとめる :id=h-3f44ee844fe6

ログや時間計測は複数の業務メソッドにまたがる場合があります。Spring AOP はプロキシを通じてメソッド呼び出しの前後に処理を追加します。主にメソッド実行のジョインポイントに対応し、「メソッド内の任意の行を捕捉できる」という意味ではありません。

- JDK プロキシは通常インターフェースを対象とします。
- クラスベースのプロキシは対象クラスを継承するため、final クラスやメソッドには制約があります。
- AspectJ のウィービングはバイトコードを変更します。別の実現方法なので、同じ Spring プロキシと単純に同一視してはいけません。

| アドバイス | アノテーション         | 実行タイミング                              |
| ----- | --------------- | ------------------------------------ |
| 事前    | @Before         | 対象メソッドの実行前                           |
| 正常復帰後 | @AfterReturning | 正常に戻った後                              |
| 例外    | @AfterThrowing  | 該当する例外が投げられた後                        |
| 最終    | @After          | メソッド終了後。finally に相当する                |
| 周囲    | @Around         | 呼び出しを囲める。proceed を呼ぶかどうか明示的に決める必要がある |

以下は上記の設定とは別の拡張例です。aspectjweaver の依存関係を追加し、ルート設定で @EnableAspectJAutoProxy を有効にする必要があります。

```java
@Aspect
@Component
public class TimingAspect {
    @Around("execution(* example.service..*(..))")
    public Object measure(ProceedingJoinPoint point) throws Throwable {
        long started = System.nanoTime();
        try {
            return point.proceed();
        } finally {
            System.out.println(point.getSignature() + ": " +
                (System.nanoTime() - started) + " ns");
        }
    }
}
```

org.aspectj.lang.ProceedingJoinPoint、org.aspectj.lang.annotation.Aspect、Around、Spring の Component をインポートします。このクラスは example.service など、ルートコンテナーがスキャンするパッケージに配置します。

式の最初の \* は任意の戻り値型、example.service.. はそのパッケージとサブパッケージ、(..) は任意の引数を表します。アクセス修飾子は省略でき、戻り値型に int を指定しても public を同時に書く必要はありません。

複数のアスペクトでは @Order の値が小さいほど優先順位が高く、入るときは先、出るときは後に実行されます。同じアスペクトの異なるアドバイスの順序は、フレームワークのバージョンや宣言方法にも左右されます。明確に保証されていない順序に業務処理を依存させないでください。

<a id="section-7"></a>

## トランザクションの属性と境界 :id=h-6fecf52f4280

| 属性                                            | 意味                                                              |
| --------------------------------------------- | --------------------------------------------------------------- |
| propagation=REQUIRED                          | デフォルト。トランザクションがあれば参加し、なければ作成する                                  |
| propagation=REQUIRES_NEW                      | 外側のトランザクションを一時停止し、独立したトランザクションを作成する。通常、追加の接続が必要                 |
| isolation                                     | 分離レベル。新しいトランザクションを作成するか、データベースが対応するかによって有効性が決まる                 |
| readOnly                                      | 読み取り専用のヒント。汎用的な書き込み権限の検査ではない                                    |
| timeout                                       | 秒単位のタイムアウト。トランザクションマネージャーやリソースの確認に依存し、任意の Java コードを強制中断するものではない |
| rollbackFor                                   | ロールバック対象の例外クラスを指定する                                             |
| noRollbackFor                                 | ロールバックしない例外クラスを指定する                                             |
| rollbackForClassName / noRollbackForClassName | 例外名の規則で照合する。通常はクラスを指定する形式を優先する                                  |

```java
@Transactional(timeout = 5, rollbackFor = Exception.class)
public void buyBook(Long bookId, Long userId) throws Exception {
    bookDao.updateStock(bookId);
    bookDao.updateBalance(userId, bookId);
}
```

これはトランザクション属性の断片で、bookDao と業務規則は別途実装する必要があります。タイムアウトの例は timeout=5 を使用し、readOnly=true では代用できません。

デフォルトでは RuntimeException と Error でロールバックし、チェック例外ではロールバックしません。「チェック例外」はコンパイルエラーとは異なり、コンパイルに失敗したコードはトランザクションに入ること自体がありません。

デフォルトのプロキシ方式では、Service が自身の別メソッドを直接呼ぶとプロキシを経由しません。@Transactional を付けるだけでは、その内部呼び出しによる新しいトランザクションの作成は保証されません。エラーを捕捉して黙って成功を返したり、トランザクション内で Spring 管理の接続を手動コミットしたりしないでください。

| SQL ���準の分離レベル   | ダーティリード | 非再現読み取り | ファントムリード |
| ---------------- | ------- | ------- | -------- |
| READ UNCOMMITTED | 許容      | 許容      | 許容       |
| READ COMMITTED   | 防止      | 許容      | 許容       |
| REPEATABLE READ  | 防止      | 防止      | 標準では許容   |
| SERIALIZABLE     | 防止      | 防止      | 防止       |

表は標準が許容する現象であり、すべてのデータベースの実装が同じという意味ではありません。InnoDB の通常の再現可能読み取りクエリはスナップショットを使い、ほかのトランザクションは引き続きデータを更新できます。ロック読み取りと通常のスナップショット読み取りも動作が異なります。

<a id="section-8"></a>

## JdbcTemplate、XML、発展的な項目 :id=h-4d996beb14ab

JdbcTemplate は JDBC のリソース管理と例外変換をまとめます。同じ DataSource を設定する必要があり、業務トランザクションは引き続き Service に配置します。

```java
JdbcTemplate template = new JdbcTemplate(dataSource);
Integer count = template.queryForObject("SELECT COUNT(*) FROM book", Integer.class);
```

org.springframework.jdbc.core.JdbcTemplate をインポートします。dataSource は設定済みのオブジェクトです。queryForObject は結果が 0 行または複数行の場合に例外となり、MyBatis の単一オブジェクトの検索とは異なるので注意してください。

旧プロジェクトで XML を使う場合、constructor-arg はコンストラクター引数、property/ref はオブジェクトの依存関係に使用します。value はリテラルであり、オブジェクト参照ではありません。コレクションには list、set、map を使います。typeAliases、resultMap などは MyBatis の設定なので、Spring beans の設定に入れてはいけません。

| 調べたい内容                                                       | 項目                                            |
| ------------------------------------------------------------ | --------------------------------------------- |
| パラメーターのバインド、動的 SQL、関連のマッピング、キャッシュ、リバースエンジニアリング、ページネーションプラグイン | [MyBatis の使い方](MyBatis的使用.md)                 |
| リクエストパラメーター、JSON、REST、静的リソース                                 | [SpringMVC_1](SpringMVC_1.md)（Spring 5 の過去の例） |
| 結果のラッピング、例外処理、インターセプター、ページとの結合確認                             | [SpringMVC_2](SpringMVC_2.md)（Spring 5 の過去の例） |
| 自動設定、複数環境、テスト                                                | [SpringBoot](SpringBoot.md)                   |
| アノテーションの名前と役割                                                | [よく使うアノテーションの早見表](SpringBoot的所有注解.md)         |

Spring 6 のファイルアップロードでは、Servlet の multipart 対応と StandardServletMultipartResolver を使い、multipart を設定します。旧 CommonsMultipartResolver は削除されています。アップロード先、ファイルサイズ、ファイル名の規則を明確にし、旧プロジェクトの設定をそのまま移さないでください。

参考：[Spring ドキュメント](https://docs.spring.io/spring-framework/reference/)、[MyBatis-Spring のバージョン要件](https://mybatis.org/spring/)、[MyBatis-Spring のトランザクション](https://mybatis.org/spring/transactions.html)、[Tomcat 10.1](https://tomcat.apache.org/tomcat-10.1-doc/)。
