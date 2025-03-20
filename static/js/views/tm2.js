import PokeProvider from "../services/PokeProvider.js";
import Utils from "../services/utils.js";
import { PokemonFavoris } from "../services/favoris.js";
import PokemonTeam from "../services/team.js";
import Pokemon from "../services/Pokemon.js";
import ItemsProvider from "../services/ItemsProvider.js";

export default class TeamViewDetail {
  async render() {
    let request = Utils.parseRequestURL();
    let character = await PokeProvider.fetchCharacterById(request.id);
    let team = PokemonTeam.fetchPokemonbyId(request.id);
    console.log("team", team);
    let pokemon = new Pokemon(character);
    console.log("pokemon", pokemon);

    let item = await ItemsProvider.fetchItemById(50);
    console.log("item", item);

    let view = `
     <main class="detail-main main">
     <header class="header">
        <div class="header-wrapper">
        <div class="header-wrap">
            <a href="#/teams" class="back-btn-wrap">
              <img
                src="../../../img/back-to-home.svg"
                alt="back to home"
                class="back-btn"
                id="back-btn"
              />
            </a>
            <div class="name-wrap">
              <h1 class="name">${pokemon.name.french}</h1>
            </div>
          </div>
          <div class="pokemon-id-wrap">
            <p class="body2-fonts">#${pokemon.id}</p>
          </div>
        </div
        
      </header>
        <section class="section">
            <div id="top">
                
                <p id="level">Niveau ${pokemon.level}</p>
                
                <div id="item">
                    <img id="item-image" src="../../../img/items/sprites/50.png" alt="Image de ${item.name.english}">
                    <p id="item-name">${item.name.english}</p>
                    <button id="useItemButton">Utiliser cet objet</button>
                </div>
                
            </div>

            <div class="featured-img">
        <a href="#/teams/1" class="arrow left-arrow" id="leftArrow">
          <img src="../../../img/chevron_left.svg" alt="back" />
        </a>
            <img id="pokemon-image" src="${pokemon.image.hires}" alt="Image de ${pokemon.name.french}">
             <a href="#/teams/${pokemon.id +1}" class="arrow right-arrow" id="rightArrow">
          <img src="../../../img/chevron_right.svg" alt="forward" />
        </a>
      </div>
            <ul id="types">
                ${pokemon.type
                    .map((typ) => `<li><p id="type">${typ}</p></li>`)
                    .join("")}
            </ul>
                
            <section>
                <h2>À propos</h2>
                <div id="poids">
                    <p>${pokemon.profile.weight}</p>
                    <p>Poids</p>
                </div>
                <div id="taille">
                    <p>${pokemon.profile.height}</p>
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
            <button type="button" id="evolution">Faire évoluer</button>
        </section>

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

        <img src="../../../img/pokedex.svg" alt="pokedex" class="detail-bg" />
    </main>
    `;

    return view;
}

  async afterRender() {
    let request = Utils.parseRequestURL();
    let allPokemons = await PokeProvider.fetchCharacters();
    let pokemon = await PokeProvider.fetchCharacterById(request.id);
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
        listePokemonsTeam.some((teamPokemon) => teamPokemon.id === pokemonObject.id),
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
        if (stats.spAttack) stats.spAttack.textContent = pokemon.base["Sp. Attack"];
        if (stats.spDefense) stats.spDefense.textContent = pokemon.base["Sp. Defense"];
        if (stats.speed) stats.speed.textContent = pokemon.base.Speed;

        const descriptionElement = document.getElementById("description");
        if (descriptionElement) descriptionElement.textContent = pokemon.description;

        
    };


    if (useItemButton) {
        useItemButton.addEventListener("click", () => {
            console.log(`Vous avez utilisé l'objet : ${item.name.english}`);
            if (item.name.english === "Rare Candy") {
                pokemonObject.augmenterLevel();
                updateDisplay(pokemonObject);

                const evolutionResult = pokemonObject.tryEvolve(allPokemons);
                if (evolutionResult) {
                    console.log("Évolution réussie !");
                    updateDisplay(pokemonObject);
                    if(PokemonFavoris.isFavorite(pokemonObject)){
                        PokemonFavoris.updateFavoris(pokemonObject);
                    }
                } else {
                    console.log("Votre Pokémon ne peut pas évoluer pour le moment.");
                }
            }
        });
    }
}
}