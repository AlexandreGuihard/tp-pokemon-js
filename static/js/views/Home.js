import PokeProvider from "../services/PokeProvider.js";
import Pokemon from "../services/Pokemon.js";

export default class Home {
    
    async render() {
        return `
            <section class="section">
                <h1>Bienvenue sur notre page</h1>
                <p>Retrouvez ici tous les personnages de Pokemon, leurs techniques.</p>
                <div id="pokedex" class="pokedex-container"></div> 
            </section>

            <div class="search-bar">
                <input type="text" id="search-input" placeholder="Rechercher un Pokémon">
            </div>

        `;
    }

    createPokemonCard(pokemon) {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${pokemon.image.hires}" alt="${pokemon.name.french}">
            <h3>${pokemon.name.french}</h3>
            <p>${pokemon.species}</p>
            <div class="types">
                ${pokemon.type.map(t => `<span class="type-${t}">${t}</span>`).join("")}
            </div>
            <p>${pokemon.description}</p>
        `;

        return card;
    }

    async afterRender() {
        const pokedexContainer = document.getElementById("pokedex");
        const searchInput = document.getElementById("search-input");

        if (!pokedexContainer || !searchInput) return;

        const pokemonList = await PokeProvider.fetchCharacters();

        // Afficher tous les Pokémon
        const displayPokemons = (filter = "") => {
            pokedexContainer.innerHTML = "";
            const filteredList = pokemonList.filter(pokemon =>
                pokemon.name.french.toLowerCase().includes(filter.toLowerCase())
            );
            filteredList.forEach((data) => {
                const pokemon = new Pokemon(data);
                pokedexContainer.appendChild(this.createPokemonCard(pokemon));
            });
        };

        // Affichage initial
        displayPokemons();

        // Ajout de la recherche dynamique
        searchInput.addEventListener("input", () => {
            displayPokemons(searchInput.value);
        });
    }
}