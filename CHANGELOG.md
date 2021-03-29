# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [8.1.4](https://github.com/liwijs/liwi/compare/v8.1.3...v8.1.4) (2021-03-29)


### Bug Fixes

* **react-liwi:** improve typings, error can be ResourcesServerError ([26fa437](https://github.com/liwijs/liwi/commit/26fa437547c9826f0db19cc233a8d46161e7d9a7))





## [8.1.3](https://github.com/liwijs/liwi/compare/v8.1.2...v8.1.3) (2021-03-29)


### Bug Fixes

* **liwi-resources-websocket-client:** only use console.error on error if onError not provided ([6d65a6b](https://github.com/liwijs/liwi/commit/6d65a6b44013785d18f882630c13637501b7ecc6))





## [8.1.2](https://github.com/liwijs/liwi/compare/v8.1.1...v8.1.2) (2021-03-29)


### Bug Fixes

* **liwi-resources:** build for browsers ([3c32141](https://github.com/liwijs/liwi/commit/3c32141695f6f7e355786d9cb37c2f6ba0aca48a))





## [8.1.1](https://github.com/liwijs/liwi/compare/v8.1.0...v8.1.1) (2021-03-28)


### Bug Fixes

* mongo import for esm ([4fd2251](https://github.com/liwijs/liwi/commit/4fd2251c25b6e3df01d4ab82fe3e2da868acbdd9))





# [8.1.0](https://github.com/liwijs/liwi/compare/v8.0.4...v8.1.0) (2021-03-28)


### Bug Fixes

* remove unused @types/socket.io dependency ([af453d1](https://github.com/liwijs/liwi/commit/af453d1bd7d66ce1337e7f4e5ae1b2b7a04174a8))
* remove unused deep-equal dependency ([dbd4d62](https://github.com/liwijs/liwi/commit/dbd4d62143fee4c4981c5ca28991bcd30b94603c))
* update optional dependencies in liwi-resources-websocket-server ([3b3ab8f](https://github.com/liwijs/liwi/commit/3b3ab8f04020d60727e0be78474e33c76497a1ee))


### Features

* update mingo ([dbda259](https://github.com/liwijs/liwi/commit/dbda259098aafc688fa9c3d4f1ef8355a1832c98))
* **react-liwi:** allow react 17 ([cc2cbe4](https://github.com/liwijs/liwi/commit/cc2cbe47fb5a19dad0da70a8e844d4cb5e4cf539))
* update mongo ([20b7a59](https://github.com/liwijs/liwi/commit/20b7a59500c355d45ae490a4032a42a4bc13ecd7))
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


### Bug Fixes

* setOnInsertPartialObject type ([310d869](https://github.com/liwijs/liwi/commit/310d86990080668344a5c71c014bf6507111315f))





# [8.0.0](https://github.com/liwijs/liwi/compare/v7.6.2...v8.0.0) (2021-01-10)


### Code Refactoring

* update dev dependencies ([#12](https://github.com/liwijs/liwi/issues/12)) ([c75bfdc](https://github.com/liwijs/liwi/commit/c75bfdcbe5404f5e09679a336edf4bf12b95c57a))


### Features

* add setOnInsertPartialObject in upsertOne and upsertOneWithInfo ([bf5b844](https://github.com/liwijs/liwi/commit/bf5b844e87a1e848eedfa7151709a4e89f5d99b9))


### BREAKING CHANGES

* drop node 10





## [7.6.2](https://github.com/liwijs/liwi/compare/v7.6.1...v7.6.2) (2020-11-13)


### Bug Fixes

* log message in debug ([89ef949](https://github.com/liwijs/liwi/commit/89ef949))





## [7.6.1](https://github.com/liwijs/liwi/compare/v7.6.0...v7.6.1) (2020-11-13)


### Bug Fixes

* wss protocol detection ([b487ce6](https://github.com/liwijs/liwi/commit/b487ce6))





# [7.6.0](https://github.com/liwijs/liwi/compare/v7.5.0...v7.6.0) (2020-10-05)


### Bug Fixes

* better AppErrorCatcher ([f53c554](https://github.com/liwijs/liwi/commit/f53c554))


### Features

* add skip ([6764e7b](https://github.com/liwijs/liwi/commit/6764e7b))





# [7.5.0](https://github.com/liwijs/liwi/compare/v7.4.3...v7.5.0) (2020-08-15)


### Features

* dont try to reconnect when visibility is hidden ([2705a33](https://github.com/liwijs/liwi/commit/2705a33))





## [7.4.3](https://github.com/liwijs/liwi/compare/v7.4.2...v7.4.3) (2020-08-14)


### Bug Fixes

* return result ([ec33b4e](https://github.com/liwijs/liwi/commit/ec33b4e))





## [7.4.2](https://github.com/liwijs/liwi/compare/v7.4.1...v7.4.2) (2020-08-14)


### Bug Fixes

* beter handle no result in MongoQuerySingleItem ([6b13448](https://github.com/liwijs/liwi/commit/6b13448))
* remove console.log ([9c0aa56](https://github.com/liwijs/liwi/commit/9c0aa56))





## [7.4.1](https://github.com/liwijs/liwi/compare/v7.4.0...v7.4.1) (2020-08-14)


### Bug Fixes

* handle event subscribe:close without id ([1a82247](https://github.com/liwijs/liwi/commit/1a82247))





# [7.4.0](https://github.com/liwijs/liwi/compare/v7.3.0...v7.4.0) (2020-08-09)


### Bug Fixes

* remove console.log ([6ee5ef5](https://github.com/liwijs/liwi/commit/6ee5ef5))


### Features

* prepare liwi-resources-direct-client ([8b3f681](https://github.com/liwijs/liwi/commit/8b3f681))





# [7.3.0](https://github.com/liwijs/liwi/compare/v7.2.3...v7.3.0) (2020-08-08)


### Features

* add default url ([3006b30](https://github.com/liwijs/liwi/commit/3006b30))





## [7.2.3](https://github.com/liwijs/liwi/compare/v7.2.2...v7.2.3) (2020-08-08)


### Bug Fixes

* better type ServiceInterface ([34b57b1](https://github.com/liwijs/liwi/commit/34b57b1))





## [7.2.2](https://github.com/liwijs/liwi/compare/v7.2.1...v7.2.2) (2020-08-08)


### Bug Fixes

* missing undefined in ServiceQuery ([b88ca69](https://github.com/liwijs/liwi/commit/b88ca69))





## [7.2.1](https://github.com/liwijs/liwi/compare/v7.2.0...v7.2.1) (2020-08-08)


### Bug Fixes

* params type ([bf54f7b](https://github.com/liwijs/liwi/commit/bf54f7b))





# [7.2.0](https://github.com/liwijs/liwi/compare/v7.1.0...v7.2.0) (2020-08-08)


### Bug Fixes

* set ConnectedUser to unknown if not specified ([1b8773a](https://github.com/liwijs/liwi/commit/1b8773a))


### Features

* allow to not pass params when undefined ([6a6bf76](https://github.com/liwijs/liwi/commit/6a6bf76))





# [7.1.0](https://github.com/liwijs/liwi/compare/v7.0.0...v7.1.0) (2020-08-08)


### Features

* getAuthenticatedUser can return a promise ([ab06bf3](https://github.com/liwijs/liwi/commit/ab06bf3))





# [7.0.0](https://github.com/liwijs/liwi/compare/v0.18.8...v7.0.0) (2020-08-08)


### Bug Fixes

* add missing document.removeEventListener for visibilitychange ([3277950](https://github.com/liwijs/liwi/commit/3277950))
* add resultRef, state is always initial ([e91b291](https://github.com/liwijs/liwi/commit/e91b291))
* allow QueryDescription to have void param ([0c9a894](https://github.com/liwijs/liwi/commit/0c9a894))
* build ([ac2ee64](https://github.com/liwijs/liwi/commit/ac2ee64))
* build ([d286aff](https://github.com/liwijs/liwi/commit/d286aff))
* debug log init ([fc28efb](https://github.com/liwijs/liwi/commit/fc28efb))
* dont subscribe on initial render if document is not visible ([db507de](https://github.com/liwijs/liwi/commit/db507de))
* encode operation result ([c838894](https://github.com/liwijs/liwi/commit/c838894))
* eslint error ([206b1b5](https://github.com/liwijs/liwi/commit/206b1b5))
* export createMongoResourcesWebsocketClient ([dc5cf66](https://github.com/liwijs/liwi/commit/dc5cf66))
* exported ServiceResource second arg is optional ([d6c282f](https://github.com/liwijs/liwi/commit/d6c282f))
* fixes ([482c388](https://github.com/liwijs/liwi/commit/482c388))
* improve ServiceResource definitions ([92a1c3b](https://github.com/liwijs/liwi/commit/92a1c3b))
* mingoQuery without criteria ([fe78dd2](https://github.com/liwijs/liwi/commit/fe78dd2))
* missing callback in unsubscribe ([8ff0fb3](https://github.com/liwijs/liwi/commit/8ff0fb3))
* missing declaration files ([aa5021f](https://github.com/liwijs/liwi/commit/aa5021f))
* queries and operations should be a record, not an array ([b0a89da](https://github.com/liwijs/liwi/commit/b0a89da))
* queries definition ([ad3cfa4](https://github.com/liwijs/liwi/commit/ad3cfa4))
* remove obsolete dependency ([ce61569](https://github.com/liwijs/liwi/commit/ce61569))
* remove unused peerDependency prop-types ([2aff4f4](https://github.com/liwijs/liwi/commit/2aff4f4))
* rename Query to ClientQuery ([e330a62](https://github.com/liwijs/liwi/commit/e330a62))
* resubscribing did not work correctly ([68b485a](https://github.com/liwijs/liwi/commit/68b485a))
* send value array ([7f012c2](https://github.com/liwijs/liwi/commit/7f012c2))
* subscribe-store param createQuery ([74f4fd7](https://github.com/liwijs/liwi/commit/74f4fd7))
* support namespace ([e677afc](https://github.com/liwijs/liwi/commit/e677afc))
* typescript def queries allow Promise ([60a893e](https://github.com/liwijs/liwi/commit/60a893e))
* useResource without subscribing ([645421d](https://github.com/liwijs/liwi/commit/645421d))
* **liwi-mongo:** replaceone ([eea4324](https://github.com/liwijs/liwi/commit/eea4324))
* unsubcribe call with this ([9826048](https://github.com/liwijs/liwi/commit/9826048))
* unsubscribe and add subscribeHook ([d6e3d5a](https://github.com/liwijs/liwi/commit/d6e3d5a))
* use partial for $set and $setOnInsert ([2e02952](https://github.com/liwijs/liwi/commit/2e02952))


### Code Refactoring

* **react-liwi:** remove react components ([6ece729](https://github.com/liwijs/liwi/commit/6ece729))
* typescript ([5ec81a1](https://github.com/liwijs/liwi/commit/5ec81a1))
* use lerna ([88b2a3c](https://github.com/liwijs/liwi/commit/88b2a3c))


### Features

* add and export mongo types ([aec6dba](https://github.com/liwijs/liwi/commit/aec6dba))
* add connected user ([c43685c](https://github.com/liwijs/liwi/commit/c43685c))
* add criteria un findByKey and deleteByKey ([2adfaba](https://github.com/liwijs/liwi/commit/2adfaba))
* add hooks ([906c820](https://github.com/liwijs/liwi/commit/906c820))
* add liwi-resources-void-client ([5cff2e4](https://github.com/liwijs/liwi/commit/5cff2e4))
* add log when unsubscribed due to timeout ([4d8fff6](https://github.com/liwijs/liwi/commit/4d8fff6))
* add more info in logger ([76bacf1](https://github.com/liwijs/liwi/commit/76bacf1))
* add Operations default in ServiceResource ([d60fb38](https://github.com/liwijs/liwi/commit/d60fb38))
* add optional critieria in partialUpdateByKey ([6bd5578](https://github.com/liwijs/liwi/commit/6bd5578))
* add timeout and visibilitychange in FindAndSubscribe ([ea8ce5e](https://github.com/liwijs/liwi/commit/ea8ce5e))
* add transformer ([76861ae](https://github.com/liwijs/liwi/commit/76861ae))
* add transformer in createQuery ([1826413](https://github.com/liwijs/liwi/commit/1826413))
* allow client createQuery to not pass params ([be9e4a2](https://github.com/liwijs/liwi/commit/be9e4a2))
* allow params in createQuery ([d674556](https://github.com/liwijs/liwi/commit/d674556))
* allow query to be returned with a promise ([902944c](https://github.com/liwijs/liwi/commit/902944c))
* allow ResourcesClientService to have optional second generic ([c0a8d8c](https://github.com/liwijs/liwi/commit/c0a8d8c))
* allow to get params in subscribe hooks ([49e40cf](https://github.com/liwijs/liwi/commit/49e40cf))
* big refactor ([#5](https://github.com/liwijs/liwi/issues/5)) ([a4629c4](https://github.com/liwijs/liwi/commit/a4629c4))
* drop node 8 ([2fb6528](https://github.com/liwijs/liwi/commit/2fb6528))
* mongo 3 ([b9bfaa4](https://github.com/liwijs/liwi/commit/b9bfaa4))
* update deps and improve typescript dev ([b42eefb](https://github.com/liwijs/liwi/commit/b42eefb))
* **liwi-subscribe-store:** implement deleteMany ([a7cb28e](https://github.com/liwijs/liwi/commit/a7cb28e))
* **liwi-subscribe-store:** implement partialUpdateMany ([b15b003](https://github.com/liwijs/liwi/commit/b15b003))
* **react-liwi:** add subscribeOptions in useResource ([187fdda](https://github.com/liwijs/liwi/commit/187fdda))
* createMongoResourcesWebsocketClient ([3f0f3e7](https://github.com/liwijs/liwi/commit/3f0f3e7))
* export type Update in liwi-store ([1c051c8](https://github.com/liwijs/liwi/commit/1c051c8))
* liwi-subscribe-store ([53b18a3](https://github.com/liwijs/liwi/commit/53b18a3))
* pass object to ResourcesServerService instead of 2 param ([e3f3225](https://github.com/liwijs/liwi/commit/e3f3225))
* queries as fn with result ([1a1abcb](https://github.com/liwijs/liwi/commit/1a1abcb))
* queryInfo in applyChanges and liwi-mongo ([ecfdc3f](https://github.com/liwijs/liwi/commit/ecfdc3f))
* rename createResourceClient to createResourceClientService ([0118f85](https://github.com/liwijs/liwi/commit/0118f85))
* replace query by createQuery ([1561da0](https://github.com/liwijs/liwi/commit/1561da0))
* resource operations ([9ddd3b7](https://github.com/liwijs/liwi/commit/9ddd3b7))
* split liwi-resources into server and client ([df73bf9](https://github.com/liwijs/liwi/commit/df73bf9))


### BREAKING CHANGES

* drop node 8
* **react-liwi:** use hooks instead of react components
* added Transformer, query model is now value in query description
* query prop no longer exists, replaced by createQuery
* replace new ResourcesServerService(map1, map2) by new ResourcesServerService({serviceResources:map1, cursorResources:map2})
* multiple typescript typings change
* major rewrite in typescript
* liwi package splitted
