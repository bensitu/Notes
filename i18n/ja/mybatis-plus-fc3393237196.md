# MyBatis-Plus の検索結果に null がある場合の調べ方 :id=h-f240deb3db45

結果が空の場合、要素が null の場合、フィールドが null の場合を区別し、マッピング、設定、SQL を調べます。

**前提知識とバージョン：** 先に MyBatis のマッピングを理解してください。本稿は MyBatis-Plus 3.x を対象とします。テーブル名、列名、主キーの注釈は、自分のテーブルに合わせる必要があります。

**サンプルの使い方：** 全ファイルと実行手順を明示したプロジェクトを除き、各コードブロックは節ごとの独立した断片です。省略部分や仮の名前を補ってください。誤りと示した行は問題の説明用です。同じ節の代替実装を混ぜないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://baomidou.com/reference/)

**このページの目次**

- [まず現象を区別する](#section-1)
- [推奨する命名とマッピング](#section-2)
- [設定場所と使い分け](#section-3)
- [調査の順序](#section-4)

<a id="section-1"></a>

## まず現象を区別する :id=h-7f7e6c681a9d

一致するレコードがなければ、selectList は通常、空のリスト `[]` を返します。`[null, null]` なら、結果の行がオブジェクトにマッピングされていません。`[{"name": null}]` ならオブジェクトは作られていますが、一部のフィールドがマッピングされていないか、元のデータベース値が NULL です。

```json
{
  "flag": true,
  "data": [null, null]
}
```

JSON だけを見て、エンティティーの命名が原因だと決めつけないでください。まず SQL、返された列名、エンティティーのプロパティー、マッピング設定を確認します。

<a id="section-2"></a>

## 推奨する命名とマッピング :id=h-ffe867988bb5

データベースの列名は record_id、Java のプロパティー名は recordId にします。MyBatis-Plus ではアンダースコアからキャメルケースへの変換が既定で有効ですが、MyBatis 本体では既定で無効です。

```java
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

@TableName("attendance_record")
public class AttendanceRecord {
    @TableId("record_id")
    private String recordId;

    @TableField("attendance_date")
    private java.time.LocalDate attendanceDate;

    public String getRecordId() { return recordId; }
    public void setRecordId(String recordId) { this.recordId = recordId; }
    public java.time.LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(java.time.LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }
}
```

@TableId は主キーを示し、@TableField は通常の列名を指定します。実際の検索で必要なプロパティーを補ってください。

<a id="section-3"></a>

## 設定場所と使い分け :id=h-6549e3d56541

ファイル：src/main/resources/application.yml。YAML の字下げには空白を使い、タブを使わないでください。

```yaml
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
```

既存の Java プロパティーも record_id のようなアンダースコア付きの名前で、元の列名によるマッピングが必要だと確認できた場合に限り、false を検討します。新しいコードでは Java のキャメルケースを優先し、安易に全体設定を変えないでください。

<a id="section-4"></a>

## 調査の順序 :id=h-2cfba327e667

1. SQL を確認し、データベースで単独実行して、該当データがあるか確かめます。
2. 接続先のデータベース、テーブル名、列名を確認します。
3. プロパティー名、別名、@TableId、@TableField、resultMap を確認します。
4. プロパティーの型、アクセサー、独自の結果マッピングを確認します。
5. 取得できたフィールドが、レスポンスのシリアライズ時に除外されていないか確認します。

開発時は一時的に SQL を出力してもかまいません。運用時はログフレームワークを使い、出力内容を管理してください。次の独立した設定断片は既存の configuration の下に統合し、同じ名前の YAML キーを重複させないでください。

```yaml
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

参考：[MyBatis-Plus の設定](https://baomidou.com/reference/)、[MyBatis の結果マッピング](https://mybatis.org/mybatis-3/zh_CN/sqlmap-xml.html)。
