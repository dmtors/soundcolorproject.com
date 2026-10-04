
const DEV = 'development'

module.exports = (_on, config) => {
  const { configFile = DEV } = config.env
  console.log(`Using config '${configFile}'`)
  const envConfig = require(`../config/${configFile}.json`)

  if (envConfig.baseUrl){
    envConfig.baseUrl = envConfig.baseUrl.replace('${PORT}', process.env.PORT || '9000')
  }

  return Object.assign(
    config,
    envConfig,
  )
}
