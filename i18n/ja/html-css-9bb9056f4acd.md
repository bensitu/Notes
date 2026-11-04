# HTML と CSS の基礎 :id=h-74b3f3ffc8f6

Web ページの内容構造、フォーム、スタイルを学び、開発時にタグ、リクエスト形式、CSS の規則を確認します。

**前提知識とバージョン：** フレームワークの経験は不要です。ブラウザーが HTML と CSS を解析します。タグの例は有効な HTML ファイル内に配置し、フォーム送信には実際に受信するアドレスも用意する必要があります。

**サンプルの使い方：** 全ファイルと実行手順が明示されたプロジェクトを除き、コードブロックは各節の独立した断片です。省略記号や仮の名前は補ってください。誤りと記された行は問題を説明するためのものです。同じ節の代替コードを組み合わせないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://html.spec.whatwg.org/multipage/)

**このページの目次**

- [第 1 章 HTML と CSS](#section-1)
- [1. HTML の要素](#section-2)
- [2. HTML のページ](#section-3)
- [3. よく使う要素](#section-4)
- [4. HTTP リクエスト](#section-5)
- [5. CSS](#section-6)

この記事は初めて Web 開発に触れる読者向けです。HTML が内容の構造、CSS が外観、JavaScript が操作への反応を担当します。まず簡単な HTML ファイルをブラウザーで開き、各節で要素やスタイルを追加してください。続く JavaScript、Vue、TypeScript の文書では別の内容を扱います。この記事には React や jQuery の完全なチュートリアルは含まれません。

コードの断片は HTML ファイルの適切な位置に置いてください。同じ節にある複数のタグの例は独立した書き方なので、すべてを 1 ページに組み込む必要はありません。

<a id="section-1"></a>

# 第 1 章 HTML と CSS :id=h-a2285106b58f

HTML とは：HyperText Markup Language（ハイパーテキストマークアップ言語）の略です。普段見る Web ページはこれで記述され、HTML はページの内容と構造を定義します。

- HyperText は、ハイパーリンクで Web ページを整理し、相互に結び付けることを意味します。
- Markup は、`<标签>` を使って内容にさまざまな機能や意味を与えることです。

CSS とは：Cascading Style Sheets（カスケーディングスタイルシート）の略で、Web ページの表現や表示を記述します。

<a id="section-2"></a>

## 1. HTML の要素 :id=h-f12b2d002a13

HTML は一連の要素（`elements`）から成ります。例えば、次のとおりです。

```html
<p>Hello, world!</p>
```

- 全体を要素と呼びます。

- `<p>` と `</p>` を、それぞれ開始タグと終了タグと呼びます。

- タグで囲まれた Hello, world を内容と呼びます。

- p は定義済みの HTML タグで、内容を独立した段落にします。

要素は属性も持てます。例えば、次のとおりです。

```html
<p id="p1">Hello, world!</p>
```

- 属性は一般にあらかじめ定義されています。ここでの id 属性は、要素に一意の識別子を与えます。

要素は入れ子にできます。例えば、次のとおりです。

```html
<p>HTML 是一门非常<b>强大</b>的语言</p>
```

誤った入れ子の書き方：

```html
<p>HTML 是一门非常<b>强大的语言</p></b>
```

内容を持たない要素を空要素と呼びます。例えば、次のとおりです。

```html
<img src="1.png">
<img src="1.png"/>
```

- img は画像を表示します。
- src 属性は画像のパスを指定します。

<a id="section-3"></a>

## 2. HTML のページ :id=h-cef4c9cc0660

ここまで紹介した個々の HTML 要素は、完全な HTML ページの構成要素になります。

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

- `html` 要素はページ内のほかのすべての要素を含みます。ページ全体に 1 つだけ必要で、ルート要素と呼びます。
- `head` 要素には、`title`、`link`、`meta` など、ページの内容を表示するためではない要素を含めます。
- `body` 要素には、後で学ぶテキスト、画像、動画、音声など、ユーザーに内容を表示する要素を含めます。

<a id="section-4"></a>

## 3. よく使う要素 :id=h-749873704944

### 1）テキスト :id=h-27194da8f7b2

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

順序なしリスト（unordered list）

```html
<ul>
    <li>列表项1</li>
    <li>列表项2</li>
    <li>列表项3</li>
</ul>
```

順序付きリスト

```html
<ol>
    <li>列表项1</li>
    <li>列表项2</li>
    <li>列表项3</li>
</ol>
```

多段階のリスト

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

アンカー、ハイパーリンク

```html
<a href="网页地址">超链接文本</a>
```

### 2）マルチメディア :id=h-498d75f4c32a

#### Image :id=h-63e9a21fe8be

```html
<img src="文件路径">
```

src には 3 種類の形式があります。

- ファイルのアドレス

- data URL。形式は次のとおりです。

  ```
  data:媒体类型;base64,数据
  ```

- object URL。JavaScript と組み合わせて使います。

#### Video :id=h-57742c04bc4b

```html
<video src="文件路径"></video>
```

#### Audio :id=h-d092c1fe90db

```html
<audio src="文件路径"></audio>
```

### 3）フォーム :id=h-c7596abba6dd

#### 役割と構文 :id=h-1a8c45148395

フォームはユーザーが入力した **データ** を **収集** し、**サーバーへ送信** します。

フォームの構文

```html
<form action="服务器地址" method="请求方式" enctype="数据格式">
    <!-- See note 1 below. -->

    <input type="submit" value="提交按钮">
</form>
```

例の説明：

1. フォーム項目

- method に指定するリクエストメソッドには次があります。
  - get（デフォルト）：送信時、データは URL アドレスの後ろに付きます。
  - post：データはリクエスト本文に入ります。
- enctype は post リクエストの本文のデータ形式を指定します。
  - application/x-www-form-urlencoded（デフォルト）
  - multipart/form-data
- フォーム項目は、データを収集するさまざまな方法を提供します。
  - name 属性を持つフォーム項目のデータだけがサーバーに送られます。

#### よく使うフォーム項目 :id=h-e8023407856c

テキスト入力欄

```html
<input type="text" name="uesrname">
```

パスワード入力欄

```html
<input type="password" name="password">
```

隠しフィールド

```html
<input type="hidden" name="id">
```

日付入力欄

```html
<input type="date" name="birthday">
```

単一選択

```html
<input type="radio" name="sex" value="男" checked>
<input type="radio" name="sex" value="女">
```

複数選択

```html
<input type="checkbox" name="fav" value="唱歌">
<input type="checkbox" name="fav" value="逛街">
<input type="checkbox" name="fav" value="游戏">
```

ファイルアップロード

```html
<input type="file" name="avatar">
```

<a id="section-5"></a>

## 4. HTTP リクエスト :id=h-b0aa1ccb65cb

### 1）リクエストの構成 :id=h-fb6ce57a7090

リクエストは 3 つの部分から成ります。

1. リクエスト行
2. リクエストヘッダー
3. リクエスト本文

telnet プログラムでテストできます。

### 2）リクエストメソッドとデータ形式 :id=h-45af69c1a0da

#### GET リクエストの例 :id=h-7c79b517906a

```
GET /test2?name=%E5%BC%A0&age=20 HTTP/1.1
Host: localhost
```

- %E5%BC%A0 は、文字「张」を URL エンコードした結果です。

#### POST リクエストの例 :id=h-ea84220e83cf

```
POST /test2 HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded
Content-Length: 21

name=%E5%BC%A0&age=18
```

application/x-www-form-urlencoded 形式の詳細：

- パラメーターは名前と値に分かれ、その間を = で区切ります。
- 複数のパラメーターは & で区切ります。
- 「张」などの特殊文字は、encodeURIComponent() で「%E5%BC%A0」にエンコードしてから送信する必要があります。

#### JSON リクエストの例 :id=h-f5e06406f056

```
POST /test3 HTTP/1.1
Host: localhost
Content-Type: application/json
Content-Length: 25

{"name":"zhang","age":18}
```

JSON オブジェクトの形式

```
{"属性名":属性值}
```

プロパティの値には次を指定できます。

- 文字列 ""
- 数値
- true, false
- null
- オブジェクト
- 配列

JSON 配列の形式

```
[元素1, 元素2, ...]
```

#### multipart リクエストの例 :id=h-928182d2d324

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

- boundary=123 は区切り文字列を定義します。
- 開始区切りは `--分隔符` です。
- 終了区切りは `--分隔符--` です。

#### データ形式のまとめ :id=h-5fe40a07e974

クライアントからの送信

- エンコード
  - application/x-www-form-urlencoded：URL エンコード
  - application/json：UTF-8 エンコード
  - multipart/form-data：各パートで異なるエンコードを使えます。
- 標準の HTML フォームは application/x-www-form-urlencoded、multipart/form-data、text/plain に対応し、最初の 2 つが特によく使われます。JSON を送るには通常 JavaScript からリクエストを送ります。
- ファイルアップロードには multipart/form-data 形式が必要です。
- JavaScript のコードなら任意の形式でデータを送信できます。

サーバーでの受信

- Spring は application/x-www-form-urlencoded と multipart/form-data のデータを同じ方法で受信します。JavaBean のプロパティ名をリクエストパラメーター名に対応させればよいです。
- Spring で application/json 形式のデータを受信するには、@RequestBody アノテーションと JavaBean を組み合わせます。

### 3）session の仕組み :id=h-fc700102c3f0

HTTP はステートレスで、セッションを別途利用する

- ステートレスとはリクエストが互いに独立し、最初のリクエストのデータを次のリクエストがそのまま再利用できないことです。
- セッションがあるとは、クライアントとサーバーの両方にデータを一時保存する技術があり、リクエスト間でデータを共有できることです。

サーバーは session の仕組みでデータを一時保存します。

保存

```
GET /s1?name=zhang HTTP/1.1
Host: localhost
```

取得

```
GET /s2 HTTP/1.1
Host: localhost
Cookie: JSESSIONID=560FA845D02AE09B176E1BC5D9816A5D
```

session による認証の実装

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

### 4）JWT の仕組み :id=h-fd284e53e42b

JWT による認証の実装

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

トークンを生成する

```
GET /j1?name=zhang&pass=123 HTTP/1.1
Host: localhost
```

トークンを検証する

```
GET /j2 HTTP/1.1
Host: localhost
Authorization: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9._1-P_TLlzQPb1_lCyGwplMZaKQ8Mcw_plBbYPZ3OX28
```

<a id="section-6"></a>

## 5. CSS :id=h-ea8e39d54d32

Cascading Style Sheets は Web ページの表現や表示を記述します。

### 1）セレクター :id=h-6083ad8d88fa

- type セレクター：タグ名で一致させます（要素セレクター）。

- class セレクター：要素の class 属性で一致させます。

- id セレクター：要素の id 属性で一致させます。

### 2）プロパティと値 :id=h-10f5d043cfad

- background-color : red;
- ...
- display

### 3）レイアウト :id=h-e146896582e1

レイアウトに関係する HTML 要素

- div
- template
