# 四. Vue 3

## 1. TypeScript

### 1) 动态类型的问题

前面我们讲过 js 属于动态类型语言，例如

```js
function test(obj) {    
}
```

obj 可能只是个字符串

```js
test('hello, world')
```

obj 也有可能是个函数

```js
test(()=>console.log('hello, world'))
```

obj 类型不确定，就给后期使用者带来了麻烦，一旦参数传不对，代码就崩溃了



动态类型意味着

* 运行代码时才知道发生什么 (running the code to see what happens)

静态类型意味着

* 在代码运行前，就对它的行为做出预测 (make predications about what code is expected before it runs)



下面的 typescript 代码，就在代码运行前对参数加入了约束限制

```typescript
function test(msg : string) {
}
```

* 限制了参数只能做 string 那些事

```typescript
function test(msg : Function) {
  msg()
}
```

* 限制了参数只能做函数那些事



### 2) 入门

安装 typescript 编译器

```cmd
npm install -g typescript
```

编写 ts 代码

```typescript
function hello(msg: string) {
  console.log(msg)
}

hello('hello,world')
```

执行 tsc 编译命令

```cmd
tsc xxx.ts
```

编译生成 js 代码，编译后进行了类型擦除

```js
function hello(msg) {
    console.log(msg);
}
hello('hello,world');
```



再来一个例子，用 interface 定义用户类型

```ts
interface User {
  name: string,
  age: number
}

function test(u: User): void {
  console.log(u.name)
  console.log(u.age)
}

test({ name: 'zhangs', age: 18 })
```

编译后

```js
function test(u) {
    console.log(u.name);
    console.log(u.age);
}
test({ name: 'zhangs', age: 18 });
```



可见，typescript 属于编译时实施类型检查（静态类型）的技术



### 3) 类型

| 类型        | 例                                    | 备注                         |
| ----------- | ------------------------------------- | ---------------------------- |
| 字符串类型  | string                                |                              |
| 数字类型    | number                                |                              |
| 布尔类型    | boolean                               |                              |
| 数组类型    | number[],string[], boolean[] 依此类推 |                              |
| 任意类型    | any                                   | 相当于又回到了没有类型的时代 |
| 复杂类型    | type 与 interface                     |                              |
| 函数类型    | () => void                            | 对函数的参数和返回值进行说明 |
| 字面量类型  | "a"\|"b"\|"c"                         | 限制变量或参数的取值         |
| nullish类型 | null 与 undefined                     |                              |
| 泛型        | `<T>`，`<T extends 父类型>`           |                              |



#### 标注位置

##### 标注变量

```typescript
let message: string = 'hello,world'
```

* 一般可以省略，因为可以根据后面的字面量推断出前面变量类型

```typescript
let message = 'hello,world'
```



##### 标注参数

```typescript
function greet(name: string) {
    
}
```

很多时候，都能够推断出参数类型

```typescript
const names = ['Alice', 'Bob', 'Eve']
const lowercaseNames = names.map((e: string) => e.toLowerCase())
```

* 可以用类型推断，推断出 e 是 string 类型



##### 标注返回值

```typescript
function add(a: number, b: number) : number {
    return a + b
}
```

* 一般也可以省略，因为可以根据返回值做类型推断



#### 复杂类型

##### type

```typescript
type Cat = {
  name: string,
  age: number
}

const c1: Cat = { name: '小白', age: 1 }
const c2: Cat = { name: '小花' }					  // 错误: 缺少 age 属性
const c3: Cat = { name: '小黑', age: 1, sex: '公' } // 错误: 多出 sex 属性
```



##### interface

```typescript
interface Cat {
  name: string,
  age: number
}

const c1: Cat = { name: '小白', age: 1 }
const c2: Cat = { name: '小花' }					  // 错误: 缺少 age 属性
const c3: Cat = { name: '小黑', age: 1, sex: '公' } // 错误: 多出 sex 属性
```



##### 可选属性

如果需要某个属性可选，可以用下面的语法

```typescript
interface Cat {
  name: string,
  age?: number
}

const c1: Cat = { name: '小白', age: 1 }
const c2: Cat = { name: '小花' }					  // 正确: age 属性可选
```

* 可选属性要注意处理 undefined 值



##### 鸭子类型

```typescript
interface Cat {
  name: string
}

function test(cat: Cat) {
  console.log(cat.name)
}

const c1 = { name: '小白', age: 1 } 
test(c1)
```

* const c1 并没有声明类型为 Cat，但它与 Cat 类型有一样的属性，也可以被当作是 Cat 类型



#### 方法类型

```typescript
interface Api {
  foo(): void,
  bar(str: string): string
}

function test(api: Api) {
  api.foo()
  console.log(api.bar('hello'))
}

test({
  foo() { console.log('ok') },
  bar(str: string) { return str.toUpperCase() }
})
```



#### 字面量类型

```typescript
function printText(s: string, alignment: "left" | "right" | "center") {
  console.log(s, alignment)
}

printText('hello', 'left')
printText('hello', 'aaa') // 错误: 取值只能是 left | right | center
```



#### nullish 类型

```typescript
function test(x?: string | null) {
  console.log(x?.toUpperCase())
}

test('aaa')
test(null)
test()
```

* x?: string | null 表示可能是 undefined 或者是 string 或者是 null



#### 泛型

下面的几个类型声明显然有一定的相似性

```typescript
interface RefString {
  value: string
}

interface RefNumber {
  value: number
}

interface RefBoolean {
  value: boolean
}

const r1: RefString = { value: 'hello' }
const r2: RefNumber = { value: 123 }
const r3: RefBoolean = { value: true }
```

可以改进为

```typescript
interface Ref<T> {
  value: T
}

const r1: Ref<string> = { value: 'hello' }
const r2: Ref<number> = { value: 123 }
const r3: Ref<boolean> = { value: true }
```

* 泛型的要点就是 `<类型参数>`，把【类型】也当作一个变化的要素，像参数一样传递过来，这样就可以派生出结构相似的新类型



函数定义也支持泛型

```typescript
function ref<T>(n: T): Ref<T> {
  return { value: n }
}

const v1 = ref("hello"); 	// Ref<string>
const v2 = ref(123.3333);	// Ref<number>

v1.value.toLocaleLowerCase()
v2.value.toFixed(2)
```



### 4) 意义

#### 更好理解框架

现在越来越多的前端框架采用 typescript，如果懂 typescript 语法，可以更好地阅读框架代码

以 Map 为例

```typescript
const map = new Map<string, string>()
map
  .set("a", "b")
  .set("c", "d")

map.forEach((value,key,m)=>{
  console.log(value, key)
})
```

* 注意编译需要 `tsc --target es6 .\xxx.ts`



#### 更好的提示

例如，从服务器返回的一段 json，如果不用 typescript，则编辑器也不能给出准确的提示

```typescript
interface User {
  name: string,
  age: number
}

const user: User = JSON.parse(`{ "name":"张三", "age":18 }`)
```



### 5) 类

> 关于 TypeScript 与 JavaScript 中的类语法不是重点，class 相关语法只是起到辅助作用，更重要的是前面讲的 interface

#### 基本语法

```typescript
class User {
    name: string;
    
    constructor(name: string) {
        this.name = name
    }
}

const u = new User('张三')
```

其实会被编译成这个样子（默认 --target=es3）

```js
var User = /** @class */ (function () {
    function User(name) {
        this.name = name;
    }
    return User;
}());
var u = new User('张三');
```

所以 js 中的 class，并不等价于 java 中的 class，它还是基于原型实现的，原理参考第二章（036、037）



#### 只读属性

```typescript
class User {
  readonly name: string;
  
  constructor(name: string) {
      this.name = name
  }
}

const u = new User('张三')
u.name = '李四'				// 编译错误
```

* readonly 是 typescript 特有的，表示该属性只读



#### 方法

```typescript
class User {
  readonly name: string;
  
  constructor(name: string) {
      this.name = name
  }

  study() {
    console.log(`[${this.name}]正在学习`)
  }
}

const u = new User('张三')
u.study()
```



#### get，set

```typescript
class User {
  _name: string;

  constructor(name: string) {
    this._name = name
  }

  get name() {
    return this._name
  }

  set name(name: string) {
    this._name = name
  }
}

const u = new User('张三')
console.log(u.name)
u.name = '李四'
console.log(u.name)
```

* 注意，需要在编译时加上 `tsc --target es6 .\xxx.ts` 选项
* es6 等价于 es2015，再此之上还有 es2016 ... es2022



#### 类与接口

```typescript
interface User {
  name: string
  study(course: string): void
}

class UserImpl implements User {
  name: string;
  constructor(name: string) {
    this.name = name
  }
  study(course: string) {
    console.log(`[${this.name}]正在学习[${course}]`)
  }
  foo() { }
}

const user: User = new UserImpl('张三')
user.study('Typescript')
user.foo() // 错误，必须是接口中定义的方法
```



#### 继承与接口

```typescript
interface Flyable {
  fly(): void
}

class Animal {
  name: string;
  constructor(name: string) {
    this.name = name
  }
}

class Bird extends Animal implements Flyable {
  fly() {
    console.log(`${this.name}在飞翔`)
  }
}

const b: Flyable & Animal = new Bird("小花")
b.fly()
```

* Flyable & Animal 表示变量是 flyable 类型，同时也是 Animal 类型



#### 方法重写

```typescript
class Father {
  study(): void {
    console.log(`father study`)
  }
}

class Son extends Father {  
  study(): void {
    super.study()
    console.log(`son study`)
  }
}

const f: Father = new Son()
f.study()
```



## 2. Vue3 基础

技术选型

* Vue 
  * **选项式 API** 还是 **组合式 API**✔️
  * **HTML** 还是 **单文件组件**✔️
* 语法
  * **javascript** 还是 **typescript**✔️
* 构建工具
  * **@vue/cli** 还是 **vite**✔️
* 路由
  * **vue-router**✔️
* 共享存储
  * **vuex** 还是 **pinia**✔️
* 视图组件
  * **ElementUI** 还是 **Antdv**✔️



### 1) 环境准备

#### 创建项目

采用 vite 作为前端项目的打包，构建工具

```cmd
npm init vite@latest
```

按提示操作

```cmd
cd 项目目录
npm install
npm run dev
```



#### 编码 IDE

推荐采用微软的 VSCode 作为开发工具，到它的官网 [Visual Studio Code - Code Editing. Redefined](https://code.visualstudio.com/) 下载安装即可

![image-20220911090418621](imgs/image-20220911090418621.png)

要对 *.vue 做语法支持，还要安装一个 Volar 插件

![image-20220911090756694](imgs/image-20220911090756694.png)



#### 安装 devtools

* devtools 插件网址：https://devtools.vuejs.org/guide/installation.html

![image-20220815141648040](imgs/image-20220815141648040.png)



#### 修改端口

打开项目根目录下 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 7070
  }
})
```

* 文档地址：[配置 Vite {#configuring-vite} | Vite中文网 (vitejs.cn)](https://vitejs.cn/config/#server-port)



#### 配置代理

为了避免前后端服务器联调时， fetch、xhr 请求产生跨域问题，需要配置代理，同样是修改项目根目录下 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 7070,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

* 文档地址：[配置 Vite {#configuring-vite} | Vite中文网 (vitejs.cn)](https://vitejs.cn/config/#server-proxy)



#### 项目结构

```
index.html
package.json
tsconfig.json
vite.config.ts
├─public
└─src
    ├─assets
    ├─components
    ├─model
    ├─router
    ├─store
    └─views
```

* index.html 为主页面
* package.json npm 配置文件
* tsconfig.json typescript 配置文件
* vite.config.ts vite 配置文件
* public 静态资源
* src/components 可重用组件
* src/model 模型定义
* src/router 路由
* src/store 共享存储
* src/views 视图组件



### 2) Vue 组件

Vue 的组件文件以 .vue 结尾，每个组件由三部分组成

```vue
<script setup lang="ts"></script>

<template></template>

<style scoped></style>
```

* script 代码部分，控制模板的数据来源和行为
* template 模板部分，由它生成 html 代码
* style 样式部分，一般不咋关心



根组件是 src/App.vue，先来个 Hello,world 例子

```vue
<script setup lang="ts">
import { ref } from "vue";
let msg = ref("hello"); // 把数据变成响应式的

function change() {
  msg.value = "world";
  console.log(msg);
}
</script>
<template>
  <h1>{{ msg }}</h1>
  <input type="button" value="修改msg" @click="change" />
</template>
```

* {{msg}} 用来把一个变量绑定到页面上某个位置
* 绑定的变量必须用 ref 函数来封装
  * ref 返回的是【响应式】数据，即数据一旦变化，页面展示也跟着变化



#### main.ts

```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App)
  .mount('#app')
```

* createApp 是创建一个 Vue 应用程序，它接收的参数 App 即之前我们看到的根组件
* mount 就是把根组件生成的 html 代码片段【挂载】到 index.html 中 id 为 app 的 html 元素上



可以修改自己的组件文件，挂载到主页面

新建 src/views/E0.vue，内容如下

```vue
<script setup lang="ts">
import { ref } from 'vue'
const msg = ref('Hello, World!!')
</script>
<template>
  <h1>{{ msg }}</h1>
</template>
```

修改 main.ts 将自己的组件文件挂载

```typescript
import { createApp } from 'vue'
import './style.css'
// import App from './App.vue'
import E0 from './views/E0.vue'

createApp(E0).mount('#app')
```

* 以后我们用这样的方式演示课堂案例



打开浏览器控制台，进入 Vue 的开发工具，尝试做如下修改

![image-20220906141650435](imgs/image-20220906141650435.png)

当把 msg 的值由 "Hello, World" 改为 "你好" 时，会发现页面展示同步发生了变化



#### ref 与 reactive

vue 提供了两个函数，都可以将数据变为【响应式】的

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
const msg = ref('Hello, World')
const user = reactive({ name: '张三' })
</script>

<template>
  <h2>{{msg}}</h2>
  <h2>{{user.name}}</h2>
</template>
```

* ref 能将任意类型的数据变为【响应式】的
* reactive 只能将对象类型变为【响应式】，对基本类型无效（例如 string，number，boolean）



还有一点不同

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
const u1 = ref({ name: '张三' })
const u2 = reactive({ name: '张三' })

function test() {
  console.log(u1.value)
  console.log(u2)
}

test()
</script>
  
<template>
  <h2>{{u1.name}}</h2>
  <h2>{{u2.name}}</h2>
</template>
```

* 在 template 模板中使用 ref 包装的数据，直接写【变量名】就可以了
* 但在代码中要使用 ref 包装的数据，必须用【变量名.value】才能访问到
* reactive 包装的数据，在模板中和代码中都是一致的



#### 属性绑定

```vue
<script setup lang="ts">
import { ref } from 'vue'
const path = ref('/src/assets/vue.svg')

</script>

<template>
  <img :src="path" alt="">
</template>
```

* 【:属性名】用来将标签属性与【响应式】变量绑定



#### 事件绑定

```vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
function dec() {
  count.value--
}
function inc() {
  count.value++
}
</script>

<template>
  <input type="button" value="-" @click="dec">
  <h2>{{count}}</h2>
  <input type="button" value="+" @click="inc">
</template>
```

* 【@事件名】用来将标签属性与函数绑定，事件发生后执行函数内代码



#### 表单绑定

```vue
<script setup lang="ts">
import { ref } from "vue";
const user = ref({
  name:'张三',
  age:18,
  sex:'男',
  fav:['游泳','打球']
})

function saveUser() {
  console.log(user.value)
}
</script>

<template>
  <div class="outer">
    <div>
      <label for="">请输入姓名</label>
      <input type="text" v-model="user.name"/>
    </div>
    <div>
      <label for="">请输入年龄</label>
      <input type="text" v-model="user.age"/>
    </div>
    <div>
      <label for="">请选择性别</label>
      男 <input type="radio" value="男" v-model="user.sex"/> 
      女 <input type="radio" value="女" v-model="user.sex"/>
    </div>
    <div>
      <label for="">请选择爱好</label>
      游泳 <input type="checkbox" value="游泳" v-model="user.fav"/> 
      打球 <input type="checkbox" value="打球" v-model="user.fav"/> 
      健身 <input type="checkbox" value="健身" v-model="user.fav"/>
    </div>
    <div>
      <input type="button" value="保存" @click="saveUser">
    </div>
  </div>
</template>

<style scoped>
  div {
    margin-bottom: 8px;
  }
  .outer {
    width: 100%;
    position: relative;
    padding-left: 80px;
  }
  label {
    text-align: left;
    width: 100px;
    display: inline-block;
    position: absolute;
    left :0;
  }
</style>
```

* 用 v-model 实现双向绑定，即 
  * javascript 数据可以同步到表单标签
  * 反过来用户在表单标签输入的新值也会同步到 javascript 这边
* 双向绑定只适用于表单这种带【输入】功能的标签，其它标签的数据绑定，单向就足够了
* 复选框这种标签，双向绑定的 javascript 数据类型一般用数组



#### 计算属性

有时在数据展示时要做简单的计算

```vue
<script setup lang="ts">
import { ref } from 'vue'
const firstName = ref('三')
const lastName = ref('张')

</script>

<template>
  <h2>{{lastName + firstName}}</h2>
  <h3>{{lastName + firstName}}</h3>
  <h4>{{lastName + firstName}}</h4>
</template>
```

看起来较为繁琐，可以用计算属性改进

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
const firstName = ref('三')
const lastName = ref('张')
const fullName = computed(() => {
  console.log('enter')
  return lastName.value + firstName.value
})
</script>

<template>
  <h2>{{fullName}}</h2>
  <h3>{{fullName}}</h3>
  <h4>{{fullName}}</h4>
</template>
```

* fullName 即为计算属性，它具备缓存功能，即 firstName 和 lastName 的值发生了变化，才会重新计算
* 如果用函数实现相同功能，则没有缓存功能

```vue
<script setup lang="ts">
import { ref } from 'vue'
const firstName = ref('三')
const lastName = ref('张')
function fullName() {
  console.log('enter')
  return lastName.value + firstName.value
}
</script>
  
<template>
  <h2>{{fullName()}}</h2>
  <h3>{{fullName()}}</h3>
  <h4>{{fullName()}}</h4>
</template>
```



#### xhr

浏览器中有两套 API 可以和后端交互，发送请求、接收响应，fetch api 前面我们已经介绍过了，另一套 api 是 xhr，基本用法如下

```js
const xhr = new XMLHttpRequest()
xhr.onload = function() {
    console.log(xhr.response)
}
xhr.open('GET', 'http://localhost:8080/api/students')
xhr.responseType = "json"
xhr.send()
```

但这套 api 虽然功能强大，但比较老，不直接支持 Promise，因此有必要对其进行改造

```typescript
function get(url: string) {
  return new Promise((resolve, reject)=>{
    const xhr = new XMLHttpRequest()
    xhr.onload = function() {
      if(xhr.status === 200){
        resolve(xhr.response)
      } else if(xhr.status === 404) {
        reject(xhr.response)
      } // 其它情况也需考虑，这里简化处理
    }
    xhr.open('GET', url)
    xhr.responseType = 'json'
    xhr.send()
  })
}
```

* Promise 对象适合用来封装异步操作，并可以配合 await 一齐使用
* Promise 在构造时，需要一个箭头函数，箭头函数有两个参数 resolve 和 reject
  * resolve 是异步操作成功时被调用，把成功的结果传递给它，最后会作为 await 的结果返回
  * reject 在异步操作失败时被调用，把失败的结果传递给它，最后在 catch 块被捉住
* await 会一直等到 Promise 内调用了 resolve 或 reject 才会继续向下运行



调用示例1：同步接收结果，不走代理

```js
try {
  const resp = await get("http://localhost:8080/api/students")
  console.log(resp)
} catch (e) {
  console.error(e)
}
```

调用示例2：走代理

```js
try {
  const resp = await get('/api/students')
  console.log(resp)  
} catch(e) {
  console.log(e)
}
```

* 走代理明显慢不少



#### axios

##### 基本用法

axios 就是对 xhr api 的封装，手法与前面例子类似

安装

```cmd
npm install axios
```

一个简单的例子

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

let count = ref(0);

async function getStudents() {
  try {
    const resp = await axios.get("/api/students");
    count.value = resp.data.data.length;
  } catch (e) {
    console.log(e);
  }
}

onMounted(() => {
  getStudents()
})
</script>

<template>
  <h2>学生人数为：{{ count }}</h2>
</template>
```

* onMounted 指 vue 组件生成的 html 代码片段，挂载完毕后被执行



再来看一个 post 例子

```vue
<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const student = ref({
  name: '',
  sex: '男',
  age: 18
})

async function addStudent() {
  console.log(student.value)
  const resp = await axios.post('/api/students', student.value)
  console.log(resp.data.data)
}
</script>

<template>
  <div>
    <div>
      <input type="text" placeholder="请输入姓名" v-model="student.name"/>
    </div>
    <div>
      <label for="">请选择性别</label>
      男 <input type="radio" value="男" v-model="student.sex"/> 
      女 <input type="radio" value="女" v-model="student.sex"/>
    </div>
    <div>
      <input type="number" placeholder="请输入年龄" v-model="student.age"/>
    </div>
    <div>
      <input type="button" value="添加" @click="addStudent"/>
    </div>
  </div>
</template>
<style scoped>
div {
  font-size: 14px;
}
</style>
```



##### 环境变量

* 开发环境下，联调的后端服务器地址是 `http://localhost:8080`，
* 上线改为生产环境后，后端服务器地址为 `http://itheima.com`

这就要求我们区分开发环境和生产环境，这件事交给构建工具 vite 来做



默认情况下，vite 支持上面两种环境，分别对应根目录下两个配置文件 

* .env.development - 开发环境
* .env.production - 生产环境

针对以上需求，分别在两个文件中加入

```properties
VITE_BACKEND_API_BASE_URL = 'http://localhost:8080'
```

和

```properties
VITE_BACKEND_API_BASE_URL = 'http://itheima.com'
```

然后在代码中使用 vite 给我们提供的特殊对象 `import.meta.env`，就可以获取到 `VITE_BACKEND_API_BASE_URL` 在不同环境下的值

```js
import.meta.env.VITE_BACKEND_API_BASE_URL
```



默认情况下，不能智能提示自定义的环境变量，做如下配置：新增文件 `src/env.d.ts` 并添加如下内容

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_API_BASE_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

* 参考文档地址 [环境变量和模式 | Vite 官方中文文档 (vitejs.dev)](https://cn.vitejs.dev/guide/env-and-mode.html)



##### baseURL

可以自己创建一个 axios 对象，方便添加默认设置，新建文件 /src/api/request.ts

```typescript
// 创建新的 axios 对象
import axios from 'axios'
const _axios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL
})

export default _axios
```

然后在其它组件中引用这个 ts 文件，例如 /src/views/E8.vue，就不用自己拼接路径前缀了

```vue
<script setup lang="ts">
import axios from '../api/request'
// ...
await axios.post('/api/students', ...)    
</script>
```



##### 拦截器

```typescript
// 创建新的 axios 对象
import axios from 'axios'
const _axios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL
})

// 请求拦截器
_axios.interceptors.request.use(
  (config)=>{ // 统一添加请求头
    config.headers = {
      Authorization: 'aaa.bbb.ccc'
    }
    return config
  },
  (error)=>{ // 请求出错时的处理
    return Promise.reject(error)
  }
)

// 响应拦截器
_axios.interceptors.response.use(
  (response)=>{ // 状态码  2xx
    // 这里的code是自定义的错误码
    if(response.data.code === 200) {
      return response
    }     
    else if(response.data.code === 401) {       
      // 情况1
      return Promise.resolve({})
    }
    // ... 
  },
  (error)=>{ // 状态码 > 2xx, 400,401,403,404,500
    console.error(error) // 处理了异常
    if(error.response.status === 400) {
      // 情况1
    } else if(error.response.status === 401) {
      // 情况2
    } 
    // ...
    return Promise.resolve({})
  }
)

export default _axios
```

处理响应时，又分成两种情况

1. 后端返回的是标准响应状态码，这时会走响应拦截器第二个箭头函数，用 error.response.status 做分支判断
2. 后端返回的响应状态码总是200，用自定义错误码表示出错，这时会走响应拦截器第一个箭头函数，用 response.data.code 做分支判断

另外

* Promise.reject(error) 类似于将异常继续向上抛出，异常由调用者（Vue组件）来配合 try ... catch 来处理
* Promise.resolve({}) 表示错误已解决，返回一个空对象，调用者中接到这个空对象时，需要配合 ?. 来避免访问不存在的属性



#### 条件与列表

首先，新增模型数据 src/model/Model8080.ts

```typescript
export interface Student {
  id: number;
  name: string;
  sex: string;
  age: number;
}

// 如果 spring 错误，返回的对象格式
export interface SpringError {
  timestamp: string,
  status: number,
  error: string,
  message: string,
  path: string
}

// 如果 spring 成功，返回 list 情况
export interface SpringList<T> {
  data: T[],
  message?: string,
  code: number
}

// 如果 spring 成功，返回 page 情况
export interface SpringPage<T> {
  data: { list: T[], total: number },
  message?: string,
  code: number
}

// 如果 spring 成功，返回 string 情况
export interface SpringString {
  data: string,
  message?: string,
  code: number
}

import { AxiosResponse } from 'axios'
export interface AxiosRespError extends AxiosResponse<SpringError> { }
export interface AxiosRespList<T> extends AxiosResponse<SpringList<T>> { }
export interface AxiosRespPage<T> extends AxiosResponse<SpringPage<T>> { }
export interface AxiosRespString extends AxiosResponse<SpringString> { }
```

其中 

* AxiosRespPage 代表分页时的响应类型
* AxiosRespList 代表返回集合时的响应类型
* AxiosRespString 代表返回字符串时的响应类型
* AxiosRespError 代表 Spring 出错时时的响应类型

```vue
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "../api/request";
import { Student, SpringList } from "../model/Model8080";

// 说明 students 数组类型为 Student[]
const students = ref<Student[]>([]);

async function getStudents() {
  // 说明 resp.data 类型是 SpringList<Student>
  const resp = await axios.get<SpringList<Student>>("/api/students");  
  console.log(resp.data.data);
  students.value = resp.data.data;
}

onMounted(() => getStudents());
</script>
<template>
  <div class="outer">
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
      <div v-if="students.length === 0">暂无数据</div>
      <template v-else>
        <div class="row" v-for="s of students" :key="s.id">
          <div class="col">{{ s.id }}</div>
          <div class="col">{{ s.name }}</div>
          <div class="col">{{ s.sex }}</div>
          <div class="col">{{ s.age }}</div>
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped>
.outer {
  font-family: 华文行楷;
  font-size: 20px;
  width: 500px;
}

.title {
  margin-bottom: 10px;
  font-size: 30px;
  color: #333;
  text-align: center;
}

.row {
  background-color: #fff;
  display: flex;
  justify-content: center;
}

.col {
  border: 1px solid #f0f0f0;
  width: 15%;
  height: 35px;
  text-align: center;
  line-height: 35px;
}

.bold .col {
  background-color: #f1f1f1;
}
</style>
```

* 加入泛型是为了更好的提示
* v-if 与 v-else 不能和 v-for 处于同一标签
* template 标签还有一个用途，就是用它少生成一层真正 html 代码
* 可以看到将结果封装为响应式数据还是比较繁琐的，后面会使用 useRequest 改进



#### 监听器

利用监听器，可以在【响应式】的基础上添加一些副作用，把更多的东西变成【响应式的】

* 原本只是数据变化 => 页面更新

* watch 可以在数据变化时 => 其它更新

```vue
<template>
  <input type="text" v-model="name" />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
function useStorage(name: string) {
  const data = ref(sessionStorage.getItem(name) ?? "");
  watch(data, (newValue) => {
    sessionStorage.setItem(name, newValue);
  });
  return data;
}
const name = useStorage("name");
</script>
```

* 名称为 useXXXX 的函数，作用是返回带扩展功能的【响应式】数据
* localStorage   即使浏览器关闭，数据还在
* sessionStorage  数据工作在浏览器活动期间



#### vueuse

安装

```cmd
npm install @vueuse/core
```

一些函数的用法

```vue
<template>
  <h3>X: {{x}}</h3>
  <h3>Y: {{y}}</h3>

  <h3>{{count}}</h3>
  <input type="button" @click="inc()" value="+">
  <input type="button" @click="dec()" value="-">

  <input type="text" v-model="name">
</template>
<script setup lang="ts">
import { useMouse, useCounter, useStorage } from '@vueuse/core'

const {x, y} = useMouse()

const {count, inc, dec} = useCounter()

const name = useStorage("name", "")
</script>
```



#### useRequest

响应式的 axios 封装，官网地址 [一个 Vue 请求库 | VueRequest (attojs.org)](https://next.cn.attojs.org/)

首先安装 vue-request

```cmd
npm install vue-request@next
```

组件

```vue
<template>
  <h3 v-if="students.length === 0">暂无数据</h3>
  <ul v-else>
    <li v-for="s of students" :key="s.id">
      <span>{{s.name}}</span>
      <span>{{s.sex}}</span>
      <span>{{s.age}}</span>
    </li>
  </ul>
</template>
<script setup lang="ts">
import axios from "../api/request"
import { useRequest } from 'vue-request'
import { computed } from 'vue'
import { AxiosRespList, Student } from '../model/Model8080'

// data 代表就是 axios 的响应对象
const { data } = useRequest<AxiosRespList<Student>>(() => axios.get('/api/students'))

const students = computed(()=>{
  return data?.value?.data.data || []
})
</script>
<style scoped>
ul li {
  list-style: none;
  font-family: "华文行楷";
}

li span:nth-child(1) {
  font-size: 24px;
}
li span:nth-child(2) {
  font-size: 12px;
  color: crimson;
  vertical-align: bottom;
}
li span:nth-child(3) {
  font-size: 12px;
  color: darkblue;
  vertical-align: top;
}
</style>
```

* data.value 的取值一开始是 undefined，随着响应返回变成 axios 的响应对象
* 用 computed 进行适配



#### usePagination

在 src/model/Model8080.ts 中补充类型说明

```typescript
export interface StudentQueryDto {
  name?: string,
  sex?: string,
  age?: string, // 18,20
  page: number,
  size: number
}
```

* js 中类似于 18,20 这样以逗号分隔字符串，会在 get 传参时转换为 java 中的整数数组

编写组件

```vue
<template>
  <input type="text" placeholder="请输入姓名" v-model="dto.name">
  <select v-model="dto.sex">
    <option value="" selected>请选择性别</option>
    <option value="男">男</option>
    <option value="女">女</option>
  </select>
  <input type="text" placeholder="请输入年龄范围" v-model="dto.age">
  <br>
  <input type="text" placeholder="请输入页码" v-model="dto.page">
  <input type="text" placeholder="请输入页大小" v-model="dto.size">
  <input type="button" value="搜索" @click="search">
  <hr>
  <h3 v-if="students.length === 0">暂无数据</h3>
  <ul v-else>
    <li v-for="s of students" :key="s.id">
      <span>{{s.name}}</span>
      <span>{{s.sex}}</span>
      <span>{{s.age}}</span>
    </li>
  </ul>
  <hr>
  总记录数{{total}} 总页数{{totalPage}}
</template>
<script setup lang="ts">
import axios from "../api/request"
import { usePagination } from 'vue-request'
import { computed, ref } from 'vue'
import { AxiosRespPage, Student, StudentQueryDto } from '../model/Model8080'

const dto = ref<StudentQueryDto>({name:'', sex:'', age:'', page:1, size:5})

// data 代表就是 axios 的响应对象
// 泛型参数1: 响应类型
// 泛型参数2: 请求类型
const { data, total, totalPage, run } = usePagination<AxiosRespPage<Student>, StudentQueryDto[]>(
  (d) => axios.get('/api/students/q', {params: d}), // 箭头函数
  {
    defaultParams: [ dto.value ], // 默认参数, 会作为参数传递给上面的箭头函数
    pagination: {
      currentKey: 'page', // 指明当前页属性
      pageSizeKey: 'size', // 指明页大小属性
      totalKey: 'data.data.total' // 指明总记录数属性
    } 
  } // 选项
)

const students = computed(()=>{
  return data?.value?.data.data.list || []
})

function search() {
  run(dto.value) // 会作为参数传递给usePagination的箭头函数
}
</script>
<style scoped>
ul li {
  list-style: none;
  font-family: "华文行楷";
}

li span:nth-child(1) {
  font-size: 24px;
}
li span:nth-child(2) {
  font-size: 12px;
  color: crimson;
  vertical-align: bottom;
}
li span:nth-child(3) {
  font-size: 12px;
  color: darkblue;
  vertical-align: top;
}
input,select {
  width: 100px;
}
</style>
```

* usePagination 只需要定义一次，后续还想用它内部的 axios 发请求，只需调用 run 函数



#### 子组件

##### 例1

定义子组件 Child1

```vue
<template>
  <div class="container">
    <div class="card">
      <div>
        <p class="name">{{name}}</p>
        <p class="location">{{country}}</p>
      </div>
      <img :src="avatar || '/src/assets/vue.svg'"/>
    </div>
  </div>
</template>
<script setup lang="ts">
// 定义属性,  编译宏
defineProps<{name:string,country:string,avatar?:string}>()
</script>
<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  flex-direction: row-reverse;
}
.name {
  font-weight: bold;
}
.location {
  font-size: 0.8em;
  color: #6d597a;
}
.card {
  display: flex;
  justify-content: space-evenly;
  padding: 1em;
  margin: 1rem;
  border-radius: 5px;
  background: #fff;
  width: 200px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.card:hover {
  transform: rotate(-5deg);
}

.card img {
  margin-left: 1em;
  border-radius: 50%;
  max-width: 55px;
  max-height: 55px;
}
</style>
```

父组件引用

```vue
<template>
  <Child1 name="张三" country="中国" avatar="/src/assets/vue.svg"></Child1>
  <Child1 name="李四" country="印度" avatar="/vite.svg"></Child1>
  <Child1 name="王五" country="韩国" ></Child1>
</template>
<script lang="ts" setup>
import Child1 from '../components/Child1.vue';
</script>
```



##### 例2

首先添加类型说明 model/ModelRandomUser.ts

```typescript
import { AxiosResponse } from "axios";
export interface AxiosRespResults extends AxiosResponse<Results>{}

export interface Results {
  info: {
    page: number,
    results: number
  },
  results: Result[]
}

export interface Result {
  gender: 'male' | 'female',
  name: {
    first: string,
    last: string
  },
  location: {
    country: string
  },
  picture: {
    medium: string
  },
  login: {
    username: string
  }
}
```

子组件不变，父组件使用子组件

```vue
<!-- 父组件 -->
<template>
  <Child1 v-for="u of users" 
    :name="u.name.first" 
    :country="u.location.country" 
    :avatar="u.picture.medium"
    :key="u.login.username"></Child1>
</template>
<script setup lang="ts">
import axios from "axios";
import { useRequest } from "vue-request";
import { computed } from "vue";
import { AxiosRespResults } from '../model/ModelRandomUser'
import Child1 from "../components/Child1.vue";

const { data } = useRequest<AxiosRespResults>(
  ()=>axios.get('https://randomuser.me/api/?results=3')
)

const users = computed(()=>{
  return data.value?.data.results || []
})
</script>
```

如果觉得 Result 数据结构嵌套太复杂，还可以做一个类型映射

```vue
<!-- 父组件 -->
<template>
  <Child1 v-for="u of users" 
    :name="u.name" 
    :country="u.country" 
    :avatar="u.avatar"
    :key="u.username"></Child1>
</template>
<script setup lang="ts">
import axios from "axios";
import { useRequest } from "vue-request";
import { computed } from "vue";
import { AxiosRespResults, Result } from '../model/ModelRandomUser'
import Child1 from "../components/Child1.vue";

const { data } = useRequest<AxiosRespResults>(
  ()=>axios.get('https://randomuser.me/api/?results=3')
)

const users = computed(()=>{
  return data.value?.data.results.map(resultToUser) || []
})

interface User {
  name: string,
  country: string,
  avatar: string,
  username: string
}
function resultToUser(r:Result):User {
  return {
    name: r.name.first,
    country: r.location.country,
    avatar: r.picture.medium,
    username: r.login.username
  }
}
</script>
```

* resultToUser 将 Result 类型映射为 User 类型



## 3. Vue 进阶

### 1) Antdv

添加必要插件

```cmd
npm install ant-design-vue
```

* ant-design-vue 组件库插件

引入 antdv 功能，修改 main.ts

```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

createApp(App).use(antd).mount('#app')
```



#### 表格

```vue
<template>
  <!-- <a-table :columns="columns" :dataSource="students" rowKey="id"></a-table> -->
  <a-table :columns="columns" :dataSource="students" :rowKey="rowKey"></a-table>
</template>
<script setup lang="ts">
import axios from "../api/request";
import { ref, computed } from "vue";
import { useRequest } from "vue-request";
import { AxiosRespList, Student } from "../model/Model8080";

const {data} = useRequest<AxiosRespList<Student>>(
  ()=>axios.get('/api/students')
)

const students = computed(()=>{
  return data.value?.data.data || []
})

function rowKey(r:Student) {
  return r.id
}

const columns = ref([
  {
    title:'编号',
    dataIndex:'id'
  },
  {
    title:'姓名',
    dataIndex:'name'
  },
  {
    title:'性别',
    dataIndex:'sex'
  },
  {
    title:'年龄',
    dataIndex:'age'
  }
])
</script>
```



#### 分页

```vue
<template>
  <a-table :columns="columns" :data-source="students" row-key="id"
   :pagination="pagination" @change="tableChange"></a-table>
</template>
<script setup lang="ts">
import axios from "../api/request";
import { ref, computed } from "vue";
import { usePagination } from "vue-request";
import { AxiosRespPage, Student, StudentQueryDto } from "../model/Model8080";
import { PaginationProps } from "ant-design-vue";
import DateBody from "ant-design-vue/lib/vc-picker/panels/DatePanel/DateBody";

const dto = ref({page: 1, size: 5})

const {data, total, run} = usePagination<AxiosRespPage<Student>, StudentQueryDto[]>(
  (d)=> axios.get('/api/students/q', {params:d}),
  {
    defaultParams: [dto.value],
    pagination: {
      currentKey: "page",
      pageSizeKey: 'size',
      totalKey: 'data.data.total'
    }
  }
)

// 在页号或页大小改变时调用
function tableChange(pagination: PaginationProps) { 
  console.log(pagination)
  dto.value.page = pagination.current ?? 1
  dto.value.size = pagination.pageSize ?? 5
  run(dto.value)
}

const pagination = computed<PaginationProps>(()=>{
  return {
    current: dto.value.page, // 当前页
    pageSize: dto.value.size, // 页大小
    total: total.value,       // 总记录数
    showSizeChanger: true,    // 显示页大小的下拉列表
    pageSizeOptions: ["1","2","3","4","5"] // 自定义下拉列表内容
  }
})

const students = computed(()=>{
  return data.value?.data.data.list || []
})

const columns = ref([
  {
    title: "编号",
    dataIndex: "id",
  },
  {
    title: "姓名",
    dataIndex: "name",
  },
  {
    title: "性别",
    dataIndex: "sex",
  },
  {
    title: "年龄",
    dataIndex: "age",
  },
]);
</script>
```



#### 搜索、删除

```vue
<template>
  <a-row>
    <a-col :span="2">
      <a-button type="primary" size="small">新增</a-button>
    </a-col>
    <a-col :span="4">
      <a-popconfirm title="确认要删除选中学生吗?"
        ok-text="确定" cancel-text="取消" @confirm="onDeleteIds"
        @visibleChange="onVisibleChange" :visible="visible">
        <a-button type="primary" size="small">删除选中</a-button>
      </a-popconfirm>
    </a-col>
    <a-col :span="4">
    </a-col>
    <a-col :span="4">
      <a-input v-model:value="dto.name" placeholder="输姓名" size="small"></a-input>
    </a-col>
    <a-col :span="4">
      <a-select v-model:value="dto.sex" placeholder="选性别" :allowClear="true" size="small">
        <a-select-option value="男">男</a-select-option>
        <a-select-option value="女">女</a-select-option>
      </a-select>
    </a-col>
    <a-col :span="4">
      <a-select v-model:value="dto.age" placeholder="选年龄" :allowClear="true" size="small">
        <a-select-option value="0,20">20以下</a-select-option>
        <a-select-option value="21,30">21~30</a-select-option>
        <a-select-option value="31,40">31~40</a-select-option>
        <a-select-option value="40,120">40以上</a-select-option>
      </a-select>
    </a-col>
    <a-col :span="2">
      <a-button @click="tableChange" type="primary" size="small">搜索</a-button>
    </a-col>
  </a-row>
  <hr>
  <a-table :columns="columns" :data-source="students" row-key="id"
    :pagination="pagination" @change="tableChange"
    :row-selection="{selectedRowKeys:ids,onChange:onSelectChange}">
    <template #bodyCell="{column, record}">
      <template v-if="column.dataIndex==='name'">
      {{record.name + (record.sex==='男'?'(大侠)':'(女侠)')}}
      </template>

      <template v-else-if="column.dataIndex==='operation'">
      <a>修改</a>
      <a-divider type="vertical"></a-divider>
      <a-popconfirm title="确认要删除该学生吗?"
        ok-text="确定" cancel-text="取消" @confirm="onDelete(record.id)">
        <a>删除</a>   
      </a-popconfirm>         
      </template>
    </template>
  </a-table>
  
</template>
<script setup lang="ts">
import axios from "../api/request";
import { ref, computed } from "vue";
import { usePagination, useRequest } from "vue-request";
import { AxiosRespPage, AxiosRespString, Student, StudentQueryDto } from "../model/Model8080";
import { PaginationProps } from "ant-design-vue";

// >>>>>>>>>>>>>> 搜索功能开始
const dto = ref({page: 1, size: 5, name: '', sex: null, age: null})

const {data, total, run: search} = usePagination<AxiosRespPage<Student>, StudentQueryDto[]>(
  (d) => axios.get('/api/students/q', {params:d}),
  {
    defaultParams: [dto.value],
    pagination: {
      currentKey: "page",
      pageSizeKey: 'size',
      totalKey: 'data.data.total'
    }
  }
)

function tableChange(pagination: PaginationProps) { 
  // console.log(pagination)
  dto.value.page = pagination.current ?? 1
  dto.value.size = pagination.pageSize ?? 5
  search(dto.value)
}

const pagination = computed<PaginationProps>(()=>{
  return {
    current: dto.value.page, // 当前页
    pageSize: dto.value.size, // 页大小
    total: total.value,       // 总记录数
    showSizeChanger: true,    // 显示页大小的下拉列表
    pageSizeOptions: ["1","2","3","4","5"] // 自定义下拉列表内容
  }
})

const students = computed(()=>{
  return data.value?.data.data.list || []
})
// <<<<<<<<<<<<<< 搜索功能结束


// >>>>>>>>>>>>>> 删除功能开始
async function onDelete(id:number) {
  // console.log("学生id是:"+id)
  await deleteById(id)      // 删除请求 删除响应
  search(dto.value)        //                   查询请求 查询响应
}

const { runAsync: deleteById } = useRequest<AxiosRespString, number[]>(
  (id) => axios.delete(`/api/students/${id}`),
  {
    manual: true
  }
)
// <<<<<<<<<<<<<< 删除功能结束

// >>>>>>>>>>>>>> 删除选中开始
const ids = ref<number[]>([])

function onSelectChange(keys:number[]) {
  // console.log(keys)
  ids.value = keys
}

async function onDeleteIds() {
  await deleteByIds(ids.value)
  ids.value = []
  search(dto.value)
}

const { runAsync: deleteByIds } = useRequest<AxiosRespString, number[][]>(
  (ids)=>axios.delete('/api/students', {data: ids}),
  {
    manual: true
  }
)

const visible = ref(false)

function onVisibleChange(v:boolean) {
  if(!v) { // 希望隐藏
    visible.value = false
  } else { // 希望显示
    visible.value = ids.value.length > 0
  }
}
// <<<<<<<<<<<<<< 删除选中结束

const columns = ref([
  {
    title: "编号",
    dataIndex: "id",
  },
  {
    title: "姓名",
    dataIndex: "name",
  },
  {
    title: "性别",
    dataIndex: "sex",
  },
  {
    title: "年龄",
    dataIndex: "age",
  },
  {
    title: '操作',
    dataIndex: 'operation'
  }
]);
</script>
<style scoped>
  .ant-input, .ant-select {
    width: 80px;
  }
</style>
```



#### 新增、修改

子组件

```vue
<template>
  <a-modal :visible="visible" :title="title" 
    @ok="onOk" @cancel="onCancel">
    <a-form>
      <a-form-item label="编号" v-if="id">
        <a-input readonly v-model:value="id"></a-input>
      </a-form-item>
      <a-form-item label="姓名">
        <a-input v-model:value="dto.name"></a-input>
      </a-form-item>
      <a-form-item label="性别">
        <a-radio-group v-model:value="dto.sex">
          <a-radio-button value="男">男</a-radio-button>
          <a-radio-button value="女">女</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="年龄">
        <a-input-number v-model:value="dto.age"></a-input-number>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import axios from "../api/request";
import { ref, computed } from "vue";
import { useRequest } from "vue-request";
import { StudentSaveDto, AxiosRespString } from "../model/Model8080";
import { Form } from 'ant-design-vue'

// 定义属性
const props = defineProps<{id:number, dto:StudentSaveDto, visible:boolean}>()

const title = computed(()=> props.id===0?'新增学生':'修改学生')

// 定义事件
const emit = defineEmits(['update:visible', 'saved'])

async function onOk() {
  if(props.id === 0) {
    await insert(props.dto)
  } else {
    await update(props.dto)
  }
  emit('saved')
  // 发送事件给父组件, 希望把 visible 改为 false
  emit('update:visible', false) 
}

function onCancel() {
  // 发送事件给父组件, 希望把 visible 改为 false
  emit('update:visible', false)
}

const {runAsync:insert} = useRequest<AxiosRespString,StudentSaveDto[]>(
  (dto)=>axios.post('/api/students', dto),
  {
    manual: true
  }
)

const {runAsync:update} = useRequest<AxiosRespString,StudentSaveDto[]>(
  (dto)=>axios.put(`/api/students/${props.id}`, dto),
  {
    manual: true
  }
)
</script>
```

父组件使用子组件

```vue
<A4Save :id="id" :dto="saveDto" v-model:visible="saveVisible"></A4Save>

<script setup lang="ts">
// ...
// >>>>>>>>>>>>>> 新增、修改开始
const saveVisible = ref(false)
const id = ref(0)
const saveDto = reactive({name:'', sex:'男', age:18})

function onInsert() {
  saveVisible.value = true
  id.value = 0
  Object.assign(saveDto, {name:'', sex:'男', age:18})
}

function onUpdate(record: Student) {
  saveVisible.value = true
  id.value = record.id
  Object.assign(saveDto, record)
}

function onSaved() {
  search(dto.value)
}    
// <<<<<<<<<<<<<< 新增、修改结束
</script>
```

* saveDto 使用 reactive 包装，是为了解决后续表单校验失效问题

* Object.assign 是将源对象（参数2）的属性值赋值给目标对象（参数1）的同名属性，效果等价于

  ```js
  saveDto.name = record.name
  saveDto.sex = record.sex
  saveDto.age = record.age
  ```



#### 全局消息

在 request.ts 中对响应消息统一处理

```typescript
import { message } from 'ant-design-vue'

// ...
// 响应拦截器
_axios.interceptors.response.use(
  (response)=>{ // 状态码  2xx
    if(response.data.message) {
      message.success(response.data.message, 3)
    }    
    // ... 
  },
  (error)=>{ // 状态码 > 2xx, 400,401,403,404,500
    // ...
  }
)
```



#### 表单校验

```vue
<template>
  <a-modal :visible="visible" :title="title" 
    @ok="onOk" @cancel="onCancel">
    <a-form>
      <a-form-item label="编号" v-if="id">
        <a-input readonly v-model:value="id"></a-input>
      </a-form-item>
      <a-form-item label="姓名" v-bind="validateInfos.name">
        <a-input v-model:value="dto.name"></a-input>
      </a-form-item>
      <a-form-item label="性别" v-bind="validateInfos.sex">
        <a-radio-group v-model:value="dto.sex">
          <a-radio-button value="男">男</a-radio-button>
          <a-radio-button value="女">女</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="年龄" v-bind="validateInfos.age">
        <a-input-number v-model:value="dto.age"></a-input-number>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import axios from "../api/request";
import { ref, computed } from "vue";
import { useRequest } from "vue-request";
import { StudentSaveDto, AxiosRespString } from "../model/Model8080";
import { Form } from 'ant-design-vue'

// 定义属性
const props = defineProps<{id:number, dto:StudentSaveDto, visible:boolean}>()

const title = computed(()=> props.id===0?'新增学生':'修改学生')

// 定义事件
const emit = defineEmits(['update:visible', 'saved'])

async function onOk() {
  try {
    // 提交前校验
    await validate()
    if(props.id === 0) {
      await insert(props.dto)
    } else {
      await update(props.dto)
    }
    emit('saved')
    // 发送事件给父组件, 希望把 visible 改为 false
    emit('update:visible', false) 
  } catch (e) {
    console.error(e)
  }
}

function onCancel() {
  // 发送事件给父组件, 希望把 visible 改为 false
  emit('update:visible', false)
}

const {runAsync:insert} = useRequest<AxiosRespString,StudentSaveDto[]>(
  (dto)=>axios.post('/api/students', dto),
  {
    manual: true
  }
)

const {runAsync:update} = useRequest<AxiosRespString,StudentSaveDto[]>(
  (dto)=>axios.put(`/api/students/${props.id}`, dto),
  {
    manual: true
  }
)

const rules = ref({
  name: [
    {required: true, message:'姓名必须'},
    {min:2, message:'字符数至少为2'}
  ],
  sex: [
    {required: true, message:'性别必须'}
  ],
  age: [
    {required: true, message:'年龄必须'},
    {min:10, message:'年龄最小为10岁', type:'number'},
    {max:120, message:'年龄最大为120岁', type:'number'}
  ]
})

// 参数1: 待校验的数据
// 参数2: 校验规则
const { validateInfos, validate } = Form.useForm(props.dto, rules)
</script>
```



### 4) jsx 组件

首先，安装  

```cmd
@vitejs/plugin-vue-jsx
```

配置 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()]
})
```

编写一个 Hello.tsx 组件

```tsx
import { defineComponent, ref } from 'vue';
export default defineComponent(() => {
  const msg = ref("你好!");
  return () => <h2>{msg.value}</h2>;
});
```

然后被其它组件使用

```vue
<script setup lang="ts">
import Hello from './views/Hello'
</script>

<template>
  <Hello></Hello>
</template>
```



jsx 能做到 template 不容易做到的功能
