# Java Web :id=h-fbc9ab6d401b

Understand URLs, the Servlet lifecycle, and requests/responses; look up methods and path matching during development.

**Prerequisites and versions:** Knowledge of Java classes, interfaces, and basic HTTP is required. The introductory XML example uses javax / Servlet 3.1; the later complete HTTP example uses jakarta / Servlet 6.0. Use a consistent set of dependencies and imports for each section.

**Using the examples:** Unless a project explicitly lists all files and run instructions, code blocks are independent snippets for each section. Fill in ellipses and placeholder names; lines marked as incorrect illustrate problems. Do not combine alternative implementations from the same section.

[Documentation index](README.md) · [Official references](https://jakarta.ee/specifications/servlet/6.0/)

**On this page**

- [Tomcat](#section-1)
- [Servlet](#section-2)
- [Request and Response](#section-3)
- [ServletContext](#section-4)

<a id="section-1"></a>

## Tomcat :id=h-3ae04b48076b

Tomcat 9 uses import javax.servlet.http.HttpServlet;

Tomcat 10 uses import jakarta.servlet.http.HttpServlet;

<a id="section-2"></a>

## Servlet :id=h-4eb2d2b67ebd

Servlet—server applet: a small program running on the server

- Servlet is a standard interface for handling requests on the server. The container creates instances and calls lifecycle methods. A browser accesses a URL rather than executing a Java class directly.
- We will define a custom Java class. A Servlet-capable container such as Tomcat invokes its request handling; a main method is not needed for each request.
- To let the server recognize this Java class, implement the Servlet interface and override its methods.

### Servlet quick start :id=h-d6b68b572905

1. Create a Java EE project

2. Define a class implementing the Servlet interface

```java
public abstract class ServletDemo1 implements Servlet {
    // Implement all Servlet methods, or extend HttpServlet as shown below.
}
```

Full code:

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

Example explanations:

1. Method that provides the service

2. Implement the abstract methods in the interface

3. Configure the Servlet

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

Example explanations:

1. Configure the Servlet

2. Explanation: registers the servlet. (1) servlet-name: sets the servlet's registration name (customizable, with no default; demo1 in this example). (2) servlet-class: specifies the servlet class's fully qualified name.

3. Explanation: maps an external access path to an already registered servlet. (1) servlet-name: as above, links the same servlet registration. (2) url-pattern: sets the resource's access path.

4. Send a request from the browser:

- Enter [http://localhost:8080/PROJECT-NAME/demo1](http://localhost:8080/PROJECT-NAME/demo1) in the browser and press Enter. The container calls the corresponding request-handling method.
- If successful, Hello Servlet is printed in the IDEA console.

### Servlet 3.0 quick start :id=h-2a7f50b74af9

Servlet 3.0 introduced annotation-based configuration. Before 3.0, only XML configuration was supported.

1. Create a web project and add the Servlet dependency coordinates

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

2. Write a complete HTTP Servlet. The following uses the jakarta packages for Tomcat 10.1. A Tomcat 9 project must consistently use javax packages and the corresponding API dependency.

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

3. @WebServlet configures the access path; do not duplicate the same Servlet registration in web.xml. In practice, applications commonly extend HttpServlet, which implements the underlying interface methods.

4. Access: start Tomcat and enter the URL in the browser to access the Servlet.

   ```html
   http://localhost:8080/PROJECT-NAME/demo1
   ```

### Servlet lifecycle :id=h-bb802d6f0247

1. Initialization: init

   By default, called once when the Servlet is first accessed

2. Providing the service: service

   Called whenever the Servlet is accessed; can run many times

3. Destruction: destroy

   Called when the container unloads the application or shuts down normally; not guaranteed if the process is forcibly terminated

Code:

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

Example explanations:

1. Page path and initialization timing
2. Initialization method init: by default, called only once when the Servlet is first accessed. Add the loadOnStartup parameter to WebServlet to change initialization timing. The default -1 creates it on access; 0 or a positive integer loads it at startup, with smaller values generally loaded earlier.
3. Add event handling
4. Service method service: called whenever the Servlet is accessed; can run many times
5. Add event handling
6. Destruction method destroy: called once when memory is released or the server shuts down
7. Add event handling

### Servlet class hierarchy :id=h-3880c81ef225

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

HttpServlet example:

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

### urlPattern configuration :id=h-b28017341e0b

Four mapping rules: exact matching, directory matching, extension matching, and catch-all matching

Precedence: exact match > longest path match (including /*) > extension match > default mapping /. For example, /* matches before \*.jsp; / is used only if no other mapping matches.

1. Exact matching

   ```text
   配置路径：@WebServlet("/user/select")
   访问路径：localhost:8080/java-demo/user/select
   ```

2. Directory matching

   ```text
   配置路径：@WebServlet("/user/*")
   访问路径：localhost:8080/java-demo/user/aaa
                   localhost:8080/java-demo/user/bbb
   ```

3. Extension matching

   ```text
   配置路径：@WebServlet("*.do")
   访问路径：localhost:8080/java-demo/user/aaa.do
                   localhost:8080/java-demo/user/bbb.do
   ```

4. Catch-all matching

   ```text
   配置路径：@WebServlet("/")
                   @WebServlet("/*")
   访问路径：localhost:8080/java-demo/abcdef
                   localhost:8080/java-demo/123456
   ```

   Difference between / and /\*:

   1. Mapping a project Servlet to / overrides Tomcat's DefaultServlet. This Servlet is used only when no other url-pattern matches.

   2. Mapping a project Servlet to /\* means it matches every access path.

<a id="section-3"></a>

## Request and Response :id=h-0987ca8d7bde

### Request inheritance hierarchy :id=h-4837ba755d9a

```
ServletRequest	--- Java提供的请求对象根接口
            |
HttpServletRequest	--- Java提供的对Http协议封装的请求对象接口
            |
RequestFacade		--- Tomcat定义的实现类
```

### Getting request data with Request :id=h-57d116c77f58

Request data has three parts:

1. Request line:

   ```
   GET /request-demo/req?username=zhangsan HTTP/1.1
   ```

   1. Get the request method: GET
      Method: String getMethod()
   2. (\* Optional configuration) Get the virtual directory (application access path): /request-demo
      Method: String getContextPath()
   3. Get the Servlet path: /req
      Method: String getServletPath()
   4. Get GET request parameters: name=zhangsan
      Method: String getQueryString()
   5. (\*) Get the request URI: /request-demo/req
      Method: String getRequestURI(): /request-demo/req
      Method: StringBuffer getRequestURL(): [http://localhost:8080/request-demo/req](http://localhost:8080/request-demo/req)
   6. Get the protocol and version: HTTP/1.1
      Method: String getProtocol()
   7. Get the client's IP address:
      Method: String getRemoteAddr()

2. Request headers:

   ```
   User-Agent: Mozilla/5.0 Chrome/104.0.0.0
   ```

   1. Get a request header's value by its name
      Method: String getHeader(String name)
   2. Get all request header names
      Method: Enumeration getHeaderNames()

3. Request body:

   ```
   username=zhangsan&password=123
   ```

   Requests such as POST, PUT, and PATCH can carry bodies. Content-Type specifies the format: form parameters, JSON, and files require different reading methods. Read a raw body with a character stream or byte stream; do not mix both streams in the same request.

   Get a stream object containing the request body. Two kinds are available: byte streams and character streams.

   1. Get a character input stream, which handles character data only
      BufferedReader getReader()
   2. Get a byte input stream, which handles all data types
      ServletInputStream getInputStream()

### Garbled request data :id=h-10d0c1df5f06

POST requests:

```java
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // See note 1 below.
        request.setCharacterEncoding("UTF-8");
      String username = request.getParameter("username");
        System.out.println("Post......"+username);
    }
```

Example explanations:

1. Add setCharacterEncoding

GET requests:

First confirm that the Tomcat Connector's URIEncoding matches the page and client encoding. Do not re-convert correctly decoded strings from ISO-8859-1 to UTF-8, or you will corrupt them again. Common Tomcat 8+ defaults decode URIs as UTF-8, but verify the actual Connector and compatibility mode.

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    String username = request.getParameter("username");
    response.setContentType("text/plain;charset=UTF-8");
    response.getWriter().println(username == null ? "" : username);
}
```

Call request.setCharacterEncoding before reading form parameters; it mainly affects request body decoding. Set the response encoding before getWriter. Real projects can handle this consistently with an encoding Filter.

### Request forwarding :id=h-ff22faedeeb8

#### Request forwarding :id=h-95f36bf7570e

Characteristics:

1. The path in the browser address bar does not change
2. Can forward only to resources within the current server
3. Forwarding uses a single request: only one request is sent to the server

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // See note 1 below.
        request.getRequestDispatcher("demo_page_2").forward(request, response);

    }
```

Example explanations:

1. Request forwarding

#### Sharing data :id=h-383222d10bac

1. void setAttribute(String name,Object obj): store data
2. Object getAttribute(String name): get a value by key
3. void removeAttribute(String name): remove a key-value pair by key
4. Get the ServletContext:
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

Example explanations:

1. Forward to the demo2 resource
2. Store data in request scope
3. Get data

<a id="section-4"></a>

## ServletContext :id=h-e013184b6c59

### Get the ServletContext :id=h-4ba574f26b4b

ServletContext represents a web application's context. Each application normally has its own instance, created at startup and destroyed on shutdown or redeployment; it is not one unique object shared by the entire server. Consider concurrency when sharing mutable attributes.

There are two ways to obtain it, both returning the same result.

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

Example explanations:

1. 1. Obtain it through the request object
2. 2. Obtain it through HttpServlet
