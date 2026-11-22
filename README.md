# 📏 Trena — guia interativo de responsividade

> Meça antes de cortar.

Guia feito em **Vue 3 + Vite** para o Projeto de Revisão "Responsividade" — Análise e Desenvolvimento de Sistemas, Faculdade de Tecnologia SENAI Félix Guisard.

**Autor:** Miguel Viana Laube — RA 26180746

- 🌐 Site publicado: https://miguuellaube.github.io/trena/
- 📱 Print no celular: ver `docs/celular.png`

## Seções (uma rota cada)

| # | Rota | Conteúdo | Laboratórios |
|---|------|----------|--------------|
| 01 | `/por-que-importa` | meta viewport, layout fluido, mobile-first | Celular com e sem a meta viewport |
| 02 | `/unidades` | px, rem, em, %, fr, vw, vh, dvh, ch | Conversor de unidades → px · px × rem (fonte do navegador) |
| 03 | `/flexbox-e-grid` | 1D × 2D, justify/align/wrap/gap, auto-fit + minmax | Painel do Flexbox · Régua do Grid |
| 04 | `/imagens` | max-width, width/height, lazy, aspect-ratio, object-fit, srcset | O texto que pula (CLS) · object-fit + srcset |
| 05 | `/boas-praticas-vue` | pastas, nomes, props, :key, tokens, Web Vitals, rotas lazy | v-for com e sem :key (+ API Dog CEO) · Medidor de Web Vitals |
| 06 | `/desafio` | pergunta da dupla respondida com o próprio guia | — |

Extra: **a trena** — indicador fixo no canto com a largura da janela e o breakpoint ativo (liga/desliga no menu).

Cada seção tem: explicação curta, código comentado, resposta da pergunta-guia visível e fontes consultadas.

## Regras técnicas atendidas

- Vue 3 + Vite criado com `npm create vue@latest` (Router + Pinia + ESLint)
- Vue Router com uma rota por seção, todas carregadas **sob demanda** (`() => import()`)
- Pinia (`stores/progresso.js`): seções visitadas, desafio resolvido, trena ligada, escala de fonte
- Consumo de API: `services/animaisApi.js` (Dog CEO API) com timeout e tratamento de erro
- CSS **mobile-first**: só `@media (min-width: ...)`, nenhum `max-width` em media query
- Fontes e espaçamentos em `rem`; cores, fontes e espaçamentos como variáveis em `:root` (`src/assets/tokens.css`)
- Sem rolagem horizontal (testado em 320, 360, 768 e 1280px)
- No celular o menu vira botão; a partir de 64rem vira barra lateral

## Estrutura

```
src/
├── assets/        tokens.css (design tokens) e base.css
├── components/
│   ├── layout/    TheMenu, TheRodape, TheTrenaIndicador
│   ├── guia/      BaseCodigo, BaseLab, BasePergunta, BaseFontes, BaseMiniatura, SecaoLayout
│   └── labs/      um componente por laboratório
├── composables/   useJanela, useTamanhoElemento
├── data/          secoes.js, equipe.js
├── router/
├── services/      animaisApi.js
├── stores/        progresso.js
└── views/         uma tela por rota
```

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera a pasta dist/
npm run lint
```

Requer Node 22.18+ (ou 24.12+).

## Publicando

**GitHub Pages (atual):** o workflow `.github/workflows/pages.yml` roda a cada push na `main`, gera o build com `npm run build:pages` (base `/trena/`) e publica a pasta `dist` na branch `gh-pages`. O `404.html` é uma cópia do `index.html`, para as rotas do Vue Router funcionarem ao abrir um link direto.

**Vercel (recomendado):** importe o repositório em vercel.com → framework "Vite" → Deploy. O `vercel.json` já redireciona todas as rotas para o `index.html` (senão abrir `/unidades` direto dá 404).

**Netlify:** build `npm run build`, pasta `dist`. O arquivo `public/_redirects` já cuida das rotas.
