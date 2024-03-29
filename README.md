# traffic-manager
This is a nodejs module available through the npm registry. Installation is done using npm install command.
This is used as an express middleware.

**It is dependent on cookie-parser middleware. 
Use cookie-parser middleware before adding this middleware.
 (cookie parser middleware is used to check if variant cookie is present or not).**

If this middleware is enabled, it adds variant cookies to each incoming request and to headers which can be later used to identify which variant the user is,
and can be used to serve a different page.
This cookie can be used to split the traffic at load balancer as well.
When added to headers, it helps to take a decision in downstream micro services.

## Installation
$npm install traffic-manager

## API
const trafficManager = require('traffic-manager');

### traficManager(configuration)
If configuration is not passed default config is used.
The default config is;
```javascript 
{
    enabled: true,
    cookieName: 'variant',
    maxUsers: 100,
    splitTraffic: {
      ratio: [
        { name: 'variantA', percentage: 50 },
        { name: 'variantB', percentage: 50 },
      ],
    },
    cookieAttributes: {
      httpOnly: true,
      secure: true,
      maxAge: 86400000,
    },
}
```
### configuration
`traffic-manager` accepts these properties in the configuration object.
Any property can be overridden, by passing an object with the overridden properties.
e.g.
```javascript 
trafficManager({
  enabled: true,
  cookieName: 'template',
  splitTraffic: {
      ratio: [
        { name: 'templateA', percentage: 30 },
        { name: 'templateB', percentage: 20 },
        { name: 'templateC', percentage: 50 },
      ],
    },
})
```
#### enabled
Accepts a boolean.
true: traffic manager is enabled and drops variant cookies and adds new headers.
false: traffic manager is disabled and removes variant cookies. 

To clear variant cookies;
trafficManager({enabled: false})

#### cookieName
This the name of the cookie that would be dropped. A header with the same name is added to req.headers.

#### maxUsers
If maxUsers is 100 and split ratio is 50:50; Then for first 100 incoming requests, randomly 50 requests would receive variantA cookie and the other 50 requests
would receive variantB cookie. For next 100 users, it again randomly splits the incoming traffic.

#### ratio
ratio is an array of objects.

name: the cookie value 
percentage: percentage of requests that would receive this cookie

#### cookieAttributes
These are cookie attributes and directly passed to res.cookie() method.
  
  

