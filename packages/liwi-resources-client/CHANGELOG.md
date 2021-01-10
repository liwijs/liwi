# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [8.0.0](https://github.com/liwijs/liwi/compare/v7.6.2...v8.0.0) (2021-01-10)


### Code Refactoring

* update dev dependencies ([#12](https://github.com/liwijs/liwi/issues/12)) ([c75bfdc](https://github.com/liwijs/liwi/commit/c75bfdcbe5404f5e09679a336edf4bf12b95c57a))


### BREAKING CHANGES

* drop node 10





# [7.5.0](https://github.com/liwijs/liwi/compare/v7.4.3...v7.5.0) (2020-08-15)


### Features

* dont try to reconnect when visibility is hidden ([2705a33](https://github.com/liwijs/liwi/commit/2705a33))





# [7.4.0](https://github.com/liwijs/liwi/compare/v7.3.0...v7.4.0) (2020-08-09)


### Features

* prepare liwi-resources-direct-client ([8b3f681](https://github.com/liwijs/liwi/commit/8b3f681))





## [7.2.3](https://github.com/liwijs/liwi/compare/v7.2.2...v7.2.3) (2020-08-08)


### Bug Fixes

* better type ServiceInterface ([34b57b1](https://github.com/liwijs/liwi/commit/34b57b1))





## [7.2.2](https://github.com/liwijs/liwi/compare/v7.2.1...v7.2.2) (2020-08-08)


### Bug Fixes

* missing undefined in ServiceQuery ([b88ca69](https://github.com/liwijs/liwi/commit/b88ca69))





## [7.2.1](https://github.com/liwijs/liwi/compare/v7.2.0...v7.2.1) (2020-08-08)


### Bug Fixes

* params type ([bf54f7b](https://github.com/liwijs/liwi/commit/bf54f7b))





# [7.0.0](https://github.com/liwijs/liwi/compare/v0.18.8...v7.0.0) (2020-08-08)


### Bug Fixes

* add missing document.removeEventListener for visibilitychange ([3277950](https://github.com/liwijs/liwi/commit/3277950))
* improve ServiceResource definitions ([92a1c3b](https://github.com/liwijs/liwi/commit/92a1c3b))
* queries and operations should be a record, not an array ([b0a89da](https://github.com/liwijs/liwi/commit/b0a89da))
* rename Query to ClientQuery ([e330a62](https://github.com/liwijs/liwi/commit/e330a62))
* send value array ([7f012c2](https://github.com/liwijs/liwi/commit/7f012c2))
* unsubscribe and add subscribeHook ([d6e3d5a](https://github.com/liwijs/liwi/commit/d6e3d5a))


### Features

* add criteria un findByKey and deleteByKey ([2adfaba](https://github.com/liwijs/liwi/commit/2adfaba))
* add more info in logger ([76bacf1](https://github.com/liwijs/liwi/commit/76bacf1))
* add optional critieria in partialUpdateByKey ([6bd5578](https://github.com/liwijs/liwi/commit/6bd5578))
* add transformer ([76861ae](https://github.com/liwijs/liwi/commit/76861ae))
* allow client createQuery to not pass params ([be9e4a2](https://github.com/liwijs/liwi/commit/be9e4a2))
* allow ResourcesClientService to have optional second generic ([c0a8d8c](https://github.com/liwijs/liwi/commit/c0a8d8c))
* big refactor ([#5](https://github.com/liwijs/liwi/issues/5)) ([a4629c4](https://github.com/liwijs/liwi/commit/a4629c4))
* drop node 8 ([2fb6528](https://github.com/liwijs/liwi/commit/2fb6528))
* queries as fn with result ([1a1abcb](https://github.com/liwijs/liwi/commit/1a1abcb))
* queryInfo in applyChanges and liwi-mongo ([ecfdc3f](https://github.com/liwijs/liwi/commit/ecfdc3f))
* rename createResourceClient to createResourceClientService ([0118f85](https://github.com/liwijs/liwi/commit/0118f85))
* resource operations ([9ddd3b7](https://github.com/liwijs/liwi/commit/9ddd3b7))
* split liwi-resources into server and client ([df73bf9](https://github.com/liwijs/liwi/commit/df73bf9))
* update deps and improve typescript dev ([b42eefb](https://github.com/liwijs/liwi/commit/b42eefb))


### BREAKING CHANGES

* drop node 8
* added Transformer, query model is now value in query description
* multiple typescript typings change





# [4.3.0](https://github.com/liwijs/liwi/compare/liwi-resources-client@4.2.3...liwi-resources-client@4.3.0) (2019-10-12)


### Features

* add criteria un findByKey and deleteByKey ([2adfaba](https://github.com/liwijs/liwi/commit/2adfaba))





## [4.2.3](https://github.com/liwijs/liwi/compare/liwi-resources-client@4.2.2...liwi-resources-client@4.2.3) (2019-09-13)

**Note:** Version bump only for package liwi-resources-client





## [4.2.2](https://github.com/liwijs/liwi/compare/liwi-resources-client@4.2.1...liwi-resources-client@4.2.2) (2019-09-13)

**Note:** Version bump only for package liwi-resources-client





## [4.2.1](https://github.com/liwijs/liwi/compare/liwi-resources-client@4.2.0...liwi-resources-client@4.2.1) (2019-09-08)


### Bug Fixes

* add missing document.removeEventListener for visibilitychange ([3277950](https://github.com/liwijs/liwi/commit/3277950))
* improve ServiceResource definitions ([92a1c3b](https://github.com/liwijs/liwi/commit/92a1c3b))





# [4.2.0](https://github.com/liwijs/liwi/compare/liwi-resources-client@4.1.0...liwi-resources-client@4.2.0) (2019-05-05)


### Features

* queryInfo in applyChanges and liwi-mongo ([ecfdc3f](https://github.com/liwijs/liwi/commit/ecfdc3f))





# [4.1.0](https://github.com/liwijs/liwi/compare/liwi-resources-client@4.0.1...liwi-resources-client@4.1.0) (2019-04-19)


### Features

* add optional critieria in partialUpdateByKey ([6bd5578](https://github.com/liwijs/liwi/commit/6bd5578))





## [4.0.1](https://github.com/liwijs/liwi/compare/liwi-resources-client@4.0.0...liwi-resources-client@4.0.1) (2019-02-17)

**Note:** Version bump only for package liwi-resources-client





# [4.0.0](https://github.com/liwijs/liwi/compare/liwi-resources-client@3.4.0...liwi-resources-client@4.0.0) (2019-02-17)


### Features

* add transformer ([76861ae](https://github.com/liwijs/liwi/commit/76861ae))


### BREAKING CHANGES

* added Transformer, query model is now value in query description





# [3.4.0](https://github.com/liwijs/liwi/compare/liwi-resources-client@3.3.2...liwi-resources-client@3.4.0) (2019-02-16)


### Features

* add more info in logger ([76bacf1](https://github.com/liwijs/liwi/commit/76bacf1))





## [3.3.2](https://github.com/liwijs/liwi/compare/liwi-resources-client@3.3.1...liwi-resources-client@3.3.2) (2019-02-16)


### Bug Fixes

* unsubscribe and add subscribeHook ([d6e3d5a](https://github.com/liwijs/liwi/commit/d6e3d5a))





## [3.3.1](https://github.com/liwijs/liwi/compare/liwi-resources-client@3.3.0...liwi-resources-client@3.3.1) (2019-02-11)

**Note:** Version bump only for package liwi-resources-client





# [3.3.0](https://github.com/liwijs/liwi/compare/liwi-resources-client@3.2.2...liwi-resources-client@3.3.0) (2019-02-10)


### Features

* rename createResourceClient to createResourceClientService ([0118f85](https://github.com/liwijs/liwi/commit/0118f85))





## [3.2.2](https://github.com/liwijs/liwi/compare/liwi-resources-client@3.2.1...liwi-resources-client@3.2.2) (2019-02-09)


### Bug Fixes

* send value array ([7f012c2](https://github.com/liwijs/liwi/commit/7f012c2))





## [3.2.1](https://github.com/liwijs/liwi/compare/liwi-resources-client@3.2.0...liwi-resources-client@3.2.1) (2019-02-09)


### Bug Fixes

* queries and operations should be a record, not an array ([b0a89da](https://github.com/liwijs/liwi/commit/b0a89da))
* rename Query to ClientQuery ([e330a62](https://github.com/liwijs/liwi/commit/e330a62))





# [3.2.0](https://github.com/liwijs/liwi/compare/liwi-resources-client@3.1.0...liwi-resources-client@3.2.0) (2019-02-09)


### Features

* allow ResourcesClientService to have optional second generic ([c0a8d8c](https://github.com/liwijs/liwi/commit/c0a8d8c))





# [3.1.0](https://github.com/liwijs/liwi/compare/liwi-resources-client@3.0.0...liwi-resources-client@3.1.0) (2019-02-09)


### Features

* allow client createQuery to not pass params ([be9e4a2](https://github.com/liwijs/liwi/commit/be9e4a2))





# [3.0.0](https://github.com/liwijs/liwi/compare/liwi-resources-client@2.2.0...liwi-resources-client@3.0.0) (2019-02-09)


### Features

* queries as fn with result ([1a1abcb](https://github.com/liwijs/liwi/commit/1a1abcb))
* resource operations ([9ddd3b7](https://github.com/liwijs/liwi/commit/9ddd3b7))


### BREAKING CHANGES

* multiple typescript typings change





# 2.2.0 (2019-02-05)


### Features

* split liwi-resources into server and client ([df73bf9](https://github.com/liwijs/liwi/commit/df73bf9))
