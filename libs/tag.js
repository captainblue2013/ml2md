const { EOL } = require('os');

const Signal = {
  OL_INDEX: 1,
  CODE_START: false,
  TR_INDEX: 1,
};

module.exports = {
  setSignal: (key, value) => {
    Signal[key] = value;
    return;
  },
  getSignal: key => {
    return Signal[key];
  },
  end: tag => {
    switch (tag.name) {
      case 'ul':
      case 'ol':
        return EOL + '<!-- -->' + EOL;
      case 'p':
      case 'div':
        return `${EOL}`;
      case 'br':
        return EOL;
      case 'img':
        return `)`;
      case 'a':
        return `](${tag.attribs.href})`;
      case 'li':
        return EOL;
      case 'span':
      case 'strong':
      case 'b':
        return '**';
      case 'blockquote':
        return `${EOL}${EOL}`;
      case 'pre':
        Signal.CODE_START = false;
        return `${EOL}\`\`\`${EOL}`;
      case 'table':
        return `${EOL}`;
      case 'tr':
        Signal.TR_INDEX++;
        if (Signal.TR_INDEX === 2) {
          let tds = 0;
          if (tag.children && tag.children.length) {
            tag.children.forEach(c => {
              if (c.type === 'tag' && ['th', 'td'].includes(c.name)) {
                tds++;
              }
            })
          }
          return `${EOL}| ${' --- |'.repeat(tds)}${EOL}`
        }
        return ``;
      case 'th':
      case 'td':
        return ' |'
      default:
        return '';
    }
  },
  start: tag => {
    switch (tag.name) {
      case 'h1':
        return '#';
      case 'h2':
        return '##';
      case 'h3':
        return '###';
      case 'h4':
      case 'h5':
      case 'h6':
        return '####';

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
        return `![${tag.attribs.alt || ''}](${Signal.IMG_PREFIX || ''}${tag.attribs.src || tag.attribs['data-original-src']}`;
      case 'a':
        return `[`;

      case 'li':
        if (tag.parent.name === 'ul') {
          return '- ';
        } else {

          return `${Signal.OL_INDEX++}. `;
        }
      case 'strong':
      case 'b':
      case 'span':
        return '**';
      case 'blockquote':
        return `${EOL}${EOL}> `;
      case 'pre':
        Signal.CODE_START = true;
        return `${EOL}\`\`\`${EOL}`;
      case 'code':
        return ''
      case 'table':
        Signal.TR_INDEX = 1;
        return `${EOL}`;
      case 'tr':
        return `|`;
      case 'th':
      case 'td':
        return ' '
      default:
        return '';
    }
  }
}