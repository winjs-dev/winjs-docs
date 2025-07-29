# Deployment {#deploy}

If you're doing a simple deployment, you just need to copy the entire dist folder to your CDN or static server. index.html should be your server entry point.

## Frontend Routing and Server Integration

> If you encounter 404 issues when refreshing `https://cdn.com/users/123`, you need to handle this according to this section.

WinJS provides two routing methods you can use: `browserHistory` and `hashHistory`.

You can configure which method to use in `config/config.ts`:

```tsx
export default {
  history: { type: 'hash' }, // default is browser
};
```

`hashHistory` uses URLs like `https://cdn.com/#/users/123`, taking the characters after the hash symbol as the path. `browserHistory` directly uses URLs like `https://cdn.com/users/123`. When using `hashHistory`, the browser always accesses `index.html` in the root directory. When using `browserHistory`, the server needs to be prepared to handle URLs. Handling initial requests like `/` when the application starts should be fine, but when users navigate back and forth and refresh on `/users/123`, the server will receive a request from `/users/123`. At this point, you need to configure the server to handle this URL and return the correct `index.html`, otherwise you'll get a 404 page not found error. If you don't have control over the server side, it's recommended to enable [`exportStatic`](../config/config#exportStatic) in the configuration, so that the compiled `dist` directory will generate an `index.html` for each route, allowing each route to support direct `deeplink` access. We strongly recommend using the default `browserHistory`.

## Deploying to Non-Root Directory

Deploying to a non-root directory is a common requirement, such as deploying to GitHub pages. Let's assume we want to deploy our project to `${host}/admin`. First, we need to configure [base](../config/config/#base) in `config/config.ts`. `base` is the prefix for vue-router. We need to set base to `admin`. If we also need to deploy it to the `/admin` directory, we also need to set [`publicPath`](../config/config#publicpath). After configuration, it looks like this:

```tsx | pure
export default {
  // ... some config
  base: '/admin/',
  publicPath: '/admin/',
};
```

Next, we can access our static files at `${host}/admin`. It's worth noting that the URL path will also be modified in dev mode.

## Deploying to Different Platforms

### Using nginx

As one of the most popular web containers, nginx is quite simple to configure and use. With simple configuration, you can have high performance and high availability. Using nginx for hosting is recommended. Example configuration is as follows:

```nginx configuration
server {
    listen 80;
    # gzip config
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 9;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";

    root /usr/share/nginx/html;

    location / {
        # Used with browserHistory
        try_files $uri $uri/index.html /index.html;

        # If you have resources, recommend using https + http2, combined with on-demand loading for better experience
        # rewrite ^/(.*)$ https://preview.example.com/$1 permanent;

    }
    location /api {
        proxy_pass https://ant-design-pro.netlify.com;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP         $remote_addr;
    }
}

server {
  # If you have resources, recommend using https + http2, combined with on-demand loading for better experience
  listen 443 ssl http2 default_server;

  # Certificate public and private keys
  ssl_certificate /path/to/public.crt;
  ssl_certificate_key /path/to/private.key;

  location / {
    # Used with browserHistory
    try_files $uri $uri/index.html /index.html;
  }
  location /api {
      proxy_pass https://ant-design-pro.netlify.com;
      proxy_set_header   X-Forwarded-Proto $scheme;
      proxy_set_header   Host              $http_host;
      proxy_set_header   X-Real-IP         $remote_addr;
  }
}
```

### Using Spring Boot

Spring Boot is the most widely used Java framework, and it only takes a few simple steps to integrate with WinJS.

First run build:

```
$ npm run build
```

Then copy the compiled files to the `/src/main/resources/static` directory of the Spring Boot project.

Restart the project and visit `http://localhost:8080/` to see the results.

For convenient integration, it's best to use hash routing. If you want to use browserHistory, you can create a controller and add the following code:

```java
@RequestMapping("/api/**")
public ApiResult api(HttpServletRequest request, HttpServletResponse response){
    return apiProxy.proxy(request, response);
}

@RequestMapping(value="/**", method=HTTPMethod.GET)
public String index(){
    return "index"
}
```

### Using Express

Example with [express](http://expressjs.com/):

```
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
```

### Using Egg

Example with [egg](https://eggjs.org/):

```
// controller
exports.index = function* () {
  yield this.render('App.jsx', {
    context: {
      user: this.session.user,
    },
  });
};

// router
app.get('home', '/*', 'home.index');
```

For more about routing, see [WinJS Routing Documentation](./routes).
