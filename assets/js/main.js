// Elementos do DOM
const pokemonList = document.getElementById('pokemonList')
const searchInput = document.getElementById('searchInput')
const themeToggle = document.getElementById('themeToggle')
const favoritesFilter = document.getElementById('favoritesFilter')
const favoritesOnly = document.getElementById('favoritesOnly')
const pokemonModal = document.getElementById('pokemonModal')
const compareModal = document.getElementById('compareModal')
const modalContent = document.getElementById('modalContent')
const compareContent = document.getElementById('compareContent')

// Variáveis globais
const maxRecords = 151
const limit = 10
let offset = 0
let allPokemons = []
let filteredPokemons = []
let favorites = JSON.parse(localStorage.getItem('pokemonFavorites') || '[]')
let selectedPokemons = []
let currentTheme = localStorage.getItem('theme') || 'light'

// Variáveis globais para comparação
let compareSearchModal = document.getElementById('compareSearchModal')
let compareSearchInput = document.getElementById('compareSearchInput')
let compareSearchResults = document.getElementById('compareSearchResults')
let firstPokemonForCompare = null
let secondPokemonForCompare = null

// Adicionar variáveis para scroll infinito
let isLoading = false
let hasMorePokemons = true

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme()
    loadPokemonItens(offset, limit)
    setupEventListeners()
})

// Configuração dos event listeners
function setupEventListeners() {
    // Busca
    searchInput.addEventListener('input', handleSearch)
    
    // Tema
    themeToggle.addEventListener('click', toggleTheme)
    
    // Filtros
    favoritesFilter.addEventListener('click', () => setActiveFilter('all'))
    favoritesOnly.addEventListener('click', () => setActiveFilter('favorites'))
    
    // Modais
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals)
    })
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModals()
        }
    })

    // Compare search
    compareSearchInput.addEventListener('input', handleCompareSearch)

    // Adicionar scroll listener
    window.addEventListener('scroll', handleInfiniteScroll)
}

// Inicializar tema
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme)
    updateThemeIcon()
}

// Alternar tema
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', currentTheme)
    localStorage.setItem('theme', currentTheme)
    updateThemeIcon()
}

// Atualizar ícone do tema
function updateThemeIcon() {
    const icon = themeToggle.querySelector('i')
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun'
    } else {
        icon.className = 'fas fa-moon'
    }
}

// Função auxiliar para buscar um pokémon pelo nome na PokéAPI
function fetchPokemonByName(name) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
        .then(res => {
            if (!res.ok) throw new Error('Pokémon não encontrado');
            return res.json();
        })
        .then(convertPokeApiDetailToPokemon)
        .catch(() => null);
}

// Busca
async function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) {
        filteredPokemons = allPokemons;
        renderPokemons();
        return;
    }
    
    let found = allPokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm)
    );
    // Se não encontrou, tenta buscar na API
    if (found.length === 0) {
        const fetched = await fetchPokemonByName(searchTerm);
        if (fetched && !allPokemons.some(p => p.number === fetched.number)) {
            allPokemons.push(fetched);
            found = [fetched];
        }
    }
    filteredPokemons = found;
    renderPokemons();
}

// Definir filtro ativo
function setActiveFilter(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'))
    event.target.classList.add('active')
    
    if (filter === 'favorites') {
        filteredPokemons = allPokemons.filter(pokemon => favorites.includes(pokemon.number))
    } else {
        filteredPokemons = allPokemons
    }
    renderPokemons()
}

// Carregar Pokémons
function loadPokemonItens(offset, limit) {
    showLoading()
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        allPokemons = [...allPokemons, ...pokemons]
        filteredPokemons = allPokemons
        renderPokemons()
        hideLoading()
    })
}

// Função para revelar cards ao rolar a página
function revealOnScroll() {
    const cards = document.querySelectorAll('.pokemon');
    const windowHeight = window.innerHeight;
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < windowHeight - 40) {
            card.classList.add('revealed');
        }
    });
}

// Revele ao carregar e ao rolar
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('resize', revealOnScroll);
document.addEventListener('DOMContentLoaded', revealOnScroll);

// Função utilitária para checar se há scroll vertical
function hasVerticalScroll() {
    return document.documentElement.scrollHeight > document.documentElement.clientHeight;
}

// Atualizar renderPokemons para chamar revealOnScroll ao final e carregar mais pokémons se necessário
function renderPokemons() {
    const searchTerm = searchInput.value.toLowerCase().trim()
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter
    
    let pokemonsToRender = filteredPokemons
    
    if (searchTerm) {
        pokemonsToRender = pokemonsToRender.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchTerm)
        )
    }
    
    if (activeFilter === 'favorites') {
        pokemonsToRender = pokemonsToRender.filter(pokemon => 
            favorites.includes(pokemon.number)
        )
    }
    
    const newHtml = pokemonsToRender.map(convertPokemonToLi).join('')
    pokemonList.innerHTML = newHtml
    
    // Adicionar event listeners aos cards
    addCardEventListeners()
    // Chamar scroll reveal
    revealOnScroll();
    // Se não houver scroll e ainda houver mais pokémons, carregue mais
    if (!hasVerticalScroll() && hasMorePokemons && !isLoading) {
        loadMorePokemons();
    }
}

// Converter Pokémon para HTML
function convertPokemonToLi(pokemon) {
    const isFavorite = favorites.includes(pokemon.number)
    const favoriteClass = isFavorite ? 'favorited' : ''
    const favoriteIcon = isFavorite ? 'fas fa-heart' : 'far fa-heart'
    
    return `
        <li class="pokemon ${pokemon.type}" data-pokemon-id="${pokemon.number}">
            <button class="favorite-btn ${favoriteClass}" onclick="toggleFavorite(${pokemon.number}, event)">
                <i class="${favoriteIcon}"></i>
            </button>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `
                        <li class="type ${type}">
                            <span class="type-icon">${getTypeIcon(type)}</span>
                            ${type}
                        </li>
                    `).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

// Adicionar event listeners aos cards
function addCardEventListeners() {
    document.querySelectorAll('.pokemon').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                const pokemonId = parseInt(card.dataset.pokemonId)
                const pokemon = allPokemons.find(p => p.number === pokemonId)
                if (pokemon) {
                    showPokemonDetails(pokemon)
                }
            }
        })
    })
}

// Alternar favorito
function toggleFavorite(pokemonId, event) {
    event.stopPropagation()
    
    const index = favorites.indexOf(pokemonId)
    if (index > -1) {
        favorites.splice(index, 1)
    } else {
        favorites.push(pokemonId)
    }
    
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites))
    
    // Atualizar visual
    const card = event.target.closest('.pokemon')
    const btn = event.target.closest('.favorite-btn')
    const icon = btn.querySelector('i')
    
    if (favorites.includes(pokemonId)) {
        card.classList.add('favorite')
        btn.classList.add('favorited')
        icon.className = 'fas fa-heart'
    } else {
        card.classList.remove('favorite')
        btn.classList.remove('favorited')
        icon.className = 'far fa-heart'
    }
}

// Mostrar detalhes do Pokémon
function showPokemonDetails(pokemon) {
    const modalHtml = `
        <div class="pokemon-detail">
            <div class="pokemon-detail-header">
                <h2>${pokemon.name}</h2>
                <span class="number">#${pokemon.number}</span>
            </div>
            
            <div class="pokemon-detail-image">
                <img src="${pokemon.animatedSprite || pokemon.photo}" alt="${pokemon.name}">
            </div>
            
            <div class="pokemon-info">
                <div class="info-item">
                    <h4>Altura</h4>
                    <p>${pokemon.height}m</p>
                </div>
                <div class="info-item">
                    <h4>Peso</h4>
                    <p>${pokemon.weight}kg</p>
                </div>
                <div class="info-item">
                    <h4>Tipos</h4>
                    <p>${pokemon.types.map(type => `${getTypeIcon(type)} ${type}`).join(', ')}</p>
                </div>
            </div>
            
            <div class="info-item">
                <h4>Habilidades</h4>
                <p>${pokemon.abilities.map(ability => 
                    `${ability.name}${ability.isHidden ? ' (Oculta)' : ''}`
                ).join(', ')}</p>
            </div>
            
            <div class="stats-container">
                <h4>Estatísticas Base</h4>
                ${pokemon.stats.map(stat => `
                    <div class="stat-bar">
                        <span class="stat-name">${stat.name}</span>
                        <div class="stat-bar-bg">
                            <div class="stat-bar-fill" style="width: ${(stat.value / 255) * 100}%"></div>
                        </div>
                        <span class="stat-value">${stat.value}</span>
                    </div>
                `).join('')}
            </div>
            
            <button onclick="addToCompare(${pokemon.number})" class="compare-btn">
                <i class="fas fa-balance-scale"></i> Comparar
            </button>
        </div>
    `
    
    modalContent.innerHTML = modalHtml
    pokemonModal.style.display = 'block'
}

// Função para buscar Pokémon para comparação
async function handleCompareSearch() {
    const searchTerm = compareSearchInput.value.toLowerCase().trim();
    if (searchTerm.length < 2) {
        compareSearchResults.innerHTML = '';
        return;
    }
    let filtered = allPokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm)
    ).slice(0, 10);
    // Se não encontrou, tenta buscar na API
    if (filtered.length === 0) {
        const fetched = await fetchPokemonByName(searchTerm);
        if (fetched && !allPokemons.some(p => p.number === fetched.number)) {
            allPokemons.push(fetched);
            filtered = [fetched];
        }
    }
    const resultsHtml = filtered.map(pokemon => `
        <div class="compare-search-item" onclick="selectSecondPokemonForCompare(${pokemon.number})">
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <div class="compare-search-item-info">
                <div class="compare-search-item-name">${pokemon.name}</div>
                <div class="compare-search-item-number">#${pokemon.number}</div>
            </div>
        </div>
    `).join('');
    compareSearchResults.innerHTML = resultsHtml;
}

// Função para selecionar o segundo Pokémon para comparação
function selectSecondPokemonForCompare(pokemonId) {
    const pokemon = allPokemons.find(p => p.number === pokemonId)
    if (pokemon) {
        secondPokemonForCompare = pokemon
        compareSearchModal.style.display = 'none'
        showCompareModal()
    }
}

// Atualizar a função addToCompare
function addToCompare(pokemonId) {
    const pokemon = allPokemons.find(p => p.number === pokemonId)
    if (pokemon) {
        firstPokemonForCompare = pokemon
        compareSearchModal.style.display = 'block'
        compareSearchInput.value = ''
        compareSearchResults.innerHTML = ''
        compareSearchInput.focus()
    }
}

// Função para comparar estatísticas
function compareStats(stat1, stat2) {
    if (stat1 > stat2) return 'better'
    if (stat1 < stat2) return 'worse'
    return 'equal'
}

// Atualizar a função showCompareModal
function showCompareModal() {
    if (!firstPokemonForCompare || !secondPokemonForCompare) return
    
    const compareHtml = `
        <div class="compare-pokemons-container">
            <div class="compare-pokemon-card">
                <h3>${firstPokemonForCompare.name}</h3>
                <img src="${firstPokemonForCompare.photo}" alt="${firstPokemonForCompare.name}">
                <div class="types">
                    ${firstPokemonForCompare.types.map(type => `
                        <span class="type ${type}">${getTypeIcon(type)} ${type}</span>
                    `).join('')}
                </div>
                <div class="compare-stats-container">
                    <div class="compare-stats-title">Estatísticas</div>
                    ${firstPokemonForCompare.stats.map(stat => `
                        <div class="compare-stat ${compareStats(stat.value, secondPokemonForCompare.stats.find(s => s.name === stat.name)?.value || 0)}">
                            <span>${stat.name}</span>
                            <span class="compare-stat-value">${stat.value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="compare-vs">VS</div>
            
            <div class="compare-pokemon-card">
                <h3>${secondPokemonForCompare.name}</h3>
                <img src="${secondPokemonForCompare.photo}" alt="${secondPokemonForCompare.name}">
                <div class="types">
                    ${secondPokemonForCompare.types.map(type => `
                        <span class="type ${type}">${getTypeIcon(type)} ${type}</span>
                    `).join('')}
                </div>
                <div class="compare-stats-container">
                    <div class="compare-stats-title">Estatísticas</div>
                    ${secondPokemonForCompare.stats.map(stat => `
                        <div class="compare-stat ${compareStats(stat.value, firstPokemonForCompare.stats.find(s => s.name === stat.name)?.value || 0)}">
                            <span>${stat.name}</span>
                            <span class="compare-stat-value">${stat.value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `
    
    compareContent.innerHTML = compareHtml
    compareModal.style.display = 'block'
}

// Fechar modais
function closeModals() {
    pokemonModal.style.display = 'none'
    compareModal.style.display = 'none'
    compareSearchModal.style.display = 'none'
    firstPokemonForCompare = null
    secondPokemonForCompare = null
    selectedPokemons = []
}

// Função para scroll infinito
function handleInfiniteScroll() {
    if (isLoading || !hasMorePokemons) return
    
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    
    // Carregar mais quando estiver próximo do final
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMorePokemons()
    }
}

// Função para carregar mais Pokémons
function loadMorePokemons() {
    if (isLoading || !hasMorePokemons) return
    
    isLoading = true
    offset += limit
    
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)
        hasMorePokemons = false
    } else {
        loadPokemonItens(offset, limit)
    }
    
    // Reset loading após um delay
    setTimeout(() => {
        isLoading = false
    }, 1000)
}

// Mostrar loading
function showLoading() {
    // Criar indicador de loading no final da lista
    const loadingHtml = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Carregando mais Pokémons...</p>
        </div>
    `
    
    // Adicionar ao final da lista
    const loadingElement = document.createElement('div')
    loadingElement.innerHTML = loadingHtml
    loadingElement.className = 'loading-indicator'
    pokemonList.appendChild(loadingElement)
}

// Esconder loading
function hideLoading() {
    // Remover indicador de loading
    const loadingIndicator = document.querySelector('.loading-indicator')
    if (loadingIndicator) {
        loadingIndicator.remove()
    }
}