const path = require('path')
const fs = require('fs-extra')
const pathUtil = require('./utils/pathUtil')
const { log } = require('./utils/utils')

/**
 * 转换入口
 * @param {*} sourceFolder 输入目录
 */
async function transform(sourceFolder) {
	log(`project path：${sourceFolder}`)
	// 删除一些文件
	pathUtil.delDir(resolve('build'))
	pathUtil.delDir(resolve('config'))
	pathUtil.delFile(resolve('index.html'))
	pathUtil.delFile(resolve('.babelrc'))
	pathUtil.delFile(resolve('package-lock.json'))
	pathUtil.delFile(resolve('yarn.lock'))
	pathUtil.delFile(resolve('.postcssrc.js'))

	// 复制一些文件
	pathUtil.copyFile(path.resolve('./uniapp-template/babel.config.js'), resolve('babel.config.js'))
	pathUtil.copyFile(path.resolve('./uniapp-template/postcss.config.js'), resolve('postcss.config.js'))
	pathUtil.copyFile(path.resolve('./uniapp-template/vue.config.js'), resolve('vue.config.js'))
	pathUtil.copyFolder(path.resolve('./uniapp-template/public'), resolve('public'))
	pathUtil.copyFile(path.resolve('./uniapp-template/src/uni.scss'), resolve('src/uni.scss'))
	pathUtil.copyFile(path.resolve('./uniapp-template/src/hackPageLifecycle.js'), resolve('src/hackPageLifecycle.js'))

	// 移动 static 目录
	pathUtil.copyFolder(resolve('static'), resolve('src/static'))
	pathUtil.delDir(resolve('static'))

	// 重写 package.json
	let packageJSON = fs.readJsonSync(path.resolve('./uniapp-template/package.json'))
	let file_package = resolve('package.json')
	if (fs.existsSync(file_package)) {
		let packageJson = fs.readJsonSync(file_package)
		packageJson.dependencies = packageJson.dependencies || []
		packageJSON.name = packageJson.name
		packageJSON.version = packageJson.version
		packageJSON.description = packageJson.description
		packageJSON.author = packageJson.author
		for (let key in packageJson.dependencies) {
			if (key !== 'mpvue') {
				packageJSON.dependencies[key] = packageJson.dependencies[key]
			}
		}
	}
	fs.writeFileSync(file_package, JSON.stringify(packageJSON, null, '    '))
	log('rewrite package.json success')

	// 构建 pages.json 和 manifest.json
	let pagesJSON = {}
	let manifestJSON = fs.readJsonSync(path.resolve('./uniapp-template/src/manifest.json'))
	let file_appJSON = resolve('src/app.json')
	if (fs.existsSync(file_appJSON)) {
		let appJSON = fs.readJsonSync(file_appJSON)
		appJSON.plugins && (manifestJSON['mp-weixin'].plugins = appJSON.plugins)
		appJSON.permission && (manifestJSON['mp-weixin'].permission = appJSON.permission)
		appJSON.window && (pagesJSON.globalStyle = appJSON.window)
		appJSON.tabBar && (pagesJSON.tabBar = appJSON.tabBar)
		if (Array.isArray(appJSON.pages)) {
			 pagesJSON.pages = appJSON.pages.map(path => {
				let pageDir = path.substr(0, path.length - 4)
				let pageStyle = {}
				let file_pageConfig = resolve(`src/${pageDir}main.json`)
				if (fs.existsSync(file_pageConfig)) {
					pageStyle = fs.readJsonSync(file_pageConfig)
					pathUtil.delFile(file_pageConfig)
				} else {
					log(`${file_pageConfig} not found！`, 'warn')
				}
				try {
					// index.vue => main.vue
					fs.renameSync(resolve(`src/${pageDir}index.vue`), resolve(`src/${pageDir}main.vue`))
					// delete main.js
					pathUtil.delFile(resolve(`src/${pageDir}main.js`))
				} catch(e) {}
				log(`page ${path} convert complete！`)
				return {
					path: path,
					style: pageStyle
				}
			})
		}
	}
	fs.writeFileSync(resolve('src/manifest.json'), JSON.stringify(manifestJSON, null, '    '))
	fs.writeFileSync(resolve('src/pages.json'), JSON.stringify(pagesJSON, null, '    '))

	log('generate pages.json success')
	log('')
	log('success')

	function resolve(dir) {
		return path.join(sourceFolder, dir)
	}
}

module.exports = transform
