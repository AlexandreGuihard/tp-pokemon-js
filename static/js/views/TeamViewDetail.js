import PokeProvider from "../services/PokeProvider.js";
import Utils from "../services/utils.js";
import { PokemonFavoris } from "../services/favoris.js";
import PokemonTeam from "../services/team.js";
import Pokemon from "../services/Pokemon.js";
import ItemsProvider from "../services/ItemsProvider.js";

export default class TeamViewDetail {
  async render() {
    let request = Utils.parseRequestURL();
    let teams = PokemonTeam.fetchTeam();

    if (
      request.index !== null &&
      request.index >= 0 &&
      request.index < teams.length
    ) {
      let pokemonData = teams[request.index];
      let pokemon = new Pokemon(pokemonData);
      let item = await ItemsProvider.fetchItemById(50);

      let view = `
        <section class="section">
            <div id="top">
              <h1 id="pokemon-name">${pokemon.name.french}</h1>
            
              <p id="id">#${pokemon.id}</p>

              <p id="level">Niveau ${pokemon.level}</p>
              
              <div id="item">
                <img id="item-image" src="../../../img/items/sprites/50.png" alt="Image de ${
                  item.name.english
                }">
                <p id="item-name">${item.name.english}</p>

              
                <button id="useItemButton">Utiliser cet objet</button>
              </div>
            </div>

            <div class="featured-img">
              ${
                request.index > 0
                  ? `<a href="#/teams/${parseInt(pokemon.id)}/${
                      parseInt(request.index) - 1
                    }" class="arrow left-arrow" id="leftArrow">
                       <img src="../../../img/chevron_left.svg" alt="back" />
                     </a>`
                  : ""
              }
              <img id="pokemon-image" src="${pokemon.image.hires}" alt="Image de ${
                    pokemon.name.french
                  }">
              ${
                request.index < teams.length - 1
                  ? `<a href="#/teams/${parseInt(pokemon.id)}/${
                      parseInt(request.index) + 1
                    }" class="arrow right-arrow" id="rightArrow">
                       <img src="../../../img/chevron_right.svg" alt="forward" />
                     </a>`
                  : ""
              }
            </div>
            <ul id="types">
              ${pokemon.type
                .map((typ) => `<li><p id="type">${typ}</p></li>`)
                .join("")}
            </ul>
              
            <section>
              <h2>À propos</h2>
              <div id="content">
                <div id="poids">
                    <div id="poidsHead">
                      <img src="../../../img/weight.svg" alt="weight" />
                      <p>${pokemon.profile.weight}</p>
                    </div>
                    <p>Poids</p>
                </div>
                <div id="taille">
                    <div id="tailleHead">
                      <img src="../../../img/height.svg" alt="height" />
                      <p>${pokemon.profile.height}</p>
                    </div>
                    <p>Taille</p>
                </div>
                <div id="capacite">
                    <ul>
                      ${pokemon.profile.ability
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

            <p id="description">${pokemon.description}</p>

            <section>
              <h3>Stats de base</h3>
              <h4>HP</h4>
              <p id="hp">${pokemon.base.HP}</p>

              <h4>Attaque</h4>
              <p id="attack">${pokemon.base.Attack}</p>

              <h4>Défense</h4>
              <p id="defense">${pokemon.base.Defense}</p>

              <h4>Attaque Spé.</h4>
              <p id="sp-attack">${pokemon.base["Sp. Attack"]}</p>

              <h4>Défense Spé.</h4>
              <p id="sp-defense">${pokemon.base["Sp. Defense"]}</p>

              <h4>Vitesse</h4>
              <p id="speed">${pokemon.base.Speed}</p>
            </section>
            <button type="button" id="addPokemon">Ajouter un Pokémon</button>
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
    } else {
      console.error("Index invalide ou hors limites :", request.id);
      return `
            <section class="section">
                <h1>Équipe Pokemon</h1>
                <p>Le Pokémon que vous cherchez n'est pas dans votre Équipe</p>
            </section>
        `;
    }
  }

  async afterRender() {
    let request = Utils.parseRequestURL();
    let allPokemons = await PokeProvider.fetchCharacters();
    console.log("Données récupérées pour tous les Pokémon :", allPokemons);
    console.log("Données récupérées pour le Pokémon :", request.id);

    let pokemon = await PokemonTeam.fetchPokemonbyIndex(request.index);
    console.log("Données récupérées pour le Pokémon :", pokemon);
    let listePokemons = PokemonFavoris.fetchFavoris();
    let pokemonObject = new Pokemon(pokemon);

    let listePokemonsTeam = PokemonTeam.fetchTeam();
    let item = await ItemsProvider.fetchItemById(50);

    const buttonFavoris = document.querySelector(".buttonFavoris");
    const buttonTeam = document.querySelector(".buttonTeam");

    const useItemButton = document.getElementById("useItemButton");

    const updateButtonState = (
      button,
      condition,
      addText,
      deleteText,
      addId,
      deleteId
    ) => {
      if (button) {
        if (condition) {
          button.id = deleteId;
          button.textContent = deleteText;
        } else {
          button.id = addId;
          button.textContent = addText;
        }
      }
    };

    updateButtonState(
      buttonFavoris,
      listePokemons.some((favPokemon) => favPokemon.id === pokemonObject.id),
      "Ajouter en favoris",
      "Supprimer des Favoris",
      "addFavoris",
      "deleteFavoris"
    );

    updateButtonState(
      buttonTeam,
      listePokemonsTeam.some(
        (teamPokemon) => teamPokemon.id === pokemonObject.id
      ),
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
      if (button) {
        button.addEventListener("click", () => {
          if (button.id === addId) {
            addAction(pokemonObject);
            button.id = deleteId;
            button.textContent = deleteText;
          } else if (button.id === deleteId) {
            removeAction(pokemonObject);
            button.id = addId;
            button.textContent = addText;
          }
        });
      }
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

    buttons.addPokemon.addEventListener("click", () =>
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

    const updateDisplay = (pokemon) => {
      const idElement = document.getElementById("id");
      if (idElement) idElement.textContent = `#${pokemon.id}`;

      const nameElement = document.getElementById("pokemon-name");
      if (nameElement) nameElement.textContent = pokemon.name.french;

      const levelElement = document.getElementById("level");
      if (levelElement) levelElement.textContent = `Niveau ${pokemon.level}`;

      const imageElement = document.getElementById("pokemon-image");
      if (imageElement) imageElement.src = pokemon.image.hires;

      const typeList = document.querySelector("#types");
      if (typeList) {
        typeList.innerHTML = pokemon.type
          .map((typ) => `<li><p id="type">${typ}</p></li>`)
          .join("");
      }

      const stats = {
        hp: document.getElementById("hp"),
        attack: document.getElementById("attack"),
        defense: document.getElementById("defense"),
        spAttack: document.getElementById("sp-attack"),
        spDefense: document.getElementById("sp-defense"),
        speed: document.getElementById("speed"),
      };

      if (stats.hp) stats.hp.textContent = pokemon.base.HP;
      if (stats.attack) stats.attack.textContent = pokemon.base.Attack;
      if (stats.defense) stats.defense.textContent = pokemon.base.Defense;
      if (stats.spAttack)
        stats.spAttack.textContent = pokemon.base["Sp. Attack"];
      if (stats.spDefense)
        stats.spDefense.textContent = pokemon.base["Sp. Defense"];
      if (stats.speed) stats.speed.textContent = pokemon.base.Speed;

      const descriptionElement = document.getElementById("description");
      if (descriptionElement)
        descriptionElement.textContent = pokemon.description;
    };

    if (useItemButton) {
      useItemButton.addEventListener("click", () => {
        console.log(`Vous avez utilisé l'objet : ${item.name.english}`);
        if (item.name.english === "Rare Candy") {
          pokemonObject.augmenterLevel();
          updateDisplay(pokemonObject);
          PokemonTeam.updateTeamByIndex(pokemonObject, request.index);
          const evolutionResult = pokemonObject.tryEvolve(allPokemons);
          if (evolutionResult) {
            updateDisplay(pokemonObject);
            PokemonTeam.updateTeamByIndex(pokemonObject, request.index);
          } else {
            console.log("Votre Pokémon ne peut pas évoluer pour le moment.");
          }
        }
      });
    }
  }
}
