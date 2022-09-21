## 基础概念

1. **POJO（Plain Ordinary Java Object）**：即简单 Java 对象，就是一个我们最常见的普通 Java 对象，这个概念是被大家叫出来的，它具有一些属性，然后提供对应的 getter 和 setter。**即不与数据库打交道的简单对象。**
2. **VO（View Object）**：视图对象，用于展示层，它的作用是把某个指定页面（或组件）的所有数据封装起来。即和 html、jsp 等页面属性对应的 Java 对象。
3. **DTO（Data Transfer Object）**：数据传输对象，泛指用于展示层与服务层之间的数据传输对象。即提取数据库中所需要的的属性减少不需要的属性来提高传输速度、流量。
   比如前端发来请求某一字段（User的名字），实际数据库返回一个拥有全部字段的返回值，造成冗余。这时候可以用 DTO，在 controller 再把 DTO 转成 Entity
4. **Entity** ：Entity 里的每一个字段，与数据库相对应。一个类对应一张数据库表。
5. **Domain**：一般包括Entity、DTO、Enums。一个 Domain 可能包含多张相互关联的数据表，主从表合体。
6. **DAO（Data Access Object）**：数据访问对象，它是一个面向对象的数据库接口，负责持久层的操作，为业务层提供接口，主要用来封装对数据库的访问，常见操作无外乎 CURD。我们也可以认为一个 DAO 对应一个 POJO 的对象，它位于业务逻辑与数据库资源中间，可以结合 PO 对数据库进行相关的操作。
7. **Mapper**：Mapper 本质是一个 DAO。Mapper 为 ServiceImpl 提供操作数据的方法，但方法的具体实现（也就是 SQL 语句）放在了 Mapper 下的 xml 文件里。
8. **Service**：提供业务逻辑要用到的方法的接口，底下创建 ServiceImpl 实现具体功能。只要没访问数据库的，都要在业务里写。
   ServiceImpl 负责了主要的功能编写，Controller提供了使用的入口。
9. **Controller**：通过接收前端传过来的参数进行业务操作，再将处理结果返回到前端，为前端提供的访问入口，不用关心具体的业务逻辑。



## 程序结构

我们在 com.example 目录下新建四个目录，分别是 Controller、DAO (Mapper)、Entity (Domain)、Service。

![chengxujiegou](Resources/chengxujiegou.png)

- Controller 层负责前端传过来的具体的业务模块流程的控制，交给 Service 层处理。
- Entity 层用于存放我们的实体类，与数据库中的属性值基本保持一致，实现 set 和 get 的方法
- Dao 层主要是做数据持久层的工作，负责与数据库联络，直接针对数据库操作，封装了增删改查基本操作
- Service 层主要负责业务模块的逻辑应用设计，具体要调用到已定义的 DAO 层的接口

然后在 resources 目录下新建 mapper 目录。这个 mapper 目录是用来存放 SQL 语句的地方。static 目录下存放静态资源，如 CSS, JavaScript,图片 等页面资源。templates 目录下存放动态资源，如 JSP, thymeleaf 等模板页面。

> 默认情况下，静态资源 (static)可以直接访问，动态资源 (templates)无法直接访问。Maven 里引入了 thymeleaf 模板依赖后可以访问动态资源，且把静态资源页面覆盖掉。



## 传统 MVC 框架

即 model-view-controller 三层架构。

- model 层 = Entity 层，与数据库的数据表对应

- mapper 层 = DAO 层，对数据库进行数据持久化操作

- view 层是做前端界面的展示，controller 层做业务模流程块的控制


情景：
不管是什么框架，我们很多时候都会与数据库进行交互。如果遇到一个场景我们都要去写 SQL 语句，那么我们的代码就会很冗余。所以，我们就想到了把数据库封装一下，让我们的数据库的交道看起来像和一个对象打交道，这个对象通常就是 DAO。当我们操作这个对象的时候，这个对象会自动产生 SQL 语句来和数据库进行交互，我们就只需要使用 DAO 就行了。**SQL 语句通常写在 mapper 文件里面的**。

Service 层是建立在 DAO 层之上的，建立了 DAO 层后才可以建立 Service 层，而Controller 层又是在 Service 层之上的，因而 Service 层应该既调用 DAO 层的接口，又要提供接口给 Controller 层的类来进行调用，它刚好处于一个中间层的位置。每个模型都有一个 Service 接口，每个接口分别封装各自的业务处理方法。

层级建立顺序：

**Entity -> DAO -> Service -> Controller**

用户从页面前端，也就是我们所说的 View 层进行查询访问，进入到 Controller 层找到对应的接口，接着 Controller 进行对 Service 层进行业务功能的调用，Service 要进入 DAO 层查询数据，DAO 层调用 mapper.xml 文件生成 SQL 语句到数据库中进行查询。

在数据库中查询到数据，DAO 层拿到实体对象的数据，接着交付给 Service 层，接着 Service 进行业务 逻辑的处理，返回结果给 Controller，Controller 根据结果进行最后一步的处理，返回结果给前端页面。

一个用户访问页面的实际逻辑流程为：

**View -> Controller -> Service -> DAO -> mapper -> DAO -> Service -> Controller -> View**

这里 mapper 指的是存放 SQL 语句的 xml 文件，mapper里面的 SQL 操作 Entity 类来对数据库进行增删改查。

如果业务类型复杂，Entity 会改为用 Domain。例如个人简历，里面的基本个人信息可以放一张表，但是由于工作经历或者个人技能众多，也放在个人基本信息表里就不好增删改查，一般会单独放一张从表。由多张主从表构成的大型 Entity 叫做 Domain。

Domain -> Mapper (DAO) -> Service -> Controller

