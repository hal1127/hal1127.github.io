import $ from 'jquery'
import ClipboardJS from 'clipboard'

const latexTblHead = `\\begin{table}[tb]\\center
  \\caption{表タイトル}
  \\begin{tabular}{$colstyle$}\\hline
`
const latexTblFoot = `  \\end{tabular}
  \\label{t:label}
\\end{table}
`

$('#csv').on('keyup', function() {
  const csvArr = $('#csv').val().trim().split('\n')
  const colLength = (csvArr[0].match(/[^\\]\,/g) || []).length
  const tblArr = csvArr.map(x => x.replaceAll(',', ' & '))
  const tbl = tblArr.map(x => '    '+x+' \\\\\\hline\n').join('')

  let latexTbl = latexTblHead.replace('$colstyle$', '|c'.repeat(colLength+1)+'|') + tbl + latexTblFoot
  $('#tbl').val(latexTbl)
})

// コピー
let btnClipboard = new ClipboardJS('#copy')
btnClipboard.on('success', function() {
  alert('クリップボードにコピーしました！')
})
btnClipboard.on('error', function() {
  alert('コピーに失敗しました...')
})

