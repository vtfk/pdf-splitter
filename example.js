(async () => {
  const splitPdf = require('./lib/splitPdf')

  const pdf = './tests/inputPdfs/langPdf.pdf'
  const range = ['1-2', '2-5', '8', '1 4 6', '100', '102']
  const output = './tests/outputPdfs/'

  const splitMan = await splitPdf(pdf, range, output)
  console.log(splitMan)
  console.log('Check out the input pdf and the output pdfs in the "tests" folder to see the result of the splitting')
})()
