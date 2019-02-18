const fs = require('fs');

const ML2MD = require('../main');
const content = fs.readFileSync('./index.html').toString();


fs.writeFileSync('./index.md', ML2MD(content));
