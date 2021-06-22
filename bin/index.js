#! /usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

const transform = require('../src/index')
const { log } = require('../src/utils/utils')
const pkg = require('../package.json')

process.on('exit', () => console.log())

program
    .version(pkg.version)
    .usage('[options]')
    .option('-i, --input', 'the input path for weixin miniprogram project')
    .parse(process.argv)

program.on('--help', function () {
    console.log()
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # transform a mpvue project to uni-app project'))
    console.log()
    console.log('    $ mpvue2uinapp -i ./miniprogramProject')
    console.log()
})

let src = program.args[0] || ''

src = path.resolve(process.cwd(), src)

if (!fs.existsSync(src)) {
    log(`The source folder dose not exist: ${src}`)
    process.exit()
}

transform(src)
