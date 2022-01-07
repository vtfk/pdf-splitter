const pdftk = require('node-pdftk')
const path = require('path')
const options = require('../config')
const fs = require('fs')

pdftk.configure({
  bin: options.pdftkExe,
  Promise: require('bluebird'),
  ignoreWarnings: true,
  tempDir: path.join(__dirname, './tempDir')
})

module.exports = async (pdf, ranges, outputDir) => {
  if (!pdf) throw new Error('Missing required argument "pdf"')
  if (!ranges) throw new Error('Missing required argument "ranges"')

  const outputDirectory = outputDir || path.dirname(pdf)
  if (!fs.existsSync(outputDirectory)) fs.mkdirSync(outputDirectory)

  const res = {
    success: [],
    failed: []
  }
  let counter = 0
  for (const range of ranges) {
    counter++
    try {
      await pdftk.input({ PDF: pdf }).cat(`PDF${range}`).output(`${outputDirectory}/${path.basename(pdf).replace(/\.[^/.]+$/, '')}-${counter}.pdf`) // Splits the input pdf in the specifix range, and saves the resulting pdfs in output folder
      res.success.push({ range })
    } catch (error) {
      res.failed.push((error === 1) ? { range, error: 'Probably something wrong with the range, or pdf does not exist, or something else... Sorry' } : { range, error })
    }
  }
  return res
}
