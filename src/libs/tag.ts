import { EOL } from 'os';
import { Dict } from '@mohism/utils';
import { DomElement } from 'domhandler';

const Signal: Dict<number | boolean> = {
  OL_INDEX: 1,
  CODE_START: false,
  TR_INDEX: 1,
};

export const setSignal = (key: string, value: number | boolean) => {
  Signal[key] = value;
};

export const getSignal = (key: string): number | boolean => {
  return Signal[key];
};

export const start = (tag: DomElement): string => {
  switch (tag.name) {
  case 'h1':
    return '# ';
  case 'h2':
    return '## ';
  case 'h3':
    return '### ';
  case 'h4':
  case 'h5':
  case 'h6':
    return '#### ';
  case 'ul':
  case 'ol':
    Signal.OL_INDEX = 1;
    return `${EOL}`;
  case 'p':
  case 'div':
    return `${EOL}`;
  case 'br':
    return EOL;
  case 'img':
    return `![${(tag.attribs as { [s: string]: string }).alt || ''}](${Signal.IMG_PREFIX || ''}${(tag.attribs as { [s: string]: string }).src || (tag.attribs as { [s: string]: string })['data-original-src']}`;
  case 'a':
    return '[';
  case 'li':
    if ((tag.parent as DomElement).name === 'ul') {
      return '- ';
    } else {
      return `${(Signal.OL_INDEX as number)++}. `;
    }
  case 'strong':
  case 'b':
  case 'span':
    return ' **';
  case 'blockquote':
    return `${EOL}${EOL}> `;
  case 'pre':
    Signal.CODE_START = true;
    return `${EOL}\`\`\`javascript${EOL}`;
  case 'code':
    if (Signal.CODE_START) {
      return '';
    }
    return '`';
  case 'table':
    Signal.TR_INDEX = 1;
    return `${EOL}`;
  case 'tr':
    return '|';
  case 'th':
  case 'td':
    return ' ';
  default:
    return '';
  }
};

export const end = (tag: DomElement): string => {
  switch (tag.name) {
  case 'ul':
  case 'ol':
    return EOL;
  case 'p':
  case 'div':
    return `${EOL}`;
  case 'br':
    return EOL;
  case 'img':
    return ')';
  case 'a':
    return `](${(tag.attribs as { [s: string]: string }).href})`;
  case 'li':
    return EOL;
  case 'span':
  case 'strong':
  case 'b':
    return '** ';
  case 'blockquote':
    return `${EOL}${EOL}`;
  case 'pre':
    Signal.CODE_START = false;
    return `${EOL}\`\`\`${EOL}`;
  case 'code':
    if (Signal.CODE_START) {
      return '';
    }
    return '`';
  case 'table':
    return `${EOL}`;
  case 'tr':
    (Signal.TR_INDEX as number)++;
    if (Signal.TR_INDEX === 2) {
      let tds = 0;
      if (tag.children && tag.children.length) {
        tag.children.forEach((c: DomElement) => {
          if (c.type === 'tag' && ['th', 'td'].includes(c.name as string)) {
            tds++;
          }
        });
      }
      return `${EOL}| ${' --- |'.repeat(tds)}${EOL}`;
    }
    return '';
  case 'th':
  case 'td':
    return ' |';
  default:
    return '';
  }
};
