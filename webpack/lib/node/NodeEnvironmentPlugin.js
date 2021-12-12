const fs = require('fs')
class NodeEnvironmentPlugin {
	constructor(options) {
		this.options = options
	}
	apply(compiler) {
		compiler.outputFileSystem = fs
		compiler.inputFileSystem = fs
	}
}

module.exports = NodeEnvironmentPlugin
