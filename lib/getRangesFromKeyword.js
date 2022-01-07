const pdfReader = require('@vtfk/pdf-text-reader')

module.exports = async (pdfPath, keywords, options) => {
    if (!options) options = {}
    const pages = {}
    const pagesWithKeywords = []
    const pdfText = (await pdfReader(pdfPath)).textContent
    for (const item of pdfText) {
        if (!pages[item.page]) pages[item.page] = []
        pages[item.page].push(item.str.toLowerCase())
    }

    console.log(pages)


    for (const page in pages) {
        const hasKeywords = keywords.every((word) => pages[page].includes(word.toLowerCase()))
        if (hasKeywords) pagesWithKeywords.push(parseInt(page))
    }

    if (options.onlyPagesWithKeywords) {
        const res = pagesWithKeywords.map(page => page.toString())
        return res
    }
    else {
        const res = []
        for (let i=0; i<pagesWithKeywords.length-1; i++) {
            res.push((pagesWithKeywords[i]+1 === pagesWithKeywords[i+1]) ? pagesWithKeywords[i].toString() : `${pagesWithKeywords[i].toString()}-${(pagesWithKeywords[i+1]-1).toString()}`)
        }
        if (pagesWithKeywords[pagesWithKeywords.length-1] === Object.keys(pages).length) {
            res.push(pagesWithKeywords[pagesWithKeywords.length-1].toString())
        } else {
            res.push(`${pagesWithKeywords[pagesWithKeywords.length-1].toString()}-${(Object.keys(pages)[Object.keys(pages).length-1]).toString()}`)
        }
        return res
    }

}