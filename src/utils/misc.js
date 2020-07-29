export function getPureText(text) {
  return text.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function hexaToRGBA(hexa) {
  let r, g, b, a
  if (hexa.length === 9) {
    r = parseInt(hexa.slice(1, 3), 16)
    g = parseInt(hexa.slice(3, 5), 16)
    b = parseInt(hexa.slice(5, 7), 16)
    a = parseInt(hexa.slice(7, 9), 16)
  } else {
    r = parseInt(hexa.slice(1, 2), 16)
    g = parseInt(hexa.slice(2, 3), 16)
    b = parseInt(hexa.slice(3, 4), 16)
    a = parseInt(hexa.slice(4, 5), 16)
  }
  return `${r},${g},${b},${a}`
}

export function makeColorTableParameter(colorTable) {
  console.log(colorTable)
  let ctp = ''
  colorTable.forEach((item, index) => {
    ctp += ((index > 0) ? '-':'') + item[0] + ':' + hexaToRGBA(item[1])
  })
  return ctp
}
