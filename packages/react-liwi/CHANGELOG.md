# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.1.3](https://github.com/liwijs/liwi/compare/react-liwi@6.1.2...react-liwi@6.1.3) (2019-10-18)


### Bug Fixes

* useResource without subscribing ([645421d](https://github.com/liwijs/liwi/commit/645421d))





## [6.1.2](https://github.com/liwijs/liwi/compare/react-liwi@6.1.1...react-liwi@6.1.2) (2019-10-12)

**Note:** Version bump only for package react-liwi





## [6.1.1](https://github.com/liwijs/liwi/compare/react-liwi@6.1.0...react-liwi@6.1.1) (2019-09-13)

**Note:** Version bump only for package react-liwi





# [6.1.0](https://github.com/liwijs/liwi/compare/react-liwi@6.0.1...react-liwi@6.1.0) (2019-09-08)


### Features

* **react-liwi:** add subscribeOptions in useResource ([187fdda](https://github.com/liwijs/liwi/commit/187fdda))





## [6.0.1](https://github.com/liwijs/liwi/compare/react-liwi@6.0.0...react-liwi@6.0.1) (2019-09-08)


### Bug Fixes

* add missing document.removeEventListener for visibilitychange ([3277950](https://github.com/liwijs/liwi/commit/3277950))
* improve ServiceResource definitions ([92a1c3b](https://github.com/liwijs/liwi/commit/92a1c3b))





# [6.0.0](https://github.com/liwijs/liwi/compare/react-liwi@5.1.2...react-liwi@6.0.0) (2019-05-05)


### Code Refactoring

* **react-liwi:** remove react components ([6ece729](https://github.com/liwijs/liwi/commit/6ece729))


### Features

* queryInfo in applyChanges and liwi-mongo ([ecfdc3f](https://github.com/liwijs/liwi/commit/ecfdc3f))


### BREAKING CHANGES

* **react-liwi:** use hooks instead of react components





## [5.1.2](https://github.com/liwijs/liwi/compare/react-liwi@5.1.1...react-liwi@5.1.2) (2019-04-19)


### Bug Fixes

* add resultRef, state is always initial ([e91b291](https://github.com/liwijs/liwi/commit/e91b291))





## [5.1.1](https://github.com/liwijs/liwi/compare/react-liwi@5.1.0...react-liwi@5.1.1) (2019-04-19)


### Bug Fixes

* debug log init ([fc28efb](https://github.com/liwijs/liwi/commit/fc28efb))





# [5.1.0](https://github.com/liwijs/liwi/compare/react-liwi@5.0.3...react-liwi@5.1.0) (2019-04-15)


### Features

* add hooks ([906c820](https://github.com/liwijs/liwi/commit/906c820))





## [5.0.3](https://github.com/liwijs/liwi/compare/react-liwi@5.0.2...react-liwi@5.0.3) (2019-02-24)


### Bug Fixes

* build ([ac2ee64](https://github.com/liwijs/liwi/commit/ac2ee64))





## [5.0.2](https://github.com/liwijs/liwi/compare/react-liwi@5.0.1...react-liwi@5.0.2) (2019-02-24)


### Bug Fixes

* resubscribing did not work correctly ([68b485a](https://github.com/liwijs/liwi/commit/68b485a))





## [5.0.1](https://github.com/liwijs/liwi/compare/react-liwi@5.0.0...react-liwi@5.0.1) (2019-02-17)

**Note:** Version bump only for package react-liwi





# [5.0.0](https://github.com/liwijs/liwi/compare/react-liwi@4.2.2...react-liwi@5.0.0) (2019-02-17)


### Features

* add transformer ([76861ae](https://github.com/liwijs/liwi/commit/76861ae))


### BREAKING CHANGES

* added Transformer, query model is now value in query description





## [4.2.2](https://github.com/liwijs/liwi/compare/react-liwi@4.2.1...react-liwi@4.2.2) (2019-02-16)


### Bug Fixes

* dont subscribe on initial render if document is not visible ([db507de](https://github.com/liwijs/liwi/commit/db507de))





## [4.2.1](https://github.com/liwijs/liwi/compare/react-liwi@4.2.0...react-liwi@4.2.1) (2019-02-16)


### Bug Fixes

* unsubcribe call with this ([9826048](https://github.com/liwijs/liwi/commit/9826048))





# [4.2.0](https://github.com/liwijs/liwi/compare/react-liwi@4.1.2...react-liwi@4.2.0) (2019-02-16)


### Features

* add log when unsubscribed due to timeout ([4d8fff6](https://github.com/liwijs/liwi/commit/4d8fff6))





## [4.1.2](https://github.com/liwijs/liwi/compare/react-liwi@4.1.1...react-liwi@4.1.2) (2019-02-16)

**Note:** Version bump only for package react-liwi





## [4.1.1](https://github.com/liwijs/liwi/compare/react-liwi@4.1.0...react-liwi@4.1.1) (2019-02-11)


### Bug Fixes

* remove unused peerDependency prop-types ([2aff4f4](https://github.com/liwijs/liwi/commit/2aff4f4))





# [4.1.0](https://github.com/liwijs/liwi/compare/react-liwi@4.0.0...react-liwi@4.1.0) (2019-02-10)


### Features

* allow params in createQuery ([d674556](https://github.com/liwijs/liwi/commit/d674556))





# [4.0.0](https://github.com/liwijs/liwi/compare/react-liwi@3.0.0...react-liwi@4.0.0) (2019-02-09)


### Features

* replace query by createQuery ([1561da0](https://github.com/liwijs/liwi/commit/1561da0))


### BREAKING CHANGES

* query prop no longer exists, replaced by createQuery





# [3.0.0](https://github.com/liwijs/liwi/compare/react-liwi@2.3.0...react-liwi@3.0.0) (2019-02-09)


### Bug Fixes

* missing declaration files ([aa5021f](https://github.com/liwijs/liwi/commit/aa5021f))


### Features

* queries as fn with result ([1a1abcb](https://github.com/liwijs/liwi/commit/1a1abcb))


### BREAKING CHANGES

* multiple typescript typings change





# [2.3.0](https://github.com/liwijs/liwi/compare/react-liwi@2.2.2...react-liwi@2.3.0) (2019-02-05)


### Features

* add timeout and visibilitychange in FindAndSubscribe ([ea8ce5e](https://github.com/liwijs/liwi/commit/ea8ce5e))





## [2.2.2](https://github.com/liwijs/liwi/compare/react-liwi@2.2.1...react-liwi@2.2.2) (2019-02-05)

**Note:** Version bump only for package react-liwi





## [2.2.1](https://github.com/liwijs/liwi/compare/react-liwi@2.2.0...react-liwi@2.2.1) (2019-02-04)

**Note:** Version bump only for package react-liwi





# 2.2.0 (2019-01-20)


### Bug Fixes

* fixes ([482c388](https://github.com/liwijs/liwi/commit/482c388))


### Features

* liwi-subscribe-store ([53b18a3](https://github.com/liwijs/liwi/commit/53b18a3))





# [2.1.0](https://github.com/liwijs/liwi/compare/liwi-react-redux@2.0.0...liwi-react-redux@2.1.0) (2018-11-23)


### Features

* add and export mongo types ([aec6dba](https://github.com/liwijs/liwi/commit/aec6dba))





<a name="2.0.0"></a>
# [2.0.0](https://github.com/liwijs/liwi/compare/liwi-react-redux@1.0.0...liwi-react-redux@2.0.0) (2018-08-26)


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
