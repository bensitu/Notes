# TypeScript Basics :id=h-48a840d52279

Learn how types reveal errors, and look up syntax by topics such as interfaces, union types, and generics.

**Prerequisites and versions:** Learn JavaScript first. TypeScript 5.x with strict enabled is recommended. Type checking is not runtime validation; use error demonstrations and alternative implementations separately.

**Using the examples:** Unless a project explicitly lists all files and run instructions, code blocks are independent snippets for each section. Fill in ellipses and placeholder names; lines marked as incorrect illustrate problems. Do not combine alternative implementations from the same section.

[Documentation index](README.md) · [Official references](https://www.typescriptlang.org/docs/handbook/)

**Contents**

- [Recommended checking workflow](#section-1)
- [Fundamentals](#section-2)

<a id="section-1"></a>

## Recommended checking workflow :id=h-3e7f0b6aed54

First install the TypeScript 5.x version required by your project and retain package-lock.json. The following tsconfig.json is for ordinary browser examples, not a complete Vue project configuration:

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

Run `npx tsc` for type checking. Some code blocks show two alternative implementations side by side; use them separately to avoid duplicate declarations. Lines marked Error, incorrect, or showing incompatible assignments demonstrate errors and should be reported by the checker. Type assertions only affect the checker; they do not convert or validate runtime data. Prefer unknown for uncertain external input and check each part.

<a id="section-2"></a>

## Fundamentals :id=h-0ddf7b4454b4

### 01. Basic types :id=h-997bcd164a50

**Boolean type boolean**: represents only true or false. Example: `const enabled: boolean = true;`.

**Numeric type number**: represents ordinary JavaScript numbers, without distinguishing int and double. Example: `const price: number = 12.5;`. The large-integer type bigint is separate.

**String type string**: represents text. Example: `const username: string = "Alice";`.

**Arrays**:
Declaration syntax:

```typescript
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
```

**Tuple**: represents an array with a known number of elements and known types. The element types need not be the same.

```typescript
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```

**Enums**:

```typescript
enum Color {Red, Green, Blue}
let c: Color = Color.Green;

enum Color {Red = 1, Green, Blue}   // See note 1 below.
let c: Color = Color.Green;
```

Example explanations:

1. Numbering starts at 1

**Any**:

```typescript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean

let list: any[] = [1, true, "free"];
list[1] = 100;
```

**void**: indicates that the caller does not use the function's return value, commonly for functions that perform an action without returning a business result. It does not mean no type at all and is not equivalent to never.

```typescript
function warnUser(): void {
    alert("This is my warning message");
}
```

void mainly indicates an unused function return value. With strictNullChecks=true, null cannot be assigned to a void variable. Usually you write functions returning void, rather than variables of this type.

**Null and Undefined**: when strictNullChecks is disabled, null and undefined assignment checks are more permissive. Enable strict (including strictNullChecks); then string rejects null unless you explicitly use a union such as string | null.

**Never**: the type of values that never occur.
never is the return type of function expressions or arrow functions that always throw or never return.
never is a subtype of every type and can be assigned to any type.

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

Example explanations:

1. A function returning never must have an unreachable endpoint
2. The inferred return type is never
3. A function returning never must have an unreachable endpoint

**Type assertions**:
There are two forms. The first uses angle-bracket syntax:

```typescript
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```

The other uses as syntax:

```typescript
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

### 02. Variable declarations :id=h-dba5bd976713

Prefer const for variables that are not reassigned, and let when reassignment is needed. const does not freeze object properties. var has different scoping and hoisting rules and is usually avoided in new code. Destructuring extracts values from objects or arrays but does not automatically validate them.

### 03. Interfaces :id=h-f753ce653404

#### A first look at interfaces :id=h-97ea78db7d07

Example:

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

Example explanations:

1. Rewrite the example above

Unlike in some other languages, we do not say here that the object passed to printLabel implements the interface. We care only about the value's shape. Any object satisfying the required conditions above is accepted.

#### Optional properties :id=h-3c0481869966

Not all interface properties are required. Some exist only under certain conditions or may be absent. Optional properties are common in the option-bag pattern, where only some properties of a function's options object are supplied.

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

#### Readonly properties :id=h-60403b14b5d1

readonly restricts modifying a property through the current type; it cannot be reassigned through that type after initialization. This works only during type checking and does not freeze the runtime object. Put readonly before the property name:

```typescript
interface Point {
    readonly x: number,
    readonly y: number
}
let p1: Point = {x:5, y:10};
p1.x = 10;
```

ReadonlyArray<T> prevents mutation methods through the current readonly reference; it does not freeze the runtime array. Another writable reference may still modify it:

```typescript
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

You can use an assertion like this:

```typescript
a = ro as number[];
```

readonly vs const
To choose, ask whether it is a variable or a property. Use const for a variable and readonly for a property.

#### Excess property checks :id=h-fb5d7e1d84a4

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

This means SquareConfig may have any number of properties. Properties other than color and width may have any type.

One final, perhaps surprising way to bypass these checks is to assign the object to another variable. Since squareOptions does not undergo an excess property check, the compiler reports no error.

It is best to avoid these ways of bypassing checks, as they may affect correct program behavior.

#### Function types :id=h-a0e1f361797c

To represent a function type with an interface, define a call signature. It looks like a function declaration containing only a parameter list and return type. Each parameter needs a name and type.

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

Example explanations:

1. The classic syntax
2. For function type checking, parameter names need not match those in the interface. For example, rewrite the example above as follows:
3. This syntax is also valid

#### Indexable types :id=h-732cfe72dc01

An indexable type has an index signature describing the index type and the corresponding result type.

```typescript
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

This index signature means indexing StringArray with a number returns a string.

Modern TypeScript supports string, number, symbol, and some template-literal index signatures. We begin with the common string and number forms. Both may be used together, but the numeric index's result must be a subtype of the string index's result.

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

Example explanations:

1. Error: indexing with a numeric string may return a completely different Animal!

In the following example, name does not match the string index type, so the type checker reports an error:

```typescript
interface NumberDictionary {
  [index: string]: number;
  length: number;    // See note 1 below.
  name: string       // See note 2 below.
}
```

Example explanations:

1. Valid: length has type number
2. Error: the type of name does not match the index result type

Finally, make an index signature readonly to prevent assignment through it:

```typescript
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory"; // error!
```

#### Class types :id=h-8fc53f84ba1e

**Implementing an interface**

```typescript
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

**Static and instance sides of a class**

When working with classes and interfaces, remember that a class has two types: its static-side type and its instance type.

In the example below, ClockConstructor describes the constructor and ClockInterface describes instance methods. For convenience, createClock constructs instances using the supplied type.

#### Extending interfaces :id=h-4a48a0665b18

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

Example explanations:

1. This is also valid

An interface can extend multiple interfaces to combine them.

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

#### Hybrid types :id=h-dd9824495254

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

#### Interfaces extending classes :id=h-b7b56999da59

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

Example explanations:

1. Error: type Image is missing property state.

### 04. Classes :id=h-609ad83f412c

#### Introduction :id=h-65cfa5823b77

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

Example explanations:

1. Attribute
2. Constructor
3. Method

#### Inheritance :id=h-85d09f16ffb6

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

A more complex example

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

#### Public, private, and protected modifiers :id=h-f75c7908a95e

**The default is public**

You can also explicitly mark a member public. Rewrite the Animal class above as follows:

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

**Understanding private**

A private member cannot be accessed outside the class declaring it.

```typescript
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}
new Animal("Cat").name; // See note 1 below.
```

Example explanations:

1. Error: name is private.

If one type contains a private member, the other type is compatible only if it also has that private member originating in the same declaration. The same rule applies to protected members.

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

Example explanations:

1. Error: Animal and Employee are incompatible.

**Understanding protected**:

protected behaves similarly to private, except protected members remain accessible in derived classes.

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

Example explanations:

1. Error

name cannot be used outside Person, but Employee's instance methods can access it because Employee derives from Person.

A constructor can also be protected. This prevents direct instantiation from outside the class while still allowing inheritance.

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

Example explanations:

1. Employee can extend Person
2. Error: Person's constructor is protected.

#### readonly modifier :id=h-e641756493fc

Use readonly to make a property readonly during type checking. Initialize it either at declaration or in the constructor.

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

Example explanations:

1. Error: name is readonly.

**Parameter properties**

```typescript
class Animal {
    constructor(private name: string) { }
    move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

Using private name: string in the constructor creates and initializes the name member, combining declaration and assignment in one place.

Declare parameter properties by adding an access modifier to constructor parameters. private declares and initializes a private member; public and protected work similarly.

#### Accessors :id=h-00251a22434f

Start with an example without accessors.

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

Setting fullName freely is convenient, but may cause problems.

Modify it as follows:

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

This lets us control the fields being read and written.

#### Static properties :id=h-fa0fd6e08d4a

Class members can also be static, existing on the class itself rather than its instances. Here, origin uses static because all grids use it. Each instance accesses origin with the class name prefix. Just as this. accesses instance properties, Grid. accesses static properties.

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

#### Abstract class :id=h-0c1a5415062c

Abstract classes serve as base classes for derived classes and are generally not instantiated directly. Unlike interfaces, they can contain member implementations. Use abstract to define an abstract class and its abstract methods.

```typescript
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch...');
    }
}
```

Abstract methods have no implementation and must be implemented in derived classes. Their syntax resembles interface methods: both define signatures without bodies. Abstract methods, however, require abstract and can have access modifiers.

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

Example explanations:

1. Must be implemented in a derived class
2. A derived class constructor must call super()
3. A reference to an abstract type is allowed
4. Error: cannot instantiate an abstract class
5. Instantiating a subclass of an abstract class and assigning it is allowed
6. Error: the method does not exist on the declared abstract class

#### Classes can be used as interfaces :id=h-869b06dc919e

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

### 05. Functions :id=h-adfeb5e72c94

#### Function types :id=h-edec12a310c2

**Typing functions**

```typescript
function add(x: number, y: number): number {
    return x + y;
}
let myAdd = function(x: number, y: number): number { return x + y; };
```

TypeScript infers return types from return statements, so we normally omit the annotation.

#### Optional and default parameters :id=h-60309a036896

Ordinary parameters without ?, defaults, or rest syntax are normally required. In brief, the supplied argument count must match the function's expected count.

```typescript
function buildName(firstName: string, lastName: string) {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // ah, just right
```

In TTypeScript, add ? beside a parameter name to make it optional. For example, make last name optional:

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

In TTypeScript, parameters can have default values used when omitted or passed undefined. These are default-initialized parameters. Set last name's default to "Smith" in the example above.

```typescript
function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}
let result1 = buildName("Bob");                  // works correctly now, returns "Bob Smith"
let result2 = buildName("Bob", undefined);       // still works, also returns "Bob Smith"
let result3 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result4 = buildName("Bob", "Adams");         // ah, just right
```

#### Rest parameters :id=h-0b09bb96a258

```typescript
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

#### this :id=h-332e84c38657

TypeScript can report incorrect uses of this.

### 06. Generics :id=h-2cf58d4f3e8f

#### Introduction :id=h-0c969bc6960a

Without generics, the function might look like this:

```typescript
function identity(arg: number): number {
    return arg;
}
function identity(arg: any): any {
    return arg;
}
```

any lets the function accept arg of any type, but loses the information that the input and output types should match. If we pass a number, all we know is that a value of any type may be returned.

We therefore need a way to keep the return type identical to the input type. We use a type variable, a special variable representing a type rather than a value.

```typescript
function identity<T>(arg: T): T {
    return arg;
}
```

Once a generic function is defined, there are two ways to use it. First, provide every argument, including the type argument:

```typescript
let output = identity<string>("myString");  // type of output will be 'string'
```

The second, more common way uses type inference: the compiler automatically determines T from the supplied argument.

```typescript
let output = identity("myString");  // type of output will be 'string'
```

The compiler examines myString and sets T to its type. Type inference keeps code concise and readable.

#### Working with generic type variables :id=h-ad5ba3fc4603

To also print arg's length, we might try this:

```typescript
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

Remember that type variables represent any type. A caller may pass a number, which has no .length property.

Since we are working with an array, .length should exist. Define it as you would any other array:

```typescript
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

This uses T as part of a type rather than the entire type, giving greater flexibility.

```typescript
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

#### Generic types :id=h-3baec164c993

A generic function type resembles a non-generic function type, with a type parameter at the front as in a function declaration.
Type parameter names can differ as long as their number and usage correspond.

```typescript
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: <U>(arg: U) => U = identity;
```

We can also define a generic function with an object literal containing a call signature:

```typescript
let myIdentity: {<T>(arg: T): T} = identity;
```

This leads to our first generic interface. Extract the object literal above into an interface:

```typescript
interface GenericIdentityFn {
    <T>(arg: T): T;
}
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: GenericIdentityFn = identity;
```

#### Generic classes :id=h-4c72581b7002

A generic class resembles a generic interface. Put its type parameters in <> after the class name.

```typescript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

#### Generic constraints :id=h-eb4f1a199dcd

Define an interface describing the constraint. Create one with a .length property, then use it with extends:

```typescript
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

Pass a value satisfying the constraint, including its required properties:

```typescript
loggingIdentity(3);  // Error, number doesn't have a .length property
loggingIdentity({length: 10, value: 3});
```

**Using type parameters in generic constraints**

We want to get a property from obj by name and ensure it exists, so constrain the relationship between the two types.

```typescript
function getProperty(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

**Using class types in generics**

When creating a generic factory function in TypeScript, refer to the constructor's class type. For example:

```typescript
function create<T>(c: {new(): T; }): T {
    return new c();
}
```

A more advanced example uses prototype properties to infer and constrain the relationship between a constructor and its class instances.

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

### 07. Enums :id=h-510c56c0400a

#### Numeric enums :id=h-a83c9355e24d

A simple numeric enum:

```typescript
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
```

Up is initialized to 1. The remaining members increment automatically from 1: Direction.Up is 1, Down is 2, Left is 3, and Right is 4.

We can also omit all initializers:

```typescript
enum Direction {
    Up,
    Down,
    Left,
    Right,
}
```

Up is 0, Down is 1, and so on.

Use an enum's properties to access members and its name to refer to the enum type:

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

Numeric enums may mix computed and constant members. An uninitialized member must come first or follow a member initialized with a numeric constant or another constant member. Thus the following is not allowed:

```typescript
enum E {
    A = getSomeValue(),
    B, // error! 'A' is not constant-initialized, so 'B' needs an initializer
}
```

#### String enums :id=h-cbd54d0ddc10

```typescript
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```

#### Computed and constant members :id=h-3ed600db0137

- An enum-expression literal, mainly a string or numeric literal
- A reference to a previously defined constant enum member, possibly from another enum
- A parenthesized constant enum expression
- One of the unary operators +, -, or \~ applied to a constant enum expression
- Constant enum expressions as operands of binary +, -, \*, /, %, <<, >>, >>>, &, |, or ^. A constant enum expression evaluating to NaN or Infinity causes a compile-time error.

All other enum members are treated as computed values.

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

#### Union enums and enum member types :id=h-1fbcf17fbc7d

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

#### Reverse mappings :id=h-5bfb5f185b00

```typescript
enum Enum {
    A
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

#### const enums :id=h-ee7e87d20d55

To avoid extra generated code and indirect enum-member access, use const enums, defined by adding the const modifier to an enum.

```typescript
const enum Enum {
    A = 1,
    B = A * 2
}
```

### 08. Type inference :id=h-e1d9220e037c

#### Basics :id=h-a3522f8d372c

In TypeScript, type inference supplies types in some places without explicit annotations. For example:

```typescript
let x = 3;
```

x is inferred as a number. **This inference occurs when initializing variables and members, setting parameter defaults, and determining function return types.**

#### Best common type :id=h-17d4b003e210

When inferring from several expressions, their types are used to find the most suitable common type. For example:

```typescript
let x = [0, 1, null];
```

Since the final common type comes from the candidates, sometimes the candidates share a common type without any candidate covering all the others. For example:

```typescript
let zoo = [new Rhino(), new Elephant(), new Snake()];
```

We want zoo inferred as Animal\[], but none of its objects has the type Animal, so that result cannot be inferred. When the candidates do not suffice, explicitly provide the type:

```typescript
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
```

If no best common type is found, the result is an array of union types: (Rhino | Elephant | Snake)\[].

#### Contextual typing :id=h-11c9f71d6bcd

```typescript
window.onmousedown = function(mouseEvent) {
    console.log(mouseEvent.button);  //<- Error
};
```

This example produces a type error. The TypeScript checker uses the type of Window\.onmousedown to infer the function expression on the right and thus the mouseEvent parameter. Outside a contextually typed position, explicitly annotating mouseEvent as any avoids the error.

```typescript
window.onmousedown = function(mouseEvent: any) {
    console.log(mouseEvent.button);  //<- Now, no error is given
};
```

Contextual types also participate as candidates for the best common type. For example:

```typescript
function createZoo(): Animal[] {
    return [new Rhino(), new Elephant(), new Snake()];
}
```

### 09. Class compatibility :id=h-fae8dea0f600

TypeScript structural subtyping is designed for typical JavaScript code. Since JavaScript widely uses anonymous objects such as function expressions and object literals, structural typing describes these types better than nominal typing.

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

#### A note on soundness :id=h-c21af317bb1c

The basic rule in TypeScript structural typing is that for x to be compatible with y, y must have at least the same properties as x.

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

To check whether y can be assigned to x, the compiler checks every property in x for a corresponding property in y. Here, y must have a string member named name. It does, so the assignment is valid.

Function arguments follow the same rule:

```typescript
function greet(n: Named) {
    alert('Hello, ' + n.name);
}
greet(y); // OK
```

Although y has an extra location property, this causes no error. Only the target type's members, Named here, are checked for compatibility.

#### Comparing two functions :id=h-17e89bab62eb

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

To check whether x can be assigned to y, first compare their parameter lists. Each x parameter must have a corresponding compatible parameter in y.
The second assignment fails because y requires a second parameter that x does not have.

#### Function parameter bivariance :id=h-75685a297844

Omitted…

#### Optional and rest parameters :id=h-2845db2dba05

When comparing function compatibility, optional and required parameters are interchangeable. Extra optional parameters in the source are not errors, nor are target optional parameters without source counterparts.
This is unsound from the type-system perspective, but at runtime optional parameters are generally not enforced, since for most functions this amounts to passing undefined.

```typescript
function invokeLater(args: any[], callback: (...args: any[]) => void) {
    /* ... Invoke callback with 'args' ... */
}

// Unsound - invokeLater "might" provide any number of arguments
invokeLater([1, 2], (x, y) => console.log(x + ', ' + y));

// Confusing (x and y are actually required) and undiscoverable
invokeLater([1, 2], (x?, y?) => console.log(x + ', ' + y));
```

#### Enums :id=h-27c71ac4f72f

Compatibility between numeric enums and number depends on the TypeScript version and specific value. Modern versions reject numeric literals clearly outside the enum. Prefer explicit members; do not assume any number can be assigned. **Different enum types are incompatible.**

```typescript
enum Status { Ready, Waiting };
enum Color { Red, Blue, Green };

let status = Status.Ready;
status = Color.Green;  //error
```

#### Classes :id=h-3a4d86a8d3e4

Classes resemble object literals and interfaces, but have static and instance types. When comparing objects of two class types, **only instance members are compared**. Static members and constructors are excluded.

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

#### Generics :id=h-897b520fd8f1

Because TypeScript is structurally typed, type parameters affect resulting types only when used as part of their structure.

```typescript
interface Empty<T> {
}
let x: Empty<number>;
let y: Empty<string>;

x = y;  // okay, y matches structure of x
```

Add a member to the example to see how this works:

```typescript
interface NotEmpty<T> {
    data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y;  // error, x and y are not compatible
```

Here, the generic type behaves like a non-generic type when used.
When generic type arguments are unspecified, they are all compared as any.

### 10. Advanced types :id=h-769b01b2baa8

#### Intersection types: & :id=h-170e1a86f680

Intersection types combine multiple types into one

```typescript
function combine<T extends object, U extends object>(first: T, second: U): T & U {
    return Object.assign({}, first, second);
}

const person = { name: "Jim" };
const logger = { log() { console.log("logged"); } };
const combined = combine(person, logger);
combined.log();
```

This copies an object's own enumerable properties and is a shallow copy. It does not automatically copy methods on class prototypes, so simply copying properties of two class instances does not provide all their instance methods.

Intersection types describe type relationships only; they do not generate runtime objects. Conflicting types for the same property name may make an intersection unusable. Actual assignments also need a clear overwrite order.

#### Union types: | :id=h-2e5d194506f1

For example, we may want a field to accept either string or number:

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

Example explanations:

1. Compiles successfully but fails at runtime

Example using a union type:

```typescript
function padLeft(value: string, padding: string | number) {
    // ...
}
let indentedString = padLeft("Hello world", true); // errors during compilation
```

For a union-typed value, only members common to every type in the union can be accessed.

#### Type guards and differentiating types :id=h-43c52666858b

**typeof type guards**

TypeScript recognizes this as a type guard, allowing us to check types directly in code.

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

These typeof type guards are recognized in two forms: typeof v === "typename" and typeof v !== "typename". typename is a typeof result name: undefined, number, string, boolean, bigint, symbol, object, or function. Since typeof null is object, this check alone cannot establish a non-null object.

**instanceof type guards**
See the following example.

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

Example explanations:

1. Type: SpaceRepeatingPadder | StringPadder
2. Type narrowed to SpaceRepeatingPadder
3. Type narrowed to StringPadder

#### String literal types :id=h-ecc72ad1e5df

String literal types specify fixed allowed string values. They work well with unions, type guards, and type aliases. Combining them provides enum-like strings.

```typescript
type Easing = "ease-in" | "ease-out" | "ease-in-out";
```

Only one of the three allowed strings can be passed; any other value causes an error.

#### Numeric literal types :id=h-2b08a4272d3e

TypeScript also has numeric literal types.

```typescript
function rollDie(): 1 | 2 | 3 | 4 | 5 | 6 {
    return 1;
}
```

This form is rarely used

#### Discriminated unions :id=h-f695ecefb0cb

Combine singleton types, unions, type guards, and type aliases into an advanced pattern called a discriminated union, also known as a tagged union or algebraic data type. Useful in functional programming, unions are recognized automatically by some languages; TypeScript builds on existing JavaScript patterns. There are three elements:

1\. A common singleton-typed property: the discriminant.
2\. A type alias containing the union of these types: the union.
3\. Type guards on that property.

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

#### Polymorphic this types :id=h-baf09c4ed6d2

A class method returns the current this, and this behavior can be inherited.

#### Index types :id=h-b6f97ad84969

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
