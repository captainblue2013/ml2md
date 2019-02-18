const Parser = require('html-dom-parser');
const Tag = require('./libs/tag');
const { trim } = require('./libs/func');

class ML2MD {
  constructor(content, options = {}) {
    for(let k in options){
      Tag.setSignal(k, options[k]);
    }
    this.outputs = [];
    let tree = [];
    try {
      tree = Parser(content)
    } catch (e) {
      throw new Error('Invalid ML');
    }
    this.running(tree);
  }

  running(tree) {
    tree.forEach(t => {
      switch (t.type) {
        case 'tag':
          this.outputs.push(Tag.start(t));
          if (t.children && t.children.length > 0) {
            this.running(t.children);
          }
          this.outputs.push(Tag.end(t));
          break;
        case 'text':
          if (Tag.getSignal('CODE_START')) {
            this.outputs.push(`${t.data}`);
          } else {
            this.outputs.push(`${trim(t.data)}`);
          }
          break;
      }
    })
  }

  output() {
    return this.outputs.join('').replace(/[\n]{3,}/g, '\n\n');
  }
}


module.exports = (content, options) => {
  const instance = new ML2MD(content, options);
  return instance.output();
}