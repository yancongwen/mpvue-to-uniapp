# mpvue to uniapp

mpvue 项目转换为 uniapp 项目，本工具只实现工程结构和基本项目配置的转换，其他项目自定义配置需要自行处理。

## 安装

```sh
$ npm i mpvue-to-uniapp -g
```

## 升级版本   

```sh
$ npm update mpvue-to-uniapp -g
```

## 使用

进入 mpvue 工程目录，执行转换命令：
```sh
m2u
```

或在任意目录，执行转换命令，并指定项目路径：
```sh
m2u path/
```

## 迁移步骤


1. 克隆 mpvue 项目至新文件夹

```sh
git clone git@code.ops.focus.cn:front-end/applet-saas-car-assistant.git
```

2. 安装 mpvue-to-uniapp 转换工具

```sh
npm i mpvue-to-uniapp -g
```

3. 进入 mpvue 项目目录，执行转换命令

```sh
m2u
```

4. webpack 工程配置迁移。项目中通常会自定义一些 webpack 配置，比如：alias、DefinePlugin、CopyWebpackPlugin 等，需要在项目根目录下新建 vue.config.js 文件，然后将mpvue 项目中自定义的webpack 配置项复制至此文件内。参考：https://uniapp.dcloud.io/collocation/vue-config

5. 解决两个框架的子组件生命周期不一致问题：参考如何解决uni-app子组件不支持小程序页面生命周期问题。如果项目子组件中使用小程序的页面生命周期，在 src/main.js 中引入 hackPageLifecycle.js 即可。如果项目子组件没有使用小程序的页面生命周期，可以忽略。

6. 安装依赖，启动开发服务。检查各个页面是否正常运行，处理页面内特殊逻辑，或 uniapp 不兼容的语法。

## 其他说明

本插件仅针对微信小程序全面支持，其他端需要自行修改项目配置文件 manifest.json。
