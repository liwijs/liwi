# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.1.3](https://github.com/liwijs/liwi/compare/v10.1.2...v10.1.3) (2023-01-29)


### Bug Fixes

* **liwi-mongo:** ignore $text not $search ([80225b2](https://github.com/liwijs/liwi/commit/80225b264b57960d521401e80a64b74a265bdf18))





## [10.1.2](https://github.com/liwijs/liwi/compare/v10.1.1...v10.1.2) (2023-01-29)


### Bug Fixes

* **liwi-monogo:** fix createTestCriteria for unsupported $search criteria ([e572148](https://github.com/liwijs/liwi/commit/e57214831e14a193ad2c5dec16c3873c25e1c076))





## [10.1.1](https://github.com/liwijs/liwi/compare/v10.1.0...v10.1.1) (2022-12-10)


### Bug Fixes

* **liwi-mongo:** meta count using criteria ([e2347ad](https://github.com/liwijs/liwi/commit/e2347adb00e229c78a7b8523b1ac06beb6ca0545))





# [10.0.0](https://github.com/liwijs/liwi/compare/v9.2.0...v10.0.0) (2022-11-27)


### Code Refactoring

* drop node 14 and cjs ([b7035bd](https://github.com/liwijs/liwi/commit/b7035bd2289982ef56d3e560f4f3f308e90a555e))


### Features

* **deps:** update nightingale to v13 (major) ([#128](https://github.com/liwijs/liwi/issues/128)) ([f04d7fe](https://github.com/liwijs/liwi/commit/f04d7fe2deba3f20733ff945a35c61098139d8a9))


### BREAKING CHANGES

* dropped node 14 and cjs





# [9.2.0](https://github.com/liwijs/liwi/compare/v9.1.0...v9.2.0) (2022-10-29)

**Note:** Version bump only for package liwi-mongo





# [9.1.0](https://github.com/liwijs/liwi/compare/v9.0.0...v9.1.0) (2022-10-08)


### Bug Fixes

* redact connectionString in logs ([236ecb2](https://github.com/liwijs/liwi/commit/236ecb2b812c4d48ae0028b91e93528ddc899f1b))
* update dev dependencies, fix ts remix, fix next babel config ([fadb30e](https://github.com/liwijs/liwi/commit/fadb30e9620fbbcb99cfbc6a7db78d9ef2dad5e2))





# [9.0.0](https://github.com/liwijs/liwi/compare/v8.3.1...v9.0.0) (2022-03-05)


### Bug Fixes

* update meta when params change ([7c260a8](https://github.com/liwijs/liwi/commit/7c260a84cc8daae0113fbbf30f5a9e7ca921ee3e))


### Features

* **deps:** update dependency mongodb to v4 ([#22](https://github.com/liwijs/liwi/issues/22)) ([cdf9204](https://github.com/liwijs/liwi/commit/cdf920461156e5dd6dceaf5bf26b24c206385634))
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





## [8.1.1](https://github.com/liwijs/liwi/compare/v8.1.0...v8.1.1) (2021-03-28)


### Bug Fixes

* mongo import for esm ([4fd2251](https://github.com/liwijs/liwi/commit/4fd2251c25b6e3df01d4ab82fe3e2da868acbdd9))





# [8.1.0](https://github.com/liwijs/liwi/compare/v8.0.4...v8.1.0) (2021-03-28)


### Features

* update mingo ([dbda259](https://github.com/liwijs/liwi/commit/dbda259098aafc688fa9c3d4f1ef8355a1832c98))
* update mongo ([20b7a59](https://github.com/liwijs/liwi/commit/20b7a59500c355d45ae490a4032a42a4bc13ecd7))
* update nightingale ([ede1ef6](https://github.com/liwijs/liwi/commit/ede1ef66f10f3b631bcbf09687faed56e62f47ca))





## [8.0.4](https://github.com/liwijs/liwi/compare/v8.0.3...v8.0.4) (2021-01-18)


### Bug Fixes

* update pob-babel for better support ([4cb684e](https://github.com/liwijs/liwi/commit/4cb684e2abc21ffb0d8b0e738da36c0f3c5ea1c2))





## [8.0.3](https://github.com/liwijs/liwi/compare/v8.0.2...v8.0.3) (2021-01-18)

**Note:** Version bump only for package liwi-mongo





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





## [7.4.2](https://github.com/liwijs/liwi/compare/v7.4.1...v7.4.2) (2020-08-14)


### Bug Fixes

* beter handle no result in MongoQuerySingleItem ([6b13448](https://github.com/liwijs/liwi/commit/6b13448))





## [7.2.3](https://github.com/liwijs/liwi/compare/v7.2.2...v7.2.3) (2020-08-08)

**Note:** Version bump only for package liwi-mongo





## [7.2.1](https://github.com/liwijs/liwi/compare/v7.2.0...v7.2.1) (2020-08-08)

**Note:** Version bump only for package liwi-mongo





# [7.0.0](https://github.com/liwijs/liwi/compare/v0.18.8...v7.0.0) (2020-08-08)


### Bug Fixes

* improve ServiceResource definitions ([92a1c3b](https://github.com/liwijs/liwi/commit/92a1c3b))
* **liwi-mongo:** replaceone ([eea4324](https://github.com/liwijs/liwi/commit/eea4324))
* eslint error ([206b1b5](https://github.com/liwijs/liwi/commit/206b1b5))
* fixes ([482c388](https://github.com/liwijs/liwi/commit/482c388))
* mingoQuery without criteria ([fe78dd2](https://github.com/liwijs/liwi/commit/fe78dd2))


### Code Refactoring

* **react-liwi:** remove react components ([6ece729](https://github.com/liwijs/liwi/commit/6ece729))
* typescript ([5ec81a1](https://github.com/liwijs/liwi/commit/5ec81a1))
* use lerna ([88b2a3c](https://github.com/liwijs/liwi/commit/88b2a3c))


### Features

* add and export mongo types ([aec6dba](https://github.com/liwijs/liwi/commit/aec6dba))
* add criteria un findByKey and deleteByKey ([2adfaba](https://github.com/liwijs/liwi/commit/2adfaba))
* add optional critieria in partialUpdateByKey ([6bd5578](https://github.com/liwijs/liwi/commit/6bd5578))
* add transformer ([76861ae](https://github.com/liwijs/liwi/commit/76861ae))
* add transformer in createQuery ([1826413](https://github.com/liwijs/liwi/commit/1826413))
* big refactor ([#5](https://github.com/liwijs/liwi/issues/5)) ([a4629c4](https://github.com/liwijs/liwi/commit/a4629c4))
* drop node 8 ([2fb6528](https://github.com/liwijs/liwi/commit/2fb6528))
* liwi-subscribe-store ([53b18a3](https://github.com/liwijs/liwi/commit/53b18a3))
* mongo 3 ([b9bfaa4](https://github.com/liwijs/liwi/commit/b9bfaa4))
* queries as fn with result ([1a1abcb](https://github.com/liwijs/liwi/commit/1a1abcb))
* queryInfo in applyChanges and liwi-mongo ([ecfdc3f](https://github.com/liwijs/liwi/commit/ecfdc3f))
* resource operations ([9ddd3b7](https://github.com/liwijs/liwi/commit/9ddd3b7))
* split liwi-resources into server and client ([df73bf9](https://github.com/liwijs/liwi/commit/df73bf9))
* update deps and improve typescript dev ([b42eefb](https://github.com/liwijs/liwi/commit/b42eefb))


### BREAKING CHANGES

* drop node 8
* **react-liwi:** use hooks instead of react components
* added Transformer, query model is now value in query description
* multiple typescript typings change
* major rewrite in typescript
* liwi package splitted





# [5.1.0](https://github.com/liwijs/liwi/compare/liwi-mongo@5.0.4...liwi-mongo@5.1.0) (2019-10-12)


### Features

* add criteria un findByKey and deleteByKey ([2adfaba](https://github.com/liwijs/liwi/commit/2adfaba))





## [5.0.4](https://github.com/liwijs/liwi/compare/liwi-mongo@5.0.3...liwi-mongo@5.0.4) (2019-09-13)

**Note:** Version bump only for package liwi-mongo





## [5.0.3](https://github.com/liwijs/liwi/compare/liwi-mongo@5.0.2...liwi-mongo@5.0.3) (2019-09-13)

**Note:** Version bump only for package liwi-mongo





## [5.0.2](https://github.com/liwijs/liwi/compare/liwi-mongo@5.0.1...liwi-mongo@5.0.2) (2019-09-08)


### Bug Fixes

* improve ServiceResource definitions ([92a1c3b](https://github.com/liwijs/liwi/commit/92a1c3b))





## [5.0.1](https://github.com/liwijs/liwi/compare/liwi-mongo@5.0.0...liwi-mongo@5.0.1) (2019-05-05)


### Bug Fixes

* **liwi-mongo:** replaceone ([eea4324](https://github.com/liwijs/liwi/commit/eea4324))





# [5.0.0](https://github.com/liwijs/liwi/compare/liwi-mongo@4.2.1...liwi-mongo@5.0.0) (2019-05-05)


### Code Refactoring

* **react-liwi:** remove react components ([6ece729](https://github.com/liwijs/liwi/commit/6ece729))


### Features

* mongo 3 ([b9bfaa4](https://github.com/liwijs/liwi/commit/b9bfaa4))
* queryInfo in applyChanges and liwi-mongo ([ecfdc3f](https://github.com/liwijs/liwi/commit/ecfdc3f))


### BREAKING CHANGES

* **react-liwi:** use hooks instead of react components





## [4.2.1](https://github.com/liwijs/liwi/compare/liwi-mongo@4.2.0...liwi-mongo@4.2.1) (2019-05-03)


### Bug Fixes

* mingoQuery without criteria ([fe78dd2](https://github.com/liwijs/liwi/commit/fe78dd2))





# [4.2.0](https://github.com/liwijs/liwi/compare/liwi-mongo@4.1.0...liwi-mongo@4.2.0) (2019-04-19)


### Features

* add optional critieria in partialUpdateByKey ([6bd5578](https://github.com/liwijs/liwi/commit/6bd5578))





# [4.1.0](https://github.com/liwijs/liwi/compare/liwi-mongo@4.0.0...liwi-mongo@4.1.0) (2019-02-17)


### Features

* add transformer in createQuery ([1826413](https://github.com/liwijs/liwi/commit/1826413))





# [4.0.0](https://github.com/liwijs/liwi/compare/liwi-mongo@3.0.3...liwi-mongo@4.0.0) (2019-02-17)


### Features

* add transformer ([76861ae](https://github.com/liwijs/liwi/commit/76861ae))


### BREAKING CHANGES

* added Transformer, query model is now value in query description





## [3.0.3](https://github.com/liwijs/liwi/compare/liwi-mongo@3.0.2...liwi-mongo@3.0.3) (2019-02-16)

**Note:** Version bump only for package liwi-mongo





## [3.0.2](https://github.com/liwijs/liwi/compare/liwi-mongo@3.0.1...liwi-mongo@3.0.2) (2019-02-11)

**Note:** Version bump only for package liwi-mongo





## [3.0.1](https://github.com/liwijs/liwi/compare/liwi-mongo@3.0.0...liwi-mongo@3.0.1) (2019-02-09)

**Note:** Version bump only for package liwi-mongo





# [3.0.0](https://github.com/liwijs/liwi/compare/liwi-mongo@2.3.0...liwi-mongo@3.0.0) (2019-02-09)


### Features

* queries as fn with result ([1a1abcb](https://github.com/liwijs/liwi/commit/1a1abcb))
* resource operations ([9ddd3b7](https://github.com/liwijs/liwi/commit/9ddd3b7))


### BREAKING CHANGES

* multiple typescript typings change





# [2.3.0](https://github.com/liwijs/liwi/compare/liwi-mongo@2.2.1...liwi-mongo@2.3.0) (2019-02-05)


### Bug Fixes

* eslint error ([206b1b5](https://github.com/liwijs/liwi/commit/206b1b5))


### Features

* split liwi-resources into server and client ([df73bf9](https://github.com/liwijs/liwi/commit/df73bf9))





## [2.2.1](https://github.com/liwijs/liwi/compare/liwi-mongo@2.2.0...liwi-mongo@2.2.1) (2019-02-04)

**Note:** Version bump only for package liwi-mongo





# [2.2.0](https://github.com/liwijs/liwi/compare/liwi-mongo@2.1.0...liwi-mongo@2.2.0) (2019-01-20)


### Bug Fixes

* fixes ([482c388](https://github.com/liwijs/liwi/commit/482c388))


### Features

* liwi-subscribe-store ([53b18a3](https://github.com/liwijs/liwi/commit/53b18a3))





# [2.1.0](https://github.com/liwijs/liwi/compare/liwi-mongo@2.0.0...liwi-mongo@2.1.0) (2018-11-23)


### Features

* add and export mongo types ([aec6dba](https://github.com/liwijs/liwi/commit/aec6dba))





<a name="2.0.0"></a>
# [2.0.0](https://github.com/liwijs/liwi/compare/liwi-mongo@1.0.0...liwi-mongo@2.0.0) (2018-08-26)


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
