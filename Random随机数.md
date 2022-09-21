# 随机数

## Random 类

Random 类的实例用于生成伪随机数流，此类使用48位的种子，使用线性同余公式对其进行修改。如果用相同的种子创建两个 Random 实例，则对每个实例进行相同的方法调用序列，它们将生成并返回相同的数字序列。为了保证此属性的实现，为类 Random 指定了特定的算法。为了 Java 代码的完全可移植性，Java 实现必须让类 Random 使用此处所示的所有算法。但是允许 Random 类的子类使用其他算法，只要其符合所有方法的常规协定即可。 

> 注：Random 类实现的算法使用一个 protected 实用工具方法，每次调用它最多可提供32个伪随机生成的位。
>



## Random 类构造方法

```java
//直接创建一个 Random 类对象
Random()
//使用 seed 作为随机种子创建一个 Random 类对象
Random(long seed)
```



## Random 类常用方法

```java
//从随机数生成器返回下一个整型值
int nextInt()
//从随机数生成器返回下一个长整型值
long nextLong()
//从随机数生成器返回0.0到1.0之间的下一个浮点值
float nextFloat()
//从随机数生成器返回0.0到1.0之间的下一个双精度值
double nextDouble()
//从随机数生成器返回下一个高斯分步的双精度值。中间值为0.0，而标准差为1.0
double nextGaussian()
```

例如：

```java
import java.util.Random;

public class RandomExample {
			public static void main(String[] args) {
            Random random = new Random();
            System.out.println("生成boolean类型的随机数：" + random.nextBoolean());
						System.out.println("生成double类型的随机数：" + random.nextDouble());
						System.out.println("生成float类型的随机数：" + random.nextFloat());
            System.out.println("生成int类型的随机数：" + random.nextInt());
						System.out.println("生成0到10之间int类型的随机数：" + random.nextInt(10));
            System.out.println("生成long类型的随机数：" + random.nextLong());
      }
}
```



## 项目实例

### 思路

1、生成随机数需要使用到 Java 工具类中的 Random类。

2、要求是随机x到y之间的整数，即指定范围，则使用Random类中的nextInt(int n)方法。

3、该方法生成从0（包括）到n（不包括）之间的随机整数，是一个伪随机数，并不是真正的随机数。

4、若x不为0，则需要在随机结果后加上x。参数n的值也需要加上1后减去x。最后结果才符合要求的范围。



### 实现过程

1、定义x和y的值，修改该值可以随机不同范围的整数。

2、调用 Random 中的 nextInt(int n)方法，计算随机数。

3、将结果打印到控制台。



### 详细代码

```java
//java代码：生成一个从x到y之间的随机数（整数）
import  java.util.Random;
 
/**
  * 一、思路：
  * 1、生成随机数需要使用到Java工具类中的Random类。
  * 2、要求是随机x到y之间的整数，即指定范围，则使用Random类中的nextInt(int n)方法。
  * 3、该方法生成从0（包括）到n（不包括）之间的随机整数，是一个伪随机数，并不是真正的随机数。
  * 4、若x不为0，则需要在随机结果后加上x。参数n的值也需要加上1后减去x。最后结果才符合要求的范围。
  * 二、实现：
  * 1、定义x和y的值，修改该值可以随机不同范围的整数。
  * 2、调用Random中的nextInt(int n)方法，计算随机数。
  * 3、将结果打印到控制台。
  * */

public  class  RandomTest { 
     public  static  final  int  START =  50 ;    //定义范围开始数字     
     public  static  final  int  END =  99 ; 		 //定义范围结束数字     
     public  static  void  main(String[] args) {
         
         //创建Random类对象
         Random random =  new  Random();              
         
         //产生随机数
         int  number = random.nextInt(END - START +  1 ) + START;
         
         //打印随机数
         System.out.println( "产生一个" + START + "到" + END + "之间的随机整数：" + number);
         
     }
}
```

