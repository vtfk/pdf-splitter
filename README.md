# pdf-splitter
NodeJS package for splitting pdfs, based on given ranges or keywords. Uses [PDFtk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/) and [node-pdftk](https://www.npmjs.com/package/node-pdftk) for splitting, and [PDF.js](https://www.npmjs.com/package/pdfjs-dist) for pdf-text-reading
## Requirements

Make sure you have [PDFtk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/) installed. Save the path to the executable as an environment variable "PDFTK_EXT".

For example in .env
```
PDFTK_EXT="<installationPath>/PDFtk/bin/pdftk"
``` 

## Installing

```bash
$ npm install @vtfk/pdf-splitter
```

## Usage
### With array of page-ranges
Specify which pages you want to split into new documents

| Description | Value |
| -------- | -------- |
| Page one and three as separate documents | ['1', '3'] |
| Page one to four (inclusive) as doc and page three, six, and eight to ten (inclusive) as doc | ['1-4', '3 6 8-10'] |

```javascript
const splitPdf = require('@vtfk/pdf-splitter')

const pdfToSplit = {
    pdfPath: 'a pdf.pdf',
    ranges: ['1-4', '3 6 8-10', '4 2'],
    outputDir: 'path/to/outputDirectory', // Optional, defaults to directory of the input pdf
    outputName: 'nameForResultingPdfs' // Optional, defaults to the <NameOfPdf>-<index>.pdf
}

const result = await splitPdf(pdfToSplit)
console.log(result)

```

### With array of keywords/sentences
Specify on which keywords/sentences you want to split the document on (EVERY word/sentence must be present for it to split on that page - see option "orKeywords" for the SOME instead of EVERY)

**NOTE:** At least one keyword or sentence must be unique for the document


```javascript
const splitPdf = require('@vtfk/pdf-splitter')

const pdfToSplit = {
    pdfPath: 'a pdf.pdf',
    keywords: ['a unique sentence for the page you want to split on', 'word', 'another'],
    outputDir: 'path/to/outputDirectory', // Optional, defaults to directory of the input pdf
    outputName: 'nameForResultingPdfs' // Optional, defaults to the <NameOfPdf>-<index>.pdf
}

const result = await splitPdf(pdfToSplit)
console.log(result)

```
### Options
options.**onlyPagesWithKeywords**

Only return the pages where the keywords are present as separate documents
```javascript
const splitPdf = require('@vtfk/pdf-splitter')

const pdfToSplit = {
    pdfPath: 'a pdf.pdf',
    keywords: ['a unique sentence for the page you want to split on', 'word', 'another'],
    outputDir: 'path/to/outputDirectory', // Optional, defaults to directory of the input pdf
    outputName: 'nameForResultingPdfs', // Optional, defaults to the <NameOfPdf>-<index>.pdf
    onlyPagesWithKeywords: true
}

const result = await splitPdf(pdfToSplit)
console.log(result)

```
options.**orKeywords**
Only require ONE of the keywords to be present on the page, for it to split on that page
```javascript
const splitPdf = require('@vtfk/pdf-splitter')

const pdfToSplit = {
    pdfPath: 'a pdf.pdf',
    keywords: ['a unique sentence for the page you want to split on', 'word', 'another'], // will split if one of these are present on the page
    outputDir: 'path/to/outputDirectory', // Optional, defaults to directory of the input pdf
    outputName: 'nameForResultingPdfs', // Optional, defaults to the <NameOfPdf>-<index>.pdf
    orKeywords: true // Optional, defaults to false
}

const result = await splitPdf(pdfToSplit)
console.log(result)

```