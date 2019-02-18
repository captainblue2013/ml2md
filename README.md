#### Install

> npm i ml2md


#### Usage

```

 const ML2MD = require('ml2md');

 // or other html string
 const content = fs.readFileSync('/path/of/index.html').toString();

 // got markdown 
 ML2MD(content);

```