# 前因

新公司使用springbean+jsf2.0开发demo，感觉使用起来不太顺手且不大习惯，所以自己使用SpringBoot整合了JSF2.0，故此记录。



# 一、配置 pom 文件

```xml
 <!-- Spring Boot dependencies -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <!-- 缓存支持 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>1.3.2</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
    <!-- Database dependencies -->
    <!-- druid数据库连接池-->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid-spring-boot-starter</artifactId>
        <version>1.1.10</version>
    </dependency>
    <!--mysql驱动-->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
    <dependency>
        <groupId>org.primefaces</groupId>
        <artifactId>primefaces</artifactId>
        <version>8.0</version>
    </dependency>
    <dependency>
        <groupId>com.sun.faces</groupId>
        <artifactId>jsf-api</artifactId>
        <version>2.2.20</version>
    </dependency>
    <dependency>
        <groupId>com.sun.faces</groupId>
        <artifactId>jsf-impl</artifactId>
        <version>2.2.20</version>
    </dependency>
    <dependency>
        <groupId>org.apache.tomcat.embed</groupId>
        <artifactId>tomcat-embed-jasper</artifactId>
    </dependency>
    <dependency>
        <groupId>org.ocpsoft.rewrite</groupId>
        <artifactId>rewrite-servlet</artifactId>
        <version>3.4.1.Final</version>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
    <!--common工具包-->
    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-lang3</artifactId>
    </dependency>
    <!-- https://mvnrepository.com/artifact/net.sf.mpxj/mpxj -->
    <dependency>
        <groupId>net.sf.mpxj</groupId>
        <artifactId>mpxj</artifactId>
        <version>9.0.0</version>
        <exclusions>
            <exclusion>
                <artifactId>jakarta.activation</artifactId>
                <groupId>com.sun.activation</groupId>
            </exclusion>
        </exclusions>
    </dependency>
    <!-- https://mvnrepository.com/artifact/jakarta.faces/jakarta.faces-api -->
    <dependency>
        <groupId>jakarta.faces</groupId>
        <artifactId>jakarta.faces-api</artifactId>
        <version>3.0.0</version>
        <scope>provided</scope>
    </dependency>
    <!-- https://mvnrepository.com/artifact/commons-io/commons-io -->
    <dependency>
        <groupId>commons-io</groupId>
        <artifactId>commons-io</artifactId>
        <version>2.4</version>
    </dependency>
    <!-- https://mvnrepository.com/artifact/com.alibaba/fastjson -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.58</version>
    </dependency>

```

# 二、项目结构

```
src
|--main
|--	|--java
|--	|--resources
|--	|--webapp
```

在webapp下新增WEB-INF文件夹，在WEB-INF文件下新增web.xml及face-config.xml
web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app version="3.0" xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		 xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd">
	<servlet>
		<servlet-name>Faces Servlet</servlet-name>
		<servlet-class>javax.faces.webapp.FacesServlet</servlet-class>
		<load-on-startup>1</load-on-startup>
	</servlet>
	<servlet-mapping>
		<servlet-name>Faces Servlet</servlet-name>
		<url-pattern>*.xhtml</url-pattern>
	</servlet-mapping>
	<listener>
		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	</listener>
	<listener>
		<listener-class>org.springframework.web.context.request.RequestContextListener</listener-class>
	</listener>

	<context-param>
		<param-name>javax.faces.STATE_SAVING_METHOD</param-name>
		<param-value>client</param-value>
	</context-param>

	<context-param>
		<param-name>javax.faces.PROJECT_STAGE</param-name>
		<param-value>Development</param-value>
	</context-param>

	<!-- 配置出错提示页面 -->
	<error-page>
		<error-code>403</error-code>
		<location>/WEB-INF/layout/access.xhtml</location>
	</error-page>
	<error-page>
		<error-code>404</error-code>
		<location>/WEB-INF/layout/notfound.xhtml</location>
	</error-page>
	<error-page>
		<exception-type>javax.faces.application.ViewExpiredException</exception-type>
		<location>/WEB-INF/layout/expired.xhtml</location>
	</error-page>
	<error-page>
		<exception-type>java.lang.Throwable</exception-type>
		<location>/WEB-INF/layout/error.xhtml</location>
	</error-page>

</web-app>
```

face-config.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<faces-config xmlns="http://xmlns.jcp.org/xml/ns/javaee"
			  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
			  xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
        http://xmlns.jcp.org/xml/ns/javaee/web-facesconfig_2_2.xsd"
			  version="2.2">
	<name>gantt365</name>
	<application>
		<el-resolver>org.springframework.web.jsf.el.SpringBeanFacesELResolver</el-resolver>
		<action-listener>
			org.primefaces.application.DialogActionListener
		</action-listener>
		<navigation-handler>
			org.primefaces.application.DialogNavigationHandler
		</navigation-handler>
		<view-handler>
			org.primefaces.application.DialogViewHandler
		</view-handler>

	</application>
</faces-config>
```
可根据自身情况进行调整。



添加配置文件`application.yml`，位置是在`src/main/resources/config`，内容如下：

```yml
server:
  port: 9000
spring:
  mvc:
    view:
      prefix: /views/
      suffix: .xhtml
  profiles:
    active:
    - dev
```

  



# 三、启动类配置

部分配置可写入启动类：

```java
 @Bean
    public ServletRegistrationBean servletRegistrationBean() {
        FacesServlet servlet = new FacesServlet();
        return new ServletRegistrationBean(servlet, "*.xhtml");
    }

    @Bean
    public FilterRegistrationBean rewriteFilter() {
        FilterRegistrationBean rwFilter = new FilterRegistrationBean(new RewriteFilter());
        rwFilter.setDispatcherTypes(EnumSet.of(DispatcherType.FORWARD, DispatcherType.REQUEST,
                DispatcherType.ASYNC, DispatcherType.ERROR));
        rwFilter.addUrlPatterns("/*");
        return rwFilter;
    }

    @Bean
    public ServletContextInitializer servletContextInitializer() {

        return sc -> {
            sc.addListener(com.sun.faces.config.ConfigureListener.class);
            //初始样式，这个是公司采购的样式，可根据自身需求修改
            sc.setInitParameter("primefaces.THEME", "diamond-" + new MyPreferences().getComponentTheme() + "-" + new MyPreferences().getMenuTheme());
            sc.setInitParameter("primefaces.FONT_AWESOME","true");
        };
    }

    @Bean
    public ServletListenerRegistrationBean<ConfigureListener> jsfConfigureListener() {
        return new ServletListenerRegistrationBean<ConfigureListener>(
                new ConfigureListener());
    }

    @Override
    public void setServletContext(ServletContext servletContext) {
        servletContext.setInitParameter("com.sun.faces.forceLoadConfiguration", Boolean.TRUE.toString());
    }

```



# 四、作用域配置

因 JSF2.0主要有 FaceServlet 来处理交互，所以类之间的销毁由作用域来决定，可直接使用的配置有

```java
//常用
@Scope(value = "session")
@Scope(value = "request")
```

也可以自己配置作用域，例：

```java
@Component
public class ViewScope implements Scope {

	@Override
	public Object get(String name, ObjectFactory<?> objectFactory) {
		Map<String, Object> viewMap = FacesContext.getCurrentInstance().getViewRoot().getViewMap();
		if(viewMap.containsKey(name)){
			return viewMap.get(name);
		}else{
			Object object = objectFactory.getObject();
			viewMap.put(name, object);
			return object;
		}
	}

	@Override
	public String getConversationId() {
		return null;
	}

	@Override
	public void registerDestructionCallback(String arg0, Runnable arg1) {

	}

	@Override
	public Object remove(String name) {
		if (FacesContext.getCurrentInstance().getViewRoot() != null) {
				return FacesContext.getCurrentInstance().getViewRoot().getViewMap().remove(name);
		} else {
			return null;
		}
	}

	@Override
	public Object resolveContextualObject(String arg0) {
		return null;
	}

}

```

新增域之后需要配置才能使用：

    @Configuration
    @ComponentScan
    public class AppConfig {
        @Bean
        public static CustomScopeConfigurer customScopeConfigurer() {
            CustomScopeConfigurer customScopeConfigurer = new CustomScopeConfigurer();
    
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("view", new ViewScope());
    
            // 配置scope
            customScopeConfigurer.setScopes(map);
            return customScopeConfigurer;
        }
    }

至此，可以开始使用JSF进行前后端的交互了：

```java
@Scope(value = "view")
@Component(value = "indexView")
//对应前端页面可以使用的调用名称
@ELBeanName(value = "indexView")
//链接及连接对应的xhtml
@Join(path = "/index", to = "/index.xhtml")
public class IndexView {
}
```



# 五、security 配置

新建一个类实现UserDetailsService，来载入用户信息，我这里选择的是继承JdbcDaoImpl，可根据自身情况进行选择：

```java
@Component
public class GanttUserDetailsService extends JdbcDaoImpl {

	@Autowired
	private DataSource dataSource;

	@PostConstruct
	private void initialize() {
		setDataSource(dataSource);
	}
	// 定义新的用户查询SQL（根据自身情况更改）
	public final String USERS_BY_USERNAME_QUERY = 
			"select account,password,enabled,fullname "
			+ "from users "
			+ "where cellphone = ? or emailaddr = ?";
	
	public final String AUTHORITIES_BY_USERNAME_QUERY = "select account,authority "
			+ "from authorities "
			+ "where account = ?";
	
	public GanttUserDetailsService() {
		this.setAuthoritiesByUsernameQuery(AUTHORITIES_BY_USERNAME_QUERY);
	}

	@Override
	protected List<UserDetails> loadUsersByUsername(String username) {
		// 确定查询map，用自定义用户详情
		RowMapper<UserDetails> mapper = (rs, rowNum) -> {
			String account = rs.getString(1);
			String password = rs.getString(2);
			boolean enabled = rs.getBoolean(3);
			String fullname = rs.getString(4);
			
			AccountUser user = new AccountUser(username, password, enabled, true, true, true, AuthorityUtils.NO_AUTHORITIES);
			user.setAccount(account);
			user.setFullname(fullname);
			return user;
		};
		// 查询
		return getJdbcTemplate().query(USERS_BY_USERNAME_QUERY, mapper, username, username);
	}
	
	@Override
	protected List<GrantedAuthority> loadUserAuthorities(String username) {
		
		// 先查询用户，找出真实的账号
		List<UserDetails> user = loadUsersByUsername (username);
		if (user.size() == 0) {
			return AuthorityUtils.NO_AUTHORITIES;
		}
		if (user.get(0) instanceof AccountUser) {
			AccountUser gu = (AccountUser) user.get(0);
			username = gu.getAccount();
		}
		
		// 查询权限
		RowMapper<GrantedAuthority> mapper = (rs, rowNum) -> {
			String roleName = this.getRolePrefix() + rs.getString(2);
			return new SimpleGrantedAuthority(roleName);
		};
		return getJdbcTemplate().query(AUTHORITIES_BY_USERNAME_QUERY, mapper, username);
	}

	@Override
	protected UserDetails createUserDetails(String username, UserDetails userFromUserQuery,
			List<GrantedAuthority> combinedAuthorities) {
		
		// 直接返回查询出的用户详情对象
		if (userFromUserQuery instanceof AccountUser) {
			AccountUser u = (AccountUser) userFromUserQuery;
			u.setAuthorities(combinedAuthorities);
			return userFromUserQuery;
		}

		// 返回缺省处理
		return super.createUserDetails(username, userFromUserQuery, combinedAuthorities);
	}

}
```

新建一个类继承WebSecurityConfigurerAdapter，书写自己的配置：

```java
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	private GanttUserDetailsService userDetailService;
	//随机密码加密锁
	private static final String SECRET = "e37f4b31-0c12-98dd-bd0b-0899200c9a66";
	/**
	 * 指定加密方式
	 */
	@Bean
	public PasswordEncoder passwordEncoder(){
		// 使用BCrypt加密密码
		return new BCryptPasswordEncoder();
	}

	/**
	 * RememberMeAuthenticationProvider.
	 *
	 * @return
	 */
	@Bean
	public RememberMeAuthenticationProvider rememberMeAuthenticationProvider() {
		return new RememberMeAuthenticationProvider(SECRET);
	}

	/**
	 * TokenBasedRememberMeServices.
	 *
	 * @return
	 */
	@Bean("tokenBaseRememberMeServices")
	public TokenBasedRememberMeServices tokenBasedRememberMeServices() {
		TokenBasedRememberMeServices rememberMeServices =
				new TokenBasedRememberMeServices(SECRET, userDetailService);
		rememberMeServices.setAlwaysRemember(false);
		//记住我配置
		rememberMeServices.setCookieName("remember-me");
		rememberMeServices.setTokenValiditySeconds(AbstractRememberMeServices.TWO_WEEKS_S);
		return rememberMeServices;
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.headers()
				.addHeaderWriter(new DelegatingRequestMatcherHeaderWriter(
						//javafx必须配置，前端渲染之后的静态文件都在此目录下
						new AntPathRequestMatcher("/javax.faces.resource/**"),
						new HeaderWriter() {

							@Override
							public void writeHeaders(HttpServletRequest request,
													 HttpServletResponse response) {
								response.addHeader("Cache-Control", "private, max-age=86400");
							}
						}))
				.defaultsDisabled()
				.and()
				.authorizeRequests()
				// 允许post请求/add-user，而无需认证
				.antMatchers("/javax.faces.resource/**","/resources/**").permitAll()
				.antMatchers("/login","/public/register","/public/register-success","/index","/").permitAll()
				// 所有请求都需要验证
				.anyRequest().authenticated()
				.and()
				// 使用默认的登录页面
				.formLogin().loginPage("/login")
				.loginProcessingUrl("/login")
				.failureUrl("/login?error")
				//登录成功页面
				//登入handler
				//.successHandler(new LoginSuccessHandler())
				.and()
				.logout()
				//登出handler
				//.logoutSuccessHandler(new LogoutSuccessHandler())
				.and().authenticationProvider(authenticationProvider())
				// post请求要关闭csrf验证,不然访问报错；实际开发中开启，需要前端配合传递其他参数
				.csrf().disable();
		//记住我
		http.rememberMe().rememberMeParameter("remember-me")
				.rememberMeServices(tokenBasedRememberMeServices())
				.and()
				.authenticationProvider(rememberMeAuthenticationProvider());
				//配置一个用户同时只能登录一次
		http.sessionManagement().maximumSessions(1).expiredUrl("/login");
	}

	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setHideUserNotFoundExceptions(false);
		provider.setUserDetailsService(userDetailService);
		provider.setPasswordEncoder(passwordEncoder());
		return provider;
	}

}

```

至此SpringSecurity整合完成。



# 六、Mybatis配置

```xml
mybatis:
    mapper-locations: classpath*:mapper/*Mapper.xml
    type-aliases-package: com.xxx.xxx
    configuration:
      log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

```

至此mybatis整合完成。