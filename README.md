<h3 align="center">
  liwi-monorepo
</h3>

<p align="center">
  db abstraction
</p>

<h1>Packages</h1>

This repository is a monorepo that we manage using [Lerna](https://github.com/lerna/lerna).

| Package                                                                     | Version                                                                                                                                                                | Description                                        |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [extended-json](packages/extended-json)                                     | <a href="https://npmjs.org/package/extended-json"><img src="https://img.shields.io/npm/v/extended-json.svg?style=flat-square"></a>                                     | extended json with date using reviver              |
| [liwi](packages/liwi)                                                       | <a href="https://npmjs.org/package/liwi"><img src="https://img.shields.io/npm/v/liwi.svg?style=flat-square"></a>                                                       | db abstraction                                     |
| [liwi-mongo](packages/liwi-mongo)                                           | <a href="https://npmjs.org/package/liwi-mongo"><img src="https://img.shields.io/npm/v/liwi-mongo.svg?style=flat-square"></a>                                           | mongo implementation for liwi                      |
| [liwi-resources](packages/liwi-resources)                                   | <a href="https://npmjs.org/package/liwi-resources"><img src="https://img.shields.io/npm/v/liwi-resources.svg?style=flat-square"></a>                                   | resources for liwi                                 |
| [liwi-resources-client](packages/liwi-resources-client)                     | <a href="https://npmjs.org/package/liwi-resources-client"><img src="https://img.shields.io/npm/v/liwi-resources-client.svg?style=flat-square"></a>                     | resources client for liwi                          |
| [liwi-resources-direct-client](packages/liwi-resources-direct-client)       | <a href="https://npmjs.org/package/liwi-resources-direct-client"><img src="https://img.shields.io/npm/v/liwi-resources-direct-client.svg?style=flat-square"></a>       | direct client implementation for liwi              |
| [liwi-resources-server](packages/liwi-resources-server)                     | <a href="https://npmjs.org/package/liwi-resources-server"><img src="https://img.shields.io/npm/v/liwi-resources-server.svg?style=flat-square"></a>                     | resources server for liwi                          |
| [liwi-resources-void-client](packages/liwi-resources-void-client)           | <a href="https://npmjs.org/package/liwi-resources-void-client"><img src="https://img.shields.io/npm/v/liwi-resources-void-client.svg?style=flat-square"></a>           | void client implementation for liwi                |
| [liwi-resources-websocket-client](packages/liwi-resources-websocket-client) | <a href="https://npmjs.org/package/liwi-resources-websocket-client"><img src="https://img.shields.io/npm/v/liwi-resources-websocket-client.svg?style=flat-square"></a> | websocket client implementation for liwi           |
| [liwi-resources-websocket-server](packages/liwi-resources-websocket-server) | <a href="https://npmjs.org/package/liwi-resources-websocket-server"><img src="https://img.shields.io/npm/v/liwi-resources-websocket-server.svg?style=flat-square"></a> | liwi resources client implementation for websocket |
| [liwi-store](packages/liwi-store)                                           | <a href="https://npmjs.org/package/liwi-store"><img src="https://img.shields.io/npm/v/liwi-store.svg?style=flat-square"></a>                                           | abstract store used by liwi implementations        |
| [liwi-subscribe-store](packages/liwi-subscribe-store)                       | <a href="https://npmjs.org/package/liwi-subscribe-store"><img src="https://img.shields.io/npm/v/liwi-subscribe-store.svg?style=flat-square"></a>                       | subscribe store proxy                              |
| [liwi-types](packages/liwi-types)                                           | <a href="https://npmjs.org/package/liwi-types"><img src="https://img.shields.io/npm/v/liwi-types.svg?style=flat-square"></a>                                           | typescript types for liwi                          |
| [react-liwi](packages/react-liwi)                                           | <a href="https://npmjs.org/package/react-liwi"><img src="https://img.shields.io/npm/v/react-liwi.svg?style=flat-square"></a>                                           | react with liwi                                    |
| [@todo-example/modules](@todo-example/modules)                              |                                                                                                                                                                        |
| [@todo-example/nextjs](@todo-example/nextjs)                                |                                                                                                                                                                        |
| [@todo-example/remix](@todo-example/remix)                                  |                                                                                                                                                                        |
| [@todo-example/server](@todo-example/server)                                |                                                                                                                                                                        |

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
