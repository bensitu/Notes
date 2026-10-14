# JUnit、反射与注解入门

学习写可重复的测试，并理解反射和注解各自的作用。

**学习前提与版本：** 需要 Java 类与方法基础。完整测试示例采用 JUnit 4.13.2；JUnit Jupiter 的注解放在对照部分，不能混用导入包。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[学习索引与常见词](README.md) · [官方参考](https://junit.org/junit4/)

**内容导航**

- [测试：先写预期，再比较结果](#section-1)
- [JUnit 4 示例](#section-2)
- [JUnit Jupiter 对照](#section-3)
- [反射：运行时查看和调用类](#section-4)
- [注解：给工具提供信息](#section-5)


<a id="section-1"></a>

## 测试：先写预期，再比较结果

单元测试验证一个较小的代码单元。断言比较实际结果和预期结果；不相等时测试失败。只打印结果不等于完成验证。

黑盒测试根据对外行为设计用例，白盒测试根据内部结构设计用例。两者都可以自动化，JUnit 不限定测试必须属于哪一类。

<a id="section-2"></a>

## JUnit 4 示例

用于维护 JUnit 4 项目。JUnit Jupiter 的包名不同，不能混用 org.junit.Test 与 org.junit.jupiter.api.Test。

文件：src/main/java/example/Calculator.java。

```java
package example;

public class Calculator {
    public int add(int left, int right) { return left + right; }
    public int subtract(int left, int right) { return left - right; }
}
```

文件：src/test/java/example/CalculatorTest.java。

```java
package example;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class CalculatorTest {
    private Calculator calculator;

    @Before
    public void setUp() { calculator = new Calculator(); }

    @After
    public void tearDown() { calculator = null; }

    @Test
    public void addsTwoNumbers() { assertEquals(3, calculator.add(1, 2)); }

    @Test
    public void subtractsTwoNumbers() {
        assertEquals(-1, calculator.subtract(1, 2));
    }
}
```

@Before 在每个测试方法前执行，@After 在每个测试方法后执行。整个测试类只执行一次的准备和清理使用 @BeforeClass、@AfterClass，对应方法必须为 public static void。

把以下依赖放进 POM 的 dependencies 中，运行 mvn test。

```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.2</version>
    <scope>test</scope>
</dependency>
```

失败时先看失败用例及期望值、实际值。不要依赖测试方法的执行顺序。

<a id="section-3"></a>

## JUnit Jupiter 对照

| JUnit 4 | JUnit Jupiter | 时机 |
| --- | --- | --- |
| @Test | @Test | 声明测试方法，包名不同 |
| @Before / @After | @BeforeEach / @AfterEach | 每个测试前后 |
| @BeforeClass / @AfterClass | @BeforeAll / @AfterAll | 整个测试类前后 |
| Assert.assertEquals | Assertions.assertEquals | 比较预期与实际值 |

Spring Boot 项目使用其管理的 spring-boot-starter-test 和测试框架版本。普通 Maven 项目还需配置能运行 Jupiter 的 Surefire 插件，不能只更换注解。

<a id="section-4"></a>

## 反射：运行时查看和调用类

反射可以在运行时查看构造器、字段和方法。框架常用它创建对象或填充属性。

```java
Class<?> byName = Class.forName("example.Calculator");
Class<Calculator> byType = Calculator.class;
Calculator calculator = new Calculator();
Class<?> byObject = calculator.getClass();

Object instance = byName.getDeclaredConstructor().newInstance();
Object result = byName.getMethod("add", int.class, int.class)
                        .invoke(instance, 1, 2);
```

片段放在方法内部，并处理或声明反射相关异常。Class.forName 的名字包含包名；getClass() 返回对象的实际运行时类型。运行这个片段还需要前面的 Calculator 类。

访问成员受访问权限和模块边界约束。不要把外部输入的任意类名或方法名直接用于反射调用。

<a id="section-5"></a>

## 注解：给工具提供信息

注解是元数据，本身不会执行业务逻辑，需要编译器、工具或框架读取并处理。

- @Override：编译器检查方法是否覆盖父类或接口的方法。
- @Test：测试框架识别测试方法。
- @Controller：Spring 识别控制器。

自定义注解的 @Target 限定使用位置，@Retention 决定保留到哪个阶段。运行时反射读取的注解需要 RetentionPolicy.RUNTIME。

参考：[JUnit 4 API](https://junit.org/junit4/javadoc/latest/)、[JUnit 文档](https://docs.junit.org/)、[反射教程](https://docs.oracle.com/javase/tutorial/reflect/)。
