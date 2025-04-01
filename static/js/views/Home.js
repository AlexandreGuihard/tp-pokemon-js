import PokeProvider from "../services/PokeProvider.js";
import Pokemon from "../services/Pokemon.js";
import Notation from "../services/Notation.js";

export default class Home {
  async render() {
    return `
            <section class="section">
                <h1>Bienvenue sur notre page</h1>
                <p>Retrouvez ici tous les personnages de Pokemon, leurs techniques.</p>
                 <div class="search-bar">
                <input type="text" id="search-input" placeholder="Rechercher un Pokémon">
            </div>
                <div id="pokedex" class="pokedex-container"></div> 
            </section>

           

        `;
  }

  createPokemonCard(pokemon) {
    const card = document.createElement("div");
    card.classList.add("card");
    console.log("pokemon", pokemon);
    card.innerHTML = `
            <ul class="personnage">      
                <li> 
                    <a href="#/personnages/${pokemon.id}">
                        <section class="container">
                            <img src="${pokemon.image.sprite}" alt="image de ${pokemon.name.french}" />
                            <h3>${pokemon.name.french}</h3>
                            <div class="types">
                                ${pokemon.type.map((t) => `<span class="type-${t}">${t}</span>`).join("")}
                            </div>
                            <p>${pokemon.description}</p>
                            <p>Note : ${pokemon.note}/10</p>
                        </section>
                    </a>
                </li> 
            </ul>
        `;

    return card;
  }

  async afterRender() {
    const pokedexContainer = document.getElementById("pokedex");
    const searchInput = document.getElementById("search-input");

    if (!pokedexContainer || !searchInput) return;
    const notes = await Notation.fetchNotation();
    const pokemonList = await PokeProvider.fetchCharacters();

    const fetchNotedPokemons = async () => {
      return pokemonList.filter((pokemon) => {
        const note = notes.find((note) => note.idPokemon === pokemon.id);
        return note && note.note > 0;
      });
    };

    const notedPokemonList = await fetchNotedPokemons();

    const notesMoyennes = [];
    for (const pokemon of notedPokemonList) {
      const note = await Notation.noteMoyenne(pokemon.id);
      notesMoyennes.push({ ...pokemon, note });
    }

    notesMoyennes.sort((a, b) => b.note - a.note);


    const displayPokemons = (filter = "") => {
      pokedexContainer.innerHTML = "";
      const filteredList = notesMoyennes.filter((pokemon) =>
        pokemon.name.french.toLowerCase().includes(filter.toLowerCase())
      );
      filteredList.forEach((data) => {
        pokedexContainer.appendChild(this.createPokemonCard(data));
      });
    };

    displayPokemons();

    searchInput.addEventListener("input", () => {
      displayPokemons(searchInput.value);
    });
  }
}
