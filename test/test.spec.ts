import Parse from '../src/main';
import { describe } from 'mocha';
import { assert,expect } from 'chai';

describe('ml2md', () => {
  it('signal', () => {
    Parse('<h1>Hello</h1>', { CustomerSignal: true })
  });
  it('br', () => {
    assert.equal(
      Parse('<br>'),
      `

`
    );
  });
  it('h{number}', () => {
    assert.equal(Parse('<h1>Hello</h1>'), '# Hello');
    assert.equal(Parse('<h2>Hello</h2>'), '## Hello');
    assert.equal(Parse('<h3>Hello</h3>'), '### Hello');
    assert.equal(Parse('<h4>Hello</h4>'), '#### Hello');
    assert.equal(Parse('<h5>Hello</h5>'), '#### Hello');
    assert.equal(Parse('<h6>Hello</h6>'), '#### Hello');
  });

  it('ol-li', () => {
    assert.equal(
      Parse(`<ol><li>a</li><li>b</li><li>c</li></ol>`),
      `
1. a
2. b
3. c

`);
  });

  it('ul-li', () => {
    assert.equal(
      Parse(`<ul><li>a</li><li>b</li><li>c</li></ul>`),
      `
- a
- b
- c

`);
  });

  it('div', () => {
    assert.equal(
      Parse('<div>Hello</div>'),
      '\nHello\n'
    );
  });

  it('img', () => {
    assert.equal(
      Parse('<img alt="avatar" src="./avatar.gif"/>'),
      '![avatar](./avatar.gif)'
    );
  });

  it('a-link', () => {
    assert.equal(
      Parse('<a href="../page/1">click here</a>'),
      '[click here](../page/1)'
    );
  });

  it('strong', () => {
    assert.equal(
      Parse('<strong>st</strong><span>sp</span><b>b</b>'),
      ' **st**  **sp**  **b** '
    );
  });

  it('blockquote', () => {
    assert.equal(
      Parse('<blockquote>Hello</blockquote>'),
      `

> Hello

`
    );
  });

  it('block-code', () => {
    assert.equal(
      Parse('<pre><code>let a = 1;\na++;</code></pre>'),
      `
\`\`\`javascript
let a = 1;
a++;
\`\`\`
`
    );
  });

  it('inline-code', () => {
    assert.equal(
      Parse('<code>focus</code>'),
      '`focus`'
    );
  });

  it('table', () => {
    assert.equal(
      Parse('<table><thead><tr><th>name</th><th>age</th></tr></thead><tbody><tr><td>Tom</td><td>50</td></tr></tbody></table>'),
      `
| name | age |
|  --- | --- |
| Tom | 50 |
`);
  });
  it('invalid', () => {
    assert.equal(
      Parse('<a<<>'),
      ''
    );
  });
});