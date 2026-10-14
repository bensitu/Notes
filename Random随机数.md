# Java 随机数入门

查随机数方法、区间公式与适用场景，避免越界和错误用途。

**学习前提与版本：** 需要 Java 数字类型与方法基础。Random 示例适用于 Java 8+；安全令牌与普通抽样应选择不同的 API。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[学习索引与常见词](README.md) · [官方参考](https://docs.oracle.com/javase/8/docs/api/java/util/Random.html)

**内容导航**

- [Random 是什么](#section-1)
- [方法速查](#section-2)
- [指定整数范围](#section-3)
- [API 选择](#section-4)


<a id="section-1"></a>

## Random 是什么

java.util.Random 生成伪随机数：数字由算法和种子计算得到。相同种子配合相同的方法调用顺序，会产生相同序列，适合重复测试。

```java
import java.util.Random;

public class RandomExample {
    public static void main(String[] args) {
        Random random = new Random(42L);
        System.out.println(random.nextInt(10));
        System.out.println(random.nextDouble());
        System.out.println(random.nextBoolean());
    }
}
```

保存为 RandomExample.java，执行 javac RandomExample.java 和 java RandomExample。每次重新启动程序会得到相同序列。

<a id="section-2"></a>

## 方法速查

| 方法 | 结果 |
| --- | --- |
| new Random() | 创建生成器，不显式指定种子 |
| new Random(seed) | 指定种子，用于重复实验 |
| nextInt() | int 范围内的整数，可为负数 |
| nextInt(bound) | [0, bound)，包含 0，不包含 bound；bound 必须大于 0 |
| nextLong() | long 范围内的整数 |
| nextFloat() / nextDouble() | [0.0, 1.0)，不包含 1.0 |
| nextBoolean() | true 或 false |
| nextGaussian() | 近似正态分布，均值 0，标准差 1 |

<a id="section-3"></a>

## 指定整数范围

生成 [50, 99]，两端都包含：

```java
Random random = new Random();
int start = 50;
int end = 99;
int number = random.nextInt(end - start + 1) + start;
```

先生成 [0, 50)，再加 50，就是 50 到 99。+1 用于包含上界。这个片段放在方法内，并导入 java.util.Random。

公式要求 start <= end，而且 end - start + 1 能放进正 int。不要直接用于整个 int 范围，否则计算可能溢出。

<a id="section-4"></a>

## API 选择

密码、验证码、会话令牌等需要不可预测性时，使用 java.security.SecureRandom，不要用固定种子，也不要把 Random 输出当作安全令牌。

普通随机数在高并发中可以使用 ThreadLocalRandom。选择 API 时确认 JDK 版本，较新的范围重载不能直接用于旧 JDK。

参考：[Random API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Random.html)、[SecureRandom API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/security/SecureRandom.html)。
