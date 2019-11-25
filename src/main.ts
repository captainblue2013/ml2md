import Parser from 'html-dom-parser';
import { setSignal, start, end, getSignal } from './libs/tag';
import { Dict } from '@mohism/utils';
import { fix, trim } from './libs/func';
import { DomElement } from 'domhandler';

class ML2MD {
  outputs: Array<string>;
  constructor(content: string, options: Dict<number | boolean> = {}) {
    for (let k in options) {
      setSignal(k, options[k]);
    }
    this.outputs = [];
    this.running(Parser(fix(content)));
  }

  running(tree: Array<DomElement>) {
    tree.forEach((t: DomElement) => {
      switch (t.type) {
        case 'tag':
          this.outputs.push(start(t));
          if (t.children && t.children.length > 0) {
            this.running(t.children);
          }
          this.outputs.push(end(t));
          break;
        case 'text':
          if (getSignal('CODE_START')) {
            this.outputs.push(`${t.data}`);
          } else {
            this.outputs.push(`${trim(t.data)}`);
          }
          break;
      }
    })
  }

  output(): string {
    return this.outputs.join('').replace(/[\n]{3,}/g, '\n\n');
  }
}

export default (content: string, options: Dict<number | boolean> = {}): string => {
  const instance = new ML2MD(content, options);
  return instance.output();
}
