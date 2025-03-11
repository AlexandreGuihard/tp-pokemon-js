import PokeProvider from "../services/PokeProvider.js";

export default class Personnages {
  async render() {
    let characters = await PokeProvider.fetchCharacters();
    console.log(characters);
    let view = `
      <main>
        <h1>Pokedex</h1>
        <ul class="personnage">
          ${characters
            .map((character) => `
          <li class="pokemon-item">
            <p id="pokeId">${character.id}<p>
            <img src="${character.image.thumbnail}" alt="Image de ${character.name.french}">
            <div id='pokeName'>
              <h2>${character.name.french}</h2>
            </div>
          </li> 
          `
            )
            .join("")}
        </ul>
      </main>
      `;
    return view;
  }
}
