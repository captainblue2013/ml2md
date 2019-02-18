const { EOL } = require('os');

const Signal = {
  OL_INDEX: 1,
  CODE_START: false,
};

module.exports = {
  getSignal: key =>{
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
      case 'span':
        return `**`;
      case 'br':
        return EOL;
      case 'img':
        return `)`;
      case 'a':
        return `](${tag.attribs.href})`;
      case 'li':
        return EOL;
      case 'strong':
        return '**';
      case 'blockquote':
        return `${EOL}${EOL}`;
      case 'pre':
        Signal.CODE_START = false;
        return `${EOL}\`\`\`${EOL}`;
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
      case 'p':
      case 'div':
        return `${EOL}`;
      case 'span':
        return `**`;
      case 'br':
        return EOL;
      case 'img':
        return `![${tag.attribs.alt || ''}](${tag.attribs.src}`;
      case 'a':
        return `[`;

      case 'li':
        if (tag.parent.name === 'ul') {
          return '- ';
        } else {

          return `${Signal.OL_INDEX++}. `;
        }
      case 'strong':
        return '**';
      case 'blockquote':
        return `${EOL}${EOL}> `;
      case 'pre':
        Signal.CODE_START = true;
        return `${EOL}\`\`\`${EOL}`;
      case 'code':
        return ''
      default:
        return '';
    }
  }
}