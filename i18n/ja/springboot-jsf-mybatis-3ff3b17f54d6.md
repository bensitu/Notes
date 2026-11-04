# Spring Boot、Jakarta Faces、MyBatis の連携 :id=h-a511ccb57865

ファイルごとに Boot、Faces、MyBatis のプロジェクトを構築し、ページ Bean とデータベースアクセスを理解します。

**前提知識とバージョン：** Maven、JSF、SQL の基礎知識が必要です。完全なサンプルでは Java 17、Boot 3.5.6、JoinFaces 5.5.6、Faces 4 に固定しています。この組み合わせの一部だけを別バージョンに置き換えないでください。

**サンプルの使い方：** 全ファイルと実行手順が明示されたプロジェクトを除き、コードブロックは各節の独立した断片です。省略記号や仮の名前は補ってください。誤りと記された行は問題を説明するためのものです。同じ節の代替コードを組み合わせないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://docs.joinfaces.org/5.5.6/reference/)

**目次**

- [最初にバージョンを確認する](#section-1)
- [1. Maven の設定](#section-2)
- [2. プロジェクトのファイル](#section-3)
- [3. データベースと YAML](#section-4)
- [4. 起動クラスと Mapper](#section-5)
- [5. ページ Bean とスコープ](#section-6)
- [6. Facelets ページ](#section-7)
- [7. Spring Security を追加する際の注意点](#section-8)

<a id="section-1"></a>

## 最初にバージョンを確認する :id=h-654efe1eed6a

Faces（旧称 JSF）はサーバー側のページコンポーネント、MyBatis はデータベースクエリ、Spring Boot はアプリケーションの起動と設定を担当します。API のバージョンには互換性が必要です。JSF 2 の javax API と Faces 3/4 の jakarta API を混在させないでください。

この節では再現用の組み合わせとして、Java 17、Spring Boot 3.5.6、JoinFaces 5.5.6、Faces 4、MyBatis starter 3.0.4 を使用します。学習内容を再現するためのバージョンであり、最新パッチを示すものではありません。JoinFaces は Boot に対応する初期化とスコープを提供するため、FacesServlet やリスナーを手動で重複登録したり、破棄コールバックのない独自の ViewScope を作成したりする必要がありません。

| 保守の対象               | 対応関係                                               |
| ------------------- | -------------------------------------------------- |
| 既存の Boot 2.7 プロジェクト | JoinFaces 4.7，JSF 2，javax.faces                    |
| この節の Boot 3.5       | JoinFaces 5.5，Jakarta Faces，jakarta.faces          |
| Boot 4 プロジェクト       | JoinFaces 6.x。バージョン対応表に従って MyBatis starter を選択します。 |

基本タグとライフサイクルについては、先に [JSF の基礎](JSF%20基础.md) と [JSF のタグ](JSF%20标签.md) を参照してください。この 2 文書には過去の JSF 2 のサンプルが残されています。この節では Faces 4 の名前空間と Spring が管理する Bean を使用します。

<a id="section-2"></a>

## 1. Maven の設定 :id=h-c799cce6de35

ファイル：pom.xml。このサンプルに必要な依存関係だけを追加します。メールやプロジェクト管理ファイルの解析など、ほかの業務ライブラリは Faces の連携と関係ありません。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.5.6</version>
        <relativePath/>
    </parent>
    <groupId>example</groupId>
    <artifactId>faces-notes</artifactId>
    <version>1.0.0</version>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.joinfaces</groupId>
                <artifactId>joinfaces-platform</artifactId>
                <version>5.5.6</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.joinfaces</groupId>
            <artifactId>faces-spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>3.0.4</version>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

jsf-api 2.2、jsf-impl 2.2、別の Faces 実装を追加しないでください。API はインターフェースのみであり、実行時の動作を提供するのは実装です。依存関係の重複やバージョンの混在は、クラスの読み込みに問題を起こしやすくなります。

<a id="section-3"></a>

## 2. プロジェクトのファイル :id=h-cc557945c8ff

```text
src/main/java/example/faces/
  FacesApplication.java
  BookMapper.java
  BookView.java
src/main/resources/
  application.yml
  META-INF/resources/index.xhtml
```

Spring Boot の実行可能 JAR では、ページをクラスパス上の META-INF/resources に配置します。src/main/webapp が必ず実行可能 JAR に含まれるとは考えないでください。実際に WAR でデプロイする場合に限り、その方式に合わせて webapp を構成します。

JoinFaces が Faces の初期化を自動で処理します。この例では web.xml も、2 つ目の FacesServlet の手動登録も不要です。Faces の独自設定が必要な場合、標準の名前は faces-config.xml であり、face-config.xml ではありません。配置先とバージョンはデプロイ方式によって決まり、自由に名前を変えることはできません。

<a id="section-4"></a>

## 3. データベースと YAML :id=h-36aee1f1b4ad

MySQL の study データベースに練習用のテーブルを作成します。

```sql
CREATE TABLE book (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO book (title) VALUES ('Java 入门'), ('SQL 入门');
```

ファイル：application.yml。環境変数 DB_USER と DB_PASSWORD は実行環境から渡します。実際の認証情報はリポジトリに保存しないでください。

```yaml
server:
  port: 9000
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/study?characterEncoding=UTF-8
    username: ${DB_USER}
    password: ${DB_PASSWORD}
joinfaces:
  faces:
    project-stage: development
```

mybatis.mapper-locations や mybatis.type-aliases-package などは YAML の設定であり、XML ではありません。ここではアノテーションで指定した SQL だけを使用するため、Mapper XML のパス設定は不要です。本番環境では Faces の project-stage を production に変更します。

<a id="section-5"></a>

## 4. 起動クラスと Mapper :id=h-cf68411db398

ファイル：FacesApplication.java。

```java
package example.faces;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FacesApplication {
    public static void main(String[] args) {
        SpringApplication.run(FacesApplication.class, args);
    }
}
```

ファイル：BookMapper.java。

```java
package example.faces;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface BookMapper {
    @Select("SELECT title FROM book ORDER BY id LIMIT 100")
    List<String> listTitles();
}
```

LIMIT 100 はデモ用に明示した上限です。実際の一覧にはページネーションを実装してください。@Mapper により MyBatis starter が Mapper プロキシを登録するため、実装クラスを別途作成する必要はありません。

<a id="section-6"></a>

## 5. ページ Bean とスコープ :id=h-68e3e95db0ee

ファイル：BookView\.java。

```java
package example.faces;

import java.util.List;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component("bookView")
@Scope("view")
public class BookView {
    private final BookMapper mapper;
    private List<String> titles;

    public BookView(BookMapper mapper) {
        this.mapper = mapper;
    }

    public List<String> getTitles() {
        if (titles == null) {
            titles = mapper.listTitles();
        }
        return titles;
    }

    public void reload() {
        titles = mapper.listTitles();
    }
}
```

view スコープは JoinFaces が登録し、同じページで操作している間のデータ保持に適しています。getTitles は 1 回の描画中に複数回呼ばれる場合があるため、getter の呼び出しごとにデータベースへ問い合わせず、一覧をキャッシュします。

request はリクエストごとに 1 インスタンス、session は同じセッションで 1 インスタンスを共有し、singleton は全ユーザーで共有します。ユーザー入力やページ状態を安易に singleton に保存しないでください。クラスターでのセッション複製、ビューのシリアライズ、破棄コールバックには、該当バージョンが対応する方式を使う必要があります。空の registerDestructionCallback メソッドで完全なスコープ実装を代用することはできません。

<a id="section-7"></a>

## 6. Facelets ページ :id=h-f14aebeba153

ファイル：src/main/resources/META-INF/resources/index.xhtml。

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="jakarta.faces.html"
      xmlns:ui="jakarta.faces.facelets">
<h:head>
    <title>图书列表</title>
</h:head>
<h:body>
    <h:form id="books">
        <h:commandButton value="刷新" action="#{bookView.reload}"/>
        <ul>
            <ui:repeat value="#{bookView.titles}" var="title">
                <li><h:outputText value="#{title}"/></li>
            </ui:repeat>
        </ul>
    </h:form>
</h:body>
</html>
```

出力コンポーネントはデフォルトでテキストをエスケープします。ユーザー入力を表示するために安易に escape=false を設定しないでください。

プロジェクトのルートで mvn spring-boot:run を実行し、[http://localhost:9000/index.xhtml](http://localhost:9000/index.xhtml) にアクセスします。2 冊の本が表示され、更新をクリックすると一覧を再取得します。mvn package を実行してから java -jar target/faces-notes-1.0.0.jar で起動することもできます。

<a id="section-8"></a>

## 7. Spring Security を追加する際の注意点 :id=h-b5ac9a89355b

認証が必要になったら、Boot のバージョンに合う security starter を追加します。Spring Security 6 では WebSecurityConfigurerAdapter が廃止されているため、SecurityFilterChain Bean で設定します。

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/jakarta.faces.resource/**").permitAll()
            .anyRequest().authenticated())
        .formLogin(Customizer.withDefaults());
    return http.build();
}
```

これは任意の設定例です。@Configuration クラス内に配置し、対応する Spring Security の型をインポートします。ユーザー認証の設定は別途必要です。独自ユーザーを設定していない場合、Boot の開発用デフォルトユーザーの仕組みを、そのまま本番のアカウントシステムとして使うことはできません。

認証後の Faces フォームには Spring の CSRF トークンを含める必要があります。h:form 内に標準 HTML の隠しフィールドを追加できます。

```html
<input type="hidden"
       name="#{requestScope['_csrf'].parameterName}"
       value="#{requestScope['_csrf'].token}"/>
```

この断片は Security が有効なページでのみ使用してください。Faces の ViewState と Spring の CSRF トークンは別の仕組みです。403 が発生したら、まずトークンが送信されているか確認します。「POST でエラーが出た」という理由だけで CSRF 保護全体を無効にしないでください。Ajax、アップロード、独自ログインでは、トークンの受け渡しとセッション期限切れ時の動作を個別に検証します。

参考：[JoinFaces 5.5.6](https://docs.joinfaces.org/5.5.6/reference/)、[バージョンの対応関係](https://github.com/joinfaces/joinfaces#version-compatibility)、[MyBatis starter](https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/)、[Spring Security CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)。
