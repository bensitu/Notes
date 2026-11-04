# Java Web :id=h-fbc9ab6d401b

URL、Servlet のライフサイクル、リクエストとレスポンスを理解し、開発時にメソッドやパスのマッチングを確認します。

**前提知識とバージョン：** Java のクラス、インターフェース、HTTP の基礎知識が必要です。XML の入門例は javax / Servlet 3.1、後半の完全な HTTP の例は jakarta / Servlet 6.0 を使用します。各節に合わせて依存関係とインポートするパッケージを一式そろえてください。

**サンプルの使い方：** 全ファイルと実行手順が明示されたプロジェクトを除き、コードブロックは各節の独立した断片です。省略記号や仮の名前は補ってください。誤りと記された行は問題を説明するためのものです。同じ節の代替コードを組み合わせないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://jakarta.ee/specifications/servlet/6.0/)

**このページの目次**

- [Tomcat](#section-1)
- [Servlet](#section-2)
- [Request と Response](#section-3)
- [ServletContext](#section-4)

<a id="section-1"></a>

## Tomcat :id=h-3ae04b48076b

Tomcat 9 では import javax.servlet.http.HttpServlet; を使います。

Tomcat 10 では import jakarta.servlet.http.HttpServlet; を使います。

<a id="section-2"></a>

## Servlet :id=h-4eb2d2b67ebd

Servlet（server applet）の概念：サーバー側で動作する小さなプログラム

- Servlet はサーバー側でリクエストを処理する標準インターフェースです。コンテナーがインスタンスを作成し、ライフサイクルメソッドを呼び出します。ブラウザーは URL にアクセスするのであり、Java クラスを直接実行するわけではありません。
- これから独自の Java クラスを定義します。Servlet のリクエスト処理は Tomcat などの Servlet 対応コンテナーが呼び出すため、リクエストごとに main メソッドで処理する必要はありません。
- サーバーがこの Java クラスを認識できるよう、Servlet インターフェースを実装し、そのメソッドをオーバーライドします。

### Servlet クイックスタート :id=h-d6b68b572905

1. Java EE プロジェクトを作成する

2. Servlet インターフェースを実装するクラスを定義する

```java
public abstract class ServletDemo1 implements Servlet {
    // Implement all Servlet methods, or extend HttpServlet as shown below.
}
```

詳細なコード：

```java
package cn.itcast.web.servlet;

import javax.servlet.*;
import java.io.IOException;

public class ServletDemo1 implements Servlet {

            @Override
            public void init(ServletConfig servletConfig) throws ServletException {
            }
            @Override
            public ServletConfig getServletConfig() {
                        return null;
            }
            // See note 1 below.
            @Override
            public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
                        System.out.println("Hello Servlet");
            }
            @Override
            public String getServletInfo() {
                        return null;
            }

             @Override
            public void destroy() {
            }

}
```

例の説明：

1. サービスを提供するメソッド

2. インターフェースの抽象メソッドを実装する

3. Servlet を設定する

   ```
    在web.xml中配置：
   ```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd" version="3.1">

<!-- See note 1 below. -->
    <servlet>
            <servlet-name>demo1</servlet-name>
            <servlet-class>cn.itcast.web.servlet.ServletDemo1</servlet-class>
    </servlet>
        <!-- See note 2 below. -->

    <servlet-mapping>
            <servlet-name>demo1</servlet-name>
            <url-pattern>/demo1</url-pattern>
    </servlet-mapping>
        <!-- See note 3 below. -->

</web-app>
```

例の説明：

1. Servlet を設定する

2. 説明：Servlet を登録します。（1）servlet-name：登録名を設定します。任意に指定でき、デフォルト値はありません。この例では demo1 です。（2）servlet-class：Servlet クラスの完全修飾名を設定します。

3. 説明：登録済み Servlet の外部からのアクセスパスを対応付けます。（1）servlet-name：上記と同じ名前を指定し、同じ登録に関連付けます。（2）url-pattern：リソースのアクセスパスを設定します。

4. ブラウザーからリクエストを送る：

- ブラウザーに [http://localhost:8080/PROJECT-NAME/demo1](http://localhost:8080/PROJECT-NAME/demo1) を入力して Enter を押すと、コンテナーが対応するリクエスト処理メソッドを呼び出します。
- 正常に実行されると、IDEA のコンソールに Hello Servlet が表示されます。

### Servlet 3.0 クイックスタート :id=h-2a7f50b74af9

Servlet 3.0 からアノテーションによる設定に対応しています。3.0 より前は XML ファイルによる設定のみでした。

1. Web プロジェクトを作成し、Servlet の依存関係の座標を追加する

   **Tomcat 10.1（Servlet 6.0，Java 11+）：**

   ```xml
   <dependency>
               <groupId>jakarta.servlet</groupId>
               <artifactId>jakarta.servlet-api</artifactId>
               <version>6.0.0</version>
               <scope>provided</scope>
   </dependency>
   ```

   **Tomcat 9:**

   ```xml
   <dependency>
               <groupId>javax.servlet</groupId>
               <artifactId>javax.servlet-api</artifactId>
               <version>3.1.0</version>
               <scope>provided</scope>
     </dependency>
   ```

2. 完全な HTTP Servlet を作成します。以下は Tomcat 10.1 の jakarta パッケージを使用します。Tomcat 9 のプロジェクトでは、javax パッケージと対応する API 依存関係に統一してください。

```java
package cn.itcast.web.servlet;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/demo1")
public class ServletDemo1 extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/plain;charset=UTF-8");
        response.getWriter().println("Hello Servlet");
    }
}
```

3. @WebServlet でアクセスパスを設定し、同じ Servlet の登録を web.xml に重複して書かないようにします。実際の開発では通常、基礎となるインターフェースのメソッドを実装する HttpServlet を継承します。

4. アクセス方法：Tomcat を起動し、ブラウザーに URL を入力して Servlet にアクセスします。

   ```html
   http://localhost:8080/PROJECT-NAME/demo1
   ```

### Servlet のライフサイクル :id=h-bb802d6f0247

1. 初期化：init

   デフォルトでは Servlet への初回アクセス時に 1 回だけ呼ばれます。

2. サービスの提供：service

   Servlet にアクセスされるたびに呼ばれ、複数回実行されます。

3. 破棄：destroy

   コンテナーがアプリケーションをアンロードするときや正常終了するときに呼ばれます。プロセスを強制終了した場合、実行は保証されません。

コード：

```java
import java.io.IOException;
import jakarta.servlet.Servlet;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns="/index", loadOnStartup=-1) // See note 1 below.
public class ServletLifeCycle implements Servlet {

    /* See note 2 below. */
    @Override
    public void init(ServletConfig config) throws ServletException {
        // See note 3 below.
        System.out.println("我被初始化了......");
    }

    /* See note 4 below. */
    @Override
    public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
        // See note 5 below.
        System.out.println("我提供服务了......");
    }

    /* See note 6 below. */
    @Override
    public void destroy() {
        // See note 7 below.
        System.out.println("我被销毁了......");
    }

    @Override
    public ServletConfig getServletConfig() {
        // TODO Auto-generated method stub
        return null;
    }


    @Override
    public String getServletInfo() {
        // TODO Auto-generated method stub
        return null;
    }

}
```

例の説明：

1. ページのパスと初期化のタイミング
2. 初期化メソッド init：デフォルトでは Servlet への初回アクセス時に 1 回だけ呼ばれます。WebServlet に loadOnStartup パラメーターを追加すると、初期化のタイミングを変更できます。デフォルトの -1 はアクセス時の作成、0 または正の整数は起動時の読み込みを表し、通常は値が小さいほど先に読み込まれます。
3. イベント処理を追加する
4. サービスメソッド service：Servlet にアクセスされるたびに呼ばれ、複数回実行されます。
5. イベント処理を追加する
6. 破棄メソッド destroy：メモリの解放時またはサーバーの終了時に 1 回呼ばれます。
7. イベント処理を追加する

### Servlet の継承体系 :id=h-3880c81ef225

```
Servlet -- 接口
        |
GenericServlet -- 抽象类
        |
HttpServlet  -- 抽象类

GenericServlet：将Servlet接口中其他的方法做了默认空实现，只将service()方法作为抽象
                        将来定义Servlet类时，可以继承GenericServlet，实现service()方法即可
                        注：也可以对其他方法进行实现，默认只用复写service()方法

HttpServlet：对http协议的一种封装，简化操作
                          若有HTTP的相关操作，可继承HttpServlet并复写doGet/doPost方法即可
                    HttpServlet的使用：
                                1. 定义类继承HttpServlet
                                2. 复写doGet/doPost方法(不用复写service()方法)
```

HttpServlet の例：

```java
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet(urlPatterns = "/index1")
public class ServletHttpMethod extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub

        System.out.println("Get......");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // TODO Auto-generated method stub

        System.out.println("Post......");
    }

}
```

### urlPattern の設定 :id=h-b28017341e0b

設定規則は 4 種類です。完全一致、ディレクトリ一致、拡張子一致、任意のパスへの一致があります。

優先順位：完全一致 > 最長パス一致（/*&#x20;を含む）> 拡張子一致 > デフォルトマッピング /。例えば /* は \*.jsp より先に一致し、/ はほかのマッピングに一致しない場合だけ使われます。

1. 完全一致

   ```text
   配置路径：@WebServlet("/user/select")
   访问路径：localhost:8080/java-demo/user/select
   ```

2. ディレクトリ一致

   ```text
   配置路径：@WebServlet("/user/*")
   访问路径：localhost:8080/java-demo/user/aaa
                   localhost:8080/java-demo/user/bbb
   ```

3. 拡張子一致

   ```text
   配置路径：@WebServlet("*.do")
   访问路径：localhost:8080/java-demo/user/aaa.do
                   localhost:8080/java-demo/user/bbb.do
   ```

4. 任意のパスへの一致

   ```text
   配置路径：@WebServlet("/")
                   @WebServlet("/*")
   访问路径：localhost:8080/java-demo/abcdef
                   localhost:8080/java-demo/123456
   ```

   / と /\* の違い：

   1. プロジェクト内の Servlet に / を設定すると、Tomcat の DefaultServlet を上書きします。ほかの url-pattern のどれにも一致しない場合にのみ、この Servlet が使われます。

   2. プロジェクト内の Servlet に /\* を設定すると、任意のアクセスパスに一致します。

<a id="section-3"></a>

## Request と Response :id=h-0987ca8d7bde

### Request の継承体系 :id=h-4837ba755d9a

```
ServletRequest	--- Java提供的请求对象根接口
            |
HttpServletRequest	--- Java提供的对Http协议封装的请求对象接口
            |
RequestFacade		--- Tomcat定义的实现类
```

### Request によるリクエストデータの取得 :id=h-57d116c77f58

リクエストデータは 3 つの部分から成ります。

1. リクエスト行：

   ```
   GET /request-demo/req?username=zhangsan HTTP/1.1
   ```

   1. リクエストメソッドを取得する：GET
      対応するメソッド：String getMethod()
   2. （\* 任意の設定）仮想ディレクトリ（アプリケーションのアクセスパス）を取得する：/request-demo
      対応するメソッド：String getContextPath()
   3. Servlet のパスを取得する：/req
      対応するメソッド：String getServletPath()
   4. GET のリクエストパラメーターを取得する：name=zhangsan
      対応するメソッド：String getQueryString()
   5. （\*）リクエストの URI を取得する：/request-demo/req
      対応するメソッド：String getRequestURI()：/request-demo/req
      対応するメソッド：StringBuffer getRequestURL()：[http://localhost:8080/request-demo/req](http://localhost:8080/request-demo/req)
   6. プロトコルとバージョンを取得する：HTTP/1.1
      対応するメソッド：String getProtocol()
   7. クライアントの IP アドレスを取得する：
      対応するメソッド：String getRemoteAddr()

2. リクエストヘッダー：

   ```
   User-Agent: Mozilla/5.0 Chrome/104.0.0.0
   ```

   1. 名前を指定してリクエストヘッダーの値を取得する
      対応するメソッド：String getHeader(String name)
   2. すべてのリクエストヘッダー名を取得する
      対応するメソッド：Enumeration getHeaderNames()

3. リクエスト本文：

   ```
   username=zhangsan&password=123
   ```

   POST、PUT、PATCH などのリクエストは本文を持てます。本文の形式は Content-Type で指定し、フォームパラメーター、JSON、ファイルでは読み取り方法が異なります。生の本文は文字ストリームまたはバイトストリームで読み取れますが、同じリクエストで両方を混用することはできません。

   リクエスト本文を格納したストリームオブジェクトを取得します。バイトストリームと文字ストリームの 2 種類があります。

   1. 文字データのみを扱う文字入力ストリームを取得する
      BufferedReader getReader()
   2. すべての種類のデータを扱えるバイト入力ストリームを取得する
      ServletInputStream getInputStream()

### リクエストデータの文字化け :id=h-10d0c1df5f06

POST の場合：

```java
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // See note 1 below.
        request.setCharacterEncoding("UTF-8");
      String username = request.getParameter("username");
        System.out.println("Post......"+username);
    }
```

例の説明：

1. setCharacterEncoding を追加する

GET の場合：

まず Tomcat Connector の URIEncoding がページやクライアントの文字コードと一致しているか確認します。正しくデコード済みの文字列を再び ISO-8859-1 から UTF-8 に変換すると、再度文字化けするため避けてください。Tomcat 8 以降の一般的なデフォルト設定では UTF-8 で URI をデコードしますが、実際の Connector と互換モードを確認する必要があります。

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    String username = request.getParameter("username");
    response.setContentType("text/plain;charset=UTF-8");
    response.getWriter().println(username == null ? "" : username);
}
```

request.setCharacterEncoding はフォームパラメーターを読む前に呼ぶ必要があり、主にリクエスト本文のデコードに影響します。レスポンスの文字コードは getWriter より前に設定します。実際のプロジェクトでは文字コード用 Filter で統一的に処理できます。

### Request のリクエスト転送 :id=h-ff22faedeeb8

#### リクエスト転送 :id=h-95f36bf7570e

特徴：

1. ブラウザーのアドレスバーのパスは変わりません。
2. 現在のサーバー内部のリソースにのみ転送できます。
3. 転送は 1 回のリクエスト内で行われ、サーバーへのリクエストは 1 回だけです。

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // See note 1 below.
        request.getRequestDispatcher("demo_page_2").forward(request, response);

    }
```

例の説明：

1. リクエスト転送

#### データの共有 :id=h-383222d10bac

1. void setAttribute(String name,Object obj)：データを保存する
2. Object getAttribute(String name)：キーで値を取得する
3. void removeAttribute(String name)：キーでキーと値の組を削除する
4. ServletContext を取得する：
   ServletContext getServletContext()

```java
@WebServlet("/requestDemo8")
public class RequestDemo1 extends HttpServlet {
            protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
                    System.out.println("demo1被访问了。。。");
                    // See note 1 below.
                    /*
                    RequestDispatcher requestDispatcher = request.getRequestDispatcher("/requestDemo2");
                    requestDispatcher.forward(request,response);
                    */
                    // See note 2 below.
                    request.setAttribute("msg","hello");
            request.getRequestDispatcher("/requestDemo2").forward(request,response);
                    //request.getRequestDispatcher("URL").forward(request,response);
            }

            protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
                    this.doPost(request,response);
            }
}

@WebServlet("/requestDemo2")
public class RequestDemo2 extends HttpServlet {
            protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
                        // See note 3 below.
                        Object msg = request.getAttribute("msg");
                        System.out.println(msg);
                        System.out.println("demo2被访问了。。。");
            }

            protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
                        this.doPost(request,response);
            }
}

```

例の説明：

1. demo2 リソースへ転送する
2. request スコープにデータを保存する
3. データを取得する

<a id="section-4"></a>

## ServletContext :id=h-e013184b6c59

### ServletContext を取得する :id=h-4ba574f26b4b

ServletContext は Web アプリケーションのコンテキストを表します。通常はアプリケーションごとにインスタンスがあり、起動時に作成され、停止や再デプロイ時に破棄されます。サーバー全体で共有する唯一のオブジェクトではありません。変更可能な属性を共有するときは並行処理を考慮してください。

取得方法は 2 通りあり、どちらも同じ結果を返します。

```java
@WebServlet("/requestDemo3")
public class RequestDemo3 extends HttpServlet {
            protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
          // See note 1 below.
                    ServletContext servletContext = request.getServletContext();
          // See note 2 below.
          ServletContext sameContext = this.getServletContext();

                    System.out.println(servletContext);
            }

            protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
                    this.doPost(request,response);
            }
}
```

例の説明：

1. 1. request オブジェクトから取得する
2. 2. HttpServlet から取得する
