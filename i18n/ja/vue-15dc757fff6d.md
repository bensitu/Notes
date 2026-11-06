# VUE の基礎 :id=h-9ac703183a88

Vue 2 のバインド、リアクティビティ、コンポーネント、ルーティング、状態管理を体系的に学びます。

**前提知識とバージョン：** HTML、JavaScript、非同期リクエストの基礎知識が必要です。Vue 2 / Vue Router 3 / Vuex 3 を使います。Vue 2 は公式サポートが終了しており、主に既存プロジェクトの理解と保守を目的とします。

**サンプルの使い方：** 全ファイルと実行手順が明示されたプロジェクトを除き、コードブロックは各節の独立した断片です。省略記号や仮の名前は補ってください。誤りと記された行は問題を説明するためのものです。同じ節の代替コードを組み合わせないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://v2.vuejs.org/v2/guide/)

**目次**

- [1. Vue の基礎知識と仕組み](#section-1)
- [1.1 Vue 入門](#section-2)
- [1.2 テンプレート構文](#section-3)
- [1.3 データバインド](#section-4)
- [1.4 el と data の 2 通りの書き方](#section-5)
- [1.5 Vue の MVVM](#section-6)
- [1.6 データプロキシ](#section-7)
- [1.7 イベント処理](#section-8)
- [1.8 キーボードイベント](#section-9)
- [1.9 算出プロパティ](#section-10)
- [1.10 ウォッチャー](#section-11)
- [1.11 スタイルのバインド](#section-12)
- [1.12 条件付きレンダリング](#section-13)
- [1.13 リストのレンダリング](#section-14)
- [1.14 Vue が data を監視する仕組み](#section-15)
- [1.15 フォームデータの収集](#section-16)
- [1.16 フィルター（重点外）](#section-17)
- [1.17 組み込みディレクティブ](#section-18)
- [1.18 カスタムディレクティブ](#section-19)
- [1.19 ライフサイクル](#section-20)
- [1.20 単一ファイルではないコンポーネント](#section-21)
- [1.21 単一ファイルコンポーネント](#section-22)
- [2. Vue のプロジェクト作成ツール、カスタムイベント、スロットなどの応用](#section-23)
- [2.1 プロジェクト作成ツール](#section-24)
- [2.2 Vue の補足知識](#section-25)
- [2.3 ブラウザーのローカルストレージ](#section-26)
- [2.4 コンポーネントのカスタムイベント](#section-27)
- [2.5 グローバルイベントバス](#section-28)
- [2.6 メッセージの購読と発行](#section-29)
- [2.7 nextTick](#section-30)
- [2.8 Vue のトランジションとアニメーション](#section-31)
- [2.9 Vue CLI のプロキシ設定](#section-32)
- [2.10 スロット](#section-33)
- [3. VUEX](#section-34)
- [3.1 概念](#section-35)
- [3.2 使用する場面](#section-36)
- [3.3 Vuex 環境の構築](#section-37)
- [3.4 基本的な使い方](#section-38)
- [3.5 getters の使用](#section-39)
- [3.6 4 つの map ヘルパーの使用](#section-40)
- [3.7 モジュール化と名前空間](#section-41)
- [4. ルーティング](#section-42)
- [4.1 基本的な使い方](#section-43)
- [4.2 注意点](#section-44)
- [4.3 入れ子のルート（多階層ルート）](#section-45)
- [4.4 ルートの query パラメーター](#section-46)
- [4.5 名前付きルート](#section-47)
- [4.6 ルートの params パラメーター](#section-48)
- [4.7 ルートの props 設定](#section-49)
- [4.8 `<router-link>` の replace 属性](#section-50)
- [4.9 プログラムによるナビゲーション](#section-51)
- [4.10 ルートコンポーネントのキャッシュ](#section-52)
- [4.11 2 つの新しいライフサイクルフック](#section-53)
- [4.12 ナビゲーションガード](#section-54)
- [4.13 ルーターの 2 つの動作モード](#section-55)

﻿# Vue の基本的な使い方と仕組みの整理

<a id="section-1"></a>

# 1. Vue の基礎知識と仕組み :id=h-e11991c4bd73

<a id="section-2"></a>

## 1.1 Vue 入門 :id=h-1c84f367c6c6

- Vue を動かすには、設定オブジェクトを渡して Vue インスタンスを作成する必要があります。
- demo コンテナー内のコードは、特別な Vue 構文が加わっている以外は HTML の規則に従います。
- demo コンテナー内のコードを Vue テンプレートと呼びます。
- Vue インスタンスとコンテナーは 1 対 1 で対応します。
- 実際の開発では 1 つの Vue インスタンスをコンポーネントと組み合わせて使います。
- {{xxx}} は Vue の補間式で、data 内のすべてのプロパティを参照できます。
- data のデータが変わると、そのデータを使うページの部分も自動更新されます（Vue のリアクティビティ）。

> 最初のサンプルコード

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

例の説明：

1. コンテナーを用意する
2. Vue の起動時の本番環境に関する案内を無効にする。
3. Vue インスタンスを作成する
4. el は現在の Vue インスタンスの対象コンテナーを指定し、通常は CSS セレクター文字列を使います。
5. data は el のコンテナーで使うデータを保存します。ここではひとまずオブジェクトで指定します。

<a id="section-3"></a>

## 1.2 テンプレート構文 :id=h-e96fd73b52d5

Vue のテンプレート構文には 2 種類あります。

- 補間構文：

  役割：タグ内の内容を処理する

  書き方：{{xxx}}。xxx は JavaScript の式で、data 内のすべてのプロパティを直接参照できます。

- ディレクティブ構文：

  役割：属性、内容、イベントのバインドなど、タグを処理する。

  例：v-bind:href="xxx"、省略形は :href="xxx"。xxx にも JavaScript の式を書き、data 内のすべてのプロパティを直接参照できます。

> コード

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

例の説明：

1. これは Vue ディレクティブでバインドした属性の例です。引用符内には JavaScript の式を書きます。

<a id="section-4"></a>

## 1.3 データバインド :id=h-0543ffa8f7aa

Vue には 2 種類のデータバインドがあります。

- 一方向バインド（v-bind）：data からページにだけデータが流れる。

- 双方向バインド（v-model）：data からページへ、ページから data へもデータが流れる。

  > tips:
  >
  > 1\. 双方向バインドは通常、input や select などのフォーム要素に使います。
  >
  > 2\. Vue 2 の標準フォームは v-model を使い、Vue 3 コンポーネントの v-model:引数 という書き方は使いません。テキスト入力は value/input、チェックボックスは checked/change を基に動作します。

> コード

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

例の説明：

1. 通常の書き方：一方向データバインド
2. 省略形：Vue 2 の標準フォームは v-model を使い、Vue 3 コンポーネントの v-model:引数 という書き方は使いません。テキスト入力は value/input、チェックボックスは checked/change を基に動作します。

<a id="section-5"></a>

## 1.4 el と data の 2 通りの書き方 :id=h-f5b34506063c

el の 2 通りの指定方法

- new Vue のときに el プロパティを設定する。

- 先に Vue インスタンスを作り、vm.$mount('#root') で el を指定する。

> コード

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

例の説明：

1. 1 つ目
2. 2 つ目

data の 2 通りの書き方

- オブジェクト形式

- 関数形式

  > コンポーネントでは data を関数形式にする必要があります。

> コード

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

例の説明：

1. 1 つ目
2. 2 つ目

<a id="section-6"></a>

## 1.5 Vue の MVVM :id=h-a3554dd373e5

- M：モデル（Model）—data 内のデータ
- V：ビュー（View）—テンプレートのコード
- VM：ビューモデル（ViewModel）—Vue インスタンス

<a id="section-7"></a>

## 1.6 データプロキシ :id=h-a990fe752554

> データプロキシの理解には、Object.defineProperty()、プロパティのフラグ、記述子、getter、setter などの JavaScript の知識が必要です。

学習に勧める記事：

[https://zh.javascript.info/property-descriptors](https://zh.javascript.info/property-descriptors)

[https://zh.javascript.info/property-accessors](https://zh.javascript.info/property-accessors)

簡単に紹介します。

**プロパティのフラグ**：

オブジェクトのプロパティには、**`value`** のほかに、フラグと呼ぶ 3 つの特別な属性があります。

- **`writable`**：`true` なら値を変更でき、それ以外は読み取り専用です。
- **`enumerable`**：`true` なら列挙可能で、for...in や Object.keys() で列挙できます。
- **`configurable`**：`true` ならプロパティを削除でき、これらの属性も変更できます。それ以外はできません。

**Object.getOwnPropertyDescriptor(obj, propertyName)**

> このメソッドはプロパティの完全な情報を取得します。obj はオブジェクト、propertyName はプロパティ名です。

```js
let user = {
  name: "John"
};

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');


console.log(descriptor)

/* See note 1 below. */
```

例の説明：

1. プロパティ記述子：; {; "value": "John",; "writable": true,; "enumerable": true,; "configurable": true; }

> 出力結果

![参考画像](Resources/vue2/09b4bf67bb7843388fecd7da1572901f.png)

**Object.defineProperty**(obj, prop, descriptor)

> obj：プロパティを定義するオブジェクト。
>
> prop：定義・変更するプロパティの名前
>
> descriptor：定義・変更するプロパティ記述子

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

例の説明：

1. 出力は依然として 'John' で、name は変更できません。

ほかのフラグの実演は省略し、重要なアクセサープロパティに進みます。

**アクセサープロパティ：**

本質は値を取得・設定する関数ですが、外部のコードからは通常のプロパティのように見えます。

アクセサープロパティは getter と setter のメソッドで表し、オブジェクトリテラルでは `get` と `set` を使います。

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

例の説明：

1. obj.propName を読むと getter が動作します。
2. obj.name = value を実行すると setter が動作します。

**少し複雑な使い方**

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

アクセサープロパティは通常のプロパティのように見える設計です。`user.fullName` を関数として **呼ぶ** のではなく、普通に **読み取り**、裏で getter が動きます。

> Vue の算出プロパティの内部にもこの考え方が使われている気がします。まだソースを読んでいないので、現時点では推測です。

ここまでの `fullName` は getter だけです。`user.fullName=` と代入するとエラーになります。

```js
user.fullName = "Test"; // See note 1 below.
```

例の説明：

1. Error（プロパティには getter しかない）

`user.fullName` に setter を追加して修正します。

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

例の説明：

1. ここでは新しい構文の分割代入を使っています。

**これでデータプロキシを紹介できます**：

データプロキシは、あるオブジェクトを通じて別のオブジェクトのプロパティを操作（読み書き）することです。

まず例を見ます。

```js
let obj = {
    x: 100
}

let obj2 = {
    y: 200
}
```

**obj** の **x** を取得したいものの、**obj** を直接参照せず、プロキシの **obj2** を通してアクセスしたいとします。

**Object.defineProperty()** で **obj2** にアクセサープロパティ（getter と setter）を追加できます。

> コード

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

> これがデータプロキシです。難しくありませんね。

**Vue のデータプロキシ**

- Vue では vm オブジェクトを通じて data オブジェクトのプロパティを読み書きします。
- Vue のデータプロキシにより、data を操作しやすくなります。
- 基本的な仕組み：
  - Object.defineProperty() で data オブジェクトの全プロパティを vm に追加します。
  - vm に追加した各プロパティに getter/setter を指定します。
  - getter/setter 内で data の対応するプロパティを読み書きします。

例を使ってこの過程を詳しく説明します。

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

例の説明：

1. コンテナーを用意する

new で作った vm をコンソールに出力します。

![参考画像](Resources/vue2/ea14682958924e37bf950f3960ee998e.png)

設定した data が vm にバインドされています。先に結果を言うと、Vue が \_data の name と address を vm 自体へプロキシしています。

> まだ分かりにくいでしょうか。

まず \_data とは vm の \_data プロパティで、次の画像の部分です。

![参考画像](Resources/vue2/bc4efbf50f414b1a9c1db2ff3581d228.png)

この \_data はどこから来たのでしょうか。

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

例の説明：

1. Vue の初期化オプションに data プロパティを記述しました。

new Vue の際、Vue は設定の data を処理して \_data に関連付け、リアクティブにするための処理（データのインターセプト）を加えます。このプロパティの元は設定の data です。確認してみます。

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

例の説明：

1. Vue の初期化オプションに data プロパティを記述しました。

![参考画像](Resources/vue2/e0051173ac224b408d037fda33de6410.png)

> 出力は true で、両方が同じオブジェクトと分かります。

データプロキシに戻ると、**vm.\_data** の値を vm 自体へプロキシし、**vm.\_data.name** の代わりに vm.name を使えます。これが Vue のデータプロキシです。

![参考画像](Resources/vue2/66b4020fbc5143aa8ddf3f6fd86af0ea.png)

すべて Object.defineProperty() で実現しています。この過程を再現してみます。

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

> vm.\_data.name でも name にアクセスできるのに、なぜこの処理が必要なのでしょうか。

補間の {{ name }} は {{ vm.name }} に相当します。データプロキシがないと、補間を次��ように書く必要があります。

{{ \_data.name }} は直感的でなく、不自然です。Vue の設計は開発しやすい一方、仕組みを調べると少し複雑に感じますね。

尚硅谷の張天禹先生による図です（説明が分かりやすいので、授業を強く勧めます）。

![参考画像](Resources/vue2/8ccad88c5e40497587dadb3db07e1821.png)

<a id="section-8"></a>

## 1.7 イベント処理 :id=h-1cebd44af052

イベントの基本的な使い方：

- v-on:xxx または @xxx でイベントをバインドします。xxx はイベント名です。
- イベントのコールバックは methods オブジェクトに設定し、最終的に vm に追加されます。
- methods の関数は Vue が管理し、this は vm またはコンポーネントのインスタンスを指します。

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

例の説明：

1. コンテナーを用意する
2. \<button v-on:click="showInfo">クリックして情報を表示\</button>
3. イベント自体を明示的に渡す
4. Vue のテンプレートで event を書かなければ、関数へ event が自動で渡されます。
5. console.log(this) // this is vm here
6. console.log(this) // this is vm here

**Vue のイベント修飾子**

- prevent：デフォルト動作を防ぐ（よく使う）
- stop：イベントのバブリングを止める（よく使う）
- once：1 回だけ実行する（よく使う）

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

例の説明：

1. コンテナーを用意する
2. デフォルト動作を防ぐ（よく使う）
3. イベントのバブリングを止める（よく使う）
4. 修飾子は連続して書けます。
5. \<a href="[http://www.atguigu.com](http://www.atguigu.com)" @click.prevent.stop="showInfo">クリックして情報を表示\</a>
6. 1 回だけ実行する（よく使う）

<a id="section-9"></a>

## 1.8 キーボードイベント :id=h-615e4918a5b0

キーボードイベントの糖衣構文：@keydown、@keyup

Vue でよく使うキーの別名：

- Enter => enter
- 削除 => delete
- Escape => esc
- 空白 => space
- タブ => tab（特殊で、keydown と組み合わせる必要がある）

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

例の説明：

1. コンテナーを用意する

<a id="section-10"></a>

## 1.9 算出プロパティ :id=h-829c65b71d65

- 定義：必要なプロパティが存在しないため、既存のプロパティから計算して求める。
- 仕組み：内部で Objcet.defineProperty の getter と setter を利用する。
- get 関数はいつ実行されるか。
  - （1）最初の読み取り時に 1 回実行する。
  - （2）依存するデータが変わると再び呼ばれる。
- 利点：methods と違って内部キャッシュで再利用でき、効率が高く、デバッグもしやすい。
- 補足：
  - 算出プロパティは最終的に vm に追加され、直接読み取れます。
  - 算出プロパティを変更するには、変更を受ける set 関数を定義し、その中で計算に使うデータを変更する必要があります。

> 算出プロパティの完全な書き方

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

例の説明：

1. コンテナーを用意する
2. get の役割：fullName を読み取ると get が呼ばれ、その戻り値が fullName の値になります。
3. get の呼び出し時点：1. fullName の初回読み取り時。2. 依存するデータが変わったとき。
4. set の呼び出し時点：fullName が変更されたとき。
5. コンソールで fullName を変更して確認できます。

![参考画像](Resources/vue2/0acfc64ee54d44418ff0a2750a6c4ffd.png)

> 算出プロパティの省略形

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

例の説明：

1. コンテナーを用意する

<a id="section-11"></a>

## 1.10 ウォッチャー :id=h-1cbcc016405c

監視の watch：

- 監視対象のプロパティが変わると、コールバックが自動で呼ばれ、関連する処理を行います。
- 監視するプロパティは存在している必要があります。
- 監視の指定方法は 2 通りです。
  - （1）new Vue のときに watch の設定を渡す。
  - （2）vm.$watch で監視する。

> 1 つ目の書き方

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

例の説明：

1. コンテナーを用意する
2. 初期化時に handler を 1 回呼ぶ
3. handler の呼び出し時点：isHot が変わったとき。

> 2 つ目の書き方

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

例の説明：

1. コンテナーを用意する
2. 初期化時に handler を 1 回呼ぶ
3. handler の呼び出し時点：isHot が変わったとき。

**深い監視：**

- （1）Vue の watch はデフォルトではオブジェクト内部の値の変更を監視せず、1 階層だけが対象です。
- （2）deep:true を指定すると、複数階層にある内部の値の変更を監視できます。

> 補足：
>
> （1）Vue 自体はオブジェクト内部の変更を検知できますが、Vue の watch はデフォルトでは検知しません。
>
> （2）watch を使うときは、データの具体的な構造に応じて深い監視が必要か判断します。

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

例の説明：

1. コンテナーを用意する
2. Vue の起動時の本番環境に関する案内を無効にする。
3. 多階層の構造の特定プロパティを監視する
4. 'numbers.a': {; handler() {; console.log('a が変わった'); } }
5. 多階層の構造の全プロパティを監視する

![参考画像](Resources/vue2/b5a0d88990404a5e90bea2788788ec39.png)

> watch の省略形

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

例の説明：

1. コンテナーを用意する
2. 省略形

**computed と watch の違い：**

- computed でできることは watch でも実現できます。
- watch でできることを computed で必ず実現できるとは限りません。例えば watch は非同期操作を行えます。

> 重要な 2 つの原則：
>
> 1\. Vue が管理する関数は通常の関数にすると、this が vm またはコンポーネントのインスタンスを指します。
>
> 2\. 通常のコンポーネントメソッド内でタイマー、リクエスト、Promise のコールバックを作る場合、アロー関数でその this を保持できます。アロー関数は定義位置の this を引き継ぐだけで、自動的にコンポーネントを指しません。data、methods など Vue が this をバインドする入口をアロー関数にしないでください。

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

例の説明：

1. コンテナーを用意する
2. watch の監視処理には非同期関数を書けます。

<a id="section-12"></a>

## 1.11 スタイルのバインド :id=h-0530418fc493

### **class のスタイル** :id=h-f5504096352f

書き方：:class="xxx"。xxx は文字列、オブジェクト、配列です。

したがって、文字列、配列、オブジェクトの 3 形式があります。

**文字列形式**

文字列形式は、クラス名が未確定で動的に取得する場合に適します。

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

例の説明：

1. コンテナーを用意する
2. class の文字列バインド：クラス名が未確定で、動的に指定する場合に使う

**配列形式**

配列形式は、複数のスタイルをバインドし、数も名前も未確定の場合に適します。

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

例の説明：

1. コンテナーを用意する
2. class の配列バインド：スタイルの数も名前も未確定の場合に使う

**オブジェクト形式**

オブジェクト形式は、スタイルの数と名前は確定し、適用するかどうかが未確定の場合に適します。

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

例の説明：

1. コンテナーを用意する
2. class のオブジェクトバインド：数と名前は確定し、使うかどうかを動的に決める場合に使う

### **style のスタイル** :id=h-5565c1a19ede

オブジェクトと配列の 2 形式がある

**オブジェクト形式**

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

例の説明：

1. コンテナーを用意する
2. style のバインド：オブジェクト形式

**配列形式**

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

例の説明：

1. コンテナーを用意する
2. style のバインド：配列形式

<a id="section-13"></a>

## 1.12 条件付きレンダリング :id=h-e27fbc2e3e34

### v-if :id=h-fa7d81ae92c1

- 記法：

  （1）v-if="式"

  （2）v-else-if="式"

  (3).v-else

- 切り替えの頻度が低い場合に適する

- 表示しない DOM 要素は直接削除されます。

- v-if は v-else-if、v-else と組み合わせられますが、構造を途中で分断してはいけません。

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

例の説明：

1. コンテナーを用意する
2. v-if による条件付きレンダリング
3. v-else と v-else-if
4. v-if と template の併用
5. 複数の条件を書く必要がなく、1 つで済みます。
6. 考え方はイベント委譲の使い方に似ています。

### **v-show** :id=h-25c217cabf44

- 書き方：v-show="式"
- 切り替えの頻度が高い場合に適する
- 表示しない DOM 要素は削除されず、display:none で隠すだけです。

> v-if では要素を取得できない場合があ���ますが、v-show なら取得できます。
>
> v-if は DOM 要素を実際に変更し、v-show は表示・非表示を切り替えます。

```html
<!-- See note 1 below. -->
<div id="root">
    <!-- See note 2 below. -->
    <h2 v-show="false">欢迎来到{{name}}</h2>
    <h2 v-show="1 === 1">欢迎来到{{name}}</h2>
</div>
```

例の説明：

1. コンテナーを用意する
2. v-show による条件付きレンダリング

<a id="section-14"></a>

## 1.13 リストのレンダリング :id=h-2d652a494f1a

### v-for ディレクティブ :id=h-4379a31173aa

- リストデータを表示する
- 構文：v-for="(item, index) in xxx" :key="yyy"
- 配列、オブジェクト、文字列（使用は少ない）、指定回数（使用は少ない）で繰り返せます。

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

例の説明：

1. 配列を走査する
2. オブジェクトを走査する
3. 文字列を走査する
4. 指定回数だけ繰り返す

### **key の仕組み** :id=h-e66d64abc180

Vue の key の役割は何か（内部の仕組み）。

Vue の key を理解するには前提知識が必要です。

Vue は data から仮想 DOM を生成します。初回のページ生成では、仮想 DOM を実際の DOM に変換して表示します。

仮想 DOM の役割は何でしょうか。vm.\_data のデータが変わるたびに新しい仮想 DOM を生成し、古いものと比較します。同じ部分は実 DOM を作り直す必要がなく、異なる部分だけを実 DOM にして既存の実 DOM と組み合わせます。私の理解では、仮想 DOM は DOM の再利用と余分な操作の回避に役立ちます。詳しくは以下で説明します。

では key の役割は何でしょうか。

key は仮想 DOM の識別子です。

まず前提として、実 DOM とは何か、実 DOM と仮想 DOM の違い、実 DOM と仮想 DOM のコード表現を見ます。

#### 実 `DOM` とその解析の流れ :id=h-e622237fcab3

参考にした「超级英雄」さんの記事：[https://juejin.cn/post/6844903895467032589](https://juejin.cn/post/6844903895467032589)

`webkit` レンダリングエンジンの処理の流れ

![img](Resources/vue2/b32d88931ee775d57b382d7585de3ad8.png)

> 中国語版

![img](Resources/vue2/cd1757feee540ef20c50b81af16d75ca.jpg)

ブラウザーの描画エンジンは大きく 5 段階で動きます。`DOM` ツリー作成 -> `Style Rules` 作成 -> `Render` ツリー構築 -> レイアウト（`Layout`）-> 描画（`Painting`）。

- 第 1 段階は DOM ツリーの構築です。サーバーから HTML 文書を受け取ると、ノードをたどって DOM ツリーを生成します。DOM の構築中には、CSS と JS の読み込みや実行で停止する場合があります。描画のブロックは後述します。

- 第 2 段階はスタイルの生成です。CSS パーサーで CSS ファイルと要素のインラインスタイルを解析し、ページのスタイルルールを生成します。

- 描画のブロック：script タグに遭遇すると DOM の構築は停止し、スクリプトの読み込みと実行後に DOM の構築を再開します。JavaScript の実行は DOM の構築を大きく妨げる場合があります。JavaScript が CSSOM を操作し、その CSSOM が未完成なら、ブラウザーは CSSOM の読み込みと構築が終わるまでスクリプト実行と DOM の構築を遅らせることもあります。script の配置は重要なので、次の 2 原則を使えます。

  - CSS を先に：CSS リソースを JavaScript より先に読み込む。

  - JavaScript を後に：コードを下部に置き、DOM の構築への影響をなるべく減らす。

    > HTML の解析中、新しい要素を DOM ツリーに挿入すると同時に CSS を調べ、対応するルールを適用します。セレクターは右から左へ照合し、div p {...} では p を見つけて div の祖先を確認し、適用を決めます。そのため class や id を使い、過度にセレクターを重ねないようにします。

- 第 3 段階は、DOM ツリーと CSS ルールから描画ツリーを作ることです。ブラウザーは DOM の表示対象ノードをたどり、対応する CSS ルールを適用します。各ノードには内容と対応するスタイルが含まれます。これが DOM ツリーとの大きな違いです。描画しない要素や display:none の要素は含まず、visibility:hidden の要素は含みます。

- 第 4 段階は **レイアウト** です。描画ツリーのルートからたどり、各ノードの正確な大きさと位置を決めます。出力はボックスモデルで、画面内���各要素の位置とサイズを正確に表します。

- 第 5 段階は **描画ツリーのペイント** です。ツリーをたどり、レンダラーの paint() で内容を画面に表示します。この描画はブラウザーの UI バックエンドが担当します。

**注意点：**

**1、文書の読み込み完了後に `DOM` の構築を始めるのでしょうか。** `DOM` ツリーの構築は段階的です。内容を早く表示するため、`HTML` 全体の解析完了を待たずに `render` ツリーの構築やレイアウトを始めます。

**2、`Render` ツリーは、`DOM` ツリーと `CSS` の完成後に作るのでしょうか。** これらの処理は完全に独立しておらず、読み込み、解析、描画が重なって進みます。

**3、`CSS` 解析の注意点は何でしょうか。** `CSS` の照合は右から左で、入れ子が多いほど遅くなります。

\*\*4、`JS` で実 `DOM` を操作するコストは何でしょうか。\*\* 従来の DOM 操作は性能に大きく影響します。DOM の頻繁な変更は reflow と repaint を起こし、レイアウト計算、再配置、描画を繰り返す負担が生じます。実 `DOM` の直接操作は性能を悪化させることがあります。実演してみます。

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

例の説明：

1. DIV 要素を取得する
2. 実 DOM の操作
3. 仮想 DOM の操作

![参考画像](Resources/vue2/0740cb16f1354358bed6ef638b90ebfe.png)

> 結果から実 DOM の操作は性能が低いと分かるため、なるべく再利用して DOM 操作を減らします。

#### **仮想 DOM の利点** :id=h-1ddd0ea78be0

```
虚拟 `DOM` 就是为了解决浏览器性能问题而被设计出来的。如前，若一次操作中有 10 次更新 `DOM` 的动作，虚拟 `DOM` 不会立即操作 `DOM`，而是将这 10 次更新的 `diff` 内容保存到本地一个 `JS` 对象中，最终将这个 `JS` 对象一次性 `attch` 到 `DOM` 树上，再进行后续操作，避免大量无谓的计算量。所以，用 `JS` 对象模拟 `DOM` 节点的好处是，页面的更新可以先全部反映在 `JS` 对象(虚拟 `DOM` )上，操作内存中的 `JS` 对象的速度显然要更快，等更新完成后，再将最终的 `JS` 对象映射成真实的 `DOM`，交由浏览器去绘制。

虽然这一个虚拟 DOM 带来的一个优势，但并不是全部。虚拟 DOM 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的 DOM，可以是安卓和 IOS 的原生组件，可以是近期很火热的小程序，也可以是各种GUI。

回到最开始的问题，虚拟 DOM 到底是什么，说简单点，就是一个普通的 JavaScript 对象，包含了 `tag`、`props`、`children` 三个属性。
```

> 次に仮想 DOM を手動で実装します。
>
> 実現方法は 2 通りです。
>
> 標準 JavaScript の DOM 操作を使う方法。
>
> snabbdom、virtual-dom などの主流の仮想 DOM ライブラリで h 関数を使う方法（筆者はまだ理解していません）。

**アルゴリズムの実装**

\*\*（1）\*\* JS オブジェクトで DOM ツリーを表す：

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

`JavaScript` オブジェクトで `DOM` ノードを表し、型、属性、子ノードなどをプロパティに記録します。

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

例の説明：

1. Element virtual-dom object definition; @param {String} tagName - DOM element name; @param {Object} props - DOM attributes; @param {Array\<Element|String>} - child nodes
2. DOM 要素の key 値。一意の識別子として使う。

JavaScript オブジェクトで表す仮想 `DOM` を構築する

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

これで `ul` は `JavaScript` オブジェクトで表した `DOM` 構造になります。`ul` を出力すると次の構造です。

![参考画像](Resources/vue2/9fb2a6336a61477c8ea39677716d1f52.png)

\*\*（2）\*\* JavaScript オブジェクトの仮想 DOM を実 DOM に変換します。標準の DOM 操作メソッドが必要です。

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

例の説明：

1. render は virtual-dom オブジェクトを実際の DOM 要素として描画します。
2. ノードを作成する
3. ノードの DOM 属性を設定する
4. 子も仮想 DOM なら、再帰的に DOM ノードを作る
5. テキストならテキストノードを作る

上の `render` メソッドは、`tagName` から実際の `DOM` ノードを作り、属性を設定し、最後に子ノードを再帰的に作ります。

作成した `DOM` 構造をページの `body` に追加します。

```js
let ulRoot = ul.render();
document.body.appendChild(ulRoot);
```

これでページの `body` に実際の `DOM` 構造ができ、次のように表示されます。

![参考画像](Resources/vue2/41bf566f214f4c1f943b9a3dddfc6f19.png)

> 仮想 DOM の利点と仮想 DOM の実装を理解したので、key の役割に進みます。
>
> 上の実装の完全なコード

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

例の説明：

1. Element virtual-dom object definition; @param {String} tagName - DOM element name; @param {Object} props - DOM attributes; @param {Array\<Element|String>} - child nodes
2. DOM 要素の key 値。一意の識別子として使う。
3. render は virtual-dom オブジェクトを実際の DOM 要素として描画します。
4. ノードを作成する
5. ノードの DOM 属性を設定する
6. 子も仮想 DOM なら、再帰的に DOM ノードを作る
7. テキストならテキストノードを作る

#### **仮想 DOM の key の役割** :id=h-f561e54fd28e

key は仮想 DOM オブジェクトの識別子です。データが変わると Vue は新データから新しい仮想 DOM を生成し、Vue が新しい仮想 DOM と古い仮想 DOM を次の規則で比較します。

- 古い仮想 DOM に、新しい仮想 DOM と同じ key がある場合：
  - ① 仮想 DOM の内容が同じなら、以前の実 DOM を再利用する。
  - ② 仮想 DOM の内容が変われば、新しい実 DOM を作り、ページの以前の実 DOM を置き換える。
- 古い仮想 DOM に、新しい仮想 DOM と同じ key がない場合。
  - 新しい実 DOM を作成してページに描画する。

> これが key の最も簡単な仕組みです。さらに調べると Vue の中核の 1 つである diff アルゴリズムに進みます。後で詳しく説明します。

### index を key にする場合に起こり得る問題： :id=h-3f8328b42976

**逆順の追加・削除など、順序を崩す操作をした場合：**

不要な実 DOM の更新が起こり、画面表示は正しくても効率が下がります。

> 例

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

例の説明：

1. コンテナーを用意する
2. 配列を走査する

> 説明：

初期データ

persons: \[
{ id: '001', name: '張三', age: 18 },
{ id: '002', name: '李四', age: 19 },
{ id: '003', name: '王五', age: 20 }
]

**Vue がデータから仮想 DOM を生成する**

初期の仮想 DOM

```html
<li key='0'>张三-18<input type="text"></li>
<li key='1'>李四-19<input type="text"></li>
<li key='2'>王五-20<input type="text"></li>
```

**仮想 DOM を実 DOM に変換する**

![参考画像](Resources/vue2/ac320c177da8496785f7b94e54dd938a.png)

`this.persons.unshift({ id: '004', name: '老刘', age: 40 })`

persons 配列の先頭に { id: '004', name: '老劉', age: 40 } を追加します。

新しいデータ：

persons: \[

```
    { id: '004', name: '老刘', age: 40 },

    { id: '001', name: '张三', age: 18 },
    { id: '002', name: '李四', age: 19 },
    { id: '003', name: '王五', age: 20 }
```

]

**Vue がデータから仮想 DOM を生成する**

新しい仮想 DOM

```html
<li key='0'>老刘-30<input type="text"></li>
<li key='1'>张三-18<input type="text"></li>
<li key='3'>李四-19<input type="text"></li>
<li key='4'>王五-20<input type="text"></li>
```

**仮想 DOM を実 DOM に変換する**

![参考画像](Resources/vue2/2ec092bf1dca430c9d9b7bf932587501.png)

index を key にすると、Vue は位置に基づいてノードを再利用し、内容を更新し、必要に応じて追加・削除します。全ノードを作り直す意味ではありません。並べ替え後は入力欄や子コンポーネントの状態が元データではなく位置に対応することがあるため、安定した一意の業務 ID を優先します。

> 尚硅谷の図

![参考画像](Resources/vue2/ec80a7ae139642d09d70e77ca37e0a52.png)

**構造に入力用 DOM も含まれる場合：**

誤った DOM 更新が起こり、画面に問題が生じます。

> この場合は性能の無駄だけでなく、ページの誤動作に直接つながります。

![参考画像](Resources/vue2/c89eb1802c7a4698ba5b14ab0ab654d8.png)

### 結論： :id=h-2898bf117fd4

- 各データの一意の識別子を key にするのがよく、例えば ID、電話番号、身分証番号、学籍番号などを使います。
- 逆順の追加・削除など順序を崩す操作がなく、表示専用のリストなら index を key にしても問題ありません。

> key の適切な使い方を示す尚硅谷の図

![参考画像](Resources/vue2/e5b3f8a66d7441e5bcff0a2525266759.png)

<a id="section-15"></a>

## 1.14 Vue が data を監視する仕組み :id=h-30e0a183c7dd

導入の例を見ます。

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

例の説明：

1. コンテナーを用意する
2. this.persons\[0].name = '馬先生' // Works
3. this.persons\[0].age = 50 // Works
4. this.persons\[0].sex = '男性' // Works
5. 機能しない
6. this.persons.splice(0,1,{id:'001',name:'馬先生',age:50,sex:'男性'})

馬冬梅の情報更新をクリックしても、表示されるデータは変わりません。

![参考画像](Resources/vue2/6f16b316d8824ca897e55c70884463de.png)

コンソールを確認します。
![ここに画像の説明を挿入](Resources/vue2/145a2298bba942c78f8d23f03fb21bdf.png)

コンソールのデータは変わっているため、この変更を Vue が検知していないと分かります。

そこで Vue の監視の仕組みを調べます。

まず Vue がオブジェクトのデータを監視する仕組み

> コード

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

例の説明：

1. コンテナーを用意する
2. Vue の起動時の本番環境に関する案内を無効にする。

![参考画像](Resources/vue2/024cbd8a706c451e9a1f6cc3916e426e.png)

> テンプレート処理後の流れ：set の呼び出し -> テンプレート処理 -> 新しい仮想 DOM の生成 -> 新旧 DOM の比較 -> ページ更新。

Vue のデータ監視を再現する

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

例の説明：

1. data のプロパティ変更を監視するインスタンスを作る
2. vm インスタンスを用意する
3. オブジェクトの全プロパティを配列にまとめる
4. 走査する

![参考画像](Resources/vue2/250a6e7fa0da45608997f2688e143d45.png)

**Vue.set の使用**

Vue.set(target, propertyName/index, value)、または

vm.$set(target，propertyName/index，value)

**使い方**：

リアクティブなオブジェクトにプロパティを追加し、新しいプロパティもリアクティブにしてビューを更新します。Vue は `vm.myObject.newProperty = 'hi'` のような通常の追加を検知できないため、新しいプロパティの追加にはこれが必要です。

> コード

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

例の説明：

1. コンテナーを用意する
2. Vue の起動時の本番環境に関する案内を無効にする。
3. Vue.set(this.student,'sex','男性')

Vue.set() と vm.$set には制限があります。

![参考画像](Resources/vue2/954f0312289748c189bac545b4463c63.png)

> つまり vm と \_data

オブジェクトのデータ監視に続き、Vue が配列を監視する方法を見ます。

> まずコードの例を書きます。

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

例の説明：

1. コンテナーを用意する
2. Vue の起動時の本番環境に関する案内を無効にする。

![参考画像](Resources/vue2/b2f270e6fed4408fb6709e960aea7953.png)

> そのため vm.\_data.student.hobby\[0] = 'aaa' // Does not work
>
> Vue の配列ではこの位置に getter と setter がなく、変更を検知できないため、ページも更新されません。

![参考画像](Resources/vue2/0e4c3d70f3e3492baaa2f391b0c26ec0.png)

配列を getter と setter で監視できないなら、Vue はどのように配列の変更を検知するのでしょうか。

Vue は配列を変更する一般的なメソッドをラップして監視します。

Vue 公式サイトの説明：

![参考画像](Resources/vue2/b003a83d94dd44e0ae93a87da8ab43d9.png)

**要点の確認：**

Vue のデータ監視の仕組み：

- Vue は data のすべての階層を監視します。

- オブジェクトのデータはどう監視するか。

  setter で監視し、監視対象のデータは new Vue のときに渡す必要があります。

  - 後から追加したプロパティは、デフォルトでは Vue がリアクティブにしません。

  - 後から追加するプロパティをリアクティブにするには、次の API を使います。

    Vue.set(target, propertyName/index, value)、または

    vm.$set(target，propertyName/index，value)

- 配列のデータはどう監視するか。

  配列の更新メソッドをラップし、実質的に次の 2 つを行います。

  - 対応する標準メソッドで配列を更新する
  - テンプレートを再処理してページを更新する

- Vue で配列の要素を変更するには、次の方法を使ってください。

  - これらの API：push()、pop()、shift()、unshift()、splice()、sort()、reverse()
  - Vue.set() または vm.$set()

> 重要：Vue.set() と vm.$set() では、vm や vm のルートデータオブジェクトにプロパティを追加できません。

<a id="section-16"></a>

## 1.15 フォームデータの収集 :id=h-c4c4fce3c23b

<input type="text"/> では、v-model は value、つまりユーザーの入力値を収集します。

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

例の説明：

1. コンテナーを用意する

<input type="radio"/> では、v-model は value を収集するため、タグに value を設定する必要があります。

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

例の説明：

1. コンテナーを用意する

<input type="checkbox"/> の場合：

- input に value 属性がなければ、checked（選択・未選択を表す真偽値）を収集します。
- input の value 属性を設定した場合：
  - v-model の初期値が配列でなければ、checked の真偽値を収集します。
  - v-model の初期値が配列なら、value から成る配列を収集します。

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

例の説明：

1. コンテナーを用意する

![参考画像](Resources/vue2/74583240fa094967b19441921634b304.png)

> v-model の 3 つの修飾子：
>
> lazy：change イベントで同期します。テキスト入力では変更後にフォーカスを失うと起こることが多いですが、すべてのフォーム項目を blur と同一視してはいけません。
>
> number：入力文字列を有効な数値に変換する
>
> trim：入力の前後の空白を取り除く

<a id="section-17"></a>

## 1.16 フィルター（重点外） :id=h-71ac16a83a91

定義：表示データに特定の書式を適用して表示するもので、簡単な処理に適します。

**構文：**

- 登録：Vue.filter(name,callback) または new Vue{filters:{}}
- 使用：{{ xxx | フィルター名 }} または v-bind:属性="xxx | フィルター名"

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

例の説明：

1. コンテナーを用意する
2. 算出プロパティで実装する
3. methods で実装する
4. フィルターで実装する
5. 引数を渡すフィルターで実装する
6. グローバルフィルター
7. タイムスタンプ
8. ローカルフィルター

> 補足：
>
> 1\. フィルターは追加の引数を受け取れ、複数を連結できます。
>
> 2\. 元のデータは変えず、対応する新しいデータを生成します。

<a id="section-18"></a>

## 1.17 組み込みディレクティブ :id=h-84208dd89593

**v-text：**（使用は比較的少ない）

1\. 役割：対象ノードにテキストを描画します。

2\. 補間との違い：v-text はノードの内容を置き換えますが、{{xx}} は置き換えません。

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

例の説明：

1. コンテナーを用意する
2. Vue の起動時の本番環境に関する案内を無効にする。

**v-html：**（使用は少ない）

1\. 役割：指定ノードに HTML 構造を含む内容を描画します。

2\. 補間との違い：

- v-html はノードの全内容を置き換えますが、{{xx}} は置き換えません。
- v-html は HTML 構造を認識できます。

3\. 重要：v-html にはセキュリティ上の問題があります。

- 任意の HTML を動的に描画するのは危険で、XSS 攻撃につながります。
- v-html は信頼できる内容にだけ使い、ユーザーが送信した内容には決して使わないでください。

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

例の説明：

1. コンテナーを用意する
2. Vue の起動時の本番環境に関する案内を無効にする。

**v-cloak（値なし）：**

- 特別な属性で、Vue インスタンスが作成されコンテナーを制御すると、v-cloak 属性は削除されます。
- CSS と v-cloak を組み合わせると、低速回線で {{xxx}} が表示される問題を防げます。

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

例の説明：

1. コンテナーを用意する
2. Vue の起動時の本番環境に関する案内を無効にする。

**v-once：**（使用は少ない）

- v-once のノードは最初の動的描画後、静的な内容として扱われます。
- 以降のデータ変更で v-once の構造は更新されず、性能の最適化に使えます。

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

例の説明：

1. コンテナーを用意する
2. Vue の起動時の本番環境に関する案内を無効にする。

**v-pre：**（ここでは用途が少ない）

- 対象ノードのコンパイルを省略する
- ディレクティブも補間も使わないノードを省略し、コンパイルを速くできます。

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

例の説明：

1. コンテナーを用意する
2. Vue の起動時の本番環境に関する案内を無効にする。

<a id="section-19"></a>

## 1.18 カスタムディレクティブ :id=h-ddba23dcec10

要件 1：v-text に似て、バインドした数値を 10 倍にする v-big を定義します。

要件 2：v-bind に似て、対象の input にデフォルトでフォーカスを当てる v-fbind を定義します。

**構文：**

ローカルディレクティブ：

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

例の説明：

1. ディレクティブの定義

グローバルディレクティブ：

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

例の説明：

1. グローバルなカスタムディレクティブ v-focus を登録する
2. バインドした要素が DOM に挿入されたとき……
3. 要素にフォーカスする

設定オブジェクトでよく使う 3 つのコールバック：

- bind：ディレクティブと要素のバインド成功時に呼ばれます。
- inserted：対象要素がページに挿入されたときに呼ばれます。
- update：対象のテンプレート構造が再処理されたときに呼ばれます。

> この 3 つのタイミングを理解するには、以下で説明する Vue のライフサイクルをさらに学ぶ必要があります。

グローバルディレクティブを定義する

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

例の説明：

1. コンテナーを用意する
2. グローバルディレクティブを定義する
3. ディレクティブと要素の初回バインド成功時
4. 対象要素がページに挿入されたとき
5. ディレクティブを含むテンプレートが再解析されたとき

ローカルディレクティブ：

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

例の説明：

1. big の呼び出し時点：1. ディレクティブと要素の初回バインド成功時。2. 対象のテンプレートの再処理時。
2. ここでの this は window です。
3. ディレクティブと要素の初回バインド成功時
4. 対象要素がページに挿入されたとき
5. ディレクティブを含むテンプレートが再解析されたとき

<a id="section-20"></a>

## 1.19 ライフサイクル :id=h-b23671dde004

### ライフサイクルの概要 :id=h-b94e2371bd85

Vue インスタンスには完全なライフサイクルがあります。new Vue()、イベント（.once）やライフサイクルの初期化、テンプレートのコンパイル、DOM のマウント -> 描画、更新 -> 描画、アンマウントなどの一連の処理を Vue のライフサイクルと呼びます。

まず尚硅谷の図を見ます。

![参考画像](Resources/vue2/e4a8169c832443f2a78c6a1ae42a87b3.png)

1. **beforeCreate（作成前）**：データ監視（getter・setter）とイベント初期化はまだ始まっていません。data のリアクティブ追跡や event/watcher が設定されておらず、data、computed、watch、methods のデータやメソッドにはアクセスできません。
2. **created（作成後）**：インスタンスが作成され、data、computed、watch、methods などの設定が完了しています。ただし描画ノードは DOM に未マウントで、`$el` は参照できません。
3. **beforeMount（マウント前）**：マウント開始前に呼ばれ、render 関数が初めて動きます。Vue はテンプレートを解析し、メモリに仮想 DOM を作ります。仮想 DOM を実 DOM にしてページへ挿入する前なので、解析後の内容はまだ表示されません。
4. **mounted（マウント後）**：el が新しい vm.$el（実 DOM のコピー）に置き換わり、インスタンスへマウントされた後に呼ばれます。メモリの仮想 DOM を実 DOM にし、実 DOM をページに挿入します。ページは Vue がコンパイルした DOM を表示しています。このフックで DOM 操作は有効ですが、なるべく避けます。一般にタイマーの開始、ネットワークリクエスト、メッセージの購読、カスタムイベントの登録などを行います。
5. **beforeUpdate（更新前）**：リアクティブなデータが更新され、対応する実 DOM がまだ描画されていない時点で呼ばれます。データは新しく、ページは古いままで、まだ同期していません。
6. **updated（更新後）**：データ変更による仮想 DOM の再描画とパッチ後に呼ばれ、DOM は新しいデータを反映しています。コンポーネントの DOM が更新済みなので DOM 依存の操作を行���ます。ただし状態を変更すると無限更新になる場合があり、通常は避けます。サーバー側の描画中は呼ばれません。
7. **beforeDestroy（破棄前）**：インスタンスの破棄前に呼ばれ、まだ完全に利用でき、`this` で参照できます。通常はタイマーの停止、メッセージの購読解除、カスタムイベントの解除を行います。
8. **destroyed（破棄後）**：破棄後に呼ばれ、Vue インスタンスのバインドやイベントリスナーが解除され、子インスタンスも破棄されます。サーバーサイドレンダリング中は呼ばれません。

> 次に図の中央の大きな枠を説明します。

![参考画像](Resources/vue2/bf970362485848798ab093430b4162b8.png)

まず **el** の設定を確認し、なければ vm.$mount(el) を呼びます。両方なければ処理は待機し、元のコンテナーが表示されます。**el** があれば template を確認し、なければ el のコンテナーを Vue テンプレートとしてコンパイルします。次の図で比較します。

コンパイル前：

![参考画像](Resources/vue2/d2242a275b1c4abe98fbcf9623ff8152.png)

コンパイル後：

![参考画像](Resources/vue2/2c59b4bb3820404f87adf366e8582f91.png)

template は何のためにあるのでしょうか。

**1 つ目：template がある場合**

el のコンテナーが空でも、Vue インスタンスに template があれば、その内容をコンパイルして仮想 DOM を作り、仮想 DOM を実 DOM に変換して挿入します。template が el のコンテナーの内容を置き換えると考えられます。

![参考画像](Resources/vue2/b6de87cd2e44480a8cbe1ec82b867ca3.png)

![参考画像](Resources/vue2/23762cb8feb340449fb0033abcff0a6d.png)

**2 つ目：template がない場合**

template がなければ el のコンテナーを解析して仮想 DOM を生成し、以降のライフサイクルを進めます。

<a id="section-21"></a>

## 1.20 単一ファイルではないコンポーネント :id=h-5e61a2bbd043

### 基本的な使い方 :id=h-f4705c779923

Vue でコンポーネントを使う 3 段階：

- コンポーネントを定義（作成）する
- コンポーネントを登録する
- コンポーネントのタグを書いて使用する

**コンポーネントの定義**

Vue.extend(options) で作成します。options は new Vue(options) とほぼ同じですが、少し違いがあります。

違いは次のとおりです。

- el は書きません。最終的に全コンポーネントを 1 つの vm が管理し、その el が対象コンテナーを決めるためです。
- data は関数にします。再利用したコンポーネント同士でデータ参照を共有しないためです。

面接でも聞かれる、data が関数であるべき理由を説明します。

JavaScript の基本的な仕組みによるものです。例を見ます。

> オブジェクト形式

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

例の説明：

1. x と y は同じオブジェクトを参照するため、x を変更すると y から見た値も変わります。

> 関数形式

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

例の説明：

1. 私の理解では、関数を呼ぶたびに新しいオブジェクトを作って返します。

> 補足：template でコンポーネントの構造を設定できます。

コンポーネント作成の例：Vue.extend() を使う。

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

例の説明：

1. 第 1 段階：school コンポーネントを作成する
2. el:'#root', // Do not set el in components; the root vm determines the container for all components.
3. 第 1 段階：student コンポーネントを作成する
4. 第 1 段階：hello コンポーネントを作成する

**コンポーネントの登録**

- ローカル登録：new Vue のときに components オプションを渡します。
- グローバル登録：Vue.component('コンポーネント名', コンポーネント)

> ローカル登録

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

例の説明：

1. vmを作成
2. 第 2 段階：コンポーネントをローカル登録する
3. ES6 の省略形

> グローバル登録

```html
<script>
    // See note 1 below.
    Vue.component('hello', hello)
</script>
```

例の説明：

1. 第 2 段階：コンポーネントをグローバル登録する

**コンポーネントのタグを書く**

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

例の説明：

1. コンテナーを用意する
2. 第 3 段階：コンポーネントのタグを書く
3. 第 3 段階：コンポーネントのタグを書く

### **注意点：** :id=h-2332f13c3820

コンポーネント名について：

1 単語の場合：

- 1 つ目（先頭を小文字）：school
- 2 つ目（先頭を大文字）：School

複数の単語の場合：

- 1 つ目（kebab-case）：my-school
- 2 つ目（PascalCase）：MySchool。単一ファイルコンポーネントで使えますが、ブラウザーが直接解析する HTML ではタグ名が小文字になります。

> 補足：
>
> （1）HTML の既存要素名は避けてください。h2、H2 はどちらも使えません。
>
> （2）name オプションで、開発ツールに表示するコンポーネント名を指定できます。

コンポーネントのタグについて：

1 つ目：<school></school>

2 つ目：<school/>

> プロジェクト作成ツールを使わない場合、<school/> では後続のコンポーネントが描画されなくなります。

省略形：

const school = Vue.extend(options) は const school = options と省略できます。

### コンポーネントの入れ子 :id=h-e6753be9eec9

簡単なので、コードを示します。

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

例の説明：

1. コンテナーを用意する
2. Vue の起動時の本番環境に関する案内を無効にする。
3. student コンポーネントを定義する
4. school コンポーネントを定義する
5. コンポーネントをローカル登録する
6. hello コンポーネントを定義する
7. app コンポーネントを定義する
8. vmを作成
9. コンポーネントをローカル登録する

### VueComponent :id=h-dd997785166f

- school コンポーネントの本質は VueComponent というコンストラクターで、開発者の定義ではなく Vue.extend が生成します。
- <school/> または <school></school> と書くだけで、Vue が解析時に school インスタンスを作ります。つまり Vue が new VueComponent(options) を実行します。
- 重要：Vue.extend を呼ぶたびに、新しい VueComponent が返ります。この VueComponent はインスタンスではありません。
- this の参照先について：
  - コンポーネント設定の data、methods、watch、computed の関数では、this は VueComponent のインスタンスを指します。
  - new Vue(options) の data、methods、watch、computed の関数では、this は Vue インスタンスを指します。
- 以降、VueComponent のインスタンスを vc（コンポーネントインスタンス）、Vue インスタンスを vm と略します。

Vue が VueComponent を管理する場所

![参考画像](Resources/vue2/4039bc27eaff4463be9dd5c037993b77.png)

### 重要な組み込みの関係 :id=h-6d9bb4f71112

- 重要な組み込みの関係：VueComponent.prototype.**proto** === Vue.prototype
- この関係により、コンポーネントインスタンス（vc）は Vue のプロトタイプ上のプロパティやメソッドにアクセスできます。

![参考画像](Resources/vue2/9f3398cb2cfb4b169951adb53236ad60.png)

<a id="section-22"></a>

## 1.21 単一ファイルコンポーネント :id=h-1a3d9bc8e286

単一ファイルコンポーネントは、コンポーネントのコードを .vue ファイルにまとめ、webpack が HTML、CSS、JavaScript に解析します。

単一ファイルコンポーネントの例を作ります。

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

全コンポーネントをまとめる管理役

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

例の説明：

1. コンポーネントをインポート

**main.js**

このファイル内で Vue インスタンスを作る

```js
import App from './App.vue'

new Vue({
    el:'#root',
    template:`<App></App>`,
    components:{App},
})
```

**index.html**

Vue をバインドするコンテナーをここに書く

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

例の説明：

1. コンテナーを用意する

<a id="section-23"></a>

# 2. Vue のプロジェクト作成ツール、カスタムイベント、スロットなどの応用 :id=h-da7b0c7cba20

<a id="section-24"></a>

## 2.1 プロジェクト作成ツール :id=h-87f55ae3a1a8

> 使用前の準備：
>
> 第 1 段階（未インストールの場合）：@vue/cli をグローバルインストールします。
>
> npm install -g @vue/cli
>
> 第 2 段階：作成先のディレクトリへ移動し、コマンドでプロジェクトを作ります。
>
> vue create xxxxx
>
> 第 3 段階：プロジェクトを起動する
>
> npm run serve

### 作成されたファイル構成 :id=h-8606faaa97f7

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

### プロジェクト作成ツールのデモ :id=h-96a5e57fc61a

components:

単一ファイルの例の School.vue と Student.vue を、変更せずそのまま使います。

App.vue:

2 つのコンポーネントを取り込み、登録してから使用します。

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

エントリーファイル

```js
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

次に main.js の render 関数を詳しく説明します。

### render 関数 :id=h-b82353325fdb

> 補足知識：

import で外部ライブラリを取り込むときは './' を付けません。

自分で書いたコードを取り込む場合：

```js
import App from './App.vue'
```

外部ライブラリを取り込む場合

```js
import Vue from 'vue'
```

from 'vue' に `'./'` が不要なのは、外部ライブラリの node_modules で解決するよう設定されているためです。

import で外部ライブラリを取り込むとき、どのファイルを読むかはその package.json で決まります。

![参考画像](Resources/vue2/de478c338b1643d4898b8eddbf489197.png)

module で取り込むファイルを指定しています。

> render 関数に戻る

以前の書き方は次のとおりでした。

```js
import App from './App.vue'

new Vue({
    el:'#root',
    template:`<App></App>`,
    components:{App},
})
```

この書き方で実行すると、次のエラーが出ます。

![参考画像](Resources/vue2/b2b8ecbfb1784360a12057d3c019a726.png)

実行時専用の Vue を使っており、テンプレートコンパイラーがないというエラーです。

先の説明のとおり、取り込んだ Vue はサイズ削減のため完全版ではありません。そのため、この vue.js では render 関数を使って動かします。

render を解析する

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

例の説明：

1. render の最も基本的な書き方
2. render は関数で、引数 a も受け取れます。
3. この createElement は重要なコールバック関数です。
4. createElement コールバックは要素を作成できます。
5. 実行時専用 Vue は template を解析できないため、render がその問題を解決します。
6. createElement は具体的な要素を作成できます。

![参考画像](Resources/vue2/4c32e5e48f2d493a94976a4810abc5fd.png)

render 内で this を使わないため、アロー関数に省略できます。

```js
new Vue({
  // render: h => h(App),
  render: (createElement) => {
    return createElement(App)
  }
}).$mount('#app')
```

さらに省略すると：

```js
new Vue({
  // render: h => h(App),
  render: createElement => createElement(App)
}).$mount('#app')
```

最後に createElement を h に変えれば完成です。

JavaScript は省略形が多いので、まとめて確認します。

オブジェクトのメソッドの基本的な書き方：

```js
let obj = {
    name: 'aaa',
    work: function (salary) {
        return '工资' + salary;
    }
}
```

ES6 の省略形：

```js
let obj = {
    name: 'aaa',
    work(salary) {
        return '工资' + salary;
    }
}
```

アロー関数による省略形：

```js
let obj = {
    name: 'aaa',
    work: (salary) => {
        return '工资' + salary;
    }
}
```

さらに省略したアロー関数（最終形）：

```js
// See note 1 below.
let obj = {
    name: 'aaa',
    work: salary => '工资' + salary
}
```

例の説明：

1. 引数が 1 つなら丸括弧を省略できます。関数本体が return だけなら、波括弧と return を省略できます。

これで render の省略形を理解できます。

Vue のビルドの違い

- vue.js と vue.runtime.xxx.js の違い：
  - vue.js は Vue の完全版で、コア機能とテンプレートコンパイラーを含みます。
  - vue.runtime.xxx.js は Vue の実行時版で、コア機能のみを含み、テンプレートコンパイラーはありません。
- vue.runtime.xxx.js にはコンパイラーがなく template オプションを使えないため、render が受け取る createElement で具体的な内容を指定します。

### プロジェクト作成ツールのデフォルト設定を変更する :id=h-6508711ced43

- vue inspect > output.js で、Vue のデフォルト設定を確認できます。
- vue.config.js でカスタマイズできます。詳細：[https://cli.vuejs.org/zh](https://cli.vuejs.org/zh)

### プロジェクトの index.html :id=h-68e2a818f6c8

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

例の説明：

1. IE 用の特別な設定で、IE を最上位の描画モードで動かします。
2. モバイル向けの適切なビューポートを有効にする
3. タブのアイコンを設定する
4. 外部のスタイルを取り込む
5. ページのタイトルを設定する
6. ブラウザーが JavaScript に対応しない場合、noscript 内の要素が表示されます。
7. コンテナー

<a id="section-25"></a>

## 2.2 Vue の補足知識 :id=h-f266ec2fa3c1

### ref 属性 :id=h-c2924789fa5e

- 要素や子コンポーネントの参照情報を登録し、id の代わりに使います。
- HTML タグでは実 DOM 要素、コンポーネントのタグではインスタンス（vc）を取得します。
- 使用方法：
  - 指定：`<h1 ref="xxx">.....</h1>` または `<School ref="xxx"></School>`
  - 取得：`this.$refs.xxx`

> 具体例

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

例の説明：

1. School コンポーネントを取り込む
2. 実 DOM 要素
3. 実 DOM 要素
4. School コンポーネントのインスタンス（vc）

### props オプション :id=h-41f6ef90aaa4

1. コンポーネントが外部からのデータを受け取れるようにする

2. データを渡す：`<Demo name="xxx"/>`

3. データを受け取る：

   1. 1 つ目（受け取るだけ）：`props:['name'] `

   2. 2 つ目（型を制限）：`props:{name:String}`

   3. 3 つ目（型、必須かどうか、デフォルト値を指定）：

      ```js
      ```

const componentOptions = {
props:{
name:{
type:String, // See note 1 below.
required:true, // See note 2 below.
default:'老王' // See note 3 below.
}
}
};
\`\`\`

例の説明：

1. 型
2. 必須かどうか
3. 既定値

   > props は読み取り専用です。Vue は props の変更を検知して警告します。業務上変更が必要なら、props を data にコピーし、そのデータ���変更してください。

サンプルコード：

親から子へデータを渡す

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

例の説明：

1. 最も簡単な形：props: \['name', 'age']
2. 必ず渡す必要がある

### mixin（ミックスイン） :id=h-239b26aa430a

mixin は、Vue コンポーネントの再利用可能な機能を柔軟に共有します。任意のコンポーネントオプションを含められ、コンポーネントが使うと、すべてのオプションがその設定に統合されます。

例：

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

例の説明：

1. mixin オブジェクトを定義する
2. mixin を使うコンポーネントを定義する

**オプションの統合**

コンポーネントと mixin に同名のオプションがあると、適切な方法で統合されます。

例えばデータオブジェクトは再帰的に統合し、衝突時はコンポーネントのデータを優先します。

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

同名のフックは配列にまとめ、すべて呼ばれます。mixin のフックはコンポーネント自身のフックより **先に** 呼ばれます。

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

例の説明：

1. \=> "mixin のフックが呼ばれた"
2. \=> "コンポーネントのフックが呼ばれた"

`methods`、`components`、`directives` などオブジェクトのオプションは 1 つに統合します。キー名が衝突した場合、コンポーネント側の値を採用します。

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

> グローバル mixin は推奨しません。

### プラグイン :id=h-3f36b708810c

プラグインは通常 Vue にグローバル機能を追加します。機能の範囲に厳密な制限はありません。

`Vue.use()` でプラグインを使います。`new Vue()` でアプリケーションを起動する前に行う必要があります。

```js
// See note 1 below.
Vue.use(MyPlugin)

new Vue({
  // See note 2 below.
})
```

例の説明：

1. 'MyPlugin.install(Vue)' を呼ぶ
2. ...コンポーネントのオプション

本質は install メソッドを持つオブジェクトです。第 1 引数は Vue、第 2 引数以降は利用者が渡すデータです。

プラグインを定義する：

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

例の説明：

1. 1. グローバルフィルターを追加する
2. 2. グローバルディレクティブを追加する
3. 3. グローバル mixin を設定する
4. 4. インスタンスメソッドを追加する

具体例：

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

例の説明：

1. グローバルフィルター
2. グローバルディレクティブを定義する
3. ディレクティブと要素の初回バインド成功時
4. 対象要素がページに挿入されたとき
5. ディレクティブを含むテンプレートが再解析されたとき
6. ミックスインの定義
7. Vueのプロトタイプにメソッドを追加し、vmとvcの両方で使用できるようにする

main.js

```js
// See note 1 below.
import plugin from './plugin'

// See note 2 below.
Vue.use(plugin)
```

例の説明：

1. プラグインのインポート
2. プラグインの使用

これで他のコンポーネントでもプラグインの機能を使用できます。

### スコープ付きスタイル :id=h-819df990ff37

1. 役割：スタイルを局所的に適用し、競合を防ぎます。
2. 記法：`<style scoped>`

具体例：

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

### TodoListの例のまとめ :id=h-cf7ca991ea78

1. コンポーネントによる実装の流れ：

   ```
   (1).拆分静态组件：组件要按照功能点拆分，命名不要与html元素冲突。

   (2).实现动态组件：考虑好数据的存放位置，数据是一个组件在用，还是一些组件在用：

           1).一个组件在用：放在组件自身即可。

           2). 一些组件在用：放在他们共同的父组件上（<span style="color:red">状态提升</span>）。

   (3).实现交互：从绑定事件开始。
   ```

2. propsが適する用途：

   ```
   (1).父组件 ==> 子组件 通信

   (2).子组件 ==> 父组件 通信（要求父先给子一个函数）
   ```

3. v-modelでは、propsから渡された値をバインドしないことを忘れないでください。propsは変更してはいけません。

4. propsがオブジェクトの場合、そのプロパティを変更してもVueはエラーにしませんが、推奨しません。

<a id="section-26"></a>

## 2.3 ブラウザーのローカルストレージ :id=h-d3bd6553c6d5

### Cookie :id=h-e1a7251daccc

Cookieは最初に提案されたローカル保存の方式です。それ以前は、サーバーはネットワーク上の2つのリクエストが同じユーザーからか判断できず、この問題を解決するためにCookieが生まれました。Cookieはユーザーのブラウザーに保存する4 KB以下の文字列で、名前（Name）、値（Value）、有効期限、安全性、適用範囲を制御する任意の属性から成ります。異なるドメインのCookieは独立しています。ブラウザーはDomain、Path、Secure、SameSite、有効期限、リクエストの認証情報などに従って送信を判断し、現在のドメインの全Cookieを送るわけではありません。

**Cookieの特徴：**

- 作成済みのCookieの名前は変更できない
- Cookieはドメインをまたげず、aドメインとbドメインのCookieは共有できません。これはプライバシーと安全性のためで、他サイトのCookieの不正取得を防ぎます。
- Cookieの個数とサイズの制限はブラウザーによって異なり、各ドメイン20個と固定はできません。1個の一般的な上限は約4 KiBです。
- 安全性の問題があります。Cookieが傍受されるとセッションのすべての情報を取得でき、暗号化しても転送攻撃には効果がありません。意味を理解せずとも、Cookieを転送するだけで目的を果たせます。
- 新しいページを要求するたびにCookieが送信される

**認証におけるCookieの役割**

クライアントの初回リクエストに対し、サーバーは応答ヘッダーで認証用Cookieを送り、クライアントは自動的にブラウザーへ保存します。

その後サーバーを要求するたびに、ブラウザーは認証用Cookieをリクエストヘッダーで自動送信し、サーバーがクライアントを識別します。

![ここに画像の説明を挿入](Resources/vue2/e29b7e0bef784bc5b6b8ed50b0d8a509.png)

**Cookieには安全性がない**

Cookieはブラウザーに保存され、ブラウザーには読み書きのAPIもあるため、偽造しやすく安全ではありません。そのため、サーバーは重要な個人データをCookieとしてブラウザーへ送ることを推奨しません。

> 注意：ユーザーの識別情報やパスワードなど、重要な個人データをCookieに保存してはいけません。

### Session :id=h-0d0817606198

Sessionはクライアントの状態を記録する別の仕組みです。Cookieはクライアントのブラウザーに、Sessionはサーバーに保存されます。ブラウザーがアクセスすると、サーバーはクライアントの情報を何らかの形で記録し、これをSessionと呼びます。再訪時はSessionから状態を検索できます。Sessionは特殊なCookieではなく、Cookieはサーバー側Sessionを検索する識別子を保持できます。Cookieはクライアント側、Sessionはサーバー側に保存されます。

**なぜSessionを使うのか** Cookieはユーザー側にあり、保存容量も限られ、特にユーザーが確認、変更できるため安全ではありません。安全に、かつ全体から便利に情報を読むため、新しいセッション保存方式としてSessionが生まれました。

**Sessionの原理** 初回リクエスト時にサーバーはSessionを作成して保存し、そのIDをCookieとしてクライアントへ渡します。その後のリクエストではブラウザーがこのCookie（SessionデータのID）を自動的に付けてアクセスします。

> 図：

![ここに画像の説明を挿入](Resources/vue2/18768cbd3ece4e73b98c8e3be8cec422.png)

> Sessionは、Cookieで渡された値を使って内容を検索するテーブルと考えると分かりやすいと思います。

**Sessionの標準的な処理フロー**

![ここに画像の説明を挿入](Resources/vue2/10472e8e03924340a452523ae678de02.png)

node.jsでSessionの使い方を詳しく実演しました。別の記事を参照してください：[https://blog.csdn.net/hangao233/article/details/123089029](https://blog.csdn.net/hangao233/article/details/123089029)

### LocalStorage :id=h-f3bcde9bedac

LocalStorageはHTML5で導入された機能です。保存する情報が大きくCookieでは足りない場合、LocalStorageが役立ちます。

**LocalStorageの利点：**

- LocalStorageは通常5 MBあり、より多くの情報を保存できます。
- LocalStorageは永続的で、ページを閉じても消えず、明示的に消去しなければ残り続けます。
- Cookieのように毎回のHTTPリクエストで送られず、ローカルだけに保存

**LocalStorageの欠点：**

- ブラウザー互換性の問題があり、IE8より前のバージョンでは未対応
- プライベートモードでも通常localStorageは使えますが、容量、寿命、制限はブラウザー次第で、ウィンドウを閉じると削除される場合があります。アクセス時の例外にも対応します。
- LocalStorageには同一オリジンポリシーの制限があり、ポート、プロトコル、ホストのどれかが異なるとアクセスできません。

**LocalStorageの主なAPI：**

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

例の説明：

1. localStorageへデータを保存
2. localStorageからデータを取得
3. localStorageから保存済みデータを削除
4. localStorageから保存済みデータをすべて削除
5. 指定した添字のキーを取得

**LocalStorageの使用場面：**

- テーマを変更できるサイトでは、その情報をローカルのLocalStorageに保存し、変更時にLocalStorageを直接操作できます。
- サイトの閲覧情報や、あまり変わらない一部の個人情報も、ローカルのLocalStorageやLocalStorageに保存できます。

### SessionStorage :id=h-11f276f06e86

SessionStorageとLocalStorageはHTML5で導入された保存方式です。SessionStorageは主に同じウィンドウやタブのデータを一時保存し、再読み込みでは消えず、ウィンドウやタブを閉じると削除されます。

**SessionStorageとLocalStorageの比較：**

- SessionStorageとLocalStorageはどちらも**ローカルにデータを保存**します。
- SessionStorageにも同一オリジンの制限がありますが、SessionStorageにはさらに厳しい規則があり、SessionStorage**同じブラウザーの同じウィンドウ内でのみ共有できます**。
- 自動化ブラウザーは同一オリジンのlocalStorageとsessionStorageを読めます。これらをスクレイピング対策や秘密保持の仕組みとして扱わないでください。

**SessionStorageの主なAPI：**

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

例の説明：

1. sessionStorageへデータを保存
2. sessionStorageからデータを取得
3. sessionStorageから保存済みデータを削除
4. sessionStorageから保存済みデータをすべて削除
5. 指定した添字のキーを取得

**SessionStorageの使用場面**

SessionStorageは一時的なので、ゲストのログイン情報や一時的な閲覧履歴を保存できます。サイトを閉じるとこれらの情報も消えます。

> 具体例：

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

例の説明：

1. JSONオブジェクトに変換して保存

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

例の説明：

1. JSON文字列に変換して保存

<a id="section-27"></a>

## 2.4 コンポーネントのカスタムイベント :id=h-4939c07521b4

カスタムイベントはコンポーネント間の通信方法で、<strong style="color:red">子 ===> 親</strong>に適しています。

**使用場面**

Aが親、Bが子で、BからAへデータを渡すには、AでBにカスタムイベントを登録します（<span style="color:red">コールバックはAに置きます</span>）。

**カスタムイベントの登録：**

方法1、親コンポーネント内：`<Demo @atguigu="test"/>`または`<Demo v-on:atguigu="test"/>`

> 具体的なコード

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

例の説明：

1. 親で子にカスタムイベントを登録し、子から親へデータを渡します（方法1、@またはv-on）。

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

例の説明：

1. Studentインスタンスのatguiguイベントを起動

方法2、親コンポーネント内：

`this.$refs.xxx.$on()`を使うと、タイマーを追加するなど、より柔軟に記述できます。

> 具体的なコード

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

例の説明：

1. 親で子にカスタムイベントを登録し、子から親へデータを渡します（方法2、ref）。
2. カスタムイベントを登録
3. this.$refs.student.$once('atguigu',this.getStudentName) // 1回限りのカスタムイベントを登録

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

例の説明：

1. Studentインスタンスのatguiguイベントを起動

> カスタムイベントを1回だけ起動するには、`once`修飾子または`$once`メソッドを使用します。
>
> カスタムイベントの起動：`this.$emit('atguigu',数据)`
>
> this.$emit()で子から親へデータを渡せる

**カスタムイベントの解除**`this.$off('atguigu')`

> コード

```js
this.$off('atguigu') // See note 1 below.
// See note 2 below.
// See note 3 below.
```

例の説明：

1. 1つのカスタムイベントを解除
2. this.$off(\['atguigu','demo']) // 複数のカスタムイベントを解除
3. this.$off() // すべてのカスタムイベントを解除

**コンポーネントには`native`修飾子でネイティブのDOMイベントも登録できます。**

> コード

```vue
<!-- See note 1 below. -->
<Student ref="student" @click.native="show"/>
```

例の説明：

1. 親で子にカスタムイベントを登録し、子から親へデータを渡します（方法2、ref）。

> 注意：`this.$refs.xxx.$on('atguigu',回调)`で登録する場合、コールバックは<span style="color:red">methodsに定義する</span>か、<span style="color:red">アロー関数にする</span>必要があり、そうしないとthisの参照先に問題が生じます。

<a id="section-28"></a>

## 2.5 グローバルイベントバス :id=h-222cce5d5a54

1. <span style="color:red">任意のコンポーネント間の通信</span>に適した方法です。

2. グローバルイベントバスの設置：

   ```js
   new Vue({
       /* Other Vue options can go here. */
       beforeCreate() {
           Vue.prototype.$bus = this // See note 1 below.
       },
       /* Other Vue options can go here. */
   })
   ```

例の説明：

1. グローバルイベントバスを設置。$busは現在のアプリのvm

2. イベントバスの使用：

   1. 受信：Aがデータを受け取るには、Aで$busにカスタムイベントを登録し、<span style="color:red">コールバックはA自身に置きます。</span>

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

2. データの提供：`this.$bus.$emit('xxxx',数据)`

3. beforeDestroyフックで$offを使い、<span style="color:red">現在のコンポーネントが使用する</span>イベントを解除するとよいでしょう。

> サンプルコード

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

![ここに画像の説明を挿入](Resources/vue2/86238df578224c798ab772db2798b85c.png)

![ここに画像の説明を挿入](Resources/vue2/5aeffb62c4f3462ea9b5fb7b98a1b0da.png)

<a id="section-29"></a>

## 2.6 メッセージの購読と発行 :id=h-1679fce16b39

1. <span style="color:red">任意のコンポーネント間の通信</span>に適した方法です。

2. 使用手順：

   1. pubsubのインストール：`npm i pubsub-js`

   2. インポート：`import pubsub from 'pubsub-js'`

   3. 受信：Aがデータを受け取るにはAでメッセージを購読し、<span style="color:red">購読のコールバックはA自身に置きます。</span>

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

例の説明：

1. メッセージを購読

   4. データの提供：`pubsub.publish('xxx',数据)`

   5. beforeDestroyフックで`PubSub.unsubscribe(pid)`を使って<span style="color:red">購読を解除</span>するとよいでしょう。

> サンプルコード

メッセージを購読

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

例の説明：

1. this.$bus.$on('hello',(data)=>{; console.log('Schoolコンポーネントでデータを受信しました',data); })
2. console.log('helloメッセージが発行され、コールバックが実行されました',msgName,data)

メッセージを発行

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

1. 構文：`this.$nextTick(回调函数)`
2. 役割：次のDOM更新が完了した後に、指定のコールバックを実行します。
3. 使用場面：データ変更後、更新されたDOMに基づく操作を行う場合は、nextTickに指定するコールバックで実行します。

具体例

```js
this.$nextTick(() => {
    this.$refs.inputTitle.focus();
});
```

<a id="section-31"></a>

## 2.8 Vueが提供するトランジションとアニメーション :id=h-3bd90532b19e

1. 役割：DOM要素の挿入、更新、削除時に、適切なタイミングでスタイルのクラスを付けます。

2. 図：![ここに画像の説明を挿入](Resources/vue2/9ce811248ee34fb8aa96fa0d1e6e2747.png)

3. 記法：

   1. スタイルを用意します。

      - 要素が入るときのスタイル：
        1. v-enter：入るときの開始状態
        2. v-enter-active：入っている途中
        3. v-enter-to：入るときの終了状態
      - 要素が出るときのスタイル：
        1. v-leave：出るときの開始状態
        2. v-leave-active：出ている途中
        3. v-leave-to：出るときの終了状態

   2. 対象要素を`<transition>`で囲み、name属性を設定します。

      ```html
      <transition name="hello">
          <h1 v-show="isShow">你好啊！</h1>
      </transition>
      ```

   3. 補足：複数要素のトランジションには`<transition-group>`を使用し、各要素に`key`を指定します。

具体例（単一要素のトランジション）

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

> nameにより要素ごとに異なるアニメーションを適用できる

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

具体例（複数要素のトランジション）

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

例の説明：

1. 入るときの開始状態、出るときの終了状態
2. 入るときの終了状態、出るときの開始状態

> 第三者ライブラリの具体例（軽く見る程度でよく、ここでは重要ではありません）。名前：Animate.css。インストール：npm i animate.css。読み込み：import 'animate.css'。

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

## 2.9 Vue CLIのプロキシ設定 :id=h-e1b1613463f0

クロスオリジンの問題を解決できます。![ここに画像の説明を挿入](Resources/vue2/01ae5e73323a4c83b097ea9705c90dbf.png)

> AJAXはフロントエンドの技術で、ブラウザーがあって初めてwindowとXHRが存在し、AJAXリクエストを送れます。サーバー間の通信には通常のHTTPリクエストを使えばよいです。

### 方法1 :id=h-31b8201e30a9

```
在vue.config.js中添加如下配置：
```

```js
devServer:{
  proxy:"http://localhost:5000"
}
```

説明：

1. 利点：設定が簡単で、リソースの要求をフロントエンド（8080）へ直接送れます。
2. 欠点：複数のプロキシを設定できず、プロキシを使うか柔軟に制御できません。
3. 動作：上記のプロキシ設定では、フロントエンドに存在しないリソースの要求をサーバーへ転送します。フロントエンドのリソースが優先されます。

### 方法2 :id=h-ec74fd4a626c

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

例の説明：

1. '/api1'で始まるすべてのリクエストパスに一致
2. プロキシ転送先の基底パス
3. プロキシが実サーバーへリクエストを転送するとき/api1を除去
4. '/api2'で始まるすべてのリクエストパスに一致
5. プロキシ転送先の基底パス
6. changeOriginがtrueならサーバーの受信ヘッダーのhostはlocalhost:5000、changeOriginがfalseならlocalhost:8080になります。changeOriginの既定値はtrueです。

説明：

1. 利点：複数プロキシを設定でき、使用するか柔軟に制御できます。
2. 欠点：設定がやや複雑で、リソースの要求に接頭辞が必要です。

<a id="section-33"></a>

## 2.10 スロット :id=h-75eccf4cdc99

1. 役割：親が子の指定位置にHTML構造を挿入できます。コンポーネント間の通信方法でもあり、<strong style="color:red">親 ===> 子</strong>に適します。

2. 種類：デフォルトスロット、名前付きスロット、スコープ付きスロット

3. 使用方法：

   1. デフォルトスロット：

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

例の説明：

1. スロットを定義

   2. 名前付きスロット：

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

例の説明：

1. スロットを定義

   3. スコープ付きスロット：

      1. 理解：<span style="color:red">データは子自身にありますが、それを使って生成する構造は利用側の親が決めます。</span> gamesはCategory（子）にあり、走査して生成する構造はApp（親）が決定します。

      2. 具体的な実装：

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

例の説明：

1. ulリストを生成
2. h4見出しを生成
3. データバインドにより子のデータを親へ渡せる
4. データは子自身にある

<a id="section-34"></a>

# 3. VUEX :id=h-c27862ebda15

仕組みの図：

![ここに画像の説明を挿入](Resources/vue2/b892bbf299b94d1db68bf657b5e0746a.png)

<a id="section-35"></a>

## 3.1 概念 :id=h-e9270bf4ee42

```
    在Vue中实现集中式状态（数据）管理的一个Vue插件，对vue应用中多个组件的共享状态进行集中式的管理（读/写），也是一种组件间通信的方式，且适用于任意组件间通信。
```

<a id="section-36"></a>

## 3.2 使用する場面 :id=h-66423436124d

```
    多个组件需要共享数据时
```

<a id="section-37"></a>

## 3.3 Vuex環境の構築 :id=h-c1efe3d2143d

1. ファイル作成：`src/store/index.js`

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

例の説明：

1. Vueのコアライブラリをインポート

2. Vuexをインポート

3. Vuexプラグインを適用

4. コンポーネント内のユーザー操作に応答するactionsオブジェクトを用意

5. stateのデータを変更するmutationsオブジェクトを用意

6. 具体的なデータを保持するstateオブジェクトを用意

7. storeを作成してエクスポート

8. `main.js`でvmを作る際に`store`設定を渡す

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

例の説明：

1. storeをインポート
2. vmを作成

<a id="section-38"></a>

## 3.4 基本的な使用方法 :id=h-67b4612fb71b

1. `store.js`でデータを初期化し、`actions`と`mutations`を設定

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

例の説明：

1. Vueのコアライブラリをインポート

2. Vuexをインポート

3. Vuexを使用

4. コンポーネントの加算操作に応答

5. console.log('actionsのjiaが呼び出されました',miniStore,value)

6. 加算を実行

7. console.log('mutationsのJIAが呼び出されました',state,value)

8. データを初期化

9. storeを作成してエクスポート

10. コンポーネントでVuexのデータを読む：`$store.state.sum`

11. コンポーネントでVuexのデータを変更：`$store.dispatch('action中的方法名',数据)`または`$store.commit('mutations中的方法名',数据)`

    > 補足：ネットワークリクエストや他の業務処理がなければ、コンポーネントはactionsを経由せず、`dispatch`を書かずに直接`commit`を呼べます。

具体例：

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

例の説明：

1. このファイルはVuexの中核となるstoreを作成
2. Vuexをインポート
3. Vuexプラグインを適用
4. コンポーネントの操作に応答するactionsを用意
5. jia(context,value){; console.log('actionsのjiaが呼び出されました'); context.commit('JIA',value); },; jian(context,value){; console.log('actionsのjianが呼び出されました'); context.commit('JIAN',value); },
6. データ（state）を操作するmutationsを用意
7. データを保存するstateを用意
8. 現在の合計
9. storeを作成してエクスポート

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

例の説明：

1. ユーザーが選んだ数字
2. commitはmutationsを操作
3. commitはmutationsを操作
4. dispatchはactionsを操作
5. dispatchはactionsを操作

<a id="section-39"></a>

## 3.5 gettersの使用 :id=h-82703922c5ef

1. 概念：state内のデータを加工して使う場合にgettersを利用できます。

2. `store.js`に`getters`設定を追加

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

例の説明：

1. storeを作成してエクスポート

2. コンポーネントでデータを読む：`$store.getters.bigSum`

<a id="section-40"></a>

## 3.6 4つのmapメソッドの使用 :id=h-929b2578a959

インポート

```js
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
```

1. <strong>mapStateメソッド</strong>は、`state`のデータを算出プロパティに対応付けます。

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

例の説明：

1. mapGettersで算出プロパティbigSumを生成（オブジェクト形式）

2. mapGettersで算出プロパティbigSumを生成（配列形式）

3. <strong>mapActionsメソッド</strong>は`actions`を呼び出すメソッド、つまり`$store.dispatch(xxx)`を含む関数を生成します。

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

例の説明：

1. mapActionsでincrement、decrementを生成（オブジェクト形式）
2. mapMutationsでJIA、JIANを生成（オブジェクト形式）

> 補足：mapActionsやmapMutationsで引数が必要な場合は、テンプレートのイベント登録で指定します。指定しないとイベントオブジェクトが渡されます。

具体例：

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

例の説明：

1. mapActionsとmapMutationsを使う場合は明示的に引数を渡す
2. ユーザーが選んだ数字

<a id="section-41"></a>

## 3.7 モジュール化と名前空間 :id=h-e508d8d01851

1. 目的：保守しやすくし、各種データの分類を明確にします。

2. `store.js`を変更

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

例の説明：

1. 名前空間を有効にする

2. 名前空間を有効にする

3. 名前空間を有効にした後、コンポーネントから state のデータを読み取るには：

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

例の説明：

1. 方法1：直接読む

2. 方法 2：mapGetters を使って取得する：

3. 名前空間を有効にした後、コンポーネントから dispatch を呼び出す。

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

例の説明：

1. 方法 1：commit を直接呼び出す
2. 方法 2：mapMutations を使う：

具体例：
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

例の説明：

1. 加算に関する設定
2. 現在の合計

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

例の説明：

1. 人員管理に関する設定

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

例の説明：

1. このファイルはVuexの中核となるstoreを作成
2. Vuexをインポート
3. Vuexプラグインを適用
4. storeを作成してエクスポート

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

例の説明：

1. ユーザーが選んだ数字
2. mapStateでstateのデータを読む算出プロパティを生成（配列形式）
3. mapGettersでgettersのデータを読む算出プロパティを生成（配列形式）
4. mapMutationsで、commitによりmutationsを呼ぶメソッドを生成（オブジェクト形式）
5. mapActionsで、dispatchによりactionsを呼ぶメソッドを生成（オブジェクト形式）

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

# 4. ルーティング :id=h-6223adc27b5c

1. 理解：ルート（route）はkey-valueの対応関係で、複数のルートをルーター（router）が管理します。
2. フロントエンドのルートでは、keyがパス、valueがコンポーネントです。

<a id="section-43"></a>

## 4.1 基本的な使用方法 :id=h-73fd3f12c2d8

1. vue-routerのインストール：`npm i vue-router@3`

2. プラグインを適用：`Vue.use(VueRouter)`

3. routerの設定を記述します。

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

例の説明：

1. VueRouterをインポート

2. Luyouコンポーネントをインポート

3. routerインスタンスを作成し、複数のルーティング規則を管理

4. routerをエクスポート

5. 切り替えを実装。active-classで強調表示のスタイルを設定可能

   ```html
   <router-link active-class="active" to="/about">About</router-link>
   ```

6. 表示位置を指定

   ```html
   <router-view></router-view>
   ```

<a id="section-44"></a>

## 4.2 注意点 :id=h-49a4dd40ec62

1. ルートコンポーネントは通常`pages`、一般のコンポーネントは通常`components`フォルダーに置きます。
2. 切り替えで「非表示」になったルートコンポーネントは、既定で破棄され、必要時に再マウントされます。
3. 各コンポーネントは、自身のルート情報を持つ`$route`プロパティを持ちます。
4. アプリ全体のrouterは1つで、コンポーネントの`$router`プロパティで取得できます。

<a id="section-45"></a>

## 4.3 入れ子のルート（複数階層） :id=h-675ddfe7eca1

1. children設定でルーティング規則を記述します。

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

例の説明：

1. childrenで子ルートを設定

2. ここに/newsと書いてはいけない

3. ここに/messageと書いてはいけない

4. 完全なパスを記述して移動します。

   ```html
   <router-link to="/home/news">News</router-link>
   ```

5. 表示位置を指定

   ```html
   <router-view></router-view>
   ```

<a id="section-46"></a>

## 4.4 ルートのqueryパラメーター :id=h-8aa08feb60b5

1. パラメーターを渡す

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

例の説明：

1. queryパラメーター付きの移動、toの文字列形式

2. queryパラメーター付きの移動、toのオブジェクト形式

3. パラメーターの受け取り：

   ```html
   $route.query.id
   $route.query.title
   ```

<a id="section-47"></a>

## 4.5 名前付きルート :id=h-1c5407bc3b5f

1. 役割：ルートへの移動を簡略化します。

2. 使用方法

   1. ルートに名前を付けます。

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

例の説明：

1. ルートに名前を付ける

   2. 移動を簡略化します。

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

例の説明：

1. 簡略化前は完全なパスが必要
2. 簡略化後は名前で直接移動
3. パラメーターを渡す簡略記法

<a id="section-48"></a>

## 4.6 ルートのparamsパラメーター :id=h-2f88916c7fd5

1. ルートを設定し、受け取るparamsパラメーターを宣言

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

例の説明：

1. params付きの移動、toの文字列形式

2. params付きの移動、toのオブジェクト形式

   > 特に注意：paramsを渡す際にtoのオブジェクト形式を使う場合、path設定は使えず、必ずnameを指定します。

3. パラメーターの受け取り：

   ```js
   $route.params.id
   $route.params.title
   ```

<a id="section-49"></a>

## 4.7 ルートのprops設定 :id=h-4e4f89cdad7a

役割：ルートコンポーネントがパラメーターを受け取りやすくする

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

例の説明：

1. 方法1：propsがオブジェクトなら、すべてのkey-valueの組をpropsとしてDetailへ渡します。
2. 方法2：propsが真偽値でtrueなら、受け取ったすべてのparamsをpropsとしてDetailへ渡します。
3. 方法3：propsが関数なら、戻り値のオブジェクトの各key-valueをpropsとしてDetailへ渡します。

> 移動先のコンポーネントをより簡潔に書く方法

移動先コンポーネントの具体的なコード

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

## 4.8 `<router-link>`のreplace属性 :id=h-d2f9b5a528f5

1. 役割：ルート移動時のブラウザー履歴の操作方式を制御
2. ブラウザー履歴の書き込みには`push`と`replace`があり、`push`は履歴を追加し、`replace`は現在の履歴を置換します。ルート移動の既定は`push`です。
3. `replace`モードの有効化：`<router-link replace .......>News</router-link>`

<a id="section-51"></a>

## 4.9 プログラムによるナビゲーション :id=h-bda74fe5c6b7

1. 役割：`<router-link> `を使わず、柔軟にルートを移動する

2. 具体的な実装：

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

例の説明：

1. $routerの2つのAPI
2. 進む
3. 戻る
4. 前後どちらにも移動可能

<a id="section-52"></a>

## 4.10 ルートコンポーネントのキャッシュ :id=h-468de23e0eab

1. 役割：非表示のルートコンポーネントを破棄せずマウントしたままにします。

2. 具体的な実装：

   このincludeはコンポーネント名を指す

   ```html
   <keep-alive include="News">
       <router-view></router-view>
   </keep-alive>
   ```

<a id="section-53"></a>

## 4.11 2つの新しいライフサイクルフック :id=h-ab2c62bebae2

役割：KeepAliveがキャッシュしたコンポーネントのアクティブ状態の開始、終了で発生し、ルートコンポーネントに限定されません。具体的な名前：

- `activated`はルートコンポーネントのアクティブ化時に発生します。
- `deactivated`はルートコンポーネントの非アクティブ化時に発生します。

> これらのフックは前述のルートコンポーネントのキャッシュと組み合わせて使い、キャッシュしなければ機能しません。

<a id="section-54"></a>

## 4.12 ナビゲーションガード :id=h-4e877c542d97

1. 役割：ルートのアクセス権を制御

2. 種類：グローバルガード、ルート単位のガード、コンポーネント内のガード

3. グローバルガード：

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

例の説明：

1. グローバルな前置ガード：初期化時と各ルート切り替え前に実行
2. 現在のルートにアクセス制御が必要か判断
3. 具体的なアクセス制御の規則
4. 移動を許可
5. 移動を許可
6. グローバルな後置ガード：初期化時と各ルート切り替え後に実行
7. ページのtitleを変更

   完全なコード

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

例の説明：

1. このファイルはアプリ全体のルーターを作成

2. コンポーネントをインポート

3. ルーターを作成してエクスポート

4. グローバルな前置ナビゲーションガード：初期化時と各ルート変更前に呼び出す

5. 移動を許可

6. グローバルな後置ナビゲーションガード：初期化時と各ルート変更後に呼び出す

7. ルート単位のガード：

> routesの子ルート内にガードを記述

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

例の説明：

1. 現在のルートにアクセス制御が必要か判断

![ここに画像の説明を挿入](Resources/vue2/d8b1f996e81a48a2a33a41fce71c25d5.png)

5. コンポーネント内のガード：

> 対象コンポーネント内にガードを記述

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

例の説明：

1. 進入ガード：ルーティング規則によりコンポーネントへ入るときに呼び出す
2. 離脱ガード：ルーティング規則によりコンポーネントを離れるときに呼び出す

![ここに画像の説明を挿入](Resources/vue2/a1180709cc80417c9266343e7ec1637e.png)

<a id="section-55"></a>

## 4.13 ルーターの2つの動作モード :id=h-97de4f68c7f0

1. URLのhash値とは、#とそれ以降の内容です。

2. hash値はHTTPリクエストに含まれず、サーバーへ送られません。

3. hashモード：

   1. アドレスに常に#が付き、見栄えがよくありません。
   2. 第三者のスマホアプリで共有すると、厳格な検証で不正なアドレスと判定される場合があります。
   3. 互換性は比較的良好です。

4. historyモード：

   1. すっきりとした見栄えのよいアドレスです。
   2. hashモードより互換性がやや劣ります。
   3. 本番へのデプロイには、ページ再読み込み時のサーバー404を解決するためバックエンド側の対応が必要です。

![ここに画像の説明を挿入](Resources/vue2/f0f05b4791944844a8ea9d496e2710f9.png)

参考記事：

1. 尚硅谷のVue講義：[https://www.bilibili.com/video/BV1Zy4y1K7SH?p=77\&spm_id_from=pageDriver](https://www.bilibili.com/video/BV1Zy4y1K7SH?p=77\&spm_id_from=pageDriver)
2. 現代のJavaScript：[https://zh.javascript.info/](https://zh.javascript.info/)
3. MDNドキュメント：[https://developer.mozilla.org/zh-CN/docs/Web](https://developer.mozilla.org/zh-CN/docs/Web)
4. 私はあなたのスーパーヒーロー [https://juejin.cn/post/6844903895467032589](https://juejin.cn/post/6844903895467032589)
