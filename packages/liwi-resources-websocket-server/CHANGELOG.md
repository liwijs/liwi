# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [8.1.0](https://github.com/liwijs/liwi/compare/v8.0.4...v8.1.0) (2021-03-28)


### Bug Fixes

* remove unused @types/socket.io dependency ([af453d1](https://github.com/liwijs/liwi/commit/af453d1bd7d66ce1337e7f4e5ae1b2b7a04174a8))
* update optional dependencies in liwi-resources-websocket-server ([3b3ab8f](https://github.com/liwijs/liwi/commit/3b3ab8f04020d60727e0be78474e33c76497a1ee))


### Features

* update nightingale ([ede1ef6](https://github.com/liwijs/liwi/commit/ede1ef66f10f3b631bcbf09687faed56e62f47ca))
* update ws ([d57d8fe](https://github.com/liwijs/liwi/commit/d57d8fe7cb6ab1f89db0c23131d6f026afbe848f))





## [8.0.4](https://github.com/liwijs/liwi/compare/v8.0.3...v8.0.4) (2021-01-18)


### Bug Fixes

* update pob-babel for better support ([4cb684e](https://github.com/liwijs/liwi/commit/4cb684e2abc21ffb0d8b0e738da36c0f3c5ea1c2))





## [8.0.3](https://github.com/liwijs/liwi/compare/v8.0.2...v8.0.3) (2021-01-18)


### Bug Fixes

* import browser path ([e42b0b8](https://github.com/liwijs/liwi/commit/e42b0b817f6c4ce56a09f398b58aadfc520ee0c9))





## [8.0.2](https://github.com/liwijs/liwi/compare/v8.0.1...v8.0.2) (2021-01-18)


### Bug Fixes

* bring back support for webpack 4 ([f2b5583](https://github.com/liwijs/liwi/commit/f2b5583ebfb21c66673b269ed22a9d4a9ffc126d))





## [8.0.1](https://github.com/liwijs/liwi/compare/v8.0.0...v8.0.1) (2021-01-10)

**Note:** Version bump only for package liwi-resources-websocket-server





# [8.0.0](https://github.com/liwijs/liwi/compare/v7.6.2...v8.0.0) (2021-01-10)


### Code Refactoring

* update dev dependencies ([#12](https://github.com/liwijs/liwi/issues/12)) ([c75bfdc](https://github.com/liwijs/liwi/commit/c75bfdcbe5404f5e09679a336edf4bf12b95c57a))


### BREAKING CHANGES

* drop node 10





## [7.4.3](https://github.com/liwijs/liwi/compare/v7.4.2...v7.4.3) (2020-08-14)

**Note:** Version bump only for package liwi-resources-websocket-server





## [7.4.1](https://github.com/liwijs/liwi/compare/v7.4.0...v7.4.1) (2020-08-14)


### Bug Fixes

* handle event subscribe:close without id ([1a82247](https://github.com/liwijs/liwi/commit/1a82247))





# [7.4.0](https://github.com/liwijs/liwi/compare/v7.3.0...v7.4.0) (2020-08-09)


### Features

* prepare liwi-resources-direct-client ([8b3f681](https://github.com/liwijs/liwi/commit/8b3f681))





## [7.2.3](https://github.com/liwijs/liwi/compare/v7.2.2...v7.2.3) (2020-08-08)

**Note:** Version bump only for package liwi-resources-websocket-server





## [7.2.1](https://github.com/liwijs/liwi/compare/v7.2.0...v7.2.1) (2020-08-08)

**Note:** Version bump only for package liwi-resources-websocket-server





# [7.2.0](https://github.com/liwijs/liwi/compare/v7.1.0...v7.2.0) (2020-08-08)

**Note:** Version bump only for package liwi-resources-websocket-server





# [7.1.0](https://github.com/liwijs/liwi/compare/v7.0.0...v7.1.0) (2020-08-08)


### Features

* getAuthenticatedUser can return a promise ([ab06bf3](https://github.com/liwijs/liwi/commit/ab06bf3))





# [7.0.0](https://github.com/liwijs/liwi/compare/v0.18.8...v7.0.0) (2020-08-08)


### Bug Fixes

* build ([d286aff](https://github.com/liwijs/liwi/commit/d286aff))
* encode operation result ([c838894](https://github.com/liwijs/liwi/commit/c838894))
* fixes ([482c388](https://github.com/liwijs/liwi/commit/482c388))
* improve ServiceResource definitions ([92a1c3b](https://github.com/liwijs/liwi/commit/92a1c3b))
* missing callback in unsubscribe ([8ff0fb3](https://github.com/liwijs/liwi/commit/8ff0fb3))
* remove obsolete dependency ([ce61569](https://github.com/liwijs/liwi/commit/ce61569))
* resubscribing did not work correctly ([68b485a](https://github.com/liwijs/liwi/commit/68b485a))
* support namespace ([e677afc](https://github.com/liwijs/liwi/commit/e677afc))
* unsubscribe and add subscribeHook ([d6e3d5a](https://github.com/liwijs/liwi/commit/d6e3d5a))


### Features

* add connected user ([c43685c](https://github.com/liwijs/liwi/commit/c43685c))
* allow query to be returned with a promise ([902944c](https://github.com/liwijs/liwi/commit/902944c))
* allow to get params in subscribe hooks ([49e40cf](https://github.com/liwijs/liwi/commit/49e40cf))
* big refactor ([#5](https://github.com/liwijs/liwi/issues/5)) ([a4629c4](https://github.com/liwijs/liwi/commit/a4629c4))
* drop node 8 ([2fb6528](https://github.com/liwijs/liwi/commit/2fb6528))
* queries as fn with result ([1a1abcb](https://github.com/liwijs/liwi/commit/1a1abcb))
* queryInfo in applyChanges and liwi-mongo ([ecfdc3f](https://github.com/liwijs/liwi/commit/ecfdc3f))
* resource operations ([9ddd3b7](https://github.com/liwijs/liwi/commit/9ddd3b7))
* split liwi-resources into server and client ([df73bf9](https://github.com/liwijs/liwi/commit/df73bf9))
* update deps and improve typescript dev ([b42eefb](https://github.com/liwijs/liwi/commit/b42eefb))


### BREAKING CHANGES

* drop node 8
* multiple typescript typings change





## [3.3.5](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.3.4...liwi-resources-websocket-server@3.3.5) (2019-10-12)

**Note:** Version bump only for package liwi-resources-websocket-server





## [3.3.4](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.3.3...liwi-resources-websocket-server@3.3.4) (2019-09-13)

**Note:** Version bump only for package liwi-resources-websocket-server





## [3.3.3](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.3.2...liwi-resources-websocket-server@3.3.3) (2019-09-13)

**Note:** Version bump only for package liwi-resources-websocket-server





## [3.3.2](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.3.1...liwi-resources-websocket-server@3.3.2) (2019-09-08)


### Bug Fixes

* improve ServiceResource definitions ([92a1c3b](https://github.com/liwijs/liwi/commit/92a1c3b))





## [3.3.1](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.3.0...liwi-resources-websocket-server@3.3.1) (2019-09-01)

**Note:** Version bump only for package liwi-resources-websocket-server





# [3.3.0](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.2.0...liwi-resources-websocket-server@3.3.0) (2019-09-01)


### Features

* allow query to be returned with a promise ([902944c](https://github.com/liwijs/liwi/commit/902944c))





# [3.2.0](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.1.0...liwi-resources-websocket-server@3.2.0) (2019-08-30)


### Features

* allow to get params in subscribe hooks ([49e40cf](https://github.com/liwijs/liwi/commit/49e40cf))





# [3.1.0](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.0.11...liwi-resources-websocket-server@3.1.0) (2019-05-05)


### Features

* queryInfo in applyChanges and liwi-mongo ([ecfdc3f](https://github.com/liwijs/liwi/commit/ecfdc3f))





## [3.0.11](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.0.10...liwi-resources-websocket-server@3.0.11) (2019-04-19)

**Note:** Version bump only for package liwi-resources-websocket-server





## [3.0.10](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.0.9...liwi-resources-websocket-server@3.0.10) (2019-02-24)


### Bug Fixes

* resubscribing did not work correctly ([68b485a](https://github.com/liwijs/liwi/commit/68b485a))





## [3.0.9](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.0.8...liwi-resources-websocket-server@3.0.9) (2019-02-24)


### Bug Fixes

* encode operation result ([c838894](https://github.com/liwijs/liwi/commit/c838894))





## [3.0.8](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.0.7...liwi-resources-websocket-server@3.0.8) (2019-02-20)


### Bug Fixes

* missing callback in unsubscribe ([8ff0fb3](https://github.com/liwijs/liwi/commit/8ff0fb3))





## [3.0.7](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.0.6...liwi-resources-websocket-server@3.0.7) (2019-02-17)

**Note:** Version bump only for package liwi-resources-websocket-server





## [3.0.6](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.0.5...liwi-resources-websocket-server@3.0.6) (2019-02-17)

**Note:** Version bump only for package liwi-resources-websocket-server





## [3.0.5](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.0.4...liwi-resources-websocket-server@3.0.5) (2019-02-16)


### Bug Fixes

* build ([d286aff](https://github.com/liwijs/liwi/commit/d286aff))





## [3.0.4](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.0.3...liwi-resources-websocket-server@3.0.4) (2019-02-16)


### Bug Fixes

* unsubscribe and add subscribeHook ([d6e3d5a](https://github.com/liwijs/liwi/commit/d6e3d5a))





## [3.0.3](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.0.2...liwi-resources-websocket-server@3.0.3) (2019-02-11)


### Bug Fixes

* support namespace ([e677afc](https://github.com/liwijs/liwi/commit/e677afc))





## [3.0.2](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.0.1...liwi-resources-websocket-server@3.0.2) (2019-02-09)

**Note:** Version bump only for package liwi-resources-websocket-server





## [3.0.1](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@3.0.0...liwi-resources-websocket-server@3.0.1) (2019-02-09)

**Note:** Version bump only for package liwi-resources-websocket-server





# [3.0.0](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@2.2.0...liwi-resources-websocket-server@3.0.0) (2019-02-09)


### Bug Fixes

* remove obsolete dependency ([ce61569](https://github.com/liwijs/liwi/commit/ce61569))


### Features

* add connected user ([c43685c](https://github.com/liwijs/liwi/commit/c43685c))
* queries as fn with result ([1a1abcb](https://github.com/liwijs/liwi/commit/1a1abcb))
* resource operations ([9ddd3b7](https://github.com/liwijs/liwi/commit/9ddd3b7))


### BREAKING CHANGES

* multiple typescript typings change





# [2.2.0](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@2.1.2...liwi-resources-websocket-server@2.2.0) (2019-02-05)


### Features

* split liwi-resources into server and client ([df73bf9](https://github.com/liwijs/liwi/commit/df73bf9))





## [2.1.2](https://github.com/liwijs/liwi/compare/liwi-resources-websocket-server@2.1.1...liwi-resources-websocket-server@2.1.2) (2019-02-04)

**Note:** Version bump only for package liwi-resources-websocket-server





## 2.1.1 (2019-01-20)


### Bug Fixes

* fixes ([482c388](https://github.com/liwijs/liwi/commit/482c388))





# [2.1.0](https://github.com/liwijs/liwi/compare/liwi-rest-websocket@2.0.0...liwi-rest-websocket@2.1.0) (2018-11-23)


### Features

* add and export mongo types ([aec6dba](https://github.com/liwijs/liwi/commit/aec6dba))





<a name="2.0.0"></a>
# [2.0.0](https://github.com/liwijs/liwi/compare/liwi-rest-websocket@1.0.0...liwi-rest-websocket@2.0.0) (2018-08-26)


### Code Refactoring

* typescript ([5ec81a1](https://github.com/liwijs/liwi/commit/5ec81a1))


### BREAKING CHANGES

* major rewrite in typescript





<a name="1.0.0"></a>
# 1.0.0 (2018-03-30)


### Code Refactoring

* use lerna ([88b2a3c](https://github.com/liwijs/liwi/commit/88b2a3c))


### BREAKING CHANGES

* liwi package splitted
