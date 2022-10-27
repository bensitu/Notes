# 前言

Java 程序员一提起前端知识，心情那是五味杂陈，百感交集。

* 说不学它吧，说不定进公司以后，就会被抓壮丁去时不时写点前端代码
* 说学它吧，HTML、CSS、JavaScript 哪个不得下大功夫才能精通？
* 学一点够不够用呢？如果只学基础的 JavaScript 是不够用的，前端都已经工程化了，Vue、React 这些框架你去看吧，光有点基础根本看不懂，甚至连前端页面路径在哪儿配置，如何跳转都不甚了解，所以得学，而且要学的还不少，请把前端当作 web 不可或缺的一部分来学习。
* 学习前端好处挺多，我听说过这么一句挺有道理的话：一个程序员至少应该掌握一门静态语言，如 Java，还应该掌握一门动态语言，如 JavaScript。而且，你不觉得学了前端，就如打通了程序员的任督二脉，可以独立接活了嘛

这门课为什么不由前端老师来讲？

* 前端老师不知道后端学员的痛点，他认为重要的咱不关心，他认为是常识一带而过的又恰恰是咱迷茫的地方，作为后端老师，我更懂后端学员
* 前端老师不懂后端知识，只能用前端思维来讲前端，如果授课老师懂 Java，能用一些现有知识对比讲解，能起到快速突破的效果
* 前端每个框架动辄需要数十个小时的学习，咱耗不起，我们更希望学到对我们最有用的那部分，其它的省省吧，总不能夺了前端程序员的饭碗

课程安排

* 整个课程分成五章
  * HTML / CSS 这部分对咱们来说，不是重点，但又不能不讲，这俩知识作为第一章，必学
  * JavaScript 这部分是重点，尤其是 ES6 以后的一些新语法，不理解这些，前端代码你根本看不懂，必学
  * Vue2，Vue3，React 这三章是三选一的关系，根据你入职公司的使用的前端技术不同，有针对地学习
    * 后三章会涵盖 TypeScript、VueCli、Vuex、VueRouter、ElementUI、Vite、CreateReactApp、React、Redux、ReactRouter 等库和工具的使用
  * jquery 经过调研，还有一些学员毕业后确实会用到，所以也作为一个可选章节进行学习



# 第一章. HTML 与 CSS

HTML 是什么：即 HyperText Markup language 超文本标记语言，咱们熟知的网页就是用它编写的，HTML 的作用是定义网页的内容和结构。

* HyperText 是指用超链接的方式组织网页，把网页联系起来
* Markup 是指用 `<标签>` 的方式赋予内容不同的功能和含义

CSS 是什么：即 Cascading  Style  Sheets 级联（层叠）样式表，它描述了网页的表现与展示效果



## 1. HTML 元素

HTML 由一系列元素 `elements` 组成，例如

```html
<p>Hello, world!</p>
```

* 整体称之为元素
* `<p>` 和 `</p>` 分别称为起始和结束标签
* 标签包围起来的 Hello, world 称之为内容

* p 是预先定义好的 html 标签，作用是将内容作为一个单独的段落



元素还可以有属性，如

```html
<p id="p1">Hello, world!</p>
```

* 属性一般是预先定义好的，这里的 id 属性是给元素一个唯一的标识



元素之间可以嵌套，如

```html
<p>HTML 是一门非常<b>强大</b>的语言</p>
```

错误嵌套写法：

```html
<p>HTML 是一门非常<b>强大的语言</p></b>
```



不包含内容的元素称之为空元素，如

```html
<img src="1.png">
<img src="1.png"/>
```

* img 作用是用来展示图片
* src 属性用来指明图片路径



## 2. HTML 页面

前面介绍的只是单独的 HTML 元素，它们可以充当一份完整的 HTML 页面的组成部分

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

* `html` 元素囊括了页面中所有其它元素，整个页面只需一个，称为根元素
* `head` 元素包含的是那些不用于展现内容的元素，如 `title`，`link`，`meta` 等
* `body` 元素包含了对用户展现内容的元素，例如后面会学到的用于展示文本、图片、视频、音频的各种元素



## 3. 常见元素

### 1) 文本

#### Heading

```html
<h1>1号标题</h1>
<h2>2号标题</h2>
<h3>3号标题</h3>
<h4>4号标题</h4>
<h5>5号标题</h5>
<h6>6号标题</h6>
```



#### Paragraph

```html
<p>段落</p>
```



#### List

无序列表 unordered list

```html
<ul>
    <li>列表项1</li>
    <li>列表项2</li>
    <li>列表项3</li>
</ul>
```

有序列表

```html
<ol>
    <li>列表项1</li>
    <li>列表项2</li>
    <li>列表项3</li>
</ol>
```

多级列表

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



#### Anchor

锚，超链接

```html
<a href="网页地址">超链接文本</a>
```



### 2) 多媒体

#### Image

```html
<img src="文件路径">
```

src 格式有 3 种

* 文件地址

* data URL，格式如下

  ```
  data:媒体类型;base64,数据
  ```

* object URL，需要配合 javascript 使用

#### Video

```html
<video src="文件路径"></video>
```

#### Audio

```html
<audio src="文件路径"></audio>
```



### 3) 表单

#### 作用与语法

表单的作用：**收集**用户填入的**数据**，并将这些数据**提交给服务器**

表单的语法

```html
<form action="服务器地址" method="请求方式" enctype="数据格式">
    <!-- 表单项 -->
    
    <input type="submit" value="提交按钮">
</form>
```

* method 请求方式有 
  * get （默认）提交时，数据跟在 URL 地址之后
  * post 提交时，数据在请求体内
* enctype 在 post 请求时，指定请求体的数据格式
  * application/x-www-form-urlencoded（默认）
  * multipart/form-data
* 其中表单项提供多种收集数据的方式
  * 有 name 属性的表单项数据，才会被发送给服务器



#### 常见的表单项

文本框

```html
<input type="text" name="uesrname">
```

密码框

```html
<input type="password" name="password">
```

隐藏框

```html
<input type="hidden" name="id">
```

日期框

```html
<input type="date" name="birthday">
```

单选

```html
<input type="radio" name="sex" value="男" checked>
<input type="radio" name="sex" value="女">
```

多选

```html
<input type="checkbox" name="fav" value="唱歌">
<input type="checkbox" name="fav" value="逛街">
<input type="checkbox" name="fav" value="游戏">
```

文件上传

```html
<input type="file" name="avatar">
```



## 4. HTTP 请求

### 1) 请求组成

请求由三部分组成

1. 请求行
2. 请求头
3. 请求体

可以用 telnet 程序测试

### 2) 请求方式与数据格式

#### get 请求示例

```
GET /test2?name=%E5%BC%A0&age=20 HTTP/1.1
Host: localhost
```

* %E5%BC%A0 是【张】经过 URL 编码后的结果

#### post 请求示例

```
POST /test2 HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded
Content-Length: 21

name=%E5%BC%A0&age=18
```

application/x-www-form-urlencoed 格式细节：

* 参数分成名字和值，中间用 = 分隔
* 多个参数使用 & 进行分隔
* 【张】等特殊字符需要用 encodeURIComponent() 编码为 【%E5%BC%A0】后才能发送



#### json 请求示例

```
POST /test3 HTTP/1.1
Host: localhost
Content-Type: application/json
Content-Length: 25

{"name":"zhang","age":18}
```



json 对象格式

```
{"属性名":属性值}
```

其中属性值可以是

* 字符串 ""
* 数字
* true, false
* null
* 对象
* 数组

json 数组格式

```
[元素1, 元素2, ...]
```



#### multipart 请求示例

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

* boundary=123 用来定义分隔符
* 起始分隔符是 `--分隔符`
* 结束分隔符是 `--分隔符--`



#### 数据格式小结

客户端发送

* 编码 
  * application/x-www-form-urlencoded ：url 编码
  * application/json：utf-8 编码
  * multipart/form-data：每部分编码可以不同
* 表单只支持以 application/x-www-form-urlencoded 和 multipart/form-data 格式发送数据
* 文件上传需要用 multipart/form-data 格式
* js 代码可以支持任意格式发送数据 

服务端接收

* 对 application/x-www-form-urlencoded 和 multipart/form-data 格式的数据，Spring 接收方式是统一的，只需要用 java bean 的属性名对应请求参数名即可
* 对于 applicaiton/json 格式的数据，Spring 接收需要使用 @RequestBody 注解 + java bean 的方式



### 3) session 原理

Http 无状态，有会话

* 无状态是指，请求之间相互独立，第一次请求的数据，第二次请求不能重用
* 有会话是指，客户端和服务端都有相应的技术，可以暂存数据，让数据在请求间共享

服务端使用了 session 技术来暂存数据

存

```
GET /s1?name=zhang HTTP/1.1
Host: localhost
```

取

```
GET /s2 HTTP/1.1
Host: localhost
Cookie: JSESSIONID=560FA845D02AE09B176E1BC5D9816A5D
```



session 技术实现身份验证

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







### 4) jwt 原理

jwt 技术实现身份验证

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

生成 token

```
GET /j1?name=zhang&pass=123 HTTP/1.1
Host: localhost
```
校验 token

```
GET /j2 HTTP/1.1
Host: localhost
Authorization: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9._1-P_TLlzQPb1_lCyGwplMZaKQ8Mcw_plBbYPZ3OX28
```



## 5. CSS

即 Cascading  Style  Sheets，它描述了网页的表现与展示效果

### 1) 选择器

* type 选择器 - 根据标签名进行匹配（元素选择器）
* class 选择器 - 根据元素的 class 属性进行匹配

* id 选择器  - 根据元素的 id 属性进行匹配

### 2) 属性和值

* background-color : red;
* ...
* display

### 3) 布局

与布局相关的 html 元素

* div
* template
