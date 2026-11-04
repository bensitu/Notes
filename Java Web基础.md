# Java Web

理解 URL、Servlet 生命周期和请求/响应；开发时查方法与路径匹配。

**学习前提与版本：** 需要 Java 类、接口与基本 HTTP 知识。XML 入门示例使用 javax / Servlet 3.1；后续完整 HTTP 示例使用 jakarta / Servlet 6.0。按小节选择整套依赖和导入包。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[文档目录](README.md) · [官方参考](https://jakarta.ee/specifications/servlet/6.0/)

**内容导航**

- [Tomcat](#section-1)
- [Servlet](#section-2)
- [Request和Response](#section-3)
- [ServletContext](#section-4)


<a id="section-1"></a>

## Tomcat

Tomcat 9 使用 import javax.servlet.http.HttpServlet;

Tomcat 10 使用 import jakarta.servlet.http.HttpServlet;


<a id="section-2"></a>

## Servlet

Servlet——server applet概念：运行在服务器端的小程序

- Servlet 是服务器端处理请求的标准接口，容器负责创建实例并调用生命周期方法；浏览器访问的是 URL，不是直接执行 Java 类。
- 将来我们自定义一个Java类，Servlet 的请求处理由支持 Servlet 的容器调用，例如 Tomcat；不需要通过 main 方法处理每次请求
- 要让服务器能识别这个Java类，就需要实现Servlet接口、并复写接口方法


### Servlet 快速入门

1. 创建JavaEE项目

2. 定义一个类，实现Servlet接口

```java
public abstract class ServletDemo1 implements Servlet {
    // Implement all Servlet methods, or extend HttpServlet as shown below.
}
```

详细代码：

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

示例说明：

1. 提供服务的方法


3. 实现接口中的抽象类方法

4. 配置Servlet

        在web.xml中配置：

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

示例说明：

1. 配置Servlet
2. 说明： 用于注册servlet ；		(1) servlet-name:用于配置servlet的注册名称（可自定义，没有默认值，本例是 demo1）；		(2) servlet-class: 配置servlet的类的全路径
3. 说明： 用于映射一个已经注册的servlet的对外访问路径；		(1) servlet-name:同上，用于关联同一个项目 ；		(2) url-pattern: 用于配置资源的访问路径


5. 浏览器发送请求：

- 在浏览器中输入网址<http://localhost:8080/PROJECT-NAME/demo1> 并按下回车，容器会调用相应的请求处理方法
- 运行成功可在idea的控制台上打印Hello Servlet


### Servlet 3.0 快速入门

Servlet 3.0 开始支持注解配置，3.0版本之前只支持XML文件配置。

1. 创建web项目，导入Servlet依赖坐标

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

2. 编写完整的 HTTP Servlet。以下使用 Tomcat 10.1 的 jakarta 包；Tomcat 9 项目应统一使用 javax 包及相应 API 依赖。

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

3. @WebServlet 配置访问路径，不再重复写同一个 Servlet 的 web.xml 注册。实际开发常继承 HttpServlet，由它实现底层接口方法。

4. 访问：启动Tomcat，浏览器输入URL访问该Servlet

   ```html
   http://localhost:8080/PROJECT-NAME/demo1
   ```


### Servlet 生命周期

1. 初始化 init

   默认情况下，Servlet被访问时调用，只是调用一次

2. 提供服务 service

   每次Servlet被访问时调用，可调用多次

3. 销毁 destroy

   容器卸载应用或正常关闭时会调用；进程被强制终止时不能保证执行

代码：

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

示例说明：

1. 页面路径，初始化时刻
2. 初始化方法 init；默认情况下，Servlet被访问时调用，只是调用一次；在WebServlet里添加 loadOnStartup参数能修改初始化时刻，默认-1为被访问时创建，0 或正整数表示启动时加载，数值越小通常越早加载
3. 添加事件
4. 提供服务 service；每次Servlet被访问时调用，可调用多次
5. 添加事件
6. 销毁方法 destroy；内存释放或者服务器关闭时会调用，调用一次
7. 添加事件


### Servlet 体系结构

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

HttpServlet 例子：


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


### urlPattern 配置

配置规则：4种配置规则（精确匹配、目录匹配、扩展名匹配、任意匹配）

优先级：精确匹配 > 最长路径匹配（包括 /*）> 扩展名匹配 > 默认映射 /。例如 /* 会先于 *.jsp 匹配；/ 只在其他映射未命中时使用。

1. 精确匹配

   ```text
   配置路径：@WebServlet("/user/select")
   访问路径：localhost:8080/java-demo/user/select
   ```

2. 目录匹配

   ```text
   配置路径：@WebServlet("/user/*")
   访问路径：localhost:8080/java-demo/user/aaa
                   localhost:8080/java-demo/user/bbb
   ```

3. 扩展名匹配

   ```text
   配置路径：@WebServlet("*.do")
   访问路径：localhost:8080/java-demo/user/aaa.do
                   localhost:8080/java-demo/user/bbb.do
   ```

4. 任意匹配

   ```text
   配置路径：@WebServlet("/")
                   @WebServlet("/*")
   访问路径：localhost:8080/java-demo/abcdef
                   localhost:8080/java-demo/123456
   ```

   / 与 /* 区别：

   1. 当项目中 Servlet 配置了 “/”，会覆盖掉 Tomcat 中的 DefaultServlet，当其他的url-pattern都匹配不上时才会走这个Servlet

   2. 当项目中 Servlet 配置了 “/*”，意味着匹配任意的访问路径


<a id="section-3"></a>

## Request和Response

### Request继承体系

```
ServletRequest	--- Java提供的请求对象根接口
            |
HttpServletRequest	--- Java提供的对Http协议封装的请求对象接口
            |
RequestFacade		--- Tomcat定义的实现类
```


### Request获取请求数据

请求数据分为3部分：

1. 请求行：

   ```
   GET /request-demo/req?username=zhangsan HTTP/1.1
   ```

   1. 获取请求方式 ：GET
         对应方法：String getMethod()
   2. (*可选配置)获取虚拟目录（项目访问路径）：/request-demo
         对应方法：String getContextPath()
   3. 获取Servlet路径: /req
         对应方法：String getServletPath()
   4. 获取Get方式请求参数：name=zhangsan
         对应方法：String getQueryString()
   5. (*)获取请求URI：/request-demo/req
         对应方法：String getRequestURI():		/request-demo/req
         对应方法：StringBuffer getRequestURL()  :<http://localhost:8080/request-demo/req>
   6. 获取协议及版本：HTTP/1.1
         对应方法：String getProtocol()
   7. 获取客户机的IP地址：
         对应方法：String getRemoteAddr()

2. 请求头：

   ```
   User-Agent: Mozilla/5.0 Chrome/104.0.0.0
   ```

   1. 通过请求头的名称获取请求头的值
      对应方法：String getHeader(String name)
   2. 获取所有的请求头名称
      对应方法：Enumeration getHeaderNames()

3. 请求体：

   ```
   username=zhangsan&password=123
   ```

   POST、PUT、PATCH 等请求都可以携带请求体。正文格式由 Content-Type 指定：表单参数、JSON 和文件不是同一种读取方式。原始正文可通过字符流或字节流读取，两种流不能在同一次请求中混用。

   获取流对象（请求体被封装在流对象中），有两种流对象 —— 字节流和字符流

   1. 获取字符输入流，只能操作字符数据
      BufferedReader getReader()
   2. 获取字节输入流，可以操作所有类型数据																		   ServletInputStream getInputStream()


### Request请求数据乱码

POST 方式：

```java
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // See note 1 below.
        request.setCharacterEncoding("UTF-8");
      String username = request.getParameter("username");
        System.out.println("Post......"+username);
    }
```

示例说明：

1. 添加 setCharacterEncoding


GET 方式：

先确认 Tomcat Connector 的 URIEncoding 与网页、客户端的编码一致。不要把已经正确解码的字符串再次按 ISO-8859-1 转成 UTF-8，否则会造成二次乱码。Tomcat 8+ 常见默认配置采用 UTF-8 解码 URI，但仍要核对实际 Connector 和兼容模式。

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    String username = request.getParameter("username");
    response.setContentType("text/plain;charset=UTF-8");
    response.getWriter().println(username == null ? "" : username);
}
```

request.setCharacterEncoding 必须在读取表单参数之前调用，主要影响请求体解码。响应编码在 getWriter 之前设置。实际项目可以用编码 Filter 统一处理。

### Request请求转发

#### 请求转发

特点：

1. 浏览器地址栏路径不发生变化
2. 只能转发到当前服务器内部资源中
3. 转发是一次请求（只对服务器做一次请求）

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // See note 1 below.
        request.getRequestDispatcher("demo_page_2").forward(request, response);

    }
```

示例说明：

1. 请求转发


#### 数据共享

1. void setAttribute(String name,Object obj):存储数据
2. Object getAttribute(String name):通过键获取值
3. void removeAttribute(String name):通过键移除键值对
1. 获取ServletContext：
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

示例说明：

1. 转发到demo2资源
2. 存储数据到request域中
3. 获取数据


<a id="section-4"></a>

## ServletContext

### 获取ServletContext

ServletContext 表示一个 Web 应用的上下文。每个应用通常有自己的实例，应用启动时创建、停止或重新部署时销毁；它不是整个服务器共享的唯一对象。共享可变属性时需考虑并发。

有2种获取方法，取得的结果一样。

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

示例说明：

1. 1. 通过request对象获取
2. 2. 通过HttpServlet获取
