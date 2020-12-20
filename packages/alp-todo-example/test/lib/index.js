'use strict';

const _springbokjsDaemon = require('springbokjs-daemon');
const _nodeFetch = require('node-fetch');

const _nodeFetch2 = _interopRequireDefault(_nodeFetch);

const _assert = require('assert');
const _fs = require('fs');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/* global suite, suiteSetup, suiteTeardown, test */

const fixtures = {
  'hello-world': (0, _fs.readFileSync)(
    `${__dirname}/../fixtures/hello-world.html`,
  ).toString(),
};

function comparableContent(result, fixture) {
  return [result, fixture].map((s) =>
    s
      .trim()
      .replace(/\r?\n\s*/g, '')
      .replace(/ data-react(id|-checksum)="[^"]+"/g, ''),
  );
}

suite('test hello server', () => {
  const daemon = (0, _springbokjsDaemon.node)([
    '--es_staging',
    'lib/index.js',
    '--port',
    5555,
  ]);

  suiteSetup((done) => {
    daemon.start();
    daemon.on('stdout', (data) => {
      const string = data.toString().toLowerCase();
      if (string.includes('listening')) {
        if (done) {
          done();
        }
      }
    });
  });

  suiteTeardown(() => {
    daemon.stop();
  });

  test('hello without name', () =>
    (0, _nodeFetch2.default)('http://localhost:5555/')
      .then((res) => res.text())
      .then((res) => {
        (0, _assert.strictEqual)(
          ...comparableContent(res, fixtures['hello-world']),
        );
      }));

  test('hello with name', () =>
    (0, _nodeFetch2.default)('http://localhost:5555/?name=Chris')
      .then((res) => res.text())
      .then((res) => {
        (0, _assert.strictEqual)(
          ...comparableContent(
            res,
            fixtures['hello-world']
              .replace(/Hello World!/g, 'Hello Chris!')
              .replace('{"name":""}', '{"name":"Chris"}')
              .replace('type="text" value=""', 'type="text" value="Chris"'),
          ),
        );
      }));
});
// # sourceMappingURL=index.js.map
