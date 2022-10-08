# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [9.1.0](https://github.com/liwijs/liwi/compare/v9.0.0...v9.1.0) (2022-10-08)


### Bug Fixes

* add missing keyof Model in $pull operator ([47062d9](https://github.com/liwijs/liwi/commit/47062d9e4b9bfb3d55adae8aeb77ac8abd04dc20))
* add missing keyof Model in $push operator ([be7f0e1](https://github.com/liwijs/liwi/commit/be7f0e1e4da40b035528c94ebe98a373135ac066))
* **deps:** update dependency react-native-web to v0.17.7 ([#32](https://github.com/liwijs/liwi/issues/32)) ([4ff8199](https://github.com/liwijs/liwi/commit/4ff81994b5c3462e376382a9aea8e1d86463a382))
* fix not subscribing when skip is true ([cd346e7](https://github.com/liwijs/liwi/commit/cd346e7f5afdd31b593cc36b21bcb2401cd46231))
* **liwi-types:** fix Criteria generic in Criteria ([4e3ed4d](https://github.com/liwijs/liwi/commit/4e3ed4d63f3267b5c2770ade8ceab1b2a5b64b48))
* redact connectionString in logs ([236ecb2](https://github.com/liwijs/liwi/commit/236ecb2b812c4d48ae0028b91e93528ddc899f1b))
* remix eslint config root ([bf24ff5](https://github.com/liwijs/liwi/commit/bf24ff53a7a4e3e5c99d3fff23b7b5fbdb6eeb31))
* update dev dependencies, fix ts remix, fix next babel config ([fadb30e](https://github.com/liwijs/liwi/commit/fadb30e9620fbbcb99cfbc6a7db78d9ef2dad5e2))


### Features

* add example with remix ([9d1e631](https://github.com/liwijs/liwi/commit/9d1e631f4bc178258f3d888eb0c673e41f1e98ef))
* **deps:** update dependency next to v12.2.5 ([#77](https://github.com/liwijs/liwi/issues/77)) ([f7d5650](https://github.com/liwijs/liwi/commit/f7d5650317bbbb010638e42777d0924f34914c36))
* **deps:** update dependency react-native to v0.18.7 ([#68](https://github.com/liwijs/liwi/issues/68)) ([b7ddc9a](https://github.com/liwijs/liwi/commit/b7ddc9a60a5a09cc2ba77950842c0bfd4348cdb8))





# [9.0.0](https://github.com/liwijs/liwi/compare/v8.3.1...v9.0.0) (2022-03-05)


### Bug Fixes

* **deps:** update dependency react-alp-connection-state to v6.0.1 ([#23](https://github.com/liwijs/liwi/issues/23)) ([e1ca9bc](https://github.com/liwijs/liwi/commit/e1ca9bc62db60cd29d584b17f61e6718f53cd43d))
* **deps:** update dependency react-native-web to v0.17.6 ([#16](https://github.com/liwijs/liwi/issues/16)) ([453772b](https://github.com/liwijs/liwi/commit/453772bd4ab26c1e7f110b68eb200fc52f8ff458))
* config next ([5852893](https://github.com/liwijs/liwi/commit/5852893bfa1d5d63605daf23abcc5a2c8cb92cb1))
* update meta when params change ([7c260a8](https://github.com/liwijs/liwi/commit/7c260a84cc8daae0113fbbf30f5a9e7ca921ee3e))
* **deps:** update dependency todomvc-app-css to v2.4.2 ([#17](https://github.com/liwijs/liwi/issues/17)) ([ad86c2a](https://github.com/liwijs/liwi/commit/ad86c2a43f64031ffd1a443286090eb3b86d722b))
* update alp-rollup-plugin-config ([f7a3d39](https://github.com/liwijs/liwi/commit/f7a3d398749000f14006773fac8f4ef52a9b0b11))


### Features

* **deps:** update dependency mongodb to v4 ([#22](https://github.com/liwijs/liwi/issues/22)) ([cdf9204](https://github.com/liwijs/liwi/commit/cdf920461156e5dd6dceaf5bf26b24c206385634))
* **deps:** update dependency next to v12.1.0 [security] ([#20](https://github.com/liwijs/liwi/issues/20)) ([e8318e1](https://github.com/liwijs/liwi/commit/e8318e10589d03de641e29d924edeff116e9d21f))
* refactor and use node 14 ([101c861](https://github.com/liwijs/liwi/commit/101c861063420fc5a83ff5a45322b9529962dcc2))


### BREAKING CHANGES

* **deps:** cursor.count() is removed and replaced by store.count() 
* requires node 14





## [8.3.1](https://github.com/liwijs/liwi/compare/v8.3.0...v8.3.1) (2021-11-28)


### Bug Fixes

* **liwi-mongo:** fix mingoQuery for MongoQuerySingleItem ([34c240f](https://github.com/liwijs/liwi/commit/34c240f5b8c2a4fa3f3190d634acb92ab5ea563c))





# [8.3.0](https://github.com/liwijs/liwi/compare/v8.2.1...v8.3.0) (2021-11-22)


### Bug Fixes

* update pob-babel and bring back webpack 4 compat ([135caf3](https://github.com/liwijs/liwi/commit/135caf3c2d1693ae39d33e7527f16392720865a5))


### Features

* **react-liwi:** compare on initial if already have state to prevent overriding in progress changes in forms ([356bc89](https://github.com/liwijs/liwi/commit/356bc89c133d6faea4618946423a13951ede6ebd))





## [8.2.1](https://github.com/liwijs/liwi/compare/v8.2.0...v8.2.1) (2021-06-29)


### Bug Fixes

* log internal server error ([a2c176c](https://github.com/liwijs/liwi/commit/a2c176c0c13eb796c8bc5f968fa65adb9a132f32))





# [8.2.0](https://github.com/liwijs/liwi/compare/v8.1.5...v8.2.0) (2021-04-10)


### Features

* **liwi-resources-websocket-client:** add third argument for websocket in react-native ([8bff87a](https://github.com/liwijs/liwi/commit/8bff87aa300024b67deb20a7ed2c61907584cfee))





## [8.1.5](https://github.com/liwijs/liwi/compare/v8.1.4...v8.1.5) (2021-03-29)


### Bug Fixes

* **react-liwi:** export ResourcesServerError ([41d5c13](https://github.com/liwijs/liwi/commit/41d5c13d8134c2165d8dd289310b1aa0ec686b45))





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
