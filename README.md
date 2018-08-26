<h3 align="center">
  liwi
</h3>

<p align="center">
  db abstraction
</p>

<h1>Packages</h1>

This repository is a monorepo that we manage using [Lerna](https://github.com/lerna/lerna).

| Package | Version | Description |
|---------|---------|-------------|
| [extended-json](/packages/extended-json) | <a href="https://npmjs.org/package/extended-json"><img src="https://img.shields.io/npm/v/extended-json.svg?style=flat-square"></a> | extended json with date using reviver
| [liwi](/packages/liwi) | <a href="https://npmjs.org/package/liwi"><img src="https://img.shields.io/npm/v/liwi.svg?style=flat-square"></a> | db abstraction
| [liwi-mongo](/packages/liwi-mongo) | <a href="https://npmjs.org/package/liwi-mongo"><img src="https://img.shields.io/npm/v/liwi-mongo.svg?style=flat-square"></a> | mongo implementation for liwi
| [liwi-react-redux](/packages/liwi-react-redux) | <a href="https://npmjs.org/package/liwi-react-redux"><img src="https://img.shields.io/npm/v/liwi-react-redux.svg?style=flat-square"></a> | react-redux with liwi
| [liwi-rest](/packages/liwi-rest) | <a href="https://npmjs.org/package/liwi-rest"><img src="https://img.shields.io/npm/v/liwi-rest.svg?style=flat-square"></a> | rest service for liwi
| [liwi-rest-websocket](/packages/liwi-rest-websocket) | <a href="https://npmjs.org/package/liwi-rest-websocket"><img src="https://img.shields.io/npm/v/liwi-rest-websocket.svg?style=flat-square"></a> | liwi implementation for websocket
| [liwi-rethinkdb](/packages/liwi-rethinkdb) | <a href="https://npmjs.org/package/liwi-rethinkdb"><img src="https://img.shields.io/npm/v/liwi-rethinkdb.svg?style=flat-square"></a> | rethinkdb implementation for liwi
| [liwi-store](/packages/liwi-store) | <a href="https://npmjs.org/package/liwi-store"><img src="https://img.shields.io/npm/v/liwi-store.svg?style=flat-square"></a> | abstract store used by liwi implementations
| [liwi-types](/packages/liwi-types) | <a href="https://npmjs.org/package/liwi-types"><img src="https://img.shields.io/npm/v/liwi-types.svg?style=flat-square"></a> | typescript types for liwi
| [liwi-websocket-client](/packages/liwi-websocket-client) | <a href="https://npmjs.org/package/liwi-websocket-client"><img src="https://img.shields.io/npm/v/liwi-websocket-client.svg?style=flat-square"></a> | websocket client implementation for liwi

## Install

```sh
npm install --save liwi
```

## Usage

```js
import liwi from 'liwi';

console.log(liwi);
```

[npm-image]: https://img.shields.io/npm/v/liwi.svg?style=flat-square
[npm-url]: https://npmjs.org/package/liwi
[daviddm-image]: https://david-dm.org/liwijs/liwi.svg?style=flat-square
[daviddm-url]: https://david-dm.org/liwijs/liwi
[dependencyci-image]: https://dependencyci.com/github/liwijs/liwi/badge?style=flat-square
[dependencyci-url]: https://dependencyci.com/github/liwijs/liwi
[circleci-status-image]: https://img.shields.io/circleci/project/liwijs/liwi/master.svg?style=flat-square
[circleci-status-url]: https://circleci.com/gh/liwijs/liwi
[travisci-status-image]: https://img.shields.io/travis/liwijs/liwi/master.svg?style=flat-square
[travisci-status-url]: https://travis-ci.org/liwijs/liwi
[coverage-image]: https://img.shields.io/codecov/c/github/liwijs/liwi/master.svg?style=flat-square
[coverage-url]: https://codecov.io/gh/liwijs/liwi
[docs-coverage-url]: https://liwijs.github.io/liwi/coverage/lcov-report/
