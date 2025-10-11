# 🐾 ONG Amicão — Plataforma Web

## 📖 Sobre o Projeto
A **Amicão** é uma ONG fictícia dedicada ao resgate, acolhimento e adoção responsável de animais em situação de abandono.  
Este projeto foi desenvolvido como atividade acadêmica, aplicando fundamentos de **HTML5, CSS3 e JavaScript** para construir uma plataforma web completa, responsiva, acessível e otimizada.

---

## 🚀 Funcionalidades
- **Página inicial (index.html):** missão, visão, valores e contato.  
- **Projetos (projeto.html):** iniciativas como lares temporários, doações e voluntariado.  
- **Adoção (adote.html):** galeria de animais disponíveis para adoção com cards responsivos.  
- **Cadastro (cadastro.html):** formulário validado com máscaras e busca automática de endereço (ViaCEP).  
- **Lojinha (lojinha.html):** produtos para arrecadação, com cards e preços.  
- **Histórias (historias.html):** depoimentos reais de adoções bem-sucedidas.  
- **FAQ (faq.html):** perguntas frequentes sobre adoção, doações, voluntariado e cuidados com animais.  

---

## 🛠️ Tecnologias Utilizadas
- **HTML5 semântico:** estrutura limpa e validada (W3C).  
- **CSS3 moderno:** design system com variáveis, grid de 12 colunas, flexbox, responsividade (5 breakpoints).  
- **JavaScript (modular):**  
  - Máscaras de CPF, telefone e CEP.  
  - Validação extra (maioridade e CPF válido).  
  - Integração com **API ViaCEP** para preenchimento automático de endereço.  
- **Acessibilidade (WCAG 2.1 AA):**  
  - Navegação por teclado.  
  - Alto contraste e modo escuro (suporte via `prefers-color-scheme`).  
  - Estrutura com landmarks (`header`, `nav`, `main`, `footer`).  

---

## 📂 Estrutura de Pastas
ong-amicao/
├── index.html
├── projeto.html
├── adote.html
├── lojinha.html
├── cadastro.html
├── historias.html
├── faq.html
├── css/
│ └── style.css
├── js/
│ └── cep-masks.js
└── imagens/
├── ...



---

## 🔒 Acessibilidade e SEO
- Todas as páginas usam **meta tags otimizadas** e **descrições**.  
- Imagens possuem `alt`, `width/height` e `loading="lazy"`.  
- Estrutura semântica garante boa indexação e leitura por leitores de tela.  

---

## 🌐 Deploy
O projeto está publicado via **GitHub Pages**.  
> 🔗 [Acesse aqui a versão online](https://github.com/pitarell/Aula-Programa-o-Web)

---

## 📜 Licença
Este projeto é de uso acadêmico e educativo.  
Todos os direitos reservados © 2025 — ONG Amicão (fictícia).