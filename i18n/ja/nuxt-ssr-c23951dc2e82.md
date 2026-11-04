# NuxtのフルスタックとSSRの実践 :id=h-6a21bfa5ad6f

学習目標：Vueの仕組みの中でページルーティング、サーバー側のAPI、データpayload、ハイドレーションを理解します。先にVue 3とSSRを習得してください。サンプルはNuxt 4.6.4、Vue 3.5.44、Node 24と対応するロックファイルに固定しています。

[ドキュメント一覧](README.md) · [SSRサンプルの説明](examples/ssr/README.md)

**目次**

- [Nuxtと通常のVueプロジェクトの関係](#section-1)
- [最小限の実行手順](#section-2)
- [データ取得とpayload](#section-3)
- [SSRに適した状態](#section-4)
- [環境、エラー、認証](#section-5)
- [検証と早見表](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## Nuxtと通常のVueプロジェクトの関係 :id=h-db1014dd552a

Vueはコンポーネントとリアクティビティを担当し、Nuxtはその上にページルーティング、サーバーサイドレンダリング、データ取得、サーバー実行などの規約を提供します。Nitroは対応するサーバーのビルドと実行を担います。

この例はNuxt 4のappディレクトリ構成を使用します。Nuxt 2のasyncData、ディレクトリ、プラグインの書き方をそのまま現在のプロジェクト設定として使用しないでください。

| ディレクトリ         | 役割                        |
| -------------- | ------------------------- |
| app/pages      | ファイルシステムに基づくページルーティング     |
| app/components | 再利用できるVueコンポーネント          |
| app/app.vue    | NuxtPageと共通構造             |
| server/api     | 対応するリクエストで呼び出されるサーバー側のAPI |
| server/utils   | この例のサーバー側の公開データ           |
| shared/types   | 共有できる型定義                  |
| nuxt.config.ts | SSR、Nitro、ページのhead、ルート規則  |

<a id="section-2"></a>

## 最小限の実行手順 :id=h-416c962c5758

```powershell
Set-Location examples/nuxt-ssr
npm ci
npm run typecheck
npm run build
$env:NITRO_HOST = '127.0.0.1'
$env:NITRO_PORT = '3002'
npm start
```

リポジトリのルートからプロジェクトへ移動し、[http://127.0.0.1:3002](http://127.0.0.1:3002)を開きます。このNode serverのビルド出力は.outputです。.output/publicだけを取得して動的なSSRも保持できたと考えないでください。

開発ではnpm run devを使用し、ポートは同じ3002です。本番サービスと同時に同じポートを使わないでください。サーバー側のAPIは公開の読み取り専用記事のみを提供し、実ユーザーやデータベースはありません。

<a id="section-3"></a>

## データ取得とpayload :id=h-9d96c7edee6e

ページではuseFetch('/api/articles')を使用します。サーバーの結果は初期payloadに含まれ、クライアントのハイドレーション時に再利用できます。setup内で通常の$fetchを直接使って初期データを取得すると、異なる重複取得の動作が生じる場合があります。

用途に応じてuseFetch、useAsyncData、イベント内の$fetchを選び、見た目が似ているだけで置き換えないでください。keyを共有するデータは、相互の上書きを防ぐためオプションと期待する動作も一貫させる必要があります。

この例のデータは自身の固定されたサーバー配列から生成されます。型のジェネリクスは実際の外部APIを検証しません。外部サービスに接続するときは、応答ステータスとデータ構造を確認してください。

<a id="section-4"></a>

## SSRに適した状態 :id=h-dcec1d983bf2

サンプルはサーバー時刻を次のように保存します。

```typescript
const renderedAt = useState<string>('rendered-at', () => new Date().toISOString());
```

これはVueのsetupコンテキストの抜粋で、useStateはNuxtが自動インポートします。クライアントはサーバーのpayloadを再利用し、初回のハイドレーションで別の時刻を取得しません。

Counterはkey付きのuseStateで同じアプリ内の状態を再利用し、Nuxtがリクエストコンテキストを処理します。全ユーザーの状態として、サーバーモジュールのトップレベルに可変refを置かないでください。

渡す値はフレームワークのシリアライズの境界に適合する必要があります。接続オブジェクト、関数、任意のクラスのインスタンスを、そのまま安全にブラウザーへ渡せるデータとは扱えません。シリアライズ可能な値であっても、秘密情報をpayloadに含めてはいけません。

<a id="section-5"></a>

## 環境、エラー、認証 :id=h-1795318bb37a

useSeoMetaはページのタイトルと説明を表します。存在しない記事はサーバーの404とページのエラー処理で示します。ページルートのmiddlewareは、server/api内の認証と認可の代わりにはなりません。

実行時の非公開設定とruntimeConfig.publicを分けます。publicの値はブラウザーが取得するため、データベースのパスワードやサービスのキーを置いてはいけません。

SSRではサーバーとブラウザーのリクエストでCookieの動作が異なります。Nuxtの相対パスのuseFetchではリクエストコンテキストによる転送を使用できます。外部の上流へ転送する場合も、宛先、許可リスト、実際のヘッダー範囲を確認し、任意のURLへすべての認証情報を送らないでください。

<a id="section-6"></a>

## 検証と早見表 :id=h-7c38a603c7fc

| 現象                           | 確認事項                              |
| ---------------------------- | --------------------------------- |
| 初回レンダリングでwindowが存在しないと報告される  | モジュールやsetupでブラウザー専用のAPIを使っていないか確認 |
| サーバーとクライアントの内容が異なる           | useState / データpayloadと不確定な値       |
| ブラウザーが秘密情報を受け取る              | public設定、ページのprops、useState、応答内容  |
| パラメーターを変えても古い記事のままになる        | 取得キーとルートパラメーターがリアクティブか確認          |
| 静的ディレクトリだけをデプロイするとAPIが404になる | Nitroサービスを誤って除外していないか確認           |
| ルート検証に通っても権限を超えてアクセスできる      | サーバー側のAPIが本当に識別情報と所有関係を確認しているか検証  |

本番テストを実行し、JavaScriptなしの内容、ハイドレーション、独立したブラウザーの初期値をそれぞれ確認します。拡張後は実際のデータベース、セッション、CDN設定を別途検証する必要があります。

<a id="section-7"></a>

## 公式リファレンス :id=h-e91c94f3279c

- [Nuxtのレンダリングモード](https://nuxt.com/docs/4.x/guide/concepts/rendering)
- [データ取得](https://nuxt.com/docs/4.x/getting-started/data-fetching)
- [状態管理](https://nuxt.com/docs/4.x/getting-started/state-management)
- [デプロイ](https://nuxt.com/docs/4.x/getting-started/deployment)
