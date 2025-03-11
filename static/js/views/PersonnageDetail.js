import PokeProvider from "../services/PokeProvider.js";
import Utils from "../services/utils.js";
import { PokemonFavoris } from "../services/favoris.js";

export default class PersonnageDetail {
  async render() {
    let request = Utils.parseRequestURL();
    let character = await PokeProvider.fetchCharacterById(request.id);
    console.log(character);

    let view = `

        <section class="section">
            <div id='top'>
                <h1>${character.name.french}</h1>
                <p id="id">#${character.id}<p>
            </div>

            <img src="${character.image.hires}" alt="Image de ${
      character.name.french
    }">
            <ul>
                ${character.type
                  .map((typ) => `<li><p id="type">${typ}<p></li>`)
                  .join("")}
            </ul>
                
            <section>
                <h2> A propos </h2>
                <div id="poids">
                    <p>${character.profile.weight}</p>
                    <p>Poids</p>
                </div>
                <div id="taille">
                    <p>${character.profile.height}</p>
                    <p>Taille</p>
                </div>
                <div id="capacite">
                    <ul>
                    ${character.profile.ability
                      .map(
                        (capacite) =>
                          `<li><p id="capacite">${capacite[0]}<p></li>`
                      )
                      .join("")}
                </ul>
                    <p>Capacité</p>
                </div>
            </section>
            <p> 
            ${character.description}
            </p>
            <section> 
                <h3>Stats de base</h3> 
                <h4> HP </h4> 
                <p>${character.base.HP}</p>

                <h4> Attaque </h4> 
                <p>${character.base.Attack}</p>

                <h4> Defense </h4> 
                <p>${character.base.Defense}</p>

                <h4> Attaque Spé. </h4> 
                <p>${character.base["Sp. Attack"]}</p>

                <h4> Defense Spé. </h4>
                <p>${character.base["Sp. Defense"]}</p>

                <h4> Vitesse </h4>  
                <p>${character.base.Speed}</p>
            </section>
            <section class="allbtn">
                <button type="button" id="add" class="star-button">Ajouter en favoris</button>
            </section>
        </section>
    `;

    return view;
  }

async afterRender() {
    let request = Utils.parseRequestURL();
    let character = await PokeProvider.fetchCharacterById(request.id);
    let listePokemons = PokemonFavoris.fetchFavoris();

    const buttonFavoris = document.querySelector(".star-button");

    if (listePokemons.some(pokemon => pokemon.id === character.id)) {
            buttonFavoris.id = "delete";
            buttonFavoris.textContent = "Supprimer des Favoris";
    }

    buttonFavoris.addEventListener("click", async () => {
            if (buttonFavoris.id === "add") {
                PokemonFavoris.addFavoris(character);
                buttonFavoris.id = "delete";
                buttonFavoris.textContent = "Supprimer des Favoris";
            } else if (buttonFavoris.id === "delete") {
                PokemonFavoris.removeFavoris(character);
                buttonFavoris.id = "add";
                buttonFavoris.textContent = "Ajouter en favoris";
            }
    });
}
}
