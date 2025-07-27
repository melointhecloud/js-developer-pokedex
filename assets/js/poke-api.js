
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    pokemon.animatedSprite = pokeDetail.sprites.versions['generation-v']['black-white'].animated?.front_default || pokeDetail.sprites.front_default
    
    // Altura e peso
    pokemon.height = pokeDetail.height / 10 // Convertendo de decímetros para metros
    pokemon.weight = pokeDetail.weight / 10 // Convertendo de hectogramas para kg
    
    // Habilidades
    pokemon.abilities = pokeDetail.abilities.map(ability => ({
        name: ability.ability.name,
        isHidden: ability.is_hidden
    }))
    
    // Estatísticas
    pokemon.stats = pokeDetail.stats.map(stat => ({
        name: stat.stat.name,
        value: stat.base_stat
    }))

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
