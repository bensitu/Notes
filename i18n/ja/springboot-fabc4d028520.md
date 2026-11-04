# Spring Boot と Java Web 開発でよく使うアノテーションの早見表 :id=h-7c1f675e7dd0

用途別にアノテーションを調べ、使う条件、役割、よくある誤解を確認します。

**前提知識とバージョン：** よく使うアノテーションの早見表であり、すべてを網羅する一覧ではありません。主な対象は Spring Boot 3 / Spring 6 / Jakarta です。JPA、Jackson、Lombok は別々のライブラリなので、それぞれの依存関係が必要です。

**サンプルの使い方：** 全ファイルと実行手順を明示したプロジェクトを除き、各コードブロックは節ごとの独立した断片です。省略部分や仮の名前を補ってください。誤りと示した行は問題の説明用です。同じ節の代替実装を混ぜないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://docs.spring.io/spring-framework/reference/)

**このページの目次**

- [この早見表の読み方](#section-1)
- [Spring コンテナーと依存性の注入](#section-2)
- [Spring MVC のリクエストとレスポンス](#section-3)
- [検証・トランザクション・例外](#section-4)
- [JPA：エンティティーと関連](#section-5)
- [Jackson：JSON のマッピング](#section-6)
- [Lombok：よく使うコードの生成](#section-7)
- [JPA のライフサイクルコールバック](#section-8)

<a id="section-1"></a>

## この早見表の読み方 :id=h-b7bc02c4a8fe

アノテーションはコードに情報を付けるものです。コンパイラー、フレームワーク、ツールが認識して初めて作用します。この文書は、よく使うアノテーションをまとめたもので、「Spring Boot のすべてのアノテーション」ではありません。

Spring Boot 2 / Spring 5 の Java EE API は、通常 javax パッケージを使います。Spring Boot 3、4 の対応する API は jakarta を使います。ただし、すべての javax が改名されたわけではありません。例えば JDBC の javax.sql.DataSource は引き続き javax です。先に依存バージョンを確認し、その後で import を確認してください。

<a id="section-2"></a>

## Spring コンテナーと依存性の注入 :id=h-4c1682a681bb

| アノテーション                  | 使う場所                | 役割と注意点                                                      |
| ------------------------ | ------------------- | ----------------------------------------------------------- |
| @SpringBootApplication   | アプリケーションの起動クラス      | 起動用の設定、自動構成、コンポーネントスキャンを組み合わせる。既定では自身のパッケージとサブパッケージを走査する    |
| @Configuration           | 設定クラス               | 設定を宣言する。メソッドに @Bean を付けられる                                  |
| @Bean                    | 設定用のメソッド            | 戻り値のオブジェクトを Spring の管理対象にする。既定の Bean 名はメソッド名                |
| @Component               | クラス                 | 通常のコンポーネントを登録する                                             |
| @Service                 | クラス                 | 業務サービスを示す。コンポーネント用アノテーションの一種                                |
| @Repository              | クラス                 | 永続化層のコンポーネントを示し、例外変換の仕組みと組み合わせられる。付けるだけで SQL が自動実装されるわけではない |
| @ComponentScan           | 設定クラス               | コンポーネントを走査する範囲を指定する                                         |
| @Import                  | 設定クラス               | 設定クラスや、ほかの登録可能なコンポーネントを取り込む                                 |
| @ImportResource          | 設定クラス               | XML の設定を読み込む                                                |
| @EnableAutoConfiguration | 設定クラス               | 依存関係や既存の Bean に応じて機能を設定する。通常は起動アノテーション経由で間接的に使う             |
| @Autowired               | コンストラクター、フィールド、メソッド | 型によって依存先を探す。候補が複数あれば @Qualifier や @Primary を組み合わせる          |
| @Qualifier               | 注入する箇所など            | 同じ型の候補を絞り込む。名前による指定は、絞り込み方法の一つ                              |
| @Primary                 | Bean の定義            | 候補が複数ある場合に、この Bean を優先する                                    |
| @Value                   | フィールド、パラメーターなど      | `${server.port}` など、単一の設定値を読み取る                             |
| @ConfigurationProperties | 設定クラスまたは Bean メソッド  | 接頭辞を指定して設定群をまとめて結び付ける。多数の @Value より管理しやすい                   |
| @Scope                   | Bean の定義            | singleton、prototype、request、session などのスコープを指定する            |

コンストラクターが 1 つだけなら、Spring は @Autowired なしで自動的に使えます。コンストラクター注入では、必須の依存関係が明確になり、テストもしやすくなります。

```java
@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

これは構造を示す断片です。UserRepository を定義し、Bean として登録する必要もあります。

@Resource は Java EE / Jakarta のアノテーションです。通常は名前で検索し、規則に従って型による照合へ切り替わります。@Inject も依存性の注入に使いますが、@Autowired の required 属性はありません。すべての細部が同じだと考えないでください。

<a id="section-3"></a>

## Spring MVC のリクエストとレスポンス :id=h-d181fcaf810b

| アノテーション                                                                   | 役割                          | 例や制約                                                     |
| ------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------- |
| @Controller                                                               | コントローラーを宣言する                | ビュー名を返せる。@ResponseBody と組み合わせるとデータを返せる                   |
| @RestController                                                           | @Controller + @ResponseBody | HTTP レスポンス本文を返す。これだけでインターフェースが REST に従うとは限らない            |
| @RequestMapping                                                           | リクエストを照合する                  | path/value、method、params、headers、consumes、produces などの条件 |
| @GetMapping / @PostMapping / @PutMapping / @DeleteMapping / @PatchMapping | HTTP メソッドを限定する              | コントローラーのメソッドに付ける                                         |
| @PathVariable                                                             | パス変数を読み取る                   | /users/{id} の id                                         |
| @RequestParam                                                             | クエリパラメーターやフォームの値を読み取る       | ?page=1。既定では required=true                               |
| @RequestHeader                                                            | リクエストヘッダーを読み取る              | Accept、Authorization など                                  |
| @CookieValue                                                              | Cookie を読み取る                | 値がない場合の扱いに注意する                                           |
| @RequestBody                                                              | メッセージコンバーターでリクエスト本文を読み取る    | JSON によく使うが、テキストなども読み取れる。JSON 専用ではない                     |
| @ResponseBody                                                             | 戻り値をレスポンス本文に書き込む            | pattern 属性はない。具体的な形式はメッセージコンバーターが決める                     |
| @DateTimeFormat                                                           | クエリパラメーターやフォーム内の日付を変換する     | pattern="yyyy-MM-dd"。JSON の日付形式を直接制御するものではない             |
| @JsonFormat                                                               | Jackson による日付などのシリアライズ形式    | @DateTimeFormat とは用途が異なる                                 |

```java
@RestController
@RequestMapping("/users")
public class UserController {
    @GetMapping("/{id}")
    public Map<String, Long> find(@PathVariable("id") Long id) {
        return Collections.singletonMap("id", id);
    }
}
```

Spring MVC のアノテーション、java.util.Map、java.util.Collections をインポートします。プロジェクトには MVC と JSON メッセージ変換の依存関係が必要で、通常は Spring Boot の Web starter が提供します。

<a id="section-4"></a>

## 検証・トランザクション・例外 :id=h-dc4934461810

| アノテーション                      | 役割                                | 注意点                                               |
| ---------------------------- | --------------------------------- | ------------------------------------------------- |
| @Valid                       | Bean Validation を開始する             | 検証の実装が必要。@RequestBody とよく組み合わせる                   |
| @Validated                   | Spring の検証の入口、検証グループなど            | @Valid と共通する部分はあるが、完全には同じではない                     |
| @NotNull / @NotBlank / @Size | 検証の制約を宣言する                        | それぞれ null 以外、空白だけではない文字列、長さやコレクションの件数などを制約する      |
| @Transactional               | トランザクションを宣言する                     | 既定のプロキシ方式では、クラス内から自分のトランザクションメソッドを直接呼んでもプロキシを通らない |
| @ControllerAdvice            | コントローラーに関する処理をまとめる                | 例外処理やデータバインディングなどに使える                             |
| @RestControllerAdvice        | @ControllerAdvice + @ResponseBody | API のエラーレスポンスによく使う                                |
| @ExceptionHandler            | 例外処理のメソッドを宣言する                    | 通常は Advice と組み合わせるか、コントローラー内に置く                   |

@Transactional は既定で RuntimeException と Error に対してロールバックしますが、検査例外ではロールバックしません。検査例外でも戻すには、rollbackFor=Exception.class を設定します。readOnly は読み取り専用のヒントで、実際の扱いはトランザクションマネージャーやデータベースによります。汎用的な権限制御として扱ってはいけません。timeout の単位はミリ秒ではなく秒です。

エラーレスポンスでは、本文と HTTP ステータスコードの両方を考えます。エラーの JSON を返すだけで、常に 200 のままにしないでください。

<a id="section-5"></a>

## JPA：エンティティーと関連 :id=h-644c23bdf67d

以下は Jakarta Persistence / JPA のアノテーションで、MyBatis のものではありません。MyBatis だけのプロジェクトで、@Entity が自動的にデータベースとの対応を作ると期待しないでください。

| アノテーション                                           | 意味                                                              |
| ------------------------------------------------- | --------------------------------------------------------------- |
| @Entity                                           | 永続化するエンティティーを宣言する。通常は主キーと、アクセス可能な引数なしのコンストラクターが必要               |
| @Table                                            | テーブル名や索引などを指定する。命名戦略によって実際のテーブル名が変わる場合もある                       |
| @Id                                               | 主キーを示す                                                          |
| @GeneratedValue                                   | 主キーの生成方法を指定する                                                   |
| @SequenceGenerator                                | シーケンス生成器を定義する。選んだ方法をデータベースがサポートする必要がある                          |
| @MappedSuperclass                                 | 親のマッピング属性を子のエンティティーが継承する。親自体を独立したエンティティーテーブルにはしない               |
| @Column                                           | 列名、nullable、length、precision、scale、insertable、updatable などを指定する |
| @Transient                                        | そのプロパティーを永続化しない。JSON のシリアライズからも除外するとは限らない                       |
| @Basic                                            | 基本属性のマッピング。LAZY はヒントであり、提供元による拡張機能が必要になる場合がある                   |
| @OneToOne / @OneToMany / @ManyToOne / @ManyToMany | エンティティーの関連を定義する                                                 |
| @JoinColumn                                       | 関連で使う結合列を指定する。付ける場所は関連の種類と所有側による                                |
| @NoRepositoryBean                                 | Spring Data が基底リポジトリのインターフェースをインスタンス化の対象から外す。JPA のアノテーションではない   |

従来の JPA の主キー生成方式は AUTO、IDENTITY、SEQUENCE、TABLE です。JPA 3.1 で UUID が追加されました。native は GenerationType 列挙型の要素ではありません。MySQL では IDENTITY をよく使います。ほかのデータベースの SEQUENCE 設定を、そのままコピーしないでください。

@Column(nullable=false) は主にマッピングとテーブル作成時の制約を表し、リクエストの検証の代わりにはなりません。precision/scale は正確な小数を扱う列向けで、金額には通常 BigDecimal を使います。double の浮動小数点精度を調整する設定ではありません。

<a id="section-6"></a>

## Jackson：JSON のマッピング :id=h-5e0a04898143

- @JsonIgnore は通常、シリアライズとデシリアライズでプロパティーを無視します。詳細な動作は、そのプロパティーに組み合わせた設定によります。
- @JsonManagedReference / @JsonBackReference は、親子間の双方向参照を扱います。BackReference 側は、通常の再帰的な子オブジェクトとして出力されません。
- 複雑な関連を持つ JPA エンティティーを、そのまま返すことは避けてください。レスポンス用の DTO を明確に用意すると、フィールドやクエリ回数を管理しやすくなります。

<a id="section-7"></a>

## Lombok：よく使うコードの生成 :id=h-4be716196713

| アノテーション・型                | 役割と制約                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------- |
| @Getter / @Setter        | フィールドやクラスに付け、アクセサーを生成する。final フィールドの通常の setter は生成しない                                 |
| @Data                    | アクセサー、equals/hashCode、toString、必須引数のコンストラクターなどを組み合わせる。すべてのフィールドに無条件で setter を作るわけではない |
| @NoArgsConstructor       | 引数なしのコンストラクターを生成する                                                                    |
| @RequiredArgsConstructor | 初期化されていない final フィールドと、条件に合う @NonNull フィールドを引数に持つコンストラクターを生成する                        |
| @AllArgsConstructor      | インスタンスフィールドをすべて引数に持つコンストラクターを生成する                                                     |
| @EqualsAndHashCode       | 等価性を調べるメソッドを生成する。既定では static と transient のフィールドを含めない                                  |
| @ToString                | toString を生成する。パスワードや再帰する可能性のある関連は除外する                                                |
| @Log4j2                  | Log4j 2 のログオブジェクトを生成する。対応するログの依存関係が必要                                                 |
| @NonNull                 | 対応する Lombok の生成コードに引数チェックを追加する。全体で null を禁止する保証ではない                                   |
| val                      | ローカル変数の型を推論し、final のローカル変数を生成する。フィールドのアノテーションには使えない                                   |

Lombok はコンパイル時のアノテーション処理が必要です。コンストラクター用アノテーションは組み合わせられますが、同じシグネチャーを生成すると競合します。手書きのコンストラクターとも重複しないか確認してください。

<a id="section-8"></a>

## JPA のライフサイクルコールバック :id=h-c9be6deae864

| コールバック                     | 実行タイミング              |
| -------------------------- | -------------------- |
| @PostLoad                  | エンティティーの読み込みや再読み込みの後 |
| @PrePersist / @PostPersist | 永続化の前 / 挿入処理の後       |
| @PreUpdate / @PostUpdate   | データベースの更新処理の前後       |
| @PreRemove / @PostRemove   | 削除の前後                |

SQL は flush の時点で実行されることがあり、必ずしも commit まで待ちません。PostPersist、PostUpdate、PostRemove も、トランザクションのコミット成功を表すものではありません。getReference がプロキシを返す場合は、直ちにエンティティーを読み込んだり、PostLoad を実行したりするとは限りません。

参考：[Spring のアノテーション](https://docs.spring.io/spring-framework/reference/)、[Jakarta Persistence](https://jakarta.ee/specifications/persistence/)、[Lombok の機能](https://projectlombok.org/features/)。
