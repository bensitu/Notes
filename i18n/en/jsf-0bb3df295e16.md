# JSF HTML tags :id=h-470e86bcde9b

Look up tag usage by input, output, conversion, validation, tables, and events.

**Prerequisites and versions:** Read JSF Basics first. This article organizes tags for JSF 2.x. Define user, student, and other Beans as specified in each section; do not assume they are the same global object. Migrate Faces 4 namespaces and Bean management according to that version.

**Using the examples:** Unless a project explicitly lists all files and execution steps, code blocks are independent snippets for each section. Fill in omissions and placeholder names; lines marked as incorrect illustrate problems. Do not combine alternative implementations in the same section.

[Documentation index](README.md) · [Official references](https://javaee.github.io/javaserverfaces/docs/2.3/vdldocs/facelets/)

**Contents**

- [JSF converter tags](#section-1)
- [JSF validator tags](#section-2)
- [JSF table tags](#section-3)
- [Event handling](#section-4)
- [Facelets technology](#section-5)

### `<h:inputText>` :id=h-3c798e6cf4e7

The JSF `<h:inputText>` tag renders an input field on a web page. Use it inside `<h:form>` to declare a field that accepts user data.

```html
<h:inputText id="username" value="#{user.name}" label="username" maxlength="10" size="15" alt="username" autocomplete="off" readonly="false" required="true" requiredMessage="Username is required" style="color:red" accesskey="q">
</h:inputText>
```

The `value` attribute refers to the `name` property of the managed `Bean` named `User`. This property holds the name component's data. When the user submits the form, the `name` property in `User` is set to the text entered in the field corresponding to this tag.

### `<h:inputTextarea>` :id=h-1587b52b09e8

Allows the user to enter a multiline string.

```html
<h:inputTextarea id="text-area-id" value="#{user.address}" required="true"
requiredMessage="Address is required" cols="50" rows="10"></h:inputTextarea>

```

After JSF renders the `<h:inputTextarea>` tag, the result is as follows:

```html
<textarea id="user-form:text-area-id"
name="user-form:text-area-id" cols="50" rows="10">
```

### `<h:inputSecret>` :id=h-9c7f9ed44a14

A password input component that accepts spaces. The browser masks the contents; masking does not mean network traffic is encrypted. Use HTTPS to submit passwords.

```html
<h:inputSecret value="#{user.password}" maxlength="10" size="15"
required="true" requiredMessage="Password is required"></h:inputSecret>
```

After JSF renders the `<h:inputSecret>` tag, the result is as follows:

```html
<input name="user-password" value="" maxlength="10" size="15" type="password">
```

### `<h:inputHidden>` :id=h-bde2fcaf5d7f

The h:inputHidden tag renders an HTML input element with type="hidden".

The following JSF markup

```html
<h:inputHidden value="Hello World" id="hiddenField" />
```

Renders as the following HTML markup.

```html
<input id="jsfForm:hiddenField" type="hidden" name="jsfForm:hiddenField"
   value="Hello World" />
```

### `<h:inputFile>` :id=h-280d17440439

JSF renders it as an HTML element of type file, accepting a file as input. In an HTML form, it allows the user to upload files.

```html
<h:inputFile id="file-id" value="#{user.fileName}" required="true"
requiredMessage="Please upload a file" alt="upload file"></h:inputFile>
```

### `<h:outputText>` :id=h-eb40c75d04a3

Renders plain text. If `styleClass`, `style`, `dir`, or `lang` is present, it renders a `span` element. If `styleClass` is present, its value becomes the `class` attribute value.

```html
<h:outputText value="hello"></h:outputText>

<h:outputText value="hello" lang="en" style="color: red"></h:outputText>
```

Output

```html
hello

<span style="color: red" lang="en">hello</span>
```

### `<h:outputFormat>` :id=h-a23d840bb619

Renders HTML text and accepts parameterized input.

```html
<h:outputFormat value="parameter 1 : {0}, parameter 2 : {1}" >
   <f:param value="Item 1" />
   <f:param value="Item 2" />
</h:outputFormat>
```

Renders as the following HTML code:

```html
parameter 1 : Item 1, parameter 2 : Item 2
```

Example:

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

Code in *index.xhtml*:

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core">
    <h:body>
      <!--  this is param 0 : Number 1, param 1 : Number 2  -->
        <h:outputFormat value="this is param 0 : {0}, param 1 : {1}" >
         <f:param value="Number 1" />
         <f:param value="Number 2" />
       </h:outputFormat>
     <br/>
      <!--  Hello baidu.com  -->
       <h:outputFormat value="#{user.text}" >
         <f:param value="baidu.com" />
       </h:outputFormat>
    <br/>
      <!--  <a href='http://www.baidu.com'>  -->
      <h:outputFormat value="#{user.htmlInput}" >
         <f:param value="text" />
         <f:param value="size='30'" />
       </h:outputFormat>
    <br/>
      <!--  text  -->
      <h:outputFormat value="#{user.htmlInput}" escape="false" >
         <f:param value="text" />
         <f:param value="size='30'" />
       </h:outputFormat>
    <br/>
      <!--  button  -->
      <h:outputFormat value="#{user.htmlInput}" escape="false" >
         <f:param value="button" />
         <f:param value="value='Click Me'" />
       </h:outputFormat>
    </h:body>
</html>
```

### `<h:outputStylesheet>` :id=h-39423b80baca

Renders an HTML `link` element with type `text/css`. This tag adds an external stylesheet file to a JSF page.

```html
<h:outputStylesheet library="css" name="styles.css"  />
```

Renders as the following HTML code:

```html
<link type="text/css" rel="stylesheet" href="/helloworld/javax.faces.resource/styles.css.jsf?ln=css" />
```

Example:

Code for *table-style.css*:

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

Code for *index.xhtml*:

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

### `<h:outputLink>` :id=h-25194ca2175e

The h:outputLink tag renders an HTML anchor element.

The following is JSF markup:

```html
<h:outputLink value="page1.jsf" >Page 1</h:outputLink>
```

It renders as the following HTML markup.

```html
<a href="page1.jsf">Page 1</a>
```

### `<h:form>` :id=h-3290e36b66d0

The `<h:form>` tag represents an input form. Its child components can contain data displayed to the user or submitted with the form.

```html
<h:form id="user-form">
<h:outputLabel for="username">User Name</h:outputLabel>
<h:inputText id="username" value="#{user.name}" required="true" requiredMessage="Username is required"/><br/>
<h:commandButton id="submit-button" value="Submit" action="response.xhtml"/>
</h:form>
```

### `<h:commandButton>` :id=h-3cf50800fcdf

Creates a submit button for submitting the application form.

```html
<h:form id="user-form">
<h:outputLabel for="username">User Name</h:outputLabel>
<h:inputText id="username" value="#{user.name}" required="true" requiredMessage="Username is required"/><br/>
<h:commandButton id="submit-button" value="Submit" action="response.xhtml"/>
</h:form>
```

After JSF renders the tag in the browser:

```html
<input id="user-form:submit-button"
name="user-form:submit-button" value="Submit" type="submit">
```

### `<h:commandLink>` :id=h-a313b1747de2

JSF renders `<h:commandLink>` as an HTML `a` anchor element that behaves like a form submit button when clicked. You can therefore use this tag to create an anchor. Set the displayed text with the value attribute or a nested h:outputText; nesting an output component is not mandatory. It must also be placed inside `<h:form>`.

```html
<h:commandLink id="image-link-id" action="response.xhtml">
<h:outputText value="Click here"></h:outputText>
</h:commandLink>
```

After JSF renders the `<h:commandLink>` tag, the result is as follows:

```html
<a id="user-form:image-link-id" href="#"
onclick="mojarra.jsfcljs(document.getElementById('user-form'),{'user-form:image-link-id':'user-form:image-link-id'},'');return false">Click here</a>
```

### `<h:graphicImage>` :id=h-845fbe1b89a3

Renders an HTML img element. This tag displays an image on a web page.

```html
<h:graphicImage id="image-id" name="user-image" url="#{user.fileLocation()}"
height="50px" width="50px" alt="Image not found"></h:graphicImage>
```

It displays an image on a web page. In the example above, the url attribute specifies the image path. The example's URL starts with a slash (`/`), so the web application's context-relative path is prepended to the image path.

### `<h:message>` :id=h-df47ea7948d7

Displays a single message for a particular component. To display your custom message, pass that component's `id` to the `for` attribute.

```html
<h:inputText id="username" size="20" label="UserName" required="true">
   <f:validateLength for="username" minimum="5" maximum="20" />
</h:inputText>
<h:message for="username" style="color:red" />
```

Message when the input exceeds 20 characters:

```html
<span style="color:red">UserName: Validation Error:
Length is greater than allowable maximum of '20'</span>
```

Message when the input has fewer than `5` characters:

```html
<span style="color:red">UserName: Validation Error:
Length is less than allowable minimum of '5'</span>
```

Message when the input field is empty:

```html
<span style="color:red">UserName: Validation Error: Value is required</span>
```

### `<h:messages>` :id=h-3d0d85cdc246

The h:messages tag displays all messages in one place corresponding to the UI element.

The following is JSF markup:

```html
<h:messages style="color:red;margin:8px;" />
```

If the entered username exceeds 20 characters and the password has fewer than 5 characters.

```html
<ul style="color:red;margin:8px;">
   <li>  UserName: Validation Error:
   Length is greater than allowable maximum of "20" </li>
   <li>  Password: Validation Error:
   Length is less than allowable minimum of "5" </li>
</ul>
```

### `<h:selectOneRadio>` :id=h-66be723e1c1f

Renders a group of HTML input elements of type `radio`, formatted using an HTML table and label tags.

```html
<h:selectOneRadio value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />
</h:selectOneRadio>
```

Renders the following HTML code:

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

Supports rendering all options through a method in the Bean.

```java
@ManagedBean(name="user")
@SessionScoped
public class UserBean implements Serializable{
  public String item;
    // See note 1 below.

  //Generated by Object array
  public static class Item{
    public String label;
    public String value;

        // See note 2 below.

        // See note 3 below.
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

Example notes:

1. Getter and setter methods omitted
2. Constructors with and without arguments omitted
3. Getter and setter methods omitted

The following is the code in `index.xhtml`.

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

### `<h:selectOneMenu>` :id=h-778bd4daea8c

Renders an HTML dropdown input element of type `select` without specifying a size.

```html
<h:selectOneMenu value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />
</h:selectOneMenu>
```

Renders as the following HTML code:

```html
<select name="j_idt6:j_idt8">
   <option value="1">Item 1</option>
   <option value="2">Item 2</option>
</select>
```

Supports rendering from a map and rendering items defined inside the combo box:

**Example of a combo box generated from a map**

Code in *UserBean.java*:

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

The following is the code in *index.xhtml*:

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

Code in *result.xhtml*:

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

**Items defined inside a combo box**

Code in *index.xhtml*:

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

Code in *result.xhtml*:

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

Code in *UserBean.java*:

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

### `<h:selectOneListbox>` :id=h-7578e696661a

Renders an HTML list input element of type `select` with a specified size.

```html
<h:selectOneListbox value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />
</h:selectOneListbox>
```

Renders as the following HTML markup:

```html
<select name="j_idt6:j_idt8" size="2">
   <option value="1">Item 1</option>
   <option value="2">Item 2</option>
</select>
```

**List box generated from a map**

Code in *result.xhtml*:

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

Code in *UserBean.java*:

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

Code in *index.xhtml*:

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

**Implementing a list box with the inner class istBox**

Code in *UserBean.java*:

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

Code in *result.xhtml*:

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

Code in *index.xhtml*:

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

### `<h:selectManyListbox>` :id=h-c50efc8060b4

Renders an HTML input element of type `select`, specifying its size and multiple items.

```html
<h:selectManyListbox value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />
</h:selectManyListbox>
```

Renders as the following HTML code:

```html
<select name="j_idt6:j_idt8" size="2" multiple="multiple">
   <option value="1">Item 1</option>
   <option value="2">Item 2</option>
</select>
```

**SelectManyListBox example**

Code in *UserBean.java*:

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

Code in *index.xhtml*:

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

Code in *result.xhtml*:

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

**Example of SelectManyListBox using a map**

Code in *UserBean.java*:

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

The following is the code in *index.xhtml*:

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

Code in *result.xhtml*:

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

### `<h:selectBooleanCheckbox>` :id=h-df47fde965b6

The h:selectBooleanCheckbox tag renders an HTML input element with type="checkbox".

The following is JSF markup:

```html
<h:selectBooleanCheckbox value="Remember Me" id="chkRememberMe" />
```

Renders as the following HTML markup:

```html
<input id="jsfForm1:chkRememberMe" type="checkbox"
   name="jsfForm1:chkRememberMe" checked="checked" />
```

The h:selectManyCheckbox tag renders a group of HTML input elements, formatted with an HTML table and label tags.

The following markup in JSF:

```html
<h:selectManyCheckbox value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />
</h:selectManyCheckbox>
```

Renders as the following HTML markup:

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

### `<f:attribute>` :id=h-848c83a910f1

Use the `<f:attribute>` tag to pass a property value or parameter to a component through an action listener.

The following code shows how to use the `<f:attribute>` tag.

Code in *index.xhtml*:

```html
<h:form id="form">
   <h:commandButton action="#{user.outcome}" actionListener="#{user.attrListener}">
      <f:attribute name="username" value="baidu.com" />
      <f:attribute name="value" value="Click Me" />
   </h:commandButton>
</h:form>
```

Code in *UserBean.java*:

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

### `<f:param>` :id=h-39db123b07d3

Use f:param to pass parameters to a component or to pass request parameters.

The following code shows how to pass a parameter to the UI component.

```html
<h:outputFormat value="Hello {0}!.">
   <f:param value="World" />
</h:outputFormat>
```

The following code passes a request parameter and its name.

```html
<h:commandButton id="submit"
   value="Show Message" action="#{userData.showResult}">
   <f:param name="username" value="JSF 2.0 User" />
</h:commandButton>
```

### `<f:setPropertyActionListener>` :id=h-2d97823bf913

The following code shows how to use the `<f:setPropertyActionListener>` tag.

```html
<h:commandButton id="submit" action="result" value="Show Message">
   <f:setPropertyActionListener target="#{userData.data}"
      value="JSF 2.0 User" />
</h:commandButton>
```

Example:

Code in *UserBean.java*.

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

Code in *index.xhtml*:

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

Code in *result.xhtml*:

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

### `<f:ajax>` :id=h-b22cb61d95f1

JSF supports Ajax calls using the `f:ajax` tag.

A simple JSF tag is shown below.

```html
<f:ajax execute="input-component-name" render="output-component-name" />
```

Create an input field with `<h:inputText>`, then use `f:ajax` inside it to make the call.

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

<a id="section-1"></a>

# JSF converter tags :id=h-dc0aa692831f

JSF provides converters to convert data in its UI components into objects used in managed beans, and vice versa.

For example, you can convert text to a date object and validate the input format.

To use converter tags, add the following URI namespace to the `html` node.

```html
<html
   xmlns="http://www.w3.org/1999/xhtml"
   xmlns:f="http://java.sun.com/jsf/core">
</html>
```

### `<f:convertNumber>` :id=h-0a9eb6039149

Converts a string value into a number in the required format.

```html
<f:convertNumber minFractionDigits="2" />
```

**Tag attributes**

| Attribute         | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| type              | Number (default), currency, or percentage                        |
| pattern           | Formatting pattern as defined in `java.text.DecimalFormat`       |
| maxFractionDigits | Maximum number of digits in the fractional part                  |
| minFractionDigits | Minimum number of digits in the fractional part                  |
| maxIntegerDigits  | Maximum number of digits in the integer part                     |
| minIntegerDigits  | Minimum number of digits in the integer part                     |
| integerOnly       | `true` to parse only the integer part (default: `false`)         |
| groupingUsed      | true to use grouping separators, such as 1,000; defaults to true |
| locale            | Preferred locale for parsing and formatting                      |
| currencyCode      | ISO 4217 currency code used when converting currency values      |
| currencySymbol    | Currency symbol used when converting currency values             |

Code in *result.xhtml*:

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

### `<f:convertDateTime>` :id=h-a970455fd2cf

Converts user input to the specified date. Nest `convertDateTime` inside a component tag to convert its data to `java.util.Date`.

```html
<f:convertDateTime pattern="yyyy-MM-dd" />
```

**Tag attributes**

| Attribute | Type               | Description                                                                                                                                                                                                                                                                                |
| --------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| binding   | DateTimeConverter  | Binds the converter to a managed Bean property.                                                                                                                                                                                                                                            |
| dateStyle | String             | Defines the format of the date, or date part of a date string, specified by `java.text.DateFormat`. Applies only when `type` is `date` or `both` and `pattern` is undefined. Valid values: `default`, `short`, `medium`, `long`, and `full`. The default is used if no value is specified. |
| for       | String             | References an object within the composite component containing this tag.                                                                                                                                                                                                                   |
| locale    | String or Locale   | A locale instance used with predefined date and time styles during formatting or parsing. If omitted, the locale returned by `FacesContext.getLocale` is used.                                                                                                                             |
| pattern   | String             | A custom formatting pattern that determines how date/time strings are formatted and parsed. If specified, the `dateStyle`, `timeStyle`, and `type` attributes are ignored.                                                                                                                 |
| timeStyle | String             | Defines the format of the time, or time part of a date string, specified by `java.text.DateFormat`. Applies only when the type is time and no pattern is defined. Valid values: `default`, `short`, `medium`, `long`, and `full`. The default is used if no value is specified.            |
| timeZone  | String or TimeZone | The time zone used to interpret any time information in a date string.                                                                                                                                                                                                                     |
| type      | String             | Specifies whether the string contains a date, a time, or both. Valid values are date, time, or both. Defaults to date if omitted.                                                                                                                                                          |

The code for *result.xhtml* is shown below:

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

          <!-- See note 1 below. -->
        <h:outputText value="#{user.dob}">
            <f:convertDateTime type="date" dateStyle="full"/>
        </h:outputText>
        <br/>

          <!-- 0:09:00 -->
        <h:outputText value="#{user.dob}">
            <f:convertDateTime type="time" timeStyle="full"/>
        </h:outputText>
        <br/>

          <!-- 01/06/1990 -->
        <h:outputText value="#{user.dob}">
            <f:convertDateTime type="date" pattern="dd/MM/yyyy"/>
        </h:outputText>
        <br/>

          <!-- 1990-06-01 -->
        <h:outputText value="#{user.dob}">
            <f:convertDateTime dateStyle="full" pattern="yyyy-MM-dd"/>
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

          <!-- See note 2 below. -->
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

Example notes:

1. Friday, June 1, 1990
2. June 1, 1990, 12:09:00

### `<f:converter>` :id=h-95316f5802e3

Steps for creating a custom converter in JSF:

1. Create a converter class implementing `javax.faces.convert.Converter`.
2. Implement the `getAsObject()` and `getAsString()` methods of that interface.
3. Assign the custom converter a unique ID using the `@FacesConverter` annotation.

Code for *index.xhtml*:

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

Code for *result.xhtml*:

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

Code for *User.java*:

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

<a id="section-2"></a>

# JSF validator tags :id=h-5d11d4170391

JSF has built-in validators for its UI components. Validator tags can validate field lengths and input types, including those of custom objects.

To include validator tags, add the following URI namespace to the `html` node.

```html
<html
   xmlns="http://www.w3.org/1999/xhtml"
   xmlns:f="http://java.sun.com/jsf/core">
</html>
```

### `<f:validateLength>` :id=h-1e3a1e330f9d

Validates the length of a string value.

```html
<f:validateLength minimum="5" maximum="8" />
```

Code for *index.xhtml*:

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

### `<f:validateLongRange>` :id=h-4e558d1d8988

Validates a long value against a specified range.

```html
<f:validateLongRange minimum="5" maximum="200" />
```

**Tag attributes**

| Attribute | Description                                |
| --------- | ------------------------------------------ |
| minimum   | Minimum numeric value in the allowed range |
| maximum   | Maximum numeric value in the allowed range |

Code for *index.xhtml*:

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

### `<f:validateDoubleRange>` :id=h-4875503eb54a

Validates the range of a floating-point (`float/double`) value.

```html
<f:validateDoubleRange minimum="1000.50" maximum="10000.50" />
```

**Tag attributes**

| Attribute | Description                                |
| --------- | ------------------------------------------ |
| minimum   | Minimum numeric value in the allowed range |
| maximum   | Maximum numeric value in the allowed range |

Code for *index.xhtml*:

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

### `<f:validateRegex>` :id=h-8fde64feab84

Validates that a string value matches the required format.

```html
<f:validateRegex pattern="((?=.*[a-z]).{6,})" />
```

**Tag attributes**

| Attribute | Description        |
| --------- | ------------------ |
| pattern   | Formatting pattern |

Code for *index.xhtml*:

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

### `<f:validator>` :id=h-ab752c32a30b

You can create custom validators in JSF.

- Create a validator class implementing `javax.faces.validator.Validator`.
- Implement the `validate()` method of that interface.
- Assign the custom validator a unique ID using the `@FacesValidator` annotation.

Code for *index.xhtml*:

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

The code for *EmailValidator.java* is shown below:

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

<a id="section-3"></a>

# JSF table tags :id=h-c2e39e35957f

### `<h:dataTable>` :id=h-ab796ed8beed

JSF has a control called `DataTable` for rendering and formatting `html` tables. With `DataTable`, you can iterate over collections or arrays to display data.

`DataTable` has attributes for easily modifying its data.

To use `DataTable`, add the following HTML header:

```html
<html
   xmlns="http://www.w3.org/1999/xhtml"
   xmlns:h="http://java.sun.com/jsf/html">
</html>
```

JSF table:

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

Renders as the following HTML tags:

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

#### Adding and deleting :id=h-4e1c243edb12

Code for *index.xhtml*:

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

Code for *User.java*:

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

#### **Updating data** :id=h-db58ea57324c

Code for *index.xhtml*:

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

Code for *User.java*:

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

#### **Sorting** :id=h-bede4a02878f

Code for *User.java*:

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

Code for *index.xhtml*:

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

### `<ui:repeat>` :id=h-7dd3dcb2f3f0

Use the ui:repeat tag to create a table.

Code in the `User.java` file:

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

The following is the code in the `index.xhtml` file:

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

<a id="section-4"></a>

# Event handling :id=h-f6bae4bbd460

### JSF value change events :id=h-bb161cba7324

#### `<f:valueChangeListener>` :id=h-3f2dc6af1348

In JSF, you can handle value change events for `<h:inputText>` or `<h:selectOneMenu>`.

To register an event listener, pass a managed bean method name to the `valueChangeListener` attribute of the UI component.

Alternatively, implement `ValueChangeListener` and specify the implementation class using the type attribute of nested f:valueChangeListener, or reference a listener object with binding.

The following code shows how to register a managed Bean method with `valueChangeListener`.

```java
public void localeChanged(ValueChangeEvent e){
   //assign new value to country
   selectedCountry = e.getNewValue().toString();
}
```

**Registering a method**

```html
<h:selectOneMenu value="#{userData.selectedCountry}" onchange="submit()"
   valueChangeListener="#{userData.localeChanged}" >
   <f:selectItems value="#{userData.countries}" />
</h:selectOneMenu>
```

The following code shows how to implement a `ValueChangeListener` listener method.

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

Then register it with the `<f:valueChangeListener>` tag.

```html
<h:selectOneMenu value="#{userData.selectedCountry}" onchange="submit()">
   <f:valueChangeListener type="com.demo.test.LocaleChangeListener"
      />
   <f:selectItems value="#{userData.countries}" />
</h:selectOneMenu>
```

### JSF action events :id=h-6c7eecd40554

#### f:actionListener :id=h-b48b64b52473

In JSF, you can handle user click events on components such as h:commandButton and h:commandLink (h:link is a normal navigation link and does not submit action events). To register an event handler, pass a managed bean method name to the `actionListener` attribute of the UI component.

Alternatively, implement `ActionListener` and specify the implementation class using the type attribute of nested f:actionListener, or reference a listener object with binding.

The following code shows how to add a user-defined method from `<h:commandButton>` to the `actionListener` attribute.

```java
public void updateData(ActionEvent e){
   data="Hello World";
}
```

Using the method above

```html
<h:commandButton id="submitButton"
   value="Submit" action="#{userData.showResult}"
   actionListener="#{userData.updateData}" />
```

The following code shows how to implement `ActionListener` and use the `f:actionListener` tag.

```java
public class UserActionListener implements ActionListener{
   @Override
   public void processAction(ActionEvent arg0)
   throws AbortProcessingException {
      //access userData bean directly
      FacesContext context = FacesContext.getCurrentInstance();
      UserData userData = context.getApplication().evaluateExpressionGet(
          context, "#{userData}", UserData.class);
      userData.setData("Hello World");
   }
}
```

Using a listener method:

```html
<h:commandButton id="submitButton1"
   value="Submit" action="#{userData.showResult}" >
   <f:actionListener type="com.demo.test.UserActionListener" />
</h:commandButton>
```

### Predefined application events :id=h-add62b971c06

JSF provides system event listeners for application-specific tasks during the JSF application lifecycle.

- PostConstructApplicationEvent fires when the application starts. Use it to perform initialization tasks after startup.
- PreDestroyApplicationEvent fires when the application is about to shut down. Use it to perform cleanup tasks just before shutdown.
- PreRenderViewEvent fires before a JSF page is displayed. Use it to validate users and restrict access to a JSF View.

Handle system-level events by implementing SystemEventListener and registering the system-event-listener class in faces-config.xml.

You can also handle system-level events through method binding by passing a managed bean method name to the listener attribute of f:event.

The following code shows how to implement SystemEventListener.

```java
package cn.w3cschool.common;

import javax.faces.application.Application;
import javax.faces.event.AbortProcessingException;
import javax.faces.event.PostConstructApplicationEvent;
import javax.faces.event.SystemEvent;
import javax.faces.event.SystemEventListener;

public class CustomSystemEventListener implements SystemEventListener {
    @Override
    public boolean isListenerForSource(Object source) {
        return source instanceof Application;
    }

    @Override
    public void processEvent(SystemEvent event) throws AbortProcessingException {
        if (event instanceof PostConstructApplicationEvent) {
            System.out.println("Application started.");
        }
    }
}
```

Then register this system event listener inside the application element of faces-config.xml.

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

The following code shows method binding for handling system-level events.

```java
public void handleEvent(ComponentSystemEvent event){
   data="Hello World";
}
```

Using the method above

```html
<f:event listener="#{user.handleEvent}" type="preRenderView" />
```

<a id="section-5"></a>

# Facelets technology :id=h-e0df1614e643

\*\*Facelets \*\*is a lightweight page declaration language for building JSF (JavaServer Faces) views in HTML style.

It includes the following features:

- It uses XHTML to create web pages.
- It supports the Facelets tag library in addition to the JavaServer Faces and JSTL tag libraries.
- It supports Expression Language (EL).
- It provides templating using components and pages.

The following table shows the tag libraries supported by Facelets.

| Tag library                        | URI                                                                                | Prefix | Example                            | Contents                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------- | ------ | ---------------------------------- | -------------------------------------------------------------------- |
| JSF Facelets tag library           | [http://xmlns.jcp.org/jsf/facelets](http://xmlns.jcp.org/jsf/facelets)             | `ui:`  | `ui:component`，`ui:insert`         | Templating tags                                                      |
| JSF HTML tag library               | [http://xmlns.jcp.org/jsf/html](http://xmlns.jcp.org/jsf/html)                     | `h:`   | `h:head`,`h:body`                  | JavaServer Faces component tags for all UI component objects         |
| JSF core tag library               | [http://xmlns.jcp.org/jsf/core](http://xmlns.jcp.org/jsf/core)                     | `f:`   | `f:actionListener`, `f:attribute`  | JSF tags for custom actions independent of any particular render kit |
| Pass-through element tag library   | [http://xmlns.jcp.org/jsf](http://xmlns.jcp.org/jsf)                               | `jsf:` | `jsf:id`                           | Tags supporting HTML5-friendly markup                                |
| Pass-through attribute tag library | [http://xmlns.jcp.org/jsf/passthrough](http://xmlns.jcp.org/jsf/passthrough)       | `p:`   | `p:type`                           | Tags supporting HTML5-friendly markup                                |
| Composite component tag library    | [http://xmlns.jcp.org/jsf/composite](http://xmlns.jcp.org/jsf/composite)           | `cc:`  | `cc:interface`                     | Tags supporting composite components                                 |
| JSTL core tag library              | [http://xmlns.jcp.org/jsp/jstl/core](http://xmlns.jcp.org/jsp/jstl/core)           | `c:`   | `c:forEach`, `c:catch`             | JSTL 1.2 core tags                                                   |
| JSTL function tag library          | [http://xmlns.jcp.org/jsp/jstl/functions](http://xmlns.jcp.org/jsp/jstl/functions) | `fn:`  | `fn:toUpperCase`, `fn:toLowerCase` | JSTL 1.2 function tags                                               |

### Facelets lifecycle :id=h-05d7f159996f

The JSF specification defines the lifecycle of JavaServer Faces applications. The following steps describe the process for an application based on **Facelets**.

1. The lifecycle starts when a client sends a new request for a page created with `Facelets`. JSF creates a new component tree, or `javax.faces.component.UIViewRoot`, and places it in `FacesContex`.
2. If an available `UIViewRoot` is applied to `Facelets`, the view can be populated with components for rendering.
3. The newly created view is rendered as a response to the client.
4. During rendering, the view state is saved for the next request, including the state of input components and form data.
5. The client can interact with the view and request another view from the JSF application. At this point, the saved view is restored from its stored state.
6. The restored view goes through the JSF lifecycle again. If there are no validation issues and no action is triggered, a new view is eventually generated or the current view is rendered again.
7. If the same view is requested, the saved view is rendered again.
8. If a new view is requested, continue with **step 2**.
9. Return the new view as the response to the client.

### Facelets views :id=h-4724302b7827

A Facelets view is an `XHTML` page. Create a page or view by adding components, connecting them to values and properties of backend `bean`s, and registering converters, validators, or listeners on them.

An `XHTML` page serves as the frontend. The home page is determined by welcome-file-list or container configuration; index.xhtml is the convention in this example, not a fixed home page for all Faces applications.

The first part of a page (for example, `index.xhtml`) declares its content type, XHTML:

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!-- See note 1 below. -->

<html lang="en"
xmlns="http://www.w3.org/1999/xhtml"
xmlns:h="http://xmlns.jcp.org/jsf/html"
xmlns:f="http://xmlns.jcp.org/jsf/core">
```

Example notes:

1. The next section specifies the language of the XHTML page, then declares the XML namespaces of the tag libraries used on the page.

Complete code for *index.xhtml*:

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

Facelets HTML tags start with `h:` and add components to a page; the core tag `f:validateRequired` validates user input.

The `h:inputText` tag accepts user input and sets the name property of the managed `bean` through the EL expression `#{user.name}`.

### Mapping the Faces Servlet :id=h-44ebd7b32cfb

Complete the JavaServer Faces application configuration by mapping the Faces Servlet in the web deployment descriptor `web.xml`.

Contents of an automatically generated `web.xml` file.

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

### Facelets templates :id=h-649c1d087fbb

`Facelets` templating provides tools for implementing user interfaces. Templating is a useful `Facelets` feature that lets you create a page as the basis for other pages in your application. Templates let you reuse code and avoid duplicating similar pages. They also make it easier to maintain a consistent look and feel in applications with many pages.

The following table lists Facelets tags for creating templates.

**Template tags**

| Tag              | Function                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `ui:component`   | Defines a component to be created and added to the component tree.                               |
| `ui:composition` | Defines a page composition that optionally uses a template; content outside this tag is ignored. |
| `ui:debug`       | Defines a debug component to be created and added to the component tree.                         |
| `ui:decorate`    | Similar to the composition tag, but does not ignore content outside the tag.                     |
| `ui:define`      | Defines content inserted into a page by a template.                                              |
| `ui:fragment`    | Similar to the component tag, but does not ignore content outside the tag.                       |
| `ui:include`     | Encapsulates and reuses content across multiple pages.                                           |
| `ui:insert`      | Inserts content into a template.                                                                 |
| `ui:param`       | Passes parameters to an included file.                                                           |
| `ui:repeat`      | An alternative to iteration tags such as `c:forEach` or `h:dataTable`.                           |
| `ui:remove`      | Removes content from a page.                                                                     |

The Facelets tag library includes the main templating tag `ui:insert`. Template pages created with it define a default page structure. You can use a template page as the template for other pages.

Code in *template.xhtml*:

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
```

The template file above has three sections: top, left, and content. You can reuse this structure on other pages in the application.

Code in *index.xhtml*:

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

### JSF composite components :id=h-f35b664268fd

JSF provides the concept of composite components (somewhat similar to a `Widget`) through Facelets. A composite component is a special kind of template that acts as a component within an application.

A composite component consists of markup tags and other existing components. This reusable, user-created component defines custom functionality and can have validators, converters, and listeners attached just like any other component. Any XHTML page containing markup tags and other components can be converted to a composite component.

Before creating a composite component, make sure to use the correct namespace, as shown below.

```html
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:composite="http://xmlns.jcp.org/jsf/composite"
</html>
```

The following table lists composite tags and their descriptions:

| Tag                             | Function                                                                                                                                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `composite:interface`           | Declares the contract of a composite component. A composite component can be used as a single component whose feature set is the union of the functionality declared in its contract.                                  |
| `composite:implementation`      | Defines a composite component's implementation. If `composite:interface` is present, there must be a corresponding `composite:implementation`.                                                                         |
| `composite:attribute`           | Declares an attribute that can be assigned to an instance of the composite component in which this tag is declared.                                                                                                    |
| `composite:insertChildren`      | Inserts child components from the composite component tag in the using page.                                                                                                                                           |
| `composite:valueHolder`         | Declares that the composite component whose contract is defined by the enclosing `composite:interface` exposes a `ValueHolder` implementation suitable as a target for attached objects in the using page.             |
| `composite:editableValueHolder` | Declares that the composite component whose contract is defined by the enclosing `composite:interface` exposes an implementation of `EditableValueHolder` suitable as a target for attached objects in the using page. |
| `composite:actionSource`        | Declares that the composite component whose contract is defined by the enclosing `composite:interface` exposes a `ActionSource` implementation suitable as a target for attached objects in the using page.            |

#### Creating a composite component :id=h-87ccc386eaa4

Create a file named `composite-component.xhtml` with the following code:

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

In the example above, `composite:interface` declares configurable values. `composite:implementation` declares all XHTML markup, and `cc.attrs.username` defines the `inputText` component's value. cc is an implicit EL object for accessing the current composite component, not CSS. The expression `#{cc.attrs.attribute-name}` accesses attributes defined for the composite component interface.

Save the code above as `composite-component.xhtml` in the `resources/com` folder under the application's web root.

#### Using a composite component :id=h-e6a37bf8febf

A web page using a composite component is usually called a using page. It references the composite component in an `xml` namespace declaration, as shown below:

```html
<html xmlns:co="http://xmlns.jcp.org/jsf/composite/com">
```

Here, `com` is the folder containing the file, and `co` is the reference used to access the component.

Create a file named `index.xhtml` with the following code:

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
