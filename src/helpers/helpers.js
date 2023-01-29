const textToSlug = (text, concat = '_') => {
  // remover espaços desnecessários
  text = text.trim()

  // substituir caracteres especiais por sublinhados
  text = text.replace(/[^\w\s]/gi, `${concat}`)

  // substituir espaços em branco por sublinhados
  text = text.replace(/\s+/g, `${concat}`)

  // tornar todas as letras minúsculas
  text = text.toLowerCase()

  return text
}

module.exports = { textToSlug }
