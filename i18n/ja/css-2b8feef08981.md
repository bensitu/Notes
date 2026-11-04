# 現代のCSSとアクセシビリティ :id=h-58e76889ea70

学習目標：スマートフォン、キーボード、支援技術でも使用できるページを作ります。先にHTML要素とセレクターを習得してください。

**適用範囲：**&#x73FE;代のブラウザーを対象に、広く対応済みのFlex、Grid、メディアクエリー、意味に沿ったHTMLを使用します。完全なスタイルはサンプルプロジェクトを参照してください。

[ドキュメント一覧](README.md) · [一貫したサンプルプロジェクトと実行手順](examples/taskboard/README.md)

**目次**

- [まず内容、構造、見た目を区別する](#section-1)
- [最小限の実行可能なサンプル](#section-2)
- [レイアウト選択の早見表](#section-3)
- [入力、フィードバック、状態](#section-4)
- [検証手順](#section-5)
- [よくあるエラーと開発の早見表](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## まず内容、構造、見た目を区別する :id=h-5aeda9137a07

HTMLはボタン、見出し、入力欄が何であるかを表し、CSSは配置と表示を決めます。操作にはbutton、ページ移動にはaを優先し、すべてをクリックイベント付きのdivにしないでください。

アクセシビリティは、異なる操作方法のユーザーが同じタスクを完了できるようにすることです。キーボード操作、見えるフォーカス、入力のラベル、失敗時のテキストによる説明は基本機能です。

<a id="section-2"></a>

## 最小限の実行可能なサンプル :id=h-f83c3f98c495

独立したHTMLファイルとして保存し、ブラウザーで開きます。

```html
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>任务表单</title>
<style>
* { box-sizing: border-box; }
main { width: min(100% - 2rem, 40rem); margin: 2rem auto; }
form { display: grid; gap: .75rem; }
input, button { font: inherit; padding: .6rem; }
:focus-visible { outline: 3px solid #1c58b7; outline-offset: 3px; }
@media (min-width: 40rem) {
  form { grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; }
}
</style>
</head>
<body>
<main>
  <h1>任务表单</h1>
  <form>
    <label for="title">任务标题</label>
    <input id="title" name="title" required maxlength="100">
    <button type="submit">提交</button>
  </form>
</main>
</body>
</html>
```

この例はレイアウトとブラウザー標準の必須入力検証のみを示し、保存機能はありません。完全なリクエストとエラー処理は[TaskPage.vue](examples/taskboard/frontend/src/TaskPage.vue)を参照してください。

<a id="section-3"></a>

## レイアウト選択の早見表 :id=h-a8bdfb0a37d2

| 要件                   | まず検討するもの          | 間違いやすい点                           |
| -------------------- | ----------------- | --------------------------------- |
| 1行のボタン、ナビゲーション、リスト項目 | Flex              | 長いテキストでは折り返しや縮小を許可する必要がある         |
| フォーム、複数列の領域          | Grid              | minmax(0, 1fr)で内容がグリッドを押し広げるのを防げる |
| 読みやすい幅に制限            | max-widthまたはmin() | 1つの画面にしか合わない固定幅にしない               |
| スマートフォンとデスクトップに合わせる  | メディアクエリー          | ブレークポイントは機種の一覧ではなく、内容の必要性で決める     |
| 間隔と色の統一              | CSSカスタムプロパティ      | 変数名は色の数値だけでなく用途を表す                |

FlexとGridは互いの代わりではありません。まず自然な文書順序を確保してからレイアウトを適用します。視覚的な順序とTabのフォーカス順序が逆になるとユーザーが混乱します。

<a id="section-4"></a>

## 入力、フィードバック、状態 :id=h-8763ccd19b81

各入力に見えるlabelを付け、placeholderで代用しないでください。エラーは対象フィールドと修正方法を示し、aria-describedbyで関連付けられます。動的エラーには適切なrole=alert、通常の状態更新にはaria-live=politeを使用します。

ボタンを無効にするときは待機の理由を伝えます。リクエスト終了時には状態を戻し、失敗は赤色だけでなく文字やアイコンでも示します。十分な文字のコントラストを確保し、拡大時のレイアウトも確認します。

代わりのフォーカススタイルなしにoutlineを削除せず、通常の操作をhoverでしか見えない内容に隠さないでください。アニメーションはprefers-reduced-motionを尊重します。

<a id="section-5"></a>

## 検証手順 :id=h-475fcbbf8e67

1. Tab、Shift+Tab、Enter、Spaceだけでフォームを完了します。
2. ウィンドウを狭くし、ページを200%に拡大して、内容が隠れないことを確認します。
3. ブラウザーのアクセシビリティツリーを確認し、入力とボタンの名前が意味を持つことを確かめます。
4. 長いタイトル、エラーメッセージ、処理中の状態を試します。
5. 自動ツールのスキャンを補助として使い、操作は人が確認します。自動スコアではすべてのユーザーが使えることを証明できません。

<a id="section-6"></a>

## よくあるエラーと開発の早見表 :id=h-5e2857d10ab4

フォーム内の通常のボタンにはtype=buttonを指定し、送信を防ぎます。リストには安定した業務キーを使い、CSSの視覚的な位置をデータの識別子の代わりにしないでください。

再利用するスタイルは役割に応じて抽出し、複数箇所に共通規則が実際にある場合にコンポーネントやユーティリティクラスを作ります。対応ブラウザーはプロジェクトの取り決めに記載し、ビルドとテストで実施します。

<a id="section-7"></a>

## 公式リファレンス :id=h-7429d0ba69a3

- [MDN CSSレイアウト](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
