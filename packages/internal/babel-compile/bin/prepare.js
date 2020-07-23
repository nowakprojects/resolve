const { exec: execCallback } = require('child_process')

const tscPath = require.resolve('typescript/bin/tsc')

const exec = (cmd, opts = {}) =>
  new Promise((resolve, reject) => {
    const child = execCallback(cmd, opts, err => (err ? reject('') : resolve()))

    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
  })

const prepare = async ({ directory, sourceType }) => {
  if (['ts', 'tsx'].includes(sourceType)) {
    try {
      return exec(`node "${tscPath}"`, { cwd: directory })
    } catch (error) {
      throw Error('')
    }
  }
}

module.exports = { prepare }
