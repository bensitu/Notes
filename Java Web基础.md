# Java Web

## Tomcat

Tomcat 9 使用 import javax.servlet.http.HttpServlet;

Tomcat 10 使用 import jakarta.servlet.http.HttpServlet;





## Servlet

Servlet——server applet概念：运行在服务器端的小程序

- Servlet就是一个接口，定义了Java类被浏览器访问(tomcat识别)到的规则
- 将来我们自定义一个Java类，这个Java类没有主方法，要依赖于Tomcat服务器才能运行
- 要让服务器能识别这个Java类，就需要实现Servlet接口、并复写接口方法
  

### Servlet 快速入门

1. 创建JavaEE项目

2. 定义一个类，实现Servlet接口

```java
public class ServletDemo1 implements Servlet
```

详细代码：

```java
package com.xxx.xxx;

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
			//提供服务的方法
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

3. 实现接口中的抽象类方法

4. 配置Servlet

​		在web.xml中配置：

```xml
<?xml version="1.0" encoding="UTF-8"?> 
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd" version="3.1">

<!--配置Servlet -->         
	<servlet>             
			<servlet-name>demo1</servlet-name>             
			<servlet-class>cn.itcast.web.servlet.ServletDemo1</servlet-class>     
	</servlet> 
		<!--说明： 用于注册servlet 
		(1) servlet-name:用于配置servlet的注册名称（可自定义，默认使用项目名）
		(2) selvlet-class: 配置servlet的类的全路径 --> 
  
	<servlet-mapping>
			<servlet-name>demo1</servlet-name>
			<url-pattern>/demo1</url-pattern>
	</servlet-mapping>
		<!-- 说明： 用于映射一个已经注册的servlet的对外访问路径
		(1) servlet-name:同上，用于关联同一个项目 
		(2) url-pattern: 用于配置资源的访问路径 --> 
  
</web-app>
```




5. 用浏览器执行Java类：

- 在浏览器中输入网址localhost:8080/dome1 并按下回车即可运行上述Java类
- 运行成功可在idea的控制台上打印Hello Servlet



### Servlet 3.0 快速入门

Servlet 3.0 开始支持注解配置，3.0版本之前只支持XML文件配置。

1. 创建web项目，导入Servlet依赖坐标

   **Tomcat 10:**

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

2. 创建：定义一个类，实现Servlet接口，并重写接口中所有方法，并在service方法中写入一句话

   ```java
   public class ServletDemo1 implements Servlet {
   		public void service(){}
   }
   ```

3. 配置：在类上使用 @WebServlet注解，配置Servlet的访问路径

   ```java
   @WebServlet("/demo1")
   public class ServletDemo1 implements Servlet {
     
   }
   ```

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

   内存释放或者服务器关闭时会调用，调用一次

代码：

```java
import java.io.IOException;
import jakarta.servlet.Servlet;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns="/index", loadOnStartup=-1) //页面路径，初始化时刻
public class ServletLifeCycle implements Servlet {

	/**
	 * 初始化方法 init
	 * 默认情况下，Servlet被访问时调用，只是调用一次
	 * 在WebServlet里添加 loadOnStartup参数能修改初始化时刻，默认-1为被访问时创建，正数数字越小优先级越高
	 */
	@Override
	public void init(ServletConfig config) throws ServletException {
		// 添加事件
		System.out.println("我被初始化了......");	
	}
	
	/**
	 * 提供服务 service
	 * 每次Servlet被访问时调用，可调用多次
	 */
	@Override
	public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
		// 添加事件
		System.out.println("我提供服务了......");
	}
	
	/**
	 * 销毁方法 destroy
	 * 内存释放或者服务器关闭时会调用，调用一次
	 * 
	 */
	@Override
	public void destroy() {
		// 添加事件
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

优先度：精确匹配 > 目录匹配 > 扩展名匹配 > /* > /

1. 精确匹配

   ```java
   配置路径：@WebServlet("/user/select")
   访问路径：localhost:8080/java-demo/user/select
   ```

2. 目录匹配

   ```java
   配置路径：@WebServlet("/user/*")
   访问路径：localhost:8080/java-demo/user/aaa
   				localhost:8080/java-demo/user/bbb
   ```

3. 扩展名匹配

   ```java
   配置路径：@WebServlet("*.do")
   访问路径：localhost:8080/java-demo/user/aaa.do
   				localhost:8080/java-demo/user/bbb.do
   ```

4. 任意匹配

   ```java
   配置路径：@WebServlet("/")
   				@WebServlet("/*")
   访问路径：localhost:8080/java-demo/abcdef
   				localhost:8080/java-demo/123456
   ```

   / 与 /* 区别：

   1. 当项目中 Servlet 配置了 “/”，会覆盖掉 Tomcat 中的 DefaultServlet，当其他的url-pattern都匹配不上时才会走这个Servlet

   2. 当项目中 Servlet 配置了 “/*”，意味着匹配任意的访问路径



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
         对应方法：StringBuffer getRequestURL()  :http://localhost:8080/request-demo/req
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

   只有POST请求方式，才有请求体，在请求体中封装了POST请求的请求参数。先获取流对象，再从流对象中拿数据。

   获取流对象（请求体被封装在流对象中），有两种流对象 —— 字节流和字符流

   1. 获取字符输入流，只能操作字符数据
      BufferedReader getReader()
   2. 获取字节输入流，可以操作所有类型数据																		   ServletInputStream getInputStream()





### Request请求数据乱码

POST 方式：

```java
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// 添加 setCharacterEncoding
		request.setCharacterEncoding("UTF-8");
  	String username = request.getParameter("username");
		System.out.println("Post......"+username);
	}
```

GET方式：

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// 从ISO8859_1转换成二进制编码传输再转换回UTF-8
		username = new String(username.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF-8);
		System.out.println("Get......");
	}
```

> Tomcat 8 已经将get方式乱码问题解决了，默认使用UTF-8请求数据



### Request请求转发

#### 请求转发

特点：

1. 浏览器地址栏路径不发生变化
2. 只能转发到当前服务器内部资源中
3. 转发是一次请求（只对服务器做一次请求）

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// 请求转发
		request.getRequestDispatcher("demo_page_2").forward(request, response);
		
	}
```



#### 数据共享

1. void setAttribute(String name,Object obj):存储数据
2. Object getAttitude(String name):通过键获取值
3. void removeAttribute(String name):通过键移除键值对
1. 获取ServletContext：
											ServletContext getServletContext()

```java
@WebServlet("/requestDemo8")
public class RequestDemo1 extends HttpServlet {
			protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
					System.out.println("demo1被访问了。。。");
					//转发到demo2资源
					/*
					RequestDispatcher requestDispatcher = request.getRequestDispatcher("/requestDemo2");
					requestDispatcher.forward(request,response);
					*/
					//存储数据到request域中
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
						//获取数据
						Object msg = request.getAttribute("msg");
						System.out.println(msg);
						System.out.println("demo2被访问了。。。");
			}
  
			protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
						this.doPost(request,response);
			}
}

```



## ServletContext

### 获取ServletContext

ServletContext是一个全局的储存信息的空间，服务器开始就存在，服务器关闭才释放。

有2种获取方法，取得的结果一样。

```java
@WebServlet("/requestDemo3")
public class RequestDemo3 extends HttpServlet {
			protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
          //1. 通过request对象获取
					ServletContext servletContext = request.getServletContext();
          //2. 通过HttpServlet获取
          ServletContect servletContect = this.getServletContect();
          
					System.out.println(servletContext);
			}
  
			protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
					this.doPost(request,response);
			}
}
```


