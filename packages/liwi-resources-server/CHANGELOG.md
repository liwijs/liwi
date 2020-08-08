# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [7.2.0](https://github.com/liwijs/liwi/compare/v7.1.0...v7.2.0) (2020-08-08)


### Bug Fixes

* set ConnectedUser to unknown if not specified ([1b8773a](https://github.com/liwijs/liwi/commit/1b8773a))


### Features

* allow to not pass params when undefined ([6a6bf76](https://github.com/liwijs/liwi/commit/6a6bf76))





# [7.0.0](https://github.com/liwijs/liwi/compare/v0.18.8...v7.0.0) (2020-08-08)


### Bug Fixes

* add missing document.removeEventListener for visibilitychange ([3277950](https://github.com/liwijs/liwi/commit/3277950))
* exported ServiceResource second arg is optional ([d6c282f](https://github.com/liwijs/liwi/commit/d6c282f))
* improve ServiceResource definitions ([92a1c3b](https://github.com/liwijs/liwi/commit/92a1c3b))
* queries definition ([ad3cfa4](https://github.com/liwijs/liwi/commit/ad3cfa4))
* typescript def queries allow Promise ([60a893e](https://github.com/liwijs/liwi/commit/60a893e))
* unsubscribe and add subscribeHook ([d6e3d5a](https://github.com/liwijs/liwi/commit/d6e3d5a))


### Features

* add connected user ([c43685c](https://github.com/liwijs/liwi/commit/c43685c))
* add Operations default in ServiceResource ([d60fb38](https://github.com/liwijs/liwi/commit/d60fb38))
* add transformer ([76861ae](https://github.com/liwijs/liwi/commit/76861ae))
* add transformer in createQuery ([1826413](https://github.com/liwijs/liwi/commit/1826413))
* allow to get params in subscribe hooks ([49e40cf](https://github.com/liwijs/liwi/commit/49e40cf))
* big refactor ([#5](https://github.com/liwijs/liwi/issues/5)) ([a4629c4](https://github.com/liwijs/liwi/commit/a4629c4))
* drop node 8 ([2fb6528](https://github.com/liwijs/liwi/commit/2fb6528))
* pass object to ResourcesServerService instead of 2 param ([e3f3225](https://github.com/liwijs/liwi/commit/e3f3225))
* queries as fn with result ([1a1abcb](https://github.com/liwijs/liwi/commit/1a1abcb))
* queryInfo in applyChanges and liwi-mongo ([ecfdc3f](https://github.com/liwijs/liwi/commit/ecfdc3f))
* resource operations ([9ddd3b7](https://github.com/liwijs/liwi/commit/9ddd3b7))
* split liwi-resources into server and client ([df73bf9](https://github.com/liwijs/liwi/commit/df73bf9))
* update deps and improve typescript dev ([b42eefb](https://github.com/liwijs/liwi/commit/b42eefb))


### BREAKING CHANGES

* drop node 8
* added Transformer, query model is now value in query description
* replace new ResourcesServerService(map1, map2) by new ResourcesServerService({serviceResources:map1, cursorResources:map2})
* multiple typescript typings change





## [4.3.5](https://github.com/liwijs/liwi/compare/liwi-resources-server@4.3.4...liwi-resources-server@4.3.5) (2019-10-12)

**Note:** Version bump only for package liwi-resources-server





## [4.3.4](https://github.com/liwijs/liwi/compare/liwi-resources-server@4.3.3...liwi-resources-server@4.3.4) (2019-09-13)

**Note:** Version bump only for package liwi-resources-server





## [4.3.3](https://github.com/liwijs/liwi/compare/liwi-resources-server@4.3.2...liwi-resources-server@4.3.3) (2019-09-13)

**Note:** Version bump only for package liwi-resources-server





## [4.3.2](https://github.com/liwijs/liwi/compare/liwi-resources-server@4.3.1...liwi-resources-server@4.3.2) (2019-09-08)


### Bug Fixes

* add missing document.removeEventListener for visibilitychange ([3277950](https://github.com/liwijs/liwi/commit/3277950))
* improve ServiceResource definitions ([92a1c3b](https://github.com/liwijs/liwi/commit/92a1c3b))





## [4.3.1](https://github.com/liwijs/liwi/compare/liwi-resources-server@4.3.0...liwi-resources-server@4.3.1) (2019-09-01)


### Bug Fixes

* typescript def queries allow Promise ([60a893e](https://github.com/liwijs/liwi/commit/60a893e))





# [4.3.0](https://github.com/liwijs/liwi/compare/liwi-resources-server@4.2.0...liwi-resources-server@4.3.0) (2019-08-30)


### Features

* allow to get params in subscribe hooks ([49e40cf](https://github.com/liwijs/liwi/commit/49e40cf))





# [4.2.0](https://github.com/liwijs/liwi/compare/liwi-resources-server@4.1.1...liwi-resources-server@4.2.0) (2019-05-05)


### Features

* queryInfo in applyChanges and liwi-mongo ([ecfdc3f](https://github.com/liwijs/liwi/commit/ecfdc3f))





## [4.1.1](https://github.com/liwijs/liwi/compare/liwi-resources-server@4.1.0...liwi-resources-server@4.1.1) (2019-04-19)

**Note:** Version bump only for package liwi-resources-server





# [4.1.0](https://github.com/liwijs/liwi/compare/liwi-resources-server@4.0.0...liwi-resources-server@4.1.0) (2019-02-17)


### Features

* add transformer in createQuery ([1826413](https://github.com/liwijs/liwi/commit/1826413))





# [4.0.0](https://github.com/liwijs/liwi/compare/liwi-resources-server@3.0.4...liwi-resources-server@4.0.0) (2019-02-17)


### Features

* add transformer ([76861ae](https://github.com/liwijs/liwi/commit/76861ae))


### BREAKING CHANGES

* added Transformer, query model is now value in query description





## [3.0.4](https://github.com/liwijs/liwi/compare/liwi-resources-server@3.0.3...liwi-resources-server@3.0.4) (2019-02-16)


### Bug Fixes

* unsubscribe and add subscribeHook ([d6e3d5a](https://github.com/liwijs/liwi/commit/d6e3d5a))





## [3.0.3](https://github.com/liwijs/liwi/compare/liwi-resources-server@3.0.2...liwi-resources-server@3.0.3) (2019-02-11)

**Note:** Version bump only for package liwi-resources-server





## [3.0.2](https://github.com/liwijs/liwi/compare/liwi-resources-server@3.0.1...liwi-resources-server@3.0.2) (2019-02-09)

**Note:** Version bump only for package liwi-resources-server





## [3.0.1](https://github.com/liwijs/liwi/compare/liwi-resources-server@3.0.0...liwi-resources-server@3.0.1) (2019-02-09)


### Bug Fixes

* exported ServiceResource second arg is optional ([d6c282f](https://github.com/liwijs/liwi/commit/d6c282f))





# [3.0.0](https://github.com/liwijs/liwi/compare/liwi-resources-server@2.2.0...liwi-resources-server@3.0.0) (2019-02-09)


### Bug Fixes

* queries definition ([ad3cfa4](https://github.com/liwijs/liwi/commit/ad3cfa4))


### Features

* add connected user ([c43685c](https://github.com/liwijs/liwi/commit/c43685c))
* add Operations default in ServiceResource ([d60fb38](https://github.com/liwijs/liwi/commit/d60fb38))
* pass object to ResourcesServerService instead of 2 param ([e3f3225](https://github.com/liwijs/liwi/commit/e3f3225))
* queries as fn with result ([1a1abcb](https://github.com/liwijs/liwi/commit/1a1abcb))
* resource operations ([9ddd3b7](https://github.com/liwijs/liwi/commit/9ddd3b7))


### BREAKING CHANGES

* replace new ResourcesServerService(map1, map2) by new ResourcesServerService({serviceResources:map1, cursorResources:map2})
* multiple typescript typings change





# 2.2.0 (2019-02-05)


### Features

* split liwi-resources into server and client ([df73bf9](https://github.com/liwijs/liwi/commit/df73bf9))
