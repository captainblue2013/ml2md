const fs = require('fs');

const ML2MD = require(__dirname+'/../main');
const content = fs.readFileSync(__dirname+'/index.html').toString();


fs.writeFileSync(__dirname+'/index.md', ML2MD(content));
