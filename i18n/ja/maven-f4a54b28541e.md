# Maven :id=h-9e473096b790

プロジェクトのディレクトリ、依存関係、ビルドのフェーズ、基本的なコマンドを理解し、開発中に依存関係の競合を調べられるようにします。

**前提知識とバージョン：** JDK と Maven 3.x をインストールしてください。完全な POM では Java 17 を使います。古い画面例の JDK 設定はメニューを説明するためのもので、本例のバージョンを指定するものではありません。

**サンプルの使い方：** 全ファイルと実行手順を明示したプロジェクトを除き、各コードブロックは節ごとの独立した断片です。省略部分や仮の名前を補ってください。誤りと示した行は問題の説明用です。同じ節の代替実装を混ぜないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://maven.apache.org/guides/)

**このページの目次**

- [Maven の基礎](#section-1)
- [Maven のインストールと設定](#section-2)
- [標準のディレクトリ構成](#section-3)
- [pom.xml の詳細](#section-4)
- [Maven のコマンド](#section-5)
- [依存関係のスコープ](#section-6)
- [依存関係の競合](#section-7)
- [**Maven 座標を検索するサイト**](#section-8)

<a id="section-1"></a>

## Maven の基礎 :id=h-adf7c25b2ff0

### Maven とは :id=h-e374cfe94594

Maven はプロジェクト管理ツールです。開発や管理に必要な情報をプロジェクトオブジェクトモデル（POM：project object model）で表します。中心となる機能は依存関係の管理で、ビルドのライフサイクルによってプロジェクトをビルドして公開するまでの流れを定義します。

### Maven の役割 :id=h-adc90e50135a

- プロジェクトのビルド：標準的で、プラットフォームを問わず使える自動ビルドの方法を提供します。

- 依存関係の管理：JAR ファイルなど、プロジェクトに必要なライブラリを管理し、バージョンの競合に対応します。

- 共通の開発構成：Maven が広く使われることで、標準的なプロジェクト構成が定着しました。

### Maven の基本概念 :id=h-01eec93afc2a

#### リポジトリ :id=h-f463c4dc92ac

リポジトリは、JAR ファイルなどの成果物を保管する場所です。

リポジトリの種類：

- ローカルリポジトリ：自分のコンピューターに成果物を保存する場所で、リモートリポジトリから成果物を取得します。
- リモートリポジトリ：自分のコンピューター以外にあり、ローカルリポジトリが成果物を取得する相手です。

リモートリポジトリの種類

- 中央リポジトリ：公開されている Maven リポジトリです。世界中のすべての Java ライブラリが入っているわけではありません。
- プライベートリポジトリ：部署や会社の範囲で成果物を保管し、中央リポジトリからも成果物を取得します。

プライベートリポジトリを使う理由

- 購入したライブラリや自社開発の JAR ファイルなど、権利や公開範囲を管理する必要がある成果物を保管します。
- オープンソースのライブラリにも著作権があります。公開できるかどうかはライセンスや公開規則によります。公開できない社内ライブラリや商用ライセンスのライブラリは、通常、アクセス制御されたプライベートリポジトリに置きます。
- 決められた社内の範囲で成果物を共有し、外部には公開しません。

#### 座標 :id=h-4ee501b97a10

座標は、リポジトリ内の成果物を特定するための情報です。

Maven 座標を構成する項目：

- groupId は Maven プロジェクトが属する組織を表します。通常はドメイン名を逆順にした形を使います。例：org.mybatis。
- artifactId は Maven プロジェクトの名前を表し、通常はモジュール名を使います。
- version は現在のバージョン番号を表します。

座標によって成果物を一意に特定できるため、ツールがその情報を使って成果物を検索し、自動的にダウンロードできます。

<a id="section-2"></a>

## Maven のインストールと設定 :id=h-bfdb44e2f7ca

\*\*Maven 公式サイト：\*\*[https://maven.apache.org/](https://maven.apache.org/)

\*\*ダウンロード：\*\*[https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)

### **ローカルリポジトリの設定** :id=h-42d0d729066e

Maven のローカルリポジトリは **conf/settings.xml** で設定します。次のコードブロックを探し、**localRepository** を指定してください。

```xml
<localRepository>/Users/XXXXXXXX/dev/myRepository</localRepository>
```

### **Maven プロジェクトの既定の JDK バージョンを設定する** :id=h-42c9b040cf7d

既定のコンパイル対象は、Compiler プラグインのバージョンなどの設定によって決まります。すべての Maven プロジェクトが Java 1.5 に固定されるわけではありません。一般に使う JDK は 1.8 以降なので、必要に応じて既定値を変更できます。**profiles** の中に、次の **profile** ブロックを追加します。

```xml
<profile>
  <id>jdk-1.8</id>
  <activation>
    <activeByDefault>true</activeByDefault>
    <jdk>1.8</jdk>
  </activation>
  <properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
  </properties>
</profile>
```

### **Maven の環境変数を設定する** :id=h-e9fd48e1194a

macOS では次のように設定します。

Users/XXXXX/.zshrc を編集し、次の行を追加します。

```
export MAVEN_HOME=/Users/chaishuai/dev/apache-maven-3.8.6
export PATH=$PATH:$MAVEN_HOME/bin
```

Windows では次のように設定します。

「システムの詳細設定」から「環境変数」を開き、次のシステム変数を設定します。

1. システム変数 **MAVEN_HOME** を作成し、値に **E:\Maven\apache-maven-3.8.6** を指定します。
2. システム変数 **Path** を編集し、**;%MAVEN_HOME%\bin** を追加します。

ターミナルで次のコマンドを実行します。Maven のバージョン情報が表示されれば、インストールは成功です。

```
$ mvn -v

Apache Maven 3.8.6 (84538c9988a25aec085021c365c560670ad80f63)
Maven home: /opt/apache-maven-3.8.6
Java version: 17.0.4, vendor: Azul Systems, Inc., runtime: /Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
Default locale: zh_CN_#Hans, platform encoding: UTF-8
OS name: "mac os x", version: "12.5.1", arch: "aarch64", family: "mac"
```

<a id="section-3"></a>

## 標準のディレクトリ構成 :id=h-d9a3365ab8dc

標準のディレクトリ構成を作る

```
MYJAVAPROJECT                           工程名
  |---src                              源码
  |---|---main                             主程序目录
  |---|---|---java                             主程序的 Java 文件
  |---|---|---resources                        主程序的资源文件
    |---|---|---webapp                        	 主程序的网站相关配置文件
  |---|---test                             测试程序目录
  |---|---|---java                              测试程序的 Java 文件
  |---|---|---resources                         测试程序的资源文件
  |---target                           编译结果
  |---pom.xml                          Maven 工程的核心配置
```

<a id="section-4"></a>

## pom.xml の詳細 :id=h-95daa6c36f5a

POM は Project Object Model（プロジェクトオブジェクトモデル）の略です。

pom.xml は Maven プロジェクトの中心となる設定ファイルで、ビルドに関する設定を記述します。動的 Web プロジェクトにおける web.xml に相当する重要なファイルです。完全な pom.xml ファイルをプロジェクトの **ルートディレクトリ**に置きます。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>example</groupId>
    <artifactId>maven-notes</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>
    <properties>
        <maven.compiler.release>17</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
            </plugin>
        </plugins>
    </build>
    <profiles>
        <profile>
            <id>dev</id>
            <properties>
                <app.environment>development</app.environment>
            </properties>
        </profile>
    </profiles>
</project>
```

この完全な例は、JDK 17 と JUnit 4 を使う単一モジュールの JAR プロジェクトです。profile は profiles の中に置き、mvn test -Pdev で有効にできます。

parent は別の親 POM を参照します。自分自身を親プロジェクトに指定してはいけません。modules は集約プロジェクトで使い、その packaging は pom にします。実在するモジュールについてだけ module を追加してください。

dependencyManagement は依存バージョンをまとめて管理するもので、ライブラリを自動的に追加しません。optional=true は主に依存関係を利用側のプロジェクトへ伝播させるかを制御します。現在のプロジェクトでそのライブラリが不要になるという意味ではありません。プラグインの依存関係はプラグイン自身の実行環境のもので、プロジェクトの dependencies とは別です。

例えば Spring Boot プロジェクトでは、親 POM を継承するか、BOM をインポートして依存バージョンを管理できます。通常のプロジェクトでは、引き続きバージョンを明示する必要があります。

<a id="section-5"></a>

## Maven のコマンド :id=h-d079803ef152

- mvn clean：target ディレクトリを削除します。
- mvn compile：メインのソースコードをコンパイルし、結果を target/classes に保存します。
- mvn test-compile：テストのソースコードをコンパイルし、結果を target/test-classes に保存します。
- mvn test：テストを実行し、レポートを target/surefire-reports に保存します。
- mvn package：プログラムをパッケージ化し、成果物を target に保存します。
- mvn install：JAR をローカルリポジトリにインストールします。保存先のパスはプロジェクトの座標に対応します。
- mvn deploy：JAR をリモートリポジトリに公開します。
- mvn dependency:list：現在のプロジェクトが依存している JAR の一覧を表示します。
- mvn dependency:tree：プロジェクトの依存関係をツリー形式で表示します。
- mvn help:active-profiles：有効な profile と、それぞれの定義場所を表示します。
- mvn compile -Pdev：コンパイル時に dev という名前の profile を有効にします。-P の後には名前が必要です。

<a id="section-6"></a>

## 依存関係のスコープ :id=h-bc7cfb78dfeb

|          | main ディレクトリ（配置場所）  | test ディレクトリ（配置場所）  | 開発中（タイミング） | サーバーへのデプロイ時（タイミング） |
| -------- | ------------------ | ------------------ | ---------- | ------------------ |
| compile  | 利用可                | 利用可                | 利用可        | 利用可                |
| test     | -                  | 利用可                | 利用可        | -                  |
| provided | 利用可                | 利用可                | 利用可        | -                  |
| runtime  | メインコードのコンパイル時は利用不可 | テストのコンパイル時と実行時に利用可 | 実行時に利用可    | 利用可                |

> **要点の確認：**
>
> - compile：既定のスコープです。通常のライブラリ依存関係の多くは、このスコープを使います。
> - test：junit など、テストで使うライブラリを指定します。
> - provided：servlet-api や jsp-api など、開発中には必要でもサーバーが提供するライブラリに使います。サーバー上の同種のライブラリとの競合を避けるため、デプロイする成果物には含めません。
> - runtime：コンパイル時には不要で、実行時に必要なライブラリに使います。

<a id="section-7"></a>

## 依存関係の競合 :id=h-f9b40e98f50c

### Maven の依存バージョンの選択規則 :id=h-f75cdd53814e

同じ成果物に複数の依存経路がある場合は、深い階層の依存関係より、浅い階層の依存関係が優先されます。

1. 最も近い依存関係が優先される
2. 経路の長さが同じ場合は、先に宣言した依存関係が優先されます。

### 競合の解決方法 :id=h-32cbdfaf1621

必要なバージョンを選び、exclusions で不要な推移的依存関係を除外するか、使いたい依存関係を明示的に宣言します。

### 依存関係の競合を調べるプラグイン :id=h-de24543de06d

- IDEA 用の Maven Helper
- Maven Enforcer プラグイン

**Enforcer プラグインの実行コマンド：mvn clean package enforcer:enforce**

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-enforcer-plugin</artifactId>
            <version>3.5.0</version>
            <executions>
                <execution>
                    <id>check-dependencies</id>
                    <phase>validate</phase>
                    <goals><goal>enforce</goal></goals>
                    <configuration>
                        <rules>
                            <dependencyConvergence/>
                            <requireJavaVersion><version>[17,)</version></requireJavaVersion>
                        </rules>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

これは POM の build 部分の断片です。既存の build に統合し、build を重複して作らないでください。mvn validate は依存バージョンの収束と Java のバージョンを確認します。規則が競合を検出したら、dependency:tree を調べてからバージョンを決め、根拠なくライブラリを除外しないでください。

pluginManagement はプラグインの既定設定を提供するだけです。ライフサイクル内で自動実行するには、通常は plugins にもプラグインを宣言する必要があります。上記の規則はバージョン競合を調べるもので、すべての JAR 内の class の重複を検出するものではありません。

<a id="section-8"></a>

## **Maven 座標を検索するサイト** :id=h-88ec0a5c3046

[https://mvnrepository.com/](https://mvnrepository.com/)
