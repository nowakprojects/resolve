import { sync as glob } from 'glob'

function getAvailableExamples(rootPath) {
  const sources = ['./examples/**/package.json', './templates/**/package.json']

  const packages = sources
    .map((source) =>
      glob(source, {
        cwd: rootPath,
        absolute: true,
        ignore: ['**/node_modules/**', './node_modules/**', '**/dist/**'],
      })
    )
    .flat(1)

  const resolveExamples = []

  for (const filePath of packages) {
    const { name, description, resolveJs } = require(filePath)
    if (!description || !resolveJs || !resolveJs.isAppTemplate) {
      continue
    }
    resolveExamples.push({
      name,
      description,
      path: filePath.replace(rootPath, '').replace('/package.json', ''),
    })
  }

  resolveExamples.sort((a, b) =>
    a.name > b.name ? 1 : a.name < b.name ? -1 : 0
  )

  return resolveExamples
}

module.exports = { getAvailableExamples }
