// Camada de serviço: os componentes não sabem COMO os dados chegam,
// só chamam buscarRacasDeCachorro(). Se a API mudar, só este arquivo muda.

const URL_RACAS = 'https://dog.ceo/api/breeds/list/all'

/**
 * Busca a lista de raças da Dog CEO API e devolve `quantidade` raças sorteadas.
 * @param {number} quantidade
 * @returns {Promise<string[]>}
 */
export async function buscarRacasDeCachorro(quantidade = 4) {
  // AbortController: se a API demorar mais de 6s, desistimos
  const controle = new AbortController()
  const limite = setTimeout(() => controle.abort(), 6000)

  try {
    const resposta = await fetch(URL_RACAS, { signal: controle.signal })
    if (!resposta.ok) throw new Error(`A API respondeu ${resposta.status}`)
    const dados = await resposta.json()
    const racas = Object.keys(dados.message)

    // Embaralha e pega as primeiras
    return racas
      .sort(() => Math.random() - 0.5)
      .slice(0, quantidade)
      .map((r) => `Cão ${r.charAt(0).toUpperCase()}${r.slice(1)}`)
  } finally {
    clearTimeout(limite)
  }
}
