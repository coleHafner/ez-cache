# ez-cache

This is a node package for caching api responses. 

### Installation
```
npm i ez-cache --save
```

### Usage
```
const cache = require('ez-cache')(
   path, // directory for cache files. defaults to './cache'
   lifetime, // seconds until expiration. defaults to 3600 (1 hour)
   encoding // encoding for cache files. defaults to 'utf8'
);

callEndpoint()
  .then(data => {
    
  });

function callEndpoint() {
   const url = 'https://example.com/api/endpoint';
   const cacheFile = cache.getFilePath(url);

   // check cache. Checks to see if file exists and if not expired.
   if (cache.exists(cacheFile)) {
     return cache.get(cacheFile);
   }
   
   // call to api
   rp.get(url)
      .then(reply => {
         // can pass 'true' as third arg to make the file never expire
         cache.set(cacheFile, reply) 
            .then(contentWrittenToFile => {
               console.log('content', contentWrittenToFile);
            });
            
         return reply;
      });
}
```

### Options
The following options are for the constructor function. 
```
/**
 * @param   string    path      path to the cache files. Defaults to './cache'. No trailing slash.
 * @param   int       lifetime  number of seconds a file is valid for. Defaults to 3600 seconds. (1 hour). 0 = infinite
 * @param   string    encoding  encoding for writing the files. Defaults to 'utf8'
 */
```
