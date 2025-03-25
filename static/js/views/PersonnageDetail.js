import PokeProvider from "../services/PokeProvider.js";
import Utils from "../services/utils.js";
import { PokemonFavoris } from "../services/favoris.js";
import PokemonTeam from "../services/team.js";

export default class PersonnageDetail {
  async render() {
    let request = Utils.parseRequestURL();
    let character = await PokeProvider.fetchCharacterById(request.id);
    //let PokemonALL = PokeProvider.fetchPokemon();
    console.log(character);

    let view = `

        <section class="section">
               <div id="top">
          <h1 id="pokemon-name">${character.name.french}</h1>
          <p id="id">#${character.id}</p>

          
          
          
        </div>

        <div class="featured-img">
      <a href="#/personnages/${parseInt(character.id) - 1}" class="arrow left-arrow" id="leftArrow">
        <img src="../../../img/chevron_left.svg" alt="back" />
      </a>
        <img id="pokemon-image" src="${character.image.hires}" alt="Image de ${character.name.french}">
        <a href="#/personnages/${parseInt(character.id) + 1}" class="arrow right-arrow" id="rightArrow">
          <img src="../../../img/chevron_right.svg" alt="forward" />
        </a>
      </div>
            <ul>
                ${character.type
                  .map((typ) => `<li><p id="type">${typ}<p></li>`)
                  .join("")}
            </ul>
                
             <section>
                <h2>À propos</h2>
                <div id="content">
                  <div id="poids">
                    <div id="poidsHead">
                      <img src="../../../img/weight.svg" alt="weight" />
                      <p>${character.profile.weight}</p>
                    </div>
                    <p>Poids</p>
                  </div>
                  <div id="taille">
                    <div id="tailleHead">
                        <img src="../../../img/height.svg" alt="height" />
                        <p>${character.profile.height}</p>
                    </div>
                    <p>Taille</p>
                  </div>
                  <div id="capacite">
                      <ul>
                          ${character.profile.ability
                              .map(
                                  (capacite) =>
                                      `<li><p id="capacite">${capacite[0]}</p></li>`
                              )
                              .join("")}
                      </ul>
                      <p>Capacité</p>
                  </div>
                </div>
            </section>

            <p id="description">${character.description}</p>

            <section>
                <h3>Stats de base</h3>
                <h4>HP</h4>
                <p id="hp">${character.base.HP}</p>

                <h4>Attaque</h4>
                <p id="attack">${character.base.Attack}</p>

                <h4>Défense</h4>
                <p id="defense">${character.base.Defense}</p>

                <h4>Attaque Spé.</h4>
                <p id="sp-attack">${character.base["Sp. Attack"]}</p>

                <h4>Défense Spé.</h4>
                <p id="sp-defense">${character.base["Sp. Defense"]}</p>

                <h4>Vitesse</h4>
                <p id="speed">${character.base.Speed}</p>
            </section>
            <button type="button" id="addPokemon">Ajouter un Pokemon</button>
             <div id="addPokemonModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Ajouter un Pokémon</h2>
                <section class="allbtn">
                    <button type="button" id="addFavoris" class="buttonFavoris">Ajouter en favoris</button>
                </section>
                <section class="allbtn">
                    <button type="button" id="addTeam" class="buttonTeam">Ajouter dans l'équipe</button>
                </section>
            </div>
        </div>
        </section>
       
    `;

    return view;
  }

  async afterRender() {
    let request = Utils.parseRequestURL();
    let character = await PokeProvider.fetchCharacterById(request.id);
    let listePokemons = PokemonFavoris.fetchFavoris();
    let listePokemonsTeam = PokemonTeam.fetchTeam();

    const buttonFavoris = document.querySelector(".buttonFavoris");
    const buttonTeam = document.querySelector(".buttonTeam");

    const updateButtonState = (
      button,
      condition,
      addText,
      deleteText,
      addId,
      deleteId
    ) => {
      if (condition) {
        button.id = deleteId;
        button.textContent = deleteText;
      } else {
        button.id = addId;
        button.textContent = addText;
      }
    };

    updateButtonState(
      buttonFavoris,
      listePokemons.some((pokemon) => pokemon.id === character.id),
      "Ajouter en favoris",
      "Supprimer des Favoris",
      "addFavoris",
      "deleteFavoris"
    );

    updateButtonState(
      buttonTeam,
      listePokemonsTeam.some((pokemon) => pokemon.id === character.id),
      "Ajouter dans l'équipe",
      "Supprimer de l'équipe",
      "addTeam",
      "deleteTeam"
    );

    const handleButtonClick = (
      button,
      addAction,
      removeAction,
      addId,
      deleteId,
      addText,
      deleteText,
      isTeam = false
    ) => {
      button.addEventListener("click", () => {
        if (button.id === addId) {
          if (isTeam && listePokemonsTeam.length >= 6) {
            alert(
              "L'équipe est déjà pleine. Supprimer un Pokémon de l'équipe pour en ajouter."
            );
            return;
          }
          addAction(character);
          button.id = deleteId;
          button.textContent = deleteText;
        } else if (button.id === deleteId) {
          removeAction(character);
          button.id = addId;
          button.textContent = addText;
        }
      });
    };

    handleButtonClick(
      buttonFavoris,
      PokemonFavoris.addFavoris,
      PokemonFavoris.removeFavoris,
      "addFavoris",
      "deleteFavoris",
      "Ajouter en favoris",
      "Supprimer des Favoris"
    );

    handleButtonClick(
      buttonTeam,
      PokemonTeam.addToTeam,
      PokemonTeam.removeFromTeam,
      "addTeam",
      "deleteTeam",
      "Ajouter dans l'équipe",
      "Supprimer de l'équipe",
      true
    );

    const modals = {
      addPokemonModal: document.getElementById("addPokemonModal"),
    };

    const buttons = {
      addPokemon: document.getElementById("addPokemon"),
    };

    const spans = document.getElementsByClassName("close");

    const openModal = (modal) => {
      if (modal) modal.style.display = "block";
    };

    const closeModal = (modal) => {
      if (modal) modal.style.display = "none";
    };

    buttons.addPokemon?.addEventListener("click", () =>
      openModal(modals.addPokemonModal)
    );

    Array.from(spans).forEach((span) => {
      span.onclick = () => Object.values(modals).forEach(closeModal);
    });

    window.onclick = (event) => {
      Object.values(modals).forEach((modal) => {
        if (event.target === modal) closeModal(modal);
      });
    };
  }
}
