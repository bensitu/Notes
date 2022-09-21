# Junit 单元测试

### 测试分类：

- 黑盒测试∶不需要写代码，给输入值，看程序是否能够输出期望的值
- 白盒测试︰需要写代码的。关注程序具体的执行流程（Junit 单元测试属于白盒测试）



### Junit 单元测试(白盒测试)

Junit 使用步骡∶

1. 定义一个测试类(测试用例)

   建议︰

   - 测试类名︰被测试的类名Test 如calculatorTest
   - 包名∶xxx.xxx.xx.test 如cn.itcast.test

2. 定义测试方法:可以独立运行

   建议:

   - 方法名: test测试的方法名 如testAdd()
   - 返回值: void
   - 参数列表:空参

3. 给方法加@Test注解

4. 导入 junit 依赖环境

5. 判定结果∶

   - 红色∶失败
   - 绿色: 成功
   - —般会使用断言操作来处理结果 Assert.assertEquals (期望的结果,运算的结果)



```java
package cn.itcast.test;
import cn.itcast.junit.Calculator;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
public class CalculatorTest {
    /**
     * 初始化方法：
     *  用于资源申请，所有测试方法在执行之前都会先执行该方法
     */
    @Before
    public void init(){
        System.out.println("init...");
    }

    /**
     * 释放资源方法：
     *  在所有测试方法执行完后，都会自动执行该方法
     */
    @After
    public void close(){
        System.out.println("close...");
    }


    /**
     * 测试add方法
     */
    @Test
    public void testAdd(){
       // System.out.println("我被执行了");
        //1.创建计算器对象
        System.out.println("testAdd...");
        Calculator c  = new Calculator();
        //2.调用add方法
        int result = c.add(1, 2);
        //一般不用输出来看效果，而是使用断言来让结果和预期相比较
        //System.out.println(result);

        //3.断言  我断言这个结果是3
        Assert.assertEquals(3,result);

    }

    @Test
    public void testSub(){
        //1.创建计算器对象
        Calculator c  = new Calculator();
        int result = c.sub(1, 2);
        System.out.println("testSub....");
        Assert.assertEquals(-1,result);
    }
}
```



# 反射

反射:框架设计的灵魂

- 框架:半成品软件。可以在框架的基础上进行软件开发，简化编码
- 反射:将类的各个组成部分封装为其他对象，这就是反射机制
- 反射机制好处∶
  - 1．可以在程序运行过程中，操作这些对象
  - 2．可以解耦，提高程序的可扩展性



获取class对象的方式
1.class.forName(“全类名”):将字节码文件加载进内存，返回class对象
多用于配置文件，将类名定义在配置文件中。读取文件，加载类
2．类名.class :通过类名的属性class获取
多用于参数的传递
3．对象.getClass() : getClass()方法是在Object类中定义
多用于对象的获取字节码的方式





# 注解

注解概念︰说明程序的。给计算机看的
回顾注释:用文字描述程序的。给程序员看的
定义: 注解(Annotation)，也叫元数据。一种代码级别的说明。它是JDK1.5及以后版本引又的一个特性，与类、接口、枚举是在同一个层次。它可以声明在包、类、字段、方法、局部变量、方法参数等的前面，用来对这些元素进行说明，注释；
注解概念描述∶
JDK1.5之后的新特性
说明程序的
使用注解∶@注解名称
作用分类︰
编写文档:通过代码里标识的注解生成文档【生成文档doc文档】
代码分析∶通过代码里标识的注解对代码进行分析【使用反射】
编译检查:通过代码里标识的注解让编译器能够实现基本的编译检查【Override】