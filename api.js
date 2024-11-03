const typeColors = {
    normal: '#757575',
    fire: '#fa1303',
    water: '#00baf8',
    electric: '#f8d305',
    grass: '#52964a',
    ice: '#67bdda',
    fighting: '#e8750a',
    poison: '#8f16a4',
    ground: '#a9813c',
    flying: '#59cdaa',
    psychic: '#c407bb',
    bug: '#50b452',
    rock: '#76522e',
    ghost: '#521d56',
    dragon: '#6e098d',
    dark: '#434041',
    steel: '#4c4f4f',
    fairy: '#bd41a9'
};

const spanishTypes = {
    normal: 'Normal',
    fire: 'Fuego',
    water: 'Agua',
    electric: 'Eléctrico',
    grass: 'Planta',
    ice: 'Hielo',
    fighting: 'Lucha',
    poison: 'Veneno',
    ground: 'Tierra',
    flying: 'Volador',
    psychic: 'Psíquico',
    bug: 'Bicho',
    rock: 'Roca',
    ghost: 'Fantasma',
    dragon: 'Dragón',
    dark: 'Siniestro',
    steel: 'Acero',
    fairy: 'Hada'
};

async function loadPokemonData(identifier) {
    try {
        showLoadingState();

        const [pokemonResponse, speciesResponse] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${identifier.toLowerCase()}`),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${identifier.toLowerCase()}`)
        ]);

        if (!pokemonResponse.ok || !speciesResponse.ok) {
            throw new Error('Pokemon no encontrado');
        }

        const pokemonData = await pokemonResponse.json();
        const speciesData = await speciesResponse.json();

        updatePokemonUI(pokemonData, speciesData);

    } catch (error) {
        console.error('Error:', error);
        showError('No se pudo encontrar el Pokémon');
    } finally {
        hideLoadingState();
    }
}

function updatePokemonUI(pokemonData, speciesData) {
    document.getElementById('pokemon-number').textContent = `#${String(pokemonData.id).padStart(3, '0')}`;
    document.getElementById('pokemon-name').textContent = pokemonData.name;

    const imageUrl = pokemonData.sprites.other['official-artwork'].front_default || 
                    pokemonData.sprites.front_default;
    const pokemonImage = document.getElementById('pokemon-image');
    pokemonImage.src = imageUrl;
    pokemonImage.alt = pokemonData.name;

    updateTypes(pokemonData.types);
    updateStats(pokemonData.stats);
    updateInfo(pokemonData, speciesData);
    updateMoves(pokemonData.moves);
}

function updateTypes(types) {
    const typesContainer = document.getElementById('pokemon-types');
    typesContainer.innerHTML = '';
    types.forEach(typeInfo => {
        const typeElement = document.createElement('span');
        typeElement.className = 'type-badge';
        const typeName = typeInfo.type.name;
        typeElement.textContent = spanishTypes[typeName];
        typeElement.style.backgroundColor = typeColors[typeName];
        typesContainer.appendChild(typeElement);
    });
}

function updateStats(stats) {
    const statMapping = {
        'hp': { element: 'hp', icon: 'fa-heart', color: '#ff0000' },
        'attack': { element: 'attack', icon: 'fa-fist-raised', color: '#f08030' },
        'defense': { element: 'defense', icon: 'fa-shield-alt', color: '#f8d030' },
        'speed': { element: 'speed', icon: 'fa-bolt', color: '#f85888' }
    };

    stats.forEach(stat => {
        const statName = stat.stat.name;
        if (statMapping[statName]) {
            const value = stat.base_stat;
            const percentage = (value / 255) * 100;
            
            const progressElement = document.getElementById(`${statMapping[statName].element}-progress`);
            const valueElement = document.getElementById(`${statMapping[statName].element}-value`);
            
            if (progressElement && valueElement) {
                progressElement.style.width = `${percentage}%`;
                progressElement.style.backgroundColor = statMapping[statName].color;
                valueElement.textContent = value;
            }
        }
    });
}

function updateInfo(pokemonData, speciesData) {
    document.getElementById('pokemon-height').textContent = `${pokemonData.height / 10} m`;
    document.getElementById('pokemon-weight').textContent = `${pokemonData.weight / 10} kg`;
}

function updateMoves(moves) {
    const movesContainer = document.getElementById('moves-list');
    movesContainer.innerHTML = '';

    moves.slice(0, 8).forEach(moveInfo => {
        const moveElement = document.createElement('div');
        moveElement.className = 'move-badge';
        moveElement.textContent = moveInfo.move.name.replace('-', ' ');
        movesContainer.appendChild(moveElement);
    });
}

function showLoadingState() {
    document.body.classList.add('loading');
}

function hideLoadingState() {
    document.body.classList.remove('loading');
}

function showError(message) {
    alert(message);
}

document.addEventListener('DOMContentLoaded', () => {
    // Búsqueda
    const searchInput = document.getElementById('searchPokemon');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const searchTerm = e.target.value.trim();

        if (searchTerm) {
            searchTimeout = setTimeout(() => {
                loadPokemonData(searchTerm);
            }, 500);
        }
    });

    // Tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Cargar el primer Pokémon
    loadPokemonData('1');
});