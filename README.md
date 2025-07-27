# Pokédex Interativa

Uma Pokédex moderna e interativa construída com HTML, CSS e JavaScript puro, consumindo a PokéAPI.

## ✨ Funcionalidades Implementadas

### 🎯 Funcionalidades Principais
- **Listagem de Pokémons**: Exibe os primeiros 151 Pokémons da primeira geração
- **Cards Interativos**: Cada Pokémon é exibido em um card com design glassmorphism
- **Scroll Infinito**: Carregamento automático de mais Pokémons conforme o usuário rola a página

### 🔍 Busca e Filtros
- **Campo de Busca**: Busca em tempo real por nome do Pokémon
- **Filtro de Favoritos**: Visualizar apenas Pokémons favoritados
- **Filtro Geral**: Alternar entre todos os Pokémons e favoritos

### ⭐ Sistema de Favoritos
- **Marcar Favoritos**: Clique no ícone de coração para favoritar/desfavoritar
- **Persistência**: Favoritos salvos no localStorage
- **Indicador Visual**: Cards favoritados têm borda dourada e ícone preenchido

### 🌙 Dark Mode
- **Alternância de Tema**: Botão para alternar entre tema claro e escuro
- **Persistência**: Preferência de tema salva no localStorage
- **Transições Suaves**: Animações suaves na transição entre temas

### 📱 Modal de Detalhes
Ao clicar em um Pokémon, abre um modal com:
- **Informações Básicas**: Altura, peso e tipos
- **Habilidades**: Lista completa de habilidades (incluindo ocultas)
- **Estatísticas**: Barras visuais para HP, Ataque, Defesa, etc.
- **Sprite Animado**: Imagem animada do Pokémon quando disponível

### ⚖️ Sistema de Comparação
- **Comparação de Pokémons**: Selecione até 3 Pokémons para comparar
- **Modal de Comparação**: Visualização lado a lado das estatísticas
- **Análise Rápida**: Compare facilmente as características dos Pokémons

### 🎨 Design e UX
- **Glassmorphism**: Cards com efeito de vidro fosco
- **Animações Suaves**: Transições e hover effects
- **Ícones de Tipos**: Emojis representando cada tipo de Pokémon
- **Responsividade**: Design adaptável para mobile e desktop
- **Loading States**: Indicadores visuais durante carregamento

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com variáveis CSS e glassmorphism
- **JavaScript ES6+**: Funcionalidades interativas
- **PokéAPI**: Dados dos Pokémons
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia Roboto

## 📁 Estrutura do Projeto

```
js-developer-pokedex/
├── assets/
│   ├── css/
│   │   ├── global.css      # Estilos globais e tema
│   │   └── pokedex.css     # Estilos específicos da Pokédex
│   └── js/
│       ├── main.js         # Lógica principal da aplicação
│       ├── poke-api.js     # Integração com a PokéAPI
│       ├── pokemon-model.js # Modelo de dados do Pokémon
│       └── type-icons.js   # Mapeamento de ícones por tipo
├── index.html              # Página principal
└── README.md              # Documentação
```

## 🚀 Como Usar

1. Clone o repositório
2. Abra o arquivo `index.html` em um navegador
3. Explore as funcionalidades:
   - Use a busca para encontrar Pokémons específicos
   - Clique nos cards para ver detalhes
   - Marque Pokémons como favoritos
   - Compare Pokémons usando o sistema de comparação
   - Alterne entre tema claro e escuro

## 🎯 Funcionalidades Detalhadas

### Busca Inteligente
- Busca em tempo real conforme você digita
- Não diferencia maiúsculas/minúsculas
- Funciona em conjunto com filtros

### Sistema de Favoritos
- Clique no ícone de coração para favoritar
- Favoritos persistem entre sessões
- Filtro dedicado para visualizar apenas favoritos

### Modal de Detalhes
- Informações completas do Pokémon
- Estatísticas com barras visuais
- Habilidades com indicação de habilidades ocultas
- Sprite animado quando disponível

### Comparação de Pokémons
- Selecione até 3 Pokémons para comparar
- Visualização lado a lado
- Comparação de estatísticas base

### Dark Mode
- Alternância suave entre temas
- Cores adaptadas para cada tema
- Preferência salva automaticamente

## 🎨 Design System

### Cores dos Tipos
Cada tipo de Pokémon tem sua própria cor com gradiente e glassmorphism:
- **Fogo**: Laranja 🔥
- **Água**: Azul 💧
- **Grama**: Verde 🌱
- **Elétrico**: Amarelo ⚡
- E muito mais...

### Glassmorphism
- Efeito de vidro fosco nos cards
- Bordas translúcidas
- Backdrop blur para profundidade

### Animações
- Hover effects nos cards
- Transições suaves no tema
- Loading spinners
- Animações de modal

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: Adaptação para tablets e desktop
- **Touch Friendly**: Elementos otimizados para toque

## 🔧 Melhorias Futuras

- [ ] Paginação avançada
- [ ] Mais gerações de Pokémons
- [ ] Sistema de evolução
- [ ] Filtros por tipo
- [ ] Exportar favoritos
- [ ] Modo offline
- [ ] PWA (Progressive Web App)

## 📄 Licença

Este projeto é de uso educacional e foi desenvolvido como parte de um curso prático de JavaScript.

---

Desenvolvido com ❤️ usando HTML, CSS e JavaScript puro.
