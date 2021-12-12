const EntryOptionPlugin = require('./EntryOptionPlugin')
/**
 * 挂载内置插件
 */
class WebpackOptionsApply {
	process(options, compiler) {
		// 注册入口配置插件
		new EntryOptionPlugin().apply(compiler)
		compiler.hooks.entryOption.call(options.context, options.entry)
	}
}

module.exports = WebpackOptionsApply
