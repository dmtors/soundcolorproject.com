
const runAll = (funcs) => (on, originalConfig) =>
  funcs.reduce((config, func) => {
    return func(on, config) || config
  }, originalConfig)

module.exports = runAll([
  require('./cucumber'),
  require('./fixCI'),
  require('./readConfig'),
  require('./tasks')
])
