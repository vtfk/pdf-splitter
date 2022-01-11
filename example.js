(async () => {
  const splitPdf = require('./lib/splitPdf')

  const example = {
    pdf: './tests/inputPdfs/keywordPdf.pdf',
    keywords: ['this is a document', 'nothing'],
    outputDir: './tests/outputPdfs/',
    onlyPagesWithKeywords: false,
    outputName: 'm'
  }

  const splitRes = await splitPdf(example)
  console.log(splitRes)

  console.log('Check out the input pdf and the output pdfs in the "tests" folder to see the result of the splitting')
})()
