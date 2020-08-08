/* global suite, suiteSetup, suiteTeardown, test */
import { node as createDaemon } from 'springbokjs-daemon';
import fetch from 'node-fetch';
import { strictEqual } from 'assert';
import { readFileSync } from 'fs';

const fixtures = {
    'hello-world': readFileSync(`${__dirname}/../fixtures/hello-world.html`)
                        .toString(),
};

function comparableContent(result, fixture) {
    return [
        result,
        fixture,
    ].map(s => (
        s
            .trim()
            .replace(/\r?\n\s*/g, '')
            .replace(/ data-react(id|-checksum)="[^"]+"/g, '')
    ));
}

suite('test hello server', () => {
    let daemon = createDaemon([
        '--es_staging',
        'lib/index.js',
        '--port',
        5555,
    ]);

    suiteSetup(done => {
        daemon.start();
        daemon.on('stdout', (data) => {
            let string = data.toString().toLowerCase();
            if (string.indexOf('listening') !== -1) {
                if (done) {
                    done();
                }
            }
        });
    });

    suiteTeardown(() => {
        daemon.stop();
    });

    test('hello without name', () => (
        fetch('http://localhost:5555/')
            .then(res => res.text())
            .then(res => {
                strictEqual(
                    ...comparableContent(res, fixtures['hello-world'])
                );
            })
    ));

    test('hello with name', () => (
        fetch('http://localhost:5555/?name=Chris')
            .then(res => res.text())
            .then(res => {
                strictEqual(
                    ...comparableContent(
                        res,
                        fixtures['hello-world']
                            .replace(/Hello World!/g, 'Hello Chris!')
                            .replace('{"name":""}', '{"name":"Chris"}')
                            .replace(
                                'type="text" value=""',
                                'type="text" value="Chris"'
                            )
                    )
                );
            })
    ));
});
