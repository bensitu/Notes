# JavaServer Faces 基本概念

**JSF(JavaServer Faces)** 它是一个基于服务器端组件的用户界面框架。 它用于开发 Web 应用程序。 它提供了一个定义良好的编程模型，由丰富的 API 和标签库组成。最新版本`JSF 2`使用`Facelets`作为其默认模板系统。 它是用 Java 编写的。

JSF API 提供组件(`inputText`，`commandButton`等)并帮助管理其状态。 它还提供服务器端验证，数据转换，定义页面导航，提供可扩展性，国际化支持，可访问性等。

JSF 标签库用于在 Web 页面上添加组件，并将组件与服务器上的对象进行连接。 它还包含实现组件标签的标签处理程序。

借助这些功能和工具，您可以轻松轻松地创建服务器端用户界面。



**Facelets 技术**

Facelets是一个开源Web模板系统。它是JavaServer Faces(JSF)的默认视图处理程序技术。 该语言需要有效的输入XML文档才能正常工作。 Facelets支持所有的JSF UI组件，并且完全侧重于构建JSF应用程序的视图。  



**AJAX支持**

JSF提供内置的AJAX支持。 因此，您可以将应用程序请求提交到服务器端，而无需刷新网页。 JSF还支持使用AJAX进行部分渲染。



## 一、JSF 生命周期

JSF(JavaServer Faces) 应用程序框架的简单程序是自动管理生命周期阶段，并允许您手动管理。JSF(JavaServer Faces) 应用程序的生命周期从客户端对页面发出 HTTP 请求时开始，并在服务器响应页面时结束。

JSF 生命周期分为两个主要阶段：

- 执行阶段
- 渲染阶段



### 1. 执行阶段

在执行阶段，当第一次请求时，构建或恢复应用程序视图。 对于其他后续请求，执行其他操作，如应用请求参数值，对组件值执行转换和验证，受托管的`bean`将使用组件值进行更新，并调用应用程序逻辑。
执行阶段被进一步分成以下子阶段。

- 恢复视图阶段
- 应用请求值阶段
- 流程验证阶段
- 更新模型值阶段
- 调用应用阶段
- 渲染响应阶段



#### 1.1 恢复视图阶段

当客户端请求一个 JavaServer Faces 页面时，JavaServer Faces 实现开始恢复视图阶段。 在此阶段，JSF将视图中的组件构建为请求页面，线性事件处理程序和验证器的视图，并将视图保存在 FacesContext 实例中。

如果对该页面的请求是回发，那么与该页面相对应的视图已经存在于 FacesContext 实例中。 在此阶段，JavaServer Faces 实现通过使用保存在客户端或服务器上的状态信息来还原视图。



#### 1.2 应用请求值阶段

在此阶段，在回发请求期间恢复组件树。 组件树是表单元素的集合。树中的每个组件通过使用其 `decode(processDecodes())` 方法从请求参数中提取其新值。 之后，该值将本地存储在每个组件上。

- 如果任何解码方法或事件侦听器在当前 FacesContext 实例上调用了 renderResponse 方法，则 JavaServer Faces 实现将跳过“渲染响应”阶段。
- 如果任何事件在此阶段已排队，则 JavaServer Faces 实现将事件广播到有兴趣的监听器。
- 如果应用程序需要重定向到其他 Web 应用程序资源或生成不包含任何 JavaServer Faces 组件的响应，则可以调用 `FacesContext.responseComplete()` 方法。
- 如果当前请求被识别为部分请求，则从 FacesContext 检索部分上下文，并应用部分处理方法。



#### 1.3 流程验证阶段

在此阶段，JavaServer Faces 通过使用其`validate()`方法来处理在组件上注册的所有验证器。 它检查指定验证规则的组件属性，并将这些规则与为组件存储的本地值进行比较。 JavaServer Faces 还完成了没有将`immediate`属性设置为`true`的输入组件的转换。

- 如果任何验证方法或事件侦听器在当前 FacesContext 上调用了`renderResponse`方法，则 JavaServer Faces 实现将跳过“渲染响应”阶段。
- 如果应用程序需要重定向到不同的 Web 应用程序资源或生成不包含任何 JavaServer Faces 组件的响应，则可以调用`FacesContext.responseComplete`方法。
- 如果事件在此阶段已排队，则 JavaServer Faces 实现将它们广播给有兴趣的监听器。
- 如果当前请求被识别为部分请求，则从 FacesContext 检索部分上下文，并应用部分处理方法。



#### 1.4 更新模型值阶段

确保数据有效后，它遍历组件树，并将相应的服务器端对象属性设置为组件的本地值。  JavaServer Faces 实现只更新输入组件的`value`属性指向`bean`属性。 如果本地数据无法转换为`bean`属性指定的类型，生命周期将直接前进到“渲染响应”阶段，以便重新呈现页面并显示错误。

- 如果任何 updateModels 方法或任何监听器在当前 FacesContext 实例上调用了`renderResponse()`方法，则 JavaServer Faces 实现将跳过“渲染响应”阶段。
- 如果应用程序需要重定向到其他Web应用程序资源或生成不包含任何 JavaServer Faces 组件的响应，则可以调用`FacesContext.responseComplete()`方法。
- 如果任何事件在此阶段已排队，JavaServer Faces 实现将它们广播到有兴趣的监听器。
- 如果当前请求被识别为部分请求，则从 FacesContext 检索部分上下文，并应用部分处理方法。



#### 1.5 调用应用阶段

在此阶段，JSF处理应用程序级事件，例如提交表单或链接到另一个页面。
现在，如果应用程序需要重定向到其他Web应用程序资源或生成不包含任何JSF组件的响应，则可以调用`FacesContext.responseComplete()`方法。

之后，JavaServer Faces 实现将控制转移到“渲染响应”阶段。



#### 1.6 渲染响应阶段

这是JSF生命周期的最后阶段。 在此阶段，JSF 将构建视图并将权限委托给相应的资源来呈现页面。

- 如果这是初始请求，则页面上表示的组件将被添加到组件树中。
- 如果这不是初始请求，组件已经添加到树中，不需要再添加。
- 如果请求是回应，并且在应用请求值阶段，过程验证阶段或更新模型值阶段期间遇到错误，则在此阶段将再次呈现原始页面。

如果页面包含`h:message`或`h:messages`标签，页面上会显示任何排队的错误消息。
在渲染视图的内容之后，保存响应的状态，以便后续请求可以访问它。 恢复视图阶段可以使用保存的状态。



### 2. 渲染阶段

在此阶段，请求的视图作为对客户端浏览器的响应。 视图渲染是以 HTML 或 XHTML 生成输出的过程。 所以，用户可以在浏览器看到它。

在渲染过程中采取以下步骤。

- 当客户端对`index.xhtml`网页进行初始请求时，编译应用程序。
- 应用程序在编译后执行，并为应用程序构建一个新的组件树，并放置在 FacesContext 中。
- 使用由`EL`表达式表示的组件和与其关联受托管`bean`属性填充组件树。
- 基于组件树。 建立了新的视图。
- 该视图作为响应呈现给请求客户端。
- 组件树被自动销毁。
- 在后续请求中，重新构建组件树，并应用已保存的状态。



## 二、JSF 托管 Bean

托管 bean 它是一个纯 Java 类，它包含一组属性和一组`getter`，`setter`方法。

以下是托管 bean 方法执行的常见功能：

- 验证组件的数据
- 处理组件触发的事件
- 执行处理以确定应用程序必须导航的下一页
- 它也可以作为JFS框架的模型。



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
import javax.faces.bean.RequestScoped;  

@ManagedBean(name = "user", eager = true)  // Using ManagedBean annotation  
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
  
  	public void setMessageBean(Message message) {
    this.messageBean = messageBean;
  }
}
```

类中的`@ManagedBean`注解自动将该类注册为 JavaServer Faces 的资源。 可以用 `name` 属性来指定 bean 的名称，未指定时默认为简单的类名称。如果 `eager` 设置为 "`true`"，则在请求之前创建托管 bean。如果使用 "`lazy`" 初始化，只有在请求时才会创建 bean。这种注册的托管 bean 在应用程序配置资源文件中不需要托管 bean 配置项。

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
| `h:commandButton`         | 它向应用程序提交表单                                 | HTML `<input type = "value">`元素，类型值可以为“`submit`”，“`reset`”或“`image`” |                                          |
| `h:inputSecret`           | 它允许用户输入字符串，但不会在字段中显示实际的字符串 | HTML `<input type="password">`元素                           | 显示一行字符而不是输入的实际字符串的字段 |
| `h:inputTextarea`         | 它允许用户输入多行字符串                             | HTML `<textarea>`元素标签                                    | 多行字段                                 |
| `h:commandLink`           | 它链接到页面上的另一页或位置                         | HTML `<a href="">`元素标签                                   | 一个链接                                 |
| `h:inputHidden`           | 它允许页面写入包含一个隐藏的变量和值                 | HTML `<input type="hidden">`元素                             | 无外观                                   |
| `h:inputFile`             | 它允许用户上传文件                                   | HTML `<input type="file">`元素标签                           | 具有浏览按钮的字段                       |
| `h:graphicImage`          | 它显示一个图像                                       | HTML `<img>`元素标签                                         | 一个图像                                 |
| `h:dataTable`             | 它代示数据包装器                                     | HTML `<table>`元素标签                                       | 可以动态更新的表                         |
| `h:message`               | 它显示本地化的消息                                   | HTML `<span>`标签，如果使用样式                              | 一个文本字符串                           |
| `h:messages`              | 它显示本地化的消息                                   | 一组HTML `<span>`标签，如果使用样式                          | 一个文本字符串                           |
| `h:outputFormat`          | 它显示格式化的消息                                   | 纯文本                                                       | 纯文本                                   |
| `h:outputLabel`           | 它将嵌套组件显示为指定输入字段的标签                 | HTML `<label>`元素                                           | 纯文本                                   |
| `h:outputLink`            | 它链接到页面上的另一个页面或位置，但不生成操作事件。 | HTML `<a>`元素                                               | 一个链接                                 |
| `h:panelGrid`             | 它在一个父项下分组一组组件                           | HTML `<div>` 或 `<span>` 元素                                | 在一个表中的一行                         |
| `h:selectBooleanCheckbox` | 它允许用户更改布尔值的值                             | HTML `<input type="checkbox">` 元素                          | 一个复选框                               |
| `h:selectManyCheckbox`    | 它显示一组复选框，用户可以从中选择多个值。           | 一组HTML `<input>`类型复选框的元素                           | 一组复选框                               |
| `h:selectManyListbox`     | 它允许用户从一组全部显示的项目中选择多个项目。       | HTML `<select>`元素                                          | 选择框                                   |
| `h:selectManyMenu`        | 它允许用户从一组项目中选择多个项目                   | HTML `<select>`元素                                          | 菜单                                     |
| `h:selectOneListbox`      | 它允许用户从一组全部显示的项目中选择一个项目         | HTML `<select>`元素                                          | 选择框                                   |
| `h:selectOneMenu`         | 它允许用户从一组项目中选择一个项目                   | HTML `<select>`元素                                          | 菜单                                     |
| `h:selectOneRadio`        | 它允许用户从一组项目中选择一个项目                   | HTML `<input type="radio">`元素                              | 一组选项                                 |
| `h:column`                | 它表示数据组件中的一列数据                           | HTML表中的一列数据                                           | 表中的列                                 |







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
                    <td><h:outputLabel for="username">用户名：</h:outputLabel></td>  
                    <td><h:inputText id="name-id" value="#{user.name}"/></td>  
                </tr>  
                <tr>  
                    <td><h:outputLabel for="email">Email：</h:outputLabel></td>  
                    <td><h:inputText id="email-id" value="#{user.email}"/></td>  
                </tr>  
                <tr>  
                    <td><h:outputLabel for="password">密码：</h:outputLabel></td>  
                    <td><h:inputSecret id="password-id" value="#{user.password}"/></td>  
                </tr>  

                <tr>  
                    <td><h:outputLabel for="gender">性别：</h:outputLabel></td>  
                    <td><h:selectOneRadio value="#{user.gender}">  
                            <f:selectItem itemValue="男" itemLabel="男" />  
                            <f:selectItem itemValue="女" itemLabel="女" />  
                        </h:selectOneRadio></td>  
                </tr>  
                <tr><td><h:outputLabel for="address">地址：</h:outputLabel></td>  
                    <td><h:inputTextarea value="#{user.address}" cols="50" rows="5"/></td></tr>  
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

@ManagedBean
@RequestScoped
public class User {

    String name;
    String email;
    String password;
    String gender;
    String address;

  	// 省略 getter 和 setter 方法
}
```



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
                <td><b>密码:</b></td>  
                <td><h:outputText value="#{user.password}"/><br/></td>  
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
|   |    |   |   |--face-config.xml:JSF配置
|   |    |   |--index.xhtml
|   |--test.ejb.test:测试文件
|--target:目标文件
```



## 访问图片文件

JSF提供`<h:graphicImage />`标签来访问Web应用程序中的图片文件。 在以下示例中，首先我们创建了一个名为`images`的资源和子文件夹。 创建文件夹后，现在，您可以编写如下代码。 

`<h:graphicImage>`标签指定名为`hello.gif`的图像在目录 `pages/resources/images` 中。

```html
<h:body>  
<h:form id="user-form" enctype="multipart/form-data">  
<h:graphicImage value="#{resource['images:hello.gif']}"/>  
<h:graphicImage library="images" name="hello.gif"/>  
</h:form>  
</h:body>
```

在这段代码中，我们使用两种方式访问图像。第一种是使用表达式语言中的资源数组。 第二种，是通过指定库属性。



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



