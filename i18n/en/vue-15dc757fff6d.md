# VUE Basics :id=h-9ac703183a88

Systematically learn Vue 2 binding, reactivity, components, routing, and state management.

**Prerequisites and versions:** Basic HTML, JavaScript, and asynchronous request knowledge is required. This follows Vue 2 / Vue Router 3 / Vuex 3. Vue 2 has reached end of official support; this is mainly for understanding and maintaining older projects.

**Using the examples:** Unless a project explicitly lists all files and run instructions, code blocks are independent snippets for each section. Fill in ellipses and placeholder names; lines marked as incorrect illustrate problems. Do not combine alternative implementations from the same section.

[Documentation index](README.md) · [Official references](https://v2.vuejs.org/v2/guide/)

**Contents**

- [1. Vue fundamentals and principles](#section-1)
- [1.1 Introduction to Vue](#section-2)
- [1.2 Template syntax](#section-3)
- [1.3 Data binding](#section-4)
- [1.4 Two forms of el and data](#section-5)
- [1.5 MVVM in Vue](#section-6)
- [1.6 Data proxies](#section-7)
- [1.7 Event handling](#section-8)
- [1.8 Keyboard events](#section-9)
- [1.9 Computed properties](#section-10)
- [1.10 Watchers](#section-11)
- [1.11 Style binding](#section-12)
- [1.12 Conditional rendering](#section-13)
- [1.13 List rendering](#section-14)
- [1.14 How Vue observes data](#section-15)
- [1.15 Collecting form data](#section-16)
- [1.16 Filters (lower priority)](#section-17)
- [1.17 Built-in directives](#section-18)
- [1.18 Custom directives](#section-19)
- [1.19 Lifecycle](#section-20)
- [1.20 Non-single-file components](#section-21)
- [1.21 Single-file components](#section-22)
- [2. Vue scaffolding, custom events, slots, and advanced topics](#section-23)
- [2.1 Scaffolding](#section-24)
- [2.2 Miscellaneous Vue concepts](#section-25)
- [2.3 Browser local storage](#section-26)
- [2.4 Component custom events](#section-27)
- [2.5 Global event bus](#section-28)
- [2.6 Publish/subscribe messaging](#section-29)
- [2.7 nextTick](#section-30)
- [2.8 Vue transitions and animations](#section-31)
- [2.9 Configure a Vue CLI proxy](#section-32)
- [2.10 Slots](#section-33)
- [3. VUEX](#section-34)
- [3.1 Concepts](#section-35)
- [3.2 When to use it](#section-36)
- [3.3 Set up Vuex](#section-37)
- [3.4 Basic usage](#section-38)
- [3.5 Using getters](#section-39)
- [3.6 Using the four map helpers](#section-40)
- [3.7 Modules and namespaces](#section-41)
- [4. Routing](#section-42)
- [4.1 Basic usage](#section-43)
- [4.2 Points to note](#section-44)
- [4.3 Nested routes (multiple levels)](#section-45)
- [4.4 Route query parameters](#section-46)
- [4.5 Named routes](#section-47)
- [4.6 Route params parameters](#section-48)
- [4.7 Route props configuration](#section-49)
- [4.8 The replace prop of `<router-link>`](#section-50)
- [4.9 Programmatic navigation](#section-51)
- [4.10 Caching route components](#section-52)
- [4.11 Two new lifecycle hooks](#section-53)
- [4.12 Navigation guards](#section-54)
- [4.13 Two router modes](#section-55)

﻿# Vue basic usage and underlying principles

<a id="section-1"></a>

# 1. Vue fundamentals and principles :id=h-e11991c4bd73

<a id="section-2"></a>

## 1.1 Introduction to Vue :id=h-1c84f367c6c6

- To use Vue, create a Vue instance and pass a configuration object.
- The demo container still follows HTML syntax, with some special Vue syntax mixed in.
- The code in the demo container is called a Vue template.
- Vue instances and containers correspond one to one.
- In real applications, one Vue instance is used together with components.
- {{xxx}} is Vue interpolation syntax and can read every data property.
- When data changes, the parts of the page using it update automatically (Vue reactivity).

> Initial example code

```html
<!-- See note 1 below. -->
<div id="demo">
    <h1>Hello，{{name.toUpperCase()}}，{{address}}</h1>
</div>

<script type="text/javascript" >
    Vue.config.productionTip = false // See note 2 below.

    // See note 3 below.
    new Vue({
        el:'#demo', // See note 4 below.
        data:{ // See note 5 below.
            name:'hello,world',
            address:'北京'
        }
    });
</script>
```

Example explanations:

1. Prepare a container
2. Disable Vue's production tip at startup.
3. Create a Vue instance
4. el specifies the container served by this Vue instance, usually as a CSS selector string.
5. data stores the data used by the el container. For now, define it as an object.

<a id="section-3"></a>

## 1.2 Template syntax :id=h-e96fd73b52d5

Vue template syntax has two main categories:

- Interpolation syntax:

  Purpose: process element text content

  Syntax: {{xxx}}, where xxx is a JavaScript expression that can directly read all data properties.

- Directive syntax:

  Purpose: process elements, including attributes, contents, and event bindings.

  Example: v-bind:href="xxx", abbreviated :href="xxx". xxx is also a JavaScript expression and can directly read all data properties.

> Code

```html
<div id="root">
    <h1>插值语法</h1>
    <h3>你好，{{name}}</h3>
    <hr/>
    <h1>指令语法</h1>
    <!-- See note 1 below. -->
    <a :href="school.url.toUpperCase()" x="hello">点我去{{school.name}}学习1</a>
    <a :href="school.url" x="hello">点我去{{school.name}}学习2</a>
</div>

<script>
    new Vue({
        el:'#root',
        data:{
            name:'jack',
            school:{
                name:'百度',
                url:'http://www.baidu.com',
            }
        }
    })
</script>
```

Example explanations:

1. This shows an attribute bound by a Vue directive; the quoted content is a JavaScript expression.

<a id="section-4"></a>

## 1.3 Data binding :id=h-0543ffa8f7aa

Vue has two data-binding modes:

- One-way binding (v-bind): data flows only from data to the page.

- Two-way binding (v-model): data flows both from data to the page and back.

  > tips:
  >
  > 1\. Two-way binding generally applies to form elements, such as input and select.
  >
  > 2\. Native Vue 2 forms use v-model, not the Vue 3 component syntax v-model:argument. Text input uses value/input; checkboxes use checked/change.

> Code

```html
<div id="root">
    <!-- See note 1 below. -->
    单向数据绑定：<input type="text" v-bind:value="name"><br/>
    双向数据绑定：<input type="text" v-model="name"><br/>

    <!-- See note 2 below. -->
    单向数据绑定：<input type="text" :value="name"><br/>
    双向数据绑定：<input type="text" v-model="name"><br/>
</div>

<script>
    new Vue({
        el:'#root',
        data:{
            name:'jack',
        }
    })
</script>
```

Example explanations:

1. Full syntax: one-way data binding
2. Shorthand: native Vue 2 forms use v-model, not Vue 3 component v-model:argument syntax. Text input uses value/input; checkboxes use checked/change.

<a id="section-5"></a>

## 1.4 Two forms of el and data :id=h-f5b34506063c

Two ways to specify el

- Set el when constructing a new Vue.

- Create the Vue instance first, then specify el with vm.$mount('#root').

> Code

```html
<script>
       // See note 1 below.
    const vm = new Vue({
        el:'#root',
        data:{
            name:'jack',
        }
    })

    // See note 2 below.
    vm.$mount('#root')
</script>
```

Example explanations:

1. First form
2. Second form

Two ways to define data

- Object form

- Function form

  > In components, data must use the function form.

> Code

```html
<script>
    new Vue({
        el:'#root',
        // See note 1 below.
        // data: { name: 'jack' },
        // See note 2 below.
        data() {
            return {
                name: 'jack'
            }
        }
    })
</script>
```

Example explanations:

1. First form
2. Second form

<a id="section-6"></a>

## 1.5 MVVM in Vue :id=h-a3554dd373e5

- M: Model—the data in data
- V: View—the template code
- VM: ViewModel—the Vue instance

<a id="section-7"></a>

## 1.6 Data proxies :id=h-a990fe752554

> Understanding data proxies requires JavaScript knowledge: Object.defineProperty(), property flags, descriptors, getters, setters, and so on.

Suggested learning articles:

[https://zh.javascript.info/property-descriptors](https://zh.javascript.info/property-descriptors)

[https://zh.javascript.info/property-accessors](https://zh.javascript.info/property-accessors)

A brief introduction:

**Property flags**:

Besides **`value`**, object properties have three special attributes, called flags.

- **`writable`**: if `true`, the value can be changed; otherwise it is readonly.
- **`enumerable`**: if `true`, the property is enumerable in for...in and Object.keys().
- **`configurable`**: if `true`, the property can be deleted and its attributes changed; otherwise they cannot.

**Object.getOwnPropertyDescriptor(obj, propertyName)**

> This method gets complete property information. obj is the object and propertyName the property name.

```js
let user = {
  name: "John"
};

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');


console.log(descriptor)

/* See note 1 below. */
```

Example explanations:

1. Property descriptor:; {; "value": "John",; "writable": true,; "enumerable": true,; "configurable": true; }

> Printed result

![Example illustration](Resources/vue2/09b4bf67bb7843388fecd7da1572901f.png)

**Object.defineProperty**(obj, prop, descriptor)

> obj: the object on which to define the property.
>
> prop: the name of the property to define or modify
>
> descriptor: the property descriptor to define or modify

```js
let user = {
  name: "John"
};

Object.defineProperty(user, "name", {
  writable: false
});

user.name = "Pete";

// See note 1 below.
```

Example explanations:

1. It still prints 'John'; name cannot be changed.

We will skip demonstrations of the other flags and move to the main topic: accessor properties.

**Accessor properties:**

They are functions for getting and setting values, but look like ordinary properties to external code.

Accessor properties use getter and setter methods, written `get` and `set` in object literals:

```js
let obj = {
    get name() {
        // See note 1 below.
    },
    set name(value) {
        // See note 2 below.
    }
}
```

Example explanations:

1. The getter runs when obj.propName is read.
2. The setter runs on obj.name = value.

**A more complex use**

```js
let user = {
    surname: 'gao',
    name: 'han',

    get fullName() {
        return this.name + this.surname;
    }
}

console.log(user.fullName)
```

Accessor properties intentionally look like ordinary properties. We do not **call** `user.fullName` as a function; we **read** it normally, with the getter running behind the scenes.

> I suspect Vue's computed properties use this idea internally, though I have not read the source yet.

So far, `fullName` has only a getter. Attempting `user.fullName=` causes an error:

```js
user.fullName = "Test"; // See note 1 below.
```

Example explanations:

1. Error: the property has only a getter

Fix it by adding a setter to `user.fullName`:

```js
let user = {
    surname: 'gao',
    name: 'han',

    get fullName() {
        return this.name + ' ' + this.surname;
    },

    set fullName(value) {
        // See note 1 below.
        [this.name, this.surname] = value.split(' ');
    }
}

user.fullName = 'Li Hua'

console.log(user.name);
console.log(user.surname);
```

Example explanations:

1. This uses the newer destructuring assignment syntax.

**Now we can introduce data proxies**:

A data proxy uses one object to proxy operations (reads/writes) on another object's properties.

Start with an example:

```js
let obj = {
    x: 100
}

let obj2 = {
    y: 200
}
```

Suppose we want the value of **x** in **obj**, but prefer accessing it through the proxy **obj2** rather than accessing **obj** directly.

Use **Object.defineProperty()** to add accessor properties (getters and setters) to **obj2**.

> Code

```js
let obj = {
    x: 100
}

let obj2 = {
    y: 200
}

Object.defineProperty(obj2, 'x', {
    get() {
        return obj.x;
    },
    set(value) {
        obj.x = value;
    }
})
```

> That is a data proxy—fairly straightforward.

**Data proxies in Vue**

- In Vue, vm proxies reads and writes of data object properties.
- The benefit of Vue data proxies is easier access to data.
- Basic mechanism:
  - Object.defineProperty() adds all data object properties to vm.
  - Each property added to vm receives a getter/setter.
  - The getter/setter reads/writes the corresponding data property.

Let us explain the process with an example.

```html
<!-- See note 1 below. -->
<div id="root">
    <h2>学校名称：{{name}}</h2>
    <h2>学校地址：{{address}}</h2>
</div>

<script>
    const vm = new Vue({
        el: '#root',
        data: {
            name: '浙江师范大学',
            address: '浙江金华'
        }
    })
</script>
```

Example explanations:

1. Prepare a container

Print the newly created vm in the console.

![Example illustration](Resources/vue2/ea14682958924e37bf950f3960ee998e.png)

The configured data is bound to vm. To state the result first: Vue proxies name and address from \_data onto vm itself.

> Still confused?

First, \_data is the property on vm shown below.

![Example illustration](Resources/vue2/bc4efbf50f414b1a9c1db2ff3581d228.png)

Where does \_data come from?

```html
<script>

    const vm = new Vue({
        el: '#root',
        // See note 1 below.
        data: {
            name: '浙江师范大学',
            address: '浙江金华'
        }
    })
</script>
```

Example explanations:

1. We defined data in the Vue initialization options.

During new Vue, Vue processes the configured data, binds it to \_data, and instruments it for reactivity. This property originates in the options' data; let us verify that.

```html
<script>

    let data1 = {
        name: '浙江师范大学',
        address: '浙江金华'
    }

    const vm = new Vue({
        el: '#root',
        // See note 1 below.
        data: data1
    })
</script>
```

Example explanations:

1. We defined data in the Vue initialization options.

![Example illustration](Resources/vue2/e0051173ac224b408d037fda33de6410.png)

> It prints true, showing they are the same object.

Back to proxies: values in **vm.\_data** are proxied onto vm itself, letting vm.name replace **vm.\_data.name**. This is Vue data proxying.

![Example illustration](Resources/vue2/66b4020fbc5143aa8ddf3f6fd86af0ea.png)

All this uses Object.defineProperty(). Let us simulate the process.

```js
Object.defineProperty(vm, 'name', {
    get() {
        return vm._data.name;
    },
    set(value) {
        vm._data.name = value
    }
})
```

> Why do this when vm.\_data.name already accesses name?

In interpolation, {{ name }} corresponds to {{ vm.name }}. Without the proxy, interpolation would need the longer form below.

{{ \_data.name }} looks unnatural. Vue's design is more convenient for developers, though studying the internals can seem complicated!

Here is a diagram by Zhang Tianyu of Shangguigu (I highly recommend his clear lessons).

![Example illustration](Resources/vue2/8ccad88c5e40497587dadb3db07e1821.png)

<a id="section-8"></a>

## 1.7 Event handling :id=h-1cebd44af052

Basic event usage:

- Bind events with v-on:xxx or @xxx, where xxx is the event name.
- Configure callbacks in methods; they ultimately appear on vm.
- Functions in methods are managed by Vue; this refers to vm or the component instance.

```html
<!-- See note 1 below. -->
<div id="root">
    <h2>欢迎来到{{name}}学习</h2>
    <!-- See note 2 below. -->
    <button @click="showInfo1">点我提示信息1（不传参）</button>
    <!-- See note 3 below. -->
    <button @click="showInfo2($event,66)">点我提示信息2（传参）</button>
</div>

<script>
    const vm = new Vue({
        el:'#root',
        data:{
            name:'vue',
        },
        methods:{
            // See note 4 below.
            showInfo1(event){
                // console.log(event.target.innerText)
                // See note 5 below.
                alert('同学你好！')
            },
            showInfo2(event,number){
                console.log(event,number)
                // console.log(event.target.innerText)
                // See note 6 below.
                alert('同学你好！！')
            }
        }
    });
</script>
```

Example explanations:

1. Prepare a container
2. \<button v-on:click="showInfo">Click for information\</button>
3. Pass the event explicitly
4. If event is omitted from the Vue template, it is automatically passed to the function.
5. console.log(this) // this is vm here
6. console.log(this) // this is vm here

**Event modifiers in Vue**

- prevent: prevent the default action (common)
- stop: stop event bubbling (common)
- once: trigger only once (common)

```html
<!-- See note 1 below. -->
<div id="root">
    <h2>欢迎来到{{name}}学习</h2>
    <!-- See note 2 below. -->
    <a href="http://www.baidu.com" @click.prevent="showInfo">点我提示信息</a>
    <!-- See note 3 below. -->
    <div class="demo1" @click="showInfo">
        <button @click.stop="showInfo">点我提示信息</button>
        <!-- See note 4 below. -->
        <!-- See note 5 below. -->
    </div>
    <!-- See note 6 below. -->
    <button @click.once="showInfo">点我提示信息</button>
</div>

```

Example explanations:

1. Prepare a container
2. Prevent the default action (common)
3. Stop event bubbling (common)
4. Modifiers can be chained.
5. \<a href="[http://www.atguigu.com](http://www.atguigu.com)" @click.prevent.stop="showInfo">Click for information\</a>
6. Trigger only once (common)

<a id="section-9"></a>

## 1.8 Keyboard events :id=h-615e4918a5b0

Keyboard-event shorthand: @keydown, @keyup

Common Vue key aliases:

- Enter => enter
- Delete => delete
- Escape => esc
- Space => space
- Tab => tab (special: must use keydown)

```html
<!-- See note 1 below. -->
<div id="root">
    <h2>欢迎来到{{name}}学习</h2>
    <input type="text" placeholder="按下回车提示输入" @keydown.enter="showInfo">
</div>

<script>
    new Vue({
        el:'#root',
        data:{
            name:'浙江理工大学'
        },
        methods: {
            showInfo(e){
                // console.log(e.key,e.keyCode)
                console.log(e.target.value)
            }
        },
    })
</script>
```

Example explanations:

1. Prepare a container

<a id="section-10"></a>

## 1.9 Computed properties :id=h-829c65b71d65

- Definition: derive a needed property from existing properties.
- Mechanism: uses the getters and setters provided by Objcet.defineProperty.
- When does get run?
  - (1) Once on the first read.
  - (2) Again when dependent data changes.
- Advantages over methods: internal caching enables reuse, improving efficiency and simplifying debugging.
- Notes:
  - Computed properties appear on vm and can be read directly.
  - To modify a computed property, provide a setter that updates its underlying dependencies.

> Full computed-property syntax

```html
<!-- See note 1 below. -->
<div id="root">
    姓：<input type="text" v-model="firstName">
    名：<input type="text" v-model="lastName">
    全名：<span>{{fullName}}</span>
</div>

<script>
    const vm = new Vue({
        el:'#root',
        data:{
            firstName:'张',
            lastName:'三',
        },
        computed:{
            fullName:{
                // See note 2 below.
                // See note 3 below.
                get(){
                    console.log('get被调用了')
                    return this.firstName + '-' + this.lastName
                },
                // See note 4 below.
                // See note 5 below.
                set(value){
                    console.log('set',value)
                    const arr = value.split('-')
                    this.firstName = arr[0]
                    this.lastName = arr[1]
                }
            }
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. What does get do? Reading fullName invokes get, whose return value becomes fullName.
3. When is get called? 1. On the first read of fullName. 2. When its dependencies change.
4. When is set called? When fullName is modified.
5. Modify fullName in the console to observe this.

![Example illustration](Resources/vue2/0acfc64ee54d44418ff0a2750a6c4ffd.png)

> Computed-property shorthand

```html
<!-- See note 1 below. -->
<div id="root">
    姓：<input type="text" v-model="firstName">
    名：<input type="text" v-model="lastName">
    全名：<span>{{fullName}}</span>
</div>

<script>
    const vm = new Vue({
        el:'#root',
        data:{
            firstName:'张',
            lastName:'三',
        },
        computed:{
            fullName() {
                console.log('get被调用了')
                return this.firstName + '-' + this.lastName
            }
        }
    })
</script>
```

Example explanations:

1. Prepare a container

<a id="section-11"></a>

## 1.10 Watchers :id=h-1cbcc016405c

The watch option:

- When the watched property changes, its callback runs automatically to perform the relevant operations.
- The property must exist before it can be watched.
- Two ways to register a watcher:
  - (1) Pass watch options when constructing a new Vue.
  - (2) Use vm.$watch.

> First form

```html
<!-- See note 1 below. -->
<div id="root">
    <h2>今天天气很{{ info }}</h2>
    <button @click="changeWeather">切换天气</button>
</div>


<script>
    const vm = new Vue({
        el:'#root',
        data:{
            isHot:true,
        },
        computed:{
            info(){
                return this.isHot ? '炎热' : '凉爽'
            }
        },
        methods: {
            changeWeather(){
                this.isHot = !this.isHot
            }
        },
        watch:{
            isHot:{
                immediate: true, // See note 2 below.
                // See note 3 below.
                handler(newValue, oldValue){
                    console.log('isHot被修改了',newValue,oldValue)
                }
            }
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Invoke handler once during initialization
3. When is handler called? When isHot changes.

> Second form

```html
<!-- See note 1 below. -->
<div id="root">
    <h2>今天天气很{{ info }}</h2>
    <button @click="changeWeather">切换天气</button>
</div>


<script>
    const vm = new Vue({
        el:'#root',
        data:{
            isHot:true,
        },
        computed:{
            info(){
                return this.isHot ? '炎热' : '凉爽'
            }
        },
        methods: {
            changeWeather(){
                this.isHot = !this.isHot
            }
        }
    })

    vm.$watch('isHot',{
        immediate:true, // See note 2 below.
        // See note 3 below.
        handler(newValue,oldValue){
            console.log('isHot被修改了',newValue,oldValue)
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Invoke handler once during initialization
3. When is handler called? When isHot changes.

**Deep watching:**

- (1) Vue watch does not watch nested object changes by default; it watches one level.
- (2) deep:true watches internal changes across multiple levels.

> Notes:
>
> (1) Vue itself detects nested object changes, but the watch option provided by Vue does not by default.
>
> (2) Choose deep watching according to the data's actual structure.

```html
<!-- See note 1 below. -->
<div id="root">
    {{numbers.c.d.e}}
</div>

<script type="text/javascript">
    Vue.config.productionTip = false // See note 2 below.
    const vm = new Vue({
        el:'#root',
        data:{
            numbers:{
                c:{
                    d:{
                        e:100
                    }
                }
            }
        },
        watch:{
            // See note 3 below.
            /* See note 4 below. */
            // See note 5 below.
            numbers:{
                deep:true,
                handler(){
                    console.log('numbers改变了')
                }
            }
        }
    });
</script>
```

Example explanations:

1. Prepare a container
2. Disable Vue's production tip at startup.
3. Watch one property in a nested structure
4. 'numbers.a': {; handler() {; console.log('a changed'); } }
5. Watch all properties in a nested structure

![Example illustration](Resources/vue2/b5a0d88990404a5e90bea2788788ec39.png)

> Watcher shorthand

```html
<!-- See note 1 below. -->
<div id="root">
    <h2>今天天气很{{info}}</h2>
    <button @click="changeWeather">切换天气</button>
</div>

<script>
    const vm = new Vue({
        el:'#root',
        data:{
            isHot:true,
        },
        computed:{
            info(){
                return this.isHot ? '炎热' : '凉爽'
            }
        },
        methods: {
            changeWeather(){
                this.isHot = !this.isHot
            }
        },
        watch:{
            // See note 2 below.
            isHot(newValue, oldValue) {
                    console.log('isHot被修改了', newValue, oldValue, this)
            }
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Shorthand

**Differences between computed and watch:**

- watch can implement everything computed can.
- computed cannot necessarily do everything watch can; for example, watch supports asynchronous operations.

> Two important guidelines:
>
> 1\. Prefer ordinary functions for functions managed by Vue, so this refers to vm or the component instance.
>
> 2\. Arrow functions preserve a component method's this in timers, requests, and Promise callbacks created inside it. They inherit this from their definition context rather than automatically becoming component-bound. Do not make entry points such as data and methods arrows when Vue needs to bind this.

```html
<!-- See note 1 below. -->
<div id="root">
    姓：<input type="text" v-model="firstName"> <br/><br/>
    名：<input type="text" v-model="lastName"> <br/><br/>
    全名：<span>{{fullName}}</span> <br/><br/>
</div>

<script>
    const vm = new Vue({
        el:'#root',
        data:{
            firstName:'张',
            lastName:'三',
            fullName:'张-三'
        },
        watch:{
            // See note 2 below.
            firstName(val){
                setTimeout(()=>{
                    console.log(this)
                    this.fullName = val + '-' + this.lastName
                },1000);
            },
            lastName(val){
                this.fullName = this.firstName + '-' + val
            }
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. A watch handler can contain asynchronous functions.

<a id="section-12"></a>

## 1.11 Style binding :id=h-0530418fc493

### **Class styles** :id=h-f5504096352f

Syntax: :class="xxx", where xxx is a string, object, or array.

Thus there are string, array, and object forms.

**String form**

Use the string form when the class name is unknown and must be obtained dynamically.

```html
<style>
    .normal{
        background-color: skyblue;
    }
</style>

<!-- See note 1 below. -->
<div id="root">
    <!-- See note 2 below. -->
    <div class="basic" :class="mood" @click="changeMood">{{name}}</div>
</div>

<script>
    const vm = new Vue({
        el:'#root',
        data:{
            mood:'normal'
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Class binding with a string: for an unknown class name specified dynamically

**Array form**

Use the array form for multiple styles with unknown count and names.

```html
<style>
    .atguigu1{
        background-color: yellowgreen;
    }
    .atguigu2{
        font-size: 30px;
        text-shadow:2px 2px 10px red;
    }
    .atguigu3{
        border-radius: 20px;
    }
</style>

<!-- See note 1 below. -->
<div id="root">
    <!-- See note 2 below. -->
    <div class="basic" :class="classArr">{{name}}</div>
</div>

<script>
    const vm = new Vue({
        el:'#root',
        data:{
            classArr: ['atguigu1','atguigu2','atguigu3']
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Class binding with an array: for an unknown number of styles with unknown names

**Object form**

Use the object form for known style names and count, with uncertain applicability.

```html
<style>
    .atguigu1{
        background-color: yellowgreen;
    }
    .atguigu2{
        font-size: 30px;
        text-shadow:2px 2px 10px red;
    }
</style>

<!-- See note 1 below. -->
<div id="root">
    <!-- See note 2 below. -->
    <div class="basic" :class="classObj">{{name}}</div>
</div>

<script>
    const vm = new Vue({
        el:'#root',
        data:{
            classObj:{
                atguigu1:false,
                atguigu2:false,
            }
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Class binding with an object: known style names and count, with dynamically determined use

### **Inline styles** :id=h-5565c1a19ede

Two forms: object and array

**Object form**

```html
<!-- See note 1 below. -->
<div id="root">
    <!-- See note 2 below. -->
    <div class="basic" :style="styleObj">{{name}}</div>
</div>

<script>
    const vm = new Vue({
        el:'#root',
        data:{
            styleObj:{
                fontSize: '40px',
                color:'red',
            }
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Style binding: object form

**Array form**

```html
<!-- See note 1 below. -->
<div id="root">
    <!-- See note 2 below. -->
    <div class="basic" :style="styleArr">{{name}}</div>
</div>

<script>
    const vm = new Vue({
        el:'#root',
        data:{
            styleArr:[
                {
                    fontSize: '40px',
                    color:'blue',
                },
                {
                    backgroundColor:'gray'
                }
            ]
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Style binding: array form

<a id="section-13"></a>

## 1.12 Conditional rendering :id=h-e27fbc2e3e34

### v-if :id=h-fa7d81ae92c1

- Syntax:

  (1) v-if="expression"

  (2) v-else-if="expression"

  (3).v-else

- Suitable for infrequent switching

- Hidden DOM elements are removed entirely.

- v-if works with v-else-if and v-else, but their sequence must not be interrupted.

```html
<!-- See note 1 below. -->
<div id="root">
    <!-- See note 2 below. -->
    <h2 v-if="false">欢迎来到{{name}}</h2>
    <h2 v-if="1 === 1">欢迎来到{{name}}</h2>


    <!-- See note 3 below. -->
    <div v-if="n === 1">Angular</div>
    <div v-else-if="n === 2">React</div>
    <div v-else-if="n === 3">Vue</div>
    <div v-else>哈哈</div>


    <!-- See note 4 below. -->
    <!-- See note 5 below. -->
    <!-- See note 6 below. -->
    <template v-if="n === 1">
        <h2>你好</h2>
        <h2>尚硅谷</h2>
        <h2>北京</h2>
    </template>
</div>

<script>
    const vm = new Vue({
        el:'#root',
        data:{
            styleArr:[
                {
                    fontSize: '40px',
                    color:'blue',
                },
                {
                    backgroundColor:'gray'
                }
            ]
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Conditional rendering with v-if
3. v-else and v-else-if
4. Using v-if with template
5. Only one condition is needed instead of several.
6. The idea resembles event delegation.

### **v-show** :id=h-25c217cabf44

- Syntax: v-show="expression"
- Suitable for frequent switching
- Hidden DOM elements remain, hidden only with display:none.

> With v-if, an element may be unavailable; with v-show, it remains accessible.
>
> v-if changes actual DOM elements; v-show hides or shows them.

```html
<!-- See note 1 below. -->
<div id="root">
    <!-- See note 2 below. -->
    <h2 v-show="false">欢迎来到{{name}}</h2>
    <h2 v-show="1 === 1">欢迎来到{{name}}</h2>
</div>
```

Example explanations:

1. Prepare a container
2. Conditional rendering with v-show

<a id="section-14"></a>

## 1.13 List rendering :id=h-2d652a494f1a

### v-for directive :id=h-4379a31173aa

- Displays list data
- Syntax: v-for="(item, index) in xxx" :key="yyy"
- Iterates arrays, objects, strings (rare), or a specified number of times (rare).

```html
<div id="root">
    <!-- See note 1 below. -->
    <h2>人员列表（遍历数组）</h2>
    <ul>
        <li v-for="(p,index) of persons" :key="index">
            {{p.name}}-{{p.age}}
        </li>
    </ul>

    <!-- See note 2 below. -->
    <h2>汽车信息（遍历对象）</h2>
    <ul>
        <li v-for="(value,k) of car" :key="k">
            {{k}}-{{value}}
        </li>
    </ul>

    <!-- See note 3 below. -->
    <h2>测试遍历字符串（用得少）</h2>
    <ul>
        <li v-for="(char,index) of str" :key="index">
            {{char}}-{{index}}
        </li>
    </ul>

    <!-- See note 4 below. -->
    <h2>测试遍历指定次数（用得少）</h2>
    <ul>
        <li v-for="(number,index) of 5" :key="index">
            {{index}}-{{number}}
        </li>
    </ul>
</div>

<script>
    const vm = new Vue({
        el:'#root',
        data: {
            persons: [
                { id: '001', name: '张三', age: 18 },
                { id: '002', name: '李四', age: 19 },
                { id: '003', name: '王五', age: 20 }
            ],
            car: {
                name: '奥迪A8',
                price: '70万',
                color: '黑色'
            },
            str: 'hello'
        }
    })
</script>
```

Example explanations:

1. Iterate an array
2. Iterate an object
3. Iterate a string
4. Repeat a specified number of times

### **How key works** :id=h-e66d64abc180

What does key do in Vue? (Its internal mechanism)

Understanding key requires some background knowledge.

Vue generates a virtual DOM from data. On initial rendering, it converts this to real DOM elements displayed on the page.

Why use a virtual DOM? Each change to vm.\_data generates a new virtual DOM, which is compared to the old one. Matching parts need not be regenerated as real DOM; only differences are converted and combined with the existing real DOM. My understanding is that virtual DOM enables DOM reuse and avoids redundant operations. Details follow.

What does key do?

key identifies a virtual DOM node.

First, some background: what is real DOM? How do real DOM and virtual DOM differ? How can code represent real DOM and virtual DOM?

#### Real `DOM` and its parsing process :id=h-e622237fcab3

Reference from user Superhero: [https://juejin.cn/post/6844903895467032589](https://juejin.cn/post/6844903895467032589)

`webkit` rendering engine workflow

![img](Resources/vue2/b32d88931ee775d57b382d7585de3ad8.png)

> Chinese version

![img](Resources/vue2/cd1757feee540ef20c50b81af16d75ca.jpg)

Browser rendering engines broadly follow five steps: build the `DOM` tree -> create `Style Rules` -> build the `Render` tree -> `Layout` -> `Painting`.

- Step 1, build the DOM tree: after receiving the server's HTML document, the browser traverses its nodes to build a DOM tree. Loading and executing CSS and JS may block DOM construction; rendering blockage is discussed below.

- Step 2, generate styles: the CSS parser analyzes CSS files and inline element styles to produce the page's style rules.

- Rendering blockage: encountering a script tag pauses DOM construction until the script loads and executes, then DOM construction resumes. Running JavaScript can substantially block DOM construction. If JavaScript accesses CSSOM before CSSOM has downloaded and been built, the browser may delay both script execution and DOM construction until CSSOM is ready. Script placement matters; follow two principles:

  - CSS first: load CSS resources before JavaScript.

  - JavaScript last: place scripts at the bottom and minimize their impact on DOM construction.

    > During HTML parsing, new elements enter the DOM tree and matching CSS rules are applied. Selector matching proceeds right to left: for div p {...}, it finds p elements and checks their div ancestry before applying the style. Prefer classes or IDs and avoid excessive selector nesting.

- Step 3, build the render tree from the DOM tree and CSS rules. The browser traverses visible DOM nodes, finds matching CSS rules, and applies them. Each render-tree node contains content and corresponding styles. This differs from the DOM tree: non-rendered elements and display:none elements are absent, while visibility:hidden elements remain.

- Step 4, **layout**: traverse from the render-tree root to determine each node's exact page size and position. The output is a box model capturing every element's precise on-screen size and location.

- Step 5, **painting the render tree**: traverse the tree and call each renderer's paint() to display content. The browser's UI backend performs the painting.

**Points to note:**

**1. Does `DOM` construction start after document loading finishes?** Building the `DOM` tree is incremental. To show content promptly, the engine need not wait for all `HTML` parsing before building the `render` tree and performing layout.

**2. Does `Render` construction wait for the entire `DOM` tree and `CSS` stylesheets?** These processes overlap rather than being completely independent: loading, parsing, and rendering can proceed together.

**3. What matters in `CSS` parsing?** `CSS` selectors are matched right to left; greater nesting slows matching.

\*\*4. What is the cost of `JS` operating on real `DOM`?\*\* Traditional DOM manipulation can greatly affect performance. Frequent DOM changes cause reflow and repaint, requiring repeated layout calculations, rearrangement, and painting, with substantial overhead. Direct real-`DOM` manipulation can perform poorly; let us demonstrate.

```html
<div id="app"></div>
<script>
    // See note 1 below.
    let box = document.querySelector('#app');
    console.log(box);

    // See note 2 below.
    console.time('a');
    for (let i = 0; i <= 10000; i++) {
        box.innerHTML = i;
    }
    console.timeEnd('a');

    // See note 3 below.
    let num = 0;
    console.time('b');
    for (let i = 0; i <= 10000; i++) {
        num = i;
    }
    box.innerHTML = num;
    console.timeEnd('b');

</script>
```

Example explanations:

1. Get the DIV element
2. Real DOM operations
3. Virtual DOM operations

![Example illustration](Resources/vue2/0740cb16f1354358bed6ef638b90ebfe.png)

> The results show poor performance for real DOM manipulation, so maximize reuse and reduce DOM operations.

#### **Benefits of virtual DOM** :id=h-1ddd0ea78be0

```
虚拟 `DOM` 就是为了解决浏览器性能问题而被设计出来的。如前，若一次操作中有 10 次更新 `DOM` 的动作，虚拟 `DOM` 不会立即操作 `DOM`，而是将这 10 次更新的 `diff` 内容保存到本地一个 `JS` 对象中，最终将这个 `JS` 对象一次性 `attch` 到 `DOM` 树上，再进行后续操作，避免大量无谓的计算量。所以，用 `JS` 对象模拟 `DOM` 节点的好处是，页面的更新可以先全部反映在 `JS` 对象(虚拟 `DOM` )上，操作内存中的 `JS` 对象的速度显然要更快，等更新完成后，再将最终的 `JS` 对象映射成真实的 `DOM`，交由浏览器去绘制。

虽然这一个虚拟 DOM 带来的一个优势，但并不是全部。虚拟 DOM 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的 DOM，可以是安卓和 IOS 的原生组件，可以是近期很火热的小程序，也可以是各种GUI。

回到最开始的问题，虚拟 DOM 到底是什么，说简单点，就是一个普通的 JavaScript 对象，包含了 `tag`、`props`、`children` 三个属性。
```

> Next, implement a virtual DOM manually.
>
> There are two approaches:
>
> Using native JavaScript DOM operations;
>
> Using a mainstream virtual DOM library such as snabbdom or virtual-dom, rendering with h (not yet understood by the author).

**Algorithm implementation**

\*\*(1)\*\* Represent a DOM tree with JS objects:

```html
<div id="virtual-dom">
    <p>Virtual DOM</p>
    <ul id="list">
      <li class="item">Item 1</li>
      <li class="item">Item 2</li>
      <li class="item">Item 3</li>
    </ul>
    <div>Hello World</div>
</div>
```

Use `JavaScript` objects for `DOM` nodes, recording node types, attributes, children, and so on as object properties.

```js
/* See note 1 below. */
function Element(tagName, props, children) {
    this.tagName = tagName;
    this.props = props;
    this.children = children;
    // See note 2 below.
    if (props.key) {
        this.key = props.key
    }
}
function el(tagName, props, children) {
    return new Element(tagName, props, children);
}
```

Example explanations:

1. Element virtual-dom object definition; @param {String} tagName - DOM element name; @param {Object} props - DOM attributes; @param {Array\<Element|String>} - child nodes
2. The DOM element's key, used as a unique identifier

Build virtual `DOM` represented by JavaScript objects

```js
let ul = el('div', { id: 'Virtual DOM' }, [
    el('p', {}, ['Virtual DOM']),
    el('ul', { id: 'list' }, [
        el('li', { class: 'item' }, ['Item 1']),
        el('li', { class: 'item' }, ['Item 2']),
        el('li', { class: 'item' }, ['Item 3'])
    ]),
    el('div', {}, ['Hello, World'])
])
```

`ul` now represents a `DOM` structure with `JavaScript` objects. Printing `ul` shows this structure:

![Example illustration](Resources/vue2/9fb2a6336a61477c8ea39677716d1f52.png)

\*\*(2)\*\* Convert the object-based virtual DOM into real DOM, using native JavaScript DOM methods.

```js
/* See note 1 below. */
Element.prototype.render = function () {
    // See note 2 below.
    let el = document.createElement(this.tagName);

    let props = this.props;
    // See note 3 below.
    for (let propName in props) {
        let propValue = props[propName];
        el.setAttribute(propName, propValue)
    }

    let children = this.children || []
    for (let child of children) {
        let childEl = (child instanceof Element)
        ? child.render() // See note 4 below.
        : document.createTextNode(child) // See note 5 below.

        el.appendChild(childEl);
    }

    return el;
}
```

Example explanations:

1. render renders a virtual-dom object as an actual DOM element.
2. Create a node
3. Set the node's DOM attributes
4. For virtual DOM children, recursively build DOM nodes
5. For text, create a text node

The `render` method creates a real `DOM` node from `tagName`, sets its attributes, then recursively constructs its children.

Add the constructed `DOM` structure to the page's `body`:

```js
let ulRoot = ul.render();
document.body.appendChild(ulRoot);
```

The page's `body` now contains a real `DOM` structure, as shown below:

![Example illustration](Resources/vue2/41bf566f214f4c1f943b9a3dddfc6f19.png)

> Now that we know virtual DOM's benefits and virtual DOM implementation, we can discuss key.
>
> Complete code for the implementation above

```html
<script>
    /* See note 1 below. */
    function Element(tagName, props, children) {
        this.tagName = tagName;
        this.props = props;
        this.children = children;
        // See note 2 below.
        if (props.key) {
            this.key = props.key
        }
    }

    function el(tagName, props, children) {
        return new Element(tagName, props, children);
    }

    let ul = el('div', { id: 'Virtual DOM' }, [
        el('p', {}, ['Virtual DOM']),
        el('ul', { id: 'list' }, [
            el('li', { class: 'item' }, ['Item 1']),
            el('li', { class: 'item' }, ['Item 2']),
            el('li', { class: 'item' }, ['Item 3'])
        ]),
        el('div', {}, ['Hello, World'])
    ])

    /* See note 3 below. */
    Element.prototype.render = function () {
        // See note 4 below.
        let el = document.createElement(this.tagName);

        let props = this.props;
        // See note 5 below.
        for (let propName in props) {
            let propValue = props[propName];
            el.setAttribute(propName, propValue)
        }

        let children = this.children || []
        for (let child of children) {
            let childEl = (child instanceof Element)
            ? child.render() // See note 6 below.
            : document.createTextNode(child) // See note 7 below.

            el.appendChild(childEl);
        }

        return el;
    }

    let ulRoot = ul.render();
    document.body.appendChild(ulRoot);
    console.log(ul);
</script>
```

Example explanations:

1. Element virtual-dom object definition; @param {String} tagName - DOM element name; @param {Object} props - DOM attributes; @param {Array\<Element|String>} - child nodes
2. The DOM element's key, used as a unique identifier
3. render renders a virtual-dom object as an actual DOM element.
4. Create a node
5. Set the node's DOM attributes
6. For virtual DOM children, recursively build DOM nodes
7. For text, create a text node

#### **The role of key in virtual DOM** :id=h-f561e54fd28e

key identifies a virtual DOM object. When data changes, Vue generates new virtual DOM from the new data. Vue then compares the new virtual DOM with the old virtual DOM according to these rules:

- The old virtual DOM has the same key as the new virtual DOM:
  - ① If virtual DOM content is unchanged, reuse the existing real DOM.
  - ② If virtual DOM content changed, generate new real DOM and replace the previous real DOM on the page.
- The old virtual DOM has no matching key for the new virtual DOM.
  - Create new real DOM and render it on the page.

> That is the simplest explanation of key. Further study involves one of Vue's core mechanisms, the diff algorithm, discussed later.

### Potential problems with index as key: :id=h-3f8328b42976

**If operations disrupt ordering, such as inserting or deleting in reverse order:**

Unnecessary real DOM updates occur: the display looks correct, but efficiency suffers.

> Example

```html
<!-- See note 1 below. -->
<div id="root">
    <!-- See note 2 below. -->
    <h2>人员列表（遍历数组）</h2>
    <button @click.once="add">添加一个老刘</button>
    <ul>
        <li v-for="(p,index) of persons" :key="index">
            {{p.name}}-{{p.age}}
            <input type="text">
        </li>
    </ul>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false

    new Vue({
        el: '#root',
        data: {
            persons: [
                { id: '001', name: '张三', age: 18 },
                { id: '002', name: '李四', age: 19 },
                { id: '003', name: '王五', age: 20 }
            ]
        },
        methods: {
            add() {
                const p = { id: '004', name: '老刘', age: 40 }
                this.persons.unshift(p)
            }
        },
    });
</script>
```

Example explanations:

1. Prepare a container
2. Iterate an array

> Explanation:

Initial data

persons: \[
{ id: '001', name: 'Zhang San', age: 18 },
{ id: '002', name: 'Li Si', age: 19 },
{ id: '003', name: 'Wang Wu', age: 20 }
]

**Vue generates virtual DOM from data**

Initial virtual DOM

```html
<li key='0'>张三-18<input type="text"></li>
<li key='1'>李四-19<input type="text"></li>
<li key='2'>王五-20<input type="text"></li>
```

**Convert virtual DOM into real DOM**

![Example illustration](Resources/vue2/ac320c177da8496785f7b94e54dd938a.png)

`this.persons.unshift({ id: '004', name: '老刘', age: 40 })`

Prepend { id: '004', name: 'Lao Liu', age: 40 } to persons.

New data:

persons: \[

```
    { id: '004', name: '老刘', age: 40 },

    { id: '001', name: '张三', age: 18 },
    { id: '002', name: '李四', age: 19 },
    { id: '003', name: '王五', age: 20 }
```

]

**Vue generates virtual DOM from data**

New virtual DOM

```html
<li key='0'>老刘-30<input type="text"></li>
<li key='1'>张三-18<input type="text"></li>
<li key='3'>李四-19<input type="text"></li>
<li key='4'>王五-20<input type="text"></li>
```

**Convert virtual DOM into real DOM**

![Example illustration](Resources/vue2/2ec092bf1dca430c9d9b7bf932587501.png)

With index as key, Vue reuses nodes by position, updates content, and adds/removes nodes as needed; it does not recreate every node. After reordering, input and child-component state may follow positions rather than original data. Prefer a stable, unique business ID.

> A diagram from Shangguigu

![Example illustration](Resources/vue2/ec80a7ae139642d09d70e77ca37e0a52.png)

**If the structure also contains input DOM elements:**

Incorrect DOM updates can cause display problems.

> This causes actual page errors, not merely wasted performance.

![Example illustration](Resources/vue2/c89eb1802c7a4698ba5b14ab0ab654d8.png)

### Conclusion: :id=h-2898bf117fd4

- Prefer each record's unique identifier as key, such as an ID, phone number, identity-card number, or student number.
- index is acceptable for display-only lists when there are no order-disrupting operations such as reverse insertion or deletion.

> A Shangguigu diagram showing proper key usage

![Example illustration](Resources/vue2/e5b3f8a66d7441e5bcff0a2525266759.png)

<a id="section-15"></a>

## 1.14 How Vue observes data :id=h-30e0a183c7dd

An introductory example:

```html
<!-- See note 1 below. -->
<div id="root">
    <h2>人员列表</h2>
    <button @click="updateMei">更新马冬梅的信息</button>
    <ul>
        <li v-for="(p,index) of persons" :key="p.id">
            {{p.name}}-{{p.age}}-{{p.sex}}
        </li>
    </ul>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false

    const vm = new Vue({
        el:'#root',
        data:{
            persons:[
                {id:'001',name:'马冬梅',age:30,sex:'女'},
                {id:'002',name:'周冬雨',age:31,sex:'女'},
                {id:'003',name:'周杰伦',age:18,sex:'男'},
                {id:'004',name:'温兆伦',age:19,sex:'男'}
            ]
        },
        methods: {
            updateMei(){
                // See note 2 below.
                // See note 3 below.
                // See note 4 below.
                this.persons[0] = {id:'001',name:'马老师',age:50,sex:'男'} // See note 5 below.
                // See note 6 below.
            }
        }
    })

</script>
```

Example explanations:

1. Prepare a container
2. this.persons\[0].name = 'Teacher Ma' // Works
3. this.persons\[0].age = 50 // Works
4. this.persons\[0].sex = 'male' // Works
5. Does not work
6. this.persons.splice(0,1,{id:'001',name:'Teacher Ma',age:50,sex:'male'})

Clicking to update Ma Dongmei's information does not change the displayed data.

![Example illustration](Resources/vue2/6f16b316d8824ca897e55c70884463de.png)

Look at the console:
![Insert image description here](Resources/vue2/145a2298bba942c78f8d23f03fb21bdf.png)

The console data changed, showing Vue did not observe this change.

Let us examine Vue's observation mechanism.

First, how Vue observes object data

> Code

```html
<!-- See note 1 below. -->
<div id="root">
    <h2>学校名称：{{name}}</h2>
    <h2>学校地址：{{address}}</h2>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false // See note 2 below.

    const vm = new Vue({
        el:'#root',
        data:{
            name:'浙江师范大学',
            address:'金华',
            student:{
                name:'tom',
                age:{
                    rAge:40,
                    sAge:29,
                },
                friends:[
                    {name:'jerry',age:35}
                ]
            }
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Disable Vue's production tip at startup.

![Example illustration](Resources/vue2/024cbd8a706c451e9a1f6cc3916e426e.png)

> After template processing: calling set triggers template processing -> new virtual DOM -> comparison of old/new DOM -> page update.

Simulate Vue's data observation

```html
<script type="text/javascript" >

    let data = {
        name:'尚硅谷',
        address:'北京',
    }

    // See note 1 below.
    const obs = new Observer(data)
    console.log(obs)

    // See note 2 below.
    let vm = {}
    vm._data = data = obs

    function Observer(obj){
        // See note 3 below.
        const keys = Object.keys(obj)
        // See note 4 below.
        keys.forEach((k) => {
            Object.defineProperty(this, k, {
                get() {
                    return obj[k]
                },
                set(val) {
                    console.log(`${k}被改了，我要去解析模板，生成虚拟DOM.....我要开始忙了`)
                    obj[k] = val
                }
            })
        })
    }
</script>
```

Example explanations:

1. Create an observer instance to watch changes in data properties
2. Prepare a vm instance
3. Collect all object properties into an array
4. Iterate

![Example illustration](Resources/vue2/250a6e7fa0da45608997f2688e143d45.png)

**Using Vue.set**

Vue.set(target, propertyName/index, value), or

vm.$set(target，propertyName/index，value)

**Usage**:

Adds a property to a reactive object, ensures the new property is reactive, and triggers a view update. Use it for new properties because Vue cannot detect ordinary property additions, such as `vm.myObject.newProperty = 'hi'`.

> Code

```html
<!-- See note 1 below. -->
<div id="root">
    <h1>学生信息</h1>
    <button @click="addSex">添加性别属性，默认值：男</button> <br/>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false // See note 2 below.

    const vm = new Vue({
        el:'#root',
        data:{
            student:{
                name:'tom',
                age:18,
                hobby:['抽烟','喝酒','烫头'],
                friends:[
                    {name:'jerry',age:35},
                    {name:'tony',age:36}
                ]
            }
        },
        methods: {
            addSex(){
                // See note 3 below.
                this.$set(this.student,'sex','男')
            }
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Disable Vue's production tip at startup.
3. Vue.set(this.student,'sex','male')

Vue.set() and vm.$set have a limitation:

![Example illustration](Resources/vue2/954f0312289748c189bac545b4463c63.png)

> Namely, vm and \_data

After object observation, let us examine how Vue observes arrays.

> Start with a code example.

```html
<!-- See note 1 below. -->
<div id="root">
    <h2>爱好</h2>
    <ul>
        <li v-for="(h,index) in student.hobby" :key="index">
            {{h}}
        </li>
    </ul>
    <h2>朋友们</h2>
    <ul>
        <li v-for="(f,index) in student.friends" :key="index">
            {{f.name}}--{{f.age}}
        </li>
    </ul>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false // See note 2 below.

    const vm = new Vue({
        el:'#root',
        data: {
            student:{
                name:'tom',
                age:{
                    rAge:40,
                    sAge:29,
                },
                hobby:['抽烟','喝酒','烫头'],
                friends:[
                    {name:'jerry',age:35},
                    {name:'tony',age:36}
                ]
            }
        },
        methods: {

        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Disable Vue's production tip at startup.

![Example illustration](Resources/vue2/b2f270e6fed4408fb6709e960aea7953.png)

> Thus vm.\_data.student.hobby\[0] = 'aaa' // Does not work
>
> Vue arrays do not have getters/setters for these indexes, so the change is not detected and the page does not update.

![Example illustration](Resources/vue2/0e4c3d70f3e3492baaa2f391b0c26ec0.png)

If Vue cannot observe array changes through getters and setters, how does it observe them?

Vue wraps common array-mutating methods to observe arrays.

Explanation from Vue's official site:

![Example illustration](Resources/vue2/b003a83d94dd44e0ae93a87da8ab43d9.png)

**Review:**

How Vue observes data:

- Vue observes every level of data.

- How is object data observed?

  Through setters, with the observed data provided when constructing new Vue.

  - Vue does not make later-added object properties reactive by default.

  - Use this API to make later-added properties reactive:

    Vue.set(target, propertyName/index, value), or

    vm.$set(target，propertyName/index，value)

- How is array data observed?

  By wrapping array update methods, doing two things:

  - Call the corresponding native method to update the array
  - Reprocess the template and update the page

- To change an array element in Vue, use these methods:

  - These APIs: push(), pop(), shift(), unshift(), splice(), sort(), reverse()
  - Vue.set() or vm.$set()

> Important: Vue.set() and vm.$set() cannot add properties to vm or vm's root data object.

<a id="section-16"></a>

## 1.15 Collecting form data :id=h-c4c4fce3c23b

For <input type="text"/>, v-model collects value, the user's input.

```html
<!-- See note 1 below. -->
<div id="root">
    <form @submit.prevent="demo">
        账号：<input type="text" v-model.trim="userInfo.account"> <br/><br/>
        密码：<input type="password" v-model="userInfo.password"> <br/><br/>
        年龄：<input type="number" v-model.number="userInfo.age"> <br/><br/>
        <button>提交</button>
    </form>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false

    new Vue({
        el:'#root',
        data:{
            userInfo:{
                account:'',
                password:'',
                age:18,
            }
        },
        methods: {
            demo(){
                console.log(JSON.stringify(this.userInfo))
            }
        }
    })
</script>
```

Example explanations:

1. Prepare a container

For <input type="radio"/>, v-model collects value, which must be set on the element.

```html
<!-- See note 1 below. -->
<div id="root">
    <form @submit.prevent="demo">
        性别：
        男<input type="radio" name="sex" v-model="userInfo.sex" value="male">
        女<input type="radio" name="sex" v-model="userInfo.sex" value="female">
    </form>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false

    new Vue({
        el:'#root',
        data:{
            userInfo:{
                sex:'female'
            }
        },
        methods: {
            demo(){
                console.log(JSON.stringify(this.userInfo))
            }
        }
    })
</script>
```

Example explanations:

1. Prepare a container

For <input type="checkbox"/>:

- Without an input value attribute, it collects checked, a boolean indicating selected or unselected.
- With an input value attribute:
  - If v-model's initial value is not an array, it collects checked as a boolean.
  - If v-model starts as an array, it collects an array of value entries.

```html
<!-- See note 1 below. -->
<div id="root">
    <form @submit.prevent="demo">
        爱好：
        学习<input type="checkbox" v-model="userInfo.hobby" value="study">
        打游戏<input type="checkbox" v-model="userInfo.hobby" value="game">
        吃饭<input type="checkbox" v-model="userInfo.hobby" value="eat">
        <br/><br/>
        所属校区
        <select v-model="userInfo.city">
            <option value="">请选择校区</option>
            <option value="beijing">北京</option>
            <option value="shanghai">上海</option>
            <option value="shenzhen">深圳</option>
            <option value="wuhan">武汉</option>
        </select>
        <br/><br/>
        其他信息：
        <textarea v-model.lazy="userInfo.other"></textarea> <br/><br/>
        <input type="checkbox" v-model="userInfo.agree">阅读并接受<a href="http://www.atguigu.com">《用户协议》</a>
        <button>提交</button>
    </form>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false

    new Vue({
        el:'#root',
        data:{
            userInfo:{
                hobby:[],
                city:'beijing',
                other:'',
                agree:''
            }
        },
        methods: {
            demo(){
                console.log(JSON.stringify(this.userInfo))
            }
        }
    })
</script>
```

Example explanations:

1. Prepare a container

![Example illustration](Resources/vue2/74583240fa094967b19441921634b304.png)

> Three v-model modifiers:
>
> lazy: synchronizes on change. Text input often triggers it after editing and losing focus, but not every form control is equivalent to blur.
>
> number: converts input strings to valid numbers
>
> trim: removes leading and trailing spaces

<a id="section-17"></a>

## 1.16 Filters (lower priority) :id=h-71ac16a83a91

Definition: format data before displaying it, suitable for simple processing logic.

**Syntax:**

- Register: Vue.filter(name,callback) or new Vue{filters:{}}
- Use: {{ xxx | filterName }} or v-bind:attribute="xxx | filterName"

```html
<!-- See note 1 below. -->
<div id="root">
    <h2>显示格式化后的时间</h2>
    <!-- See note 2 below. -->
    <h3>现在是：{{ fmtTime }}</h3>
    <!-- See note 3 below. -->
    <h3>现在是：{{ getFmtTime() }}</h3>
    <!-- See note 4 below. -->
    <h3>现在是：{{time | timeFormater}}</h3>
    <!-- See note 5 below. -->
    <h3>现在是：{{time | timeFormater('YYYY_MM_DD') | mySlice}}</h3>
    <h3 :x="msg | mySlice">尚硅谷</h3>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false
    // See note 6 below.
    Vue.filter('mySlice',function(value){
        return value.slice(0,4)
    })

    new Vue({
        el:'#root',
        data:{
            time:1621561377603, // See note 7 below.
            msg:'你好，尚硅谷'
        },
        computed: {
            fmtTime(){
                return dayjs(this.time).format('YYYY年MM月DD日 HH:mm:ss')
            }
        },
        methods: {
            getFmtTime(){
                return dayjs(this.time).format('YYYY年MM月DD日 HH:mm:ss')
            }
        },
        // See note 8 below.
        filters:{
            timeFormater(value, str='YYYY年MM月DD日 HH:mm:ss'){
                // console.log('@',value)
                return dayjs(value).format(str)
            }
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Using a computed property
3. Using methods
4. Using a filter
5. Using a filter with arguments
6. Global filter
7. Timestamp
8. Local filter

> Notes:
>
> 1\. Filters can accept extra arguments and be chained.
>
> 2\. Original data remains unchanged; new corresponding data is produced.

<a id="section-18"></a>

## 1.17 Built-in directives :id=h-84208dd89593

**v-text:** (less frequently used)

1\. Renders text into its node.

2\. Unlike interpolation, v-text replaces the node's content; {{xx}} does not.

```html
<!-- See note 1 below. -->
<div id="root">
    <div>你好，{{name}}</div>
    <div v-text="name"></div>
    <div v-text="str"></div>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false // See note 2 below.

    new Vue({
        el:'#root',
        data:{
            name:'张三',
            str:'<h3>你好啊！</h3>'
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Disable Vue's production tip at startup.

**v-html:** (rarely used)

1\. Renders HTML-structured content into a specified node.

2\. Differences from interpolation:

- v-html replaces all node content, unlike {{xx}}.
- v-html recognizes HTML structure.

3\. Critical: v-html has security risks!

- Dynamically rendering arbitrary HTML is dangerous and can lead to XSS attacks.
- Use v-html only with trusted content, never with user submissions.

```html
<!-- See note 1 below. -->
<div id="root">
    <div>你好，{{name}}</div>
    <div v-html="str"></div>
    <div v-html="str2"></div>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false // See note 2 below.

    new Vue({
        el:'#root',
        data:{
            name:'张三',
            str:'<h3>你好啊！</h3>',
            str2:'<a href="#" onclick="console.log(123)">不可信 HTML 示例</a>',
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Disable Vue's production tip at startup.

**v-cloak (no value):**

- A special attribute removed when the Vue instance is created and takes over the container.
- CSS with v-cloak prevents {{xxx}} from appearing on slow connections.

```html
<style>
    [v-cloak]{
        display:none;
    }
</style>
<!-- See note 1 below. -->
<div id="root">
    <h2 v-cloak>{{name}}</h2>
</div>
<script type="text/javascript" src="http://localhost:8080/resource/5s/vue.js"></script>

<script type="text/javascript">
    console.log(1)
    Vue.config.productionTip = false // See note 2 below.

    new Vue({
        el:'#root',
        data:{
            name:'尚硅谷'
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Disable Vue's production tip at startup.

**v-once:** (rarely used)

- After its initial dynamic render, a v-once node is treated as static.
- Later data changes do not update the v-once structure, which can optimize performance.

```html
<!-- See note 1 below. -->
<div id="root">
    <h2 v-once>初始化的n值是:{{ n }}</h2>
    <h2>当前的n值是:{{ n }}</h2>
    <button @click="n++">点我n+1</button>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false // See note 2 below.

    new Vue({
        el:'#root',
        data:{
            n:1
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Disable Vue's production tip at startup.

**v-pre:** (limited usefulness here)

- Skips compilation of its node
- Skip nodes with no directives or interpolation to speed compilation.

```html
<!-- See note 1 below. -->
<div id="root">
    <h2 v-pre>Vue其实很简单</h2>
    <h2 >当前的n值是:{{n}}</h2>
    <button @click="n++">点我n+1</button>
</div>

<script type="text/javascript">
    Vue.config.productionTip = false // See note 2 below.

    new Vue({
        el:'#root',
        data:{
            n:1
        }
    })
</script>
```

Example explanations:

1. Prepare a container
2. Disable Vue's production tip at startup.

<a id="section-19"></a>

## 1.18 Custom directives :id=h-ddba23dcec10

Requirement 1: define v-big, similar to v-text but multiplying the bound number by 10.

Requirement 2: define v-fbind, similar to v-bind but automatically focusing its bound input.

**Syntax:**

Local directives:

```js
const componentOptions = {
directives: {
  focus: {
    // See note 1 below.
    inserted: function (el) {
      el.focus()
    }
  }
}
};
```

Example explanations:

1. Directive definition

Global directives:

```html
<script>
    // See note 1 below.
    Vue.directive('focus', {
        // See note 2 below.
        inserted: function (el) {
            // See note 3 below.
            el.focus()
        }
    })
</script>
```

Example explanations:

1. Register a global custom directive v-focus
2. When the bound element enters the DOM…
3. Focus the element

Three common configuration callbacks:

- bind: called when the directive binds successfully to the element.
- inserted: called when the bound element is inserted into the page.
- update: called when the directive's template structure is reprocessed.

> Understanding their timing requires Vue lifecycle knowledge, introduced below.

Define a global directive

```html
<!-- See note 1 below. -->
<div id="root">
    <input type="text" v-fbind:value="n">
</div>

<script type="text/javascript">
    Vue.config.productionTip = false

    // See note 2 below.
    Vue.directive('fbind', {
        // See note 3 below.
        bind(element, binding){
            element.value = binding.value
        },
        // See note 4 below.
        inserted(element, binding){
            element.focus()
        },
        // See note 5 below.
        update(element, binding){
            element.value = binding.value
        }
    })

    new Vue({
        el:'#root',
        data:{
            name: '尚硅谷',
            n: 1
        }
    })

</script>
```

Example explanations:

1. Prepare a container
2. Define a global directive
3. When the directive first binds to the element
4. When the directive's element enters the page
5. When the directive's template is parsed again

Local directives:

```js
new Vue({
    el: '#root',
    data: {
        name:'尚硅谷',
        n:1
    },
    directives: {
        // See note 1 below.
        /* 'big-number'(element,binding){
                    // console.log('big')
                    element.innerText = binding.value * 10
                }, */
        big (element,binding){
            console.log('big',this) // See note 2 below.
            // console.log('big')
            element.innerText = binding.value * 10
        },
        fbind: {
            // See note 3 below.
            bind (element,binding){
                element.value = binding.value
            },
            // See note 4 below.
            inserted (element,binding){
                element.focus()
            },
            // See note 5 below.
            update (element,binding){
                element.value = binding.value
            }
        }
    }
})
```

Example explanations:

1. When is big called? 1. On initial binding. 2. When the directive's template is reprocessed.
2. Here, this is window.
3. When the directive first binds to the element
4. When the directive's element enters the page
5. When the directive's template is parsed again

<a id="section-20"></a>

## 1.19 Lifecycle :id=h-b23671dde004

### Introduction to the lifecycle :id=h-b94e2371bd85

A Vue instance has a complete lifecycle: new Vue(), event (.once) and lifecycle initialization, template compilation, DOM mounting -> rendering, updates -> rendering, unmounting, and so on. This sequence is the Vue lifecycle.

First, a diagram from Shangguigu:

![Example illustration](Resources/vue2/e4a8169c832443f2a78c6a1ae42a87b3.png)

1. **beforeCreate (before creation)**: data observation (getters/setters) and event initialization have not started. Reactive data tracking and event/watcher are not set up; data, computed, watch, and methods are unavailable.
2. **created (after creation)**: the instance and its data, computed, watch, methods, and other options are initialized. Rendered nodes are not mounted in the DOM, so `$el` is unavailable.
3. **beforeMount (before mounting)**: called before mounting begins and the render function first runs. Vue processes the template into virtual DOM in memory. It has not converted virtual DOM to real DOM and inserted it, so processed content is not displayed yet.
4. **mounted (after mounting)**: called after el is replaced by the newly created vm.$el (a copy of real DOM) and mounted on the instance: virtual DOM becomes real DOM, then real DOM is inserted. The page now shows Vue-compiled DOM. DOM operations work in this hook but should be minimized. Typical tasks are starting timers, network requests, subscriptions, and custom event bindings.
5. **beforeUpdate (before update)**: called when reactive data changes but before the corresponding real DOM is rendered. Data is new while the page is still old and not yet synchronized.
6. **updated (after update)**: called after virtual DOM rerendering and patching caused by data changes. DOM now reflects reactive data. The component DOM is updated, allowing DOM-dependent operations. Usually avoid state changes here, which may cause infinite update loops. Not called during server-side rendering.
7. **beforeDestroy (before destruction)**: called before destruction while the instance is fully usable and accessible through `this`. Typically stop timers, unsubscribe messages, and remove custom event bindings here.
8. **destroyed (after destruction)**: called after the instance is destroyed. All bindings on the Vue instance are removed, event listeners are removed, and child instances are destroyed. Not called during server-side rendering.

> Now examine the large box in the diagram's center.

![Example illustration](Resources/vue2/bf970362485848798ab093430b4162b8.png)

First check for the **el** option. Without it, call vm.$mount(el); without either, mounting waits and the original container remains visible. With **el**, check for template. If absent, compile the el container as the Vue template. Compare the following images.

Before compilation:

![Example illustration](Resources/vue2/d2242a275b1c4abe98fbcf9623ff8152.png)

After compilation:

![Example illustration](Resources/vue2/2c59b4bb3820404f87adf366e8582f91.png)

What is template for?

**Case 1: template is present**

If the el container is empty but the Vue instance provides template, that template is compiled into virtual DOM, then virtual DOM becomes real DOM inserted into the page. Think of template as replacing the el container's content.

![Example illustration](Resources/vue2/b6de87cd2e44480a8cbe1ec82b867ca3.png)

![Example illustration](Resources/vue2/23762cb8feb340449fb0033abcff0a6d.png)

**Case 2: no template**

Without template, compile the el container to virtual DOM, then continue the lifecycle.

<a id="section-21"></a>

## 1.20 Non-single-file components :id=h-5e61a2bbd043

### Basic usage :id=h-f4705c779923

Three steps for using Vue components:

- Define (create) the component
- Register the component
- Use the component by writing its element

**Defining components**

Create with Vue.extend(options). These options are almost the same as those passed to new Vue(options), with a few differences.

Differences:

- Do not set el: all components ultimately come under one vm, whose el determines the container.
- data must be a function to avoid sharing the same data reference when components are reused.

An interview question: why must data be a function?

It follows from JavaScript's underlying behavior. For example:

> Object form

```js
let data = {
    a: 99,
    b: 100
}

let x = data;
let y = data;
// See note 1 below.
x.a = 66;
console.loh(x); // a:66 b:100
console.log(y); // a:66 b:100
```

Example explanations:

1. x and y reference the same object, so changing x also changes the value seen through y.

> Function form

```js
function data() {
    return {
        a: 99,
        b: 100
    }
}
let x = data();
let y = data();
console.log(x === y); // false
// See note 1 below.
```

Example explanations:

1. My understanding is that each call creates and returns a new object.

> Note: template configures the component structure.

Example: create a component with Vue.extend().

```html
<script type="text/javascript">
    Vue.config.productionTip = false

    // See note 1 below.
    const school = Vue.extend({
        template:`
                <div class="demo">
                    <h2>学校名称：{{schoolName}}</h2>
                    <h2>学校地址：{{address}}</h2>
                    <button @click="showName">点我提示学校名</button>
    </div>
            `,
        // See note 2 below.
        data(){
            return {
                schoolName:'尚硅谷',
                address:'北京昌平'
            }
        },
        methods: {
            showName(){
                alert(this.schoolName)
            }
        },
    })

    // See note 3 below.
    const student = Vue.extend({
        template:`
                <div>
                    <h2>学生姓名：{{studentName}}</h2>
                    <h2>学生年龄：{{age}}</h2>
    </div>
            `,
        data(){
            return {
                studentName:'张三',
                age:18
            }
        }
    })

    // See note 4 below.
    const hello = Vue.extend({
        template:`
                <div>
                    <h2>你好啊！{{name}}</h2>
    </div>
            `,
        data(){
            return {
                name:'Tom'
            }
        }
    })
</script>
```

Example explanations:

1. Step 1: create the school component
2. el:'#root', // Do not set el in components; the root vm determines the container for all components.
3. Step 1: create the student component
4. Step 1: create the hello component

**Registering components**

- Local registration: pass components when constructing new Vue.
- Global registration: Vue.component('componentName', component)

> Local registration

```html
<script>
    // See note 1 below.
    new Vue({
        el: '#root',
        data: {
            msg:'你好啊！'
        },
        // See note 2 below.
        components: {
            school: school,
            student: student
            // See note 3 below.
            // school,
            // student
        }
    })
</script>
```

Example explanations:

1. Create vm
2. Step 2: register components locally
3. ES6 shorthand

> Global registration

```html
<script>
    // See note 1 below.
    Vue.component('hello', hello)
</script>
```

Example explanations:

1. Step 2: register components globally

**Writing component elements**

```html
<!-- See note 1 below. -->
<div id="root">
    <hello></hello>
    <hr>
    <h1>{{msg}}</h1>
    <hr>
    <!-- See note 2 below. -->
    <school></school>
    <hr>
    <!-- See note 3 below. -->
    <student></student>
</div>
```

Example explanations:

1. Prepare a container
2. Step 3: write component elements
3. Step 3: write component elements

### **Points to note:** :id=h-2332f13c3820

Component names:

One word:

- First form (lowercase initial): school
- Second form (uppercase initial): School

Multiple words:

- First form (kebab-case): my-school
- Second form (PascalCase): MySchool. Available in single-file components; browser-parsed HTML lowercases element names.

> Notes:
>
> (1) Avoid existing HTML element names: neither h2 nor H2 is allowed.
>
> (2) The name option sets the component name displayed in devtools.

Component element syntax:

First form: <school></school>

Second form: <school/>

> Without a build scaffold, <school/> can prevent later components from rendering.

A shorthand:

const school = Vue.extend(options) can be shortened to const school = options.

### Nested components :id=h-e6753be9eec9

This is straightforward; see the code:

```html
<!-- See note 1 below. -->
<div id="root">

</div>

<script type="text/javascript">
    Vue.config.productionTip = false // See note 2 below.

    // See note 3 below.
    const student = Vue.extend({
        name:'student',
        template:`
                <div>
                    <h2>学生姓名：{{name}}</h2>
                    <h2>学生年龄：{{age}}</h2>
    </div>
            `,
        data(){
            return {
                name:'尚硅谷',
                age:18
            }
        }
    })

    // See note 4 below.
    const school = Vue.extend({
        name:'school',
        template:`
                <div>
                    <h2>学校名称：{{name}}</h2>
                    <h2>学校地址：{{address}}</h2>
                    <student></student>
    </div>
            `,
        data(){
            return {
                name:'尚硅谷',
                address:'北京'
            }
        },
        // See note 5 below.
        components:{
            student
        }
    })

    // See note 6 below.
    const hello = Vue.extend({
        template:`<h1>{{msg}}</h1>`,
        data(){
            return {
                msg:'欢迎来到尚硅谷学习！'
            }
        }
    })

    // See note 7 below.
    const app = Vue.extend({
        template:`
                <div>
                    <hello></hello>
                    <school></school>
    </div>
            `,
        components:{
            school,
            hello
        }
    })

    // See note 8 below.
    new Vue({
        template:'<app></app>',
        el:'#root',
        // See note 9 below.
        components:{app}
    })
</script>
```

Example explanations:

1. Prepare a container
2. Disable Vue's production tip at startup.
3. Define the student component
4. Define the school component
5. Register components locally
6. Define the hello component
7. Define the app component
8. Create vm
9. Register components locally

### VueComponent :id=h-dd997785166f

- The school component is essentially a constructor named VueComponent, generated by Vue.extend rather than defined by the developer.
- Write <school/> or <school></school>. During parsing, Vue creates the school instance; Vue executes new VueComponent(options) for us.
- Important: every Vue.extend call returns a new VueComponent constructor, not a VueComponent instance.
- What this refers to:
  - In component options, this in data, methods, watch, and computed functions refers to the VueComponent instance.
  - In new Vue(options), this in data, methods, watch, and computed functions refers to the Vue instance.
- We abbreviate VueComponent instances as vc (component instances) and Vue instances as vm.

Where Vue manages VueComponent

![Example illustration](Resources/vue2/4039bc27eaff4463be9dd5c037993b77.png)

### An important built-in relationship :id=h-6d9bb4f71112

- An important built-in relationship: VueComponent.prototype.**proto** === Vue.prototype
- This lets component instances (vc) access properties and methods on the Vue prototype.

![Example illustration](Resources/vue2/9f3398cb2cfb4b169951adb53236ad60.png)

<a id="section-22"></a>

## 1.21 Single-file components :id=h-1a3d9bc8e286

A single-file component puts a component's code in a .vue file. Webpack processes it into HTML, CSS, and JavaScript.

A single-file component example:

**School.vue**

```html
<template>
    <div class="demo">
        <h2>学校名称：{{name}}</h2>
        <h2>学校地址：{{address}}</h2>
        <button @click="showName">点我提示学校名</button>
    </div>
</template>

<script>
     export default {
        name:'School',
        data(){
            return {
                name:'尚硅谷',
                address:'北京昌平'
            }
        },
        methods: {
            showName(){
                alert(this.name)
            }
        },
    }
</script>

<style>
    .demo{
        background-color: orange;
    }
</style>
```

**Student.vue**

```html
<template>
    <div>
        <h2>学生姓名：{{name}}</h2>
        <h2>学生年龄：{{age}}</h2>
    </div>
</template>

<script>
     export default {
        name:'Student',
        data(){
            return {
                name:'张三',
                age:18
            }
        }
    }
</script>
```

**App.vue**

Collects and coordinates all components

```html
<template>
    <div>
        <School></School>
        <Student></Student>
    </div>
</template>

<script>
    // See note 1 below.
    import School from './School.vue'
    import Student from './Student.vue'

    export default {
        name:'App',
        components:{
            School,
            Student
        }
    }
</script>
```

Example explanations:

1. Import components

**main.js**

Create the Vue instance in this file

```js
import App from './App.vue'

new Vue({
    el:'#root',
    template:`<App></App>`,
    components:{App},
})
```

**index.html**

Write the container that Vue binds to here

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>练习一下单文件组件的语法</title>
    </head>
    <body>
        <!-- See note 1 below. -->
        <div id="root"></div>
        <script type="text/javascript" src="../js/vue.js"></script>
        <script type="text/javascript" src="./main.js"></script>
    </body>
</html>
```

Example explanations:

1. Prepare a container

<a id="section-23"></a>

# 2. Vue scaffolding, custom events, slots, and advanced topics :id=h-da7b0c7cba20

<a id="section-24"></a>

## 2.1 Scaffolding :id=h-87f55ae3a1a8

> Prerequisites:
>
> Step 1 (if not already installed): install @vue/cli globally.
>
> npm install -g @vue/cli
>
> Step 2: enter the target directory and create a project with the command.
>
> vue create xxxxx
>
> Step 3: start the project
>
> npm run serve

### Scaffold file structure :id=h-8606faaa97f7

```
├── node_modules
├── public
│   ├── favicon.ico: 页签图标
│   └── index.html: 主页面
├── src
│   ├── assets: 存放静态资源
│   │   └── logo.png
│   │── component: 存放组件
│   │   └── HelloWorld.vue
│   │── App.vue: 汇总所有组件
│   │── main.js: 入口文件
├── .gitignore: git版本管制忽略的配置
├── babel.config.js: babel的配置文件
├── package.json: 应用包配置文件
├── README.md: 应用描述文件
├── package-lock.json：包版本控制文件
```

### Scaffold demo :id=h-96a5e57fc61a

components:

Reuse School.vue and Student.vue from the single-file example unchanged.

App.vue:

Import, register, and use the two components.

```html
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Student></Student>
    <School></School>
  </div>
</template>

<script>
import School from './components/School.vue'
import Student from './components/Student.vue'

export default {
  name: 'App',
  components: {
    School,
    Student
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

main.js:

Entry file

```js
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

Next, examine the render function in main.js in detail.

### render function :id=h-b82353325fdb

> A brief aside:

When importing third-party libraries, do not add './'.

Importing our own code:

```js
import App from './App.vue'
```

Importing a third-party library

```js
import Vue from 'vue'
```

from 'vue' needs no `'./'` because third-party resolution in node_modules is already configured.

When importing a third-party library, its package.json determines which file is loaded.

![Example illustration](Resources/vue2/de478c338b1643d4898b8eddbf489197.png)

module determines the imported file.

> Back to render

The previous syntax was:

```js
import App from './App.vue'

new Vue({
    el:'#root',
    template:`<App></App>`,
    components:{App},
})
```

Running this produces the following error:

![Example illustration](Resources/vue2/b2b8ecbfb1784360a12057d3c019a726.png)

The error says the runtime-only Vue build has no template compiler.

As explained above, the imported Vue omits the compiler to reduce size. This vue.js build therefore needs a render function to run the project.

Analyze render

```js
// See note 1 below.
// See note 2 below.
// See note 3 below.
new Vue({
  render(createElement) {
      console.log(typeof createElement);
      // See note 4 below.
      // See note 5 below.
      // See note 6 below.
      return createElement('h1', 'hello')
  }
}).$mount('#app')

```

Example explanations:

1. The full original render syntax
2. render is a function that can receive a parameter a.
3. createElement is a crucial callback function.
4. The createElement callback creates elements.
5. render solves the lack of template compilation in runtime-only Vue.
6. createElement creates concrete elements.

![Example illustration](Resources/vue2/4c32e5e48f2d493a94976a4810abc5fd.png)

Since render does not use this, it can be shortened to an arrow function.

```js
new Vue({
  // render: h => h(App),
  render: (createElement) => {
    return createElement(App)
  }
}).$mount('#app')
```

Further shorthand:

```js
new Vue({
  // render: h => h(App),
  render: createElement => createElement(App)
}).$mount('#app')
```

Finally, rename createElement to h.

Let us review the shorthand forms; JavaScript has quite a few.

The original way to write an object method:

```js
let obj = {
    name: 'aaa',
    work: function (salary) {
        return '工资' + salary;
    }
}
```

ES6 shorthand:

```js
let obj = {
    name: 'aaa',
    work(salary) {
        return '工资' + salary;
    }
}
```

Arrow-function shorthand:

```js
let obj = {
    name: 'aaa',
    work: (salary) => {
        return '工资' + salary;
    }
}
```

Further arrow shorthand (final form):

```js
// See note 1 below.
let obj = {
    name: 'aaa',
    work: salary => '工资' + salary
}
```

Example explanations:

1. One parameter needs no parentheses. With a single return, omit the braces and return keyword.

This explains render's shorthand.

Differences between Vue builds

- Differences between vue.js and vue.runtime.xxx.js:
  - vue.js is the full Vue build: core functionality plus the template compiler.
  - vue.runtime.xxx.js is the runtime Vue build: core functionality only, without the template compiler.
- Without a compiler, vue.runtime.xxx.js cannot use the template option. Specify content using the createElement function passed to render.

### Change the scaffold's default configuration :id=h-6508711ced43

- vue inspect > output.js shows the Vue scaffold's default configuration.
- Customize with vue.config.js. Details: [https://cli.vuejs.org/zh](https://cli.vuejs.org/zh)

### index.html in the scaffold :id=h-68e2a818f6c8

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <!-- See note 1 below. -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- See note 2 below. -->
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <!-- See note 3 below. -->
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <!-- See note 4 below. -->
    <link rel="stylesheet" href="<%= BASE_URL %>css/bootstrap.css">
    <!-- See note 5 below. -->
    <title>硅谷系统</title>
  </head>
  <body>
        <!-- See note 6 below. -->
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
        <!-- See note 7 below. -->
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>

```

Example explanations:

1. A special IE setting makes IE use its highest rendering mode.
2. Enable the ideal mobile viewport
3. Set the tab icon
4. Import third-party styles
5. Set the page title
6. noscript content renders when JavaScript is unsupported.
7. Container

<a id="section-25"></a>

## 2.2 Miscellaneous Vue concepts :id=h-f266ec2fa3c1

### ref attribute :id=h-c2924789fa5e

- Registers reference information for an element or child component, as an alternative to id.
- On HTML elements, it returns the real DOM element; on components, it returns the component instance (vc).
- Usage:
  - Mark: `<h1 ref="xxx">.....</h1>` or `<School ref="xxx"></School>`
  - Access: `this.$refs.xxx`

> Concrete example

```html
<template>
    <div>
        <h1 v-text="msg" ref="title"></h1>
        <button ref="btn" @click="showDOM">点我输出上方的DOM元素</button>
        <School ref="sch"/>
    </div>
</template>

<script>
    // See note 1 below.
    import School from './components/School'

    export default {
        name:'App',
        components:{School},
        data() {
            return {
                msg:'欢迎学习Vue！'
            }
        },
        methods: {
            showDOM(){
                console.log(this.$refs.title) // See note 2 below.
                console.log(this.$refs.btn) // See note 3 below.
                console.log(this.$refs.sch) // See note 4 below.
            }
        },
    }
</script>

```

Example explanations:

1. Import the School component
2. Real DOM element
3. Real DOM element
4. School component instance (vc)

### props option :id=h-41f6ef90aaa4

1. Allows components to receive externally supplied data

2. Pass data: `<Demo name="xxx"/>`

3. Receive data:

   1. First form (receive only): `props:['name'] `

   2. Second form (type restriction): `props:{name:String}`

   3. Third form (type, required status, and default value):

      ```js
      ```

const componentOptions = {
props:{
name:{
type:String, // See note 1 below.
required:true, // See note 2 below.
default:'Lao Wang' // See note 3 below.
}
}
};
\`\`\`

Example explanations:

1. Type
2. Whether required
3. Default value

   > props is readonly. Vue detects changes to props and warns. If business needs require editing, copy props into data and edit that copy.

Example code:

Pass data from parent to child

App.vue

```html
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Student></Student>
    <School name="haha" :age="this.age"></School>
  </div>
</template>

<script>
import School from './components/School.vue'
import Student from './components/Student.vue'

export default {
  name: 'App',
  data () {
    return {
      age: 360
    }
  },
  components: {
    School,
    Student
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

```

School.vue

```html
<template>
  <div class="demo">
    <h2>学校名称：{{ name }}</h2>
    <h2>学校年龄：{{ age }}</h2>
    <h2>学校地址：{{ address }}</h2>
    <button @click="showName">点我提示学校名</button>
  </div>
</template>

<script>
export default {
  name: "School",
  // See note 1 below.
  props: {
    name: {
      type: String,
      required: true // See note 2 below.
    },
    age: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      address: "北京昌平",
    };
  },
  methods: {
    showName() {
      alert(this.name);
    },
  },
};
</script>

<style>
.demo {
  background-color: orange;
}
</style>
```

Example explanations:

1. Simplest form: props: \['name', 'age']
2. Required

### Mixins :id=h-239b26aa430a

Mixins flexibly distribute reusable Vue component functionality. A mixin object can contain any component options. When a component uses it, all its options merge into the component's own options.

Example:

```js
// See note 1 below.
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// See note 2 below.
var Component = Vue.extend({
  mixins: [myMixin]
})
```

Example explanations:

1. Define a mixin object
2. Define a component using the mixin

**Option merging**

Options with matching names in a component and mixin are merged appropriately.

Data objects merge recursively, with component data taking precedence on conflicts.

```js
var mixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],
  data: function () {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
    // => { message: "goodbye", foo: "abc", bar: "def" }
  }
})
```

Same-named hooks merge into an array and all run. Mixin hooks run **before** the component's own hooks.

```js
var mixin = {
  created: function () {
    console.log('混入对象的钩子被调用')
  }
}

new Vue({
  mixins: [mixin],
  created: function () {
    console.log('组件钩子被调用')
  }
})

// See note 1 below.
// See note 2 below.
```

Example explanations:

1. \=> "Mixin hook called"
2. \=> "Component hook called"

Object-valued options such as `methods`, `components`, and `directives` merge into one object. If keys conflict, the component's key-value pair takes precedence.

```js
var mixin = {
  methods: {
    foo: function () {
      console.log('foo')
    },
    conflicting: function () {
      console.log('from mixin')
    }
  }
}

var vm = new Vue({
  mixins: [mixin],
  methods: {
    bar: function () {
      console.log('bar')
    },
    conflicting: function () {
      console.log('from self')
    }
  }
})

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```

> Global mixins are not recommended.

### Plugins :id=h-3f36b708810c

Plugins usually add global Vue functionality. Their scope is not strictly limited.

Use plugins through `Vue.use()` before starting the application with `new Vue()`.

```js
// See note 1 below.
Vue.use(MyPlugin)

new Vue({
  // See note 2 below.
})
```

Example explanations:

1. Calls 'MyPlugin.install(Vue)'
2. ...component options

A plugin is an object with install. Its first argument is Vue; subsequent arguments are data supplied by the plugin user.

Define a plugin:

```js
const plugin = {
  install(Vue) {
    // See note 1 below.
    Vue.filter('uppercase', value => String(value ?? '').toUpperCase());

    // See note 2 below.
    Vue.directive('focus', { inserted: el => el.focus() });

    // See note 3 below.
    Vue.mixin({ created() { /* Shared initialization goes here. */ } });

    // See note 4 below.
    Vue.prototype.$myMethod = function () { return this.$options.name; };
    Vue.prototype.$myProperty = 'example';
  }
};
Vue.use(plugin);
```

Example explanations:

1. 1. Add a global filter
2. 2. Add a global directive
3. 3. Configure a global mixin
4. 4. Add instance methods

Concrete example:

plugin.js

```js
export default {
    install(Vue, x, y, z) {
        console.log(x, y, z)
        // See note 1 below.
        Vue.filter('mySlice', function (value) {
            return value.slice(0, 4)
        })

        // See note 2 below.
        Vue.directive('fbind', {
            // See note 3 below.
            bind(element, binding) {
                element.value = binding.value
            },
            // See note 4 below.
            inserted(element, binding) {
                element.focus()
            },
            // See note 5 below.
            update(element, binding) {
                element.value = binding.value
            }
        })

        // See note 6 below.
        Vue.mixin({
            data() {
                return {
                    x: 100,
                    y: 200
                }
            },
        })

        // See note 7 below.
        Vue.prototype.hello = () => { alert('你好啊aaaa') }
    }
}
```

Example explanations:

1. Global filter
2. Define a global directive
3. When the directive first binds to the element
4. When the directive's element enters the page
5. When the directive's template is parsed again
6. Define a mixin
7. Add a method to the Vue prototype so both vm and vc can use it

main.js

```js
// See note 1 below.
import plugin from './plugin'

// See note 2 below.
Vue.use(plugin)
```

Example explanations:

1. Import the plugin
2. Use the plugin

Other components can then use the plugin's features.

### Scoped styles :id=h-819df990ff37

1. Purpose: apply styles locally to prevent conflicts.
2. Syntax: `<style scoped>`

Concrete example:

```vue
<style lang="less" scoped>
    .demo{
        background-color: pink;
        .atguigu{
            font-size: 40px;
        }
    }
</style>
```

### TodoList example summary :id=h-cf7ca991ea78

1. Component-based coding workflow:

   ```
   (1).拆分静态组件：组件要按照功能点拆分，命名不要与html元素冲突。

   (2).实现动态组件：考虑好数据的存放位置，数据是一个组件在用，还是一些组件在用：

           1).一个组件在用：放在组件自身即可。

           2). 一些组件在用：放在他们共同的父组件上（<span style="color:red">状态提升</span>）。

   (3).实现交互：从绑定事件开始。
   ```

2. props is suitable for:

   ```
   (1).父组件 ==> 子组件 通信

   (2).子组件 ==> 父组件 通信（要求父先给子一个函数）
   ```

3. Remember when using v-model: its bound value must not come from props, because props must not be modified!

4. If props passes an object, modifying its properties does not cause a Vue error, but is not recommended.

<a id="section-26"></a>

## 2.3 Browser local storage :id=h-d3bd6553c6d5

### Cookie :id=h-e1a7251daccc

Cookies were the earliest proposed local-storage mechanism. Previously, servers could not tell whether two network requests came from the same user; cookies addressed this. A cookie is a string of no more than 4 KB stored in the user's browser. It consists of a Name, a Value, and optional attributes controlling lifetime, security, and scope. Cookies for different domains are independent. The browser decides whether to send a cookie according to Domain, Path, Secure, SameSite, expiration, request credentials, and other rules; it does not send every cookie for the current domain.

**Cookie characteristics:**

- Once a cookie is created successfully, its name cannot be changed
- Cookies cannot span domain names: cookies for domain a cannot be shared with domain b. This privacy and security property prevents unauthorized retrieval of other sites' cookies.
- Cookie count and size limits depend on the browser; the limit is not universally 20 per domain. A common per-cookie limit is about 4 KiB.
- There are security risks: intercepting a cookie can give access to all session information. Even encryption does not help against replay; an attacker need not understand the cookie if forwarding it achieves the goal.
- Cookies are sent whenever a new page is requested

**Cookies in authentication**

On a client's first request, the server sends an authentication cookie in a response header, and the client automatically stores it in the browser.

On subsequent server requests, the browser automatically sends authentication cookies in request headers so the server can identify the client.

![Insert image description here](Resources/vue2/e29b7e0bef784bc5b6b8ed50b0d8a509.png)

**Cookies are not secure**

Cookies reside in the browser, which also provides a cookie read/write API, so they are easy to forge and are not secure. Servers therefore should not send important private data to browsers in cookies.

> Note: never store important private data in cookies, such as user identity information or passwords!

### Session :id=h-0d0817606198

A session is another mechanism for tracking client state. Cookies reside in the client browser, whereas sessions reside on the server. When a browser accesses the server, it records client information there in some form: this is a session. Later visits can look up the client's state from that session. A session is not a special cookie; a cookie can hold the identifier used to look up a server-side session. Cookies are client-side; sessions are server-side.

**Why use sessions?** Cookies are stored on users' devices, have limited capacity, and, most importantly, are visible and freely editable by users, which is unsafe. Sessions emerged as a new storage mechanism to provide secure information that is conveniently readable throughout the application.

**How sessions work** On the first request, the server creates and stores a session, sending its ID to the client in a cookie. On subsequent requests, the browser automatically carries that cookie, the session-data ID, to the server.

> Diagram:

![Insert image description here](Resources/vue2/18768cbd3ece4e73b98c8e3be8cec422.png)

> A simple way to understand a session is as a table whose contents are looked up using the value passed in a cookie.

**Standard session workflow**

![Insert image description here](Resources/vue2/10472e8e03924340a452523ae678de02.png)

I demonstrated session usage in detail in node.js; see another blog post: [https://blog.csdn.net/hangao233/article/details/123089029](https://blog.csdn.net/hangao233/article/details/123089029)

### LocalStorage :id=h-f3bcde9bedac

LocalStorage was introduced in HTML5. When stored information is too large for cookies, LocalStorage becomes useful.

**Advantages of LocalStorage:**

- LocalStorage generally offers 5 MB, allowing more information to be stored.
- LocalStorage is persistent: it survives page closure and remains indefinitely unless explicitly cleared.
- Stored only locally, unlike cookies sent with each HTTP request

**Disadvantages of LocalStorage:**

- Browser compatibility issues: versions below IE8 do not support it
- localStorage is usually available in private browsing, but capacity, lifetime, and restrictions depend on the browser and data may be cleared when private windows close. Handle storage-access exceptions.
- LocalStorage is restricted by the same-origin policy: any difference in port, protocol, or host prevents access.

**Common LocalStorage APIs:**

```js
// See note 1 below.
localStorage.setItem('key', 'value');

// See note 2 below.
let data = localStorage.getItem('key');

// See note 3 below.
localStorage.removeItem('key');

// See note 4 below.
localStorage.clear();

// See note 5 below.
localStorage.key(index)
```

Example explanations:

1. Save data to localStorage
2. Get data from localStorage
3. Remove saved data from localStorage
4. Remove all saved data from localStorage
5. Get the key at an index

**Use cases for LocalStorage:**

- Some sites offer themes. Store the theme information in local LocalStorage and operate on LocalStorage when changing themes.
- A user's browsing information can also be stored in LocalStorage, as can some infrequently changing personal information in local LocalStorage.

### SessionStorage :id=h-11f276f06e86

SessionStorage and LocalStorage are storage mechanisms introduced in HTML5. SessionStorage mainly holds temporary data for one window or tab: refresh retains it, but closing the window or tab deletes it.

**SessionStorage versus LocalStorage:**

- Both SessionStorage and LocalStorage **store data locally**.
- SessionStorage also follows the same-origin policy, but SessionStorage has a stricter rule: SessionStorage**can be shared only within the same window of the same browser**.
- Automated browsers can read same-origin localStorage and sessionStorage. Do not treat this storage as an anti-scraping or confidentiality mechanism.

**Common SessionStorage APIs:**

```js
// See note 1 below.
sessionStorage.setItem('key', 'value');

// See note 2 below.
let data = sessionStorage.getItem('key');

// See note 3 below.
sessionStorage.removeItem('key');

// See note 4 below.
sessionStorage.clear();

// See note 5 below.
sessionStorage.key(index)
```

Example explanations:

1. Save data to sessionStorage
2. Get data from sessionStorage
3. Remove saved data from sessionStorage
4. Remove all saved data from sessionStorage
5. Get the key at an index

**Use cases for SessionStorage**

Since SessionStorage is temporary, it can hold guest-login information and temporary browsing history. Closing the site removes this information.

> Concrete example:

**localStorage**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>localStorage</title>
    </head>
    <body>
        <h2>localStorage</h2>
        <button onclick="saveData()">点我保存一个数据</button>
        <button onclick="readData()">点我读取一个数据</button>
        <button onclick="deleteData()">点我删除一个数据</button>
        <button onclick="deleteAllData()">点我清空一个数据</button>

        <script type="text/javascript" >
            let p = {name:'张三',age:18}

            function saveData(){
                localStorage.setItem('msg','hello!!!')
                localStorage.setItem('msg2',666)
                // See note 1 below.
                localStorage.setItem('person',JSON.stringify(p))
            }
            function readData(){
                console.log(localStorage.getItem('msg'))
                console.log(localStorage.getItem('msg2'))

                const result = localStorage.getItem('person')
                console.log(JSON.parse(result))

                // console.log(localStorage.getItem('msg3'))
            }
            function deleteData(){
                localStorage.removeItem('msg2')
            }
            function deleteAllData(){
                localStorage.clear()
            }
        </script>
    </body>
</html>
```

Example explanations:

1. Convert to a JSON object and store it

**sessionStorage**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>sessionStorage</title>
    </head>
    <body>
        <h2>sessionStorage</h2>
        <button onclick="saveData()">点我保存一个数据</button>
        <button onclick="readData()">点我读取一个数据</button>
        <button onclick="deleteData()">点我删除一个数据</button>
        <button onclick="deleteAllData()">点我清空一个数据</button>

        <script type="text/javascript" >
            let p = {name:'张三',age:18}

            function saveData(){
                sessionStorage.setItem('msg','hello!!!')
                sessionStorage.setItem('msg2',666)
                // See note 1 below.
                sessionStorage.setItem('person',JSON.stringify(p))
            }
            function readData(){
                console.log(sessionStorage.getItem('msg'))
                console.log(sessionStorage.getItem('msg2'))

                const result = sessionStorage.getItem('person')
                console.log(JSON.parse(result))

                // console.log(sessionStorage.getItem('msg3'))
            }
            function deleteData(){
                sessionStorage.removeItem('msg2')
            }
            function deleteAllData(){
                sessionStorage.clear()
            }
        </script>
    </body>
</html>
```

Example explanations:

1. Convert to a JSON string and store it

<a id="section-27"></a>

## 2.4 Custom component events :id=h-4939c07521b4

Custom events are a component-communication mechanism suitable for <strong style="color:red">child ===> parent</strong>.

**Use case**

A is the parent and B the child. For B to send data to A, bind a custom event to B in A (<span style="color:red">the callback belongs in A</span>).

**Bind a custom event:**

First approach, in the parent: `<Demo @atguigu="test"/>` or `<Demo v-on:atguigu="test"/>`

> Concrete code

App.vue

```html
<template>
    <div class="app">
        <!-- See note 1 below. -->
        <Student @atguigu="getStudentName"/>
    </div>
</template>

<script>
    import Student from './components/Student'

    export default {
        name:'App',
        components:{Student},
        data() {
            return {
                msg:'你好啊！',
                studentName:''
            }
        },
        methods: {
            getStudentName(name,...params){
                console.log('App收到了学生名：',name,params)
                this.studentName = name
            }
        }
    }
</script>

<style scoped>
    .app{
        background-color: gray;
        padding: 5px;
    }
</style>

```

Example explanations:

1. Bind a custom event to the child from the parent to pass data from child to parent (first syntax: @ or v-on).

Student.vue

```html
<template>
    <div class="student">
        <button @click="sendStudentlName">把学生名给App</button>
    </div>
</template>

<script>
    export default {
        name:'Student',
        data() {
            return {
                name:'张三',
            }
        },
        methods: {
            sendStudentlName(){
                // See note 1 below.
                this.$emit('atguigu',this.name,666,888,900)
            }
        },
    }
</script>

<style lang="less" scoped>
    .student{
        background-color: pink;
        padding: 5px;
        margin-top: 30px;
    }
</style>

```

Example explanations:

1. Trigger the Student instance's atguigu event

Second approach, in the parent:

`this.$refs.xxx.$on()` is more flexible; for example, it can be used with a timer.

> Concrete code

App.vue

```html
<template>
    <div class="app">
        <!-- See note 1 below. -->
        <Student ref="student"/>
    </div>
</template>

<script>
    import Student from './components/Student'

    export default {
        name:'App',
        components:{Student},
        data() {
            return {
                studentName:''
            }
        },
        methods: {
            getStudentName(name,...params){
                console.log('App收到了学生名：',name,params)
                this.studentName = name
            },
        },
        mounted() {
            this.$refs.student.$on('atguigu',this.getStudentName) // See note 2 below.
            // See note 3 below.
        },
    }
</script>

<style scoped>
    .app{
        background-color: gray;
        padding: 5px;
    }
</style>

```

Example explanations:

1. Bind a custom event to the child from the parent to pass data from child to parent (second syntax: ref).
2. Bind a custom event
3. this.$refs.student.$once('atguigu',this.getStudentName) // Bind a one-time custom event

Student.vue

```html
<template>
    <div class="student">
        <button @click="sendStudentlName">把学生名给App</button>
    </div>
</template>

<script>
    export default {
        name:'Student',
        data() {
            return {
                name:'张三',
            }
        },
        methods: {
            sendStudentlName(){
                // See note 1 below.
                this.$emit('atguigu',this.name,666,888,900)
            }
        },
    }
</script>

<style lang="less" scoped>
    .student{
        background-color: pink;
        padding: 5px;
        margin-top: 30px;
    }
</style>

```

Example explanations:

1. Trigger the Student instance's atguigu event

> To trigger a custom event only once, use the `once` modifier or `$once` method.
>
> Trigger a custom event: `this.$emit('atguigu',数据)`
>
> Use this.$emit() to pass data from child to parent

**Unbind a custom event**`this.$off('atguigu')`

> Code

```js
this.$off('atguigu') // See note 1 below.
// See note 2 below.
// See note 3 below.
```

Example explanations:

1. Unbind one custom event
2. this.$off(\['atguigu','demo']) // Unbind multiple custom events
3. this.$off() // Unbind all custom events

**Native DOM events can also be bound to components using the `native` modifier.**

> Code

```vue
<!-- See note 1 below. -->
<Student ref="student" @click.native="show"/>
```

Example explanations:

1. Bind a custom event to the child from the parent to pass data from child to parent (second syntax: ref).

> Note: when binding through `this.$refs.xxx.$on('atguigu',回调)`, the callback must <span style="color:red">either be configured in methods</span> <span style="color:red">or use an arrow function</span>, otherwise this will be wrong!

<a id="section-28"></a>

## 2.5 Global event bus :id=h-222cce5d5a54

1. A communication mechanism suitable for <span style="color:red">any components</span>.

2. Install a global event bus:

   ```js
   new Vue({
       /* Other Vue options can go here. */
       beforeCreate() {
           Vue.prototype.$bus = this // See note 1 below.
       },
       /* Other Vue options can go here. */
   })
   ```

Example explanations:

1. Install the global event bus; $bus is the current application's vm

2. Use the event bus:

   1. Receive data: for A to receive data, bind a custom event to $bus in A; the <span style="color:red">callback stays in A itself.</span>

      ```js
      ```

const componentOptions = {
methods:{
demo(data){ console.log(data); }
},
mounted() {
this.$bus.$on('xxxx',this.demo)
}
};
\`\`\`

2. Provide data: `this.$bus.$emit('xxxx',数据)`

3. Prefer using $off in the beforeDestroy hook to unbind events <span style="color:red">used by the current component</span>.

> Example code

School.vue

```html
<template>
    <div class="school">
        <h2>学校名称：{{name}}</h2>
        <h2>学校地址：{{address}}</h2>
    </div>
</template>

<script>
    export default {
        name:'School',
        data() {
            return {
                name:'尚硅谷',
                address:'北京',
            }
        },
        methods: {
            demo(data) {
                console.log('我是School组件，收到了数据',data)
            }
        },
        mounted() {
            // console.log('School',this)
            this.$bus.$on('hello',this.demo)
        },
        beforeDestroy() {
            this.$bus.$off('hello', this.demo)
        },
    }
</script>

<style scoped>
    .school{
        background-color: skyblue;
        padding: 5px;
    }
</style>
```

Student.vue

```html
<template>
    <div class="student">
        <h2>学生姓名：{{name}}</h2>
        <h2>学生性别：{{sex}}</h2>
        <button @click="sendStudentName">把学生名给School组件</button>
    </div>
</template>

<script>
    export default {
        name:'Student',
        data() {
            return {
                name:'张三',
                sex:'男',
            }
        },
        mounted() {
            // console.log('Student',this.x)
        },
        methods: {
            sendStudentName(){
                this.$bus.$emit('hello',this.name)
            }
        },
    }
</script>

<style lang="less" scoped>
    .student{
        background-color: pink;
        padding: 5px;
        margin-top: 30px;
    }
</style>

```

![Insert image description here](Resources/vue2/86238df578224c798ab772db2798b85c.png)

![Insert image description here](Resources/vue2/5aeffb62c4f3462ea9b5fb7b98a1b0da.png)

<a id="section-29"></a>

## 2.6 Message subscription and publication :id=h-1679fce16b39

1. A communication mechanism suitable for <span style="color:red">any components</span>.

2. Usage steps:

   1. Install pubsub: `npm i pubsub-js`

   2. Import: `import pubsub from 'pubsub-js'`

   3. Receive data: A subscribes to messages in A; the <span style="color:red">subscription callback stays in A itself.</span>

      ```js
      ```

const componentOptions = {
methods:{
demo(data){/\* Add other options here. \*/}
},
mounted() {
this.pid = pubsub.subscribe('xxx',this.demo) // See note 1 below.
}
};
\`\`\`

Example explanations:

1. Subscribe to messages

   4. Provide data: `pubsub.publish('xxx',数据)`

   5. Prefer using `PubSub.unsubscribe(pid)` in the beforeDestroy hook to <span style="color:red">unsubscribe.</span>

> Example code

Subscribe to messages

**School.vue**

```html
<template>
    <div class="school">
        <h2>学校名称：{{name}}</h2>
        <h2>学校地址：{{address}}</h2>
    </div>
</template>

<script>
    import pubsub from 'pubsub-js'
    export default {
        name:'School',
        data() {
            return {
                name:'尚硅谷',
                address:'北京',
            }
        },
        mounted() {
            // console.log('School',this)
            /* See note 1 below. */
            this.pubId = pubsub.subscribe('hello',(msgName,data)=>{
                console.log(this)
                // See note 2 below.
            })
        },
        beforeDestroy() {
            // this.$bus.$off('hello', this.demo)
            pubsub.unsubscribe(this.pubId)
        },
    }
</script>

<style scoped>
    .school{
        background-color: skyblue;
        padding: 5px;
    }
</style>
```

Example explanations:

1. this.$bus.$on('hello',(data)=>{; console.log('I am the School component and received data',data); })
2. console.log('Someone published hello; its callback has run',msgName,data)

Publish a message

**Student.vue**

```html
<template>
    <div class="student">
        <h2>学生姓名：{{name}}</h2>
        <h2>学生性别：{{sex}}</h2>
        <button @click="sendStudentName">把学生名给School组件</button>
    </div>
</template>

<script>
    import pubsub from 'pubsub-js'
    export default {
        name:'Student',
        data() {
            return {
                name:'张三',
                sex:'男',
            }
        },
        mounted() {
            // console.log('Student',this.x)
        },
        methods: {
            sendStudentName(){
                // this.$bus.$emit('hello',this.name)
                pubsub.publish('hello',666)
            }
        },
    }
</script>

<style lang="less" scoped>
    .student{
        background-color: pink;
        padding: 5px;
        margin-top: 30px;
    }
</style>

```

<a id="section-30"></a>

## 2.7 nextTick :id=h-57b5575babdb

1. Syntax: `this.$nextTick(回调函数)`
2. Purpose: run the specified callback after the next DOM update finishes.
3. When to use it: after changing data, operations based on the updated DOM must run in the nextTick callback.

Concrete example

```js
this.$nextTick(() => {
    this.$refs.inputTitle.focus();
});
```

<a id="section-31"></a>

## 2.8 Transitions and animations wrapped by Vue :id=h-3bd90532b19e

1. Purpose: add style classes at appropriate times when inserting, updating, or removing DOM elements.

2. Diagram: ![Insert image description here](Resources/vue2/9ce811248ee34fb8aa96fa0d1e6e2747.png)

3. Syntax:

   1. Prepare styles:

      - Element entrance styles:
        1. v-enter: entrance starting point
        2. v-enter-active: during entrance
        3. v-enter-to: entrance endpoint
      - Element exit styles:
        1. v-leave: exit starting point
        2. v-leave-active: during exit
        3. v-leave-to: exit endpoint

   2. Wrap transitioning elements in `<transition>` and configure name:

      ```html
      <transition name="hello">
          <h1 v-show="isShow">你好啊！</h1>
      </transition>
      ```

   3. Note: transitions involving multiple elements require `<transition-group>`, with a `key` on every element.

Concrete example (single-element transition)

```html
<template>
    <div>
        <button @click="isShow = !isShow">显示/隐藏</button>
        <transition appear>
            <h1 v-show="isShow">你好啊！</h1>
        </transition>
    </div>
</template>

<script>
    export default {
        name:'Test',
        data() {
            return {
                isShow:true
            }
        },
    }
</script>

<style scoped>
    h1{
        background-color: orange;
    }

    .v-enter-active{
        animation: move 0.5s linear;
    }

    .v-leave-active{
        animation: move 0.5s linear reverse;
    }

    @keyframes move {
        from{
            transform: translateX(-100%);
        }
        to{
            transform: translateX(0px);
        }
    }
</style>
```

> name allows different elements to have different animation effects

```html

<template>
    <div>
        <button @click="isShow = !isShow">显示/隐藏</button>
        <transition name="hello" appear>
            <h1 v-show="isShow">你好啊！</h1>
        </transition>
    </div>
</template>

<script>
    export default {
        name:'Test',
        data() {
            return {
                isShow:true
            }
        },
    }
</script>

<style scoped>
    h1{
        background-color: orange;
    }

    .hello-enter-active{
        animation: move 0.5s linear;
    }

    .hello-leave-active{
        animation: move 0.5s linear reverse;
    }

    @keyframes move {
        from{
            transform: translateX(-100%);
        }
        to{
            transform: translateX(0px);
        }
    }
</style>
```

Concrete example (multiple-element transitions)

```html
<template>
    <div>
        <button @click="isShow = !isShow">显示/隐藏</button>
        <transition-group name="hello" appear>
            <h1 v-show="!isShow" key="1">你好啊！</h1>
            <h1 v-show="isShow" key="2">尚硅谷！</h1>
        </transition-group>
    </div>
</template>

<script>
    export default {
        name:'Test',
        data() {
            return {
                isShow:true
            }
        },
    }
</script>

<style scoped>
    h1{
        background-color: orange;
    }
    /* See note 1 below. */
    .hello-enter,.hello-leave-to{
        transform: translateX(-100%);
    }
    .hello-enter-active,.hello-leave-active{
        transition: 0.5s linear;
    }
    /* See note 2 below. */
    .hello-enter-to,.hello-leave{
        transform: translateX(0);
    }
</style>
```

Example explanations:

1. Entrance start and exit end
2. Entrance end and exit start

> Third-party library example (optional reading; not important here). Library: Animate.css. Install: npm i animate.css. Import: import 'animate.css'.

```html
<template>
    <div>
        <button @click="isShow = !isShow">显示/隐藏</button>
        <transition-group
            appear
            name="animate__animated animate__bounce"
            enter-active-class="animate__swing"
            leave-active-class="animate__backOutUp"
        >
            <h1 v-show="!isShow" key="1">你好啊！</h1>
            <h1 v-show="isShow" key="2">尚硅谷！</h1>
        </transition-group>
    </div>
</template>

<script>
    import 'animate.css'
    export default {
        name:'Test',
        data() {
            return {
                isShow:true
            }
        },
    }
</script>

<style scoped>
    h1{
        background-color: orange;
    }
</style>
```

<a id="section-32"></a>

## 2.9 Configure a proxy in Vue CLI :id=h-e1b1613463f0

This can solve cross-origin issues. ![Insert image description here](Resources/vue2/01ae5e73323a4c83b097ea9705c90dbf.png)

> AJAX is a frontend technology: it needs a browser, hence window and XHR, to send requests. Communication between servers can use ordinary HTTP requests.

### Approach 1 :id=h-31b8201e30a9

```
在vue.config.js中添加如下配置：
```

```js
devServer:{
  proxy:"http://localhost:5000"
}
```

Explanation:

1. Advantage: simple configuration; requests go directly to the frontend (8080).
2. Disadvantage: cannot configure multiple proxies or flexibly control whether requests use a proxy.
3. Behavior: with this proxy configuration, requests for resources absent from the frontend are forwarded to the server; frontend resources take precedence.

### Approach 2 :id=h-ec74fd4a626c

```
编写vue.config.js配置具体代理规则：
```

```js
module.exports = {
    devServer: {
      proxy: {
      '/api1': {// See note 1 below.
        target: 'http://localhost:5000',// See note 2 below.
        changeOrigin: true,
        pathRewrite: {'^/api1': ''}// See note 3 below.
      },
      '/api2': {// See note 4 below.
        target: 'http://localhost:5001',// See note 5 below.
        changeOrigin: true,
        pathRewrite: {'^/api2': ''}
      }
    }
  }
}
/* See note 6 below. */
```

Example explanations:

1. Match every request path starting with '/api1'
2. Base path of the proxy target
3. The proxy removes /api1 when forwarding the request address to the real server
4. Match every request path starting with '/api2'
5. Base path of the proxy target
6. With changeOrigin=true, the server receives host: localhost:5000; with changeOrigin=false, it receives host: localhost:8080. changeOrigin defaults to true.

Explanation:

1. Advantage: multiple proxies and flexible control over whether requests use them.
2. Disadvantage: slightly more complex configuration; resource requests need a prefix.

<a id="section-33"></a>

## 2.10 Slots :id=h-75eccf4cdc99

1. Purpose: let parents insert HTML at specified child positions. This is also component communication, suitable for <strong style="color:red">parent ===> child</strong>.

2. Categories: default, named, and scoped slots

3. Usage:

   1. Default slot:

      ```html
      父组件中：
              <Category>
                 <div>html结构1</div>
              </Category>
      子组件中：
              <template>
                  <div>
                     <!-- See note 1 below. -->
                     <slot>插槽默认内容...</slot>
                  </div>
              </template>
      ```

Example explanations:

1. Define a slot

   2. Named slots:

      ```html
      父组件中：
              <Category>
                  <template slot="center">
                    <div>html结构1</div>
                  </template>

                  <template v-slot:footer>
                     <div>html结构2</div>
                  </template>
              </Category>
      子组件中：
              <template>
                  <div>
                     <!-- See note 1 below. -->
                     <slot name="center">插槽默认内容...</slot>
                     <slot name="footer">插槽默认内容...</slot>
                  </div>
              </template>
      ```

Example explanations:

1. Define a slot

   3. Scoped slots:

      1. Understanding: <span style="color:red">data belongs to the child, but the component's user, the parent, determines the structure generated from it.</span> Here games belongs to Category (child), while App (parent) decides the rendered structure.

      2. Concrete implementation:

         ```html
         父组件中：
                 <Category>
                     <template scope="scopeData">
                         <!-- See note 1 below. -->
                         <ul>
                             <li v-for="g in scopeData.games" :key="g">{{g}}</li>
                         </ul>
                     </template>
                 </Category>

                 <Category>
                     <template slot-scope="scopeData">
                         <!-- See note 2 below. -->
                         <h4 v-for="g in scopeData.games" :key="g">{{g}}</h4>
                     </template>
                 </Category>
         子组件中：
                 <template>
                     <div>
                     <!-- See note 3 below. -->
                         <slot :games="games"></slot>
                     </div>
                 </template>

                 <script>
                     export default {
                         name:'Category',
                         props:['title'],
                         // See note 4 below.
                         data() {
                             return {
                                 games:['红色警戒','穿越火线','劲舞团','超级玛丽']
                             }
                         },
                     }
                 </script>
         ```

Example explanations:

1. Generates a ul list
2. Generates h4 headings
3. Data binding passes child data to the parent
4. The data belongs to the child itself

<a id="section-34"></a>

# 3. VUEX :id=h-c27862ebda15

Principle diagram:

![Insert image description here](Resources/vue2/b892bbf299b94d1db68bf657b5e0746a.png)

<a id="section-35"></a>

## 3.1 Concept :id=h-e9270bf4ee42

```
    在Vue中实现集中式状态（数据）管理的一个Vue插件，对vue应用中多个组件的共享状态进行集中式的管理（读/写），也是一种组件间通信的方式，且适用于任意组件间通信。
```

<a id="section-36"></a>

## 3.2 When to use it :id=h-66423436124d

```
    多个组件需要共享数据时
```

<a id="section-37"></a>

## 3.3 Set up Vuex :id=h-c1efe3d2143d

1. Create file: `src/store/index.js`

   ```js
   // See note 1 below.
   import Vue from 'vue'
   // See note 2 below.
   import Vuex from 'vuex'
   // See note 3 below.
   Vue.use(Vuex)

   // See note 4 below.
   const actions = {}
   // See note 5 below.
   const mutations = {}
   // See note 6 below.
   const state = {}

   // See note 7 below.
   export default new Vuex.Store({
       actions,
       mutations,
       state
   })
   ```

Example explanations:

1. Import the Vue core library

2. Import Vuex

3. Apply the Vuex plugin

4. Prepare actions to respond to user actions in components

5. Prepare mutations to modify data in state

6. Prepare state to hold concrete data

7. Create and export the store

8. Pass the `store` option when creating vm in `main.js`

   ```js
   /* Other imports can go here. */
   // See note 1 below.
   import store from './store'
   /* Other imports can go here. */

   // See note 2 below.
   new Vue({
       el:'#app',
       render: h => h(App),
       store
   })
   ```

Example explanations:

1. Import the store
2. Create vm

<a id="section-38"></a>

## 3.4 Basic usage :id=h-67b4612fb71b

1. Initialize data and configure `actions` and `mutations` in `store.js`

   ```js
   // See note 1 below.
   import Vue from 'vue'
   // See note 2 below.
   import Vuex from 'vuex'
   // See note 3 below.
   Vue.use(Vuex)

   const actions = {
       // See note 4 below.
       jia(context,value){
           // See note 5 below.
           context.commit('JIA',value)
       },
   }

   const mutations = {
       // See note 6 below.
       JIA(state,value){
           // See note 7 below.
           state.sum += value
       }
   }

   // See note 8 below.
   const state = {
      sum:0
   }

   // See note 9 below.
   export default new Vuex.Store({
       actions,
       mutations,
       state,
   })
   ```

Example explanations:

1. Import the Vue core library

2. Import Vuex

3. Use Vuex

4. Respond to the component's add action

5. console.log('jia in actions was called',miniStore,value)

6. Perform addition

7. console.log('JIA in mutations was called',state,value)

8. Initialize data

9. Create and export the store

10. Read Vuex data in a component: `$store.state.sum`

11. Modify Vuex data in a component: `$store.dispatch('action中的方法名',数据)` or `$store.commit('mutations中的方法名',数据)`

    > Note: without network requests or other business logic, components may skip actions and call `commit` directly instead of `dispatch`.

Concrete example:

index.js

```js
// See note 1 below.
import Vue from 'vue'
// See note 2 below.
import Vuex from 'vuex'
// See note 3 below.
Vue.use(Vuex)

// See note 4 below.
const actions = {
    /* See note 5 below. */
    jiaOdd(context,value){
        console.log('actions中的jiaOdd被调用了')
        if(context.state.sum % 2){
            context.commit('JIA',value)
        }
    },
    jiaWait(context,value){
        console.log('actions中的jiaWait被调用了')
        setTimeout(()=>{
            context.commit('JIA',value)
        },500)
    }
}
// See note 6 below.
const mutations = {
    JIA(state,value){
        console.log('mutations中的JIA被调用了')
        state.sum += value
    },
    JIAN(state,value){
        console.log('mutations中的JIAN被调用了')
        state.sum -= value
    }
}
// See note 7 below.
const state = {
    sum:0 // See note 8 below.
}

// See note 9 below.
export default new Vuex.Store({
    actions,
    mutations,
    state,
})
```

Example explanations:

1. This file creates Vuex's central store, in Vuex
2. Import Vuex
3. Apply the Vuex plugin
4. Prepare actions to respond to component actions
5. jia(context,value){; console.log('jia in actions was called'); context.commit('JIA',value); },; jian(context,value){; console.log('jian in actions was called'); context.commit('JIAN',value); },
6. Prepare mutations for manipulating data (state)
7. Prepare state to store data
8. Current sum
9. Create and export the store

Count.vue

```html
<template>
    <div>
        <h1>当前求和为：{{$store.state.sum}}</h1>
        <select v-model.number="n">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
        <button @click="incrementOdd">当前求和为奇数再加</button>
        <button @click="incrementWait">等一等再加</button>
    </div>
</template>

<script>
    export default {
        name:'Count',
        data() {
            return {
                n:1, // See note 1 below.
            }
        },
        methods: {
            increment(){
                // See note 2 below.
                this.$store.commit('JIA',this.n)
            },
            decrement(){
                // See note 3 below.
                this.$store.commit('JIAN',this.n)
            },
            incrementOdd(){
                // See note 4 below.
                this.$store.dispatch('jiaOdd',this.n)
            },
            incrementWait(){
                // See note 5 below.
                this.$store.dispatch('jiaWait',this.n)
            },
        },
        mounted() {
            console.log('Count',this)
        },
    }
</script>

<style lang="css">
    button{
        margin-left: 5px;
    }
</style>
```

Example explanations:

1. Number selected by the user
2. commit operates on mutations
3. commit operates on mutations
4. dispatch operates on actions
5. dispatch operates on actions

<a id="section-39"></a>

## 3.5 Using getters :id=h-82703922c5ef

1. Concept: use getters to process state data before using it.

2. Add `getters` configuration in `store.js`

   ```js
   /* Add other options here. */
   const getters = {
       bigSum(state){
           return state.sum * 10
       }
   }

   // See note 1 below.
   export default new Vuex.Store({
       /* Add other options here. */
       getters
   })
   ```

Example explanations:

1. Create and export the store

2. Read data in the component: `$store.getters.bigSum`

<a id="section-40"></a>

## 3.6 Using the four map methods :id=h-929b2578a959

Import

```js
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
```

1. The <strong>mapState method</strong> maps data from `state` to computed properties.

   ```js
   ```

const componentOptions = {
computed: {
// See note 1 below.
...mapState({sum:'sum',school:'school',subject:'subject'}),

```
   // See note 2 below.
   ...mapState(['sum','school','subject']),
```

},
};

````

示例说明：

1. 借助mapState生成计算属性：sum、school、subject（对象写法）
2. 借助mapState生成计算属性：sum、school、subject（数组写法）


2. <strong>mapGetters方法：</strong>用于帮助我们映射```getters```中的数据为计算属性

```js
const componentOptions = {
computed: {
    // See note 1 below.
    ...mapGetters({bigSum:'bigSum'}),

    // See note 2 below.
    ...mapGetters(['bigSum'])
},
};
````

Example explanations:

1. Use mapGetters to generate computed property bigSum (object syntax)

2. Use mapGetters to generate computed property bigSum (array syntax)

3. The <strong>mapActions method</strong> generates methods interacting with `actions`, namely functions containing `$store.dispatch(xxx)`.

   ```js
   ```

const componentOptions = {
methods:{
// See note 1 below.
...mapActions({incrementOdd:'jiaOdd',incrementWait:'jiaWait'}),

```
   // See note 2 below.
   ...mapActions(['jiaOdd','jiaWait'])
```

}
};

````

示例说明：

1. 靠mapActions生成：incrementOdd、incrementWait（对象形式）
2. 靠mapActions生成：incrementOdd、incrementWait（数组形式）


4. <strong>mapMutations方法：</strong>用于帮助我们生成与```mutations```对话的方法，即：包含```$store.commit(xxx)```的函数

```js
const componentOptions = {
methods:{
    // See note 1 below.
    ...mapMutations({increment:'JIA',decrement:'JIAN'}),

    // See note 2 below.
    ...mapMutations(['JIA','JIAN']),
}
};
````

Example explanations:

1. Use mapActions to generate increment and decrement (object syntax)
2. Use mapMutations to generate JIA and JIAN (object syntax)

> Note: when mapActions or mapMutations needs arguments, pass them in the template event binding; otherwise the argument is the event object.

Concrete example:

```html
<template>
  <div>
    <h1>当前求和为：{{ sum }}</h1>
    <h3>当前求和放大10倍为：{{ bigSum }}</h3>
    <h3>年龄：{{ age }}</h3>
    <h3>姓名：{{name}}</h3>
    <select v-model.number="n">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <!-- See note 1 below. -->
    <button @click="increment(n)">+</button>
    <button @click="decrement(n)">-</button>
    <button @click="incrementOdd(n)">当前求和为奇数再加</button>
    <button @click="incrementWait(n)">等一等再加</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: "Count",
  data() {
    return {
      n: 1, // See note 2 below.
    };
  },
  computed: {
    ...mapState(['sum', 'age', 'name']),
    ...mapGetters(['bigSum'])
  },
  methods: {
    ...mapActions({incrementOdd: 'sumOdd', incrementWait: 'sumWait'}),
    ...mapMutations({increment: 'sum', decrement: 'reduce'})
  },
  mounted() {
    console.log("Count", this);
  },
};
</script>

<style lang="css">
button {
  margin-left: 5px;
}
</style>

```

Example explanations:

1. When using mapActions and mapMutations, pass arguments explicitly
2. Number selected by the user

<a id="section-41"></a>

## 3.7 Modules and namespaces :id=h-e508d8d01851

1. Purpose: improve maintainability and make data categories clearer.

2. Edit `store.js`

```javascript
const countAbout = {
  namespaced: true, // See note 1 below.
  state: { sum: 0, school: '尚硅谷', subject: '前端' },
  mutations: {
    JIA(state, amount) { state.sum += amount; },
    JIAN(state, amount) { state.sum -= amount; }
  },
  actions: {
    jiaOdd({ state, commit }, amount) {
      if (state.sum % 2 !== 0) commit('JIA', amount);
    },
    jiaWait({ commit }, amount) {
      return new Promise(resolve => setTimeout(() => {
        commit('JIA', amount);
        resolve();
      }, 1000));
    }
  },
  getters: {
    bigSum(state) { return state.sum * 10; }
  }
};

const personAbout = {
  namespaced: true, // See note 2 below.
  state: { list: [] },
  mutations: {
    ADD_PERSON(state, person) { state.list.push(person); }
  },
  actions: {
    addPersonWang({ commit }, person) {
      if (person.name.startsWith('王')) commit('ADD_PERSON', person);
    }
  },
  getters: {
    firstPersonName(state) { return state.list[0]?.name ?? ''; }
  }
};

const store = new Vuex.Store({
  modules: { countAbout, personAbout }
});
```

Example explanations:

1. Enable namespacing

2. Enable namespacing

3. After enabling namespacing, read state data from a component:

   ```js
   // See note 1 below.
   this.$store.state.personAbout.list
   // See note 2 below.
   // See note 3 below.
   const mappedOptions = {
   ```

computed: {
...mapState('countAbout',\['sum','school','subject'])
}
};

````

示例说明：

1. 方式一：自己直接读取
2. 方式二：借助mapState读取：
3. 用 mapState 取 countAbout 中的state 必须加上 'countAbout'


4. 开启命名空间后，组件中读取getters数据：

```js
// See note 1 below.
this.$store.getters['personAbout/firstPersonName']
// See note 2 below.
const mappedOptions = {
computed: {
 ...mapGetters('countAbout',['bigSum'])
}
};
````

Example explanations:

1. Approach 1: read directly

2. Option 2: read using mapGetters:

3. After enabling namespacing, call dispatch from a component.

   ```js
   // See note 1 below.
   this.$store.dispatch('personAbout/addPersonWang',person)
   // See note 2 below.
   const mappedOptions = {
   ```

methods: {
...mapActions('countAbout',{incrementOdd:'jiaOdd',incrementWait:'jiaWait'})
}
};

````

示例说明：

1. 方式一：自己直接dispatch
2. 方式二：借助mapActions：


6. 开启命名空间后，组件中调用commit

```js
// See note 1 below.
this.$store.commit('personAbout/ADD_PERSON',person)
// See note 2 below.
const mappedOptions = {
methods: {
 ...mapMutations('countAbout',{increment:'JIA',decrement:'JIAN'})
}
};
````

Example explanations:

1. Option 1: call commit directly
2. Option 2: use mapMutations:

Worked example:
count.js

```js
// See note 1 below.
export default {
    namespaced:true,
    actions:{
        jiaOdd(context,value){
            console.log('actions中的jiaOdd被调用了')
            if(context.state.sum % 2){
                context.commit('JIA',value)
            }
        },
        jiaWait(context,value){
            console.log('actions中的jiaWait被调用了')
            setTimeout(()=>{
                context.commit('JIA',value)
            },500)
        }
    },
    mutations:{
        JIA(state,value){
            console.log('mutations中的JIA被调用了')
            state.sum += value
        },
        JIAN(state,value){
            console.log('mutations中的JIAN被调用了')
            state.sum -= value
        },
    },
    state:{
        sum:0, // See note 2 below.
        school:'尚硅谷',
        subject:'前端',
    },
    getters:{
        bigSum(state){
            return state.sum*10
        }
    },
}
```

Example explanations:

1. Sum-related configuration
2. Current sum

person.js

```js
// See note 1 below.
import axios from 'axios'
import { nanoid } from 'nanoid'
export default {
    namespaced:true,
    actions:{
        addPersonWang(context,value){
            if(value.name.indexOf('王') === 0){
                context.commit('ADD_PERSON',value)
            }else{
                alert('添加的人必须姓王！')
            }
        },
        addPersonServer(context){
            axios.get('https://api.uixsj.cn/hitokoto/get?type=social').then(
                response => {
                    context.commit('ADD_PERSON',{id:nanoid(),name:response.data})
                },
                error => {
                    alert(error.message)
                }
            )
        }
    },
    mutations:{
        ADD_PERSON(state,value){
            console.log('mutations中的ADD_PERSON被调用了')
            state.personList.unshift(value)
        }
    },
    state:{
        personList:[
            {id:'001',name:'张三'}
        ]
    },
    getters:{
        firstPersonName(state){
            return state.personList[0].name
        }
    },
}
```

Example explanations:

1. Personnel-management configuration

index.js

```js
// See note 1 below.
import Vue from 'vue'
// See note 2 below.
import Vuex from 'vuex'
import countOptions from './count'
import personOptions from './person'
// See note 3 below.
Vue.use(Vuex)

// See note 4 below.
export default new Vuex.Store({
    modules:{
        countAbout:countOptions,
        personAbout:personOptions
    }
})
```

Example explanations:

1. This file creates Vuex's central store, in Vuex
2. Import Vuex
3. Apply the Vuex plugin
4. Create and export the store

count.vue

```html
<template>
    <div>
        <h1>当前求和为：{{sum}}</h1>
        <h3>当前求和放大10倍为：{{bigSum}}</h3>
        <h3>我在{{school}}，学习{{subject}}</h3>
        <h3 style="color:red">Person组件的总人数是：{{personList.length}}</h3>
        <select v-model.number="n">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button @click="increment(n)">+</button>
        <button @click="decrement(n)">-</button>
        <button @click="incrementOdd(n)">当前求和为奇数再加</button>
        <button @click="incrementWait(n)">等一等再加</button>
    </div>
</template>

<script>
    import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
    export default {
        name:'Count',
        data() {
            return {
                n:1, // See note 1 below.
            }
        },
        computed:{
            // See note 2 below.
            ...mapState('countAbout',['sum','school','subject']),
            ...mapState('personAbout',['personList']),
            // See note 3 below.
            ...mapGetters('countAbout',['bigSum'])
        },
        methods: {
            // See note 4 below.
            ...mapMutations('countAbout',{increment:'JIA',decrement:'JIAN'}),
            // See note 5 below.
            ...mapActions('countAbout',{incrementOdd:'jiaOdd',incrementWait:'jiaWait'})
        },
        mounted() {
            console.log(this.$store)
        },
    }
</script>

<style lang="css">
    button{
        margin-left: 5px;
    }
</style>

```

Example explanations:

1. Number selected by the user
2. Use mapState to generate computed properties reading state data (array syntax)
3. Use mapGetters to generate computed properties reading getters (array syntax)
4. Use mapMutations to generate methods that call commit to invoke mutations (object syntax)
5. Use mapActions to generate methods that call dispatch to invoke actions (object syntax)

person.vue

```html
<template>
    <div>
        <h1>人员列表</h1>
        <h3 style="color:red">Count组件求和为：{{sum}}</h3>
        <h3>列表中第一个人的名字是：{{firstPersonName}}</h3>
        <input type="text" placeholder="请输入名字" v-model="name">
        <button @click="add">添加</button>
        <button @click="addWang">添加一个姓王的人</button>
        <button @click="addPersonServer">添加一个人，名字随机</button>
        <ul>
            <li v-for="p in personList" :key="p.id">{{p.name}}</li>
        </ul>
    </div>
</template>

<script>
    import {nanoid} from 'nanoid'
    export default {
        name:'Person',
        data() {
            return {
                name:''
            }
        },
        computed:{
            personList(){
                return this.$store.state.personAbout.personList
            },
            sum(){
                return this.$store.state.countAbout.sum
            },
            firstPersonName(){
                return this.$store.getters['personAbout/firstPersonName']
            }
        },
        methods: {
            add(){
                const personObj = {id:nanoid(),name:this.name}
                this.$store.commit('personAbout/ADD_PERSON',personObj)
                this.name = ''
            },
            addWang(){
                const personObj = {id:nanoid(),name:this.name}
                this.$store.dispatch('personAbout/addPersonWang',personObj)
                this.name = ''
            },
            addPersonServer(){
                this.$store.dispatch('personAbout/addPersonServer')
            }
        },
    }
</script>

```

<a id="section-42"></a>

# 4. Routing :id=h-6223adc27b5c

1. Understanding: a route is a key-value mapping; a router manages multiple routes.
2. Frontend routing: the key is a path and the value is a component.

<a id="section-43"></a>

## 4.1 Basic usage :id=h-73fd3f12c2d8

1. Install vue-router: `npm i vue-router@3`

2. Apply the plugin: `Vue.use(VueRouter)`

3. Write router configuration:

   ```js
   // See note 1 below.
   import VueRouter from 'vue-router'
   // See note 2 below.
   import About from '../components/About'
   import Home from '../components/Home'

   // See note 3 below.
   const router = new VueRouter({
       routes:[
           {
               path:'/about',
               component:About
           },
           {
               path:'/home',
               component:Home
           }
       ]
   })

   // See note 4 below.
   export default router
   ```

Example explanations:

1. Import VueRouter

2. Import the Luyou component

3. Create a router instance to manage groups of routing rules

4. Export the router

5. Implement navigation; active-class configures the highlight style

   ```html
   <router-link active-class="active" to="/about">About</router-link>
   ```

6. Specify the display location

   ```html
   <router-view></router-view>
   ```

<a id="section-44"></a>

## 4.2 Points to note :id=h-49a4dd40ec62

1. Route components usually live in `pages`; ordinary components usually live in `components`.
2. Route components “hidden” by navigation are destroyed by default and remounted when needed.
3. Each component has its own `$route` property holding its route information.
4. The application has only one router, accessible through a component's `$router` property.

<a id="section-45"></a>

## 4.3 Nested routes (multiple levels) :id=h-675ddfe7eca1

1. Configure nested routing rules using children:

   ```js
   routes:[
       {
           path:'/about',
           component:About,
       },
       {
           path:'/home',
           component:Home,
           children:[ // See note 1 below.
               {
                   path:'news', // See note 2 below.
                   component:News
               },
               {
                   path:'message',// See note 3 below.
                   component:Message
               }
           ]
       }
   ]
   ```

Example explanations:

1. Configure child routes with children

2. Do not write /news here

3. Do not write /message here

4. Navigate using the complete path:

   ```html
   <router-link to="/home/news">News</router-link>
   ```

5. Specify the display location

   ```html
   <router-view></router-view>
   ```

<a id="section-46"></a>

## 4.4 Route query parameters :id=h-8aa08feb60b5

1. Pass parameters

   ```html
   <!-- See note 1 below. -->
   <router-link :to="/home/message/detail?id=666&title=你好">跳转</router-link>

   <!-- See note 2 below. -->
   <router-link
       :to="{
           path:'/home/message/detail',
           query:{
              id:666,
               title:'你好'
           }
       }"
   >跳转</router-link>
   ```

Example explanations:

1. Navigate with query parameters: string syntax for to

2. Navigate with query parameters: object syntax for to

3. Receive parameters:

   ```html
   $route.query.id
   $route.query.title
   ```

<a id="section-47"></a>

## 4.5 Named routes :id=h-1c5407bc3b5f

1. Purpose: simplify route navigation.

2. How to use it

   1. Name the route:

      ```js
      ```

const route =       {
path:'/demo',
component:Demo,
children:\[
{
path:'test',
component:Test,
children:\[
{
name:'hello', // See note 1 below.
path:'welcome',
component:Hello,
}
]
}
]
};
\`\`\`

Example explanations:

1. Name the route

   2. Simplify navigation:

      ```html
      <!-- See note 1 below. -->
      <router-link to="/demo/test/welcome">跳转</router-link>

      <!-- See note 2 below. -->
      <router-link :to="{name:'hello'}">跳转</router-link>

      <!-- See note 3 below. -->
      <router-link
          :to="{
              name:'hello',
              query:{
                 id:666,
                  title:'你好'
              }
          }"
      >跳转</router-link>
      ```

Example explanations:

1. Before simplification, the complete path is required
2. After simplification, navigate directly by name
3. Simplified syntax with parameters

<a id="section-48"></a>

## 4.6 Route params parameters :id=h-2f88916c7fd5

1. Configure the route and declare received params

   ```js
   ```

const route =    {
path:'/home',
component:Home,
children:\[
{
path:'news',
component:News
},
{
path:'message',
component:Message,
children:\[
{
name:'xiangqing',
path:'detail/:id/:title', // See note 1 below.
component:Detail
}
]
}
]
};

````

示例说明：

1. 使用占位符声明接收params参数


2. 传递参数

```html
<!-- See note 1 below. -->
<router-link :to="/home/message/detail/666/你好">跳转</router-link>

<!-- See note 2 below. -->
<router-link
    :to="{
        name:'xiangqing',
        params:{
           id:666,
            title:'你好'
        }
    }"
>跳转</router-link>
````

Example explanations:

1. Navigate with params: string syntax for to

2. Navigate with params: object syntax for to

   > Important: when passing params using object syntax for to, use name, not the path option!

3. Receive parameters:

   ```js
   $route.params.id
   $route.params.title
   ```

<a id="section-49"></a>

## 4.7 Route props configuration :id=h-4e4f89cdad7a

Purpose: make receiving parameters easier for route components

```js
const route = {
    name:'xiangqing',
    path:'detail/:id',
    component:Detail,

    // See note 1 below.
    // props:{a:900}

    // See note 2 below.
    // props:true

    // See note 3 below.
    props($route) {
        return {
          id: $route.params.id,
          title:$route.query.title,
          a: 1,
          b: 'hello'
        }
    }
};
```

Example explanations:

1. First syntax: props is an object; every key-value pair is passed to Detail through props.
2. Second syntax: props is a boolean; true passes all received params to Detail through props.
3. Third syntax: props is a function; every key-value pair in its returned object is passed to Detail through props.

> A simpler way to write the destination component

Complete code for the destination component

```html
<template>
  <ul>
      <h1>Detail</h1>
      <li>消息编号：{{id}}</li>
      <li>消息标题：{{title}}</li>
      <li>a:{{a}}</li>
      <li>b:{{b}}</li>
  </ul>
</template>

<script>
export default {
    name: 'Detail',
    props: ['id', 'title', 'a', 'b'],
    mounted () {
        console.log(this.$route);
    }
}
</script>

<style>

</style>
```

<a id="section-50"></a>

## 4.8 The replace attribute of `<router-link>` :id=h-d2f9b5a528f5

1. Purpose: control how navigation changes browser history
2. Browser history supports `push` and `replace`: `push` appends an entry, while `replace` replaces the current entry. Route navigation defaults to `push`.
3. Enable `replace` mode: `<router-link replace .......>News</router-link>`

<a id="section-51"></a>

## 4.9 Programmatic navigation :id=h-bda74fe5c6b7

1. Purpose: navigate without `<router-link> ` for greater flexibility

2. Concrete implementation:

   ```js
   // See note 1 below.
   this.$router.push({
       name:'xiangqing',
           params:{
               id:xxx,
               title:xxx
           }
   })

   this.$router.replace({
       name:'xiangqing',
           params:{
               id:xxx,
               title:xxx
           }
   })
   this.$router.forward() // See note 2 below.
   this.$router.back() // See note 3 below.
   this.$router.go() // See note 4 below.
   ```

Example explanations:

1. Two APIs on $router
2. Forward
3. Back
4. Can move both forward and back

<a id="section-52"></a>

## 4.10 Cache route components :id=h-468de23e0eab

1. Purpose: keep hidden route components mounted instead of destroying them.

2. Concrete implementation:

   include here refers to the component name

   ```html
   <keep-alive include="News">
       <router-view></router-view>
   </keep-alive>
   ```

<a id="section-53"></a>

## 4.11 Two new lifecycle hooks :id=h-ab2c62bebae2

Purpose: run when a component cached by KeepAlive becomes active or inactive, not limited to route components. Specific names:

- `activated` runs when the route component becomes active.
- `deactivated` runs when the route component becomes inactive.

> These hooks need the preceding route-component caching; they do not work without cached route components.

<a id="section-54"></a>

## 4.12 Navigation guards :id=h-4e877c542d97

1. Purpose: control access to routes

2. Categories: global, per-route, and in-component guards

3. Global guards:

   ```js
   // See note 1 below.
   router.beforeEach((to,from,next)=>{
       console.log('beforeEach',to,from)
       if(to.meta.isAuth){ // See note 2 below.
           if(localStorage.getItem('school') === 'zhejiang'){ // See note 3 below.
               next() // See note 4 below.
           }else{
               alert('暂无权限查看')
               // next({name:'guanyu'})
           }
       }else{
           next() // See note 5 below.
       }
   })

   // See note 6 below.
   router.afterEach((to,from)=>{
       console.log('afterEach',to,from)
       if(to.meta.title){
           document.title = to.meta.title // See note 7 below.
       }else{
           document.title = 'vue_test'
       }
   })
   ```

Example explanations:

1. Global before guard: runs on initialization and before every route change
2. Determine whether the current route requires access control
3. Specific access-control rules
4. Allow navigation
5. Allow navigation
6. Global after guard: runs on initialization and after every route change
7. Change the page title

   Complete code

```js
// See note 1 below.
import VueRouter from 'vue-router'
// See note 2 below.
import About from '../pages/About.vue'
import Home from '../pages/Home.vue'
import Message from '../pages/Message.vue'
import News from '../pages/News.vue'
import Detail from '../pages/Detail.vue'
// See note 3 below.
const router = new VueRouter({
    routes: [
        {
            path: '/home',
            component: Home,
            meta:{title:'主页'},
            children: [
                {
                    path: 'news',
                    component: News,
                    meta:{isAuth:true,title:'新闻'}
                },
                {
                    path: 'message',
                    name: 'mess',
                    component: Message,
                    meta:{isAuth:true,title:'消息'},
                    children: [
                        {
                            path: 'detail/:id/:title',
                            name: 'xiangqing',
                            component: Detail,
                            meta:{isAuth:true,title:'详情'},
                            props($route) {
                                return {
                                    id: $route.query.id,
                                    title:$route.query.title,
                                    a: 1,
                                    b: 'hello'
                                }
                            }
                        }
                    ]
                }
            ]
        },
        {
            path: '/about',
            component: About,
            meta:{ title: '关于' }
        }
    ]
})

// See note 4 below.
router.beforeEach((to, from, next) => {
    console.log('前置路由守卫', to, from);
    if(to.meta.isAuth) {
        if(localStorage.getItem('school') === 'zhejiang') {
            // See note 5 below.
            next()
        } else {
            alert('学校名不对，无权查看')
        }
    } else {
        next()
    }
})

// See note 6 below.
router.afterEach((to, from) => {
    console.log('后置路由守卫', to, from)
    document.title = to.meta.title || '我的系统'
})

export default router
```

Example explanations:

1. This file creates the router for the entire application

2. Import components

3. Create and export a router

4. Global before navigation guard: called on initialization and before each route change

5. Allow navigation

6. Global after navigation guard: called on initialization and after each route change

7. Per-route guard:

> Write the guard inside a child route in routes

```js
const routeOptions = {
beforeEnter(to,from,next){
    console.log('beforeEnter',to,from)
    if(to.meta.isAuth){ // See note 1 below.
        if(localStorage.getItem('school') === 'atguigu'){
            next()
        }else{
            alert('暂无权限查看');
         next(false);
            // next({name:'guanyu'})
        }
    }else{
        next()
    }
}
};
```

Example explanations:

1. Determine whether the current route requires access control

![Insert image description here](Resources/vue2/d8b1f996e81a48a2a33a41fce71c25d5.png)

5. In-component guards:

> Write guards inside the specific component

```js
const componentOptions = {
// See note 1 below.
beforeRouteEnter (to, from, next) {
},
// See note 2 below.
beforeRouteLeave (to, from, next) {
}
};
```

Example explanations:

1. Enter guard: called when routing rules navigate into this component
2. Leave guard: called when routing rules navigate away from this component

![Insert image description here](Resources/vue2/a1180709cc80417c9266343e7ec1637e.png)

<a id="section-55"></a>

## 4.13 The router's two operating modes :id=h-97de4f68c7f0

1. What is a URL hash? It is # and everything following it.

2. The hash is not included in an HTTP request and is not sent to the server.

3. Hash mode:

   1. The address always contains #, which is less attractive.
   2. When sharing the address through a third-party mobile app, strict validation may mark it invalid.
   3. Better compatibility.

4. History mode:

   1. A clean, attractive address.
   2. Slightly worse compatibility than hash mode.
   3. Production deployment requires backend support to avoid server 404 errors on page refresh.

![Insert image description here](Resources/vue2/f0f05b4791944844a8ea9d496e2710f9.png)

Reference articles:

1. Vue taught by Shangguigu: [https://www.bilibili.com/video/BV1Zy4y1K7SH?p=77\&spm_id_from=pageDriver](https://www.bilibili.com/video/BV1Zy4y1K7SH?p=77\&spm_id_from=pageDriver)
2. Modern JavaScript: [https://zh.javascript.info/](https://zh.javascript.info/)
3. MDN documentation: [https://developer.mozilla.org/zh-CN/docs/Web](https://developer.mozilla.org/zh-CN/docs/Web)
4. I am your superhero [https://juejin.cn/post/6844903895467032589](https://juejin.cn/post/6844903895467032589)
