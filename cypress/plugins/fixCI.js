
module.exports = (on) => {
  on('before:browser:launch', (browser = {}, opts) => {
    if (browser.name === 'chrome') {
      opts.args.push('--disable-dev-shm-usage')
    }

    return opts
  })
}
