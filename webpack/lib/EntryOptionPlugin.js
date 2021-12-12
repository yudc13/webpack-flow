const EntryPlugin = require('./EntryPlugin')

class EntryOptionPlugin {
	apply(compiler) {
		compiler.hooks.entryOption.tap('EntryOptionPlugin', (context, entry) => {
			EntryOptionPlugin.applyEntryOption(compiler, context, entry)
		})
	}
	static applyEntryOption(compiler, context, entry) {
		const options = {}
		new EntryPlugin(context, entry, options).apply(compiler)
	}
}

module.exports = EntryOptionPlugin
