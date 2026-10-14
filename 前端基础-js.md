# 第二章. Javascript

学习变量、控制语句、函数、对象和浏览器 API，为框架学习打基础。

**学习前提与版本：** 面向浏览器 JavaScript，包含 ES6+。DOM、window、alert 等需要浏览器环境，不能默认在 Node.js 中存在。

**截图说明：** 图片保留原教学环境的操作过程；若截图中的旧写法与正文不同，以修订后的正文和所选版本的官方文档为准。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[学习索引与常见词](README.md) · [官方参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)

**内容导航**

- [1. 变量与数据类型](#section-1)
- [2. 运算符与表达式](#section-2)
- [3. 控制语句](#section-3)
- [4. API](#section-4)


它是一种脚本语言，可以用来更改页面内容，控制多媒体，制作图像、动画等等


例子

* 修改页面内容


js 代码位置

```html
<script>
    // See note 1 below.
</script>
```

示例说明：

1. js 代码


引入 js 脚本

```html
<script src="js脚本路径"></script>
```

* 注意，到了框架之后，引入方式会有不同


<a id="section-1"></a>

## 1. 变量与数据类型

### 声明变量

#### 1) let :star:

```js
let 变量名 = 值;
```

* let 声明的变量可以被多次赋值，例如

```js
let a = 100;  // See note 1 below.
a = 200;	  // See note 2 below.
```

示例说明：

1. 初始值是 100
2. ok, 被重新赋值为 200


#### 2) const :star:

* const 声明后不能重新赋值，且通常必须在声明时初始化；对象或数组内部仍可修改。const 不会冻结数据。

```js
const b = 300; // See note 1 below.
b = 400;	   // See note 2 below.
```

示例说明：

1. 初始值是 300
2. error, 不能再次赋值


* const 并不意味着它引用的内容不可修改，例如

```js
const c = [1,2,3];
c[2] = 4; 	        // See note 1 below.
c = [5,6];			// See note 2 below.
```

示例说明：

1. ok, 数组内容被修改成 [1,2,4]
2. error, 不能再次赋值


#### 3) var

var 声明的变量可以被多次赋值，例如

```js
var f = 100;
f = 200;
```


### 基本类型

#### 1,2) undefined 和 null

* 执行表达式或函数，没有返回结果，出现 undefined
* 访问数组不存在的元素，访问对象不存在的属性，出现 undefined
* 定义变量，没有初始化，出现 undefined

例

```js
console.log(1);  	// See note 1 below.
let a = 10;		 	// See note 2 below.
let b = [1,2,3];
console.log(b[10]); // See note 3 below.
let c = {"name":"张三"};
console.log(c.age); // See note 4 below.
let d;
console.log(d);		// See note 5 below.
```

示例说明：

1. 函数没有返回值, 结果是  undefined
2. 表达式没有返回值, 结果是 undefined
3. 数组未定义元素是 undefined
4. 对象未定义属性是 undefined
5. 变量未初始化是 undefined


二者共同点

* 都没有属性、方法
* 二者合称 Nullish

二者区别

* undefined 由 js 产生
* null 由程序员提供


#### 3) string :star:

js 字符串三种写法

```js
let a = "hello";  // See note 1 below.
let b = "world";  // See note 2 below.
let c = `hello`;  // See note 3 below.
```

示例说明：

1. 双引号
2. 单引号
3. 反引号


html 代码如下，用 java 和 js 中的字符串如何表示？

```html
<a href="1.html">超链接</a>
```

java 显得比较繁琐

```java
String s1 = "<a href=\"1.html\">超链接</a>";

String s2 = """
    <a href="1.html">超链接</a>""";
```

js 就比较灵活

```js
let s1 = '<a href="1.html">超链接</a>';

let s2 = `<a href="1.html">超链接</a>`;
```


模板字符串（Template strings）

需求：拼接 URI 的请求参数，如

```
/test?name=zhang&age=18
/test?name=li&age=20
```

传统方法拼接

```js
let name = 'zhang li';
let age = 18;

let uri = "/test?name=" + encodeURIComponent(name) + "&age=" + age;
```

模板字符串方式

```js
let name = 'zhang li';
let age = 18;

let uri = `/test?name=${encodeURIComponent(name)}&age=${age}`;
```


#### 4,5) number 和 bigint:star:

number 类型标识的是双精度浮动小数，例如

```js
10 / 3;   // See note 1 below.
```

示例说明：

1. 结果 3.3333333333333335


既然是浮点小数，那么可以除零

```js
10 / 0;	  // See note 1 below.
-10 / 0;  // See note 2 below.
```

示例说明：

1. 结果 Infinity 正无穷大
2. 结果 -Infinity 负无穷大


浮点小数都有运算精度问题，例如

```js
2.0 - 1.1; // See note 1 below.
```

示例说明：

1. 结果 0.8999999999999999


字符串转数字

```js
parseInt("10"); 	// See note 1 below.
parseInt("10.5");	// See note 2 below.
parseInt("10") / 3; // See note 3 below.

parseInt("abc");	// See note 4 below.
```

示例说明：

1. 结果是数字 10
2. 结果是数字 10, 去除了小数部分
3. 结果仍视为 number 浮点数, 因此结果为 3.3333333333333335
4. 转换失败，结果是特殊值 NaN (Not a Number)


number 可以精确表示安全整数范围内的整数；需要更大的整数时可以用 bigint。bigint 不能与 number 直接混合做算术运算，JSON.stringify 也不能直接序列化 bigint。，数字的结尾用 n 表示它是一个 bigint 类型

```js
10n / 3n;			// See note 1 below.
```

示例说明：

1. 结果 3n, 按整数除法处理


#### 6) boolean :star:

* Truthy
* Falsy

在 js 中，并不是 boolean 才能用于条件判断，你可以在 if 语句中使用【数字】、【字符串】... 作为判断条件

```js
let b = 1;

if(b) { // true
    console.log("进入了");
}
```


这时就有一个规则，当需要条件判断时，这个值被当作 true 还是 false，当作 true 的值归类为 truthy，当作 false 的值归类为 falsy

下面值都是 falsy

* `false`
* `Nullish (null, undefined)`
* `0, 0n, NaN`
* ``` "" '' `` ```  即长度为零的字符串

剩余的值绝大部分都是 truthy

有几个容易被当作 falsy 实际是 truthy 的

* `"false", "0"` 即字符串的 false 和 字符串的零
* `[]` 空数组
* `{}` 空对象


#### 7) symbol

* 很少使用


### 对象类型

#### 1) Function :star::star:

##### 定义函数

```js
function 函数名(参数) {
    // See note 1 below.
    return 结果;
}
```

示例说明：

1. 函数体


例

```js
function add(a, b) {
    return a + b;
}
```

##### 调用函数

```js
函数名(实参);
```

例

```js
add(1, 2);     // See note 1 below.
```

示例说明：

1. 返回 3


js 中的函数调用特点：对参数的**类型**和**个数**都没有限制，例如

```js
add('a', 'b');  // See note 1 below.
add(4, 5, 6);   // See note 2 below.
add(1);			// See note 3 below.
```

示例说明：

1. 返回 ab
2. 返回 9, 第三个参数没有被用到, 不会报错
3. 返回 NaN, 这时 b 没有定义是 undefined, undefined 做数学运算结果就是 NaN


##### 默认参数

java 中（spring）要实现默认参数的效果得这么做：

```java
@RestController
public class MyController {

    @RequestMapping("/page")
    @ResponseBody
    public void page(
        @RequestParam(defaultValue="1") int page,
        @RequestParam(defaultValue="10") int size
    ){
        // ...
    }
}
```

js

```js
function pagination(page = 1, size = 10) {
    console.log(page, size);
}
```


##### 匿名函数

语法

```js
(function (参数) {
    // See note 1 below.
    return 结果;
})
```

示例说明：

1. 函数体


例

```js
(function(a,b){
    return a + b;
})
```

第一种场景：定义完毕后立刻调用

```js
(function(a,b){
    return a + b;
})(1,2)
```

第二种场景：作为其它对象的方法，例如

页面有元素

```html
<p id="p1">点我啊</p>
```

此元素有一个 onclick 方法，会在鼠标单击这个元素后被执行，onclick 方法刚开始是 null，需要赋值后才能使用

```js
document.getElementById("p1").onclick = (function(){
    console.log("鼠标单击了...");
});
```


##### 箭头函数

```js
(参数) => {
    // See note 1 below.
    return 结果;
}
```

示例说明：

1. 函数体


* 如果没有参数，() 还是要保留
* 如果只有一个参数，() 可以省略
* 如果函数体内只有一行代码，{} 可以省略
* 如果这一行代码就是结果，return 可以省略

例

```js
document.getElementById("p1").onclick = () =>  console.log("aa");
```


##### 函数是对象

以下形式在 js 中非常常见！

1. 可以参与赋值，例，具名函数也能参与赋值

```js
function abc() {
    console.log("bb");
}

document.getElementById("p1").onclick = abc;
```


2. 有属性、有方法，执行 `console.dir(abc)`，输出结果如下

```
ƒ abc()
    arguments: null
    caller: null
    length: 0
    name: "abc"
    ➡prototype: {constructor: ƒ}
    [[FunctionLocation]]: VM1962:1
    ➡[[Prototype]]: ƒ ()
    ➡[[Scopes]]: Scopes[1]
```

* 其中带有 f 标记的是方法，不带的是属性
* 带有 ➡ 符号的可以继续展开，限于篇幅省略了

* 带有 `[[ ]]` 的是内置属性，不能访问，只能查看
* 相对重要的是 `[[Prototype]]` 和 `[[Scopes]]` 会在后面继承和作用域时讲到


3. 可以作为方法参数

```js
function a() {
    console.log('a')
}

function b(fn) {          // See note 1 below.
    console.log('b')
    fn();                 // See note 2 below.
}

b(a)
```

示例说明：

1. fn 将来可以是一个函数对象
2. 调用函数对象


4. 可以作为方法返回值

```js
function c() {
    console.log("c");
    function d() {
        console.log("d");
    }
    return d;
}

c()()
```


##### 函数作用域

函数可以嵌套（js 代码中很常见，只是嵌套的形式更多是匿名函数，箭头函数）

```js
function a() {
    function b() {
    }
}
```

看下面的例子

```js
function c() {
    var z = 30;
}

var x = 10;
function a() {
    var y = 20;
    function b() {
        // See note 1 below.
        console.log(x, y);
    }
    b();
}
a();
```

示例说明：

1. 看这里


* 以函数为分界线划定作用域，所有函数之外是全局作用域
* 查找变量时，由内向外查找
  * 在内层作用域找到变量，就会停止查找，不会再找外层
  * 所有作用域都找不到变量，报错
* 作用域本质上是函数对象的属性，可以通过 console.dir 来查看调试


##### 闭包

```js
var x = 10;
function a() {
    var y = 20;
    function b() {
        console.log(x,y);
    }
    return b;
}
a()();  // See note 1 below.
```

示例说明：

1. 在外面执行了 b


* 函数定义时，它的作用域已经确定好了，因此无论函数将来去了哪，都能从它的作用域中找到当时那些变量
* 别被概念忽悠了，闭包就是指**函数能够访问自己的作用域中变量**


##### let、var 与作用域

如果函数外层引用的是 let 变量，那么外层普通的 {} 也会作为作用域边界，最外层的 let 也占一个 script 作用域

```js
let x = 10;
if(true) {
    let y = 20;
    function b() {
        console.log(x,y);
    }
    console.dir(b);
}
```

如果函数外层引用的是 var 变量，外层普通的 {} 不会视为边界

```js
var x = 10;
if(true) {
    var y = 20;
    function b() {
        console.log(x,y);
    }
    console.dir(b);
}
```

如果 var 变量出现了重名，则他俩会被视为同一作用域中的同一个变量

```js
var e = 10;
if(true) {
    var e = 20;
    console.log(e);	// See note 1 below.
}
console.log(e);		// See note 2 below.
```

示例说明：

1. 打印 20
2. 因为是同一个变量，还是打印 20


如果是 let，则视为两个作用域中的两个变量

```js
let e = 10;
if(true) {
    let e = 20;
    console.log(e);	// See note 1 below.
}
console.log(e);		// See note 2 below.
```

示例说明：

1. 打印 20
2. 打印 10


要想里面的 e 和外面的 e 能区分开来，最简单的办法是改成 let，或者用函数来界定作用域范围

```js
var e = 10;
if(true) {
    function b() {
        var e = 20;
        console.log(e);
    }
    b();
}
console.log(e);
```


#### 2) Array :star:

语法

```js
// See note 1 below.
let arr = [1,2,3];

// See note 2 below.
console.log(arr[0]); // See note 3 below.

// See note 4 below.
arr[0] = 5;		 // See note 5 below.

// See note 6 below.
for(let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
```

示例说明：

1. 创建数组
2. 获取数组元素
3. 输出 1
4. 修改数组元素
5. 数组元素变成了 [5,2,3]
6. 遍历数组元素，其中 length 是数组属性，代表数组长度


API

* push、shift、splice

```js
let arr = [1,2,3];

arr.push(4);    	// See note 1 below.
arr.shift();		// See note 2 below.
arr.splice(1,1);	// See note 3 below.
```

示例说明：

1. 向数组尾部(右侧)添加元素, 结果 [1,2,3,4]
2. 从数组头部(左侧)移除元素, 结果 [2,3,4]
3. 删除【参数1】索引位置的【参数2】个元素，结果 [2,4]


* join

```js
let arr = ['a','b','c'];

arr.join(); 		// See note 1 below.
arr.join('');		// See note 2 below.
arr.join('-');		// See note 3 below.
```

示例说明：

1. 默认使用【,】作为连接符，结果 'a,b,c'
2. 结果 'abc'
3. 结果 'a-b-c'


* map、filter、forEach

```js
let arr = [1,2,3,6];

function a(i) {   // See note 1 below.
    return i * 10
}

// See note 2 below.

// See note 3 below.
arr.map( i => i * 10 ); // See note 4 below.
```

示例说明：

1. 代表的新旧元素之间的变换规则
2. arr.map(a) // 具名函数，结果 [10,20,30,60]
3. arr.map( (i) =&gt; {return i * 10} ); // 箭头函数
4. 箭头函数


* 传给 map 的函数，参数代表旧元素，返回值代表新元素

map 的内部实现（伪代码）

```js
function map(a) { // See note 1 below.
    let narr = [];
    for(let i = 0; i < arr.length; i++) {
        let o = arr[i]; // See note 2 below.
        let n = a(o);   // See note 3 below.
        narr.push(n);
    }
    return narr;
}
```

示例说明：

1. 参数是一个函数
2. 旧元素
3. 新元素


filter 例子

```js
let arr = [1,2,3,6];
arr.filter( (i)=> i % 2 == 1 ); // See note 1 below.
```

示例说明：

1. 结果 [1,3]


* 传给 filter 的函数，参数代表旧元素，返回 true 表示要留下的元素

forEach 例子

```js
let arr = [1,2,3,6];

/*for(let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}*/

arr.forEach( (i) => console.log(i) );
```

两个称呼

* 高阶函数，map，filter，forEach
* 回调函数，例如作为参数传入的函数


#### 3) Object :star::star:

##### 语法

```js
let obj = {
    属性名: 值,
    方法名: 函数,
    get 属性名() {},
    set 属性名(新值) {}
}
```

例1

```js
let stu1 = {
    name: "小明",
    age: 18,
    study: function(){
        console.log(this.name + "爱学习");
    }
}
```

例2

```js
let name = "小黑";
let age = 20;
let study = function(){
    console.log(this.name + "爱学习");
}

let stu2 = { name, age, study }
```

例3（重点）

```js
let stu3 = {
    name: "小白",
    age: 18,
    study(){
        console.log(this.name + "爱学习");
    }
}
```

* **注意**：对象方法这么写，仅限于对象内部

例4

```js
let stu4 = {
    _name: null, /* See note 1 below. */
    get name() {
        console.log("进入了get");
        return this._name;
    },
    set name(name) {
        console.log("进入了set");
        this._name = name;
    }
}
```

示例说明：

1. 类似于java中私有成员变量


调用 get，set

```js
stu4.name = "小白"

console.log(stu4.name)
```


##### 特色：属性增删

对比一下 Java 中的 Object

* Java 的 Object 是以类作为模板来创建，对象不能脱离类模板的范围，一个对象的属性、能用的方法都是确定好的
* js 的对象，不需要什么模板，它的属性和方法可以随时加减

```js
let stu = {name:'张三'};
stu.age = 18;					// See note 1 below.
delete stu.age;					// See note 2 below.

stu.study = function() {		// See note 3 below.
    console.log(this.name + "在学习");
}
```

示例说明：

1. 添加属性
2. 删除属性
3. 添加方法


添加 get，set，需要借助 Object.defineProperty

```js
let stu = {_name:null};

Object.defineProperty(stu, "name", {
    get(){
        return this._name;
    },
    set(name){
        this._name = name;
    }
});
```

* 参数1：目标对象
* 参数2：属性名
* 参数3：get，set 的定义


##### 特色：this

先来对 Java 中的 this 有个理解

```java
public class TestMethod {

    static class Student {
        private String name;

        public Student(String name) {
            this.name = name;
        }

        public void study(Student this, String subject) {
            System.out.println(this.name + "在学习 " + subject);
        }
    }

    public static void main(String[] args) {
        Student stu = new Student("小明");

        // See note 1 below.
        stu.study("java");
    }
}
```

示例说明：

1. 下面的代码，本质上是执行 study(stu, "java")，因此 this 就是 stu


* Java 中的 this 是个隐式参数
* Java 中，我们说 this 代表的就是调用方法的那个对象


js 中的 this 也是隐式参数，但它与函数运行时上下文相关

例如，一个“落单”的函数

```js
function study(subject) {
    console.log(this.name + "在学习 " + subject)
}
```

测试一下

```js
study("js");  // See note 1 below.
```

示例说明：

1. 输出 在学习 js


这是因为此时函数执行，全局对象 window 被当作了 this，window 对象的 name 属性是空串


同样的函数，如果作为对象的方法

```js
let stu = {
    name:"小白",
    study
}
```

这种情况下，会将当前对象作为 this

```js
stu.study('js'); 	// See note 1 below.
```

示例说明：

1. 输出 小白在学习 js


还可以动态改变 this

```js
let stu = {name:"小黑"};
study.call(stu, "js");	// See note 1 below.
```

示例说明：

1. 输出 小黑在学习 js


这回 study 执行时，就把 call 的第一个参数 stu 作为 this


一个例外是，在**箭头函数**内出现的 this，以外层 this 理解

用匿名函数

```js
let stu = {
    name: "小花",
    friends: ["小白","小黑","小明"],
    play() {
        this.friends.forEach(function(e){
            console.log(this.name + "与" + e + "在玩耍");
        });
    }
}
stu.play()
```

* this.name 所在的函数是【落单】的函数，因此 this 代表 window

输出结果为

```
与小白在玩耍
与小黑在玩耍
与小明在玩耍
```

用箭头函数

```js
let stu = {
    name: "小花",
    friends: ["小白","小黑","小明"],
    play() {
        this.friends.forEach(e => {
            console.log(this.name + "与" + e + "在玩耍");
        })
    }
}
```

* this.name 所在的函数是箭头函数，因此 this 要看它外层的 play 函数，play 又是属于 stu 的方法，因此 this 代表 stu 对象

输出结果为

```
小花与小白在玩耍
小花与小黑在玩耍
小花与小明在玩耍
```

不用箭头函数的做法

```js
let stu = {
    name: "小花",
    friends: ["小白","小黑","小明"],
    play() {
        let me = this;
        this.friends.forEach(function(e){
            console.log(me.name + "与" + e + "在玩耍");
        });
    }
}
```


##### 特色：原型继承

```js
let father = {
    f1: '父属性',
    m1: function() {
        console.log("父方法");
    }
}

let son = Object.create(father);

console.log(son.f1);  // See note 1 below.
son.m1();			  // See note 2 below.
```

示例说明：

1. 打印 父属性
2. 打印 父方法


* father 是父对象，son 去调用 .m1 或 .f1 时，自身对象没有，就到父对象找
* son 自己可以添加自己的属性和方法
* son 里有特殊属性 `__proto__` 代表它的父对象，js 术语： son 的原型对象
* 不同浏览器对打印 son 的 `__proto__` 属性时显示不同
  * Edge 打印 console.dir(son) 显示 `[[Prototype]]`
  * Firefox 打印 console.dir(son) 显示 `<prototype>`


##### 特色：基于函数的原型继承

出于方便的原因，js 又提供了一种基于函数的原型继承

> **函数职责**
>
> 1. 负责创建子对象，给子对象提供属性、方法，功能上相当于构造方法
>
> 3. 函数有个特殊的属性 prototype，它就是函数创建的子对象的父对象
>
>    **注意！**名字有差异，这个属性的作用就是为新对象提供原型

```js
function cons(f2) {
    // See note 1 below.
    this.f2 = f2;
    this.m2 = function () {
        console.log("子方法");
    }
}
// See note 2 below.
cons.prototype.f1 = "父属性";
cons.prototype.m1 = function() {
    console.log("父方法");
}
```

示例说明：

1. 创建子对象(this), 给子对象提供属性和方法
2. cons.prototype 就是父对象


配合 new 关键字，创建子对象

```js
let son = new cons("子属性")
```

子对象的 `__proto__` 就是函数的 `prototype` 属性


##### JSON

之前我们讲 http 请求格式时，讲过 json 这种数据格式，它的语法看起来与 js 对象非常相似，例如：

一个 json 对象可以长这样：

```json
{
    "name":"张三",
    "age":18
}
```

一个 js 对象长这样：

```js
const student = {
    name:"张三",
    age:18
};
```

那么他们的区别在哪儿呢？我总结了这么几点

1. 本质不同
   * json 对象本质上是个字符串，它的职责是作为客户端和服务器之间传递数据的一种格式，它的属性只是样子货
   * js 对象是切切实实的对象，可以有属性方法
2. 语法细节不同
   * json 中只能有 null、true|false、数字、字符串（只有双引号）、对象、数组
   * json 中不能有除以上的其它 js 对象的特性，如方法等
   * json 中的属性必须用双引号引起来


json 字符串与 js 对象的转换

```js
JSON.parse(json字符串);  // See note 1 below.
JSON.stringify(js对象);  // See note 2 below.
```

示例说明：

1. 返回js对象
2. 返回json字符串


### 动态类型

静态类型语言，如 Java，值有类型，变量也有类型、赋值给变量时，类型要相符

```java
int a = 10;
String b = "abc";

int c = "abc";  // See note 1 below.
```

示例说明：

1. 错误


而 js 属于动态类型语言，值有类型，但变量没有类型，赋值给变量时，没要求

例如

```js
let a = 200;

let b = 100;
b = 'abc';
b = true;
```

动态类型看起来比较灵活，但变量没有类型，会给后期维护带来困难，例如

```js
function test(obj) {
    // See note 1 below.
}
```

示例说明：

1. obj 的类型未知，必须根据不同类型做出相应的容错处理


<a id="section-2"></a>

## 2. 运算符与表达式

* `+ - * / % ** `
* `+= -= *= /= %= **=`
* `++ --`
* 位运算、移位运算
* `== != > >= < <=`
* `=== !==` :star:
* `&& || !` :star:
* `?? ?.` :star:
* `...` :star:
* 解构赋值 :star:


### 1) ===

严格相等运算符，用作逻辑判等

```js
1 == 1    	// See note 1 below.
1 == '1'	// See note 2 below.
1 === '1'	// See note 3 below.
```

示例说明：

1. 返回 true
2. 返回 true，会先将右侧的字符串转为数字，再做比较
3. 返回 false，类型不等，直接返回 false


typeof 查看某个值的类型

```js
typeof 1	// See note 1 below.
typeof '1'	// See note 2 below.
```

示例说明：

1. 返回 'number'
2. 返回 'string'


### 2) ||

需求，如果参数 n 没有传递，给它一个【男】

**推荐**做法

```js
function test(n = '男') {
    console.log(n);
}
```

你可能的做法

```js
function test(n) {
    if(n === undefined) {
        n = '男';
    }
    console.log(n);
}
```

还可能是这样

```js
function test(n) {
    n = (n === undefined) ? '男' : n;
    console.log(n);
}
```

一些老旧代码中可能的做法（不推荐）

```js
function test(n) {
    n = n || '男';
    console.log(n);
}
```

它的语法是

```js
值1 || 值2
```

如果值1 是 Truthy，返回值1，如果值1 是 Falsy 返回值 2


### 3) ?? 与 ?.

#### ??

需求，如果参数 n 没有传递或是 null，给它一个【男】

如果用传统办法

```js
function test(n) {
    if(n === undefined || n === null) {
        n = '男';
    }
    console.log(n);
}
```

用 ??

```js
function test(n) {
    n = n ?? '男';
    console.log(n);
}
```

语法

```
值1 ?? 值2
```

* 值1 是 nullish，返回值2
* 值1 不是 nullish，返回值1


#### ?.

需求，函数参数是一个对象，可能包含有子属性

例如，参数可能是

```js
let stu1 = {
    name:"张三",
    address: {
        city: '北京'
    }
};

let stu2 = {
    name:"李四"
}

let stu3 = {
    name:"李四",
    address: null
}
```

现在要访问子属性（有问题）

```js
function test(stu) {
    console.log(stu.address.city)
}
```

现在希望当某个属性是 nullish 时，短路并返回 undefined，可以用 ?.

```js
function test(stu) {
    console.log(stu.address?.city)
}
```

用传统办法

```js
function test(stu) {
    if(stu.address === undefined || stu.address === null) {
        console.log(undefined);
        return;
    }
    console.log(stu.address.city)
}
```


### 4) ...

展开运算符

作用1：打散数组，把元素传递给多个参数

```js
let arr = [1,2,3];

function test(a,b,c) {
    console.log(a,b,c);
}
```

需求，把数组元素依次传递给函数参数

传统写法

```js
test(arr[0],arr[1],arr[2]);		// See note 1 below.
```

示例说明：

1. 输出 1,2,3


展开运算符写法

```js
test(...arr);					// See note 1 below.
```

示例说明：

1. 输出 1,2,3


* 打散可以理解为【去掉了】数组外侧的中括号，只剩下数组元素


作用2：复制数组或对象

数组

```js
let arr1 = [1,2,3];
let arr2 = [...arr1];		// See note 1 below.
```

示例说明：

1. 复制数组


对象

```js
let obj1 = {name:'张三', age: 18};

let obj2 = {...obj1};		// See note 1 below.
```

示例说明：

1. 复制对象


**注意**：展开运算符复制属于浅拷贝，例如

```js
let o1 = {name:'张三', address: {city: '北京'} }

let o2 = {...o1};
```


作用3：合并数组或对象

合并数组

```js
let a1 = [1,2];
let a2 = [3,4];

let b1 = [...a1,...a2];		// See note 1 below.
let b2 = [...a2,5,...a1]	// See note 2 below.
```

示例说明：

1. 结果 [1,2,3,4]
2. 结果 [3,4,5,1,2]


合并对象

```js
let o1 = {name:'张三'};
let o2 = {age:18};
let o3 = {name:'李四'};

let n1 = {...o1, ...o2};	// See note 1 below.

let n2 = {...o3, ...o2, ...o1}; // See note 2 below.
```

示例说明：

1. 结果 {name:'张三',age:18}
2. Result: {name: '张三', age: 18}


* 复制对象时出现同名属性，后面的会覆盖前面的


### 5) [] {}

解构赋值

#### []

用在声明变量时

```js
let arr = [1,2,3];

let [a, b, c] = arr;	// See note 1 below.
```

示例说明：

1. 结果 a=1, b=2, c=3


用在声明参数时

```js
let arr = [1,2,3];

function test([a,b,c]) {
    console.log(a,b,c) 	// See note 1 below.
}

test(arr);
```

示例说明：

1. 结果 a=1, b=2, c=3


#### {}

用在声明变量时

```js
let obj = {name:"张三", age:18};

let {name,age} = obj;	// See note 1 below.
```

示例说明：

1. 结果 name=张三, age=18


用在声明参数时

```js
let obj = {name:"张三", age:18};

function test({name, age}) {
    console.log(name, age); // See note 1 below.
}

test(obj)
```

示例说明：

1. 结果 name=张三, age=18


<a id="section-3"></a>

## 3. 控制语句

* `if ... else`
* `switch`
* `while`
* `do ... while`
* `for`
* `for ... in` :star:
* `for ... of` :star:
* `try ... catch` :star:


### 1) for in

主要用来遍历对象

```js
let father = {name:'张三', age:18, study:function(){}};

for(const n in father) {
    console.log(n);
}
```

* 其中 const n 代表遍历出来的属性名
* 注意1：方法名也能被遍历出来（它其实也算一种特殊属性）
* 注意2：遍历子对象时，父对象的属性会跟着遍历出来

```js
let son = Object.create(father);
son.sex = "男";

for(const n in son) {
    console.log(n);
}
```

* 注意3：在 for in 内获取属性值，要使用 [] 语法，而不能用 . 语法

```js
for(const n in son) {
    console.log(n, son[n]);
}
```


### 2) for of

主要用来遍历数组，也可以是其它可迭代对象，如 Map，Set 等

```js
let a1 = [1,2,3];

for(const i of a1) {
    console.log(i);
}

let a2 = [
    {name:'张三', age:18},
    {name:'李四', age:20},
    {name:'王五', age:22}
];

for(const obj of a2) {
    console.log(obj.name, obj.age);
}

for(const {name,age} of a2) {
    console.log(name, age);
}
```


### 3) try catch

```js
let stu1 = {name:'张三', age:18, address: {city:'北京'}};
let stu2 = {name:'张三', age:18};

function test(stu) {
    try {
        console.log(stu.address.city)
    } catch(e) {
        console.log('出现了异常', e.message)
    } finally {
        console.log('finally');
    }
}
```


<a id="section-4"></a>

## 4. API

### 环境准备

#### 1) 安装 nvm

nvm 即 (node version manager)，好处是方便切换 node.js 版本

安装注意事项

1. 要卸载掉现有的 nodejs
2. 提示选择 nvm 和 nodejs 目录时，一定要避免目录中出现空格
3. 选用【以管理员身份运行】cmd 程序来执行 nvm 命令
4. 首次运行前设置好国内镜像地址

```
nvm node_mirror http://npm.taobao.org/mirrors/node/
nvm npm_mirror https://npm.taobao.org/mirrors/npm/
```

首先查看有哪些可用版本

```
nvm list available
```

输出

```

|   CURRENT    |     LTS      |  OLD STABLE  | OLD UNSTABLE |
|--------------|--------------|--------------|--------------|
|    18.7.0    |   16.16.0    |   0.12.18    |   0.11.16    |
|    18.6.0    |   16.15.1    |   0.12.17    |   0.11.15    |
|    18.5.0    |   16.15.0    |   0.12.16    |   0.11.14    |
|    18.4.0    |   16.14.2    |   0.12.15    |   0.11.13    |
|    18.3.0    |   16.14.1    |   0.12.14    |   0.11.12    |
|    18.2.0    |   16.14.0    |   0.12.13    |   0.11.11    |
|    18.1.0    |   16.13.2    |   0.12.12    |   0.11.10    |
|    18.0.0    |   16.13.1    |   0.12.11    |    0.11.9    |
|    17.9.1    |   16.13.0    |   0.12.10    |    0.11.8    |
|    17.9.0    |   14.20.0    |    0.12.9    |    0.11.7    |
|    17.8.0    |   14.19.3    |    0.12.8    |    0.11.6    |
|    17.7.2    |   14.19.2    |    0.12.7    |    0.11.5    |
|    17.7.1    |   14.19.1    |    0.12.6    |    0.11.4    |
|    17.7.0    |   14.19.0    |    0.12.5    |    0.11.3    |
|    17.6.0    |   14.18.3    |    0.12.4    |    0.11.2    |
|    17.5.0    |   14.18.2    |    0.12.3    |    0.11.1    |
|    17.4.0    |   14.18.1    |    0.12.2    |    0.11.0    |
|    17.3.1    |   14.18.0    |    0.12.1    |    0.9.12    |
|    17.3.0    |   14.17.6    |    0.12.0    |    0.9.11    |
|    17.2.0    |   14.17.5    |   0.10.48    |    0.9.10    |
```

建议安装 LTS（长期支持版）

```
nvm install 16.16.0
nvm install 14.20.0
```

执行 `nvm list` 会列出已安装版本

切换到 16.16.0

```
nvm use 16.16.0
```

切换到 14.20.0

```
nvm use 14.20.0
```

安装后 nvm 自己的环境变量会自动添加，但可能需要手工添加 nodejs 的 PATH 环境变量


#### 2) 检查 npm

npm 是 js 的包管理器，就类似于 java 界的 maven，要确保它使用的是国内镜像

检查镜像

```
npm get registry
```

如果返回的不是 `https://registry.npm.taobao.org/`，需要做如下设置

```
npm config set registry https://registry.npm.taobao.org/
```


#### 3) 搭建前端服务器

新建一个保存项目的 client 文件夹，进入文件夹执行

```
npm install express --save-dev
```

修改 package.json 文件

```json
{
  "type": "module",
  "devDependencies": {
    "express": "^4.18.1"
  }
}
```

* 其中 devDependencies 是 npm install --save-dev 添加的

编写 main.js 代码

```js
import express from 'express'
const app = express()

app.use(express.static('./'))
app.listen(7070)
```

执行 js 代码（运行前端服务器）

```
node main.js
```


### 前端案例

初步效果

![image-20220812103323220](Resources/image-20220812103323220.png)

架构

![image-20220812103219916](Resources/image-20220812103219916.png)

* 前端只有静态页面，使用 Express 服务器
* 后端使用 Tomcat 服务器，通过 SpringBoot、MyBatis 等框架获取数据库数据


#### 1) 查找元素

* document.getElementById - 根据 id 值查找一个元素
* [document|元素].querySelector - 根据选择器查找第一个匹配元素
* [document|元素].querySelectorAll - 根据选择器查找所有匹配元素

例如，有下面的 html 代码

```html
<div>
    <div class="title">学生列表</div>
    <div class="thead">
        <div class="row bold">
            <div class="col">编号</div>
            <div class="col">姓名</div>
            <div class="col">性别</div>
            <div class="col">年龄</div>
        </div>
    </div>
    <div class="tbody">
        <div class="row">
            <div class="col">1</div>
            <div class="col">张三</div>
            <div class="col">男</div>
            <div class="col">18</div>
        </div>
    </div>
</div>
```

执行

```js
document.querySelector('.title'); // See note 1 below.
```

示例说明：

1. 找到 &lt;div class="title"&gt;学生列表&lt;/div&gt;


执行

```js
document.querySelector('.col'); // See note 1 below.
```

示例说明：

1. 找到 &lt;div class="col"&gt;编号&lt;/div&gt;


执行

```js
document.querySelectorAll('.col');

/* See note 1 below. */
```

示例说明：

1. 找到的是一个集合；  &lt;div class="col"&gt;编号&lt;/div&gt;；  &lt;div class="col"&gt;姓名&lt;/div&gt;；  &lt;div class="col"&gt;性别&lt;/div&gt;；  &lt;div class="col"&gt;年龄&lt;/div&gt;；  &lt;div class="col"&gt;1&lt;/div&gt;；  &lt;div class="col"&gt;张三&lt;/div&gt;；  &lt;div class="col"&gt;男&lt;/div&gt;；  &lt;div class="col"&gt;18&lt;/div&gt;


执行

```js
const thead = document.querySelector('.thead');

// See note 1 below.
thead.querySelectorAll('.col');

/* See note 2 below. */
```

示例说明：

1. 只在 thead 元素范围内找
2. 找到的是一个集合；  &lt;div class="col"&gt;编号&lt;/div&gt;；  &lt;div class="col"&gt;姓名&lt;/div&gt;；  &lt;div class="col"&gt;性别&lt;/div&gt;；  &lt;div class="col"&gt;年龄&lt;/div&gt;


根据 id 属性查找既可以用

```js
document.getElementById("id值")
```

也可以用

```js
document.querySelector("#id值")
```


#### 2) 修改元素内容

* 元素.innerHTML
* 元素.textContent

例如

```js
document.querySelector('.title').innerHTML = '侠客列表'
```

效果

![image-20220812161003958](Resources/image-20220812161003958.png)

innerHTML  会解析内容中的标签，例如

![image-20220812161137912](Resources/image-20220812161137912.png)

textContent 不会解析内容中的标签

![image-20220812161341825](Resources/image-20220812161341825.png)

给 innerHTML 或 textContent 赋值空串，可以实现清空标签内容的效果


#### 3) 利用模板

```html
<div>
    <div class="title">学生列表</div>
    <div class="thead">
        <div class="row bold">
            <div class="col">编号</div>
            <div class="col">姓名</div>
            <div class="col">性别</div>
            <div class="col">年龄</div>
        </div>
    </div>
    <div class="tbody">
    </div>
</div>

<template id="tp">
    <div class="row">
        <div class="col">xx</div>
        <div class="col">xx</div>
        <div class="col">xx</div>
        <div class="col">xx</div>
    </div>
</template>

<script>
    // See note 1 below.
    let array = [
        { id: 1, name: '张三', sex: '男', age: 18 },
        { id: 2, name: '李四', sex: '女', age: 17 }
    ];

    const tp = document.getElementById("tp");
    const row = tp.content;
    const [c1,c2,c3,c4] = row.querySelectorAll(".col");
    const tbody = document.querySelector('.tbody');
    for(const {id,name,sex,age} of array) {
        c1.textContent = id;
        c2.textContent = name;
        c3.textContent = sex;
        c4.textContent = age;
        // See note 2 below.
        const newRow = document.importNode(row, true);
        // See note 3 below.
        tbody.appendChild(newRow);
    }
</script>
```

示例说明：

1. 将来这些数据从 java 端返回
2. 复制元素
3. 建立父子关系，左边父，右边子


#### 4) Fetch API

Fetch API 用来获取远程数据，始终以 Promise 表达异步结果。可以使用 await 或 then 接收结果；await 只暂停当前异步函数，不会把网络请求变成同步请求。

格式

```js
fetch(url, options) // See note 1 below.
```

示例说明：

1. 返回 Promise


await 写法

```js
const 结果 = await Promise
// See note 1 below.
```

示例说明：

1. 后续代码


* await 可在 async 函数中使用，也可在支持顶层 await 的 ES 模块中使用。普通脚本顶层不能直接使用。
* 后续代码不会在结果返回前执行

异步方式

```js
const promise = Promise.resolve('done');
promise
    .then(result => { console.log(result); })
// See note 1 below.
```

示例说明：

1. 后续代码


* 后续代码不必等待结果返回就可以执行


例：

在 express 服务器上有 students.json 文件

```json
[
    { "id": 1, "name": "张三", "sex": "男", "age": 18 },
    { "id": 2, "name": "李四", "sex": "女", "age": 17 }
]
```

现在用 fetch api 获取这些数据，并展示

await 写法

```html
<script>
    async function findStudents() {
        try {
            // See note 1 below.
            const resp = await fetch('students.json')

            // See note 2 below.
            const array = await resp.json();

            // See note 3 below.
            const tp = document.getElementById("tp");
            const row = tp.content;
            const [c1,c2,c3,c4] = row.querySelectorAll(".col");
            const tbody = document.querySelector('.tbody');
            for(const {id,name,sex,age} of array) {
                c1.textContent = id;
                c2.textContent = name;
                c3.textContent = sex;
                c4.textContent = age;
                // See note 4 below.
                const newRow = document.importNode(row, true);
                // See note 5 below.
                tbody.appendChild(newRow);
            }
        } catch (e) {
            console.log(e);
        }

    }
    findStudents()
</script>
```

示例说明：

1. 获取响应对象
2. 获取响应体, 按json格式转换为js数组
3. 显示数据
4. 复制元素
5. 建立父子关系


* fetch('students.json') 内部会发送请求，但响应结果不能立刻返回，因此 await 就是等待响应结果返回
* 其中 resp.json() 也不是立刻能返回结果，它返回的也是 Promise 对象，也要配合 await 取结果

异步方式

```html
<script>
    fetch('students.json')
        .then( resp => resp.json() )
        .then( array => {
            // See note 1 below.
            const tp = document.getElementById("tp");
            const row = tp.content;
            const [c1,c2,c3,c4] = row.querySelectorAll(".col");
            const tbody = document.querySelector('.tbody');
            for(const {id,name,sex,age} of array) {
                c1.textContent = id;
                c2.textContent = name;
                c3.textContent = sex;
                c4.textContent = age;
                // See note 2 below.
                const newRow = document.importNode(row, true);
                // See note 3 below.
                tbody.appendChild(newRow);
            }
        })
        .catch( e => console.log(e) )


</script>
```

示例说明：

1. 显示数据
2. 复制元素
3. 建立父子关系


* 第一个 then 是在响应返回后，才会调用它里面的箭头函数，箭头函数参数即 resp  响应对象
* 第二个 then 是在 json 解析完成后，才会调用它里面的箭头函数，箭头函数参数即解析结果（本例是 array 数组）
* 每次 then 都返回一个新的 Promise。回调返回普通值时，该值传给下一个 then；返回 Promise 时会等待其结果；抛出异常时进入后续的 catch。


##### 跨域问题

![image-20220814105448882](Resources/image-20220814105448882.png)

* 只要协议、主机、端口之一不同，就不同源，例如
  * http://localhost:7070/a 和 https://localhost:7070/b 就不同源
* 浏览器的同源策略还涉及页面 DOM、存储和脚本等。CORS 用于允许网页读取部分跨源响应，fetch、XHR 是常见使用场景。
  * 如果是其它客户端，例如 java http client，postman，它们是不做同源检查的
  * 通过表单提交、浏览器直接输入 url 地址这些方式发送的请求，也不会做同源检查
* 更多相关知识请参考
  * [跨源资源共享（CORS） - HTTP | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)


请求响应头解决

![image-20220814144040703](Resources/image-20220814144040703.png)

* fetch 请求跨域，会携带一个 Origin 头，代表【发请求的资源源自何处】，目标通过它就能辨别是否发生跨域
  * 我们的例子中：student.html 发送 fetch 请求，告诉 tomcat，我源自 localhost:7070
* 目标资源通过返回 Access-Control-Allow-Origin 头，告诉浏览器【允许哪些源使用此响应】
  * 我们的例子中：tomcat 返回 fetch 响应，告诉浏览器，这个响应允许源自 localhost:7070 的资源使用


代理解决

![image-20220814161532141](Resources/image-20220814161532141.png)

```cmd
npm install http-proxy-middleware --save-dev
```

在 express 服务器启动代码中加入

```js
import {createProxyMiddleware} from 'http-proxy-middleware'

// ...

app.use('/api', createProxyMiddleware({ target: 'http://localhost:8080', changeOrigin: true }));
```

fetch 代码改为

```js
const resp = await fetch('http://localhost:7070/api/students')
```

或

```js
const resp = await fetch('/api/students')
```


#### 5) 模块化

单个导出 const、let、function

```js
export const a = 10;
export let b = 20;
export function c() {
    console.log('c');
}
```

一齐导出

```js
const a = 10;
let b = 20;
function c() {
    console.log('c')
}

export {a,b,c}
```

导出 default，只能有一个

```js
export const a = 10;
export let b = 20;
export function c() {
    console.log('c')
}

export default b;
```


import 语法

```html
<script type="module">
    import { sum } from './math.js';
</script>
```

* import 需要遵循同源策略

整个导入

```js
import * as module from '/1.js'
console.log(module.a)		// See note 1 below.
console.log(module.b)		// See note 2 below.
module.c()					// See note 3 below.
```

示例说明：

1. 输出10
2. 输出20
3. 输出c


单个导入

```js
import {a,c} from '/1.js'
console.log(a)				// See note 1 below.
c()							// See note 2 below.
```

示例说明：

1. 输出10
2. 输出c


导入默认

```js
import x from '/1.js'
console.log(x)				// See note 1 below.
```

示例说明：

1. 输出20
