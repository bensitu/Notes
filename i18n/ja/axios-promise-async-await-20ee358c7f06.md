# Axios、Promise、async/await :id=h-3c801620a67b

リクエストパラメーター、レスポンスのエラー、非同期処理の順序を理解し、開発時に HTTP メソッドや Promise の動作を確認します。

**前提知識とバージョン：** 先に JavaScript の関数とオブジェクトを学んでください。この記事では Axios 1.x と ES2017 以降を使用します。await は非同期関数内で使用します。

**サンプルの使い方：** 全ファイルと実行手順が明示されたプロジェクトを除き、コードブロックは各節の独立した断片です。省略記号や仮の名前は補ってください。誤りと記された行は問題を説明するためのものです。同じ節の代替コードを組み合わせないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://axios-http.com/docs/intro)

**このページの目次**

- [3 つの関係](#section-1)
- [HTTP メソッドとパラメーターの早見表](#section-2)
- [GET、POST、PUT、DELETE](#section-3)
- [JSON、フォーム、ファイル](#section-4)
- [レスポンスとエラー](#section-5)
- [デフォルト設定とインターセプター](#section-6)
- [キャンセルと古い結果による上書きの防止](#section-7)
- [Promise の基本動作](#section-8)
- [メソッドチェーン](#section-9)
- [async/await と逐次実行・並行実行](#section-10)
- [開発時の簡単なトラブルシューティング](#section-11)

<a id="section-1"></a>

## 3 つの関係 :id=h-b5e7092a9071

Promise は「将来、成功して値が得られるか、失敗してエラーが得られること」を表します。async/await は Promise を扱うための構文です。Axios は HTTP リクエストを送るライブラリで、リクエストメソッドは Promise を返します。

ネットワークリクエストは引き続き非同期です。await は現在の関数の後続処理だけを一時停止し、JavaScript スレッド全体をブロックしません。

この記事では Axios 1.x を使います。npm プロジェクトに axios\@1 をインストールし、実際のバージョンを記録する package-lock.json をコミットします。ブラウザーの例はビルドツールが管理するモジュールに置き、Node.js の例では ES モジュールに対応するプロジェクトを使用します。

```sh
npm install axios@1
```

```javascript
import axios from "axios";
```

<a id="section-2"></a>

## HTTP メソッドとパラメーターの早見表 :id=h-1f57bd29ac82

HTTP メソッドはリクエストの意図を表し、Axios 独自の CRUD の規則ではありません。GET は読み取り、POST は処理のための送信、PUT は対象リソースの置換、PATCH は部分更新、DELETE は削除に使います。具体的な API の動作はバックエンドと取り決める必要があります。

| メソッド                           | 第 2 引数 | リクエスト本文の指定場所                                    |
| ------------------------------ | ------ | ----------------------------------------------- |
| axios.get(url, config)         | 設定     | ブラウザーの GET は本文を送信しません。クエリパラメーターは params に指定します。 |
| axios.delete(url, config)      | 設定     | config.data                                     |
| axios.head(url, config)        | 設定     | 本文は使用しない                                        |
| axios.options(url, config)     | 設定     | 必要に応じて config.data を使う                          |
| axios.post(url, data, config)  | 本文     | data                                            |
| axios.put(url, data, config)   | 本文     | data                                            |
| axios.patch(url, data, config) | 本文     | data                                            |

<a id="section-3"></a>

## GET、POST、PUT、DELETE :id=h-521d6508d935

```javascript
const response = await axios.get("/api/users", {
  params: { page: 1, size: 10 },
  timeout: 5000
});
console.log(response.data);
```

params がクエリパラメーターをエンコードします。空白、中国語、& を含む入力を URL に直接連結しないでください。トップレベルの await には ES モジュールの対応が必要です。断片を async 関数内に置くこともできます。

```javascript
async function createUser() {
  const response = await axios.post("/api/users", {
    name: "Tom",
    age: 18
  });
  return response.data;
}

async function updateUser(id) {
  const response = await axios.put("/api/users/" + encodeURIComponent(id), {
    name: "Mary",
    age: 20
  });
  return response.data;
}

async function deleteUser(id) {
  const response = await axios.delete("/api/users/" + encodeURIComponent(id));
  return response.data;
}
```

これらの関数は、例えば await createUser() のように呼び出して初めてリクエストを送ります。実在するバックエンド API に依存しており、実行するだけでデータが得られるオフラインのデモではありません。

DELETE に本文が必要な場合：

```javascript
await axios.delete("/api/users", {
  data: { ids: [1, 2, 3] }
});
```

一括削除で本文を受け付けるかどうかはバックエンド API の取り決めによります。GET とまったく同じだと考えないでください。

<a id="section-4"></a>

## JSON、フォーム、ファイル :id=h-d9a9f5fa4108

通常のオブジェクトは Axios が JSON としてシリアライズするため、一律に JSON.stringify を呼ぶ必要はありません。

```javascript
const form = new URLSearchParams();
form.set("username", "Tom");
form.set("password", "example-password");
await axios.post("/api/login", form);
```

URLSearchParams は application/x-www-form-urlencoded に使います。パスワードの例はローカル練習専用です。実際のログインリクエストでは HTTPS を使用します。

ブラウザーでのファイルアップロード：

```javascript
async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  const response = await axios.post("/api/files", form);
  return response.data;
}
```

file はユーザーが選択した File オブジェクトです。ブラウザーで FormData を送るときは、boundary を含む Content-Type の生成をブラウザーと Axios に任せます。multipart/form-data を固定指定して境界パラメーターを欠落させないでください。

<a id="section-5"></a>

## レスポンスとエラー :id=h-bf4712c5de3d

| フィールド               | 意味                                       |
| ------------------- | ---------------------------------------- |
| response.data       | バックエンドが返した JSON などのレスポンス本文               |
| response.status     | HTTP ステータスコード                            |
| response.statusText | ステータステキスト。HTTP/2 などでは空になる場合があります。        |
| response.headers    | レスポンスヘッダー                                |
| response.config     | リクエスト送信時の設定                              |
| response.request    | 基盤となるリクエストオブジェクト。ブラウザーと Node.js では異なります。 |

デフォルトでは 2xx ステータスコードでリクエストの Promise が成功し、それ以外では通常失敗します。この規則は validateStatus で変更できます。HTTP 200 でも業務処理が成功したとは限らないため、レスポンス本文の業務ステータスをバックエンドと取り決めます。

```javascript
try {
  const response = await axios.get("/api/users/1");
  console.log(response.data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error("HTTP error:", error.response.status);
    } else if (error.request) {
      console.error("No response was received");
    } else {
      console.error("Request setup failed:", error.message);
    }
  } else {
    throw error;
  }
}
```

ネットワークエラー、タイムアウト、キャンセルでは error.response が存在しない場合があります。確認せずに error.response.status へアクセスしてはいけません。

```javascript
axios.get("/api/users/1")
  .then(response => console.log(response.data))
  .catch(error => console.error(error))
  .finally(() => console.log("Request finished"));
```

finally は処理完了後の後始末に使います。catch の後に then を書いても、無条件に実行される finally と同じにはなりません。catch 内で再度例外を投げると、その後の成功コールバックは実行されません。

<a id="section-6"></a>

## デフォルト設定とインターセプター :id=h-c3ccec309720

```javascript
const api = axios.create({
  baseURL: "/api",
  timeout: 5000
});

api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", "Bearer " + token);
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);
```

このモジュールの断片では getAccessToken() を自分で実装し、ログインモジュールからトークンを取得する必要があります。1 つのリクエストヘッダーを変更するときは、ほかのヘッダーを保持し、config.headers 全体を上書きしないでください。

リクエストインターセプターは Axios が送信する前に、レスポンスインターセプターは Axios のレスポンスが呼び出し元の then/catch に届く前に実行されます。対象の Axios インスタンスにだけ作用し、ページ内のすべての Fetch、画像、フォームのリクエストを捕捉するものではありません。

設定の優先順位は通常、ライブラリのデフォルト値 < インスタンスの defaults < 個別リクエストの config です。API インスタンスを一か所で作成し、業務設定がグローバルに散在するのを避けることを勧めます。

エラーインターセプターは通常 Promise.reject(error) を返し、呼び出し元にエラーの表示方法を任せます。代替結果が明確に定義されている場合だけ成功として復旧します。エラーを安易に {} へ変えると、後続コードがリクエストに成功したと誤認するため避けてください。

インターセプターを解除する：

```javascript
const interceptorId = api.interceptors.request.use(config => config);
api.interceptors.request.eject(interceptorId);
```

<a id="section-7"></a>

## キャンセルと古い結果による上書きの防止 :id=h-154e3bf033e2

Axios は 0.22 以降、AbortController に対応しています。CancelToken は古い API なので、新しいコードでは signal を使います。

```javascript
let currentController;

async function searchUsers(keyword) {
  if (currentController) {
    currentController.abort();
  }

  const controller = new AbortController();
  currentController = controller;

  try {
    const response = await axios.get("/api/users", {
      params: { keyword },
      signal: controller.signal
    });
    if (currentController !== controller) {
      return null;
    }
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      return null;
    }
    throw error;
  } finally {
    if (currentController === controller) {
      currentController = undefined;
    }
  }
}
```

この関数は前回の検索をキャンセルし、古くなったレスポンスを無視します。呼び出し元では null をキャンセルまたは古い結果とみなし、ページを更新しない取り決めにします。新しいリクエストごとに新しいコントローラーを作成します。一度 abort した signal は復元できません。

クライアントの待機をキャンセルしても、サーバーの処理停止は保証されません。新規作成や支払いなどにはバックエンド側の冪等性の確保が必要で、フロントエンドのキャンセルだけでは重複書き込みを防げません。

<a id="section-8"></a>

## Promise の基本動作 :id=h-4013bcc53158

Promise には pending（待機）、fulfilled（成功）、rejected（失敗）の 3 状態があります。成功か失敗が確定すると、それ以降は変更できません。executor は直ちに実行され、then/catch のコールバックはマイクロタスクとして非同期に実行されます。

```javascript
const promise = new Promise(resolve => {
  console.log("executor");
  setTimeout(() => resolve("done"), 10);
});

promise.then(value => console.log(value));
console.log("after registration");
```

期待される順序は executor、after registration、done です。タイマーより前に resolve を呼ぶと、タイマー内の結果が Promise の結果を決められなくなるため、先に呼ばないでください。

resolve しても、直ちに fulfilled になるとは限りません。別の Promise や thenable を渡すと、その後の結果を引き継ぎます。

<a id="section-9"></a>

## メソッドチェーン :id=h-01592e0345bc

then は呼ぶたびに新しい Promise を返します。

```javascript
Promise.resolve(1)
  .then(value => value + 1)
  .then(value => console.log(value));
```

結果は 2 です。チェーンを続けるために、前のコールバックが Promise を返す必要はありません。通常の値は次へ渡され、Promise は完了が待たれ、return がなければ次は undefined を受け取り、エラーを投げれば後続の catch に進みます。

```javascript
function delay(value, milliseconds) {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), milliseconds);
  });
}

delay("first", 10)
  .then(value => {
    console.log(value);
    return delay("second", 10);
  })
  .then(value => console.log(value));
```

チェーン全体で 2 回目の遅延を待つには return が必要です。Promise の executor はタスクの開始と結果の受け渡しを担当するもので、async 関数にすることは推奨しません。

<a id="section-10"></a>

## async/await と逐次実行・並行実行 :id=h-3adb7fc5ddf0

async/await は ES2017 で導入されました。async 関数は必ず Promise を返します。async は単独で使え、await を書く必要はありません。await は通常の値も Promise も待機できます。拒否された Promise は await の位置でエラーを投げ、try/catch で処理できます。

```javascript
async function queryData() {
  const first = await axios.get("/api/first");
  const second = await axios.get("/api/second", {
    params: { id: first.data.id }
  });
  return second.data;
}

queryData()
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

必ず queryData() と呼び出してください。関数自体に対して queryData.then(...) と書くことはできません。

2 つのリクエストに依存関係がなければ、並行して開始できます。

```javascript
const [user, permissions] = await Promise.all([
  axios.get("/api/users/1"),
  axios.get("/api/users/1/permissions")
]);
console.log(user.data, permissions.data);
```

Promise.all はいずれかのタスクが失敗すると拒否されますが、ほかのリクエストを自動でキャンセルしません。各タスクの成功・失敗の結果をすべて保持するには Promise.allSettled を使います。

<a id="section-11"></a>

## 開発時の簡単なトラブルシューティング :id=h-61bd3031ab86

1. URL、HTTP メソッド、クエリパラメーター、リクエスト本文がバックエンドの取り決めに合うか確認します。
2. console だけでなく、ブラウザーのネットワークパネルでステータスコードとレスポンス本文を確認します。
3. HTTP エラー、業務エラー、ネットワークエラー、CORS によるブロックを区別します。
4. インターセプターが設定またはレスポンスを返し、エラーを握りつぶしていないか確認します。
5. クロスオリジンの Cookie リクエストには通常、withCredentials とサーバー側の CORS の両方が必要です。プロキシは開発時の転送を行うだけで、デプロイ設定の代わりにはなりません。

参考：[Axios API](https://axios-http.com/docs/api_intro)、[リクエスト設定](https://axios-http.com/docs/req_config)、[リクエストのキャンセル](https://axios-http.com/docs/cancellation)、[ECMAScript の Promise 仕様](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-objects)。
