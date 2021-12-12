class EntryPlugin {
	constructor(context, entry, options) {
		this.context = context
		this.entry = entry
		this.options = options || ''
	}
	apply(compiler) {
		compiler.hooks.compilation.tap('EntryPlugin', (compilation) => {
			console.log('EntryPlugin compilation')
		})
		compiler.hooks.make.tapAsync('EntryPlugin', (err, callback) => {
			console.log('EntryPlugin make')
		})
	}
}

module.exports = EntryPlugin
