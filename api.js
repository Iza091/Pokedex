// Colores para cada tipo de Pokémon
const typeColors = {
    normal: '#757575', fire: '#fa1303', water: '#00baf8', electric: '#f8d305',
    grass: '#52964a', ice: '#67bdda', fighting: '#e8750a', poison: '#8f16a4',
    ground: '#a9813c', flying: '#59cdaa', psychic: '#c407bb', bug: '#50b452',
    rock: '#76522e', ghost: '#521d56', dragon: '#6e098d', dark: '#434041',
    steel: '#4c4f4f', fairy: '#bd41a9'
};

// Traducción de tipos al español
const spanishTypes = {
    normal: 'Normal', fire: 'Fuego', water: 'Agua', electric: 'Eléctrico',
    grass: 'Planta', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
    ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
    rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro',
    steel: 'Acero', fairy: 'Hada'
};

// Carga los datos del Pokémon desde la API
async function loadPokemon(identifier) {
    try {
        hideError(); // Limpia errores anteriores
        showLoading();
        const [pokeRes, speciesRes] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${identifier.toLowerCase()}`),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${identifier.toLowerCase()}`)
        ]);
        if (!pokeRes.ok || !speciesRes.ok) throw new Error('Pokémon no encontrado');
        const pokemon = await pokeRes.json();
        const species = await speciesRes.json();
        renderPokemon(pokemon, species);
    } catch (err) {
        showError('No se pudo encontrar el Pokémon');
    } finally {
        hideLoading();
    }
}

// Actualiza toda la UI con los datos del Pokémon
function renderPokemon(pokemon, species) {
    setPokemonHeader(pokemon);
    setPokemonImage(pokemon);
    setPokemonTypes(pokemon.types);
    setPokemonStats(pokemon.stats);
    setPokemonInfo(pokemon);
    setPokemonMoves(pokemon.moves);
}

// Muestra el número y nombre del Pokémon
function setPokemonHeader(pokemon) {
    document.getElementById('pokemon-number').textContent = `#${String(pokemon.id).padStart(3, '0')}`;
    document.getElementById('pokemon-name').textContent = pokemon.name;
}

// Muestra la imagen oficial del Pokémon
function setPokemonImage(pokemon) {
    const imgUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    const img = document.getElementById('pokemon-image');
    img.src = imgUrl;
    img.alt = pokemon.name;
}

// Muestra los tipos del Pokémon
function setPokemonTypes(types) {
    const container = document.getElementById('pokemon-types');
    container.innerHTML = '';
    types.forEach(({ type }) => {
        const span = document.createElement('span');
        span.className = 'type-badge';
        span.textContent = spanishTypes[type.name];
        span.style.backgroundColor = typeColors[type.name];
        container.appendChild(span);
    });
}

// Muestra las estadísticas principales
function setPokemonStats(stats) {
    const statMap = {
        hp: { id: 'hp', color: '#ff0000' },
        attack: { id: 'attack', color: '#f08030' },
        defense: { id: 'defense', color: '#f8d030' },
        speed: { id: 'speed', color: '#f85888' }
    };
    stats.forEach(stat => {
        const key = stat.stat.name;
        if (statMap[key]) {
            const value = stat.base_stat;
            const percent = (value / 255) * 100;
            const progress = document.getElementById(`${statMap[key].id}-progress`);
            const valueEl = document.getElementById(`${statMap[key].id}-value`);
            if (progress && valueEl) {
                progress.style.width = `${percent}%`;
                progress.style.backgroundColor = statMap[key].color;
                valueEl.textContent = value;
            }
        }
    });
}

// Muestra altura y peso
function setPokemonInfo(pokemon) {
    document.getElementById('pokemon-height').textContent = `${pokemon.height / 10} m`;
    document.getElementById('pokemon-weight').textContent = `${pokemon.weight / 10} kg`;
}

// Muestra los primeros 8 movimientos en español
function setPokemonMoves(moves) {
    const container = document.getElementById('moves-list');
    container.innerHTML = '';

    // Filtra movimientos aprendidos por nivel (level-up)
    const levelUpMoves = moves.filter(m =>
        m.version_group_details.some(
            vgd => vgd.move_learn_method.name === 'level-up'
        )
    );

    // Tomamos los primeros 8 movimientos aprendidos por nivel
    const firstMoves = levelUpMoves.slice(0, 8);

    // Para cada movimiento, obtenemos el nombre en español desde la API
    firstMoves.forEach(async ({ move }) => {
        try {
            const res = await fetch(move.url);
            const data = await res.json();
            const spanishName = data.names.find(n => n.language.name === 'es');
            const div = document.createElement('div');
            div.className = 'move-badge';
            div.textContent = spanishName ? spanishName.name : move.name.replace('-', ' ');
            container.appendChild(div);
        } catch {
            const div = document.createElement('div');
            div.className = 'move-badge';
            div.textContent = move.name.replace('-', ' ');
            container.appendChild(div);
        }
    });
}

// Muestra el estado de carga
function showLoading() {
    document.body.classList.add('loading');
}
function hideLoading() {
    document.body.classList.remove('loading');
}

// Muestra un error amigable
function showError(msg) {
    const errorBox = document.getElementById('errorBox');
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 4000);
}
function hideError() {
    const errorBox = document.getElementById('errorBox');
    errorBox.style.display = 'none';
}

// Inicializa eventos y carga el primer Pokémon
document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('searchPokemon');
    let timeout;
    search.addEventListener('input', e => {
        clearTimeout(timeout);
        const term = e.target.value.trim();
        if (term) {
            timeout = setTimeout(() => loadPokemon(term), 500);
        }
    });

    // Tabs amigables (corregido: .tab en vez de .tab-button)
    document.querySelectorAll('.tab').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Carga inicial
    loadPokemon('1');
});