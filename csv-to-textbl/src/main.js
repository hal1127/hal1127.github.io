import $ from 'jquery'
import ClipboardJS from 'clipboard'

function convertToLatexTable(val) {
  if (val.trim() === '') return ''
  const csvArr = val.trim().split('\n')
  const colLength = (csvArr[0].match(/[^\\]\,/g) || []).length

  const divideChar = (mode === 'csv' ? ',' : '\t')
  const tblArr = csvArr.map(x => x.replaceAll(divideChar, ' & '))
  const tbl = tblArr.map(x => '    '+x+' \\\\\\hline\n').join('')

  let latexTbl = latexTblHead.replace('$colstyle$', '|c'.repeat(colLength+1)+'|') + tbl + latexTblFoot

  return latexTbl
}

const latexTblHead = `\\begin{table}[tb]\\center
  \\caption{表タイトル}
  \\begin{tabular}{$colstyle$}\\hline
`
const latexTblFoot = `  \\end{tabular}
  \\label{t:label}
\\end{table}
`

let mode = 'csv'
$('#mode-select').on('change', function() {
  mode = $(this).val()

  if (mode === 'Excel') $('#notion').text('*コピペ専用')
  else $('#notion').text('')

  $('#mode').text(mode)
  $('title').text(`${mode}→latexのtable`)

  const latexTbl = convertToLatexTable($('#csv').val())
  $('#tbl').val(latexTbl)
})

$('#csv').on('keyup', function() {
  const latexTbl = convertToLatexTable($(this).val())
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
