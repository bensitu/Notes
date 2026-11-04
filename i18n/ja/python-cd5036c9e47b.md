# Python自動化スクリプトの実践 :id=h-6d4f431ef25d

学習目標：入力が明確で、エラー箇所を特定でき、元データを誤って変更しない小さなツールを作ります。先にPythonのファイル、例外、関数を習得してください。

**適用範囲：**&#x5B8C;全なサンプルは、プロジェクト内のtask-tools CSV集計ツールです。Python 3.15の学習環境を使用します。ファイル操作、HTTP、子プロセスの例は、各節の文脈に従って実行してください。

[ドキュメント一覧](README.md) · [一貫したサンプルプロジェクトと実行手順](examples/taskboard/README.md)

**目次**

- [入力、出力、失敗を先に定義する](#section-1)
- [最小限の実行手順](#section-2)
- [ファイル処理の境界](#section-3)
- [HTTPリクエストの例](#section-4)
- [外部プログラムの呼び出し](#section-5)
- [検証と開発の早見表](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## 入力、出力、失敗を先に定義する :id=h-15815b6ddc59

スクリプトにもインターフェースの取り決めが必要です。受け付けるファイル、文字コード、許可するフィールド、出力先、失敗時の返し方を定義します。

この例はtitleとdoneの2列を読み取ります。doneはtrue / falseのみを受け付け、タイトルは前後の空白を除去した後の長さが1～100文字である必要があります。入力ファイルを変更せず、JSONの集計を出力します。

<a id="section-2"></a>

## 最小限の実行手順 :id=h-b8fa24008116

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
uv run --locked task-tools sample.csv
```

想定出力：

```json
{"total": 2, "completed": 1, "pending": 1}
```

[完全なスクリプト](examples/taskboard/python/src/task_tools/cli.py)はargparse、pathlib、csv、jsonを使用します。ファイルの欠落、列の不足、不正な行があると、エラーを出力して0以外の終了コードを返します。テストではエラーの行番号と元ファイルが書き換えられていないことを検証します。

<a id="section-3"></a>

## ファイル処理の境界 :id=h-ecb06582da83

CSVの解析を文字列のsplit(",")で代用しないでください。フィールドには引用符、カンマ、改行が含まれる場合があります。大きなファイルは全体をメモリに読み込む必要はなく、行単位で反復処理します。

出力ファイルが既存の内容を上書きする可能性がある場合は、明示的な上書きオプションを設けます。全体を置き換えるときは、同じファイルシステムに一時ファイルを書き込み、完了を確認してからプラットフォームの規則に従って置換します。途中までの書き込みを成功として扱わないでください。

一括リネームやファイルの削除では、まず対象の絶対パスと件数を出力し、範囲を確認してから実行します。シンボリックリンク、相対パス、拡張子の大文字と小文字、権限によって実際の対象が変わる場合があります。

<a id="section-4"></a>

## HTTPリクエストの例 :id=h-bd4336bf0cdf

次の独立したスクリプトはプロジェクトのヘルスエンドポイントを読み取るだけで、タスクを作成しません。

```python
import httpx

with httpx.Client(timeout=httpx.Timeout(5.0, connect=2.0)) as client:
    response = client.get("http://127.0.0.1:8080/actuator/health")
    response.raise_for_status()
    payload = response.json()
    if not isinstance(payload, dict) or payload.get("status") != "UP":
        raise ValueError("Unexpected health response")
    print("Service is healthy")
```

先にJavaバックエンドを起動する必要があります。タイムアウトには異なる段階の制限が含まれ、バッチ全体が必ず5秒以内に完了するという意味ではありません。失敗時は対象、ステータス、必要なエラー情報を記録し、パスワードは記録しません。

作成、支払い、通知送信を行うPOSTを無条件で自動再試行しないでください。サーバーが処理を完了した後にタイムアウトする場合があります。結果の照会または信頼できる冪等性の設計が必要です。

<a id="section-5"></a>

## 外部プログラムの呼び出し :id=h-d0b20ed0f245

```python
import subprocess

result = subprocess.run(
    ["git", "status", "--short"],
    check=True,
    capture_output=True,
    text=True,
    encoding="utf-8",
    timeout=10,
)
print(result.stdout)
```

gitがインストール済みで、現在のディレクトリがリポジトリである必要があります。引数リストを使うことで入力からシェル文を組み立てずに済み、check=Trueは0以外の終了コードを例外にします。出力を取得するときは、大量の出力と出力元の文字コードも考慮します。

<a id="section-6"></a>

## 検証と開発の早見表 :id=h-2c6710658741

| 入力または障害       | 期待する結果                 |
| ------------- | ---------------------- |
| 有効なCSV        | 正確に集計し、元ファイルを変更しない     |
| ファイルが存在しない    | パスに関する明確なエラーと0以外の終了コード |
| 不正なdone       | 行番号を示し、黙ってfalseとして扱わない |
| バックエンドに接続できない | 有限の時間内に失敗する            |
| 外部プログラムが失敗する  | 終了状態と必要な診断情報を保持する      |

定期実行では絶対パス、明示した作業ディレクトリ、管理された環境変数を使用し、再入防止と失敗通知を追加します。手動で1回動作しただけでは、無人で長期間実行できるとは限りません。

<a id="section-7"></a>

## 公式リファレンス :id=h-e106a5976150

- [argparse](https://docs.python.org/3/library/argparse.html)
- [csv](https://docs.python.org/3/library/csv.html)
- [subprocess](https://docs.python.org/3/library/subprocess.html)
- [HTTPXのタイムアウト](https://www.python-httpx.org/advanced/timeouts/)
