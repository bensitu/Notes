# JSF HTML タグ :id=h-470e86bcde9b

入力、出力、変換、検証、表、イベント別にタグの使い方を調べます。

**前提知識とバージョン：** まず JSF の基礎を読んでください。本記事は JSF 2.x のタグを整理したものです。各例の user や student などの Bean は、その節に従って定義します。同じグローバルオブジェクトだと考えてはいけません。Faces 4 の名前空間と Bean 管理方式は、対応するバージョンに従って移行する必要があります。

**例の使い方：** 全ファイルと実行手順を明示したプロジェクト以外では、コードブロックは各節の独立した断片です。省略箇所や仮の名前を補ってください。誤りと明記した行は問題を説明するためのものです。同じ節にある代替の書き方を組み合わせないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://javaee.github.io/javaserverfaces/docs/2.3/vdldocs/facelets/)

**目次**

- [JSF のコンバータータグ](#section-1)
- [JSF のバリデータータグ](#section-2)
- [JSF のテーブルタグ](#section-3)
- [イベント処理](#section-4)
- [Facelets 技術](#section-5)

### `<h:inputText>` :id=h-3c798e6cf4e7

JSF の `<h:inputText>` タグは Web ページに入力欄を描画します。`<h:form>` タグ内で、ユーザーがデータを入力できる欄を宣言するために使用します。

```html
<h:inputText id="username" value="#{user.name}" label="username" maxlength="10" size="15" alt="username" autocomplete="off" readonly="false" required="true" requiredMessage="Username is required" style="color:red" accesskey="q">
</h:inputText>
```

`value` 属性は、`User` というマネージド `Bean` の `name` プロパティを参照します。このプロパティは名前のコンポーネントのデータを保持します。フォームを送信すると、`User` の `name` プロパティには、このタグに対応する入力欄のテキストが設定されます。

### `<h:inputTextarea>` :id=h-1587b52b09e8

ユーザーが複数行の文字列を入力できます。

```html
<h:inputTextarea id="text-area-id" value="#{user.address}" required="true"
requiredMessage="Address is required" cols="50" rows="10"></h:inputTextarea>

```

JSF が `<h:inputTextarea>` タグを描画した結果は次のとおりです。

```html
<textarea id="user-form:text-area-id"
name="user-form:text-area-id" cols="50" rows="10">
```

### `<h:inputSecret>` :id=h-9c7f9ed44a14

空白も入力できるパスワード入力コンポーネントです。ブラウザーは内容を伏せ字で表示しますが、それは通信の暗号化を意味しません。パスワードの送信には HTTPS が必要です。

```html
<h:inputSecret value="#{user.password}" maxlength="10" size="15"
required="true" requiredMessage="Password is required"></h:inputSecret>
```

JSF が `<h:inputSecret>` タグを描画した結果は次のとおりです。

```html
<input name="user-password" value="" maxlength="10" size="15" type="password">
```

### `<h:inputHidden>` :id=h-bde2fcaf5d7f

h:inputHidden タグは、タイプが hidden の HTML input 要素を描画します。

次の JSF マークアップ

```html
<h:inputHidden value="Hello World" id="hiddenField" />
```

次の HTML マークアップとして描画されます。

```html
<input id="jsfForm:hiddenField" type="hidden" name="jsfForm:hiddenField"
   value="Hello World" />
```

### `<h:inputFile>` :id=h-280d17440439

JSF はこれを file タイプの HTML 要素として描画し、ファイルを入力として受け付けます。HTML フォーム内で、ユーザーがファイルをアップロードできます。

```html
<h:inputFile id="file-id" value="#{user.fileName}" required="true"
requiredMessage="Please upload a file" alt="upload file"></h:inputFile>
```

### `<h:outputText>` :id=h-eb40c75d04a3

プレーンテキストを描画します。`styleClass`、`style`、`dir`、`lang` のいずれかの属性があれば `span` 要素を描画します。`styleClass` 属性があれば、その値を `class` 属性の値にします。

```html
<h:outputText value="hello"></h:outputText>

<h:outputText value="hello" lang="en" style="color: red"></h:outputText>
```

出力

```html
hello

<span style="color: red" lang="en">hello</span>
```

### `<h:outputFormat>` :id=h-a23d840bb619

HTML テキストを描画し、パラメーター化した入力を受け付けます。

```html
<h:outputFormat value="parameter 1 : {0}, parameter 2 : {1}" >
   <f:param value="Item 1" />
   <f:param value="Item 2" />
</h:outputFormat>
```

次の HTML コードとして描画されます。

```html
parameter 1 : Item 1, parameter 2 : Item 2
```

例：

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

*index.xhtml* のコード：

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

タイプが `text/css` の HTML `link` 要素を描画します。このタグは JSF ページに外部スタイルシートファイルを追加します。

```html
<h:outputStylesheet library="css" name="styles.css"  />
```

次の HTML コードとして描画されます。

```html
<link type="text/css" rel="stylesheet" href="/helloworld/javax.faces.resource/styles.css.jsf?ln=css" />
```

例：

*table-style.css* のコード：

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

*index.xhtml* のコード：

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

h:outputLink タグは HTML のアンカー要素を描画します。

次は JSF のマークアップです。

```html
<h:outputLink value="page1.jsf" >Page 1</h:outputLink>
```

次の HTML マークアップとして描画されます。

```html
<a href="page1.jsf">Page 1</a>
```

### `<h:form>` :id=h-3290e36b66d0

`<h:form>` タグは入力フォームを表します。子コンポーネントには、ユーザーに表示するデータやフォームとともに送信するデータを含められます。

```html
<h:form id="user-form">
<h:outputLabel for="username">User Name</h:outputLabel>
<h:inputText id="username" value="#{user.name}" required="true" requiredMessage="Username is required"/><br/>
<h:commandButton id="submit-button" value="Submit" action="response.xhtml"/>
</h:form>
```

### `<h:commandButton>` :id=h-3cf50800fcdf

申請フォームを送信するための送信ボタン（submit）を作成します。

```html
<h:form id="user-form">
<h:outputLabel for="username">User Name</h:outputLabel>
<h:inputText id="username" value="#{user.name}" required="true" requiredMessage="Username is required"/><br/>
<h:commandButton id="submit-button" value="Submit" action="response.xhtml"/>
</h:form>
```

JSF がブラウザーにタグを描画した結果：

```html
<input id="user-form:submit-button"
name="user-form:submit-button" value="Submit" type="submit">
```

### `<h:commandLink>` :id=h-a313b1747de2

JSF は `<h:commandLink>` タグを HTML の `a` アンカー要素として描画します。クリックするとフォームの送信ボタンと同様に動作するため、このタグでアンカーを作成できます。表示文字列は value 属性または入れ子の h:outputText で設定でき、出力コンポーネントを入れ子にすることは必須ではありません。また、`<h:form>` タグ内に配置する必要があります。

```html
<h:commandLink id="image-link-id" action="response.xhtml">
<h:outputText value="Click here"></h:outputText>
</h:commandLink>
```

JSF が `<h:commandLink>` タグを描画した結果は次のとおりです。

```html
<a id="user-form:image-link-id" href="#"
onclick="mojarra.jsfcljs(document.getElementById('user-form'),{'user-form:image-link-id':'user-form:image-link-id'},'');return false">Click here</a>
```

### `<h:graphicImage>` :id=h-845fbe1b89a3

HTML の img 要素を描画します。このタグは Web ページに画像を表示します。

```html
<h:graphicImage id="image-id" name="user-image" url="#{user.fileLocation()}"
height="50px" width="50px" alt="Image not found"></h:graphicImage>
```

Web ページに画像を表示します。上の例では url 属性が画像のパスを指定しています。例の URL はスラッシュ（`/`）で始まるため、画像パスの先頭に Web アプリケーションのコンテキストに対する相対パスが追加されます。

### `<h:message>` :id=h-df47ea7948d7

特定のコンポーネントのメッセージを1つ表示します。コンポーネントの `id` を `for` 属性に渡すことで、独自のメッセージを表示できます。

```html
<h:inputText id="username" size="20" label="UserName" required="true">
   <f:validateLength for="username" minimum="5" maximum="20" />
</h:inputText>
<h:message for="username" style="color:red" />
```

入力が20文字を超えた場合のメッセージ：

```html
<span style="color:red">UserName: Validation Error:
Length is greater than allowable maximum of '20'</span>
```

入力が `5` 文字未満の場合のメッセージ：

```html
<span style="color:red">UserName: Validation Error:
Length is less than allowable minimum of '5'</span>
```

入力欄が空の場合のメッセージ：

```html
<span style="color:red">UserName: Validation Error: Value is required</span>
```

### `<h:messages>` :id=h-3d0d85cdc246

h:messages タグは、UI 要素に対応する1か所にすべてのメッセージを表示します。

次は JSF のマークアップです。

```html
<h:messages style="color:red;margin:8px;" />
```

入力したユーザー名が20文字を超え、パスワードが5文字未満の場合。

```html
<ul style="color:red;margin:8px;">
   <li>  UserName: Validation Error:
   Length is greater than allowable maximum of "20" </li>
   <li>  Password: Validation Error:
   Length is less than allowable minimum of "5" </li>
</ul>
```

### `<h:selectOneRadio>` :id=h-66be723e1c1f

`radio` タイプの HTML input 要素のグループを描画し、HTML の表と label タグで整形します。

```html
<h:selectOneRadio value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />
</h:selectOneRadio>
```

次の HTML コードを生成します。

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

Bean 内のメソッドを使って、すべての選択肢を描画できます。

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

例の説明：

1. getter と setter メソッドを省略
2. 引数ありと引数なしのコンストラクターを省略
3. getter と setter メソッドを省略

次はファイル `index.xhtml` のコードです。

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

サイズを指定せず、`select` タイプの HTML ドロップダウン入力要素を描画します。

```html
<h:selectOneMenu value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />
</h:selectOneMenu>
```

次の HTML コードとして描画されます。

```html
<select name="j_idt6:j_idt8">
   <option value="1">Item 1</option>
   <option value="2">Item 2</option>
</select>
```

map による描画と、コンボボックス内部で定義した項目の描画をサポートします。

**map からコンボボックスを生成する例**

*UserBean.java* のコード：

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

次はファイル *index.xhtml* のコードです。

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

*result.xhtml* のコード：

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

**コンボボックス内部の項目**

*index.xhtml* のコード：

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

*result.xhtml* のコード：

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

*UserBean.java* のコード：

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

サイズを指定して、`select` タイプの HTML リスト入力要素を描画します。

```html
<h:selectOneListbox value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />
</h:selectOneListbox>
```

次の HTML タグとして描画されます。

```html
<select name="j_idt6:j_idt8" size="2">
   <option value="1">Item 1</option>
   <option value="2">Item 2</option>
</select>
```

**map から生成したリストボックス**

*result.xhtml* のコード：

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

*UserBean.java* のコード：

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

*index.xhtml* のコード：

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

**内部クラス istBox によるリストボックスの実装**

*UserBean.java* のコード：

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

*result.xhtml* のコード：

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

*index.xhtml* のコード：

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

`select` タイプの HTML 入力要素を描画し、サイズと複数の項目を指定します。

```html
<h:selectManyListbox value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />
</h:selectManyListbox>
```

次の HTML コードとして描画されます。

```html
<select name="j_idt6:j_idt8" size="2" multiple="multiple">
   <option value="1">Item 1</option>
   <option value="2">Item 2</option>
</select>
```

**SelectManyListBox の例**

*UserBean.java* のコード：

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

*index.xhtml* のコード：

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

*result.xhtml* のコード：

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

**map を使った SelectManyListBox の例**

*UserBean.java* のコード：

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

次はファイル *index.xhtml* のコードです。

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

*result.xhtml* のコード：

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

h:selectBooleanCheckbox タグは、checkbox タイプの HTML input 要素を描画します。

次は JSF のマークアップです。

```html
<h:selectBooleanCheckbox value="Remember Me" id="chkRememberMe" />
```

次の HTML マークアップとして描画されます。

```html
<input id="jsfForm1:chkRememberMe" type="checkbox"
   name="jsfForm1:chkRememberMe" checked="checked" />
```

h:selectManyCheckbox タグは HTML input 要素のグループを描画し、HTML の表と label タグで整形します。

JSF 内の次のマークアップ：

```html
<h:selectManyCheckbox value="#{userData.data}">
   <f:selectItem itemValue="1" itemLabel="Item 1" />
   <f:selectItem itemValue="2" itemLabel="Item 2" />
</h:selectManyCheckbox>
```

次の HTML マークアップとして描画されます。

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

`<f:attribute>` タグを使用すると、アクションリスナーを通してコンポーネントにプロパティ値やパラメーターを渡せます。

次のコードは `<f:attribute>` タグの使用方法を示します。

*index.xhtml* のコード：

```html
<h:form id="form">
   <h:commandButton action="#{user.outcome}" actionListener="#{user.attrListener}">
      <f:attribute name="username" value="baidu.com" />
      <f:attribute name="value" value="Click Me" />
   </h:commandButton>
</h:form>
```

*UserBean.java* のコード：

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

f:param タグを使って、コンポーネントへパラメーターを渡したり、リクエストパラメーターを渡したりできます。

次のコードは UI コンポーネントへのパラメーターの渡し方を示します。

```html
<h:outputFormat value="Hello {0}!.">
   <f:param value="World" />
</h:outputFormat>
```

次のコードはリクエストパラメーターとその名前を渡します。

```html
<h:commandButton id="submit"
   value="Show Message" action="#{userData.showResult}">
   <f:param name="username" value="JSF 2.0 User" />
</h:commandButton>
```

### `<f:setPropertyActionListener>` :id=h-2d97823bf913

次のコードは `<f:setPropertyActionListener>` タグの使用方法を示します。

```html
<h:commandButton id="submit" action="result" value="Show Message">
   <f:setPropertyActionListener target="#{userData.data}"
      value="JSF 2.0 User" />
</h:commandButton>
```

例：

*UserBean.java* のコード。

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

*index.xhtml* のコード：

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

*result.xhtml* のコード：

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

JSF は `f:ajax` タグを使う Ajax 呼び出しをサポートします。

次にシンプルな JSF タグを示します。

```html
<f:ajax execute="input-component-name" render="output-component-name" />
```

`<h:inputText>` で入力欄を作り、その中の `f:ajax` タグを使って呼び出します。

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

# JSF のコンバータータグ :id=h-dc0aa692831f

JSF は、UI コンポーネントのデータをマネージド bean で使用するオブジェクトへ、またその逆へ変換するコンバーターを提供します。

例えば、テキストを日付オブジェクトに変換し、入力形式を検証できます。

コンバータータグを使うには、`html` ノードに次の URI 名前空間を指定する必要があります。

```html
<html
   xmlns="http://www.w3.org/1999/xhtml"
   xmlns:f="http://java.sun.com/jsf/core">
</html>
```

### `<f:convertNumber>` :id=h-0a9eb6039149

文字列の値を必要な形式の数値に変換します。

```html
<f:convertNumber minFractionDigits="2" />
```

**タグの属性**

| 属性                | 説明                                       |
| ----------------- | ---------------------------------------- |
| type              | 数値（既定）、通貨、またはパーセント                       |
| pattern           | `java.text.DecimalFormat` で定義されている書式パターン |
| maxFractionDigits | 小数部分の最大桁数                                |
| minFractionDigits | 小数部分の最小桁数                                |
| maxIntegerDigits  | 整数部分の最大桁数                                |
| minIntegerDigits  | 整数部分の最小桁数                                |
| integerOnly       | 整数部分だけを解析する場合は `true`（既定値：`false`）       |
| groupingUsed      | true の場合は 1,000 のように桁区切りを使用する。既定値は true  |
| locale            | 解析と書式設定に使用する優先ロケール                       |
| currencyCode      | 通貨の値を変換するときに使用する ISO 4217 通貨コード          |
| currencySymbol    | 通貨の値を変換するときに使用する通貨記号                     |

*result.xhtml* のコード：

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

ユーザー入力を指定の日付に変換します。コンポーネントタグ内に `convertDateTime` タグを入れ子にすると、そのデータを `java.util.Date` に変換できます。

```html
<f:convertDateTime pattern="yyyy-MM-dd" />
```

**タグの属性**

| 属性        | 型                   | 説明                                                                                                                                                                                   |
| --------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| binding   | DateTimeConverter   | コンバーターをマネージド Bean のプロパティにバインドします。                                                                                                                                                    |
| dateStyle | String              | `java.text.DateFormat` で指定した日付、または日付文字列の日付部分の形式を定義します。`type` が `date` または `both` で、`pattern` が未定義の場合にだけ適用されます。有効な値は `default`、`short`、`medium`、`long`、`full` です。値を指定しない場合は既定値を使用します。 |
| for       | String              | このタグを含む複合コンポーネント内のオブジェクトを参照します。                                                                                                                                                      |
| locale    | String または Locale   | 書式設定や解析時に、事前定義された日付と時刻のスタイルに使用するロケールのインスタンスです。省略した場合は `FacesContext.getLocale` が返すロケールを使用します。                                                                                        |
| pattern   | String              | 日付と時刻の文字列の書式設定および解析方法を決める、独自の書式パターンです。この属性を指定すると、`dateStyle`、`timeStyle`、`type` 属性は無視されます。                                                                                           |
| timeStyle | String              | `java.text.DateFormat` で指定した時刻、または日付文字列の時刻部分の形式を定義します。タイプが time でパターンが未定義の場合にだけ適用されます。有効な値は `default`、`short`、`medium`、`long`、`full` です。値を指定しない場合は既定値を使用します。                         |
| timeZone  | String または TimeZone | 日付文字列に含まれる時刻情報の解釈に使用するタイムゾーンです。                                                                                                                                                      |
| type      | String              | 文字列の値が日付、時刻、または両方を含むかを指定します。有効な値は date、time、both です。値を指定しなければ date を使用します。                                                                                                           |

*result.xhtml* のコードは次のとおりです。

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

例の説明：

1. 1990年6月1日 金曜日
2. 1990年6月1日 12:09:00

### `<f:converter>` :id=h-95316f5802e3

JSF で独自のコンバーターを作成する手順：

1. `javax.faces.convert.Converter` インターフェースを実装するコンバータークラスを作成します。
2. そのインターフェースの `getAsObject()` メソッドと `getAsString()` メソッドを実装します。
3. `@FacesConverter` アノテーションを使い、独自のコンバーターに一意の ID を割り当てます。

*index.xhtml* のコード：

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

*result.xhtml* のコード：

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

*User.java* のコード：

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

# JSF のバリデータータグ :id=h-5d11d4170391

JSF は UI コンポーネント向けの組み込みバリデーターを提供します。バリデータータグは、独自のオブジェクトを含むフィールドの長さや入力型を検証できます。

バリデータータグを含めるには、`html` ノードに次の URI 名前空間を指定する必要があります。

```html
<html
   xmlns="http://www.w3.org/1999/xhtml"
   xmlns:f="http://java.sun.com/jsf/core">
</html>
```

### `<f:validateLength>` :id=h-1e3a1e330f9d

文字列の値の長さを検証します。

```html
<f:validateLength minimum="5" maximum="8" />
```

*index.xhtml* のコード：

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

long 型の値が指定範囲内かを検証します。

```html
<f:validateLongRange minimum="5" maximum="200" />
```

**タグの属性**

| 属性      | 説明       |
| ------- | -------- |
| minimum | 許容範囲の最小値 |
| maximum | 許容範囲の最大値 |

*index.xhtml* のコード：

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

浮動小数点数（`float/double`）の値の範囲を検証します。

```html
<f:validateDoubleRange minimum="1000.50" maximum="10000.50" />
```

**タグの属性**

| 属性      | 説明       |
| ------- | -------- |
| minimum | 許容範囲の最小値 |
| maximum | 許容範囲の最大値 |

*index.xhtml* のコード：

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

文字列の値が必要な形式に一致するかを検証します。

```html
<f:validateRegex pattern="((?=.*[a-z]).{6,})" />
```

**タグの属性**

| 属性      | 説明     |
| ------- | ------ |
| pattern | 書式パターン |

*index.xhtml* のコード：

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

JSF では独自のバリデーターを作成できます。

- `javax.faces.validator.Validator` インターフェースを実装するバリデータークラスを作成します。
- そのインターフェースの `validate()` メソッドを実装します。
- `@FacesValidator` アノテーションを使い、独自のバリデーターに一意の ID を割り当てます。

*index.xhtml* のコード：

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

*EmailValidator.java* のコードは次のとおりです。

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

# JSF のテーブルタグ :id=h-c2e39e35957f

### `<h:dataTable>` :id=h-ab796ed8beed

JSF には `DataTable` というコントロールがあり、`html` の表を描画して整形できます。`DataTable` を使うと、コレクションや配列を反復処理してデータを表示できます。

`DataTable` には、データを簡単に変更できる属性があります。

`DataTable` を使うには、次の HTML ヘッダーを追加します。

```html
<html
   xmlns="http://www.w3.org/1999/xhtml"
   xmlns:h="http://java.sun.com/jsf/html">
</html>
```

JSF の表：

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

次の HTML タグとして描画されます。

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

#### 追加と削除 :id=h-4e1c243edb12

*index.xhtml* のコード：

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

*User.java* のコード：

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

#### **データの更新** :id=h-db58ea57324c

*index.xhtml* のコード：

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

*User.java* のコード：

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

#### **並べ替え** :id=h-bede4a02878f

*User.java* のコード：

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

*index.xhtml* のコード：

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

ui:repeat タグを使って表を作成します。

`User.java` ファイルのコード：

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

次は `index.xhtml` ファイルのコードです。

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

# イベント処理 :id=h-f6bae4bbd460

### JSF の値変更イベント :id=h-bb161cba7324

#### `<f:valueChangeListener>` :id=h-3f2dc6af1348

JSF では、`<h:inputText>` または `<h:selectOneMenu>` の値変更イベントを処理できます。

イベントリスナーを登録するには、UI コンポーネントの `valueChangeListener` 属性にマネージド bean のメソッド名を渡します。

または `ValueChangeListener` インターフェースを実装し、入れ子の f:valueChangeListener の type 属性で実装クラスを指定するか、binding でリスナーオブジェクトを参照します。

次のコードは、マネージド Bean のメソッドを `valueChangeListener` に登録する方法を示します。

```java
public void localeChanged(ValueChangeEvent e){
   //assign new value to country
   selectedCountry = e.getNewValue().toString();
}
```

**メソッドの登録**

```html
<h:selectOneMenu value="#{userData.selectedCountry}" onchange="submit()"
   valueChangeListener="#{userData.localeChanged}" >
   <f:selectItems value="#{userData.countries}" />
</h:selectOneMenu>
```

次のコードは `ValueChangeListener` リスナーメソッドの実装方法を示します。

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

そして `<f:valueChangeListener>` タグに登録します。

```html
<h:selectOneMenu value="#{userData.selectedCountry}" onchange="submit()">
   <f:valueChangeListener type="com.demo.test.LocaleChangeListener"
      />
   <f:selectItems value="#{userData.countries}" />
</h:selectOneMenu>
```

### JSF のアクションイベント :id=h-6c7eecd40554

#### f:actionListener :id=h-b48b64b52473

JSF では、h:commandButton や h:commandLink などのコンポーネントのクリックイベントを処理できます（h:link は通常の遷移リンクで、action イベントを送信しません）。イベントハンドラーを登録するには、UI コンポーネントの `actionListener` 属性にマネージド bean のメソッド名を渡します。

または `ActionListener` インターフェースを実装し、入れ子の f:actionListener の type 属性で実装クラスを指定するか、binding でリスナーオブジェクトを参照します。

次のコードは、`<h:commandButton>` のユーザー定義メソッドを `actionListener` 属性に設定する方法を示します。

```java
public void updateData(ActionEvent e){
   data="Hello World";
}
```

上のメソッドの使用

```html
<h:commandButton id="submitButton"
   value="Submit" action="#{userData.showResult}"
   actionListener="#{userData.updateData}" />
```

次のコードは、`ActionListener` の実装と `f:actionListener` タグの使用方法を示します。

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

リスナーメソッドの使用：

```html
<h:commandButton id="submitButton1"
   value="Submit" action="#{userData.showResult}" >
   <f:actionListener type="com.demo.test.UserActionListener" />
</h:commandButton>
```

### 事前定義されたアプリケーションイベント :id=h-add62b971c06

JSF は、JSF アプリケーションのライフサイクル中にアプリケーション固有の処理を行うシステムイベントリスナーを提供します。

- PostConstructApplicationEvent はアプリケーション起動時に発生します。起動後の初期化処理に使用できます。
- PreDestroyApplicationEvent はアプリケーション終了直前に発生します。終了直前の後処理に使用できます。
- PreRenderViewEvent は JSF ページの表示前に発生します。ユーザーの検証や JSF View へのアクセス制限に使用できます。

SystemEventListener インターフェースを実装し、faces-config.xml に system-event-listener クラスを登録することで、システムレベルのイベントを処理できます。

f:event の listener 属性にマネージド bean のメソッド名を渡す、メソッドバインド方式でもシステムレベルのイベントを処理できます。

次のコードは SystemEventListener インターフェースの実装方法を示します。

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

次に、faces-config.xml の application 要素内にこのシステムイベントリスナーを登録します。

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

次のコードは、メソッドバインドでシステムレベルのイベントを処理する方法を示します。

```java
public void handleEvent(ComponentSystemEvent event){
   data="Hello World";
}
```

上のメソッドの使用

```html
<f:event listener="#{user.handleEvent}" type="preRenderView" />
```

<a id="section-5"></a>

# Facelets 技術 :id=h-e0df1614e643

\*\*Facelets \*\*は、HTML スタイルで JSF（JavaServer Faces）のビューを構築する軽量なページ宣言言語です。

次の機能があります。

- XHTML を使って Web ページを作成します。
- JavaServer Faces と JSTL のタグライブラリに加え、Facelets タグライブラリをサポートします。
- 式言語（EL）をサポートします。
- コンポーネントとページによるテンプレート機能を提供します。

次の表は、Facelets がサポートするタグライブラリを示します。

| タグライブラリ              | URI                                                                                | 接頭辞    | 例                                  | 内容                                                    |
| -------------------- | ---------------------------------------------------------------------------------- | ------ | ---------------------------------- | ----------------------------------------------------- |
| JSF Facelets タグライブラリ | [http://xmlns.jcp.org/jsf/facelets](http://xmlns.jcp.org/jsf/facelets)             | `ui:`  | `ui:component`，`ui:insert`         | テンプレート用タグ                                             |
| JSF HTML タグライブラリ     | [http://xmlns.jcp.org/jsf/html](http://xmlns.jcp.org/jsf/html)                     | `h:`   | `h:head`,`h:body`                  | すべての UI コンポーネントオブジェクトに対応する JavaServer Faces コンポーネントタグ |
| JSF コアタグライブラリ        | [http://xmlns.jcp.org/jsf/core](http://xmlns.jcp.org/jsf/core)                     | `f:`   | `f:actionListener`, `f:attribute`  | 特定のレンダーキットに依存しないカスタムアクション用の JSF タグ                    |
| パススルー要素タグライブラリ       | [http://xmlns.jcp.org/jsf](http://xmlns.jcp.org/jsf)                               | `jsf:` | `jsf:id`                           | HTML5 に適したマークアップをサポートするタグ                             |
| パススルー属性タグライブラリ       | [http://xmlns.jcp.org/jsf/passthrough](http://xmlns.jcp.org/jsf/passthrough)       | `p:`   | `p:type`                           | HTML5 に適したマークアップをサポートするタグ                             |
| 複合コンポーネントタグライブラリ     | [http://xmlns.jcp.org/jsf/composite](http://xmlns.jcp.org/jsf/composite)           | `cc:`  | `cc:interface`                     | 複合コンポーネントをサポートするタグ                                    |
| JSTL コアタグライブラリ       | [http://xmlns.jcp.org/jsp/jstl/core](http://xmlns.jcp.org/jsp/jstl/core)           | `c:`   | `c:forEach`, `c:catch`             | JSTL 1.2 コアタグ                                         |
| JSTL 関数タグライブラリ       | [http://xmlns.jcp.org/jsp/jstl/functions](http://xmlns.jcp.org/jsp/jstl/functions) | `fn:`  | `fn:toUpperCase`, `fn:toLowerCase` | JSTL 1.2 関数タグ                                         |

### Facelets のライフサイクル :id=h-05d7f159996f

JSF 仕様は JavaServer Faces アプリケーションのライフサイクルを定義しています。次の手順は、**Facelets** ベースのアプリケーションの処理を説明したものです。

1. クライアントが `Facelets` で作成したページに新しいリクエストを送ると、ライフサイクルが始まります。JSF は新しいコンポーネントツリー、すなわち `javax.faces.component.UIViewRoot` を作成し、`FacesContex` に格納します。
2. 利用可能な `UIViewRoot` を `Facelets` に適用すると、ビューに描画用のコンポーネントを配置できます。
3. 新しく作成したビューを、クライアントへのレスポンスとして描画します。
4. 描画時に、次のリクエストに備えてビューの状態を保存します。入力コンポーネントやフォームデータの状態も保存されます。
5. クライアントはビューを操作し、JSF アプリケーションに別のビューを要求できます。この時点で、保存した状態からビューが復元されます。
6. 復元したビューは、再び JSF のライフサイクルを経ます。検証上の問題がなく、アクションも発生しなければ、最終的に新しいビューを生成するか、現在のビューを再描画します。
7. 同じビューを要求した場合は、保存したビューを再び描画します。
8. 新しいビューを要求した場合は、**手順2** に進みます。
9. 新しいビューをクライアントへのレスポンスとして返します。

### Facelets のビュー :id=h-4724302b7827

Facelets のビューは `XHTML` ページです。ページにコンポーネントを追加し、バックエンドの `bean` の値やプロパティに結び付け、コンバーター、バリデーター、リスナーを登録することで、Web ページやビューを作成できます。

`XHTML` ページをフロントエンドとして使用します。最初のページは welcome-file-list やコンテナーの設定で決まります。index.xhtml はこの例での取り決めであり、すべての Faces アプリケーションに共通する固定のトップページではありません。

ページ（例えば `index.xhtml`）の最初の部分で、コンテンツタイプが XHTML であることを宣言します。

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!-- See note 1 below. -->

<html lang="en"
xmlns="http://www.w3.org/1999/xhtml"
xmlns:h="http://xmlns.jcp.org/jsf/html"
xmlns:f="http://xmlns.jcp.org/jsf/core">
```

例の説明：

1. 次の部分では XHTML ページの言語を指定し、その後にページで使用するタグライブラリの XML 名前空間を宣言します。

*index.xhtml* の完全なコード：

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

Facelets の HTML タグは `h:` で始まり、ページにコンポーネントを追加します。コアタグ `f:validateRequired` はユーザー入力を検証します。

`h:inputText` タグはユーザー入力を受け付け、EL 式 `#{user.name}` を通じてマネージド `bean` の name プロパティに値を設定します。

### Faces Servlet のマッピング :id=h-44ebd7b32cfb

Web 配備記述子 `web.xml` で Faces Servlet のマッピングを設定し、JavaServer Faces アプリケーションの設定を完成させます。

自動生成された `web.xml` ファイルの内容。

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

### Facelets のテンプレート :id=h-649c1d087fbb

`Facelets` のテンプレート機能は、ユーザーインターフェースを実装するための仕組みを提供します。アプリケーション内のほかのページの基礎となるページを作成できる、便利な `Facelets` の機能です。テンプレートを使うとコードを再利用し、似たページの重複を避けられます。また、ページ数の多いアプリケーションでも、統一された外観と操作感を維持しやすくなります。

次の表は、テンプレートを作成するための Facelets タグを示します。

**テンプレートタグ**

| タグ               | 機能                                              |
| ---------------- | ----------------------------------------------- |
| `ui:component`   | 生成してコンポーネントツリーに追加するコンポーネントを定義します。               |
| `ui:composition` | 必要に応じてテンプレートを使用するページ構成を定義します。このタグの外側の内容は無視されます。 |
| `ui:debug`       | 生成してコンポーネントツリーに追加するデバッグ用コンポーネントを定義します。          |
| `ui:decorate`    | composition タグに似ていますが、タグの外側の内容を無視しません。          |
| `ui:define`      | テンプレートによってページに挿入される内容を定義します。                    |
| `ui:fragment`    | component タグに似ていますが、タグの外側の内容を無視しません。            |
| `ui:include`     | 複数のページの内容をまとめ、再利用します。                           |
| `ui:insert`      | テンプレートに内容を挿入します。                                |
| `ui:param`       | インクルードするファイルにパラメーターを渡します。                       |
| `ui:repeat`      | `c:forEach` や `h:dataTable` などの反復タグの代替として使用します。 |
| `ui:remove`      | ページから内容を削除します。                                  |

Facelets タグライブラリには、主要なテンプレートタグ `ui:insert` があります。このタグを使って作成したテンプレートページで、ページの既定の構造を定義できます。そのテンプレートページを、ほかのページのテンプレートとして使用できます。

*template.xhtml* のコード：

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

上のテンプレートファイルは、上部、左側、コンテンツの3つの部分に分かれています。この構造をアプリケーション内のほかのページでも再利用できます。

*index.xhtml* のコード：

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

### JSF の複合コンポーネント :id=h-f35b664268fd

JSF は Facelets を通じて、複合コンポーネント（`Widget` に少し似たもの）の概念を提供します。複合コンポーネントは、アプリケーション内で1つのコンポーネントとして働く、特殊なテンプレートです。

複合コンポーネントは、マークアップタグと既存のほかのコンポーネントで構成されます。ユーザーが作成する再利用可能なコンポーネントで、独自の機能を定義でき、通常のコンポーネントと同様にバリデーター、コンバーター、リスナーを関連付けられます。マークアップタグやほかのコンポーネントを含む XHTML ページは、複合コンポーネントに変換できます。

複合コンポーネントを作成する前に、次に示す正しい名前空間を使用していることを確認してください。

```html
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:composite="http://xmlns.jcp.org/jsf/composite"
</html>
```

次の表は複合コンポーネントのタグと説明を示します。

| タグ                              | 機能                                                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `composite:interface`           | 複合コンポーネントの契約を宣言します。複合コンポーネントは、契約で宣言した機能をまとめた機能群を持つ、単一のコンポーネントとして使用できます。                                         |
| `composite:implementation`      | 複合コンポーネントの実装を定義します。`composite:interface` 要素が存在する場合は、対応する `composite:implementation` が必要です。                      |
| `composite:attribute`           | このタグを宣言した複合コンポーネントのインスタンスに設定できる属性を宣言します。                                                                        |
| `composite:insertChildren`      | 利用側ページの複合コンポーネントタグに記述した子コンポーネントを挿入します。                                                                          |
| `composite:valueHolder`         | この要素を含む `composite:interface` で契約を宣言した複合コンポーネントが、利用側ページで付加オブジェクトの対象にできる `ValueHolder` の実装を公開することを宣言します。         |
| `composite:editableValueHolder` | この要素を含む `composite:interface` で契約を宣言した複合コンポーネントが、利用側ページで付加オブジェクトの対象にできる `EditableValueHolder` の実装を公開することを宣言します。 |
| `composite:actionSource`        | この要素を含む `composite:interface` で契約を宣言した複合コンポーネントが、利用側ページで付加オブジェクトの対象にできる `ActionSource` の実装を公開することを宣言します。        |

#### 複合コンポーネントの作成 :id=h-87ccc386eaa4

`composite-component.xhtml` というファイルを作成し、次のコードを記述します。

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

上の例では、`composite:interface` タグで設定可能な値を宣言します。`composite:implementation` タグですべての XHTML マークアップを宣言し、`cc.attrs.username` で `inputText` コンポーネントの値を定義します。cc は現在の複合コンポーネントにアクセスするための暗黙の EL オブジェクトであり、CSS ではありません。式 `#{cc.attrs.attribute-name}` は、複合コンポーネントのインターフェースで定義した属性へのアクセスに使用します。

上のコードを `composite-component.xhtml` というファイルとして、アプリケーションの Web ルートにある `resources/com` フォルダーに保存します。

#### 複合コンポーネントの使用 :id=h-e6a37bf8febf

複合コンポーネントを使用する Web ページは、一般に利用側ページと呼ばれます。次のように `xml` 名前空間の宣言に複合コンポーネントへの参照を含めます。

```html
<html xmlns:co="http://xmlns.jcp.org/jsf/composite/com">
```

ここで、`com` はファイルを保存したフォルダー、`co` はコンポーネントにアクセスするための参照です。

`index.xhtml` というファイルを作成し、次のコードを記述します。

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
