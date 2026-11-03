# 现代 Java 开发：语言、集合与并发

学习目标：理解现代 Java 常用写法和边界，再阅读 Spring 项目。需要 Java 类、方法和异常基础。

**适用范围：** 主线建议 JDK 25 LTS；贯穿后端以 release 17 编译，可在 Java 17 或 25 运行。下面的 record 示例要求 Java 17+，虚拟线程要求 Java 21+。不使用预览特性。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [学习地图](#section-1)
- [最小可运行示例](#section-2)
- [record、Optional 与时间](#section-3)
- [虚拟线程：更便宜的等待](#section-4)
- [验证与常见错误](#section-5)
- [开发速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## 学习地图

| 主题 | 先回答的问题 |
| --- | --- |
| 集合与泛型 | 保存什么数据？允许重复吗？是否需要顺序与查找？ |
| 异常 | 调用者能否恢复？资源如何关闭？原始原因是否保留？ |
| record | 是否只需要表达一组不可重新赋值的字段？ |
| Stream | 是把数据转换为结果，还是混入了外部副作用？ |
| 并发 | 多个任务是否共享可变状态？等待、超时和取消由谁负责？ |

<a id="section-2"></a>

## 最小可运行示例

保存为 ModernJavaDemo.java：

```java
import java.util.List;
import java.util.Objects;

public class ModernJavaDemo {
    record Task(long id, String title) {
        Task {
            Objects.requireNonNull(title, "title");
            title = title.strip();
            if (title.isEmpty()) throw new IllegalArgumentException("title is blank");
        }
    }

    public static void main(String[] args) {
        var tasks = List.of(new Task(1, " Learn Java "), new Task(2, "Write tests"));
        var titles = tasks.stream().map(Task::title).toList();
        System.out.println(titles);
    }
}
```

```powershell
javac -encoding UTF-8 --release 17 ModernJavaDemo.java
java ModernJavaDemo
```

预期输出 [Learn Java, Write tests]。List.of 与 Stream.toList 返回的列表不能通过该列表增删；它们也不负责把元素内部的所有对象深度冻结。

<a id="section-3"></a>

## record、Optional 与时间

record 自动提供访问器、equals、hashCode、toString；访问器是 title()，不是 getTitle()。字段引用不可重新赋值，不代表被引用的 List 自动不可变。复制集合时仍要考虑元素是否可变。

Optional 适合表达可能没有的返回结果，通常不用于实体字段或请求 JSON。不要先 get() 再希望异常代替正常分支。

业务日期用 LocalDate，绝对时间点用 Instant，需要地区时区规则时用 ZoneId / ZonedDateTime。数据库、接口与显示层应明确时区；LocalDateTime 自身不带时区。

金额用 BigDecimal 并明确小数位与舍入规则。不要从 double 构造精确金额，也不要把 equals 与数值比较 compareTo 混为一谈。

<a id="section-4"></a>

## 虚拟线程：更便宜的等待

下面是方法体片段，需要放入类的方法中，并使用 JDK 21+：

```java
try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
    var future = executor.submit(() -> "completed");
    System.out.println(future.get(2, java.util.concurrent.TimeUnit.SECONDS));
}
```

虚拟线程适合大量会阻塞等待的任务，不会让 CPU 密集计算自动变快。线程数量便宜不代表数据库连接、外部接口或内存无限。

get 超时不会自动取消任务；根据业务调用 cancel，并让任务正确响应中断。不要吞掉 InterruptedException；无法继续时保留中断状态或按方法约定向上传播。

<a id="section-5"></a>

## 验证与常见错误

编译版本与运行版本分开检查：java -version、javac -version、mvn -version。IDE 能运行不代表 CI 使用同一套 JDK。

不要使用并行 Stream 包裹数据库调用就认为提高了吞吐；先测量连接池、外部限流和延迟。共享 HashMap、计数器和单例 Bean 的可变字段要考虑线程安全。

<a id="section-6"></a>

## 开发速查

- 参数合法性在入口验证，核心业务仍维护自身不变量。
- 使用 try-with-resources 关闭拥有的资源；借来的连接不能随意关闭或提交。
- 集合选择取决于访问方式，不能从方法命名判断性能。
- 优先构造器注入，减少难以控制的全局可变状态。
- 升级 JDK 时同时验证构建插件、代理库、监控工具和容器基础镜像。

<a id="section-7"></a>

## 官方参考

- [Java 支持路线](https://www.oracle.com/java/technologies/java-se-support-roadmap.html)
- [record 文档](https://docs.oracle.com/en/java/javase/25/language/records.html)
- [虚拟线程](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html)
