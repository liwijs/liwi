# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
