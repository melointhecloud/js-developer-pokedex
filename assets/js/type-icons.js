const typeIcons = {
    normal: '🟤',
    grass: '🌱',
    fire: '🔥',
    water: '💧',
    electric: '⚡',
    ice: '❄️',
    ground: '🌍',
    flying: '🦅',
    poison: '☠️',
    fighting: '👊',
    psychic: '🔮',
    dark: '🌑',
    rock: '🪨',
    bug: '🐛',
    ghost: '👻',
    steel: '⚙️',
    dragon: '🐉',
    fairy: '🧚'
};

function getTypeIcon(type) {
    return typeIcons[type] || '❓';
} 