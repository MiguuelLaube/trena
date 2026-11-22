<template>
  <section class="nao-achou">
    <p class="etiqueta">Erro 404</p>
    <h1>Essa medida não existe.</h1>
    <p>A página que você procurou não está no guia. Volte para o início e pegue a trena de novo.</p>
    <RouterLink to="/" class="botao">← Voltar ao início</RouterLink>
  </section>
</template>

<style scoped>
.nao-achou {
  max-width: var(--largura-texto);
}

.nao-achou h1 {
  margin-top: var(--esp-4);
  font-size: var(--texto-titulo);
  text-transform: uppercase;
}

.nao-achou .botao {
  text-decoration: none;
}
</style>
