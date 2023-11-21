let currentPokemonIndex = 1;
let currentGeneration = 1; // Variable para almacenar la generación actual
let lastSearchedPokemonIndex = null; // Variable para almacenar el último Pokémon buscado


document.addEventListener('DOMContentLoaded', () => {
    loadPokemonData(currentPokemonIndex);
});

document.getElementById('generation-select').addEventListener('change', function () {
    currentGeneration = parseInt(this.value);
    currentPokemonIndex = getFirstPokemonIndex(currentGeneration);
    loadPokemonData(currentPokemonIndex);
});

document.getElementById('previousButton').addEventListener('click', () => {
    changePokemonIndex(-1);
});

document.getElementById('nextButton').addEventListener('click', () => {
    changePokemonIndex(1);
});
// Obtener el combobox por su ID
const generationSelect = document.getElementById('generation-select');

// Eliminar el combobox
generationSelect.remove(); // Esto eliminará el combobox del DOM



const spanishTranslations = {
    normal: { name: 'Normal', color: '#757575' },
    fire: { name: 'Fuego', color: '#fa1303' },
    water: { name: 'Agua', color: '#00baf8' },
    electric: { name: 'Eléctrico', color: '#f8d305' },
    grass: { name: 'Planta', color: '#52964a' },
    ice: { name: 'Hielo', color: '#67bdda' },
    fighting: { name: 'Lucha', color: '#e8750a' },
    poison: { name: 'Veneno', color: '#8f16a4' },
    ground: { name: 'Tierra', color: '#a9813c' },
    flying: { name: 'Volador', color: '#59cdaa' },
    psychic: { name: 'Psíquico', color: '#c407bb' },
    bug: { name: 'Bicho', color: '#50b452' },
    rock: { name: 'Roca', color: '#76522e' },
    ghost: { name: 'Fantasma', color: '#521d56' },
    dragon: { name: 'Dragón', color: '#6e098d' },
    dark: { name: 'Siniestro', color: '#434041' },
    steel: { name: 'Acero', color: '#4c4f4f' },
    fairy: { name: 'Hada', color: '#bd41a9' }
    // Agrega más traducciones según sea necesario
};

// Función para traducir tipos
function translateType(type) {
    return spanishTranslations[type] || type;
}

function changePokemonIndex(change) {
    const lastPokemonIndex = getLastPokemonIndex(currentGeneration);
    let newPokemonIndex = currentPokemonIndex + change;

    if (newPokemonIndex < 1) {
        newPokemonIndex = lastPokemonIndex;
    } else if (newPokemonIndex > lastPokemonIndex) {
        newPokemonIndex = 1;
    }

    currentPokemonIndex = newPokemonIndex;
    loadPokemonData(currentPokemonIndex);
}


// Función para cargar la información del Pokémon
function loadPokemonData(selectedPokemonId) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemonId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('pokemon-number').textContent = data.id;
            document.getElementById('pokemon-name').textContent = data.name;

            // Traduce los tipos de Pokémon
            const typesContainer = document.getElementById('pokemon-types');
            typesContainer.innerHTML = ''; // Limpiamos el contenedor antes de agregar los tipos

            const types = data.types.map(type => {
                const translatedType = spanishTranslations[type.type.name];
                return `<span style="background-color: ${translatedType.color};">${translatedType.name}</span>`;
            }).join(', ');

            typesContainer.innerHTML = types;

            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemonId}.png`;
            const img = document.getElementById('pokemon-image');
            img.src = imageUrl;
            img.width = 200;
            img.height = 200;
        })
        .catch(error => console.error('Error:', error));
}

// Obtener el índice del primer Pokémon para una generación específica
function getFirstPokemonIndex(generation) {
    let firstPokemonIndex = 1;

    switch (generation) {
        case 1:
            firstPokemonIndex = 1;
            break;
        case 2:
            firstPokemonIndex = 152;
            break;
        case 3:
            firstPokemonIndex = 252;
            break;
        case 4:
            firstPokemonIndex = 387;
            break;
        case 5:
            firstPokemonIndex = 494;
            break;
        case 6:
            firstPokemonIndex = 650;
            break;
        default:
            firstPokemonIndex = 1; // Si no se especifica, establecer el primer valor como 1
            break;
    }

    return firstPokemonIndex;
}

// Obtener el índice del último Pokémon para una generación específica
function getLastPokemonIndex(generation) {
    let lastPokemonIndex = 0;

    switch (generation) {
        case 1:
            lastPokemonIndex = 151;
            break;
        case 2:
            lastPokemonIndex = 251;
            break;
        case 3:
            lastPokemonIndex = 386;
            break;
        case 4:
            lastPokemonIndex = 493;
            break;
        case 5:
            lastPokemonIndex = 649;
            break;
        case 6:
            lastPokemonIndex = 721;
            break;
        default:
            lastPokemonIndex = 721; // Si no se especifica, establecer el último valor como 721
            break;
    }

    return lastPokemonIndex;
}

// Agregar evento para el campo de búsqueda
document.getElementById('searchPokemon').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase(); // Obtener el valor del campo de búsqueda y convertir a minúsculas

    // Lógica para buscar el Pokémon por nombre
    fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const pokemonId = data.id;
            loadPokemonData(pokemonId);
        })
        .catch(error => {
            console.error('Error:', error);
            // Manejar el error o realizar alguna acción específica si no se encuentra el Pokémon
        });
});

// Agregar evento para el campo de búsqueda
document.getElementById('searchPokemon').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase(); // Obtener el valor del campo de búsqueda en minúsculas

    // Lógica para buscar el Pokémon por nombre
    fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const pokemonId = data.id;
            const pokemonGeneration = getPokemonGeneration(pokemonId); // Obtener la generación del Pokémon

            currentGeneration = pokemonGeneration; // Actualizar la generación actual
            currentPokemonIndex = pokemonId; // Actualizar el índice del Pokémon actual
            loadPokemonData(pokemonId);
        })
        .catch(error => {
            console.error('Error:', error);
            // Manejar el error o realizar alguna acción específica si no se encuentra el Pokémon
        });
});
