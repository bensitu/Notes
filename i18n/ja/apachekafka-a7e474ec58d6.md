# Apache Kafkaの基礎と実践 :id=h-3176d392f10d

学習目標：イベントログ、パーティション、コンシューマーグループ、オフセットを理解し、信頼性のある送信と再生可能な処理を検証します。サンプルはApache Kafka 4.4.0の公式イメージ、Confluent Pythonクライアント2.16.1、独立したPython 3.14環境を使用します。

[ドキュメント一覧](README.md) · [Kafkaサンプルの説明](examples/kafka/README.md)

**目次**

- [KafkaのモデルとRabbitMQとの違い](#section-1)
- [最小環境とtopicの作成](#section-2)
- [クライアントのインストールと送信、受信](#section-3)
- [パーティションと順序](#section-4)
- [オフセットのコミット、重複、再生](#section-5)
- [再試行、不正なメッセージ、exactly-onceの範囲](#section-6)
- [運用上の確認と検証](#section-7)
- [公式リファレンス](#section-8)

<a id="section-1"></a>

## KafkaのモデルとRabbitMQとの違い :id=h-8b24fa95829a

Kafkaはtopicのパーティションログにレコードを追加し、コンシューマーは自身の読み取り位置を保持します。通常の受信とoffsetのコミットで保存済みレコードが削除されることはなく、削除はretention / compactionなどの方針で制御されます。retentionは保持時間やサイズに基づいて古いログを削除します。compactionはkeyごとに古い値を圧縮し、各keyの新しい状態を残す用途に適しており、受信直後の重複排除ではありません。

brokerはログを保存して読み書きのリクエストを処理するサービスノードで、controllerはクラスターのメタデータとリーダー選出を管理します。KRaftはKafka自身の合意形成機構でこのメタデータを管理し、ZooKeeperを別途デプロイする必要はありません。

| 概念               | 意味                  | 誤解しやすい限界                    |
| ---------------- | ------------------- | --------------------------- |
| topic            | ある種類のイベントのログ集合      | データベースのテーブルや一意キー制約ではない      |
| partition        | topic内の独立した順序付きログ   | すべてのパーティションにまたがる順序は自動保証されない |
| key              | パーティション選択に使用できるバイト列 | 同じkeyでも重複イベントは自動的に拒否されない    |
| offset           | パーティション内のレコードの位置    | パーティションをまたぐグローバルなイベントIDではない |
| consumer group   | 協調して受信するインスタンスのグループ | 異なるグループは同じレコードをそれぞれ読み取れる    |
| committed offset | グループが受信を再開するレコード位置  | 外部の業務システムの処理完了を証明しない        |
| lag              | 受信位置とログ末尾との距離       | 時間と業務処理速度も合わせて解釈する必要がある     |

通常のコンシューマーグループでは、ある割り当て期間中、1つのパーティションをそのグループの1つのコンシューマーが担当します。コンシューマーがパーティションより多い場合は待機するインスタンスが生じます。異なるグループによる独立した処理が、通常のブロードキャストや再生の方法です。

RabbitMQのクラシックキューではメッセージごとの確認応答とルーティングがよく使われ、Kafkaではパーティションログ、保持、再生がよく使われます。両者とも多様なメッセージ用途に対応できるため、「必ずどちらが速いか」だけで選定しないでください。

<a id="section-2"></a>

## 最小環境とtopicの作成 :id=h-8f82493bb59b

まずLinuxコンテナーを実行できるDockerをインストールし、リポジトリのルートから次の場所へ移動します。

```powershell
Set-Location examples/kafka
docker compose config --quiet
docker compose up -d
docker compose ps
docker compose logs --tail 80 kafka
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server 127.0.0.1:9092 --create --if-not-exists --topic notes.tasks.v1 --partitions 3 --replication-factor 1
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server 127.0.0.1:9092 --describe --topic notes.tasks.v1
```

docker compose psでkafkaがhealthyになるのを待ってから、topic作成コマンドを実行します。準備ができていない場合は、まずログを確認してください。

イメージはdigestを確認して固定しています。環境は単一ノードのKRaftを使用し、brokerとcontrollerを同時に実行します。静的投票メンバーはこのノードのみで、複数ノードの高可用性構成ではありません。

サービスはローカルの127.0.0.1:9092のみに公開され、TLS / SASLは未設定です。advertised.listenersはクライアントが後続の接続に使用するアドレスです。bootstrapだけを到達可能なアドレスに変更しても、その後のbrokerのアドレスに到達できるとは限りません。

<a id="section-3"></a>

## クライアントのインストールと送信、受信 :id=h-785615851e92

同じプロジェクトディレクトリで実行します。

```powershell
uv sync --locked
uv run --locked notes-kafka publish --event-id demo-001 --task-id task-1 --title "Learn Kafka"
uv run --locked notes-kafka consume --limit 1
```

この独立したプロジェクトでPython 3.14を固定するのは、ローカルで利用できるクライアントのビルド済みwheelに合わせるためです。他のサンプルのPython 3.15環境は変更しません。クライアントはConfluentが保守するオープンソースライブラリで、Confluent Cloudやその管理アカウントは不要です。

[完全なクライアント](examples/kafka/src/kafka_notes/demo.py)は、schemaVersion、eventId、taskId、titleを含むJSONを送信します。taskIdをkeyとして使用し、eventIdを業務上の重複排除に使用します。両者の目的は異なります。

プロデューサーはレコードを送信するクライアントで、コンシューマーは読み取るクライアントです。JSON内のschemaVersionはデータ形式のバージョンを表し、受信側が理解できる形式か検証するために使用します。

プロデューサーは冪等な送信、acks=all、配信コールバックを明示的に有効にし、flushの残りキューとコールバックのエラーを確認します。produceが戻っても、ローカルの送信処理に入ったことを意味するだけで、すぐに「業務処理完了」と表示してはいけません。

<a id="section-4"></a>

## パーティションと順序 :id=h-94358eb371eb

空でないkeyは、固定のエンコーディングとパーティション選択アルゴリズムを使用すれば、通常は安定したパーティションに対応します。この例はJavaプロデューサーと互換性のあるMurmur2パーティショナーを使用します。言語をまたぐプロジェクトではアルゴリズムを明示的に合わせ、すべてのクライアントの既定値が同じだと仮定しないでください。

パーティション数やパーティショナーを変更すると対応関係が変わる場合があります。複数のプロデューサー、業務スレッド、並列受信も観察される順序に影響します。業務エンティティごとの順序を保つには、keyを指定するだけでなく処理経路全体を制約する必要があります。

冪等性とは、同じ操作を繰り返しても追加の業務上の効果が生じないことです。送信プロトコルの保証なのか業務データベースの保証なのかを明確にする必要があります。acks=allは現在の同期レプリカ集合ISR内のレプリカの確認応答を要求し、min.insync.replicasは書き込み成功に必要な同期レプリカの最小数を制限します。

レプリカとパーティションは異なる問題を解決します。レプリカは耐障害性、パーティションは分散と並列化のために使用します。この例はレプリカが1つだけで、acks=allでも追加ノードの冗長性はありません。高可用性や任意の障害でデータを失わないことを示すものではありません。

<a id="section-5"></a>

## オフセットのコミット、重複、再生 :id=h-cc7c3c366376

クライアントは自動コミットと自動offset保存を無効にします。処理順序は、解析と検証 → SQLite トランザクションで効果とeventIdを記録 → そのメッセージの次の位置を同期コミットし、返されたパーティション単位のエラーを確認、となります。

データベースが失敗したらoffsetをコミットしません。データベースのコミット後、offsetのコミット前に停止すると、レコードが再生される場合があります。データベースの一意制約により同じeventIdの同じ効果を重複させず、内容が異なるのにIDを再使用するとエラーになります。

```powershell
uv run --locked notes-kafka publish --event-id demo-001 --task-id task-1 --title "Learn Kafka"
uv run --locked notes-kafka consume --limit 1
uv run --locked notes-kafka consume --group replay-demo --limit 10
```

2回目の発行は別のアプリケーション送信であり、Kafkaに別のレコードが存在する場合があります。ローカルの効果はnew effect: Falseとなるはずです。グループを変えると保持範囲内のレコードを再読できますが、同じSQLiteの重複排除データベースを使うため、効果は重複して発生しません。

auto.offset.reset=earliestは、有効なコミット位置がない場合や位置が範囲外の場合などにのみ適用され、既存のグループが毎回最初から読み始めるわけではありません。earliestも現在保持されている最も古い位置であり、すべての履歴を永久に保持する保証ではありません。

<a id="section-6"></a>

## 再試行、不正なメッセージ、exactly-onceの範囲 :id=h-147bc650c8e1

この例は不正なメッセージやデータベースエラーがあると停止し、該当位置をコミットしません。自動デッドレター機能はありません。再起動しても同じ問題に遭遇する場合があるため、調査、修正、または管理された方法での隔離が必要です。

本番処理では通常、回数制限のある再試行、バックオフ、失敗用topic、安定したイベントID、監視が必要です。失敗用topicに送信してからoffsetをコミットする場合にも障害の発生余地があります。lagを小さくするためにレコードを勝手に飛ばさないでください。

業務上の重複排除では処理の責任範囲も区別します。この例のグループ変更は同じ業務効果の再生です。独立した2つの業務プロセッサーはそれぞれの重複排除名前空間を使う必要があり、グローバルなeventId記録を共有すると別の業務処理を誤って飛ばす可能性があります。

プロデューサーの冪等性は主にプロトコルの再試行による重複を減らし、すべての重複業務リクエストを識別するわけではありません。Kafkaのトランザクションとread_committedは、適用可能なKafkaの読み書き経路で対応する保証を提供しますが、SQLite、支払い、メールを自動的にグローバルなexactly-onceにするものではありません。

この例の効果はSQLite内のイベントレコード1件だけです。外部呼び出しには独自の冪等性と復旧設計が必要です。データベースをまたぐ発行にはoutbox / CDCを検討し、業務のコミットとイベント発行をどう接続するか明確にします。

<a id="section-7"></a>

## 運用上の確認と検証 :id=h-f01999446568

```powershell
docker compose exec kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server 127.0.0.1:9092 --describe --group notes-demo
uv run --locked pytest
uv run --locked ruff check .
uv run --locked ruff format --check .
```

パーティション、グループ割り当て、コミット位置、lagを、ディスク、保持方針、ISR、リバランス、処理時間と合わせて確認します。グループのoffsetを変更する前に対象コンシューマーを停止して計画を確認してください。再生すると業務処理が再び実行されます。

現在ローカルでは、処理境界に関する6項目のテスト、Ruff、Compose設定の検証に合格しています。テストのコンシューマーは代替実装であり、実際のbrokerで送信、受信、リバランスが完了したことは証明しません。実際の統合手順は[サンプルの説明](examples/kafka/README.md)を参照してください。

| 現象                      | 最初の確認事項                              |
| ----------------------- | ------------------------------------ |
| bootstrapに接続できるが送信に失敗する | advertised.listeners、ネットワーク、topic、権限 |
| コンシューマーを増やしても速くならない     | パーティション数、keyの分布、ボトルネック               |
| 同じレコードが繰り返される           | 失敗位置、コミット結果、不正なメッセージ                 |
| 新しいグループでも初期のレコードが読めない   | retention、compaction、実際の開始位置         |
| 再生で外部への効果が重複する          | eventId、重複排除の記録、業務上の副作用の境界           |
| 複数のプロデューサーで順序が一致しない     | パーティション選択アルゴリズム、パーティション数、並行性、業務バージョン |

<a id="section-8"></a>

## 公式リファレンス :id=h-34ded3f97d3a

- [Apache Kafkaクイックスタート](https://kafka.apache.org/quickstart/)
- [Kafka brokerの設定](https://kafka.apache.org/44/configuration/broker-configs/)
- [Kafkaの設計](https://kafka.apache.org/44/design/design/)
- [Confluent Python API：コミット結果とパーティションのエラー](https://docs.confluent.io/platform/current/clients/confluent-kafka-python/html/index.html)
- [Confluent Pythonクライアント](https://docs.confluent.io/kafka-clients/python/current/overview.html)
- [librdkafkaのパーティション選択と設定](https://github.com/confluentinc/librdkafka/blob/master/CONFIGURATION.md)
