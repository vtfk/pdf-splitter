require('dotenv').config()

module.exports = {
  pdftkExe: process.env.PDFTK_EXT || 'C:/Program Files (x86)/PDFtk/bin/pdftk'
}
