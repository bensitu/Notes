# HTML and CSS Basics :id=h-74b3f3ffc8f6

Learn web content structure, forms, and styling; look up tags, request formats, and CSS rules during development.

**Prerequisites and versions:** No framework experience is required. The browser parses HTML and CSS. Place tag examples in valid HTML files; form submissions also require an actual receiving address.

**Using the examples:** Unless a project explicitly lists all files and run instructions, code blocks are independent snippets for each section. Fill in ellipses and placeholder names; lines marked as incorrect illustrate problems. Do not combine alternative implementations from the same section.

[Documentation index](README.md) · [Official references](https://html.spec.whatwg.org/multipage/)

**On this page**

- [Chapter 1. HTML and CSS](#section-1)
- [1. HTML elements](#section-2)
- [2. HTML pages](#section-3)
- [3. Common elements](#section-4)
- [4. HTTP requests](#section-5)
- [5. CSS](#section-6)

This document is for readers new to web development: HTML defines content structure, CSS controls appearance, and JavaScript handles interaction. First open a simple HTML file in a browser, then add elements and styles section by section. Later documents on JavaScript, Vue, and TypeScript cover other topics. This document does not include a complete tutorial on React or jQuery.

Place code snippets in the appropriate part of an HTML file. Multiple tag examples in the same section are independent alternatives; you do not need to combine them all on one page.

<a id="section-1"></a>

# Chapter 1. HTML and CSS :id=h-a2285106b58f

What is HTML? It stands for HyperText Markup Language. Familiar web pages are written with it; HTML defines their content and structure.

- HyperText means organizing and connecting web pages through hyperlinks
- Markup means using `<标签>` to give content different functions and meanings

What is CSS? It stands for Cascading Style Sheets and describes the presentation and appearance of web pages.

<a id="section-2"></a>

## 1. HTML elements :id=h-f12b2d002a13

HTML consists of a series of `elements`, for example:

```html
<p>Hello, world!</p>
```

- The whole is called an element

- `<p>` and `</p>` are the opening and closing tags, respectively

- Hello, world enclosed by the tags is called the content

- p is a predefined HTML tag that makes its content a separate paragraph

Elements can also have attributes, for example:

```html
<p id="p1">Hello, world!</p>
```

- Attributes are generally predefined. Here, id gives the element a unique identifier.

Elements can be nested, for example:

```html
<p>HTML 是一门非常<b>强大</b>的语言</p>
```

Incorrect nesting:

```html
<p>HTML 是一门非常<b>强大的语言</p></b>
```

Elements without content are called void elements, for example:

```html
<img src="1.png">
<img src="1.png"/>
```

- img displays an image
- The src attribute specifies the image path

<a id="section-3"></a>

## 2. HTML pages :id=h-cef4c9cc0660

The individual HTML elements introduced above can form parts of a complete HTML page.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>测试页面</title>
  </head>
  <body>
    <p id="p1">Hello, world!</p>
    <img src="1.png">
  </body>
</html>
```

- The `html` element contains all other elements on the page. A page needs only one, called the root element.
- The `head` element contains elements that do not display page content, such as `title`, `link`, and `meta`.
- The `body` element contains elements displaying content to the user, including the text, image, video, and audio elements covered later.

<a id="section-4"></a>

## 3. Common elements :id=h-749873704944

### 1) Text :id=h-27194da8f7b2

#### Heading :id=h-1567707263ac

```html
<h1>1号标题</h1>
<h2>2号标题</h2>
<h3>3号标题</h3>
<h4>4号标题</h4>
<h5>5号标题</h5>
<h6>6号标题</h6>
```

#### Paragraph :id=h-1603a541ab30

```html
<p>段落</p>
```

#### List :id=h-82216a322882

Unordered list

```html
<ul>
    <li>列表项1</li>
    <li>列表项2</li>
    <li>列表项3</li>
</ul>
```

Ordered list

```html
<ol>
    <li>列表项1</li>
    <li>列表项2</li>
    <li>列表项3</li>
</ol>
```

Multilevel list

```html
<ul>
    <li>
        北京市
        <ul>
            <li>海淀区</li>
            <li>朝阳区</li>
            <li>昌平区</li>
        </ul>
    </li>
    <li>
        河北省
        <ul>
            <li>石家庄</li>
            <li>保定</li>
        </ul>
    </li>
</ul>
```

#### Anchor :id=h-39e513a01eff

Anchor, hyperlink

```html
<a href="网页地址">超链接文本</a>
```

### 2) Multimedia :id=h-498d75f4c32a

#### Image :id=h-63e9a21fe8be

```html
<img src="文件路径">
```

src has three formats

- File address

- data URL, in the following format

  ```
  data:媒体类型;base64,数据
  ```

- object URL, used with JavaScript

#### Video :id=h-57742c04bc4b

```html
<video src="文件路径"></video>
```

#### Audio :id=h-d092c1fe90db

```html
<audio src="文件路径"></audio>
```

### 3) Forms :id=h-c7596abba6dd

#### Purpose and syntax :id=h-1a8c45148395

A form **collects** the **data** entered by users and **submits it to the server**.

Form syntax

```html
<form action="服务器地址" method="请求方式" enctype="数据格式">
    <!-- See note 1 below. -->

    <input type="submit" value="提交按钮">
</form>
```

Example explanations:

1. Form control

- Request methods for method include:
  - get (default): data follows the URL address on submission
  - post: data is placed in the request body
- For post requests, enctype specifies the request body's data format
  - application/x-www-form-urlencoded (default)
  - multipart/form-data
- Form controls offer various ways to collect data
  - Only form controls with a name attribute have their data sent to the server

#### Common form controls :id=h-e8023407856c

Text field

```html
<input type="text" name="uesrname">
```

Password field

```html
<input type="password" name="password">
```

Hidden field

```html
<input type="hidden" name="id">
```

Date field

```html
<input type="date" name="birthday">
```

Single selection

```html
<input type="radio" name="sex" value="男" checked>
<input type="radio" name="sex" value="女">
```

Multiple selection

```html
<input type="checkbox" name="fav" value="唱歌">
<input type="checkbox" name="fav" value="逛街">
<input type="checkbox" name="fav" value="游戏">
```

File upload

```html
<input type="file" name="avatar">
```

<a id="section-5"></a>

## 4. HTTP requests :id=h-b0aa1ccb65cb

### 1) Request structure :id=h-fb6ce57a7090

A request consists of three parts

1. Request line
2. Request headers
3. Request body

You can test with the telnet program

### 2) Request methods and data formats :id=h-45af69c1a0da

#### GET request example :id=h-7c79b517906a

```
GET /test2?name=%E5%BC%A0&age=20 HTTP/1.1
Host: localhost
```

- %E5%BC%A0 is the URL-encoded form of the character 张

#### POST request example :id=h-ea84220e83cf

```
POST /test2 HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded
Content-Length: 21

name=%E5%BC%A0&age=18
```

application/x-www-form-urlencoded format details:

- Each parameter has a name and value separated by =
- Separate multiple parameters with &
- Special characters such as 张 must be encoded with encodeURIComponent() into %E5%BC%A0 before sending.

#### JSON request example :id=h-f5e06406f056

```
POST /test3 HTTP/1.1
Host: localhost
Content-Type: application/json
Content-Length: 25

{"name":"zhang","age":18}
```

JSON object format

```
{"属性名":属性值}
```

Property values can be:

- String ""
- Number
- true, false
- null
- Object
- Array

JSON array format

```
[元素1, 元素2, ...]
```

#### Multipart request example :id=h-928182d2d324

```
POST /test2 HTTP/1.1
Host: localhost
Content-Type: multipart/form-data; boundary=123
Content-Length: 125

--123
Content-Disposition: form-data; name="name"

lisi
--123
Content-Disposition: form-data; name="age"

30
--123--
```

- boundary=123 defines the delimiter
- The opening delimiter is `--分隔符`
- The closing delimiter is `--分隔符--`

#### Data format summary :id=h-5fe40a07e974

Sending from the client

- Encoding
  - application/x-www-form-urlencoded: URL encoding
  - application/json: UTF-8 encoding
  - multipart/form-data: encoding can differ for each part
- Native HTML forms support application/x-www-form-urlencoded, multipart/form-data, and text/plain, with the first two most common. To send JSON, normally use a JavaScript request.
- File uploads require the multipart/form-data format
- JavaScript code can send data in any format

Receiving on the server

- Spring receives application/x-www-form-urlencoded and multipart/form-data data in the same way: match JavaBean property names to request parameter names.
- To receive application/json data, Spring uses the @RequestBody annotation with a JavaBean.

### 3) How sessions work :id=h-fc700102c3f0

HTTP is stateless, with sessions supported separately

- Stateless means requests are independent: data from the first request cannot be reused by the second request itself.
- Sessions mean that both clients and servers have technologies that temporarily store data and share it across requests.

The server uses session technology to store data temporarily

Store

```
GET /s1?name=zhang HTTP/1.1
Host: localhost
```

Retrieve

```
GET /s2 HTTP/1.1
Host: localhost
Cookie: JSESSIONID=560FA845D02AE09B176E1BC5D9816A5D
```

Implement authentication with sessions

```mermaid
sequenceDiagram
participant Client
participant L as LoginController
participant i as LoginInterceptor
participant Session
rect rgb(200, 223, 255)
Client ->> +L : 登录请求
L ->> L : 检查用户名，密码，验证通过
L ->> +Session : 存入用户名
Session -->> -L:
L -->> -Client: 登录成功
end
rect rgb(200, 190, 255)
Client ->> +i : 其它请求
i ->> +Session : 获取用户名
Session -->> -i :
i ->> i: 用户名存在，放行
i -->> -Client :
end
```

### 4) How JWT works :id=h-fd284e53e42b

Implement authentication with JWT

```mermaid
sequenceDiagram
participant Client
participant L as LoginController
participant i as LoginInterceptor

rect rgb(200, 223, 255)
Client ->> +L : 登录请求
L ->> L : 检查用户名，密码，验证通过
L -->> -Client : 登录成功，返回token
end

rect rgb(150, 190, 155)
Client ->> +i : 其它请求，携带token
i ->> i : 校验token，校验无误，放行
i -->> -Client :
end
```

Generate a token

```
GET /j1?name=zhang&pass=123 HTTP/1.1
Host: localhost
```

Validate a token

```
GET /j2 HTTP/1.1
Host: localhost
Authorization: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9._1-P_TLlzQPb1_lCyGwplMZaKQ8Mcw_plBbYPZ3OX28
```

<a id="section-6"></a>

## 5. CSS :id=h-ea8e39d54d32

Cascading Style Sheets describes the presentation and appearance of web pages

### 1) Selectors :id=h-6083ad8d88fa

- Type selector: matches by tag name (element selector)

- Class selector: matches an element's class attribute

- ID selector: matches an element's id attribute

### 2) Properties and values :id=h-10f5d043cfad

- background-color : red;
- ...
- display

### 3) Layout :id=h-e146896582e1

HTML elements related to layout

- div
- template
