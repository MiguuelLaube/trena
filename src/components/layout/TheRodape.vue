<template>
  <footer class="rodape">
    <div class="regua" aria-hidden="true"></div>
    <div class="rodape__conteudo">
      <p>
        <strong>Trena</strong> — guia interativo de responsividade · Projeto de Revisão do curso de
        Análise e Desenvolvimento de Sistemas, Faculdade de Tecnologia SENAI Félix Guisard.
      </p>
      <p>Feito em Vue 3 + Vite, mobile-first, sem nenhuma media query com <code>max-width</code>.</p>
    </div>
  </footer>
</template>

<style scoped>
.rodape {
  font-size: var(--texto-p);
  color: var(--cor-tinta-suave);
}

.rodape .regua {
  border-top: var(--borda);
}

.rodape__conteudo {
  padding: var(--esp-5) var(--esp-4) var(--esp-7);
  max-width: var(--largura-texto);
}

.rodape__conteudo p:last-child {
  margin-bottom: 0;
}

@media (min-width: 40rem) {
  .rodape__conteudo {
    padding-inline: var(--esp-6);
  }
}

@media (min-width: 64rem) {
  .rodape__conteudo {
    padding-inline: var(--esp-7);
  }
}
</style>
