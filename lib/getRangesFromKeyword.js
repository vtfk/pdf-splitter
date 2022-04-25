const pdfReader = require('@vtfk/pdf-text-reader')

module.exports = async (pdfPath, keywords, options) => {
  if (!options) options = {}

  const pages = {}
  const pagesWithKeywords = []

  let keyW = keywords.filter(w => w.trim().split(' ').length === 1)
  let keyS = keywords.filter(w => !keyW.includes(w))
  keyW = keyW.map(w => w.trim())
  keyS = keyS.map(s => s.trim())

  const pdfText = (await pdfReader(pdfPath)).textContent

  if (pdfText.length === 0) throw new Error('Could not find any text in the pdf. Cannot split on keywords when no words exist in the document, please check the pdf')

  for (const item of pdfText) {
    if (!pages[item.page]) pages[item.page] = { elements: [], words: [], sentence: '' }
    // pages[item.page].elements.push(item.str.toLowerCase())
    pages[item.page].words.push(...item.str.toLowerCase().split(' ').filter(word => /\S/.test(word)))
    pages[item.page].sentence = pages[item.page].words.join(' ')
  }
  if (options.orKeywords) {
    for (const page in pages) {
      const hasKeywords = keyW.some((word) => pages[page].words.includes(word.toLowerCase()))
      const hasKeysentences = keyS.some((sentence) => pages[page].sentence.includes(sentence.toLowerCase()))
      const atLeastOneUniqueKeyOnPage = keyW.some(word => pages[page].sentence.split(word.toLowerCase()).length === 2) || keyS.some(s => pages[page].sentence.split(s.toLowerCase()).length === 2)

      if (hasKeywords || hasKeysentences) {
        if (!atLeastOneUniqueKeyOnPage) {
          throw new Error(`Found several occurences of all keywords on page ${page}. Either use keywords where at least one is unique per document, or check if document contains several or overlapping documents on page ${page}.`)
        } else {
          pagesWithKeywords.push(parseInt(page))
        }
      }
    }
  } else {
    for (const page in pages) {
      const hasKeywords = keyW.every((word) => pages[page].words.includes(word.toLowerCase()))
      const hasKeysentences = keyS.every((sentence) => pages[page].sentence.includes(sentence.toLowerCase()))
      const atLeastOneUniqueKeyOnPage = keyW.some(word => pages[page].sentence.split(word.toLowerCase()).length === 2) || keyS.some(s => pages[page].sentence.split(s.toLowerCase()).length === 2)

      if (hasKeywords && hasKeysentences) {
        if (!atLeastOneUniqueKeyOnPage) {
          throw new Error(`Found several occurences of all keywords on page ${page}. Either use keywords where at least one is unique per document, or check if document contains several or overlapping documents on page ${page}.`)
        } else {
          pagesWithKeywords.push(parseInt(page))
        }
      }
    }
  }

  if (pagesWithKeywords.length === 0) {
    return []
  } else if (options.onlyPagesWithKeywords) {
    const res = pagesWithKeywords.map(page => page.toString())
    return res
  } else {
    const res = []
    for (let i = 0; i < pagesWithKeywords.length - 1; i++) {
      res.push((pagesWithKeywords[i] + 1 === pagesWithKeywords[i + 1]) ? pagesWithKeywords[i].toString() : `${pagesWithKeywords[i].toString()}-${(pagesWithKeywords[i + 1] - 1).toString()}`)
    }
    if (pagesWithKeywords[pagesWithKeywords.length - 1] === Object.keys(pages).length) {
      res.push(pagesWithKeywords[pagesWithKeywords.length - 1].toString())
    } else {
      res.push(`${pagesWithKeywords[pagesWithKeywords.length - 1].toString()}-${(Object.keys(pages)[Object.keys(pages).length - 1]).toString()}`)
    }
    return res
  }
}
