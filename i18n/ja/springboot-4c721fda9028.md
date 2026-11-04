# Spring Boot の基礎 :id=h-feec1895621a

starter、自動構成、設定ファイル、テスト、MyBatis との連携を理解します。

**前提知識とバージョン：** 本記事は、概念の学習と既存プロジェクトとの比較のため、Spring Boot 2.5 / javax の学習環境を残しています。新しい例の Jakarta による方法は SSM.md と Springboot+JSF+Mybatis.md を参照してください。親 POM の変更だけで移行が完了したと考えてはいけません。

**スクリーンショットについて：** 画像には元の学習環境での操作手順を残しています。画像内の古い書き方が本文と異なる場合は、改訂した本文と使用するバージョンの公式ドキュメントに従ってください。

**例の使い方：** 全ファイルと実行手順を明示したプロジェクト以外では、コードブロックは各節の独立した断片です。省略箇所や仮の名前を補ってください。誤りと明記した行は問題を説明するためのものです。同じ節にある代替の書き方を組み合わせないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://docs.spring.io/spring-boot/docs/2.5.0/reference/html/)

**目次**

- [1. SpringBoot の概要](#section-1)
- [2. 設定ファイル](#section-2)
- [3. SpringBoot と junit の連携](#section-3)
- [4. SpringBoot と mybatis の連携](#section-4)
- [5. 実装例](#section-5)

**目標：**

> - SpringBoot フレームワークによるプログラム開発手順を習得する
> - SpringBoot の設定情報を使ってサーバー設定を変更できるようになる
> - SpringBoot を使って SSM 連携プロジェクトを開発する

<a id="section-1"></a>

## 1. SpringBoot の概要 :id=h-b51c4ea13b79

`SpringBoot` は `Pivotal` チームが提供する新しいフレームワークで、`Spring` アプリケーションの **初期構築** と **開発過程** を **簡略化** するために設計されています。

`Spring` フレームワークによって、開発はすでに簡略化されています。`SpringBoot` はさらに `Spring` の開発を簡略化するため、`SpringBoot` の使いやすさと普及の理由が分かります。`SpringBoot` が `Spring` の開発を簡略化することを確認するため、まず `SpringMVC` の開発を例に振り返ります。

1. **プロジェクトを作成し、`pom.xml` 設定ファイルに依存関係の座標を設定する**

<img src="Resources/image-20210911132335452.png" alt="image-20210911132335452" style="zoom:50%;" />

2. **`web3.0` の設定クラスを記述する**

   `web` アプリケーションには `web3.0` の設定クラスが欠かせません。このクラスはやや複雑で、コードは次のようになります。

<img src="Resources/image-20210911133112602.png" alt="image-20210911133112602" style="zoom:50%;" />

3. **`SpringMVC` の設定クラスを記述する**

<img src="Resources/image-20210911133219847.png" alt="image-20210911133219847" style="zoom:50%;" />

ここまででは、プロジェクトの骨組みを作っただけです。外部からアクセスできるようにするには、少なくとも `Controller` クラスを用意し、その中にメソッドを定義する必要があります。

4. **`Controller` クラスを記述する**

<img src="Resources/image-20210911133532151.png" alt="image-20210911133532151" style="zoom:50%;" />

上の `SpringMVC` 開発では、最初の3つの手順はすべて環境構築で、ほぼ定型的なものです。`SpringBoot` はこの3つを簡略化します。次の入門例で、`SpingBoot` が `Spring` の開発をどのように簡略化するかを確認します。

### 1.1 SpringBoot の入門 :id=h-6b17c8f54900

#### 1.1.1 開発手順 :id=h-12c83f25df67

`SpringBoot` による開発は簡単で、次の手順で進めます。

- 新しいモジュールを作成し、Spring の初期化を選択して基本情報を設定する
- 現在のモジュールで必要な技術を選択する
- コントローラークラスを開発する
- 自動生成された Application クラスを実行する

`SpringBoot` の開発手順が分かったので、具体的に操作してみます。

##### 1.1.1.1 新しいモジュールの作成 :id=h-b8aedbf89818

- `+` をクリックし、`New Module` を選択して新しいモジュールを作成します。

<img src="Resources/image-20210911155135008.png" alt="image-20210911155135008" style="zoom:60%;" />

- `Spring Initializr` を選択して `SpringBoot` プロジェクトを作成します。

  以前は `Maven` を選びましたが、今回は `Spring Initializr` を選んで `SpringBoot` プロジェクトを素早く構築します。`Module SDK` には、ローカルにインストールした対応する `JDK` のバージョンを選択します。

<img src="Resources/image-20210911155249493.png" alt="image-20210911155249493" style="zoom:60%;" />

- `SpringBoot` プロジェクトの設定を行います。

  この方法で構築する `SpringBoot` プロジェクトも、実際には `Maven` プロジェクトです。素早く構築するための方法にすぎません。

  <img src="Resources/image-20210911155916899.png" alt="image-20210911155916899" style="zoom:67%;" />

  > 注意：ここではパッケージ形式を `Jar` に設定します。

- `Web` を選択し、`Spring Web` にチェックを入れます。

  `SpringMVC` を使った `web` アプリケーションを開発するため、下図の赤枠の項目を選択します。

<img src="Resources/image-20210911160040328.png" alt="image-20210911160040328" style="zoom:60%;" />

- 次の画面は変更せず、`Finish` をクリックして `SpringBoot` プロジェクトの作成を完了します。

<img src="Resources/image-20210911160353534.png" alt="image-20210911160353534" style="zoom:70%;" />

以上の手順で、次の構成のモジュールが作成されます。`Application` クラスが自動生成され、後ほどサーバーの起動に使用します。

<img src="Resources/image-20210911160541833.png" alt="image-20210911160541833" style="zoom:80%;" />

> 注意：
>
> 1. 作成したプロジェクトでは、設定クラスを作成する必要はありません。
>
> 2. .gitignore と Maven Wrapper（.mvn、mvnw、mvnw\.cmd）は残します。それぞれバージョン管理と Maven のバージョン統一に役立ちます。HELP.md は必要に応じて残してください。ディレクトリを簡単にするためだけに、ビルドや共同作業に必要なファイルを削除しないでください。

##### 1.1.1.2 Controller の作成 :id=h-ce01cfb3e7ff

`com.itheima.controller` パッケージに `BookController` を作成します。コードは次のとおりです。

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println("id ==> "+id);
        return "hello , spring boot!";
    }
}
```

##### 1.1.1.3 サーバーの起動 :id=h-5876de23fd0b

`SpringBoot` プロジェクトの実行には、ローカルの `Tomcat` やプラグインは不要です。プロジェクトの `com.itheima` パッケージにある `Application` クラスを実行するだけで、コンソールに次の情報が表示されます。

![image-20210911165642280](Resources/image-20210911165642280.png)

##### 1.1.1.4 テスト :id=h-803ad536f338

`Postman` ツールを使ってプログラムをテストします。

![image-20210911160850121](Resources/image-20210911160850121.png)

この入門例から、`SpringBoot` で開発が大幅に簡単になることが分かります。どのような仕組みなのでしょうか。

その仕組みを調べるために、`Application` クラスと `pom.xml` を確認します。まず `Applicaion` クラスの内容は次のとおりです。

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

このクラスはシンプルで、クラスに `@SpringBootApplication` アノテーションが付いており、main メソッドには1行だけ記述されています。サーバーの起動時には、このクラスの main メソッドを実行します。

次に `pom.xml` 設定ファイルの内容を確認します。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- See note 1 below. -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.0</version>
    </parent>
    <groupId>com.itheima</groupId>
    <artifactId>springboot_01_quickstart</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <!-- See note 2 below. -->
    <properties>
        <java.version>8</java.version>
    </properties>

    <dependencies>
        <!-- See note 3 below. -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!-- See note 4 below. -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- See note 5 below. -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

例の説明：

1. 親プロジェクトを指定しています。その内容をこのプロジェクトで継承して使用できます
2. JDK のバージョン
3. この依存関係は、SpringBoot プロジェクトの作成時に Spring Web を選択したことで生成されたものです
4. 単体テスト用の依存関係です。まだ単体テストをしていないため、現時点ではなくても構いません
5. パッケージ化に必要なプラグインですが、ここではまだ使用していません

コードを簡略化できるのは、指定した親プロジェクトと `Spring Web` 依存関係によるものです。詳しくは後で説明します。

#### 1.1.2 比較 :id=h-d3b36e8c43e2

`SpringBoot` の入門例を終えたので、下図のように `Spring` アプリケーションと `SpringBoot` アプリケーションを比較します。

<img src="Resources/image-20210911172200292.png" alt="image-20210911172200292" style="zoom:60%;" />

- **依存関係の座標**

  `Spring` アプリケーションでは、多数の依存関係の座標を手動で記述する必要があります。

  `SpringBoot` アプリケーションの依存関係の座標は、プロジェクト作成時に選択した項目から自動生成されます。

- **web3.0 の設定クラス**

  `Spring` アプリケーションでは、この設定クラスを自分で記述します。以前に書いたとき、複雑だと感じたでしょう。

  `SpringBoot` アプリケーションでは、自分で記述する必要はありません。

- **設定クラス**

  `Spring/SpringMVC` アプリケーションでは設定クラスを自分で記述しますが、`SpringBoot` アプリケーションでは不要です。

> \==注意：Idea の `Spring Initializr` で `SpringBoot` プロジェクトを素早く構築するには、インターネット接続が必要です。==

#### 1.1.3 公式サイトでのプロジェクト作成 :id=h-d51ca68b4df9

入門例で `SpringBoot` プロジェクトを素早く作成できるのは、`Idea` が公式サイトの `SpringBoot` プロジェクト生成機能を使用しているためです。公式サイトで直接作成するには、次の手順を実行します。

##### 1.1.3.1 SpringBoot の公式サイトを開く :id=h-24094b83fc1c

公式サイトのアドレスは次のとおりです。

```
https://spring.io/projects/spring-boot
```

`SpringBoot` の公式サイトを開き、一番下までスクロールすると次の内容が表示されます。

<img src="Resources/image-20210911173712014.png" alt="image-20210911173712014" style="zoom:60%;" />

`Spring Initializr` のリンクをクリックすると、次のページに移動します。

![image-20210911174110687](Resources/image-20210911174110687.png)

このページは、`Idea` で `SpringBoot` プロジェクトを素早く作成するときの画面とほぼ同じです。このページに必要な情報を入力します。

##### 1.1.3.2 依存関係の選択 :id=h-af25bf223eba

`Spring Web` を選ぶには、上図右上の `ADD DEPENDENCIES... CTRL + B` ボタンをクリックします。次の画面が表示されます。

![image-20210911174650679](Resources/image-20210911174650679.png)

##### 1.1.3.3 プロジェクトの生成 :id=h-7de0282cd24d

以上の手順を終えたら、`SpringBoot` プロジェクトを生成できます。下図のように、ページ下部の `GENERATE CTRL + 回车` ボタンをクリックして生成し、ローカルにダウンロードします。

![image-20210911175222857](Resources/image-20210911175222857.png)

ダウンロードした圧縮ファイルを開くと、下図のように `Idea` で生成したものと同じプロジェクト構成を確認できます。

<img src="Resources/image-20210911175502834.png" alt="image-20210911175502834" style="zoom:80%;" />

`pom.xml` ファイルを開くと、親プロジェクトと `Spring Web` の依存関係も含まれています。

公式サイトでの操作から、`Idea` の `SpringBoot` プロジェクト生成も、公式の生成機能を使っていることが分かります。そのため、`Idea` がなくても公式サイトで `SpringBoot` プロジェクトを作成できます。

#### 1.1.4 SpringBoot プロジェクトの簡単な起動 :id=h-ad9b295eae7c

##### 1.1.4.1 問題の導入 :id=h-3b9cba8277c3

<img src="Resources/image-20210911180828611.png" alt="image-20210911180828611" style="zoom:50%;" />

フロントエンド開発者との共同開発では、フロントエンドのテストにバックエンドサーバーの起動が必要なため、バックエンド開発者に依存します。これを解消するために、各自のパソコンへ `Tomcat` と `Idea` をインストールしてバックエンドを起動するのは、明らかに現実的ではありません。

バックエンド側で `SpringBoot` プロジェクトを `jar` にまとめられます。この `jar` は `Tomcat` や `Idea` などのツールに依存せずに動作します。`jar` の実行時に、元のプログラムと同じ `Mysql` データベースへ接続すればよいため、下図のように問題を解決できます。

<img src="Resources/image-20210911181714437.png" alt="image-20210911181714437" style="zoom:50%;" />

では、どのようにパッケージ化するのでしょうか。

##### 1.1.4.2 パッケージ化 :id=h-39937b861f71

`SpringBoot` プロジェクトの作成時に、`pom.xml` に次のプラグインがすでに設定されています。

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
</plugin>
```

`Maven` の `package` コマンドでパッケージ化すると、`target` ディレクトリに対応する `Jar` が生成されます。

> \==注意：このプラグインの設定は必須です。設定しなければ、生成した `jar` に問題が生じます。==

##### 1.1.4.3 起動 :id=h-afd314070a02

`jar` のあるディレクトリへ移動し、`命令提示符` に次のコマンドを入力します。

```shell
jar -jar springboot_01_quickstart-0.0.1-SNAPSHOT.jar
```

このコマンドを実行すると、`SpringBoot` の実行ログを確認できます。

<img src="Resources/image-20210911182956629.png" alt="image-20210911182956629" style="zoom:60%;" />

### 1.2 SpringBoot の概要 :id=h-8edcc7e479d4

`SpringBoot` は Pivotal チームが提供する新しいフレームワークで、Spring アプリケーションの ==初期構築== と ==開発過程== を ==簡略化== するために設計されています。

`SpringBoot` アプリケーションを体験したところで、`SpringBoot` の主な役割を振り返ります。それは `Spring` の構築と開発の簡略化です。

従来の `Spring` の環境構築と開発には、次の問題があります。

- 設定が複雑
- 依存関係の設定が複雑

`SpringBoot` の利点は、ちょうど `Spring` の欠点を解決するものです。

- 自動構成により、`Spring` の設定が複雑という問題を解決します。
- starter 依存関係により、`Spring` の依存関係の設定が複雑という問題を解決します。
- 補助機能（組み込みサーバーなど）。`SpringBoot` アプリケーションの起動には、ローカルの `tomcat` も `tomcat` プラグインも使わず、`SpringBoot` の組み込みサーバーを使用します。

次に、`SpringBoot` の starter 依存関係を説明します。

#### 1.2.1 starter 依存関係 :id=h-a688c3464c20

`Spring Initializr` で作成した `Maven` プロジェクトの `pom.xml` 設定ファイルには、下図のように `starter` を名前に含む依存関係が多数自動生成されています。

<img src="Resources/image-20210918220338109.png" alt="image-20210918220338109" style="zoom:70%;" />

これらが ==starter 依存関係== です。その仕組みを調べます。

##### 1.2.1.1 親プロジェクトの確認 :id=h-49dd903678b0

上のファイルでは親プロジェクトを指定しています。その親を開くと、下図のようにさらに親プロジェクトが指定されています。

<img src="Resources/image-20210918220855024.png" alt="image-20210918220855024" style="zoom:80%;" />

その親プロジェクトを開くと、下図の構成の設定を確認できます。

<img src="Resources/image-20210918221042947.png" alt="image-20210918221042947" style="zoom:80%;" />

上図の `properties` タグは各技術の依存バージョンを定義し、一連のバージョンを統一しています。依存関係を追加または上書きするときは、互換性の確認が必要です。`properties` 内の `servlet` と `mysql` のバージョンを下図に示します。

<img src="Resources/image-20210918221511249.png" alt="image-20210918221511249" style="zoom:80%;" />

`dependencyManagement` タグは依存バージョンを固定しますが、依存関係自体は導入しません。必要な場合は `groupid` と `artifactId` を指定するだけでよく、`version` の定義は不要です。

`build` タグでは、下図のようにプラグインのバージョンも固定しています。

<img src="Resources/image-20210918221942453.png" alt="image-20210918221942453" style="zoom:80%;" />

親プロジェクトの `pom.xml` の設定を見ると、現在のプロジェクトの依存関係に `version` がない理由が分かります。

##### 1.2.1.2 依存関係の確認 :id=h-b499cda9c1ae

作成したプロジェクトの `pom.xml` には、次の依存関係があります。

<img src="Resources/image-20210918222321402.png" alt="image-20210918222321402" style="zoom:80%;" />

その依存関係を開いて `pom.xml` を確認すると、次の依存関係が導入されています。

<img src="Resources/image-20210918222607469.png" alt="image-20210918222607469" style="zoom:80%;" />

`spring-web` と `spring-webmvc` が含まれているため、プロジェクトでこの2つを明示的に指定しなくても `springMVC` のアノテーションを使用できます。

`spring-boot-starter-tomcat` は名前からも分かるとおり `tomcat` に依存しているため、プロジェクトを正常に起動できます。

\==結論：技術を使用するには、対応する starter 依存関係を導入します。==

##### 1.2.1.3 まとめ :id=h-308a43d593f4

**starter**

- `SpringBoot` で一般的に使うプロジェクト名です。プロジェクトで使用する依存関係の座標を定義し、依存設定を減らします。

**parent**

- Maven プロジェクトで一般的に使う親 POM です。この親を継承せず、spring-boot-dependencies BOM を導入する方法もあります。複数の座標のバージョンを定義し（依存関係自体ではなく依存管理）、依存関係の競合を減らします。

- `spring-boot-starter-parent`（2.5.0）と `spring-boot-starter-parent`（2.4.6）では、依存関係の座標のバージョンが合計57か所異なります。

**実際の開発では**

- Spring Boot が管理する依存関係では、通常 G と A だけを指定します。依存管理の対象外のライブラリでは、バージョンの明示が必要です。

  > G：groupid
  >
  > A：artifactId
  >
  > V：version

- 依存関係を解決できない場合は、まず座標、リポジトリ、バージョン管理の対象範囲を確認します。管理対象外または上書きが必要だと確認してから version を記述し、互換性要件も確認してください。

#### 1.2.2 アプリケーションの起動 :id=h-913251fe4c49

作成した `SpringBoot` アプリケーションには、必ず次のようなクラスが含まれます。これを起動クラスと呼びます。

```java
@SpringBootApplication
public class Springboot01QuickstartApplication {

    public static void main(String[] args) {
        SpringApplication.run(Springboot01QuickstartApplication.class, args);
    }
}
```

\==注意：==

- `SpringBoot` のプロジェクト作成時は、jar 形式を使用します。

- `SpringBoot` の起動クラスはプロジェクトの入口です。`main` メソッドを実行するとプロジェクトが起動します。

  `pom.xml` には `spring-boot-starter-web` を設定しており、これは前に学んだように `tomcat` に依存しています。そのため、`main` メソッドを実行すると `tomcat` でプロジェクトを起動できます。

#### 1.2.3 Web サーバーの切り替え :id=h-8a5295e4e223

現在は `tomcat` サーバーで起動しています。`tomcat` の代わりに `jetty` を使えるでしょうか。`jetty` は `maven` の応用編で説明した `maven` のプライベートリポジトリに使用するサーバーです。`web` サーバーを切り替えるには、まず既定の `tomcat` を除外します。除外には `exclusion` タグを使用します。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <artifactId>spring-boot-starter-tomcat</artifactId>
            <groupId>org.springframework.boot</groupId>
        </exclusion>
    </exclusions>
</dependency>
```

これで起動クラスを実行できるでしょうか。試すと、次のログが出力されます。

![image-20210918232512707](Resources/image-20210918232512707.png)

プログラムはすぐに停止します。`tomcat` を除外したため、サーバーがなくなったからです。`tomcat` の除外だけでなく、`jetty` の導入も必要です。`pom.xml` に `jetty` の starter 依存関係を追加します。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```

起動クラスをもう一度実行すると、ログから `jetty` サーバーを使用していることが分かります。

![image-20210918232904623](Resources/image-20210918232904623.png)

**まとめ：**

サーバーの切り替えから、`SpringBoot` で技術を変更するときは、対応する starter 依存関係を導入すればよいことが分かります。

<a id="section-2"></a>

## 2. 設定ファイル :id=h-881c35b672fe

### 2.1 設定ファイルの形式 :id=h-e43c161234a2

サーバーの既定のポート番号は `8080` なので、アクセス先は次のように記述できます。

```
http://localhost:8080/books/1
```

本番環境ではポートを `80` に変更し、次のようにアクセス時のポート番号を省略したい場合があります。

```
http://localhost/books/1
```

`SpringBoot` アプリケーションでは、どう変更するのでしょうか。`SpringBoot` は複数のプロパティ設定方法を提供します。

- `application.properties`

  ```
  server.port=80
  ```

- `application.yml`

  ```yaml
  server:
    port: 81
  ```

- `application.yaml`

  ```yaml
  server:
    port: 82
  ```

> \==注意：既定の設定ファイル名は application.properties、application.yml、application.yaml です。spring.config.name などの起動パラメーターで名前を変更できます。このパラメーターは、設定ファイルを読み込む前に渡す必要があります。==

#### 2.1.1 環境の準備 :id=h-83427decb98c

設定ファイルの違いを示すため、`springboot_02_base_config` というプロジェクトを作成します。環境は入門例と同じで、構成は次のとおりです。

<img src="Resources/image-20210917151314753.png" alt="image-20210917151314753" style="zoom:80%;" />

`com.itheima.controller` パッケージに `BookController` というコントローラーを作成します。内容は次のとおりです。

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println("id ==> "+id);
        return "hello , spring boot!";
    }
}
```

#### 2.1.2 各設定ファイルの実演 :id=h-8975eb64849b

- **application.properties 設定ファイル**

設定を行います。この例では設定ファイルを `src/main/resources` に配置します（Spring Boot は外部設定ファイルもサポートします）。このディレクトリには `application.properties` があり、そこでポート番号を変更できます。`port` と入力すると、下図のように `Idea` が候補を表示します。

<img src="Resources/image-20210917161422535.png" alt="image-20210917161422535" style="zoom:80%;" />

`application.properties` 設定ファイルの内容は次のとおりです。

```properties
server.port=80
```

サービスを起動すると、コンソールのログからバインドしたポート番号が変わったことを確認できます。

<img src="Resources/image-20210917161720855.png" alt="image-20210917161720855" style="zoom:80%;" />

- **application.yml 設定ファイル**

`application.properties` の内容を削除します。`resources` の下に `application.yml` という設定ファイルを作成し、次の形式でポート番号を設定します。

```yaml
server:
  port: 81
```

> \==注意：`:` の後、値の前には必ず空白を入れます。==

`yml` 設定ファイルでも候補が表示されます。`port` と入力すると、`idea` が上の形式での入力を支援します。

<img src="Resources/image-20210917162512646.png" alt="image-20210917162512646" style="zoom:80%;" />

サービスを起動すると、バインドしたポート番号が `81` であることをコンソールで確認できます。

![image-20210917162700711](Resources/image-20210917162700711.png)

- **application.yaml 設定ファイル**

`application.yml` と `application.properties` の内容を削除し、`resources` の下に `application.yaml` という設定ファイルを作成します。設定内容は拡張子が `yml` のファイルと同じで、異なるのは拡張子だけです。

`application.yaml` 設定ファイルの内容は次のとおりです。

```yaml
server:
  port: 83
```

サービスを起動し、コンソールでバインドしたポート番号を確認します。

![image-20210917163335913](Resources/image-20210917163335913.png)

\==注意：設定ファイルで候補が表示されない場合は、次の方法で対処できます。==

- `File` をクリックし、`Project Structure` を選択します。

<img src="Resources/image-20210917163557071.png" alt="image-20210917163557071" style="zoom:80%;" />

- 次のウィンドウが開くので、赤枠で示した項目を選択します。

<img src="Resources/image-20210917163736458.png" alt="image-20210917163736458" style="zoom:70%;" />

- 上の操作で、次のウィンドウが開きます。

<img src="Resources/image-20210917163818051.png" alt="image-20210917163818051" style="zoom:80%;" />

- 上図の `+` をクリックし、このモジュールの設定ファイルを選択します。

<img src="Resources/image-20210917163828518.png" alt="image-20210917163828518" style="zoom:80%;" />

- 以上の手順で、次の画面になります。`properties` 形式の設定ファイルが1つ、`yaml` 形式が2つあります。

<img src="Resources/image-20210917163846243.png" alt="image-20210917163846243" style="zoom:80%;" />

#### 2.1.3 設定形式と優先順位 :id=h-ac322b7ea706

同じ場所に properties と YAML ファイルがある場合、Spring Boot 2.5 では properties が優先されます。application.yml と application.yaml の両方に同名の設定を置いて読み込み順序に依存してはいけません。上書きの原因を調べやすくするため、プロジェクトでは1つの形式を選びます。

優先順位は設定の場所、有効な profile、環境変数、コマンドライン引数にも影響されます。例えば `java -jar app.jar --server.port=8085` は設定ファイルのポートを上書きできます。予期しない値になった場合は、まずこれらを確認してください。

YAML のインデントには空白だけを使用し、Tab は使いません。同じ階層の字下げをそろえてください。次に YAML の構文を説明します。

参考：[Spring Boot 2.5 の外部設定](https://docs.spring.io/spring-boot/docs/2.5.0/reference/html/features.html#features.external-config)。

### 2.2 yaml 形式 :id=h-d6dd33e0a728

3種類の設定ファイルを説明しました。`properties` 形式はすでに学んだので、ここからは `yaml` 形式を中心に説明します。

\*\*YAML（YAML Ain't Markup Language）はデータのシリアライズ形式です。\*\* 近年、設定ファイルではこの形式が主流になっており、以前の形式と比べて利点があります。まず、以前使っていた設定ファイルを見てみましょう。

最初は `xml` を使用していました。形式は次のとおりです。

```xml
<enterprise>
    <name>itcast</name>
    <age>16</age>
    <tel>4006184000</tel>
</enterprise>
```

`properties` 形式の設定ファイルは次のとおりです。

```properties
enterprise.name=itcast
enterprise.age=16
enterprise.tel=4006184000
```

`yaml` 形式の設定ファイルの内容は次のとおりです。

```yaml
enterprise:
  name: itcast
  age: 16
  tel: 4006184000
```

**利点：**

- 読みやすい

  `yaml` 形式の設定ファイルは `xml` 形式より読みやすく、構造も明確です。

- スクリプト言語と連携しやすい

- データ中心で、形式よりもデータを重視する

  `yaml` はデータを、`xml` は形式をより重視します。

**YAML のファイル拡張子：**

- `.yml`（主流）
- `.yaml`

上のどちらの拡張子も使えますが、今後は `yml` を使うことが多くなります。

#### 2.2.1 構文規則 :id=h-23327760a7e6

- 大文字と小文字を区別する

- プロパティの階層関係を複数行で記述し、各階層の宣言をコロンで終える

- インデントで階層を表し、同じ階層の左端をそろえる。空白だけを使用でき、Tab は使えない

  空白の数そのものは重要ではなく、同じ階層の左端をそろえることが必要です。

- プロパティ値の前に空白を入れる（名前と値はコロンと空白で区切る）

- \# はコメントを表す

\==基本規則：値の前に空白を入れ、コロンと区切ります。==

配列では、データを置く位置の下に、ハイフンを先頭記号として1行に1つずつ値を記述します。ハイフンと値の間には空白を入れます。例：

```yaml
enterprise:
  name: itcast
  age: 16
  tel: 4006184000
  subject:
    - Java
    - 前端
    - 大数据
```

### 2.3 yaml 設定ファイルからのデータ読み取り :id=h-b91b73a75317

#### 2.3.1 環境の準備 :id=h-101409f5229c

`springboot_03_read_data` という `SpringBoot` プロジェクトを作成します。ディレクトリ構成は次のとおりです。

<img src="Resources/image-20210917172736484.png" alt="image-20210917172736484" style="zoom:80%;" />

`com.itheima.controller` パッケージに `BookController` というコントローラーを作成します。内容は次のとおりです。

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println("id ==> "+id);
        return "hello , spring boot!";
    }
}
```

後でデータを格納するため、`com.itheima.domain` パッケージに `Enterprise` というエンティティクラスを作成します。内容は次のとおりです。

```java
public class Enterprise {
    private String name;
    private int age;
    private String tel;
    private String[] subject;

    //setter and getter

    //toString
}
```

`resources` の下に `application.yml` という設定ファイルを作成し、次のようにさまざまなデータを設定します。

```yaml
lesson: SpringBoot

server:
  port: 80

enterprise:
  name: itcast
  age: 16
  tel: 4006184000
  subject:
    - Java
    - 前端
    - 大数据
```

#### 2.3.2 設定データの読み取り :id=h-d038179db3e3

##### 2.3.2.1 @Value アノテーションの使用 :id=h-c0c621d2ffbe

`@Value("表达式")` アノテーションを使うと、設定ファイルからデータを読み取れます。アノテーション内では `${一级属性名.二级属性名……}` という形式でプロパティ名を参照します。

`BookController` で `@Value` アノテーションを使い、次のように設定データを読み取れます。

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @Value("${lesson}")
    private String lesson;
    @Value("${server.port}")
    private Integer port;
    @Value("${enterprise.subject[0]}")
    private String subject_00;

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println(lesson);
        System.out.println(port);
        System.out.println(subject_00);
        return "hello , spring boot!";
    }
}
```

##### 2.3.2.2 Environment オブジェクト :id=h-8e36b8634b98

上の方法では、読み取ったデータが個別に分かれます。`SpringBoot` では、`@Autowired` で `Environment` オブジェクトを注入して読み取ることもできます。この方法では、`SpringBoot` が設定ファイルのすべてのデータを `Environment` 経由で提供するため、必要な値は `Environment` の `getProperty(String name)` メソッドで取得できます。具体的なコードは次のとおりです。

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private Environment env;

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println(env.getProperty("lesson"));
        System.out.println(env.getProperty("enterprise.name"));
        System.out.println(env.getProperty("enterprise.subject[0]"));
        return "hello , spring boot!";
    }
}
```

> \==注意：この方法ではフレームワーク内の多くのデータも扱うため、ここでの開発ではあまり使用しません。==

##### 2.3.2.3 独自のオブジェクト :id=h-6cc0f2a628cb

`SpringBoot` は、設定ファイルのデータを独自のエンティティオブジェクトにまとめる方法も提供します。手順は次のとおりです。

- エンティティの `bean` の生成を `Spring` に管理させます。

  クラスに `@Component` アノテーションを追加します。

- `@ConfigurationProperties` アノテーションで設定ファイルの読み込みを示します。

  このアノテーションの `prefix` 属性で、指定した接頭辞のデータだけを読み込むように設定できます。

- `BookController` に注入します。

**具体的なコードは次のとおりです。**

`Enterprise` エンティティクラスの内容は次のとおりです。

```java
@Component
@ConfigurationProperties(prefix = "enterprise")
public class Enterprise {
    private String name;
    private int age;
    private String tel;
    private String[] subject;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String[] getSubject() {
        return subject;
    }

    public void setSubject(String[] subject) {
        this.subject = subject;
    }

    @Override
    public String toString() {
        return "Enterprise{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", tel='" + tel + '\'' +
                ", subject=" + Arrays.toString(subject) +
                '}';
    }
}
```

`BookController` の内容は次のとおりです。

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private Enterprise enterprise;

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println(enterprise.getName());
        System.out.println(enterprise.getAge());
        System.out.println(enterprise.getSubject());
        System.out.println(enterprise.getTel());
        System.out.println(enterprise.getSubject()[0]);
        return "hello , spring boot!";
    }
}
```

\==注意：==

3つ目の方法では、エンティティクラスに次の警告が表示されます。

<img src="Resources/image-20210917180919390.png" alt="image-20210917180919390" style="zoom:70%;" />

この警告は、`pom.xml` に次の依存関係を追加すると解消できます。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

### 2.4 複数環境の設定 :id=h-f6c8c8c8e728

開発、テスト、本番では設定が異なります。例えば開発中は、自分のパソコンに `mysql` をインストールし、その `mysql` に接続します。開発が終わって本番に公開する際には、本番環境に合わせて設定を変更する必要があります。

<img src="Resources/image-20210917185253557.png" alt="image-20210917185253557" style="zoom:60%;" />

設定を何度も書き換えるのは手間がかかります。`SpringBoot` は複数環境を簡単に設定する機能を提供し、1か所の変更で環境を切り替えられます。設定ファイルの種類によって方法が異なるため、それぞれ説明します。

#### 2.4.1 YAML の複数環境設定 :id=h-f1347d1b7d6c

Spring Boot 2.4 以降は、spring.config.activate.on-profile で特定のドキュメントを有効にします。--- は複数の YAML ドキュメントを区切ります。既定のドキュメントで dev を選び、後続のドキュメントは対応する profile が有効な場合にだけ適用されます。

```yaml
spring:
  profiles:
    active: dev
---
spring:
  config:
    activate:
      on-profile: dev
server:
  port: 8080
---
spring:
  config:
    activate:
      on-profile: test
server:
  port: 8081
---
spring:
  config:
    activate:
      on-profile: prod
server:
  port: 8082
```

java -jar app.jar --spring.profiles.active=prod を実行すると、本番設定へ切り替えられます。on-profile を持つドキュメント内に spring.profiles.active を置いてはいけません。パスワードなどの機密設定は、環境変数や外部設定で渡し、リポジトリに保存しないでください。

application-dev.yml、application-test.yml、application-prod.yml に分けることもできます。プロジェクトに応じて、分かりやすい構成を1つ選んでください。

#### 2.4.2 properties ファイル :id=h-ad6c5f894415

`properties` 形式で複数環境を設定するには、別々の設定ファイルを定義します。

- `application-dev.properties` は開発環境の設定ファイルです。ポート番号を `80` に設定します。

  ```properties
  server.port=80
  ```

- `application-test.properties` はテスト環境の設定ファイルです。ポート番号を `81` に設定します。

  ```properties
  server.port=81
  ```

- `application-pro.properties` は本番環境の設定ファイルです。ポート番号を `82` に設定します。

  ```properties
  server.port=82
  ```

既定では application.properties と YAML の設定が読み込まれます。この節では properties ファイルを使用するため、`application.properties` で有効にする設定ファイルを次のように指定します。

```properties
spring.profiles.active=pro
```

#### 2.4.3 コマンドラインの起動引数の設定 :id=h-685c9424c6e8

`SpringBoot` で開発したアプリケーションは `jar` にまとめ、`java -jar xxx.jar` でサービスを起動します。設定ファイルも jar に含まれるため、環境をどう切り替えるかが問題になります。

`jar` は圧縮ファイルなので、展開して設定を書き換え、再び jar にすることもできますが、手間がかかります。`SpringBoot` では、次のように `jar` の実行時に使用する環境を指定できます。

```shell
java –jar xxx.jar –-spring.profiles.active=test
```

この方法でポート番号を一時的に変更することもできます。方法は次のとおりです。

```shell
java –jar xxx.jar –-server.port=88
```

環境の選択とポート番号の一時変更など、複数の設定を同時に指定することもできます。

```shell
java –jar springboot.jar –-server.port=88 –-spring.profiles.active=test
```

試すと、コマンドラインで指定したポート番号の優先順位が高く、その値が使用されることが分かります。設定の優先順位は `SpringBoot` の公式サイトに説明されています。参照先：

```
https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config
```

上のサイトを開くと、次のページが表示されます。

![image-20210917193910191](Resources/image-20210917193910191.png)

同じ設定項目を複数の方法で指定した場合は、優先順位の高いものが有効になります。

### 2.5 設定ファイルの分類 :id=h-c1eff1aab1a8

<img src="Resources/image-20210917194941597.png" alt="image-20210917194941597" style="zoom:70%;" />

開発を終えたら、テスト担当者がテストする場面を考えます。開発環境とテスト環境では多くの設定が違うため、プロジェクトの実行時に次のように多数の設定を一時変更する必要があります。

```shell
java –jar springboot.jar –-spring.profiles.active=test --server.port=85 --server.servlet.context-path=/heima --server.tomcat.connection-timeout=-1 …… …… …… …… ……
```

このような場合に対応するため、`SpringBoot` は設定ファイルの複数の配置場所を定義し、場所ごとに優先順位を設けています。

`SpringBoot` の設定ファイルの配置場所は、次の4段階です。

- レベル1：classpath：application.yml
- レベル2：classpath：config/application.yml
- レベル3：file：application.yml
- レベル4：file：config/application.yml

> \==説明：== レベルが高いほど優先順位も高くなります。

#### 2.5.1 コードによる実演 :id=h-be4f087546b5

ここでは、設定ファイルの配置場所による優先順位だけを実演します。

##### 2.5.1.1 環境の準備 :id=h-7fbcb69178dd

`springboot_06_config_file` という `SpringBoot` プロジェクトを作成します。ディレクトリ構成は次のとおりです。

<img src="Resources/image-20210917200241282.png" alt="image-20210917200241282" style="zoom:80%;" />

`resources` の下に `config` ディレクトリを作成し、その中に `application.yml` 設定ファイルを作ります。ポート番号を `81` に設定します。

```yaml
server:
  port: 81
```

`resources` の直下にある `application.yml` 設定ファイルでは、ポート番号を `80` に設定します。

```yaml
server:
  port: 80
```

##### 2.5.1.2 レベル1と2の優先順位の確認 :id=h-04082a7bd58f

起動クラスを実行すると、コンソールに次のログが表示されます。

![image-20210917200805389](Resources/image-20210917200805389.png)

この結果から、==クラスパス上の `config` 内にある設定ファイルは、クラスパス直下の設定ファイルより優先される== ことが分かります。

##### 2.5.1.3 レベル2と4の優先順位の確認 :id=h-e17be182e019

レベル4を確認するには、次の手順を実行します。

- プロジェクトを `jar` にまとめます。

  プロジェクトの `package` をクリックして `jar` を生成します。

  <img src="Resources/image-20210917201243721.png" alt="image-20210917201243721" style="zoom:80%;" />

- ディスク上の `jar` の保存場所を確認します。

  <img src="Resources/image-20210917201523669.png" alt="image-20210917201523669" style="zoom:70%;" />

- `jar` のある場所に `config` フォルダーを作成します。その中に `application.yml` 設定ファイルを作り、ポート番号を `82` に設定します。

- コマンドラインで次のコマンドを使って実行します。

  ```shell
  java -jar springboot_06_config_file-0.0.1-SNAPSHOT.jar
  ```

  実行後のログは次のとおりです。

  ![image-20210917201922831](Resources/image-20210917201922831.png)

  この結果から、==file：`config` の設定ファイルは、クラスパス上の設定ファイルより優先される== ことが分かります。

> \==注意：==
>
> SpringBoot 2.5.0 には不具合があり、このバージョンでは `jar` のある場所の `config` ディレクトリ内に、任意の名前のフォルダーを作成する必要があります。

<a id="section-3"></a>

## 3. SpringBoot と junit の連携 :id=h-776a50e5eda8

復習：`Spring` と `junit` の連携

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SpringConfig.class)
public class UserServiceTest {

    @Autowired
    private BookService bookService;

    @Test
    public void testSave(){
        bookService.save();
    }
}
```

`@RunWith` アノテーションでランナーを、`@ContextConfiguration` アノテーションで設定クラスまたは設定ファイルを指定します。一方、`SpringBoot` と `junit` の連携は簡単で、次の3つの手順で実現できます。

- テストクラスに `SpringBootTest` アノテーションを追加します。
- `@Autowired` でテスト対象のリソースを注入します。
- テストメソッドを定義してテストします。

### 3.1 環境の準備 :id=h-93847a49d1b8

`springboot_07_test` という `SpringBoot` プロジェクトを作成します。構成は次のとおりです。

<img src="Resources/image-20210917213556673.png" alt="image-20210917213556673" style="zoom:80%;" />

`com.itheima.service` の下に `BookService` インターフェースを作成します。内容は次のとおりです。

```java
public interface BookService {
    public void save();
}
```

`com.itheima.service.impl` パッケージに `BookServiceImpl` クラスを作成し、`BookService` インターフェースを実装します。内容は次のとおりです。

```java
@Service
public class BookServiceImpl implements BookService {
    @Override
    public void save() {
        System.out.println("book service is running ...");
    }
}
```

### 3.2 テストクラスの作成 :id=h-36db976199ea

`test/java` の下に `com.itheima` パッケージを作成し、その中にテストクラスを作って `BookService` を注入します。

```java
@SpringBootTest
class Springboot07TestApplicationTests {

    @Autowired
    private BookService bookService;

    @Test
    public void save() {
        bookService.save();
    }
}
```

> 注意：既定では、テストクラスのパッケージから親パッケージへ向かって @SpringBootApplication または @SpringBootConfiguration を探します。そのため、テストクラスは通常、起動クラスと同じパッケージまたはそのサブパッケージに配置します。
>
> 例えば：
>
> - 起動クラスのパッケージは `com.itheima` です。
> - テストクラスのパッケージは `com.itheima` です。
>
> この条件を満たさない場合は、`@SpringBootTest` アノテーションの `classes` 属性で起動クラスの Class オブジェクトを指定します。例：`@SpringBootTest(classes = Springboot07TestApplication.class)`。

<a id="section-4"></a>

## 4. SpringBoot と mybatis の連携 :id=h-67f166783265

### 4.1 復習：Spring と Mybatis の連携 :id=h-18f479887e28

`Spring` と `Mybatis` の連携には、多くの設定クラスを定義する必要があります。

- `SpringConfig` の設定クラス

  - `JdbcConfig` の設定クラスをインポートする

  - `MybatisConfig` の設定クラスをインポートする

    ```java
    @Configuration
    @ComponentScan("com.itheima")
    @PropertySource("classpath:jdbc.properties")
    @Import({JdbcConfig.class,MyBatisConfig.class})
    public class SpringConfig {
    }

    ```

- `JdbcConfig` の設定クラス

- データソースを定義する（properties の設定項目 driver、url、username、password を読み込む）

  ```java
  public class JdbcConfig {
      @Value("${jdbc.driver}")
      private String driver;
      @Value("${jdbc.url}")
      private String url;
      @Value("${jdbc.username}")
      private String userName;
      @Value("${jdbc.password}")
      private String password;

      @Bean
      public DataSource getDataSource(){
          DruidDataSource ds = new DruidDataSource();
          ds.setDriverClassName(driver);
          ds.setUrl(url);
          ds.setUsername(userName);
          ds.setPassword(password);
          return ds;
      }
  }
  ```

- `MybatisConfig` の設定クラス

  - `SqlSessionFactoryBean` を定義する

  - マッピング設定を定義する

    ```java
    @Bean
    public MapperScannerConfigurer getMapperScannerConfigurer(){
        MapperScannerConfigurer msc = new MapperScannerConfigurer();
        msc.setBasePackage("com.itheima.dao");
        return msc;
    }

    @Bean
    public SqlSessionFactoryBean getSqlSessionFactoryBean(DataSource dataSource){
        SqlSessionFactoryBean ssfb = new SqlSessionFactoryBean();
        ssfb.setTypeAliasesPackage("com.itheima.domain");
        ssfb.setDataSource(dataSource);
        return ssfb;
    }

    ```

### 4.2 SpringBoot と mybatis の連携 :id=h-c0739335b4ae

#### 4.2.1 モジュールの作成 :id=h-cde42d1ac587

- 新しいモジュールを作成し、`Spring Initializr` を選択して基本情報を設定します。

<img src="Resources/image-20210917215913779.png" alt="image-20210917215913779" style="zoom:80%;" />

- このモジュールで必要な技術（MyBatis、MySQL）を選択します。

  <img src="Resources/image-20210917215958091.png" alt="image-20210917215958091" style="zoom:80%;" />

#### 4.2.2 エンティティクラスの定義 :id=h-f8d7696c1e40

`com.itheima.domain` パッケージに `Book` エンティティクラスを次のように定義します。

```java
public class Book {
    private Integer id;
    private String name;
    private String type;
    private String description;

    //setter and  getter

    //toString
}
```

#### 4.2.3 dao インターフェースの定義 :id=h-47db51a7e11d

`com.itheima.dao` パッケージに `BookDao` インターフェースを次のように定義します。

```java
public interface BookDao {
    @Select("select * from tbl_book where id = #{id}")
    public Book getById(Integer id);
}
```

#### 4.2.4 テストクラスの定義 :id=h-b6a8a4d38117

`test/java` の下に `com.itheima` パッケージを定義し、その中に次の内容のテストクラスを作成します。

```java
@SpringBootTest
class Springboot08MybatisApplicationTests {

    @Autowired
    private BookDao bookDao;

    @Test
    void testGetById() {
        Book book = bookDao.getById(1);
        System.out.println(book);
    }
}
```

#### 4.2.5 設定の記述 :id=h-77e36940ada6

コードでは接続先データベース、ユーザー名、パスワードを指定していません。この部分を `SpringBoot` の設定ファイルで設定する必要があります。

`application.yml` 設定ファイルに、次の内容を設定します。

```yml
spring:
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/ssm_db
    username: root
    password: root
```

#### 4.2.6 テスト :id=h-a070efb8ff0b

テストメソッドを実行すると、次のエラーが表示されます。

<img src="Resources/image-20210917221427930.png" alt="image-20210917221427930" style="zoom:70%;" />

エラーは、`Spring` コンテナーに `BookDao` 型の `bean` がないことを示しています。なぜでしょうか。

`Mybatis` はインターフェースをスキャンし、そのプロキシオブジェクトを生成して `Spring` に管理させます。しかし、どれが `dao` インターフェースなのかを `Mybatis` に伝えていません。`BookDao` に `@Mapper` を付ければ解決します。修正後の `BookDao` は次のとおりです。

```java
@Mapper
public interface BookDao {
    @Select("select * from tbl_book where id = #{id}")
    public Book getById(Integer id);
}
```

> 注意：
>
> `SpringBoot` が 2.4.3 未満で、Mysql ドライバーが 8.0 より新しい場合は、接続 URL にタイムゾーンを設定する（`jdbc:mysql://localhost:3306/ssm_db?serverTimezone=UTC`）か、MySQL データベース側で設定して、この問題を解決する必要があります。

#### 4.2.7 Druid データソースの使用 :id=h-4e3c61594e6f

データソースを指定していないため、`SpringBoot` の既定のものが使われています。次の手順で `Druid` データソースを指定することもできます。

- `Druid` の依存関係を導入します。

  ```xml
  <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>druid</artifactId>
      <version>1.1.16</version>
  </dependency>
  ```

- `application.yml` 設定ファイルで設定します。

  `spring.datasource.type` で使用するデータソースを指定できます。設定ファイルを次のように修正します。

  ```yaml
  spring:
    datasource:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/ssm_db?serverTimezone=UTC
      username: root
      password: root
      type: com.alibaba.druid.pool.DruidDataSource
  ```

<a id="section-5"></a>

## 5. 実装例 :id=h-d3a9e2d95bb6

`SpringBoot` の学習はここまでです。次に、`SSM` で作成した3つのフレームワークの連携例を `SpringBoot` で実装します。基本的には以前の例をコピーして `SpringBoot` 用に修正し、主に次の部分を変更します。

1. pom.xml

   starter 依存関係と必要なリソースの座標（druid）を設定する

2. application.yml

   データソース、ポートなどを設定する

3. 設定クラス

   すべて削除

4. dao

   @Mapper を設定する

5. テストクラス

6. ページ

   resources ディレクトリ内の static に配置する

### 5.1 プロジェクトの作成 :id=h-65d480d305d6

`SpringBoot` プロジェクトを作成し、作成時に `web`、`mysql`、`mybatis` を選択します。構成は次のとおりです。

<img src="Resources/image-20210917225019868.png" alt="image-20210917225019868" style="zoom:80%;" />

プロジェクトで `Druid` を使用するため、`Druid` の依存関係の座標を導入します。

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.16</version>
</dependency>
```

### 5.2 コードのコピー :id=h-8378e6cbf11e

下図のように、`springmvc_11_page` プロジェクトの `java` コードとテストコードを、パッケージごと `springboot_09_ssm` プロジェクトへコピーします。

<img src="Resources/image-20210917225715519.png" alt="image-20210917225715519" style="zoom:70%;" />

次の内容を修正します。

- 移行時は既存の設定を1つずつ確認します。Spring Boot は MVC 設定の一部を自動で提供しますが、独自のインターセプター、CORS、トランザクション、データソースなどの設定は残す必要がある場合があります。config パッケージ全体をそのまま削除してはいけません。

- `dao` パッケージのインターフェースを `springboot_09-ssm` プロジェクトへコピーしたら、各インターフェースに `@Mapper` アノテーションを追加します。

- `BookServiceTest` を、`SpringBoot` と `junit` の連携に合わせて修正します。

  ```java
  @SpringBootTest
  public class BookServiceTest {

      @Autowired
      private BookService bookService;

      @Test
      public void testGetById(){
          Book book = bookService.getById(2);
          System.out.println(book);
      }

      @Test
      public void testGetAll(){
          List<Book> all = bookService.getAll();
          System.out.println(all);
      }
  }
  ```

### 5.3 設定ファイル :id=h-b75ef79976fa

`application.yml` 設定ファイルに、次の内容を設定します。

- サービスのポート番号
- データベースの接続情報
- データソース

```yaml
server:
  port: 80

spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/ssm_db #?servierTimezone=UTC
    username: root
    password: root
```

### 5.4 静的リソース :id=h-f30a86c686e1

`SpringBoot` アプリケーションには `webapp` ディレクトリがありません。`SpringBoot` アプリケーションでは、静的リソースをどこに配置すればよいのでしょうか。

下図のように、静的リソースは `resources` の下の `static` に配置します。

<img src="Resources/image-20210917230702072.png" alt="image-20210917230702072" style="zoom:80%;" />
