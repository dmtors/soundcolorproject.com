#!/usr/bin/env node

const { join } = require('path')
const { spawnSync } = require('child_process')
const { type } = require('os')
const glob = require('glob')
const files = glob.sync('./site/**/*.{vert,frag}')
const osType = type()
let glslBinary
if (osType === 'Linux') {
  glslBinary = join(__dirname, 'bin/glslangValidator')
} else if (osType === 'Darwin') {
  glslBinary = join(__dirname, 'bin/glslangValidator-darwin')
} else {
  throw new Error(`OS type ${osType} not supported`)
}

spawnSync('chmod', ['+x', glslBinary])
const result = spawnSync(glslBinary, files, { stdio: 'inherit' })

process.exit(result.status)
