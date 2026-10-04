#!/usr/bin/env node

const { writeFileSync } = require('fs')
const { join } = require('path')
const pkg = require('../package.json')
delete pkg.devDependencies

writeFileSync(join(__dirname, '../package.json'), JSON.stringify(pkg, null, 2))
