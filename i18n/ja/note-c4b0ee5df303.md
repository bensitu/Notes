# フロントエンドの自動テスト：状態、コンポーネント、実ブラウザー :id=h-b5f757669d90

学習目標：リクエストのモックと実際のAPIを区別し、ユーザーが観察できる成功、失敗、待機状態を検証します。

**適用範囲：**&#x30B5;ンプルではVitest、jsdom、Playwrightをロックファイルで固定し、Node 24で実行します。Playwrightには別途ブラウザーのインストールが必要です。

[ドキュメント一覧](README.md) · [一貫したサンプルプロジェクトと実行手順](examples/taskboard/README.md)

**目次**

- [3種類のテストの役割](#section-1)
- [最小限の実行手順](#section-2)
- [実ブラウザーのテスト](#section-3)
- [セレクターと待機](#section-4)
- [コンポーネントテストの拡張](#section-5)
- [検証と開発の早見表](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## 3種類のテストの役割 :id=h-b21bfe20d6e7

状態と関数のテストはデータの動作を、コンポーネントテストはレンダリングと操作を、ブラウザーのエンドツーエンドテストはページ、ネットワーク、Cookie、サーバーの連携を確認します。

jsdomはDOMの一部を模擬するもので、実ブラウザーではありません。スクリーンショットが似ていても、ログインや送信が正しいとは限りません。ユーザーが観察できる動作を優先し、適切なテスト層を選びます。

<a id="section-2"></a>

## 最小限の実行手順 :id=h-b76725de8939

```powershell
Set-Location examples/taskboard/frontend
npm ci
npm test
npm run build
```

この例の[TaskPage.test.ts](examples/taskboard/frontend/src/TaskPage.test.ts)はエラー表示とフォームの復帰を検証し、[tasks.test.ts](examples/taskboard/frontend/src/tasks.test.ts)はリクエスト失敗時の古いデータの保持と、不正な形式の応答フィールドの拒否を確認します。HTTP 503や不正なJSONをテストで与え、実際のバックエンドなしでも失敗経路を安定して検証します。

<a id="section-3"></a>

## 実ブラウザーのテスト :id=h-0b9225425f2b

別のターミナルでプロジェクトの説明に従ってJavaバックエンドを起動します。ブラウザーテストはフロントエンドの開発サーバーを起動します。

```powershell
Set-Location examples/taskboard/frontend
npx playwright install chromium
$env:APP_PASSWORD = 'local-demo-change-me'
npm run test:e2e
```

APP_PASSWORDはバックエンドと一致させます。LinuxのCIでは初回のブラウザーインストール時にplaywright install --with-deps chromiumで必要なシステム依存関係もインストールできます。

[task.spec.ts](examples/taskboard/frontend/e2e/task.spec.ts)は実際のバックエンドでパスワードログイン、タスクの作成と完了、ログアウト後のアクセス拒否を検証します。APIを偽の成功に差し替えないため、Cookie、プロキシ、CSRF設定の問題を検出できます。

<a id="section-4"></a>

## セレクターと待機 :id=h-384755bc2b8e

入力とボタンはgetByLabelやgetByRoleのようにアクセシブルな名前で特定します。同じ語が複数の要素にある場合は、exactや範囲の絞り込みで誤クリックを防ぎます。

固定で3秒sleepするのではなく、新しいタイトルがリストに現れるなどの業務結果を待ちます。固定待機は速い環境で時間を無駄にし、遅い環境では失敗します。

実行ごとに独立したタスク名を生成します。テストはデータベースを変更するため、独立したテストDBまたは明確なクリーンアップ方針を使用し、本番データで破壊的なテストを行わないでください。

<a id="section-5"></a>

## コンポーネントテストの拡張 :id=h-b98b66337181

プロジェクトにはVue Test Utilsが含まれます。拡張時はコンポーネントをマウントして独立したPiniaを提供し、終了後にネットワークのモックとグローバル状態を復元します。

空リスト、読み込み中、エラー表示、重複クリックの制限、入力長の境界、ログイン期限切れ、409競合後のユーザーによる復旧を検証するとよいでしょう。非公開メソッド名やDOM構造の細部すべてを固定したアサーションは避けます。

<a id="section-6"></a>

## 検証と開発の早見表 :id=h-25d2c2992612

| 現象                             | 確認事項                             |
| ------------------------------ | -------------------------------- |
| バックエンドのテストは成功するがブラウザーでログインできない | 実際のCookie、CSRF、プロキシ、パスワード        |
| テスト同士が影響する                     | mock、グローバル変数、Piniaの再作成を確認        |
| CIがブラウザーを見つけられない               | ブラウザーとシステム依存関係のインストールを確認         |
| 開発では動くがbuildで失敗する              | TypeScript、Vueの型チェック、実際のツールバージョン |
| 要素が時々見つからない                    | 実際のアクセシブルな名前で特定し、正しい状態を待っているか確認  |

失敗時は必要なスクリーンショット、trace、サービスログを保持し、保持期間とアクセス範囲を制限します。レポートには業務データが含まれる場合があるため、ログイン認証情報やセッション全体を公開アップロードしないでください。

<a id="section-7"></a>

## 公式リファレンス :id=h-e47684898f28

- [Vitest](https://vitest.dev/guide/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwrightのベストプラクティス](https://playwright.dev/docs/best-practices)
