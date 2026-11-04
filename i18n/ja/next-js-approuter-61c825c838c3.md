# Next.jsとApp Routerの実践 :id=h-8921a275558d

学習目標：ルーティング、サーバーコンポーネント、クライアントの境界、データ、デプロイの関係を理解します。先にReactとSSRのドキュメントを読んでください。サンプルはNext 16.4.4、React 19.3.1、Node 24、TypeScript 5.9.3に固定しています。

[ドキュメント一覧](README.md) · [SSRサンプルの説明](examples/ssr/README.md)

**目次**

- [まずディレクトリ規約を確認する](#section-1)
- [最小限の実行手順](#section-2)
- [サーバーとクライアントの境界](#section-3)
- [パラメーター、データ、状態](#section-4)
- [キャッシュ、更新、サーバー側の書き込み](#section-5)
- [検証、エラー、開発の早見表](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## まずディレクトリ規約を確認する :id=h-28a1cb97e6e4

| ファイル                          | 用途                        |
| ----------------------------- | ------------------------- |
| app/layout.tsx                | ルートレイアウト、言語、共通のメタ情報       |
| app/page.tsx                  | リクエスト時にレンダリングするホームページ     |
| app/Counter.tsx               | use clientを持つ操作可能なコンポーネント |
| app/articles/\[slug]/page.tsx | 動的パラメーターを持つ記事ルート          |
| app/static/page.tsx           | ビルド時に生成できる公開ページ           |
| app/not-found.tsx / error.tsx | 不存在とレンダリングエラーの画面          |
| app/api/health/route.ts       | HTTP Route Handler        |
| lib/articles.ts               | サーバーだけで使用する公開の読み取り専用データ   |

これはApp Routerプロジェクトであり、Pages RouterのgetServerSideProps / getStaticPropsを混用しません。移行時に両方のルーターを使う場合はありますが、ファイル規約とデータのAPIは異なります。

<a id="section-2"></a>

## 最小限の実行手順 :id=h-bce13f9ef108

リポジトリのルートから開始します。

```powershell
Set-Location examples/next-ssr
npm ci
npm run build
npm start
```

[http://127.0.0.1:3001](http://127.0.0.1:3001)を開きます。本番ビルドでは動的なホームページとプリレンダリング可能な/staticが報告されます。開発時のホット更新には別途npm run devを使用し、同じポートを同時に使用しないでください。

このプロジェクトには公開の読み取り専用記事とブラウザーのカウンターのみがあり、ログイン、データベースへの書き込み、JavaタスクAPIとの連携はありません。

<a id="section-3"></a>

## サーバーとクライアントの境界 :id=h-ae8476c2e62b

ページとレイアウトは既定でサーバーコンポーネントです。操作可能なコンポーネントのファイルの先頭にuse clientを記述します。

```tsx
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(value => value + 1)}>次数：{count}</button>;
}
```

これは独立したコンポーネントの例です。完全版ではテスト用にハイドレーションの準備完了状態も示します。

use clientはモジュールの依存関係の境界を表し、「初回は必ずブラウザーだけで実行される」という意味ではありません。初回リクエスト時にそのHTMLが生成され、その後ブラウザーがハイドレーションする場合があります。サーバーの秘密情報をprops、HTML、RSCのpayload経由でクライアントへ渡してはいけません。

<a id="section-4"></a>

## パラメーター、データ、状態 :id=h-c328438f81e5

このバージョンの動的paramsはPromiseであり、サンプルはawait paramsでslugを取得します。別バージョンのparamsを同期オブジェクトとして扱う記法をコピーしないでください。リクエスト関連のcookiesやheadersなども、対象バージョンの非同期インターフェースに従って使用する必要があります。

ホームページは安定版のconnection()で実際のリクエストを待ってから時刻を生成します。これは業務上の権限検証ではなく、すべてのページに必要な関数でもありません。

lib/articles.tsはserver-onlyでサーバー側へのインポート制限を示し、不変の公開サンプルデータを持ちます。Server Componentはサーバーのデータ関数を直接呼び出せるため、自身のRoute Handlerを経由してHTTPリクエストを行う必要はありません。

<a id="section-5"></a>

## キャッシュ、更新、サーバー側の書き込み :id=h-8b105bf9ec40

このサンプルは手動で作成した設定であり、Cache ComponentsもPartial Prefetchingも有効にしていません。現在の雛形の既定設定、古いチュートリアルのfetchキャッシュの既定値、このサンプルを混同しないでください。

キャッシュが必要な場合は、データとページのどちらをキャッシュするか、キーに含む入力、有効期限、更新方法を明確にします。公開記事はキャッシュできますが、個人のセッションや権限関連データをそのまま共有キャッシュに入れてはいけません。

Server Actions / Server Functionsはクライアントから起動できるサーバーの入口であり、自分のボタンからしか呼ばれないわけではありません。書き込み操作を追加するときも、認証、認可、入力検証、リソース消費の制限、失敗処理が必要です。use serverは権限の宣言ではありません。

<a id="section-6"></a>

## 検証、エラー、開発の早見表 :id=h-6b722fc85fd9

[SSRのテスト](examples/ssr/tests/rendering.spec.ts)は、本番モードでホームページのHTML、操作、ナビゲーション、独立セッション、未知の記事を検証します。error.tsxはレンダリングエラーの境界であり、すべてのイベント処理、バックグラウンドタスク、ネットワークのエラーを自動的に捕捉する保証ではありません。

| 現象                          | 確認事項                                     |
| --------------------------- | ---------------------------------------- |
| ページでHookを使えない               | 小さな範囲のクライアント境界が必要か確認                     |
| ビルド時に予期せずユーザーデータへアクセスする     | 静的 / 動的の選択とリクエストAPI                      |
| サーバーのfetchにログイン識別情報がない      | 現在のリクエストの認証情報を正しく取得し、制御して転送しているか確認       |
| データ変更後も古いままになる              | データ、ページ、クライアントのナビゲーションのキャッシュと無効化戦略       |
| NginxへdistをアップロードしてもSSRできない | Viteの静的ディレクトリではなく、Nextの実行成果物とNodeサービスを確認 |

応答のストリーミング開始後は、すべての例外でHTTPステータスを変更できるとは限りません。エラーのテストでは実際の応答と画面を観察します。本番ではプロキシ、キャッシュ、デプロイ先プラットフォームの動作も検証する必要があります。

<a id="section-7"></a>

## 公式リファレンス :id=h-9c776aec5d06

- [Next App Router](https://nextjs.org/docs/app)
- [コンポーネントの境界](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [connection](https://nextjs.org/docs/app/api-reference/functions/connection)
- [キャッシュモデル](https://nextjs.org/docs/app/getting-started/caching)
- [デプロイ](https://nextjs.org/docs/app/getting-started/deploying)
