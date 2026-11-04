# Pythonの基礎と標準ライブラリ :id=h-0c162fd1a402

学習目標：構文の学習から、ファイル、例外、構造化データを扱える小さなプログラムの作成へ進みます。JavaやJavaScriptの経験があっても、Python独自の意味論を確認してください。

**適用範囲：**&#x5B66;習用インタープリターはCPython 3.15です。プロジェクトの最低要件は3.11で、新しい構文への依存を避けています。実際の検証にはプロジェクトの.python-versionとuvが管理するバージョンを使用します。正確なインタープリターと依存関係は検証記録を参照してください。

[ドキュメント一覧](README.md) · [一貫したサンプルプロジェクトと実行手順](examples/taskboard/README.md)

**目次**

- [最初に習得する概念](#section-1)
- [最小限の実行可能なサンプル](#section-2)
- [関数、デフォルト引数、コピー](#section-3)
- [ファイル、文字コード、例外](#section-4)
- [標準ライブラリの選択](#section-5)
- [検証と開発の早見表](#section-6)
- [公式リファレンス](#section-7)

<a id="section-1"></a>

## 最初に習得する概念 :id=h-66fe66162340

Pythonはインデントでコードブロックを構成します。変数名はオブジェクトに結び付き、代入でオブジェクトが自動的にコピーされるわけではありません。整数、浮動小数点数、文字列、リスト、辞書、集合はそれぞれ異なるデータ型です。

| 記法                | 意味                                      |
| ----------------- | --------------------------------------- |
| list / dict / set | 変更可能なリスト、マッピング、集合                       |
| tuple             | タプル。要素の参照は再代入できないが、内部のオブジェクトは変更可能な場合がある |
| None              | 値がないことを表し、空文字列とは異なる                     |
| == / is           | 値の比較 / 同一オブジェクトかどうかの比較                  |
| def / class       | 関数 / クラスを定義する                           |
| with              | オブジェクトのプロトコルに従ってリソースと終了時の動作を管理する        |

<a id="section-2"></a>

## 最小限の実行可能なサンプル :id=h-57c33f27c028

hello_tasks.pyとして保存します。

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Task:
    title: str
    done: bool = False


def pending_titles(tasks: list[Task]) -> list[str]:
    return [task.title for task in tasks if not task.done]


if __name__ == "__main__":
    tasks = [Task("Learn Python", True), Task("Write tests")]
    print(pending_titles(tasks))
```

```powershell
python hello_tasks.py
```

想定出力は\['Write tests']です。型注釈はツールの検証を助けますが、実行時に誤った型を自動的に拒否しません。frozenはフィールドへの代入を制限しますが、参照先のすべての内容が深い階層まで不変になるわけではありません。

<a id="section-3"></a>

## 関数、デフォルト引数、コピー :id=h-3497a3f72103

デフォルト引数は関数定義時に評価されます。呼び出しごとの新しいデータの保持に可変リストを使わないでください。

```python
def add_title(title: str, titles: list[str] | None = None) -> list[str]:
    result = [] if titles is None else list(titles)
    result.append(title)
    return result
```

ここでは渡されたリストを明示的にコピーし、呼び出し元のリストを変更しません。浅いコピーでは入れ子のオブジェクトは共有されます。深いコピーが必要な場合は、すべてのデータに機械的にdeepcopyを呼ぶのではなく、どのオブジェクトを共有すべきか先に考えます。

関数が複数の値を返す場合、実際には通常タプルを返します。表示結果と戻り値を混同しないでください。printは出力し、returnは呼び出し元へデータを渡します。

<a id="section-4"></a>

## ファイル、文字コード、例外 :id=h-95db64973ddd

パスにはpathlibを使用し、テキストの文字コードを明示し、CSVではnewline=""を指定します。UTF-8ファイルにはBOMが付く場合があり、このようなエクスポートファイルの読み取りには必要に応じてutf-8-sigを使用します。

```python
from pathlib import Path

source = Path("tasks.txt")
try:
    with source.open(encoding="utf-8") as stream:
        for line in stream:
            print(line.rstrip("\n"))
except FileNotFoundError:
    print("Input file was not found")
```

処理方法が分かる例外だけを捕捉します。except Exceptionの後で無条件にpassすると、エラーなのに成功したかのように処理が続きます。例外を上位へ伝えるときは元の原因を保持してください。

<a id="section-5"></a>

## 標準ライブラリの選択 :id=h-a37f7d80d54c

| 作業          | まず確認するもの                            |
| ----------- | ----------------------------------- |
| パスとファイル     | pathlib、io                          |
| JSON / CSV  | json、csv                            |
| 日付と時刻       | datetime、zoneinfo                   |
| コマンドライン引数   | argparse                            |
| ログ          | logging                             |
| 金額          | decimal                             |
| 外部プロセスの呼び出し | subprocess。引数リストを優先し、shell=Trueを避ける |
| 反復処理        | itertools、ジェネレーター                   |

JSONの解析にはevalではなくjson.loadsを使用します。信頼できないpickleを読み込まないでください。デシリアライズでコードが実行される可能性があります。

<a id="section-6"></a>

## 検証と開発の早見表 :id=h-988185588b4a

python --versionで実際のインタープリターを確認し、曖昧なpipのパスではなくpython -m pipで環境を特定します。このリポジトリはuv runでインタープリターと環境を統一しています。[開発基盤のドキュメント](Python项目工程化.md)を参照してください。

関数は空の入力、通常の入力、不正な入力でテストします。浮動小数点数の比較、可変のデフォルト値、浅いコピー、ファイルの文字コード、例外の握りつぶしは、他言語から学ぶ初心者が見落としやすい境界です。

<a id="section-7"></a>

## 公式リファレンス :id=h-884b8b4138ad

- [Pythonチュートリアル](https://docs.python.org/3/tutorial/)
- [標準ライブラリ](https://docs.python.org/3/library/)
- [Pythonのリリース](https://www.python.org/downloads/)
