# TypeScript の基礎 :id=h-48a840d52279

型がエラーを発見する仕組みを学び、インターフェース、ユニオン型、ジェネリクスなどの項目ごとに書き方を確認します。

**前提知識とバージョン：** 先に JavaScript を習得してください。strict を有効にした TypeScript 5.x を推奨します。型チェックは実行時の検証ではありません。エラーの実演と代替の書き方は分けて使用してください。

**サンプルの使い方：** 全ファイルと実行手順が明示されたプロジェクトを除き、コードブロックは各節の独立した断片です。省略記号や仮の名前は補ってください。誤りと記された行は問題を説明するためのものです。同じ節の代替コードを組み合わせないでください。

[ドキュメント一覧](README.md) · [公式リファレンス](https://www.typescriptlang.org/docs/handbook/)

**目次**

- [推奨するチェック方法](#section-1)
- [基礎編](#section-2)

<a id="section-1"></a>

## 推奨するチェック方法 :id=h-3e7f0b6aed54

まずプロジェクトに必要な TypeScript 5.x をインストールし、package-lock.json を保持します。以下は通常のブラウザー向けの例の tsconfig.json で、Vue プロジェクトの完全な設定ではありません。

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "noEmit": true,
    "lib": ["ES2020", "DOM"]
  },
  "include": ["src/**/*.ts"]
}
```

`npx tsc` で型チェックを実行します。同じコードブロックに 2 つの代替案を並べる場合があるので、重複宣言を避けて別々に使用してください。Error、誤りと記された行や不適合な代入はエラーの実演であり、チェッカーがエラーを報告するのが正しい動作です。型アサーションはチェッカーにのみ作用し、実行時データの変換や検証は行いません。不確かな外部入力には unknown を優先し、項目ごとに確認してください。

<a id="section-2"></a>

## 基礎編 :id=h-0ddf7b4454b4

### 01、基本の型 :id=h-997bcd164a50

**真偽値型 boolean**：true または false だけを表します。例：`const enabled: boolean = true;`。

**数値型 number**：JavaScript の通常の数値を表し、int と double を区別しません。例：`const price: number = 12.5;`。大きな整数を扱う bigint は別の型です。

**文字列型 string**：文字列を表します。例：`const username: string = "Alice";`。

**配列**：
宣言方法：

```typescript
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
```

**タプル Tuple**：要素数と各要素の型が既知の配列を表せます。各要素の型は同じでなくても構いません。

```typescript
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```

**列挙型**：

```typescript
enum Color {Red, Green, Blue}
let c: Color = Color.Green;

enum Color {Red = 1, Green, Blue}   // See note 1 below.
let c: Color = Color.Green;
```

例の説明：

1. 1 から採番する

**Any**:

```typescript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean

let list: any[] = [1, true, "free"];
list[1] = 100;
```

**void**：呼び出し元が関数の戻り値を使用しないことを表し、操作だけを行い業務上の結果を返さない関数でよく使います。「型がまったくない」という意味ではなく、never とも異なります。

```typescript
function warnUser(): void {
    alert("This is my warning message");
}
```

void は主に関数の戻り値を使用しないことを表します。strictNullChecks=true では void 型の変数に null を代入できません。通常は void を返す関数を書き、この型の変数は定義しません。

**Null と Undefined**：strictNullChecks を無効にすると、null と undefined の代入チェックが緩くなります。strict（strictNullChecks を含む）の有効化を勧めます。この場合、string は null を受け付けないため、string | null などのユニオン型を明示します。

**Never**：存在し得ない値の型を表します。
常に例外を投げる、または決して戻らない関数式やアロー関数式の戻り値型が never です。
never はすべての型のサブタイプであり、任意の型へ代入できます。

```typescript
// See note 1 below.
function error(message: string): never {
    throw new Error(message);
}

// See note 2 below.
function fail() {
    return error("Something failed");
}

// See note 3 below.
function infiniteLoop(): never {
    while (true) {
    }
}
```

例の説明：

1. never を返す関数では終点に到達できない必要がある
2. 推論される戻り値型は never
3. never を返す関数では終点に到達できない必要がある

**型アサーション**：
形式は 2 通りあります。1 つ目は山括弧を使う構文です。

```typescript
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```

もう 1 つは as 構文です。

```typescript
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

### 02、変数宣言 :id=h-dba5bd976713

再代入しない変数には const を優先し、再代入が必要なら let を使います。const はオブジェクト内部のプロパティを凍結しません。var はスコープと巻き上げの規則が異なり、新しいコードでは通常避けます。分割代入はオブジェクトや配列から値を取り出すもので、取得したデータを自動検証するわけではありません。

### 03、インターフェース :id=h-f753ce653404

#### インターフェースの入門 :id=h-97ea78db7d07

例：

```typescript
function printLabel(labelledObj: { label: string }) {
  console.log(labelledObj.label);
}
let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);

// See note 1 below.
interface LabelledValue {
  label: string;
}
function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}
let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

例の説明：

1. 上の例を書き換える

ほかの言語のように、ここで printLabel に渡すオブジェクトがインターフェースを実装していると考えるわ���ではありません。注目するのは値の構造だけです。渡すオブジェクトが上記の必要条件を満たせば、受け入れられます。

#### 任意のプロパティ :id=h-3c0481869966

インターフェースのプロパティはすべて必須とは限りません。特定の条件でだけ存在するものや、存在しないものもあります。任意のプロパティは、関数に渡すオプションオブジェクトの一部だけを指定する「option bags」パターンでよく使われます。

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}
function createSquare(config: SquareConfig): {color: string; area: number} {
  let newSquare = {color: "white", area: 100};
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}
let mySquare = createSquare({color: "black"});
```

#### 読み取り専用プロパティ :id=h-60403b14b5d1

readonly は現在の型を通じたプロパティの変更を制限し、初期化後にその型から再代入できなくします。型チェック時だけ作用し、実行時のオブジェクトは凍結しません。プロパティ名の前に readonly を指定します。

```typescript
interface Point {
    readonly x: number,
    readonly y: number
}
let p1: Point = {x:5, y:10};
p1.x = 10;
```

ReadonlyArray<T> は現在の読み取り専用参照から変更用メソッドを呼べなくするだけで、実行時の配列を凍結しません。別の書き込み可能な参照からは変更できる場合があります。

```typescript
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

次のようにアサーションできます。

```typescript
a = ro as number[];
```

readonly と const
使い分けは、変数として使うかプロパティとして使うかで判断するのが最も簡単です。変数には const、プロパティには readonly を使います。

#### 余剰プロパティのチェック :id=h-fb5d7e1d84a4

```typescript
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
function createSquare(config: SquareConfig): {color: string; area: number} {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}
let mySquare = createSquare({colorr: "black"});
```

ここでは SquareConfig が任意個のプロパティを持てることを表します。color と width 以外であれば、その型は問いません。

最後の回避方法は意外かもしれませんが、オブジェクトを別の変数に代入することです。squareOptions は余剰プロパティのチェックを受けないため、コンパイラーはエラーを報告しません。

こうしたチェックの回避はプログラムの正常な動作を妨げる場合があるため、使わない方がよいでしょう。

#### 関数型 :id=h-a0e1f361797c

インターフェースで関数型を表すには、呼び出しシグネチャを定義します。引数リストと戻り値型だけの関数定義に似ており、各引数には名前と型が必要です。

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

// See note 1 below.
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
};

// See note 2 below.
let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
};

// See note 3 below.
let mySearch: SearchFunc;
mySearch = function(src, sub) {
    let result = src.search(sub);
    return result > -1;
}
```

例の説明：

1. 典型的な書き方
2. 関数型の型チェックでは、引数名をインターフェースで定義した名前に一致させる必要はありません。例えば、上の例を次のように書き換えられます。
3. この書き方も可能

#### インデックス可能な型 :id=h-732cfe72dc01

インデックス可能な型にはインデックスシグネチャがあり、オブジェクトのインデックスの型と、対応する戻り値型を記述します。

```typescript
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

このインデックスシグネチャは、number で StringArray にアクセスすると string 型の値が得られることを表します。

現在の TypeScript は文字列、数値、symbol などのインデックスシグネチャや、一部のテンプレートリテラルのインデックスにも対応します。ここではよく使う文字列と数値から紹介します。両方を併用できますが、数値インデックスの戻り値型は、文字列インデックスの戻り値型のサブタイプである必要があります。

```typescript
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}
// See note 1 below.
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}
```

例の説明：

1. エラー：数値形式の文字列でアクセスすると、まったく異なる Animal が得られる場合がある。

次の例では name の型が文字列インデックスの型と一致しないため、型チェッカーがエラーを報告します。

```typescript
interface NumberDictionary {
  [index: string]: number;
  length: number;    // See note 1 below.
  name: string       // See note 2 below.
}
```

例の説明：

1. 可能。length は number 型
2. エラー。name の型がインデックスの戻り値型と一致しない

最後に、インデックスシグネチャを readonly にすると、インデックス経由の代入を防げます。

```typescript
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory"; // error!
```

#### クラス型 :id=h-8fc53f84ba1e

**インターフェースの実装**

```typescript
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

**クラスの静的側とインスタンス側の違い**

クラスとインターフェースを扱う際は、クラスには静的側の型とインスタンスの型という 2 つの型があることを理解してください。

次の例では 2 つのインターフェースを定義し、ClockConstructor はコンストラクター、ClockInterface はインスタンスメソッドに使います。便宜上、渡された型を使ってインスタンスを作る createClock を定義します。

#### インターフェースの継承 :id=h-4a48a0665b18

```typescript
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;

// See note 1 below.
let square = <{color: string, sideLength: number}>{};
square.color = "blue";
square.sideLength = 10;
console.log(square);
```

例の説明：

1. この方法も可能

インターフェースは複数のインターフェースを継承し、それらを組み合わせたインターフェースを作成できます。

```typescript
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

#### ハイブリッド型 :id=h-dd9824495254

```typescript
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

#### クラスを継承するインターフェース :id=h-b7b56999da59

```typescript
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {
    select() { }
}

// See note 1 below.
class Image implements SelectableControl {
    select() { }
}

class Location {
}
```

例の説明：

1. エラー：Image 型に state プロパティがない。

### 04、クラス :id=h-609ad83f412c

#### はじめに :id=h-65cfa5823b77

```typescript
class Greeter {
    greeting: string;       // See note 1 below.
    constructor(message: string) {      // See note 2 below.
        this.greeting = message;
    }
    greet() {       // See note 3 below.
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```

例の説明：

1. 属性
2. コンストラクター
3. メソッド

#### 継承 :id=h-85d09f16ffb6

```typescript
class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```

より複雑な例

```typescript
class Animal{
    name: string;
    constructor(theName: string) {
        this.name = theName
    }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters} m.`)
    }
}
class Snake extends Animal {
    constructor(name: string) {
        super(name);
    }
    move(distanceInMeters = 5) {
        console.log('slithering......');
        super.move(distanceInMeters);
    }
}
class Horse extends Animal{
    constructor(name: string) {
        super(name);
    }
    move(distanceInMeters = 45) {
        console.log('Galloping......');
        super.move(distanceInMeters);
    }
}
let sam = new Snake('Sammy the python');
let tom:Horse = new Horse('Tommy the Palomino');

sam.move();
tom.move(34);
```

#### public、private、protected 修飾子 :id=h-f75c7908a95e

**デフォルトは public**

メンバーに public を明示することもできます。上の Animal クラスは次のように書き換えられます。

```typescript
class Animal {
    public name: string;
    public constructor(thename: string) {
        this.name = thename;
    }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters} m.`)
    }
}
```

**private を理解する**

private と指定したメンバーは、宣言したクラスの外からアクセスできません。

```typescript
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}
new Animal("Cat").name; // See note 1 below.
```

例の説明：

1. エラー：name は private。

一方の型に private メンバーがある場合、もう一方にも同じ宣言に由来する private メンバーがある場合だけ、2 つの型を互換とみなします。protected メンバーにも同じ規則が適用されます。

```typescript
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { super("Rhino"); }
}

class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // See note 1 below.
```

例の説明：

1. エラー：Animal と Employee は互換でない。

**protected を理解する**：

protected 修飾子は private に似ていますが、protected メンバーには派生クラスからもアクセスできます。

```typescript
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}

class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name)
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name); // See note 1 below.
```

例の説明：

1. エラー

Person クラスの外から name は使えませんが、Employee は Person を継承しているため、Employee のインスタンスメソッドからはアクセスできます。

コンストラクターにも protected を指定できます。クラスの外から直接インスタンス化できなくなりますが、継承は可能です。

```typescript
class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}

// See note 1 below.
class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
let john = new Person("John"); // See note 2 below.
```

例の説明：

1. Employee は Person を継承できる
2. エラー：Person のコンストラクターは protected。

#### readonly 修飾子 :id=h-e641756493fc

readonly キーワードで、型チェック時にプロパティを読み取り専用にできます。読み取り専用プロパティは、宣言時またはコンストラクターで初期化する必要があります。

```typescript
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // See note 1 below.
```

例の説明：

1. エラー：name は読み取り専用。

**パラメータープロパティ**

```typescript
class Animal {
    constructor(private name: string) { }
    move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

コンストラクターで private name: string と指定するだけで name メンバーの作成と初期化ができ、宣言と代入を一か所にまとめられます。

パラメータープロパティは、コンストラクターの引数にアクセス修飾子を付けて宣言します。private を付けると private メンバーを宣言・初期化します。public と protected も同様です。

#### アクセサー :id=h-00251a22434f

まずアクセサーを使わない例から始めます。

```typescript
class Employee {
    fullName: string;
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```

fullName を自由に設定できるのは便利ですが、問題につながることもあります。

次のように変更します。

```typescript
class Employee {
    private _fullName: string = 'yale';

    get fullName(): string {
        return this._fullName;
    }

    set fullName(value: string) {
        this._fullName = value;
    }
}
let employee: Employee = new Employee();
employee.fullName = '123';
console.log(employee.fullName);
```

これでフィールドの読み書きを制御できます。

#### 静的プロパティ :id=h-fa0fd6e08d4a

クラスの静的メンバーも作成でき、これらはインスタンスではなくクラス自体に存在します。この例では、すべてのグリッドで使う origin を static で定義します。各インスタンスがアクセスするときは origin の前にクラス名を付けます。インスタンスプロパティに this. を付けるのと同様に、ここでは Grid. で静的プロパティにアクセスします。

```typescript
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

#### 抽象クラス :id=h-0c1a5415062c

抽象クラスは派生クラスの基底クラスとして使い、通常は直接インスタンス化しません。インターフェースと異なり、メンバーの実装も含められます。abstract キーワードで抽象クラスと、その中の抽象メソッドを定義します。

```typescript
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch...');
    }
}
```

抽象クラスの抽象メソッドは実装を持たず、派生クラスで実装する必要があります。構文はインターフェースのメソッドに似ており、どちらも本体のないシグネチャを定義します。ただし抽象メソッドには abstract が必須で、アクセス修飾子も指定できます。

```typescript
abstract class Department {
    constructor(public name: string) {
    }
    printName(): void {
        console.log('Department name: ' + this.name);
    }
    abstract printMeeting(): void; // See note 1 below.
}

class AccountingDepartment extends Department {
    constructor() {
        super('Accounting and Auditing'); // See note 2 below.
    }
    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }
    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department: Department; // See note 3 below.
department = new Department(); // See note 4 below.
department = new AccountingDepartment(); // See note 5 below.
department.printName();
department.printMeeting();
department.generateReports(); // See note 6 below.
```

例の説明：

1. 派生クラスで実装する必要がある
2. 派生クラスのコンストラクターでは super() を呼ぶ必要がある
3. 抽象型への参照は作成できる
4. エラー：抽象クラスはインスタンス化できない
5. 抽象クラスの派生クラスをインスタンス化して代入できる
6. エラー：宣言した抽象クラスにそのメソッドがない

#### クラスをインターフェースとして使うこともできる :id=h-869b06dc919e

```typescript
class Point {
    x: number;
    y: number;
}
interface Point3d extends Point {
    z: number;
}
let point3d: Point3d = {x: 1, y: 2, z: 3};
```

### 05、関数 :id=h-adfeb5e72c94

#### 関数型 :id=h-edec12a310c2

**関数に型を定義する**

```typescript
function add(x: number, y: number): number {
    return x + y;
}
let myAdd = function(x: number, y: number): number { return x + y; };
```

TypeScript は return 文から戻り値型を推論できるため、通常は省略します。

#### 任意引数とデフォルト引数 :id=h-60309a036896

?、デフォルト値、残余引数の指定がない通常の引数は、原則として必須です。簡単���言えば、渡す引数の数は関数が期待する数と一致する必要があります。

```typescript
function buildName(firstName: string, lastName: string) {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // ah, just right
```

TTypeScript では引数名の横に ? を付けると任意引数にできます。例えば last name を任意にします。

```typescript
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}
let result1 = buildName("Bob");  // works correctly now
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");  // ah, just right
```

TTypeScript では、引数が省略された場合や undefined が渡された場合のデフォルト値を指定できます。これをデフォルト初期化された引数と呼びます。上の例を変更し、last name のデフォルト値を "Smith" にします。

```typescript
function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}
let result1 = buildName("Bob");                  // works correctly now, returns "Bob Smith"
let result2 = buildName("Bob", undefined);       // still works, also returns "Bob Smith"
let result3 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result4 = buildName("Bob", "Adams");         // ah, just right
```

#### 残余引数 :id=h-0b09bb96a258

```typescript
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

#### this :id=h-332e84c38657

TypeScript は this の誤用を知らせてくれます。

### 06、ジェネリクス :id=h-2cf58d4f3e8f

#### はじめに :id=h-0c969bc6960a

ジェネリクスを使わない場合、関数は次のようになります。

```typescript
function identity(arg: number): number {
    return arg;
}
function identity(arg: any): any {
    return arg;
}
```

any 型を使うと、arg に任意の型を渡せますが、入力と戻り値が同じ型であるという情報が失われます。数値を渡しても、どの型の値が返るか分からなくなります。

そこで、戻り値型を入力引数の型と同じにする方法が必要です。ここでは、値ではなく型だけを表す特別な変数である型変数を使います。

```typescript
function identity<T>(arg: T): T {
    return arg;
}
```

ジェネリック関数を定義した後は、2 通りの方法で使用できます。1 つ目は型引数を含むすべての引数を渡す方法です。

```typescript
let output = identity<string>("myString");  // type of output will be 'string'
```

2 つ目は、より一般的な型推論を使う方法です。渡した引数に基づいて、コンパイラーが T の型を自動で決定します。

```typescript
let output = identity("myString");  // type of output will be 'string'
```

コンパイラーは myString の値を見て、T をその型に設定できます。型推論によりコードを簡潔で読みやすく保てます。

#### ジェネリック型変数の使用 :id=h-ad5ba3fc4603

arg の長さも表示したい場合、次のように書きたくなるでしょう。

```typescript
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

型変数は任意の型を表すことを忘れないでください。呼び出し元は数値を渡すかもしれませんが、数値に .length プロパティはありません。

配列を扱うのであれば .length が存在するはずです。ほかの配列と同じように、この配列を定義できます。

```typescript
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

これにより型変数 T を型全体ではなく型の一部として使え、柔軟性が高まります。

```typescript
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

#### ジェネリック型 :id=h-3baec164c993

ジェネリック関数の型は、関数宣言のように先頭に型引数がある以外は、通常の関数型と変わりません。
型引数の名前は異なってもよく、個数と使い方が対応していれば問題ありません。

```typescript
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: <U>(arg: U) => U = identity;
```

呼び出しシグネチャを持つオブジェクトリテラルで、ジェネリック関数を定義することもできます。

```typescript
let myIdentity: {<T>(arg: T): T} = identity;
```

これで最初のジェネリックインターフェースを書けます。上の例のオブジェクトリテラルをインターフェースとして取り出します。

```typescript
interface GenericIdentityFn {
    <T>(arg: T): T;
}
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: GenericIdentityFn = identity;
```

#### ジェネリッククラス :id=h-4c72581b7002

ジェネリッククラスはジェネリックインターフェースに似ています。クラス名の後に、<> で囲んだ型引数を記述します。

```typescript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

#### ジェネリクスの制約 :id=h-eb4f1a199dcd

制約条件を表すインターフェースを定義します。.length プロパティを持つインターフェースを作成し、extends キーワードと組み合わせて制約を指定します。

```typescript
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

制約の型に適合し、必須のプロパティを持つ値を渡す必要があります。

```typescript
loggingIdentity(3);  // Error, number doesn't have a .length property
loggingIdentity({length: 10, value: 3});
```

**ジェネリック制約での型引数の使用**

プロパティ名を使って obj から値を取得し、そのプロパティが存在することを保証したいため、2 つの型の間に制約を指定します。

```typescript
function getProperty(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

**ジェネリクスでのクラス型の使用**

TypeScript でジェネリクスを使ってファクトリー関数を作る場合、コンストラクターのクラス型を参照する必要があります。例えば、次のとおりです。

```typescript
function create<T>(c: {new(): T; }): T {
    return new c();
}
```

より高度な例では、プロトタイプのプロパティを使ってコンストラクターとクラスのインスタンスとの関係を推論し、制約します。

```typescript
class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;  // typechecks!
createInstance(Bee).keeper.hasMask;   // typechecks!
```

### 07、列挙型 :id=h-510c56c0400a

#### 数値列挙型 :id=h-a83c9355e24d

最も簡単な数値列挙型：

```typescript
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
```

Up を 1 で初期化します。残りのメンバーは 1 から自動で増加し、Direction.Up は 1、Down は 2、Left は 3、Right は 4 になります。

初期化子をすべて省略することもできます。

```typescript
enum Direction {
    Up,
    Down,
    Left,
    Right,
}
```

Up は 0、Down は 1、以降も同様です。

列挙型は簡単に使えます。プロパティでメンバーにアクセスし、名前で列挙型の型を参照します。

```typescript
enum Response {
    No = 0,
    Yes = 1,
}
function respond(recipient: string, message: Response): void {
    // ...
}
respond("Princess Caroline", Response.Yes)
```

数値列挙型には計算メンバーと定数メンバーを混在できます。初期化子のないメンバーは先頭に置くか、数値定数やほかの定数メンバーで初期化されたメンバーの後に置く必要があります。したがって、次の例は許可されません。

```typescript
enum E {
    A = getSomeValue(),
    B, // error! 'A' is not constant-initialized, so 'B' needs an initializer
}
```

#### 文字列列挙型 :id=h-cbd54d0ddc10

```typescript
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```

#### 計算メンバーと定数メンバー :id=h-3ed600db0137

- 列挙式のリテラル。主に文字列リテラルまたは数値リテラル
- 先に定義した定数列挙メンバーへの参照。別の列挙型で定義されたものも可能
- 括弧で囲��だ定数列挙式
- 定数列挙式に単項演算子 +、-、\~ のいずれかを適用したもの
- 定数列挙式を二項演算子 +、-、\*、/、%、<<、>>、>>>、&、|、^ のオペランドにしたもの。評価結果が NaN または Infinity ならコンパイルエラーになります。

それ以外の列挙メンバーはすべて、計算して求める値として扱われます。

```typescript
enum FileAccess {
    // constant members
    None,
    Read    = 1 << 1,
    Write   = 1 << 2,
    ReadWrite  = Read | Write,
    // computed member
    G = "123".length
}
```

#### ユニオン列挙型と列挙メンバーの型 :id=h-1fbcf17fbc7d

```typescript
enum ShapeKind {
    Circle,
    Square,
}

interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

let c: Circle = {
    kind: ShapeKind.Square,
    //    ~~~~~~~~~~~~~~~~ Error!
    radius: 100,
}
```

#### 逆引きマッピング :id=h-5bfb5f185b00

```typescript
enum Enum {
    A
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

#### const 列挙型 :id=h-ee7e87d20d55

追加生成コードの負担や列挙メンバーへの間接的なアクセスを避けるために、const 列挙型を使えます。列挙型に const 修飾子を付けて定義します。

```typescript
const enum Enum {
    A = 1,
    B = A * 2
}
```

### 08、型推論 :id=h-e1d9220e037c

#### 基礎 :id=h-a3522f8d372c

TypeScript では、型を明示しない一部の場所で型推論が型を補います。例えば、次のとおりです。

```typescript
let x = 3;
```

変数 x は数値型と推論されます。**この推論は、変数やメンバーの初期化、引数のデフォルト値の設定、関数の戻り値型の決定で行われます。**

#### 最適な共通型 :id=h-17d4b003e210

複数の式から型を推論する場合、それらの式の型を使って最適な共通型を推論します。例えば、次のとおりです。

```typescript
let x = [0, 1, null];
```

最終的な共通型は候補の型から選ぶため、候補が共通の型を持っていても、すべての候補を表せる型が候補内にない場合があります。例えば、次のとおりです。

```typescript
let zoo = [new Rhino(), new Elephant(), new Snake()];
```

ここでは zoo を Animal\[] と推論したいのですが、配列内に Animal 型のオブジェクトがないため、その結果を推論できません。候補の型では不十分な場合は、型を明示して修正します。

```typescript
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
```

最適な共通型が見つからない場合、(Rhino | Elephant | Snake)\[] というユニオン型の配列に推論されます。

#### 文脈的型付け :id=h-11c9f71d6bcd

```typescript
window.onmousedown = function(mouseEvent) {
    console.log(mouseEvent.button);  //<- Error
};
```

この例では型エラーになります。TypeScript の型チェッカーは Window\.onmousedown の型を使って右側の関数式の型を推論し、mouseEvent 引数の型も分かります。文脈的型付けがない位置の関数式なら、mouseEvent を any と明示することでエラーを避けられます。

```typescript
window.onmousedown = function(mouseEvent: any) {
    console.log(mouseEvent.button);  //<- Now, no error is given
};
```

文脈による型も最適な共通型の候補になります。例えば、次のとおりです。

```typescript
function createZoo(): Animal[] {
    return [new Rhino(), new Elephant(), new Snake()];
}
```

### 09、クラスの互換性 :id=h-fae8dea0f600

TypeScript の構造的部分型は、典型的な JavaScript の書き方に合わせて設計されています。JavaScript は関数式やオブジェクトリテラルなどの無名オブジェクトを多用するため、名目的型システムより構造的型システムの方が適しています。

```typescript
interface Named {
    name: string;
}

class Person {
    name: string;
}

let p: Named;
// OK, because of structural typing
p = new Person();
```

#### 型の健全性に関する注意 :id=h-c21af317bb1c

TypeScript の構造的型システムの基本規則では、x が y と互換であるためには、y が少なくとも x と同じプロパティを持つ必要があります。

```typescript
interface Named {
    name: string
}

let x: Named;

let y= {
    name: 'yanle',
    location: 'Chongqing',
    age: 26
};
x = y;
console.log(x);
console.log(y);
```

y を x に代入できるかを調べるため、コンパイラーは x の各プロパティに対応するものが y にあるか確認します。この例では、y に name という string 型メンバーが必要です。y は条件を満たすため、代入できます。

関数の引数も同じ規則でチェックします。

```typescript
function greet(n: Named) {
    alert('Hello, ' + n.name);
}
greet(y); // OK
```

y には余分な location プロパティがありますが、エラーにはなりません。対象の型（ここでは Named）のメンバーだけを、1 つずつ互換性の観点で確認します。

#### 2 つの関数の比較 :id=h-17e89bab62eb

```typescript
let x = function(a: number) : number{
    return 0
};
let y = function(b: number, c: string): number{
    return 0;
};
y=x;
x=y;
```

x を y に代入できるかを調べるには、まず引数リストを比較します。x の各引数に対応する型の引数が y に必要です。
2 回目の代入は、y に必須の第 2 引数があるのに x にはないため、エラーになります。

#### 関数引数の双変性 :id=h-75685a297844

省略……

#### 任意引数と残余引数 :id=h-2845db2dba05

関数の互換性を比較するとき、任意引数と必須引数は相互に置き換えられます。代入元に余分な任意引数があっても、代入先の任意引数に対応する引数が代入元になくても、エラーにはなりません。
型システムとしては健全ではありませんが、実行時には任意引数は通常強制されず、多くの関数では undefined を渡すのと同じです。

```typescript
function invokeLater(args: any[], callback: (...args: any[]) => void) {
    /* ... Invoke callback with 'args' ... */
}

// Unsound - invokeLater "might" provide any number of arguments
invokeLater([1, 2], (x, y) => console.log(x + ', ' + y));

// Confusing (x and y are actually required) and undiscoverable
invokeLater([1, 2], (x?, y?) => console.log(x + ', ' + y));
```

#### 列挙型 :id=h-27c71ac4f72f

数値列挙型と number の互換性は TypeScript のバージョンと値によります。現在のバージョンは明らかに列挙型に属さない数値リテラルを拒否します。明示的な列挙メンバーを優先し、任意の数値を代入できるとは考えないでください。**異なる列挙型同士は互換ではありません。**

```typescript
enum Status { Ready, Waiting };
enum Color { Red, Blue, Green };

let status = Status.Ready;
status = Color.Green;  //error
```

#### クラス :id=h-3a4d86a8d3e4

クラスはオブジェクトリテラルやインターフェースに似ていますが、静的側とインスタンス側の型を持ちます。2 つのクラス型のオブジェクトを比較するときは、**インスタンスのメンバーだけを比較します**。静的メンバーやコンストラクターは比較しません。

```typescript
class Animal {
    feet: number;
    constructor(name: string, numFeet: number) {

    }

    static eat():void {
        console.log('eat')
    }
}

class Dog{
    feet: number;
    constructor(numFeet: number) { }
}

let a: Animal;
let d: Dog;
a=d;    // OK
d=a;    // OK
```

#### ジェネリクス :id=h-897b520fd8f1

TypeScript は構造的型システムなので、型引数が結果の型に影響するのは、その型の構造の一部として使われる場合だけです。

```typescript
interface Empty<T> {
}
let x: Empty<number>;
let y: Empty<string>;

x = y;  // okay, y matches structure of x
```

例にメンバーを追加すると、仕組みが分かります。

```typescript
interface NotEmpty<T> {
    data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y;  // error, x and y are not compatible
```

ここではジェネリック型も、使用時は通常の型と同じように扱われます。
型引数が指定されていないジェネリック型は、すべての型引数を any とみなして比較します。

### 10、高度な型 :id=h-769b01b2baa8

#### 交差型（Intersection Types）：& :id=h-170e1a86f680

交差型は複数の型を 1 つに組み合わせます。

```typescript
function combine<T extends object, U extends object>(first: T, second: U): T & U {
    return Object.assign({}, first, second);
}

const person = { name: "Jim" };
const logger = { log() { console.log("logged"); } };
const combined = combine(person, logger);
combined.log();
```

これはオブジェクト自身の列挙可能なプロパティをコピーする浅いコピーです。クラスのプロトタイプ上のメソッドは自動コピーされないため、2 つのクラスのインスタンスを単純にプロパティコピーしても、すべてのインスタンスメソッドが得られるとは言えません。

交差型は型の関係を記述するだけで、実行時のオブジェクトを生成しません。同名のプロパティで型が衝突すると、交差型が使用不能になる場合があります。実際の代入でも上書き順序を明確にする必要があります。

#### ユニオン型（Union Types）：| :id=h-2e5d194506f1

例えば、あるフィールドに string または number のいずれかを指定したい場合に使います。

```typescript
function padLeft(value: string, padding: any) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}

padLeft("Hello world", 4); // returns "    Hello world"
let indentedString = padLeft("Hello world", true); // See note 1 below.
```

例の説明：

1. コンパイルは通るが、実行時にエラーになる

ユニオン型を使う例は次のとおりです。

```typescript
function padLeft(value: string, padding: string | number) {
    // ...
}
let indentedString = padLeft("Hello world", true); // errors during compilation
```

ユニオン型の値では、そのユニオンに含まれるすべての型に共通するメンバーだけにアクセスできます。

#### 型ガードと型の区別（Type Guards and Differentiating Types） :id=h-43c52666858b

**typeof 型ガード**

TypeScript はこれを型ガードとして認識するため、コード内で直接型を調べられます。

```typescript
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}
```

typeof 型ガードとして認識される形式は typeof v === "typename" と typeof v !== "typename" の 2 つです。typename は typeof が返す型名で、undefined、number、string、boolean、bigint、symbol、object、function を指定できます。typeof null は object なので、それだけで非 null オブジェクトと判断することはできません。

**instanceof 型ガード**
次の例を見てください。

```typescript
interface Padder {
    getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
    private numSpaces: number;

    constructor(numSpaces: number) {
        this.numSpaces = numSpaces;
    }

    getPaddingString(): string {
        return Array(this.numSpaces +1).join(" ");
    }
}

class StringPadder implements Padder {
    private values: string;

    constructor(values: string) {
        this.values = values;
    }

    getPaddingString() {
        return this.values;
    }
}

function getRandomPadder(): StringPadder|SpaceRepeatingPadder {
    return Math.random()<0.5 ? new SpaceRepeatingPadder(4) : new StringPadder('   ');
}
// See note 1 below.
let padder: Padder = getRandomPadder();

if (padder instanceof SpaceRepeatingPadder) {
    padder; // See note 2 below.
}
if (padder instanceof StringPadder) {
    padder; // See note 3 below.
}
```

例の説明：

1. 型は SpaceRepeatingPadder | StringPadder
2. 型が SpaceRepeatingPadder に絞り込まれる
3. 型が StringPadder に絞り込まれる

#### 文字列リテラル型 :id=h-ecc72ad1e5df

文字列リテラル型では、文字列に必要な固定値を指定できます。実際にはユニオン型、型ガード、型エイリアスとよく組み合わせます。これらを併用すると、列挙型のような文字列を実現できます。

```typescript
type Easing = "ease-in" | "ease-out" | "ease-in-out";
```

引数には許可された 3 種類の文字列のうち 1 つだけを渡せます。ほかの値を渡すとエラーになります。

#### 数値リテラル型 :id=h-2b08a4272d3e

TypeScript には数値リテラル型もあります。

```typescript
function rollDie(): 1 | 2 | 3 | 4 | 5 | 6 {
    return 1;
}
```

この使い方はあまり多くありません。

#### 判別可能なユニオン型（Discriminated Unions） :id=h-f695ecefb0cb

単一の値を持つ型、ユニオン型、型ガード、型エイリアスを組み合わせると、判別可能なユニオン型という高度なパターンを作れます。タグ付きユニオンや代数的データ型とも呼ばれ、関数型プログラミングで役立ちます。一部の言語はユニオンを自動で識別しますが、TypeScript は既存の JavaScript のパターンを基にします。要素は 3 つです。

1、共通の、単一の値を持つ型のプロパティ：判別の目印。
2、それらの型のユニオンを含む型エイリアス：ユニオン。
3、そのプロパティに対する型ガード。

```typescript
interface Square {
    kind: "square";
    size: number;
}
interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
interface Circle {
    kind: "circle";
    radius: number;
}

type Shape = Square | Rectangle | Circle;

function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
}
```

#### ポリモーフィックな this 型 :id=h-baf09c4ed6d2

クラスのメソッドが現在の this を返す仕組みで、継承先でも利用できます。

#### インデックス型（Index types） :id=h-b6f97ad84969

```typescript
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map(n => o[n]);
}

interface Person {
    name: string;
    age: number;
}
let person: Person = {
    name: 'Jarid',
    age: 35
};
let strings: string[] = pluck(person, ['name']); // ok, string[]
```
