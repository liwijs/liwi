import { strictEqual } from 'assert';

suite('test hello server', () => {
  const fixture = window.fixture;

  suiteSetup((done) => {
    fixture.setBase('test/browser/fixtures');
    fixture.load('hello-world.html');
    System.import('js/index.js')
      .then((main) => main.default())
      .then(() => done());
  });

  test('hello without name', () => {
    const helloName = fixture.el.querySelector('.hello-name');
    strictEqual(helloName.textContent, 'Hello World!');
  });

  test('hello with name changed', () => {
    const helloName = fixture.el.querySelector('.hello-name');
    const input = fixture.el.querySelector('.hello-component input');
    strictEqual(input.value, '');
    input.value = 'Chris';
    strictEqual(input.value, 'Chris');
    input.dispatchEvent(
      new window.KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        shiftKey: true,
      }),
    );
    strictEqual(helloName.textContent, 'Hello Chris!');
  });
});
