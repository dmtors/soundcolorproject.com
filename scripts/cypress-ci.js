#!/usr/bin/env node

const startTime = Date.now()
process.env.DEV = true
const { startup } = require('../dist/server/startup')
const { join } = require('path')
const { rmdirSync } = require('fs')
const child_process = require('child_process')
const cypress = require('cypress')
const { merge } = require('mochawesome-merge')
const generator = require('mochawesome-report-generator')

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let cypressDone = false
const children = []
const origSpawn = child_process.spawn
child_process.spawn = (...args) => {
  const child = origSpawn.apply(child_process, args)
  children.push(child)
  return child
}

function stopCypress () {
  if (cypressDone) return
  message('stopping cypress...')
  children.forEach(child => {
    child.kill()
  })
  cypressDone = true
}

function exit (code) {
  stopCypress()
  process.exit(code)
}

const TEN_MINUTES = 10 * 60 * 1000
async function tryRunCypress () {
  let result = {}

  const runPromise = cypress.run({
    browser: 'chrome',
    headless: true,
    env: {
      configFile: 'ci',
    },
    key: process.env.CYPRESS_KEY,
    record: !!process.env.CYPRESS_KEY,
  }).then((r) => {
    message('cypress finished')
    return r
  })

  sleep(TEN_MINUTES).then(stopCypress)

  result = await runPromise
  cypressDone = true

  if (result.totalFailed) {
    return result.totalFailed
  } else if (result.message) {
    return 1
  }

  return 0
}

const sections = [
  ['┌──', '──┐'],
  ['│  ', '  │'],
  ['└──', '──┘'],
]
function message (msg) {
  const time = (Date.now() - startTime) / 1000
  let bar = ''
  for (let i = 0; i < msg.length; i++) {
    bar += '─'
  }
  console.log(`\n\n${time}s`)
  console.log(`${sections[0][0]}${bar}${sections[0][1]}`)
  console.log(`${sections[1][0]}${msg}${sections[1][1]}`)
  console.log(`${sections[2][0]}${bar}${sections[2][1]}`)
}

const reportDir = join(__dirname, '../cypress/report')
async function main () {
  await startup()
  rmdirSync(reportDir, { recursive: true })

  message('Running cypress tests')
  const failures = await tryRunCypress()

  message('Combining test results')
  const jsonReport = await merge({
    files: [join(reportDir, 'mochawesome*.json')],
  })

  message('Generating html report')
  await generator.create(jsonReport, {
    reportDir,
    reportFilename: 'index.html',
    reportTitle: 'Cypress report',
  })

  message('Done!')
  exit(failures)
}

main().catch(err => {
  console.error(err)
  message(`Exiting...`)
  exit(127)
})