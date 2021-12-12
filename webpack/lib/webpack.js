const Compiler = require('./Compiler')
const NodeEnvironmentPlugin = require('./node/NodeEnvironmentPlugin')
const WebpackOptionsApply = require('./WebpackOptionsApply')

function getNormalizedEntryStatic(entry) {
	if (entry === undefined) {
		return { main: {} }
	}
	if (typeof entry === 'function') {
		return (
			(fn) => () =>
				Promise.resolve().then(fn).then(getNormalizedEntryStatic)
		)(entry)
	}
	if (typeof entry === 'string') {
		return { main: { import: [entry] } }
	}
	if (Array.isArray(entry)) {
		return { main: { import: entry } }
	}
}

// 格式化entry格式为 { main: { import: ['./src/index.js'] } }
function getNormalizedWebpackOptions(options) {
	return {
		...options,
		entry: getNormalizedEntryStatic(options.entry),
	}
}

/**
 * 创建Compiler
 * @param {*} rawOptions webpack配置
 * @returns {Compiler} a compiler
 */
function createCompiler(rawOptions) {
	// 格式化options（这里主要格式化entry）
	const options = getNormalizedWebpackOptions(rawOptions)
	// 初始化Compiler实例
	const compiler = new Compiler(options.context, options)
	// 将options属性挂载到compiler对象上
	compiler.options = options
	// 让compiler可以读写文件的插件
	new NodeEnvironmentPlugin({}).apply(compiler)
	// 注册插件
	if (Array.isArray(options.plugins)) {
		for (let plugin of options.plugins) {
			// 如果插件是一个函数 直接调用
			if (typeof plugin === 'function') {
				plugin.call(compiler, compiler)
			} else {
				// 调用插件的apply方法注册插件
				plugin.apply(compiler)
			}
		}
	}
	// 在返回compiler之前挂载内置插件
	new WebpackOptionsApply().process(options, compiler)
	return compiler
}
/**
 *
 * @param {*} options webpack配置信息
 * @param {*} callback
 * @returns Compiler
 */
function webpack(options, callback) {
	// 创建Compiler对象
	const compiler = createCompiler(options)
	return compiler
}

module.exports = webpack
