## 👨‍💻 Autor

Desenvolvido por **Emerson Botelho Mangabeira** com foco em tecnologia, estética e inovação.  
Contato: [ebmangabeira@gmail.com](mailto:ebmangabeira@gmail.com)

# All4esthetic

Site institucional e catálogo digital desenvolvido em **Next.js**, focado em equipamentos e soluções estéticas.  
O projeto segue boas práticas de **UX/UI**, é totalmente **responsivo** e preparado para futuras integrações com catálogos e APIs.

---

## 🚀 Tecnologias

- [Next.js 15](https://nextjs.org/) — framework React
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Bootstrap 5](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Swiper.js](https://swiperjs.com/) — carrosséis
- [AOS](https://michalsnik.github.io/aos/) — animações on scroll
- [Glightbox](https://glightbox.mcstudios.com.mx/) — lightbox responsivo
- [Drift Zoom](https://github.com/imgix/drift) — zoom em imagens
- [Isotope](https://isotope.metafizzy.co/) — filtragem dinâmica
- [ImagesLoaded](https://imagesloaded.desandro.com/) — carregamento inteligente de imagens
- [TailwindCSS 4](https://tailwindcss.com/) (configurado, mas opcional)
- Customização em `/public/assets/css/custom.css`

---

## 📂 Estrutura do Projeto

```
all4esthetic/
├── public/
│   ├── assets/
│   │   ├── css/        # Estilos customizados
│   │   ├── img/        # Imagens do site
│   │   └── data/       # JSON de equipamentos
├── src/
│   ├── app/            # Páginas (App Router)
│   │   ├── page.tsx            # Home
│   │   ├── equipamentos/       # Lista de equipamentos
│   │   ├── detalhes/           # Página de detalhes
│   │   ├── quem-somos/         # Institucional
│   │   ├── contacto/           # Contato
│   │   ├── termos/             # Termos de Uso
│   │   ├── aviso-legal/        # Aviso Legal
│   │   └── politica-privacidade/ # Política de Privacidade
│   └── components/     # Header, Footer, Banner de Cookies etc.
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Como Rodar Localmente

```bash
# 1. Clonar repositório
git clone https://github.com/seu-usuario/all4esthetic.git
cd all4esthetic

# 2. Instalar dependências
npm install

# 3. Rodar em ambiente de desenvolvimento
npm run dev

# 4. Abrir no navegador
http://localhost:3000
```

---

## 🛠️ Scripts Disponíveis

- `npm run dev` → Inicia ambiente de desenvolvimento
- `npm run build` → Cria versão otimizada de produção
- `npm run start` → Inicia servidor de produção
- `npm run lint` → Analisa código com ESLint

---

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto para credenciais e chaves privadas.  
(Exemplo: EmailJS, APIs externas, etc.)

---

## 🌍 Deploy

O projeto pode ser publicado em:

- [Vercel](https://vercel.com/) (recomendado)
- [Netlify](https://www.netlify.com/)
- [Hostinger](https://www.hostinger.pt/) (já em uso)

---

## 👨‍💻 Autor

Desenvolvido por **All4esthetic** com foco em tecnologia, estética e inovação.  
Contato: [geral@all4esthetic.com](mailto:geral@all4esthetic.com)
