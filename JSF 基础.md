# JavaServer Faces 基本概念

理解组件树、六阶段生命周期和 Bean 作用域，避免提交后数据未更新。

**学习前提与版本：** 需要 JavaBean 与 HTML 基础。本篇是 JSF 2.x 的 javax 示例，用于学习及旧项目维护；Faces 4 的整合方式见 Springboot+JSF+Mybatis.md。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[学习索引与常见词](README.md) · [官方参考](https://javaee.github.io/javaserverfaces/docs/2.3/vdldocs/facelets/)

**内容导航**

- [一、JSF 生命周期](#section-1)
- [二、JSF 托管 Bean](#section-2)
- [JSF 用户界面组件](#section-3)
- [JSF UI 组件示例](#section-4)
- [JSF Web 资源](#section-5)
- [访问图片文件](#section-6)
- [访问 CSS 文件](#section-7)
- [访问 JavaScript 文件](#section-8)


**JSF(JavaServer Faces)** 它是一个基于服务器端组件的用户界面框架。 它用于开发 Web 应用程序。 它提供了一个定义良好的编程模型，由丰富的 API 和标签库组成。本文讲解 JSF 2.x，使用 Facelets 作为默认视图技术。JSF 后来更名为 Jakarta Faces；这里的 javax 示例不能直接当作 Faces 3/4 的代码。 它是用 Java 编写的。

JSF API 提供组件(`inputText`，`commandButton`等)并帮助管理其状态。 它还提供服务器端验证，数据转换，定义页面导航，提供可扩展性，国际化支持，可访问性等。

JSF 标签库用于在 Web 页面上添加组件，并将组件与服务器上的对象进行连接。 它还包含实现组件标签的标签处理程序。

借助这些功能和工具，您可以更清晰地创建服务器端用户界面。


**Facelets 技术**

Facelets是一个开源Web模板系统。它是JavaServer Faces(JSF)的默认视图处理程序技术。 该语言需要有效的输入XML文档才能正常工作。 Facelets支持所有的JSF UI组件，并且完全侧重于构建JSF应用程序的视图。


**AJAX支持**

JSF提供内置的AJAX支持。 因此，您可以将应用程序请求提交到服务器端，而无需刷新网页。 JSF还支持使用AJAX进行部分渲染。


<a id="section-1"></a>

## 一、JSF 生命周期

生命周期是一次 Faces 请求从进入服务器到生成响应的处理顺序。页面由组件树表示，例如表单中有输入框和按钮。组件树是服务器端的对象结构，不等于浏览器中的 DOM。

普通回发（提交同一 Faces 表单）通常经过以下六个阶段。首次打开页面通常主要经过“恢复视图”和“渲染响应”，不会按提交表单的流程验证输入。

| 阶段 | 做什么 | 入门时需要记住的细节 |
| --- | --- | --- |
| 1. 恢复视图 Restore View | 创建新视图，或根据保存的状态恢复原视图 | FacesContext 对应本次请求；并不是一直保存着上一次请求的同一个上下文对象 |
| 2. 应用请求值 Apply Request Values | 从请求参数读取提交值，存到组件中 | 此时读到的通常仍是字符串，不代表已经写入 Bean |
| 3. 处理验证 Process Validations | 转换数据类型并验证输入 | 转换或验证失败时显示消息，通常跳过模型更新和业务方法 |
| 4. 更新模型值 Update Model Values | 将有效的组件值写入 Bean 属性 | 需要可写属性，例如对应的 setter |
| 5. 调用应用 Invoke Application | 执行按钮等组件的 action 方法，处理导航 | 业务方法在输入通过转换和验证后执行 |
| 6. 渲染响应 Render Response | 根据组件树生成 HTML 或局部更新响应，并保存视图状态 | 页面用 h:message / h:messages 显示消息 |

“执行阶段”是前五个阶段的总称；“渲染阶段”是第六个阶段，不能把渲染响应同时列为两个不同的处理阶段。

### 提前结束与局部请求

- 调用 `FacesContext.getCurrentInstance().renderResponse()`，会在当前阶段完成后跳到渲染响应。它并不是“跳过渲染”。
- 调用 `responseComplete()`，表示响应已经由应用处理，例如完成重定向；Faces 不再继续生成通常的页面响应。
- 输入组件设置 `immediate="true"` 时，会把其转换和验证提前到应用请求值阶段；命令组件的 immediate 会使 action 事件提前处理。两者作用不能混为一谈，也不能用 immediate 绕过业务校验。
- Ajax 的 execute 指定参与处理的组件，render 指定要更新的组件。没有参与 execute 的输入，不能假定已更新到 Bean。

视图渲染不会重新编译整个 Java 应用，也不代表所有 Bean 都立即销毁。Bean 的存活时间由作用域决定；视图状态由 Faces 按配置保存在客户端或服务器端。敏感数据不应放进页面输出或依赖客户端状态保密。

<a id="section-2"></a>

## 二、JSF 托管 Bean

托管 bean 它是一个纯 Java 类，它包含一组属性和一组`getter`，`setter`方法。

以下是托管 bean 方法执行的常见功能：

- 验证组件的数据
- 处理组件触发的事件
- 执行处理以确定应用程序必须导航的下一页
- 它也可以作为JSF 框架的模型。


**JSF 托管 Bean 示例**

请看看下面一段示例代码 -

```java
public class User {
    private String name;
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
```

您可以通过以下方式使用此`bean`。

- 通过配置成XML文件。
- 通过使用注释。


### 1. 通过 XML 文件配置托管 Bean

以下代码显示如何使用JSF管理的bean进行注册:

```xml
<managed-bean>
    <managed-bean-name>user</managed-bean-name>
    <managed-bean-class>User</managed-bean-class>
    <managed-bean-scope>session</managed-bean-scope>
</managed-bean>
<managed-bean>
  <managed-bean-name>message</managed-bean-name>
  <managed-bean-class>com.yiibai.test.Message</managed-bean-class>
  <managed-bean-scope>request</managed-bean-scope>
</managed-bean>
```

在 xml 文件配置`bean`是比较旧方法。 在这种方法中，我们必须创建一个名为`faces-config.xml`的 xml 文件，JSF 提供了配置`bean`的标签。

在上面的例子中，我们列出了`bean-name`，`bean-class`和`bean-scope`。 所以，它可以在项目中访问。


### 2. 使用注释配置托管 Bean

以下代码显示了如何使用注解来注册 JSF 托管的 bean:

```java
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import javax.faces.bean.RequestScoped;
import java.io.Serializable;

@ManagedBean(name = "user")  // Using ManagedBean annotation
@RequestScoped                             // Using Scope annotation
public class User implements Serializable {
      private static final long serialVersionUID = 1L;

    private String name;
    public String getName() {
        return name;
    }
    public void setName(String name) {
         this.name = name;
    }

      @ManagedProperty(value="#{message}")   // Uing another bean
       private Message message;

      public void setMessage(Message message) {
    this.message = message;
  }
}
```

@ManagedBean 注册 JSF 管理的 Bean。未指定 name 时，通常将简单类名的首字母改为小写，例如 User 对应 user。eager=true 仅在 ApplicationScoped 下表示启动时创建；请求、会话等其他作用域仍按需要创建。

上面的 Message 是示例依赖，需要自行定义并注册名为 message 的 Bean，且其作用域不能短于注入目标。setMessage 的名称必须与 message 属性对应。JSF 2.3 已推荐 CDI，Faces 4 移除了旧式 ManagedBean；维护旧项目时才使用这组 javax.faces.bean 注解。


这是应用程序配置资源文件方法的替代方法，并减少配置托管 bean 的任务。

`@RequestScoped` 注释用于提供托管的范围。 您可以使用注解来定义 bean 将被存储的范围。如果未指定范围，则 bean 将默认为请求范围(RequestScoped)。

您可以对 bean 类使用以下范围：

- **应用程序([@ApplicationScoped])**：应用程序范围在所有用户中生存，它在第一个 HTTP 请求或 Web 应用程序启动时创建，并且在`@ManagedBean`中设置属性`eager = true`，并在 Web 应用程序关闭时被销毁。
- **会话([@SessionScoped])**：会话范围在 Web 应用程序中的多个 HTTP 请求中存在。它在第一个 HTTP 请求时创建，并在 HTTP 会话无效时被销毁。
- **视图([@ViewScoped])**：在用户与 Web 应用程序的单个页面(视图)进行交互时创建，并在用户导航到其他视图时被销毁。
- **请求([@RequestScoped])**：在 Web 应用程序中的根据 HTTP 请求创建，并在与 HTTP 请求相关联的 HTTP 响应完成时被销毁。
- **无([@NoneScoped])**：表示未为应用程序定义作用域。在EL求值评估时创建，并在EL求值评估后被销毁。
- **自定义([@CustomScoped]**：用户定义的非标准作用域。 其值必须配置为 `java.util.Map`，自定义范围很少使用。


**@ManagedProperty注释**

JSF 是一个简单的静态依赖注入(DI)框架。 @ManagedProperty 注释标记被托管的 bean 的属性以注入另一个受托管的 Bean。


### 3. 急切管理 Bean

托管`bean`默认是懒惰的。 这意味着，只有在从应用程序发出请求时才会去实例化 bean。

如果想自动提前强制将`bean`实例化，那么可在应用程序启动时，可以强制将`bean`实例化并放置在应用程序(`@ApplicationScoped`)范围内。您需要将托管 bean 的`eager`属性设置为`true`，如以下示例所示：

```java
@ManagedBean(eager=true)
```


<a id="section-3"></a>

# JSF 用户界面组件

JSF HTML标签库表示HTML表单组件和其他基本HTML元素，用于显示或接受来自用户的数据。 JSF表单在提交表单后将此数据发送到服务器。

为了使用这些标签，我们需要在html节点中使用以下URI的命名空间。

```html
<html
   xmlns="http://www.w3.org/1999/xhtml"
   xmlns:h="http://java.sun.com/jsf/html"
>
```

下表中列出了包含用户界面组件。

| 标签                      | 功能                                                 | 呈现为                                                       | 外观                                     |
| ------------------------- | ---------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| `h:inputText`             | 显示用户输入字符串的输入框                           | HTML的`<input type="text">`元素                              | 一个输入字段域                           |
| `h:outputText`            | 显示一行文本                                         | 纯文本                                                       | 纯文本                                   |
| `h:form`                  | 代表一个输入表单                                     | HTML `<form>`元素标签                                        | 无外观                                   |
| `h:commandButton`         | 它向应用程序提交表单                                 | HTML `<input type="submit">`元素，类型值可以为“`submit`”，“`reset`”或“`image`” |                                          |
| `h:inputSecret`           | 它允许用户输入字符串，但不会在字段中显示实际的字符串 | HTML `<input type="password">`元素                           | 显示一行字符而不是输入的实际字符串的字段 |
| `h:inputTextarea`         | 它允许用户输入多行字符串                             | HTML `<textarea>`元素标签                                    | 多行字段                                 |
| `h:commandLink`           | 它提交当前 Faces 表单并触发 action，外观通常是链接                         | HTML `<a href="">`元素标签                                   | 一个链接                                 |
| `h:inputHidden`           | 它允许页面写入包含一个隐藏的变量和值                 | HTML `<input type="hidden">`元素                             | 无外观                                   |
| `h:inputFile`             | 它允许用户上传文件                                   | HTML `<input type="file">`元素标签                           | 具有浏览按钮的字段                       |
| `h:graphicImage`          | 它显示一个图像                                       | HTML `<img>`元素标签                                         | 一个图像                                 |
| `h:dataTable`             | 它按集合中的数据渲染表格                                     | HTML `<table>`元素标签                                       | 可以动态更新的表                         |
| `h:message`               | 它显示本地化的消息                                   | HTML `<span>`标签，如果使用样式                              | 一个文本字符串                           |
| `h:messages`              | 它显示本地化的消息                                   | 一组HTML `<span>`标签，如果使用样式                          | 一个文本字符串                           |
| `h:outputFormat`          | 它显示格式化的消息                                   | 纯文本                                                       | 纯文本                                   |
| `h:outputLabel`           | 它将嵌套组件显示为指定输入字段的标签                 | HTML `<label>`元素                                           | 纯文本                                   |
| `h:outputLink`            | 它链接到页面上的另一个页面或位置，但不生成操作事件。 | HTML `<a>`元素                                               | 一个链接                                 |
| `h:panelGrid`             | 它在一个父项下分组一组组件                           | HTML `<table>` 元素                                | 在一个表中的一行                         |
| `h:selectBooleanCheckbox` | 它允许用户更改布尔值的值                             | HTML `<input type="checkbox">` 元素                          | 一个复选框                               |
| `h:selectManyCheckbox`    | 它显示一组复选框，用户可以从中选择多个值。           | 一组HTML `<input>`类型复选框的元素                           | 一组复选框                               |
| `h:selectManyListbox`     | 它允许用户从一组全部显示的项目中选择多个项目。       | HTML `<select>`元素                                          | 选择框                                   |
| `h:selectManyMenu`        | 它允许用户从一组项目中选择多个项目                   | HTML `<select>`元素                                          | 菜单                                     |
| `h:selectOneListbox`      | 它允许用户从一组全部显示的项目中选择一个项目         | HTML `<select>`元素                                          | 选择框                                   |
| `h:selectOneMenu`         | 它允许用户从一组项目中选择一个项目                   | HTML `<select>`元素                                          | 菜单                                     |
| `h:selectOneRadio`        | 它允许用户从一组项目中选择一个项目                   | HTML `<input type="radio">`元素                              | 一组选项                                 |
| `h:column`                | 它表示数据组件中的一列数据                           | HTML表中的一列数据                                           | 表中的列                                 |


<a id="section-4"></a>

## JSF UI 组件示例

1. 创建用户注册表

Index.xhtml

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="http://xmlns.jcp.org/jsf/html"
      xmlns:f="http://xmlns.jcp.org/jsf/core">
    <h:head>
        <title>用户注册表单</title>
    </h:head>
    <h:body>
        <h:form id="form">
            <table>
                <tr>
                    <td><h:outputLabel for="name-id">用户名：</h:outputLabel></td>
                    <td><h:inputText id="name-id" value="#{user.name}"/></td>
                </tr>
                <tr>
                    <td><h:outputLabel for="email-id">Email：</h:outputLabel></td>
                    <td><h:inputText id="email-id" value="#{user.email}"/></td>
                </tr>
                <tr>
                    <td><h:outputLabel for="password-id">密码：</h:outputLabel></td>
                    <td><h:inputSecret id="password-id" value="#{user.password}"/></td>
                </tr>

                <tr>
                    <td><h:outputLabel for="gender">性别：</h:outputLabel></td>
                    <td><h:selectOneRadio id="gender" value="#{user.gender}">
                            <f:selectItem itemValue="男" itemLabel="男" />
                            <f:selectItem itemValue="女" itemLabel="女" />
                        </h:selectOneRadio></td>
                </tr>
                <tr><td><h:outputLabel for="address">地址：</h:outputLabel></td>
                    <td><h:inputTextarea id="address" value="#{user.address}" cols="50" rows="5"/></td></tr>
            </table>
            <h:commandButton value="提交" action="response.xhtml"></h:commandButton>
        </h:form>
    </h:body>
</html>
```


2. 创建托管Bean

User.java

```java
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;

@ManagedBean(name = "user")
@RequestScoped
public class User {
    private String name;
    private String email;
    private String password;
    private String gender;
    private String address;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
```


本例只演示表单绑定与同一次请求内的页面导航，不会把用户写入数据库，也不是完整注册功能。不要在页面回显密码；真正注册需要服务端校验和专门的密码哈希存储。这里没有使用重定向，因此请求作用域的属性在响应页面仍可读取。

3. 创建输出页面

Response.xhtml

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="http://xmlns.jcp.org/jsf/html"
      xmlns:f="http://xmlns.jcp.org/jsf/core">
    <h:head>
        <title>User Details</title>
    </h:head>
    <h:body>
        <h2><h:outputText value="您好, #{user.name}"/></h2>
        <h4><h:outputText value="You have Registered with us Successfully, Your Details are The Following."/></h4>
        <table>
            <tr>
                <td><b>Email: </b></td>
                <td><h:outputText value="#{user.email}"/><br/></td>
            </tr>
            <tr>
                <td><b>性别</b></td>
                <td><h:outputText value="#{user.gender}"/><br/></td>
            </tr>
            <tr>
                <td><b>地址 </b></td>
                <td><h:outputText value="#{user.address}"/></td>
            </tr>
        </table>
    </h:body>
</html>
```


<a id="section-5"></a>

# JSF Web 资源

JSF Web 资源是在 Web 应用程序中正确呈现所需的资源。它包括图像，脚本(JS)文件和任何用户创建的组件库。

JSF 提供了一种存储 Web 资源的标准方式。 您可以使用以下任何一种来存储资源。

- 它必须存储在 Web 应用程序根目录资源目录的子目录中：`resources/resource-identifier`，如：`resources/js`,`resources/css`等等。
- 打包在Web应用程序的类路径中的资源必须位于Web应用程序中的`META-INF/resources`目录的子目录中：`META-INF/resources/resource-identifier`。 您可以使用此文件结构在 Web 应用程序中捆绑的 JAR 文件中打包资源。

JSF(JavaServer Faces) 运行时将以该顺序查找前面列出的目录位置中的资源。

我们的应用程序结构如下所示。

```
root:project
|--.gitignore
|--.iml
|--pom.xml
|--README.md
|--doc:文档
|   |--images
|   |--tutorial:整理文档
|--src:源文件
|   |--main
|   |    |--java:源文件
|   |    |   |--web:业务逻辑
|   |    |   |--ejb:数据库操作
|   |    |   |--entity:实体
|   |    |--resources:资源文件
|   |    |   |--META-INF
|   |    |   |   |--beans.xml
|   |    |   |   |--persistence.xml:数据库配置
|   |    |--webapp:web应用
|   |    |   |--resources
|   |    |   |   |--images:图片
|   |    |   |   |--css
|   |    |   |   |--js
|   |    |   |--WEB-INF
|   |    |   |   |--web.xml:web应用配置
|   |    |   |   |--faces-config.xml:JSF配置
|   |    |   |--index.xhtml
|   |--test.ejb.test:测试文件
|--target:目标文件
```


<a id="section-6"></a>

## 访问图片文件

JSF提供`<h:graphicImage />`标签来访问Web应用程序中的图片文件。 在以下示例中，首先我们创建了一个名为`images`的资源和子文件夹。 创建文件夹后，现在，您可以编写如下代码。

`<h:graphicImage>`标签指定名为`hello.gif`的图像在目录 `resources/images`（相对 Web 应用根目录） 中。

```html
<h:body>
<h:form id="user-form" enctype="multipart/form-data">
<h:graphicImage value="#{resource['images:hello.gif']}"/>
<h:graphicImage library="images" name="hello.gif"/>
</h:form>
</h:body>
```

在这段代码中，我们使用两种方式访问图像。第一种是使用表达式语言中的资源数组。 第二种，是通过指定库属性。


<a id="section-7"></a>

## 访问 CSS 文件

`<h:outputStylesheet>`标签用于访问Web应用程序中的CSS资源。 您必须在资源文件夹内创建一个子目录。

在以下示例中，访问网页中的`test.css`文件。文件： *index.xhtml* 的代码如下所示-

```html
<html xmlns="http://www.w3.org/1999/xhtml"
xmlns:h="http://xmlns.jcp.org/jsf/html">
<h:head>
<title>Web Resources Example</title>
<h:outputStylesheet library="css" name="test.css"/>
</h:head>
<h:body>
<h1>Welcome to The Yiibai JSF!</h1>
</h:body>
</html>
```

文件： *test.css*  的代码如下所示-

```css
h1 {
color: red;
text-align: center;
}
```


<a id="section-8"></a>

## 访问 JavaScript 文件

`<h:outputScript>`标签用于访问Web应用程序中的JavaScript文件。

在这里，通过标签的帮助访问JavaScript文件。文件： *index.xhtml* 的代码如下所示-

```html
<html xmlns="http://www.w3.org/1999/xhtml"
xmlns:h="http://xmlns.jcp.org/jsf/html">
<h:head>
<title>Web Resources Example</title>
<h:outputScript library="js" name="test.js"/>
</h:head>
<h:body>
</h:body>
</html>
```

文件： *test.js*  的代码如下所示-

```js
window.onload = function(){
    alert("Welcome to The Yiibai JSF!");
}
```
