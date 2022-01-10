const pdftk = require('node-pdftk')
const path = require('path')
const options = require('../config')
const fs = require('fs')
const getRangesFromKeyword = require('./getRangesFromKeyword')

pdftk.configure({
  bin: options.pdftkExe,
  Promise: require('bluebird'),
  ignoreWarnings: true,
  tempDir: path.join(__dirname, './tempDir')
})

module.exports = async (options) => {
  if (!options) throw new Error('Missing required argument "options"')
  if (!options.pdf) throw new Error('Missing required argument "options.pdf"')
  if (!options.ranges && !options.keywords) throw new Error('Missing required argument "options.ranges" or "options.keywords"')

  if (!fs.existsSync(options.pdf)) throw new Error(`Given pdf-path ${options.pdf}, does not exist`)

  const outputDirectory = options.outputDir || path.dirname(options.pdf)
  if (!fs.existsSync(outputDirectory)) fs.mkdirSync(outputDirectory)
  const outputPdfName = options.outputName ? options.outputName.replace(/\.[^/.]+$/, '') : path.basename(options.pdf).replace(/\.[^/.]+$/, '')

  const ranges = options.ranges ? options.ranges : await getRangesFromKeyword(options.pdf, options.keywords, options)

  const res = {
    success: [],
    failed: []
  }
  let counter = 0
  for (const range of ranges) {
    counter++
    try {
      await pdftk.input({ PDF: options.pdf }).cat(`PDF${range}`).output(`${outputDirectory}/${outputPdfName}-${counter}.pdf`) // Splits the input pdf in the specifix range, and saves the resulting pdfs in output folder
      res.success.push({ range })
    } catch (error) {
      res.failed.push((error === 1) ? { range, error: 'Probably something wrong with the range or something else... Sorry' } : { range, error })
    }
  }
  return res
}
