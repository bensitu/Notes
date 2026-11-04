# Reactの開発基盤とテスト :id=h-4570736a9809

学習目標：Reactコンポーネントを、実行、検証、リリースできるプロジェクトに構成します。サンプルではNode 24、Vite 8、React 19、React Router 8、TypeScript 5.9.3を使用します。正確な依存バージョンはロックファイルに従います。

[ドキュメント一覧](README.md) · [サンプルの説明](examples/react-taskboard/README.md)

**目次**

- [プロジェクトのファイル構成](#section-1)
- [インストール、開発、ビルド](#section-2)
- [ルーティングとデータの境界](#section-3)
- [コンポーネントテスト](#section-4)
- [実際のAPIとブラウザーのテスト](#section-5)
- [リリース、障害、早見表](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## プロジェクトのファイル構成 :id=h-c5f7f7581c30

| ファイル                  | 役割                            |
| --------------------- | ----------------------------- |
| src/main.tsx          | ルートノード、StrictMode、ブラウザールーティング |
| src/TaskPage.tsx      | ページの状態、認証、タスク操作               |
| src/TaskForm.tsx      | 制御された入力と送信結果のフィードバック          |
| src/tasks.ts          | リクエスト、DTO、実行時の応答検証            |
| src/api.ts            | セッションCookie、CSRF、HTTPエラー      |
| vite.config.ts        | プラグイン、開発用プロキシ、Vitest          |
| src/\*.test.tsx / e2e | コンポーネントの動作テスト / 実ブラウザーの操作フロー  |

React公式にはフレームワークを使う選択肢もあります。このサンプルではViteを選び、CSRと独立したJava APIを示します。サーバーサイドレンダリングが必要な場合はNext.jsなどの対応するプロジェクトを使用し、Viteのディレクトリを完全なSSRサービスとして扱わないでください。

<a id="section-2"></a>

## インストール、開発、ビルド :id=h-a224083bebbb

まずリポジトリのルートからバックエンドを起動し、別のターミナルを開きます。

```powershell
Set-Location examples/react-taskboard
npm ci
npm test
npm run build
npm run dev
```

[http://127.0.0.1:5174](http://127.0.0.1:5174)を開きます。npm ciはコミット済みのpackage-lockを使用します。意図的に依存関係を変更するときだけインストールを更新し、ロックファイルをレビューしてください。開発サーバーの起動成功は、完全な型チェックの成功を意味しません。

ビルド結果はdistに出力されます。Viteの/api開発用プロキシはdistとともに自動デプロイされません。本番環境では、サーバーがそのパスを保護されたJava APIへ転送する必要があります。

<a id="section-3"></a>

## ルーティングとデータの境界 :id=h-53c9cbb26112

サンプルはreact-routerからBrowserRouter、Routes、Route、NavLinkをインポートし、Declarativeモードを使用します。ルーティングライブラリのFramework / Data / Declarativeモードは異なるため、異なるモードの設定を安易に混ぜないでください。

ブラウザーのHistoryルーティングでは、ページパスに対してサーバーがSPAのエントリーポイントを返す必要があります。API、存在しない静的リソース、本当のエラーは個別に処理します。クライアントに「ページが見つかりません」と表示しても、初回のHTTP応答が404とは限りません。

このサンプルでは追加のグローバルライブラリを導入せず、最新のタスクリストをReact stateに保持します。応答はまずunknownとして検証します。TypeScriptのジェネリック型のアサーションでは、外部のJSONを検証できません。

<a id="section-4"></a>

## コンポーネントテスト :id=h-bc74aaa8d400

```powershell
npm test
```

テストでは、送信失敗時に入力を保持し、成功時のみ空にすること、503後にエラーを表示してログインボタンを復帰させることを確認します。labelとroleで要素を特定し、非公開メソッドや偶然のDOM階層に依存しないようにします。

コンポーネントテストはjsdomを使用するため、ブラウザーのレイアウト、Cookie、プロキシ、CSRFフローの正しさまでは証明しません。他のテストを汚染しないように、ネットワークのモックは各ケースの後で元に戻します。

<a id="section-5"></a>

## 実際のAPIとブラウザーのテスト :id=h-7721de07947c

バックエンドは引き続きローカルの8080で動作している必要があります。バックエンドと同じパスワードを使用します。

```powershell
Set-Location examples/react-taskboard
npx playwright install chromium
$env:APP_PASSWORD = 'local-demo-change-me'
npm run test:e2e
```

フローでは実際のJava APIを使用し、ログイン、作成、完了、ログアウト、ルート移動を行います。サーバーを偽の成功応答に変更しないでください。テスト用データベースとアカウントは本番から独立させ、テストレコードを実ユーザーの環境に書き込まないでください。

<a id="section-6"></a>

## リリース、障害、早見表 :id=h-34b8fc7c0b16

| 問題                     | 確認事項                          |
| ---------------------- | ----------------------------- |
| TSXのエラー                | ファイル拡張子、jsx設定、Reactの型バージョン    |
| ビルドは成功するがリクエストは失敗する    | 本番環境の/apiプロキシと転送先サービス         |
| ログイン後の書き込みが403になる      | Cookieと、ログイン後に再取得したCSRFトークン   |
| ページを再読み込みすると404になる     | Historyルーティング用のサーバー側フォールバック   |
| リストが空なのにエラーが出ない        | 失敗を握りつぶして空配列にしていないか確認         |
| 追加処理のタイムアウト後に再送すると重複する | サーバー側で処理が完了していないか、冪等性キーが必要か確認 |

VITE_環境変数はブラウザーのコードに含まれるため、サーバーの秘密情報を保存できません。Reactは通常のテキストをエスケープしますが、バックエンドの権限検証の代わりにはなりません。信頼できない内容にdangerouslySetInnerHTMLを安易に使用しないでください。

<a id="section-7"></a>

## 公式リファレンス :id=h-5258c283811a

- [Reactのプロジェクト構成の選択](https://react.dev/learn/creating-a-react-app)
- [Vite](https://vite.dev/guide/)
- [React Routerのモード](https://reactrouter.com/start/modes)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/docs/intro)
