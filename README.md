## 👨‍💻 Autor

Desenvolvido por **Emerson Botelho Mangabeira** com foco em tecnologia, estética e inovação.  
Contato: [ebmangabeira@gmail.com](mailto:ebmangabeira@gmail.com)

# All4esthetic — Catálogo e Site Institucional

Projeto **Next.js (App Router) + TypeScript + Tailwind v4 + Bootstrap 5** para apresentar o catálogo de equipamentos estéticos da All4esthetic.  
Inclui **lista com filtros e paginação**, **página de detalhes**, **banner de cookies acessível**, **páginas legais** e **componentes utilitários** (preloader, voltar ao topo, etc.).

> Atualizado em **2025-09-03** a partir do código enviado (`all4esthetic.zip`).

---

## ✨ Principais recursos

- **Next.js 15** (App Router) + **React 19** com componentes client-side (`"use client"`).
- **Tailwind CSS v4** + **Bootstrap 5.3** + **Bootstrap Icons**.
- **Animações e UI**: AOS (on-scroll), GLightbox (galeria), Swiper (carrossel), Drift Zoom (zoom), Isotope + ImagesLoaded (grid e filtros), Framer Motion.
- **Acessibilidade**:
  - Navegação por teclado no header (Enter/Espaço ativa links).
  - `aria-*`, `role`, rótulos e foco visível em elementos interativos.
  - **Cookie banner** com `aria-live`, `role="dialog"`, botões com rótulos claros.
- **Páginas legais**: Termos de Uso, Aviso Legal, Política de Privacidade.
- **SEO básico** por `metadata` nas rotas e ícones (`favicon`, `apple-touch-icon`).

---

## 🧱 Estrutura do projeto

```
.
├─ package.json
├─ package-lock.json
├─ next.config.ts
├─ tailwind.config.ts
├─ tsconfig.json
├─ eslint.config.mjs
├─ .gitignore
├─ README.md
├─ public/
│  └─ assets/
│     ├─ css/
│     │  └─ custom.css
│     ├─ data/
│     │  └─ equipamentos.json
│     └─ img/
│        └─ equipments/
│           ├─ E007/ (E007-1.webp, E007-2.webp, ...)
│           ├─ E012V1/ (E012V1-1.webp, E012V1-2.webp, ...)
│           ├─ E055/ (E055-1.webp, E055-2.webp, ...)
│           ├─ E174/ (E174-1.webp, E174-2.webp, ...)
│           ├─ E184/ (E184-1.webp, E184-2.webp, ...)
│           └─ …
├─ src/
│  ├─ components/
│  │  ├─ AOSReady.tsx
│  │  ├─ Container.tsx
│  │  ├─ CookieBanner.tsx
│  │  ├─ Footer.tsx
│  │  ├─ HashModalOpener.tsx
│  │  ├─ Header.tsx
│  │  ├─ Preloader.tsx
│  │  └─ ScrollTop.tsx
│  └─ app/
│     ├─ layout.tsx
│     ├─ page.tsx               (Home / Catálogo resumido)
│     ├─ equipamentos/
│     │  ├─ metadata.ts
│     │  └─ page.tsx            (Lista, filtros, paginação)
│     ├─ detalhes/
│     │  ├─ metadata.ts
│     │  └─ page.tsx            (Ficha técnica por ID via query)
│     ├─ contacto/
│     │  └─ page.tsx
│     ├─ quem-somos/
│     │  └─ page.tsx
│     ├─ termos/
│     │  └─ page.tsx
│     ├─ aviso-legal/
│     │  └─ page.tsx
│     └─ politica-privacidade/
│        └─ page.tsx
```
> *Obs.:* `node_modules` e `.next` foram omitidos. As imagens em `public/assets/img/equipments/**` seguem convenção `{ID}/{ID}-{n}.webp`.

---

## 🗂️ Conteúdo dinâmico (catálogo)

A fonte de dados do catálogo é **`public/assets/data/equipamentos.json`**.  
Cada item possui a estrutura (exemplo simplificado):

```jsonc
{
  "id": "E007",
  "name": "Electroestimulação",
  "designação": "…",
  "detalhe": "…",
  "ref": "E007",
  "code_rev": "FTE007.05",
  "functions": [{ "nome": "…", "descricao": "…" }],
  "technical_data": { "Potência:": "35 W", "Voltagem:": "110V/220V" },
  "logistics": { "Dimensões:": "…", "Peso:": "…" },
  "legislation": ["LVD 2014/35/EU", "ROSH 2011/65/EU"],
  "application": "Apenas para uso estético.",
  "image": "assets/img/equipments/E007/E007-1.webp",
  "images": ["assets/img/equipments/E007/E007-1.webp", "…"],
  "category": "Electroestimulação",
  "sale": true,
  "rental": { "diario": false, "bidiario": false, "semanal": false, "mensal": false }
}
```

### Como adicionar/editar equipamentos
1. **Imagens**: crie `public/assets/img/equipments/{ID}/` e adicione `{ID}-1.webp`, `{ID}-2.webp`, etc.
2. **Dados**: adicione/edite o objeto correspondente em `equipamentos.json`.
3. **Categoria**: use uma das existentes ou crie uma nova (fica visível nos filtros).
4. **Venda/Aluguer**: `sale: true/false` e `rental: { diario|bidiario|semanal|mensal }`.
5. **Rebuild**: execute `npm run build` ou `npm run export` (ver abaixo).

> A lista/página de detalhes buscam o JSON diretamente de **`/assets/data/equipamentos.json`** via `fetch()` no client.  

---

## ⚙️ Requisitos

- **Node.js 18.18+** (recomendado **20+**)
- **npm 9+** (ou superior)

---

## ▶️ Como rodar localmente

```bash
# 1) Instalar dependências
npm install

# 2) Ambiente de desenvolvimento (HMR)
npm run dev

# 3) Build de produção
npm run build

# 4) Servir build de produção
npm start  # (usa .next/)

# 5) Export estático (somente páginas estáticas)
npm run export  # gera ./out/ para hospedagem estática
```

> O projeto carrega várias bibliotecas via **CDN** em `src/app/layout.tsx` (Bootstrap, Swiper, AOS, GLightbox, Drift, ImagesLoaded, Isotope, PureCounter). Em ambiente offline, considere bundlar localmente ou garantir acesso às CDNs.

---

## 🚀 Deploy

### Opção A — Vercel (recomendado para Next.js)
- Conecte o repositório e use *build command* padrão (`next build`).
- Para **static export**, publique o diretório `out/`.

### Opção B — Netlify / GitHub Pages
- Gere `out/` via `npm run export` e publique como site estático.

### Opção C — Hostinger
- **Hospedagem estática**: suba o conteúdo de `out/` para `public_html/`.
- **Hospedagem Node** (VPS/Cloud): rode `npm run build && npm start` por *PM2* ou serviço equivalente.

---

## 🧩 Componentes de UX incluídos

- **Header** com realce da rota ativa e suporte a teclado (Enter/Espaço).
- **Preloader** (`<Preloader />`) com *fallback* e timeout configurável.
- **Scroll to Top** (`<ScrollTop />`) com visibilidade após rolagem.
- **Cookie Banner** acessível com persistência via `document.cookie`.
- **AOS Ready** para inicialização/resgate de visibilidade em elementos `data-aos`.
- **HashModalOpener**: abre *modals* (Bootstrap) quando a hash da URL aponta para `#modal…`.

---

## 🧪 Qualidade de código

- **TypeScript** com **ESLint** (`eslint.config.mjs`).
- Tailwind v4 (config mínima) + utilitários em `public/assets/css/custom.css`.
- `.gitignore` preparado para `node_modules`, `.next`, `out`, `.env*` etc.

---

## 🔐 Privacidade & Legais

- Páginas dedicadas: **/termos**, **/aviso-legal**, **/politica-privacidade**.
- Cookie banner com **aceitar/rejeitar** e links para as páginas legais.

---

## 📈 Roadmap sugerido

- Multi-idioma (i18n) e geolocalização de conteúdo.
- Pesquisa textual por *full-text* (Fuse.js) e coleções salvas.
- Painel de CMS (p.ex. leitura do JSON via API/Headless CMS).
- Testes de acessibilidade (axe), *lighthouse* e melhorias contínuas.
- Versão *white-label* com *tokens* de marca (cores, tipografia).

---

## 👤 Autor & Contato

Desenvolvido por **All4esthetic**.  
📧 E-mail: **geral@all4esthetic.com**

---

## 📄 Licença

Definir licença do repositório (por ora, todos os direitos reservados a All4esthetic).