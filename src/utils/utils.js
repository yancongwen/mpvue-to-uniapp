const chalk = require('chalk')

function log(msg, type = 'success') {
    if (type === 'error') {
        return console.log(chalk.red(`[mpvue-to-uniapp]: ${msg}`))
    } else if (type === 'info') {
        console.log(chalk.blue(msg))
    } else if (type === 'warn') {
        console.log(chalk.yellow(msg))
    } else {
        console.log(chalk.green(msg))
    }
}

module.exports = {
    log
}
