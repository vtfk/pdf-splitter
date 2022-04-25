const getRange = require('../lib/getRangesFromKeyword')
const path = require('path')

test('How do you test this when we need a local installation of something', () => {
  expect('Feels like we cannot...').toBe('Feels like we cannot...')
})

const shouldSuccess = {
  pdf: path.join(__dirname, './inputPdfs/keywordPdf.pdf'),
  oneUniqueKeyword: ['nothing'],
  oneUniqueSentence: ['This is a document'],
  mixedKeywords: ['nothing', 'this is a document', 'but', 'will be'],
  options: {
    onlyPagesWithKeywords: false
  },
  expect: ['1', '2', '3-4', '5-7', '8-9', '10']
}

const shouldSuccessWithOptions = {
  pdf: path.join(__dirname, './inputPdfs/keywordPdf.pdf'),
  oneUniqueKeyword: ['nothing'],
  options: {
    onlyPagesWithKeywords: true
  },
  expect: ['1', '2', '3', '5', '8', '10']
}

const shouldSuccessWithOptions2 = {
  pdf: path.join(__dirname, './inputPdfs/keywordPdf.pdf'),
  oneUniqueKeyword: ['nothing', 'yada yada'],
  options: {
    onlyPagesWithKeywords: false,
    orKeywords: true
  },
  expect: ['1', '2', '3-4', '5-7', '8', '9', '10']
}

const shouldFail = {
  pdf: path.join(__dirname, './inputPdfs/keywordPdf.pdf'),
  notPdf: path.join(__dirname, './inputPdfs/yadayada.pdf'),
  blankPdf: path.join(__dirname, './inputPdfs/blankPdf.pdf'),
  oneNotUniqueKeyword: ['document'],
  oneNotUniqueSentence: ['a document'],
  mixedNotUniqueKeywords: ['document', 'a document'],
  options: {
    onlyPagesWithKeywords: false
  }
}

describe('GetRangesFromKeywords returns correct ranges when', () => {
  test('using one unique keyword', async () => {
    const ranges = await getRange(shouldSuccess.pdf, shouldSuccess.oneUniqueKeyword, shouldSuccess.options)
    expect(ranges).toEqual(shouldSuccess.expect)
  })
  test('using one unique sentence', async () => {
    const ranges = await getRange(shouldSuccess.pdf, shouldSuccess.oneUniqueSentence, shouldSuccess.options)
    expect(ranges).toEqual(shouldSuccess.expect)
  })
  test('using both sentence and keyword', async () => {
    const ranges = await getRange(shouldSuccess.pdf, shouldSuccess.mixedKeywords, shouldSuccess.options)
    expect(ranges).toEqual(shouldSuccess.expect)
  })
  test('using option "onlyPagesWithKeywords" (only returns the pages with keywords on it)', async () => {
    const ranges = await getRange(shouldSuccessWithOptions.pdf, shouldSuccessWithOptions.oneUniqueKeyword, shouldSuccessWithOptions.options)
    expect(ranges).toEqual(shouldSuccessWithOptions.expect)
  })
  test('using option "orKeywords" (returns the pages with at least ONE keywords on it)', async () => {
    const ranges = await getRange(shouldSuccessWithOptions2.pdf, shouldSuccessWithOptions2.oneUniqueKeyword, shouldSuccessWithOptions2.options)
    expect(ranges).toEqual(shouldSuccessWithOptions2.expect)
  })
})

describe('GetRangesFromKeywords throws error when', () => {
  test('input pdf does not exist', async () => {
    await expect(getRange(shouldFail.notPdf, shouldFail.oneNotUniqueKeyword, shouldFail.options)).rejects.toThrow('')
  })
  test('input pdf does not have any text in it', async () => {
    await expect(getRange(shouldFail.blankPdf, shouldFail.oneNotUniqueKeyword, shouldFail.options)).rejects.toThrow('Could not find any text in the pdf. Cannot split on keywords when no words exist in the document, please check the pdf')
  })
  test('keyword is not unique for the document', async () => {
    await expect(getRange(shouldFail.pdf, shouldFail.oneNotUniqueKeyword, shouldFail.options)).rejects.toThrow('Found several occurences of all keywords on page')
  })
  test('sentence is not unique for the document', async () => {
    await expect(getRange(shouldFail.pdf, shouldFail.oneNotUniqueSentence, shouldFail.options)).rejects.toThrow('Found several occurences of all keywords on page')
  })
  test('sentence and word is not unique for the document', async () => {
    await expect(getRange(shouldFail.pdf, shouldFail.mixedNotUniqueKeywords, shouldFail.options)).rejects.toThrow('Found several occurences of all keywords on page')
  })
})
