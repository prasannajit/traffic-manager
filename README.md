# traffic-manager
This is a nodejs module available through the npm registry. Installation is done using npm install command.
This is used as an express middleware.
**It is dependent on cookie-parser middleware (to detect if variant cookie is present or not. Based on that it decides to add cookie or delete cookie).**
If this middleware is enabled, it adds variant cookies to each incoming request and to headers which can be later used to identify which variant the user is,
and can be used to serve a differnet page.
This cookie can be used to split the traffic at loadbalancer as well.
When added to headers, this helps to make a decision in downstream micro services.

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

#### enabled
Accepts a boolean.
true: traffic manager is enabled and drops variant cookies and adds new headers.
false: traffic manager is disabled and removes variant cookies. 

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
  
  

