import PokeProvider from "../services/PokeProvider.js";

export default class Personnages {
  async render() {
    let characters = await PokeProvider.fetchCharacters();
    console.log(characters);
    let view = `
      <section class="section">
        <h1>Pokedex</h1>
        <ul class="personnage">
          ${characters
            .map((character) => `
          <li class="pokemon-item">
            <p id="pokeId">${character.id}<p>
            <a href="#/personnages/${character.id}">
            <img src="${character.image.thumbnail}" alt="Image de ${character.name.french}">
            <div id='pokeName'>
              <h2>${character.name.french}</h2>
            </div>
          </li> 
          `
            )
            .join("")}
        </ul>
      </section>
      `;
    return view;
  }
}
