#  一、Axios

## 1、介绍

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

能够拦截所有的请求和响应，并对其进行处理。还能自动转换 JSON 数据，无需手动转换。

**仓库地址:** [https://github.com/axios/axios](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Faxios%2Faxios)



#### **特性**

- 从浏览器中创建 [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- 从 node.js 创建 [http](http://nodejs.org/api/http.html) 请求
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)



#### **安装**

使用 npm:

```shell
npm install axios
```



使用 cdn:

```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```



#### **Axios 的常用API**

- get ： 查询数据
- post ： 添加数据
- put ： 修改数据
- delete：删除数据
- axios.create()：配置自定义的axios





## 2、请求基本语法

可以通过向 Axios 传递相关配置来创建请求

**Axios(config)**

```javascript
// 发送 GET 请求
axios({
  method: 'get',
  url: '/users',
  params: {
    ID: 12345
  },
  responseType:	''
});

// 发送 POST 请求
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```



完整的配置请求：

```javascript
{
   // `url` 是用于请求的服务器 URL
  url: '/user',

  // `method` 是创建请求时使用的方法
  method: 'get',      // default

  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  transformRequest: [function (data, headers) {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `headers` 是即将被发送的自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` 是即将与请求一起发送的 URL 参数
  // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  params: {
    ID: 12345
  },

   // `paramsSerializer` 是一个负责 `params` 序列化的函数
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  // 在没有设置 `transformRequest` 时，必须是以下类型之一：
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属：FormData, File, Blob
  // - Node 专属： Stream
  data: {
    firstName: 'Fred'
  },

  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
  // 如果请求话费了超过 `timeout` 的时间，请求将被中断
  timeout: 1000,

   // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // default

  // `adapter` 允许自定义处理请求，以使测试更轻松
  // 返回一个 promise 并应用一个有效的响应 (查阅 [response docs](#response-api)).
  adapter: function (config) {
    /* ... */
  },

 // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
  // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

   // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json',      // default

  // `responseEncoding` indicates encoding to use for decoding responses
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8',     // default

   // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN',     // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN',     // default

   // `onUploadProgress` 允许为上传处理进度事件
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` 允许为下载处理进度事件
  onDownloadProgress: function (progressEvent) {
    // 对原生进度事件的处理
  },

   // `maxContentLength` 定义允许的响应内容的最大尺寸
  maxContentLength: 2000,

  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` 定义在 node.js 中 follow 的最大重定向数目
  // 如果设置为0，将不会 follow 任何重定向
  maxRedirects: 5,     // default

  // `socketPath` defines a UNIX Socket to be used in node.js.
  // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
  // Only either `socketPath` or `proxy` can be specified.
  // If both are specified, `socketPath` is used.
  socketPath: null,     // default

  // `httpAgent` 和 `httpsAgent` 分别在 node.js 中用于定义在执行 http 和 https 时使用的自定义代理。允许像这样配置选项：
  // `keepAlive` 默认没有启用
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // 'proxy' 定义代理服务器的主机名称和端口
  // `auth` 表示 HTTP 基础验证应当用于连接代理，并提供凭据
  // 这将会设置一个 `Proxy-Authorization` 头，覆写掉已有的通过使用 `header` 设置的自定义 `Proxy-Authorization` 头。
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // `cancelToken` 指定用于取消请求的 cancel token
  // （查看后面的 Cancellation 这节了解更多）
  cancelToken: new CancelToken(function (cancel) {
  })
}
```



#### **发起一个 GET 请求**

```javascript
const axios = require('axios');

// 向给定ID的用户发起请求
axios.get('/user?ID=12345')
  .then(function (response) {
    // 处理成功情况
    console.log(response);
  })
  .catch(function (error) {
    // 处理错误情况
    console.log(error);
  })
  .then(function () {
    // 总是会执行
  });
```

上面的请求也可以用params进行传递

```javascript
const axios = require('axios');

axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    // 处理成功情况
    console.log(response);
  })
  .catch(function (error) {
    // 处理错误情况
    console.log(error);
  });
```



执行多个并发请求

```javascript
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
    // 两个请求现在都执行完成
  }));
```



##### GET 请求传递参数

通过传统的以 ? 的形式在 URL 传递参数：

```javascript
axios.get('http://localhost:3000/axios?id=123')
  .then(function(response){
      console.log(response.data)
    })
```



以 restful 形式传递参数：

```javascript
axios.get('http://localhost:3000/axios/123')
  .then(function(response){
      console.log(response.data)
    })
```



通过 params  形式传递参数，一定要在 {} 里面使用 params 对象

```javascript
axios.get('http://localhost:3000/axios', {
      params: {
        id: 789
      }
    }).then(function(response){
      console.log(response.data)
    })
```





#### 执行一个 POST 请求

```javascript
 const axios = require('axios');
 
 axios.post('http://localhost:3000/axios', {
      uname: 'lisi',
      pwd: 123
    })
   .then(function (response) {
    // 处理成功情况
    console.log(response);
  })
   .catch(function (error) {
    // 处理错误情况
    console.log(error);
  })
   .then(function () {
    // 总是会执行
  });
```



##### POST 请求传递参数

通过选项传递参数（默认传递的是 json 格式的数据）

```javascript
const axios = require('axios');

axios.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```



通过 URLSearchParams 传递参数（application/x-www-form-urlencoded）

```javascript
const params = new URLSearchParams();

// params.append('param1', 'value1');
params.append('uname', 'zhangsan');
// params.append('param2', 'value2');
params.append('password', '111');

axios.post('/api/test', params).then(response=>{
console.log(response.data)
})
```



#### 发起一个 PUT 请求

PUT 请求与 POST 请求的方式相同，参数传递方式也相同。

```javascript
const axios = require('axios');

axios.put('http://localhost:3000/axios/123', {
      uname: 'lisi',
      pwd: 123
    })	
  .then(function (response) {
    // 处理成功情况
    console.log(response);
  })
  .catch(function (error) {
    // 处理错误情况
    console.log(error);
  })
  .then(function () {
    // 总是会执行
  });
```





#### 发起一个 DELETE 请求

DELETE 请求与 GET 请求的方式相同，参数传递方式也相同。

```javascript
const axios = require('axios');

axios.delete('http://localhost:3000/axios', {
      params: {
        id: 111
      }
    })
	.then(function (response) {
    // 处理成功情况
    console.log(response);
  })
  .catch(function (error) {
    // 处理错误情况
    console.log(error);
  })
  .then(function () {
    // 总是会执行
  });
```



## 3、响应结构

#### 响应结果的主要属性

Axios 请求获得响应结果是一个对象，里面除了包含响应数据的 data，还包括 响应头信息 headers 、响应状态码信息 status、响应状态信息 statusText 等信息。

完整的相应结构：

```javascript
{
  // "data" 由服务器提供的响应，里面包含服务器返回的真实数据
  data: {},

  // "status" 来自服务器响应的 HTTP 状态码
  status: 200,

  // "statusText" 来自服务器响应的 HTTP 状态文本信息
  statusText: 'OK',

  // "headers" 服务器响应的头
  headers: {},

  // "config" 是为请求提供的配置信息
  config: {},
    
  // `request` 是生成此响应的请求
  // 它是 node.js 中的最后一个 ClientRequest 实例（在重定向中）
  // 和浏览器中的 XMLHttpRequest 实例
  request: {}
}
```

使用 **then** 时，你将接收下面这样的响应 :

```javascript
axios.get('/user/12345')
  .then(function(response) {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  });
```

在使用 **catch** 时，或传递 rejection callback 作为 then 的第二个参数时，响应可以通过 error 对象可被使用，正如在错误处理这一节所讲。



## 4、配置默认值

你可以指定将被用在各个请求的配置默认值。

axios 设置一些全局配置信息，然后所有请求都可以应用这些配置，统一做了处理如果以后要改也非常容易，极大的简化了代码。



#### 全局的 Axios 默认值

```javascript
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```



#### 自定义实例默认值

```javascript
// 创建实例时设置配置默认值
const instance = axios.create({
  baseURL: 'https://api.example.com'
});

// 创建实例后更改默认值
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
```



#### 配置的优先顺序

配置会以一个优先顺序进行合并。这个顺序是：在 `lib/defaults.js` 找到的库的默认值，然后是实例的 `defaults` 属性，最后是请求的 `config` 参数。后者将优先于前者。这里是一个例子：

```javascript
// 使用由库提供的配置的默认值来创建实例
// 此时超时配置的默认值是 `0`
var instance = axios.create();

// 配置 请求超时时间
// 现在，在超时前，所有请求都会等待 2.5 秒
instance.defaults.timeout = 2500;

// 为已知需要花费很长时间的请求覆写超时设置
instance.get('/longRequest', {
  timeout: 5000
});
```



## 5、拦截器

概念：在请求或响应被 **then** 或 **catch** 处理前拦截它们。



Axios 的拦截器分为两大类：请求拦截器和响应拦截器。

- 请求拦截器的作用是在请求发送前对其进行一些操作，例如给每个请求体里加上token。
- 响应拦截器的作用是在接收到响应数据之后，对其进行一些操作，例如在服务器返回登录状态失效，需要重新登录的时候，跳转到登录页。



#### 请求拦截器

```javascript
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 任何请求都会经过这一步，在发送请求之前做些什么
    return config;
  	// 这里一定要return，否则配置不成功
  
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
```



#### 响应拦截器

```javascript
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 任何响应都会经过这一步，对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
```



如果你想在稍后移除拦截器，可以这样：

```javascript
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

可以为自定义 axios 实例添加拦截器

```javascript
const instance = axios.create();
instance.interceptors.request.use(function () {/*...*/});
```



## 6、错误处理

使用 catch 处理错误：

```javascript
axios.get('/user/12345')
  .catch(function (error) {
    if (error.response) {
      // 请求已发出，服务器以状态码响应
      // 超出 2xx 的范围
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // 已发出请求但未收到响应
      // `error.request` 是浏览器中 XMLHttpRequest 的一个实例，也是 node.js 中的 http.ClientRequest
      console.log(error.request);
    } else {
      // 设置触发错误的请求时发生了一些事情
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
```

可以使用 `validateStatus` 配置选项定义一个自定义 HTTP 状态码的错误范围。

```javascript
axios.get('/user/12345', {
  validateStatus: function (status) {
    // 仅当状态码大于等于 500 时才拒绝
    return status < 500; 
  }
})
```

使用 `toJSON()` 你会得到一个包含更多关于 HTTP 错误信息的对象。

```javascript
axios.get('/user/12345')
  .catch(function (error) {
    console.log(error.toJSON());
  });
```



## 7、取消

从 v0.22.0 开始，Axios 支持 AbortController 以 fetch API 方式取消请求：

```javascript
const controller = new AbortController();

axios.get('/foo/bar', {
   signal: controller.signal
}).then(function(response) {
   //...
});
	 // 取消请求
controller.abort()
```



v0.22.0之前版本（废弃，不被推荐使用）

```javascript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function (thrown) {
  // 处理错误
});

// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.');
```



#### Axios 中取消同一时间的多次请求

最常见的案例就是当我们点击按钮需要去请求数据，如果按钮没有坐任何限制的话，当快速多次点击按钮，可能会同时发出好几条相同的请求，造成服务器压力，也有可能造成页面数据不对，此时我们一般常用的方法就是在axios的全局拦截中做一些限制和判断来规避这种操作 

以重复下载为例子：

```javascript
const downloadController = new AbortController();

fetch('http://localhost:3000/test?str=${this.searchStr}', {
        signal: downloadController.signal
      })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
  				if (error.name === 'AbortError') {
            console.log('Fetch was aborted')
        		} else {
            console.log('Error', error)
        		}
        });
    },
downloadController.abort();
```



## 8、使用 Axios 的请求例子

```javascript
import axios from 'axios'
import cookie from 'vue-cookie'
//import cookieUntil from '../assets/js/cookieUtil'
import {Loading,Message} from 'element-ui';
// 搭配nprogress进度条使用
import nProgress from 'nprogress'
import "nprogress/nprogress.css";	

// 1. 创建Axios实例
const requests = axios.create({
  baseURL: '/api', // 公共接口
  timeout: 10000,  // 超时时间设置10秒
  headers: {
  	token: cookie.get('cookieName')
  	}
})

// 2.请求拦截器 --在项目中发请求（请求没有发出去）可以做一些事情
let loading = null
requests.interceptors.request.use(config => {
  config.data = JSON.stringify(config.data) // 请求数据转化
  nProgress.start()
  // 加载 Loading 动画
  loading = Loading.service({
    lock: true,
    text: 'Loading...',
    background: 'rgba(0, 0, 0, 0.5)',
  });
  config.headers = {
    'Content-Type': 'application/json', // 配置请求头
  }
  return config;
}, error => {
  Promise.reject(error);
})

// 3.响应拦截器 --当服务器手动请求之后，做出响应（相应成功）会执行的
requests.interceptors.response.use(response => {
  // 如果请求成功
  if (res.code === 200) {
    loading.close();
    nProgress.done();
    return response.data;
}
}, error => {
	// 错误信息处理
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        break
      case 401:
        error.message = '未授权，请重新登录'
        break
      case 403:
        error.message = '拒绝访问'
        break
      case 404:
        error.message = '请求错误,未找到该资源'
        break
      case 405:
        error.message = '请求方法未允许'
        break
      case 408:
        error.message = '请求超时'
        break
      case 500:
        error.message = '服务器端出错'
        break
      case 501:
        error.message = '网络未实现'
        break
      case 502:
        error.message = '网络错误'
        break
      case 503:
        error.message = '服务不可用'
        break
      case 504:
        error.message = '网络超时'
        break
      case 505:
        error.message = 'http版本不支持该请求'
        break
      default:
        error.message = `连接错误${error.response.status}`
        // ElementPlus.Message.error(error.message);
    }
  } else {
    // 超时处理
    if (JSON.stringify(error).includes('timeout')) {
      Message({
        message: '服务器响应超时，请刷新当前页。错误原因：' + error.message,
        type: 'error',
      })
    }
    error.message = '连接服务器失败' 
  }
  Message({
    message: error.message,
    type: 'error',
  })
  loading.close()
  nProgress.done()
  return Promise.resolve(error.response)
})
// 4.导入文件
export default requests
```

封装一个Javascript模块，进行API接口统一管理，能方便维护

```javascript
//当前这个模块：API进行统一管理
import requests from "./request";

//三级联动接口：/api/product/getBaseCategoryList   GET    没有任何参数
export const reqCategoryList = () => {
    return requests({
        url: '/product/getBaseCategoryList', //因为配置了baseURL,所以/api可以省略
        method: 'get'
    })
}
```





# 二、Promise

ES6原生提供了 Promise 对象。所谓 Promise，就是 Node 中的一个对象，用来传递异步操作的消息。

#### Promise 的特点

1. 对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：Pending、Fulfilled 和 Rejected。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，他的英语意思就是【承诺】，表示其他手段无法改变。
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise 对象的状态改变，只有两种可能：从 Pending 变为 Fulfilled 和从 Pending 变为 Rejected。只要这两种情况发生，状态就凝固了，不会再变，会一直保持这个结果。就算改变已经发生了，你在对 Promise 对象添加回调函数，也会立即得到这个结果，这与实践（Event）完全不同，事件的特点是：如果你错过了它，再去监听，是得不到结果的。

> 注意：Promise本身是同步执行的，但是我们通常会在其中来处理异步操作



一个 Promise 必然处于以下几种状态之一：

- **待定（pending）**: 初始状态，既没有被兑现，也没有被拒绝。
- **已兑现（fulfilled）**: 意味着操作成功完成。
- **已拒绝（rejected）**: 意味着操作失败。



#### 创建一个 Promise

```javascript
let promise = new Promise(function (resolve, reject) {
  	resolve() // 操作成功执行的函数
 		reject() // 操作失败执行的函数
 		// 这个两个函数将会改变 PromiseState 状态和 PromiseResult 的值
 		// 两个函数只能执行一个，因为状态被改变后面的将不会生效
    
  	// 例如：
  	setTimeout(function () {
        console.log('执行完成');
        resolve('ok了');
    }, 1500)
})

promise.then((resolve)=>{
	console.log(resolve)
},(reject)=>{
	// 失败后执行的方法
})
console.log(3)
```

按照标准来讲，resolve 是将 Promise 的状态置为 fullfiled，reject 是将 Promise 的状态置为 rejected。



#### 链式操作

```javascript
function runAsync1(){
    var promise = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务1执行完成');
            resolve('随便什么数据1');
        }, 1000);
    });
    return promise;
}
function runAsync2(){
    var promise = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务2执行完成');
            resolve('随便什么数据2');
        }, 2000);
    });
    return promise;
}
function runAsync3(){
    var promise = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务3执行完成');
            resolve('随便什么数据3');
        }, 2000);
    });
    return promise;
}
runAsync1()
    .then(function (data) {
        console.log(data);
        return runAsync2();
    })
    .then(function (data) {
        console.log(data);
        return runAsync3();
    })
    .then(function (data) {
        console.log(data);
    });
```

这段代码运行的结果是：

```
异步任务1执行完成
随便什么数据1
异步任务2执行完成
随便什么数据2
异步任务3执行完成
随便什么数据3
```



# 三、async/await

#### 概念

async/await 是 ES7 引入的新语法，可以更方便的进行异步操作。

- async 关键字写在函数前面，此函数的返回值是 Promise 实例对象，表示一个函数是异步的。
- await 关键字只能用于 async 函数中异步操作前，只有当该异步操作完成后，再向下执行。await 后面可以直接跟一个 Promise 实例对象，可以获取Promise中返回的内容（resolve或reject的参数），且取到值后语句才会往下执行。

作用：await 会阻塞 async 函数的执行, 让代码可读性更高。await 只会等待成功的结果, 失败了会报错, 报错需要通过 .catch() 方法处理



> 注意：async 和 await是一对关键字，必须要成对使用才有效果。



#### 基础用法

简单的 async/await 基础用法：

```javascript
// async 作为一个关键字放到函数前面
async function getUser() {
  try {
    // await关键字只能在使用async定义的函数中使用
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```



async 函数处理多个异步函数

```javascript
async function queryData() {
// 添加await之后 当前的await 返回结果之后才会执行后面的代码   
      
	let info = await axios.get('async1');
	// 让异步代码看起来、表现起来更像同步代码
	let ret = await axios.get('async2?info=' + info.data);
  
  return ret.data;
}
queryData.then(ret=>{
	console.log(ret)
})
```

















