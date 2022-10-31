# JSF HTML 标签



### <h:inputText> 			 				 			

JSF `<h:inputText>`标签用于呈现网页上的输入字段。它在`<h:form>`标签中用于声明允许用户输入数据的输入字段。

```html
<h:inputText id="username" value="#{user.name}" label="username" maxlength="10" size="15" alt="username" autocomplete="off" readonly="false" required="true" requiredMessage="Username is required" style="color:red" accesskey="q">  
</h:inputText>
```

`value`属性指的是名为`User`的委托`Bean`的`name`属性。该属性保存名称组件的数据。 用户提交表单后，`User`中的`name`属性的值将被设置为与该标签对应的字段中输入的文本。



### <h:inputtextarea>

允许用户输入多行字符串。

```html
<h:inputTextarea id="text-area-id" value="#{user.address}" required="true"   
requiredMessage="Address is required" cols="50" rows="10"></h:inputTextarea>

```

JSF 渲染`<h:inputTextarea>`标签后，如下所示：

```html
<textarea id="user-form:text-area-id"  
name="user-form:text-area-id" cols="50" rows="10">
```



### <h:inputSecret>

一个标准的密码字段，它接受一行没有空格的文本，并在输入时将其显示为一组星号。

```html
<h:inputSecret value="#{user.password}" maxlength="10" size="15"   
required="true" requiredMessage="Password is required"></h:inputSecret>
```

JSF渲染`<h:inputSecret>`标签后，如下所示：

```html
<input name="user-password" value="" maxlength="10" size="15" type="password">
```



### <h:inputHidden>

h:inputHidden标签渲染类型为“hidden"的HTML输入元素。

以下JSF标记

```html
<h:inputHidden value="Hello World" id="hiddenField" />
```

渲染到以下HTML标记。

```html
<input id="jsfForm:hiddenField" type="hidden" name="jsfForm:hiddenField" 
   value="Hello World" />
```



### <h:inputFile>

JSF 将其呈现为文件类型的 HTML 元素，它用于获取文件作为输入。 在 HTML 表单中，它允许用户上传文件。

```html
<h:inputFile id="file-id" value="#{user.fileName}" required="true"   
requiredMessage="Please upload a file" alt="upload file"></h:inputFile>
```



### <h:outputText>					 				 				 				 			

它用于渲染纯文本。 如果存在“`styleClass`”，“`style`”，“`dir`”或“`lang`”属性，则渲染“`span`”元素。 如果存在“`styleClass`”属性，则将其值作为“`class`”属性的值。

```html
<h:outputText value="hello"></h:outputText>

<h:outputText value="hello" lang="en" style="color: red"></h:outputText>
```

输出

```html
hello

<span style="color: red" lang="en">hello</span>
```



### <h:outputFormat>

呈现HTML文本，但可以接受参数化输入。

```html
<h:outputFormat value="parameter 1 : {0}, parameter 2 : {1}" >
   <f:param value="Item 1" />
   <f:param value="Item 2" />
</h:outputFormat>
```

被渲染成以下HTML代码：

```html
parameter 1 : Item 1, parameter 2 : Item 2
```

实例：
```java
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

@ManagedBean(name="user")
@SessionScoped
public class UserBean{

  public String text = "Hello {0}";
  public String htmlInput = "<a href='http://www.baidu.com'>{0}</a>";

  public String getText() {
    return text;
  }
  public void setText(String text) {
    this.text = text;
  }
  public String getHtmlInput() {
    return htmlInput;
  }
  public void setHtmlInput(String htmlInput) {
    this.htmlInput = htmlInput;
  }
}
```

*index.xhtml*中的代码：

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core">
    <h:body>
        <h:outputFormat value="this is param 0 : {0}, param 1 : {1}" >
         <f:param value="Number 1" />
         <f:param value="Number 2" />
       </h:outputFormat>
     <br/>
       <h:outputFormat value="#{user.text}" >
         <f:param value="baidu.com" />
       </h:outputFormat>
    <br/>
      <h:outputFormat value="#{user.htmlInput}" >
         <f:param value="text" />
         <f:param value="size='30'" />
       </h:outputFormat>
    <br/>
      <h:outputFormat value="#{user.htmlInput}" escape="false" >
         <f:param value="text" />
         <f:param value="size='30'" />
       </h:outputFormat>
    <br/>
      <h:outputFormat value="#{user.htmlInput}" escape="false" >
         <f:param value="button" />
         <f:param value="value='Click Me'" />
       </h:outputFormat>
    </h:body>
</html>
```

输出为：

```
this is param 0 : Number 1, param 1 : Number 2
Hello baidu.com
<a href='http://www.baidu.com'>
text
button
```



### <h:outputStylesheet>

用类型“`text/css`”呈现类型为“`link`”的HTML元素。此标签将外部样式表文件添加到JSF页面。

```html
<h:outputStylesheet library="css" name="styles.css"  />
```

被渲染成如下HTML代码:

```html
<link type="text/css" rel="stylesheet" href="/helloworld/javax.faces.resource/styles.css.jsf?ln=css" />
```

实例：

*table-style.css* 的代码:

```css
.book-table-header{
  bbook-bottom:1px solid #BBB;
  padding:16px;
  color: red;
}

.book-table-odd-row{
  bbook-top:1px solid #BBB;
}

.book-table-even-row{
  bbook-top:1px solid #BBB;
}
```

*index.xhtml* 的代码:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      xmlns:ui="http://java.sun.com/jsf/facelets">
    <h:head>
      <h:outputStylesheet library="css" name="table-style.css"  />
    </h:head>
    <h:body>
      <h:form>
        <h:dataTable value="#{book.bookList}" var="o"
          styleClass="book-table"
          headerClass="book-table-header"
          rowClasses="book-table-odd-row,book-table-even-row">
          <h:column>
            <f:facet name="header">Book No</f:facet>#{o.bookNo}
          </h:column>
          <h:column>
            <f:facet name="header">Product Name</f:facet>#{o.productName}
          </h:column>
          <h:column>
            <f:facet name="header">Price</f:facet>#{o.price}
          </h:column>
          <h:column>
            <f:facet name="header">Quantity</f:facet>#{o.qty}
          </h:column>
          <h:column>
            <f:facet name="header">Action</f:facet>
            <h:commandLink value="Delete" action="#{book.deleteAction(o)}" />
          </h:column>
        </h:dataTable>
        <h3>Enter Book</h3>
        <table>
        <tr>
          <td>Book No :</td>
          <td><h:inputText size="20" value="#{book.bookNo}" /></td>
        </tr>
        <tr>
          <td>Product Name :</td>
          <td><h:inputText size="20" value="#{book.productName}" /></td>
        </tr>
        <tr>
          <td>Quantity :</td>
          <td><h:inputText size="20" value="#{book.price}" /></td>
        </tr>
        <tr>
          <td>Price :</td>
          <td><h:inputText size="20" value="#{book.qty}" /></td>
        </tr>
        </table>
        <h:commandButton value="Add" action="#{book.addAction}" />
      </h:form>
    </h:body>
</html>
```



### <h:outputLink>

h:outputLink标签渲染一个HTML“anchor"元素。

以下JSF标记

```html
<h:outputLink value="page1.jsf" >Page 1</h:outputLink>
```

将渲染为以下HTML标记。

```html
<a href="page1.jsf">Page 1</a>
```



### <h:form>	 			

`<h:form>`标签表示输入表单。 它包括可以包含向用户呈现或以表单提交的数据的子组件。

```html
<h:form id="user-form">  
<h:outputLabel for="username">User Name</h:outputLabel>  
<h:inputText id="username" value="#{user.name}" required="true" requiredMessage="Username is required"/><br/>  
<h:commandButton id="submit-button" value="Submit" action="response.xhtml"/>  
</h:form>
```



### <h:commandButton>

它创建一个提交按钮 (submit)，用于提交申请表。 

```html
<h:form id="user-form">  
<h:outputLabel for="username">User Name</h:outputLabel>  
<h:inputText id="username" value="#{user.name}" required="true" requiredMessage="Username is required"/><br/>  
<h:commandButton id="submit-button" value="Submit" action="response.xhtml"/>  
</h:form>
```

JSF 渲染标签到浏览器后：

```html
<input id="user-form:submit-button"  
name="user-form:submit-button" value="Submit" type="submit">
```





### <h:commandLink>

JSF 将`<h:commandLink>`标签作为一个 HTML “`a`”锚点元素，当单击时，它就像一个表单提交按钮。 因此，您可以使用此标签创建锚标签。 `<h:commandLink>`标签必须包含一个嵌套的`<h:outputText>`标记，表示用户单击文本以生成事件。 它还需要放在`<h:form>`标签中。

```html
<h:commandLink id="image-link-id" action="response.xhtml">  
<h:outputText value="Click here"></h:outputText>  
</h:commandLink>
```

JSF渲染`<h:commandLink>`标签后，如下所示：

```html
<a id="user-form:image-link-id" href="#"  
onclick="mojarra.jsfcljs(document.getElementById('user-form'),{'user-form:image-link-id':'user-form:image-link-id'},'');return  
false">Click here</a>
```







### <h:graphicImage>

呈现一个 HTML 元素“img”标签。 该标签用于在网页上呈现图像。

```html
<h:graphicImage id="image-id" name="user-image" url="#{user.fileLocation()}"   
height="50px" width="50px" alt="Image not found"></h:graphicImage>
```

它在网页上显示图像。在上面的例子中，url 属性指定图像的路径。 示例代码的URL以斜杠(`/`)开头，它将Web应用程序的相对上下文路径添加到图像路径的开头。



### <h:message>

用于显示特定组件的单个消息。您可以通过将该组件的`id`传递给`for`属性来显示您的自定义消息。

```html
<h:inputText id="username" size="20" label="UserName" required="true">
   <f:validateLength for="username" minimum="5" maximum="20" />      
</h:inputText>
<h:message for="username" style="color:red" />
```

如果输入超过20个字符时提示:

```html
<span style="color:red">UserName: Validation Error: 
Length is greater than allowable maximum of '20'</span>
```

如果输入小于`5`个字符时提示:

```html
<span style="color:red">UserName: Validation Error: 
Length is less than allowable minimum of '5'</span>
```

如果输入字段未输入时提示:

```html
<span style="color:red">UserName: Validation Error: Value is required</span>
```



### <h:messages>

h:messages标记在与UI元素对应的一个地方显示所有消息。

以下JSF标记

```html
<h:messages style="color:red;margin:8px;" />
```

如果输入的用户名超过20个字符，输入的密码小于5个字符。

```html
<ul style="color:red;margin:8px;">
   <li>  UserName: Validation Error: 
   Length is greater than allowable maximum of "20" </li>
   <li>  Password: Validation Error: 
   Length is less than allowable minimum of "5" </li>
</ul>
```



### <h:selectOneRadio>

呈现一组类型为“`radio`”的HTML输入元素，并使用HTML表格和标签标签进行格式化。

```html
<h:selectOneRadio value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />           
</h:selectOneRadio>
```

被渲染生成以下HTML代码 -

```html
<table>
   <tr>
      <td><input type="radio" checked="checked" name="j_idt6:j_idt8" 
            id="j_idt6:j_idt8:0" value="1" />
         <label for="j_idt6:j_idt8:0"> Item 1</label></td>
      <td><input type="radio" name="j_idt6:j_idt8" 
            id="j_idt6:j_idt8:1" value="2" />
         <label for="j_idt6:j_idt8:1"> Item 2</label></td>
   </tr>
</table>
```

它支持在 Bean 里面的方法渲染所有选项。

```java
@ManagedBean(name="user")
@SessionScoped
public class UserBean implements Serializable{
  public String item;
	// 省略 getter 和 setter 方法
  
  //Generated by Object array
  public static class Item{
    public String label;
    public String value;

		// 省略 有参和无参 构造方法

		// 省略 getter 和 setter 方法
  }
  public Item[] itemList;

  public Item[] getItemValue() {

    itemList = new Item[3];
    itemList[0] = new Item("Color - Red", "Red");
    itemList[1] = new Item("Color - Green", "Green");
    itemList[2] = new Item("Color - Blue", "Blue");

    return itemList;
  }  
  
  //Generated by Map
  private static Map<String,Object> itemValue;
  static{
    itemValue = new LinkedHashMap<String,Object>();
    itemValue.put("Color - Red", "Red"); //label, value
    itemValue.put("Color - Green", "Green");
    itemValue.put("Color - Blue", "Blue");
  }

  public Map<String,Object> getItemValue() {
    return itemValue;
  } 
}
```

以下是文件：`index.xhtml` 中的代码。

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core">
    <h:body>
      <h:form>
        
        Generated by Object array and iterate with var :
       <h:selectOneRadio value="#{user.item}">
         <f:selectItems value="#{user.itemValue}" var="c"
         itemLabel="#{c.label}" itemValue="#{c.value}" />
       </h:selectOneRadio>
        
         Generated by Map :
       <h:selectOneRadio value="#{user.item}">
         <f:selectItems value="#{user.itemValue}" />
       </h:selectOneRadio>

    <br /><br />
      <h:commandButton value="Submit" action="result" />
    <h:commandButton value="Reset" type="reset" />
      </h:form>
    </h:body>
</html>
```



### <h:selectOneMenu>

呈现大小未指定的“`select`”类型的 HTML 下拉菜单输入元素。

```html
<h:selectOneMenu value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />                   
</h:selectOneMenu>
```

被渲染成以下HTML代码 -

```html
<select name="j_idt6:j_idt8">  
   <option value="1">Item 1</option>
   <option value="2">Item 2</option>
</select>
```



它支持 map 渲染 和 组合框内部项渲染：

**由映射生成组合框实例**

*UserBean.java* 中的代码：

```java
import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

@ManagedBean(name="user")
@SessionScoped
public class UserBean implements Serializable{
  public String favItem;
  public String getFavItem() {
    return favItem;
  }

  public void setFavItem(String favItem) {
    this.favItem = favItem;
  }
  //Generated by Map
  private static Map<String,Object> value;
  static{
    value = new LinkedHashMap<String,Object>();
    value.put("Item A", "A"); //label, value
    value.put("Item B", "B");
    value.put("Item C", "C");
  }

  public Map<String,Object> getFavItemValue() {
    return value;
  }  
}
```

以下是文件：*index.xhtml* 中的代码 - 

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core">
    <h:body>
      <h:form>
      Generated by Map :
       <h:selectOneMenu value="#{user.favItem}">
         <f:selectItems value="#{user.favItemValue}" />
       </h:selectOneMenu>

    <br /><br />

      <h:commandButton value="Submit" action="result" />
    <h:commandButton value="Reset" type="reset" />

      </h:form>
    </h:body>
</html>
```

*result.xhtml* 中的代码：

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html">
<h:body>
  <p>User Selected : #{user.favItem}</p>
</h:body>
</html>
```



**组合框内部项**

*index.xhtml* 中的代码：

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core">
    <h:body>
      <h:form>
      Generated by Object array and iterate with var :
       <h:selectOneMenu value="#{user.favItem}">
         <f:selectItems value="#{user.itemValue}" var="c" itemLabel="#{c.itemLabel}" itemValue="#{c.itemValue}" />
       </h:selectOneMenu>
    <br /><br />
      <h:commandButton value="Submit" action="result" />
    <h:commandButton value="Reset" type="reset" />
      </h:form>
    </h:body>
</html>
```

*result.xhtml* 中的代码：

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html">
<h:body>
  <p>Selected: #{user.favItem}</p>
</h:body>
</html>
```

*UserBean.java* 中的代码：

```java
import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

@ManagedBean(name="user")
@SessionScoped
public class UserBean implements Serializable{
  public String favItem;
  public String getFavItem() {
    return favItem;
  }
  public void setFavItem(String f) {
    this.favItem = f;
  }
  //Generated by Object array
  public static class Item{
    public String itemLabel;
    public String itemValue;

    public Item(String l, String v){
      this.itemLabel = l;
      this.itemValue = v;
    }
    public String getItemLabel(){
      return itemLabel;
    }
    public String getItemValue(){
      return itemValue;
    }
  }
  public Item[] itemList;
  public Item[] getItemValue() {
    itemList = new Item[3];
    itemList[0] = new Item("Item A", "A");
    itemList[1] = new Item("Item B", "B");
    itemList[2] = new Item("Item C", "C");
    return itemList;
  }  
}
```



### <h:selectOneListbox>

呈现指定大小的“`select`”类型的HTML列表输入元素。

```html
<h:selectOneListbox value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />                   
</h:selectOneListbox>
```

被渲染成以下HTML标签-

```html
<select name="j_idt6:j_idt8" size="2">  
   <option value="1">Item 1</option>
   <option value="2">Item 2</option>
</select>
```



**由映射生成的列表框**

*result.xhtml*中的代码：

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html">
<h:body>
  <p>Selected: #{user.item}</p>
</h:body>
</html>
```

*UserBean.java* 中的代码：

```java
import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

@ManagedBean(name="user")
@SessionScoped
public class UserBean implements Serializable{
  public String item;

  public String getItem() {
    return item;
  }

  public void setItem(String i) {
    this.item = i;
  }  
  //Generated by Map
  private static Map<String,Object> itemValue;
  static{
    itemValue = new LinkedHashMap<String,Object>();
    itemValue.put("Item 1", "1"); //label, value
    itemValue.put("Item 2", "2");
    itemValue.put("Item 3", "3");
  }  
  public Map<String,Object> getItemValue() {
    return itemValue;
  }    
}
```

 *index.xhtml* 中的代码：

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core">
    <h:body>
      <h:form>
        Generated by Map :
       <h:selectOneListbox value="#{user.item}">
         <f:selectItems value="#{user.itemValue}" />
       </h:selectOneListbox>

    <br /><br />
      <h:commandButton value="Submit" action="result" />
    <h:commandButton value="Reset" type="reset" />
      </h:form>
    </h:body>
</html>
```

**内部类istBox实现列表框**

*UserBean.java* 中的代码：

```java
import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

@ManagedBean(name="user")
@SessionScoped
public class UserBean implements Serializable{
  public String item;

  public String getItem() {
    return item;
  }

  public void setItem(String i) {
    this.item = i;
  }  
  public static class Item{
    public String label;
    public String value;

    public Item(String l, String v){
      this.label = l;
      this.value = v;
    }

    public String getLabel(){
      return label;
    }

    public String getValue(){
      return value;
    }

  }
  public Item[] itemList;

  public Item[] getItemValue() {
    itemList = new Item[3];
    itemList[0] = new Item("item - 1", "1");
    itemList[1] = new Item("item - 2", "2");
    itemList[2] = new Item("item - 3", "3");

    return itemList;
  }    
}
```

*result.xhtml* 中的代码：

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html">
<h:body>
  <p>Selected: #{user.item}</p>
</h:body>
</html>
```

*index.xhtml* 中的代码：

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core">
    <h:body>
      <h:form>
        Generated by Object array and iterate with var :
       <h:selectOneListbox value="#{user.item}">
         <f:selectItems value="#{user.itemValue}" var="y"
         itemLabel="#{y.label}" itemValue="#{y.value}" />
       </h:selectOneListbox>

    <br /><br />
      <h:commandButton value="Submit" action="result" />
    <h:commandButton value="Reset" type="reset" />
      </h:form>
    </h:body>
</html>
```



### <h:selectManyListbox>

呈现一个类型为“`select`”的HTML输入元素，并指定其大小和多项目。

```html
<h:selectManyListbox value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />
</h:selectOneListbox>
```

被渲染成以下HTML代码 - 

```html
<select name="j_idt6:j_idt8" size="2" multiple="multiple">  
   <option value="1">Item 1</option>
   <option value="2">Item 2</option>
</select>
```



**SelectManyListBox实例**

*UserBean.java* 中的代码：

```java
import java.io.Serializable;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

@ManagedBean(name="user")
@SessionScoped
public class UserBean implements Serializable{
  public String[] item = {"A", "B"};
  public String[] getItem() {
    return item;
  }

  public void setItem(String[] i) {
    this.item = i;
  }

  public String getItemString() {
    return Arrays.toString(item);
  }
  //Generated by Object array
  public static class Item{
    public String label;
    public String value;

    public Item(String l, String v){
      this.label = l;
      this.value = v;
    }

    public String getLabel(){
      return label;
    }

    public String getValue(){
      return value;
    }

  }

  public Item[] itemList;

  public Item[] getItemValue() {
    itemList = new Item[3];
    itemList[0] = new Item("Item A", "A");
    itemList[1] = new Item("Item B", "B");
    itemList[2] = new Item("Item C", "C");

    return itemList;
  }
}
```

*index.xhtml* 中的代码：

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      >
    <h:body>
      <h:form>
      Generated by Object array and iterate with var :
       <h:selectManyListbox value="#{user.item}">
         <f:selectItems value="#{user.itemValue}" var="f"
         itemLabel="#{f.label}" itemValue="#{f.value}" />
       </h:selectManyListbox>

    <br /><br />
      <h:commandButton value="Submit" action="result" />
    <h:commandButton value="Reset" type="reset" />
      </h:form>
    </h:body>
</html>
```

*result.xhtml* 中的代码：

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      xmlns:c="http://java.sun.com/jsp/jstl/core">
    <h:body>
  Selected:  #{user.itemString}
    </h:body>
</html>
```



**通过映射的SelectManyListBox实例**

*UserBean.java* 中的代码：

```java
import java.io.Serializable;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

@ManagedBean(name="user")
@SessionScoped
public class UserBean implements Serializable{
  public String[] item = {"A", "B"};
  public String[] getItem() {
    return item;
  }

  public void setItem(String[] i) {
    this.item = i;
  }

  public String getItemString() {
    return Arrays.toString(item);
  }
  private static Map<String,Object> itemValue;
  static{
    itemValue = new LinkedHashMap<String,Object>();
    itemValue.put("Item A", "A"); //label, value
    itemValue.put("Item B", "B");
    itemValue.put("Item C", "C");
  }

  public Map<String,Object> getItemValue() {
    return itemValue;
  }
}
```

以下是文件： *index.xhtml* 中的代码 - 

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      >
    <h:body>
      <h:form>
      Generated by Map :
       <h:selectManyListbox value="#{user.item}">
         <f:selectItems value="#{user.itemValue}" />
       </h:selectManyListbox>
    <br /><br />
      <h:commandButton value="Submit" action="result" />
    <h:commandButton value="Reset" type="reset" />
      </h:form>
    </h:body>
</html>
```

*result.xhtml* 中的代码：

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      xmlns:c="http://java.sun.com/jsp/jstl/core">
    <h:body>
  Selected:  #{user.itemString}
    </h:body>
</html>
```



### <h:selectBooleanCheckbox>

h:selectBooleanCheckbox标签渲染类型为“checkbox"的HTML输入元素。

以下JSF标记

```html
<h:selectBooleanCheckbox value="Remember Me" id="chkRememberMe" />
```

渲染到以下HTML标记。

```html
<input id="jsfForm1:chkRememberMe" type="checkbox" 
   name="jsfForm1:chkRememberMe" checked="checked" />
```

h:selectManyCheckbox标签呈现一组HTML输入元素，并使用HTML表格和标签标签格式化。

JSF中的以下标记

```html
<h:selectManyCheckbox value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />
</h:selectManyCheckbox>
```

被渲染到以下HTML标记中。

```html
<table>
   <tr>
      <td><input name="j_idt6:j_idt8" id="j_idt6:j_idt8:0" value="1" 
            type="checkbox" checked="checked" />
         <label for="j_idt6:j_idt8:0" class=""> Item 1</label>
      </td>
      <td><input name="j_idt6:j_idt8" id="j_idt6:j_idt8:1" value="2" 
            type="checkbox" checked="checked" />
         <label for="j_idt6:j_idt8:1" class=""> Item 2</label>
      </td>     
   </tr>
</table>
```



### <h:attribute>

使用`<h:attribute>`标签通过动作侦听器将属性值传递给组件，或将参数传递给组件。

以下代码显示如何使用`<h:attribute>`标签。

*index.xhtml* 中的代码:

```html
<h:form id="form">
   <h:commandButton action="#{user.outcome}" actionListener="#{user.attrListener}">
      <f:attribute name="username" value="baidu.com" />
      <f:attribute name="value" value="Click Me" />
   </h:commandButton>
</h:form>
```

*UserBean.java* 中的代码:

```java
package com.yiibai.common;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.event.ActionEvent;

@ManagedBean(name="user")
@SessionScoped
public class UserBean{
  public String nickname;

  public void attrListener(ActionEvent event){
    nickname = (String)event.getComponent().getAttributes().get("username");
  }
  public String outcome(){
    return "result";
  }
  public String getNickname() {
    return nickname;
  }
  public void setNickname(String nickname) {
    this.nickname = nickname;
  }
}
```



### <f:param>

我们可以使用f:param标签将参数传递给组件或传递请求参数。

以下代码显示如何将参数传递到UI组件。

```html
<h:outputFormat value="Hello {0}!.">        
   <f:param value="World" />
</h:outputFormat>
```

以下代码传递请求参数及其名称。

```html
<h:commandButton id="submit" 
   value="Show Message" action="#{userData.showResult}">
   <f:param name="username" value="JSF 2.0 User" />
</h:commandButton>
```



### <h:setPropertyActionListener>

以下代码显示如何使用`<f:setPropertyActionListener>`标签。

```html
<h:commandButton id="submit" action="result" value="Show Message"> 
   <f:setPropertyActionListener target="#{userData.data}" 
      value="JSF 2.0 User" />
</h:commandButton>
```



实例：

*UserBean.java* 中的代码。

```java
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

@ManagedBean(name="user")
@SessionScoped
public class UserBean{

  public String username;

  public String outcome(){
    return "result";
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }
}
```

*index.xhtml* 中的代码:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      >
    <h:body>
        <h:form id="form">
            <h:commandButton action="#{user.outcome}" value="Click Me">
                <f:setPropertyActionListener target="#{user.username}" value="yiibai" />
            </h:commandButton>
        </h:form>
    </h:body>
</html>
```

*result.xhtml* 中的代码:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      >
    <h:body>
        <h1>JSF 2 setPropertyActionListener example</h1>
        #{user.username}
    </h:body>
</html>
```



### <f:ajax>

JSF 支持使用`f:ajax`标签进行Ajax调用。

下面显示了一个简单的JSF标签。

```html
<f:ajax execute="input-component-name" render="output-component-name" />
```

`<h:inputText>`创建一个输入字段框。创建一个输入字段框。 它使用来调用。

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:f="http://java.sun.com/jsf/core"      
      xmlns:h="http://java.sun.com/jsf/html">

    <h:body>
      <h:form>
        <h:inputText id="name" value="#{userBean.name}"></h:inputText>
        <h:commandButton value="Welcome Me">
           <!-- Using Ajax tag for the button to show the input name -->
           <f:ajax execute="name" render="output" />    
        </h:commandButton>
        <h2><h:outputText id="output" value="#{userBean.sayWelcome}" /></h2>
      </h:form>
  </h:body>
</html>
```



# JSF 转换器标签

JSF有转换器将其UI组件的数据转换为托管bean中使用的对象，反之亦然。

例如，我们可以将文本转换为日期对象，并且可以验证输入的格式。

要使用转换器标签，我们必须在`html`节点中使用URI的以下命名空间。

```html
<html 
   xmlns="http://www.w3.org/1999/xhtml" 
   xmlns:f="http://java.sun.com/jsf/core">
</html>
```



### <f:convertNumber>

用于将字符串值转换为所需格式的数量。

```html
<f:convertNumber minFractionDigits="2" />
```

**标签属性**

| 属性              | 描述                                              |
| ----------------- | ------------------------------------------------- |
| type              | 数字(默认)，货币或百分比                          |
| pattern           | 格式化模式，如在`java.text.DecimalFormat`中定义的 |
| maxFractionDigits | 小数部分中的最大位数                              |
| minFractionDigits | 小数部分中的最小位数                              |
| maxIntegerDigits  | 整数部分的最大位数                                |
| minIntegerDigits  | 整数部分的最小位数                                |
| integerOnly       | 如果只解析整数部分，则为`true`(默认值：`false`)   |
| groupingUsed      | 如果使用分组分隔符，则为`false`(默认值为`true`)   |
| locale            | 用于分析和格式化的首选项的区域设置                |
| currencyCode      | 转换货币值时使用的ISO 4217货币代码                |
| currencySymbol    | 转换货币值时使用的货币符号                        |

*result.xhtml* 中的代码:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      xmlns:c="http://java.sun.com/jsp/jstl/core"
      >
    <h:body>
    <p>
      Amount [minFractionDigits="2"] : 
      <!-- 999.01 -->
      <h:outputText value="#{receipt.amount}" >
        <f:convertNumber minFractionDigits="2" />
      </h:outputText>
    </p>
    <p>
      Amount [pattern="#0.000"] : 
      <!-- 999.010 -->
      <h:outputText value="#{receipt.amount}" >
        <f:convertNumber pattern="#0.000" />
      </h:outputText>
    </p>
    <p>
      Amount [currencySymbol="$"] :
      <!-- $999.01 -->
      <h:outputText value="#{receipt.amount}">
        <f:convertNumber currencySymbol="$" type="currency" />
      </h:outputText>
    </p>
    <p>
      Amount [currencyCode="JPY"] : 
      <!-- JPY999.01 -->
      <h:outputText value="#{receipt.amount}" >
        <f:convertNumber currencyCode="GBP" type="currency" />
      </h:outputText>
    </p>
    <p>
      Amount [type="percent"] : 
      <!-- 99,901% -->
      <h:outputText value="#{receipt.amount}" >
        <f:convertNumber type="percent" />
      </h:outputText>
    </p>
    </h:body>
</html>
```



### <f:convertDateTime>

用于将用户输入转换为指定的日期。 您可以通过将组件标签内的`convertDateTime`标签嵌套来将组件的数据转换为`java.util.Date`。 

```html
<f:convertDateTime pattern="yyyy-mm-dd" />
```

**标签属性**

| 属性      | 类型               | 描述                                                         |
| --------- | ------------------ | ------------------------------------------------------------ |
| binding   | DateTimeConverter  | 它用于将转换器绑定到受委托Bean属性。                         |
| dateStyle | String             | 它用于定义由`java.text.DateFormat`指定的日期或日期字符串的日期部分的格式。 只适用于`type`是`date`或`both`，如果`pattern`未定义。 有效值：`default`，`short`，`medium`，`long`和`full`。 如果没有指定值，则使用默认值。 |
| for       | String             | 它用于引用该标签嵌套在其中的复合组件内的一个对象。           |
| locale    | String 或 Locale   | 它是一个区域设置的实例，它在格式化或解析期间使用了日期和时间的预定义样式。 如果未指定，将使用`FacesContext.getLocale`返回的区域设置。 |
| pattern   | String             | 它用于自定义格式化模式，用于确定如何格式化和解析日期/时间字符串。 如果指定了此属性，则将忽略`dateStyle`，`timeStyle`和`type`属性。 |
| timeStyle | String             | 它用于定义由`java.text.DateFormat`指定的时间或日期字符串的时间部分的格式。 仅当类型为时间和模式未定义时才应用。有效值：`default`，`short`，`medium`，`long`和`full`。 如果没有指定值，则使用默认值。 |
| timeStyle | String             | 它用于定义由`java.text.DateFormat`指定的时间或日期字符串的时间部分的格式。 仅当类型为时间和模式未定义时才应用。有效值：`default`，`short`，`medium`，`long`和`full`。如果没有指定值，则使用默认值。 |
| timeZone  | String 或 TimeZone | 它用于解释日期字符串中任何时间信息的时区。                   |
| type      | String             | 它用于指定字符串值是否包含日期，时间或两者。有效值是日期，时间或两者。 如果未指定值，则使用日期。 |

*result.xhtml* 的代码内容如下所示:

```html
<?xml version='1.0' encoding='UTF-8' ?>  
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">  
<html xmlns="http://www.w3.org/1999/xhtml"  
      xmlns:h="http://xmlns.jcp.org/jsf/html"  
      xmlns:f="http://java.sun.com/jsf/core">  

    <h:head>  
        <title>Response Page</title>  
    </h:head>  
    <h:body>  
        <h:outputLabel value="Your date of birth in different-different formats is given below:"></h:outputLabel><br/>
      
      	<!-- 1990-6-1 -->
        <h:outputText value="#{user.dob}">  
            <f:convertDateTime type="date" dateStyle="medium"/>  
        </h:outputText>  
        <br/>  
      
      	<!-- 1990年6月1日 金曜日 -->
        <h:outputText value="#{user.dob}">  
            <f:convertDateTime type="date" dateStyle="full"/>  
        </h:outputText>  
        <br/>  
      
      	<!-- 0:09:00 -->
        <h:outputText value="#{user.dob}">  
            <f:convertDateTime type="time" dateStyle="full"/>  
        </h:outputText>  
        <br/>  
      
      	<!-- 01/06/1990 -->
        <h:outputText value="#{user.dob}">  
            <f:convertDateTime type="date" pattern="dd/mm/yyyy"/>  
        </h:outputText>  
        <br/> 
      	
      	<!-- 1990-06-01 -->
        <h:outputText value="#{user.dob}">  
            <f:convertDateTime dateStyle="full" pattern="yyyy-mm-dd"/>  
        </h:outputText>  
        <br/>  
      	
      	<!-- 1990.06.01 at 00:09:00 GMT -->
        <h:outputText value="#{user.dob}">  
            <f:convertDateTime dateStyle="full" pattern="yyyy.MM.dd 'at' HH:mm:ss z"/>  
        </h:outputText>  
        <br/>  
      
       <!-- 12:09 AM -->
        <h:outputText value="#{user.dob}">  
            <f:convertDateTime dateStyle="full" pattern="h:mm a"/>  
        </h:outputText>  
        <br/>  
      
      	<!-- 1990年6月1日 12:09:00 -->
        <h:outputText value="#{user.dob}">  
            <f:convertDateTime dateStyle="long" timeZone="EST" type="both"/>  
        </h:outputText>  
        <br/>  
      
      	<!-- Donnerstag, 1, June 1990 00:09:00 GMT -->
        <h:outputText value="#{user.dob}">  
            <f:convertDateTime locale="de" timeStyle="long" type="both" dateStyle="full"/>  
        </h:outputText>  
        <br/>  
      
      	<!-- Friday, June 1, 1990 12:09 AM -->
        <h:outputText value="#{user.dob}">  
            <f:convertDateTime locale="en" timeStyle="short" type="both" dateStyle="full"/>  
        </h:outputText>  
    </h:body>  
</html>
```



### <f:converter>

我们可以在 JSF 中创建自定义转换器的步骤。

1. 通过实现`javax.faces.convert.Converter`接口创建一个转换器类。
2. 实现上述接口的`getAsObject()`和`getAsString()`方法。
3. 使用注解`@FacesConvertor`为自定义转换器分配唯一的ID。



*index.xhtml* 的代码:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core">
    <h:body>
        <h:form>
            <h:panelGrid columns="3">
                Enter your bookmark URL :
                <h:inputText id="bookmarkURL" value="#{user.bookmarkURL}" size="40" required="true" label="Bookmark URL">
                    <f:converter converterId="com.demo.URLConverter" />
                </h:inputText>
                <h:message for="bookmarkURL" style="color:red" />
            </h:panelGrid>
            <h:commandButton value="Submit" action="result" />
        </h:form>
    </h:body>
</html>
```

*result.xhtml* 的代码:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      xmlns:c="http://java.sun.com/jsp/jstl/core"
      >
    <h:body>
        <h:panelGrid columns="2">
            Bookmark URL :  
            <h:outputText value="#{user.bookmarkURL}" />
        </h:panelGrid>
    </h:body>
</html>
```

*User.java* 的代码:

```java
package com.demo;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.convert.Converter;
import javax.faces.convert.ConverterException;
import javax.faces.convert.FacesConverter;

@FacesConverter("com.demo.URLConverter")
public class URLConverter implements Converter {

    @Override
    public Object getAsObject(FacesContext context, UIComponent component,
            String value) {

        String HTTP = "http://";
        StringBuilder url = new StringBuilder();

        if (!value.startsWith(HTTP, 0)) {
            url.append(HTTP);
        }
        url.append(value);

        if (url.toString().length() > 30) {
            FacesMessage msg
                    = new FacesMessage("URL Conversion error.",
                            "Invalid URL format.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ConverterException(msg);
        }
        return url.toString();
    }

    @Override
    public String getAsString(FacesContext context, UIComponent component,
            Object value) {

        return value.toString();
    }
}
```



# JSF 验证器标签

JSF有内置的验证器验证其UI组件。验证器标签可以验证可以是自定义对象的字段长度，输入类型。

我们必须在`html`节点中使用URI的以下命名空间来包含验证器标签。

```html
<html 
   xmlns="http://www.w3.org/1999/xhtml" 
   xmlns:f="http://java.sun.com/jsf/core">
</html>
```



### <f:validateLength>

用于验证字符串值的长度。

```html
<f:validateLength minimum="5" maximum="8" />
```

*index.xhtml* 的代码:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      xmlns:c="http://java.sun.com/jsp/jstl/core">
    <h:body>
        <h:form>
            <h:panelGrid columns="3">
                Enter UserName : 
                <h:inputText id="username" value="#{user.username}" 
                             size="20" required="true"
                             label="UserName" >
                    <f:validateLength minimum="5" maximum="10" />
                </h:inputText>
                <h:message for="username" style="color:red" />
            </h:panelGrid>
            <h:commandButton value="Submit" action="result" />
        </h:form>
    </h:body>
</html>
```



### <f:validateLongRange>

用于验证特定范围内的长值。

```html
<f:validateLongRange minimum="5" maximum="200" />
```

**标签属性**

| 属性    | 说明                   |
| ------- | ---------------------- |
| minimum | 在可选范围内最小长度值 |
| maximum | 在可选范围内最大长度值 |

*index.xhtml* 的代码:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      xmlns:c="http://java.sun.com/jsp/jstl/core"
      >
    <h:body>
        <h:form>
            <h:panelGrid columns="3">
                Enter your age : 
                <h:inputText id="age" value="#{user.age}" 
                             size="10" required="true"
                             label="Age" >
                    <f:validateLongRange maximum="10" minimum="1" />
                </h:inputText>
                <h:message for="age" style="color:red" />
            </h:panelGrid>
            <h:commandButton value="Submit" action="result" />
        </h:form>
    </h:body>
</html>
```



### <f:validateDoubleRange>

用于验证一个浮点(`float/double`)值的范围。

```html
<f:validateDoubleRange minimum="1000.50" maximum="10000.50" />
```

**标签属性**

| 属性    | 说明                   |
| ------- | ---------------------- |
| minimum | 在可选范围内最小长度值 |
| maximum | 在可选范围内最大长度值 |

*index.xhtml* 的代码:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core">
    <h:body>
        <h:form>
            <h:panelGrid columns="3">
                Enter a double value: 
                <h:inputText id="salary" value="#{user.salary}" 
                             size="10" required="true"
                             label="Salary" >
                    <f:validateDoubleRange minimum="10.11" maximum="10000.99" />
                </h:inputText>
                <h:message for="salary" style="color:red" />
            </h:panelGrid>
            <h:commandButton value="Submit" action="result" />
        </h:form>
    </h:body>
</html>
```



### <f:validateRegex>

用于将字符串值验证为所需格式。

```html
<f:validateRegex pattern="((?=.*[a-z]).{6,})" />
```

**标签属性**

| 属性    | 说明       |
| ------- | ---------- |
| pattern | 格式化模式 |

*index.xhtml* 的代码:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core">
    <h:body>
        <h:form>
            <h:panelGrid columns="3">
                Enter your password : 
                <h:inputSecret id="password" value="#{user.password}" 
                               size="20" required="true"
                               label="Password">
                    <f:validateRegex pattern="\d\d\d\d" />
                </h:inputSecret>
                <h:message for="password" style="color:red" />
            </h:panelGrid>
            <h:commandButton value="Submit" action="result" />
        </h:form>
    </h:body>
</html>
```



### <f:validator>

我们可以在 JSF 中创建自定义验证器。

- 通过实现`javax.faces.validator.Validator`接口创建一个验证器类。
- 实现上面接口的`validate()`方法。
- 使用注释`@FacesValidator`为自定义验证器分配唯一的ID。



*index.xhtml* 的代码:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core">
    <h:body>
        <h:form>
            <h:panelGrid columns="3">
                Enter your email :
                <h:inputText id="email" value="#{user.email}" 
                             size="20" required="true" label="Email Address">
                    <f:validator validatorId="com.demo.EmailValidator" />
                </h:inputText>
                <h:message for="email" style="color:red" />
            </h:panelGrid>
            <h:commandButton value="Submit" action="result" />
        </h:form>
    </h:body>
</html>
```

*EmailValidator.java* 的代码内容如下所示 -

```java
package com.demo;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator("com.demo.EmailValidator")
public class EmailValidator implements Validator {

    private static final String EMAIL_PATTERN = "^[_A-Za-z0-9-]+(\\."
            + "[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*"
            + "(\\.[A-Za-z]{2,})$";

    private Pattern pattern;
    private Matcher matcher;

    public EmailValidator() {
        pattern = Pattern.compile(EMAIL_PATTERN);
    }

    @Override
    public void validate(FacesContext context, UIComponent component,
            Object value) throws ValidatorException {

        matcher = pattern.matcher(value.toString());
        if (!matcher.matches()) {

            FacesMessage msg
                    = new FacesMessage("E-mail validation failed.",
                            "Invalid E-mail format.");
            msg.setSeverity(FacesMessage.SEVERITY_ERROR);
            throw new ValidatorException(msg);
        }
    }
}
```



# JSF 表格标签

### <h:dataTable>

JSF中有一个叫作`DataTable`的控件，可用来渲染和格式化`html`表格。使用`DataTable`，我们可以迭代收集或数组数组来显示数据。

`DataTable`具有以简单的方式修改其数据的属性。

要使用`DataTable`，我们需要添加以下HTML头。

```html
<html 
   xmlns="http://www.w3.org/1999/xhtml"   
   xmlns:h="http://java.sun.com/jsf/html">
</html>
```

JSF 表格：

```html
<h:dataTable value="#{userData.employees}" var="employee"
   styleClass="employeeTable"
   headerClass="employeeTableHeader"
   rowClasses="employeeTableOddRow,employeeTableEvenRow">
   <h:column>            
      <f:facet name="header">Name</f:facet>            
      #{employee.name}
   </h:column>
   <h:column>
      <f:facet name="header">Department</f:facet>
      #{employee.department}
   </h:column>
   <h:column>
      <f:facet name="header">Age</f:facet>
      #{employee.age}
   </h:column>
   <h:column>
      <f:facet name="header">Salary</f:facet>
      #{employee.salary}
   </h:column>
   <h:column>
      <f:facet name="header">Action</f:facet>
         <h:commandLink value="Delete" action="#{userData.deleteAction(employee)}" />
   </h:column>
</h:dataTable>
```

被渲染成以下HTML标签:

```html
<table class="employeeTable">
<thead><tr>
   <th class="employeeTableHeader" scope="col">Name</th>
   <th class="employeeTableHeader" scope="col">Department</th>
   <th class="employeeTableHeader" scope="col">Age</th>
   <th class="employeeTableHeader" scope="col">Salary</th>
   <th class="employeeTableHeader" scope="col">Action</th>
</tr></thead>
<tbody>
<tr class="employeeTableOddRow">
   <td>Tom</td>
   <td>Marketing</td>
   <td>10</td>
   <td>2000.0</td>
   <td><a href="">Delete</a></td>
</tr>
<tr class="employeeTableEvenRow">
   <td>Robert</td>
   <td>Marketing</td>
   <td>15</td>
   <td>1000.0</td>
   <td><a href="">Delete</a></td>
</tr>
</table>
```



#### 添加删除

*index.xhtml* 的代码:

```html
<h:form>
	<h:dataTable value="#{book.bookList}" var="o" styleClass="book-table" headerClass="book-table-header" rowClasses="book-table-odd-row,book-table-even-row">
		<h:column>
			<f:facet name="header">Book No</f:facet>#{o.bookNo}
		</h:column>
		<h:column>
			<f:facet name="header">Product Name</f:facet>#{o.productName}
		</h:column>
		<h:column>
			<f:facet name="header">Price</f:facet>#{o.price}
		</h:column>
		<h:column>
			<f:facet name="header">Quantity</f:facet>#{o.qty}
		</h:column>
		<h:column>
			<f:facet name="header">Action</f:facet>
			<h:commandLink value="Delete" action="#{book.deleteAction(o)}" />
		</h:column>
	</h:dataTable>
	<h3>Enter Book</h3>
  <table>
		<tr>
			<td>Book No :</td>
			<td><h:inputText size="20" value="#{book.bookNo}" /></td>
		</tr>
		<tr>
			<td>Product Name :</td>
			<td><h:inputText size="20" value="#{book.productName}" /></td>
		</tr>
		<tr>
			<td>Quantity :</td>
			<td><h:inputText size="20" value="#{book.price}" /></td>
		</tr>
		<tr>
			<td>Price :</td>
			<td><h:inputText size="20" value="#{book.qty}" /></td>
		</tr>
	</table>
	<h:commandButton value="Add" action="#{book.addAction}" />
</h:form>
```

*User.java* 的代码:

```java
    public String addAction() {
        Book book = new Book(this.bookNo, this.productName,
                this.price, this.qty);
        bookList.add(book);
        return null;
    }

    public String deleteAction(Book book) {

        bookList.remove(book);
        return null;
    }
```



#### **更新数据**

*index.xhtml* 的代码:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      xmlns:ui="http://java.sun.com/jsf/facelets"
      >
    <h:head>
        <h:outputStylesheet library="css" name="table-style.css"  />
    </h:head>
    <h:body>
        <h1>JSF 2 dataTable example</h1>
        <h:form>
            <h:dataTable value="#{book.bookList}" var="o" styleClass="book-table" headerClass="book-table-header" rowClasses="book-table-odd-row,book-table-even-row">
                <h:column>
                    <f:facet name="header">Book No</f:facet>
                    <h:inputText value="#{o.bookNo}" size="10" rendered="#{o.editable}" />
                    <h:outputText value="#{o.bookNo}" rendered="#{not o.editable}" />
                </h:column>
                <h:column>
                    <f:facet name="header">Product Name</f:facet>
                    <h:inputText value="#{o.productName}" size="20" rendered="#{o.editable}" />
                    <h:outputText value="#{o.productName}" rendered="#{not o.editable}" />
                </h:column>
                <h:column>
                    <f:facet name="header">Price</f:facet>
                    <h:inputText value="#{o.price}" size="10" rendered="#{o.editable}" />
                    <h:outputText value="#{o.price}" rendered="#{not o.editable}" />
                </h:column>
                <h:column>
                    <f:facet name="header">Quantity</f:facet>
                    <h:inputText value="#{o.qty}" size="5" rendered="#{o.editable}" />
                    <h:outputText value="#{o.qty}" rendered="#{not o.editable}" />
                </h:column>
                <h:column>
                    <f:facet name="header">Action</f:facet>
                    <h:commandLink value="Edit" action="#{book.editAction(o)}" rendered="#{not o.editable}" />
                </h:column>
            </h:dataTable>
            <h:commandButton value="Save Changes" action="#{book.saveAction}" />
        </h:form>
    </h:body>
</html>
```

*User.java* 的代码：

```java
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

@ManagedBean(name = "book")
@SessionScoped
public class User implements Serializable {

    private static final long serialVersionUID = 1L;
    private static final ArrayList<Book> bookList
            = new ArrayList<Book>(Arrays.asList(
                    new Book("1", "CSS", new BigDecimal("722.22"), 1),
                    new Book("2", "HTML", new BigDecimal("533.33"), 2),
                    new Book("3", "Java", new BigDecimal("11444.44"), 8),
                    new Book("4", "Javascript", new BigDecimal("5255.55"), 3),
                    new Book("5", "SQL", new BigDecimal("166.66"), 10)
            ));

    public ArrayList<Book> getBookList() {
        return bookList;
    }

    public String saveAction() {
        //get all existing value but set "editable" to false 
        for (Book book : bookList) {
            book.setEditable(false);
        }
        //return to current page
        return null;
    }

    public String editAction(Book book) {
        book.setEditable(true);
        return null;
    }

    public static class Book {

        String bookNo;
        String productName;
        BigDecimal price;
        int qty;
        boolean editable;

        public Book(String bookNo, String productName, BigDecimal price, int qty) {
            this.bookNo = bookNo;
            this.productName = productName;
            this.price = price;
            this.qty = qty;
        }

        public boolean isEditable() {
            return editable;
        }

        public void setEditable(boolean editable) {
            this.editable = editable;
        }

        public String getBookNo() {
            return bookNo;
        }

        public void setBookNo(String bookNo) {
            this.bookNo = bookNo;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public int getQty() {
            return qty;
        }

        public void setQty(int qty) {
            this.qty = qty;
        }
    }
}
```



#### **排序**

*User.java* 的代码:

```java
//sort by book no
    public String sortByBookNo() {
        if (sortAscending) {
            //ascending book
            Collections.sort(bookArrayList, new Comparator<Book>() {
                @Override
                public int compare(Book o1, Book o2) {
                    return o1.getBookNo().compareTo(o2.getBookNo());
                }
            });
            sortAscending = false;
        } else {
            //descending book
            Collections.sort(bookArrayList, new Comparator<Book>() {
                @Override
                public int compare(Book o1, Book o2) {
                    return o2.getBookNo().compareTo(o1.getBookNo());
                }
            });
            sortAscending = true;
        }
        return null;
    }
```

*index.xhtml* 的代码：

```html
<h:form>
  <h:dataTable value="#{book.bookList}" var="o" styleClass="book-table" headerClass="book-table-header" rowClasses="book-table-odd-row,book-table-even-row">
		<h:column>
			<f:facet name="header">
				<h:commandLink action="#{book.sortByBookNo}">
           Book No
         </h:commandLink>
       </f:facet>
         #{o.bookNo}
		</h:column>

		<h:column>
       <f:facet name="header">
         Product Name
       </f:facet>
         #{o.productName}
		</h:column>
	</h:dataTable>
</h:form>
```



### <ui:repeat>

使用 ui:repeat 标签创建表格。

`User.java` 文件中的代码 - 

```java
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

@ManagedBean(name="book")
@SessionScoped
public class User implements Serializable{

  private static final long serialVersionUID = 1L;

  private static final ArrayList<Book> bookList = 
    new ArrayList<Book>(Arrays.asList(
    new Book("1", "CSS", new BigDecimal("711.00"), 1),
    new Book("2", "SQL", new BigDecimal("522.00"), 2),
    new Book("3", "Java", new BigDecimal("13333.00"), 8),
    new Book("4", "HTML", new BigDecimal("5244.00"), 3),
    new Book("5", "Web", new BigDecimal("441.00"), 10)
  ));

  public ArrayList<Book> getBookList() {
    return bookList;
  }
  public String deleteAction(Book book) {
    bookList.remove(book);
    return null;
  }

  public static class Book{

    String bookNo;
    String productName;
    BigDecimal price;
    int qty;

    public Book(String bookNo, String productName, 
        BigDecimal price, int qty) {
      this.bookNo = bookNo;
      this.productName = productName;
      this.price = price;
      this.qty = qty;
    }

    public String getBookNo() {
      return bookNo;
    }

    public void setBookNo(String bookNo) {
      this.bookNo = bookNo;
    }

    public String getProductName() {
      return productName;
    }

    public void setProductName(String productName) {
      this.productName = productName;
    }

    public BigDecimal getPrice() {
      return price;
    }

    public void setPrice(BigDecimal price) {
      this.price = price;
    }

    public int getQty() {
      return qty;
    }

    public void setQty(int qty) {
      this.qty = qty;
    }

  }
}
```

以下是文件：`index.xhtml` 文件中的代码 - 

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"   
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:ui="http://java.sun.com/jsf/facelets"
      xmlns:c="http://java.sun.com/jsp/jstl/core"
      >
    <h:body>
        <table class="book-table">
          <tr>
            <th>Book No</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
          <tbody>
            <ui:repeat var="o" value="#{book.bookList}" varStatus="status">
              <h:panelGroup rendered="#{status.even}">
                <tr>
                  <td>#{o.bookNo}</td>
                  <td>#{o.productName}</td>
                  <td>#{o.price}</td>
                  <td>#{o.qty}</td>
                </tr>
              </h:panelGroup>
              <h:panelGroup rendered="#{status.odd}">
                <tr>
                  <td>#{o.bookNo}</td>
                  <td>#{o.productName}</td>
                  <td>#{o.price}</td>
                  <td>#{o.qty}</td>
                </tr>
              </h:panelGroup>
            </ui:repeat>
          </tbody>
        </table>
    </h:body>
</html>
```



# 事件处理

### JSF 值变化的事件

#### <f:valueChangeListener>

在JSF中，我们可以处理`<h:inputText>`或`<h:selectOneMenu>`的值变化的事件。

要注册事件处理程序侦听器，请在UI组件的`valueChangeListener`属性中传递托管 bean 方法的名称。

或者实现`ValueChangeListener`接口，并将实现类名传递给UI组件的`valueChangeListener`属性。

以下代码显示了如何将托管Bean的方法注册到`valueChangeListener`方法。

```java
public void localeChanged(ValueChangeEvent e){
   //assign new value to country
   selectedCountry = e.getNewValue().toString(); 
}
```

**注册方法**

```html
<h:selectOneMenu value="#{userData.selectedCountry}" onchange="submit()" 
   valueChangeListener="#{userData.localeChanged}" >
   <f:selectItems value="#{userData.countries}" />
</h:selectOneMenu>
```

以下代码显示了如何实现`ValueChangeListener`监听器方法。

```java
public class LocaleChangeListener implements ValueChangeListener {
   @Override
   public void processValueChange(ValueChangeEvent event)
      throws AbortProcessingException {
     //access country bean directly
     UserData userData = (UserData) FacesContext.getCurrentInstance().
        getExternalContext().getSessionMap().get("userData"); 
     userData.setSelectedCountry(event.getNewValue().toString());
   }
}
```

并注册到`<f:valueChangeListener>`标签。

```html
<h:selectOneMenu value="#{userData.selectedCountry}" onchange="submit()">
   <f:valueChangeListener type="com.demo.test.LocaleChangeListener"
      />
   <f:selectItems value="#{userData.countries}" />
</h:selectOneMenu>
```



### JSF 操作事件

#### f:actionListener

在 JSF 中，我们可以处理如`<h:commandButton>`或`<h:link>`组件的用户点击事件。要注册事件处理程序，我们可以在 UI 组件的`actionListener`属性中传递托管 bean 方法的名称。

或者也可以选择实现`ActionListener`接口，并将实现类名称传递给 UI 组件的`actionListener`属性。

以下代码显示了如何从`<h:commandButton>`向`actionListener`属性添加用户定义的方法。

```java
public void updateData(ActionEvent e){
   data="Hello World";
}
```

使用上述方法

```html
<h:commandButton id="submitButton" 
   value="Submit" action="#{userData.showResult}"
   actionListener="#{userData.updateData}" />
</h:commandButton>
```

以下代码显示了如何实现`ActionListener`并使用`f:actionListener`标签。

```java
public class UserActionListener implements ActionListener{
   @Override
   public void processAction(ActionEvent arg0)
   throws AbortProcessingException {
      //access userData bean directly
      UserData userData = (UserData) FacesContext.getCurrentInstance().
         getExternalContext().getSessionMap().get("userData"); 
      userData.setData("Hello World");
   }
}
```

使用侦听器方法 -

```html
<h:commandButton id="submitButton1" 
   value="Submit" action="#{userData.showResult}" >
   <f:actionListener type="com.demo.test.UserActionListener" />
</h:commandButton>
```



### 预构建应用程序事件

JSF 在 JSF 应用程序生命周期中有处理应用程序特定任务的系统事件侦听器。

- 应用程序启动时触发 PostConstructApplicationEvent。它可以用于在应用程序启动后执行初始化任务。
- 应用程序即将关闭时，PreDestroyApplicationEvent 触发。它可以用于在应用程序即将关闭之前执行清除任务。
- PreRenderViewEvent 在显示 JSF 页面之前触发。它可用于验证用户并提供对 JSF View 的受限访问。

我们可以通过实现 SystemEventListener 接口来处理系统级事件，并在 faces-config.xml 中注册 system-event-listener 类。

我们还可以通过传递 f:event 的监听器属性中的托管 bean 方法的名称来使用方法绑定来处理系统级事件。

以下代码显示了如何实现 SystemEventListener 接口。

```java
public class CustomSystemEventListener implements SystemEventListener {
   @Override
   public void processEvent(SystemEvent event) throws 
      AbortProcessingException {
      if(event instanceof PostConstructApplicationEvent){
         System.out.println("Application Started. 
            PostConstructApplicationEvent occurred!");
      }      
   }
}
```

然后我们可以在faces-config.xml中注册系统事件的自定义系统事件侦听器

```xml
<system-event-listener>
   <system-event-listener-class>
      cn.w3cschool.common.CustomSystemEventListener
   </system-event-listener-class>
   <system-event-class>
      javax.faces.event.PostConstructApplicationEvent
   </system-event-class>              
</system-event-listener>
```

下面的代码显示了处理系统级事件的方法绑定方式。

```java
public void handleEvent(ComponentSystemEvent event){
   data="Hello World";
}
```

使用上面的方法

```html
<f:event listener="#{user.handleEvent}" type="preRenderView" />
```





# Facelets 技术

**Facelets **是一种轻量级的页面声明语言，用于使用 HTML 样式构建 JSF(JavaServer Faces)视图。

它包括以下功能：

- 它使用 XHTML 创建网页。
- 除了支持 JavaServer Faces 和 JSTL 标记库之外，它还支持 Facelets 标签库。
- 它支持表达语言(EL)。
- 它是使用组件和页面的模板。



下表显示了Facelets支持的标签库。

| 标签库             | URI                                     | 前缀   | 示例                               | 内容                                        |
| ------------------ | --------------------------------------- | ------ | ---------------------------------- | ------------------------------------------- |
| JSF Facelets标签库 | http://xmlns.jcp.org/jsf/facelets       | `ui:`  | `ui:component`，`ui:insert`        | 模板标签                                    |
| JSF HTML标签库     | http://xmlns.jcp.org/jsf/html           | `h:`   | `h:head`,`h:body`                  | 所有UI组件对象的JavaServer Faces组件标记    |
| JSF核心标签库      | http://xmlns.jcp.org/jsf/core           | `f:`   | `f:actionListener`, `f:attribute`  | JSF标签独立于任何特定渲染工具包的自定义操作 |
| 传递元素标签库     | http://xmlns.jcp.org/jsf                | `jsf:` | `jsf:id`                           | 支持HTML5友好标记的标签                     |
| 传递属性标签库     | http://xmlns.jcp.org/jsf/passthrough    | `p:`   | `p:type`                           | 支持HTML5友好标记的标签                     |
| 复合组件标签库     | http://xmlns.jcp.org/jsf/composite      | `cc:`  | `cc:interface`                     | 支持复合组件的标签                          |
| JSTL核心标签库     | http://xmlns.jcp.org/jsp/jstl/core      | `c:`   | `c:forEach`, `c:catch`             | JSTL 1.2核心标签                            |
| JSTL函数标签库     | http://xmlns.jcp.org/jsp/jstl/functions | `fn:`  | `fn:toUpperCase`, `fn:toLowerCase` | JSTL 1.2函数标签                            |



### Facelets 的生命周期

JSF规范定义了JavaServer Faces应用程序的生命周期。以下步骤为基于 **Facelets** 的应用程序的过程描述。

1. 生命周期是在客户端使用`Facelets`创建的网页发出新请求时启动。 JSF创建一个新的组件树或`javax.faces.component.UIViewRoot`并放入`FacesContex`。
2. 如果可用的`UIViewRoot`应用于`Facelets`， 视图可以填充组件进行渲染。
3. 新建的视图作为对客户端的响应而被渲染。
4. 在渲染时，存储此视图的状态用于下一个请求。 存储输入组件和表单数据的状态。
5. 客户端可以与视图交互，并从JSF应用程序请求另一个视图。 此时，保存的视图从存储状态恢复。
6. 恢复视图再次通过JSF生命周期，如果没有验证问题，并且没有触发任何操作，最终将生成新视图或重新呈现当前视图。
7. 如果请求相同的视图，则再次呈现存储的视图。
8. 如果要求新视图，则继续执行【**步骤2**】。
9. 将新视图作为对客户端的响应。



### Facelets 视图

Facelets 视图是`XHTML`页面。 您可以通过向页面添加组件来创建网页或视图，将组件连接到后端`bean`的值和属性，并在组件上注册转换器，验证器或侦听器。

`XHTML`网页作为前端。 您的应用程序的第一页默认为`index.xhtml`。

网页(如，在`index.xhtml`中)的第一部分声明页面的内容类型，即 XHTML：

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!--
在下一段中指定`XHTML`页面的语言，然后声明网页中使用的标签库的XML命名空间。
-->

<html lang="en"  
xmlns="http://www.w3.org/1999/xhtml"  
xmlns:h="http://xmlns.jcp.org/jsf/html"  
xmlns:f="http://xmlns.jcp.org/jsf/core">
```

完整的 *index.xhtml* 代码:

```html
<?xml version='1.0' encoding='UTF-8' ?>  
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">  
<html xmlns="http://www.w3.org/1999/xhtml"  
xmlns:h="http://xmlns.jcp.org/jsf/html"  
xmlns:f="http://xmlns.jcp.org/jsf/core">  
<h:head>  
    <title>Jsf Form</title>  
</h:head>  
    <h:body>  
        <h:form id="form">  
        <h:outputLabel for="username">User Name</h:outputLabel>  
        <h:inputText id="name" value="#{user.name}" required="true">  
        <f:validateRequired for="name" />  
        </h:inputText><br/>  
        <h:commandButton value="OK" action="response.xhtml"></h:commandButton>  
        </h:form>  
    </h:body>  
</html>
```

Facelets HTML标签以`h:`开头，用于在网页和核心标签上添加组件`f:validateRequired`用于验证用户输入。

`h:inputText`标签接受用户输入，并通过EL表达式`#{user.name}`设置托管`bean`属性名称的值。



### 映射 Faces Servlet

通过将 Web 部署描述符文件中的 Faces Servlet 映射到`web.xml`文件中来完成 JavaServer Faces 应用程序的配置。

一个自动生成的`web.xml`文件的内容。

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<web-app version="3.1" xmlns="http://xmlns.jcp.org/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd">  
	<context-param>  
		<param-name>javax.faces.PROJECT_STAGE</param-name>  
		<param-value>Development</param-value>  
	</context-param>  
	<servlet>  
		<servlet-name>Faces Servlet</servlet-name>  
		<servlet-class>javax.faces.webapp.FacesServlet</servlet-class>  
		<load-on-startup>1</load-on-startup>  
	</servlet>  
	<servlet-mapping>  
		<servlet-name>Faces Servlet</servlet-name>  
		<url-pattern>/faces/*</url-pattern>  
	</servlet-mapping>  
	<session-config>  
		<session-timeout>30</session-timeout>  
	</session-config>  
	<welcome-file-list>  
		<welcome-file>faces/index.xhtml</welcome-file>  
	</welcome-file-list>  
</web-app>
```



### Facelets 模板

`Facelets`模板是提供实现用户界面的工具的工具。 模板化是一个有用的`Facelets`功能，允许您创建一个页面，作为应用程序中其他页面的基础。 通过使用模板，您可以重用代码，并避免重复类似的页面。模板化还有助于简化在具有大量页面的应用程序中维护标准外观和感觉。

下表包含用于创建模板的Facelets标签。

**模板标签**

| 标签             | 功能                                                         |
| ---------------- | ------------------------------------------------------------ |
| `ui:component`   | 它用于定义创建并添加到组件树的组件。                         |
| `ui:composition` | 它用于定义可选地使用模板的页面组合，此标记之外的内容将被忽略。 |
| `ui:debug`       | 它用于定义创建并添加到组件树的调试组件                       |
| `ui:decorate`    | 它与组合标签类似，但不会忽略此标记之外的内容。               |
| `ui:define`      | 它用于定义由模板插入到页面中的内容。                         |
| `ui:fragment`    | 它与组件标签类似，但不会忽略此标记之外的内容。               |
| `ui:include`     | 它用于封装和重用多个页面的内容。                             |
| `ui:insert`      | 它用于将内容插入到模板中。                                   |
| `ui:param`       | 它用于将参数传递给包含的文件。                               |
| `ui:repeat`      | 它用作循环标签的替代方法，例如：`c:forEach`或`h:dataTable`。 |
| `ui:remove`      | 它用于从页面中删除内容。                                     |



Facelets 标签库包括主模板标签 `ui:insert`。 使用此标签创建的模板页面允许为页面定义默认结构。 我们可以使用模板页面作为其他页面的模板。

*template.xhtml* 中的代码：

```html
<?xml version='1.0' encoding='UTF-8' ?> 
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:ui="http://xmlns.jcp.org/jsf/facelets"
      xmlns:h="http://xmlns.jcp.org/jsf/html">

    <h:head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <h:outputStylesheet name="./css/default.css"/>
        <h:outputStylesheet name="./css/cssLayout.css"/>
        <title>Facelets Template</title>
    </h:head>
    <h:body>
        <div id="top" class="top">
            <ui:insert name="top">Top</ui:insert>
        </div>
        <div>
            <div id="left">
                <ui:insert name="left">Left</ui:insert>
            </div>
            <div id="content" class="left_content">
                <ui:insert name="content">Content</ui:insert>
            </div>
        </div>
    </h:body>

</html>


HTML
```

上述模板文件分为四个部分：顶部，左部分，内容部分。 我们可以对应用程序的其他页面进一步重用此结构。

*index.xhtml* 中的代码：

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">  
<html xmlns="http://www.w3.org/1999/xhtml"  
      xmlns:h="http://xmlns.jcp.org/jsf/html"  
      xmlns:ui="http://xmlns.jcp.org/jsf/facelets">  
    <h:head>  
        <meta http-equiv="Content-Type"  
              content="text/html; charset=UTF-8" />  
        <h:outputStylesheet library="css" name="default.css"/>  
        <h:outputStylesheet library="css" name="cssLayout.css"/>  
        <title>Facelets Template Example</title>  
    </h:head>  
    <h:body>  
        <ui:composition template="./template.xhtml">  
            <ui:define name="top">  
                <h:graphicImage value="/resources/images/header.png"/>  
            </ui:define>  

            <ui:define name="left">  
                <h:graphicImage value="/resources/images/left.png"/>  
            </ui:define>  

            <ui:define name="content">  
                <h:graphicImage value="/resources/images/right.png"/>  
            </ui:define>  

        </ui:composition>  
    </h:body>  
</html>
```



### JSF 复合组件

JSF 通过 Facelets 提供复合组件(有点类似于`Widget`)的概念。复合组件是一种特殊类型的模板，它充当应用程序中的一个组成部分。

复合组件由标记标签和其他现有组件组成。 这个可重复使用的用户创建的组件具有定制的定义功能，并且可以像任何其他组件一样具有连接到它的验证器，转换器和监听器。 包含标记标签和其他组件的任何 XHTML 页面都可以转换为复合组件。

在创建组合组件之前，请确保使用正确的命名空间，如下所示。

```html
<html xmlns="http://www.w3.org/1999/xhtml"  
      xmlns:composite="http://xmlns.jcp.org/jsf/composite"
</html>
```



以下表格包含复合标签以及说明:

| 标签                            | 功能                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `composite:interface`           | 它用于声明复合组件的约定。 组合组件可以用作单个组件，其特征集合是使用合同中声明的功能的并集。 |
| `composite:implementation`      | 它用于定义复合组件的实现。 如果`composite:interface`元素存在，必须有一个相应的`composite:implementation`。 |
| `composite:attribute`           | 它用于声明一个属性，该属性可以被赋予该标签被声明的复合组件的一个实例。 |
| `composite:insertChildren`      | 它用于在使用页面中的复合组件标签中插入子组件。               |
| `composite:valueHolder`         | 它用于声明由该元素嵌套的`composite:interface`声明其合同的组合组件暴露了适用于使用页面中附加对象目标的`ValueHolder`实现。 |
| `composite:editableValueHolder` | 它用于声明由该元素嵌套的`composite:interface`声明其合同的组合组件暴露了适用于使用页面中附加对象目标的`EditableValueHolder`的实现。 |
| `composite:actionSource`        | 它用于声明由该元素嵌套的`composite:interface`声明其约定的组合组件，暴露了适用于使用页面中附加对象目标的`ActionSource`实现。 |



#### 创建复合组件

创建一个文件：`composite-component.xhtml`，代码如下:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">  
<html xmlns="http://www.w3.org/1999/xhtml"  
      xmlns:composite="http://xmlns.jcp.org/jsf/composite"  
      xmlns:h="http://xmlns.jcp.org/jsf/html">  
    <h:head>  
        <title>Composite Component Example</title>  
    </h:head>  

    <h:body>
        <h2>In composite-component.xhtml Form</h2>
        <composite:interface>  
            <composite:attribute name="username" required="false"/>  
            <composite:attribute name="email" required="false"/>  
        </composite:interface>  
        <composite:implementation>  
            <h:outputLabel value="User Name " />  
            <h:inputText value="#{cc.attrs.username}"/><br/>  
            <h:outputLabel value="Email ID "/>  
            <h:inputText value="#{cc.attrs.email}"/><br/>  
        </composite:implementation>  
    </h:body>  
</html>
```

在上面的例子中，`composite:interface`标签用于声明可配置的值。 `composite:implementation`标签用于声明所有XHTML标记和`cc.attrs.username`用于定义`inputText`组件的值。 ccs是JSF中复合组件的保留字。 表达式`#{cc.attrs.attribute-name}`用于访问为组合组件界面定义的属性。

上述代码作为名为`composite-component.xhtml`的文件存储在应用程序Web根目录的 `resources/com` 文件夹中。



#### 使用复合组件

使用复合组件的网页通常称为使用页面。 使用页面包含对`xml`命名空间声明中复合组件的引用，如下所示：

```html
<html xmlns:co="http://xmlns.jcp.org/jsf/composite/com">


HTML
```

这里，`com`是存储文件的文件夹，`co`是用于访问组件的引用。

创建一个文件：`index.xhtml`，代码如下:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">  
<html xmlns="http://www.w3.org/1999/xhtml"  
      xmlns:h="http://xmlns.jcp.org/jsf/html"  
      xmlns:co="http://xmlns.jcp.org/jsf/composite/com">  
    <h:head>  
        <title>Implementing Composite Component</title>  
    </h:head>  
    <body>  
        <h:form>  
            <co:composite-component />  
        </h:form>  
    </body>  
</html>
```

