const { AsyncSeriesHook, SyncBailHook, SyncHook, AsyncParallelHook } = require('tapable')
const NormalModuleFactory = require('./NormalModuleFactory')
class Compiler {
	constructor(context, options) {
		this.hooks = {
			entryOption: new SyncBailHook(['context', 'entry']),
			beforeRun: new AsyncSeriesHook(['compiler']), // 运行前
			run: new AsyncSeriesHook(['compiler']), // 开始运行
			beforeCompile: new AsyncSeriesHook(['params']), // 编译前
			compile: new SyncHook(['params']), // 开始编译
			make: new AsyncParallelHook(['compilation']), // 构建
			finishMake: new AsyncSeriesHook(['compilation']), // 完成构建
			afterCompile: new AsyncSeriesHook(['compilation']), // 完成编译
			thisCompilation: new SyncHook(['compilation', 'params']), // 开始一次新的编译
			compilation: new SyncHook(['compilation', 'params']), // 完成一个新的compilation
		}
		this.context = context
		this.options = options
	}
	compile(callback) {
		const params = this.newCompilationParams()
		this.hooks.beforeCompile.callAsync(params, (err) => {
			if (err) callback(err)
			this.hooks.compile.call(params)
			// 创建compilation
			const compilation = this.newCompilation(params)
			this.hooks.make.callAsync(compilation, (err) => {
				console.log('hook make')
				callback()
			})
		})
	}
	createCompilation() {}
	newCompilation(params) {
		const compilation = this.createCompilation()
		this.hooks.thisCompilation.call(this, params)
		this.hooks.compilation.call(this, params)
		return compilation
	}
	newCompilationParams() {
		const params = {
			// 创建普通模块工厂
			normalModuleFactory: new NormalModuleFactory(),
		}
		return params
	}
	run(callback) {
		// 编译完成 最终的回调
		const finalCallback = (err, stats) => {
			callback(err, stats)
		}
		const onCompiled = (err, compilation) => {
			const stats = {
				toJson: function () {
					return {
						assets: [],
						chunks: [],
						modules: [],
						entrypoints: [],
					}
				},
			}
			finalCallback(err, stats)
		}
		this.hooks.beforeRun.callAsync(this, (err) => {
			this.hooks.run.callAsync(this, (err) => {
				this.compile(onCompiled)
			})
		})
	}
}

module.exports = Compiler
