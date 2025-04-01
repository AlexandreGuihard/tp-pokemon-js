import PokeProvider from "../services/PokeProvider.js";
import Utils from "../services/utils.js";
import { PokemonFavoris } from "../services/favoris.js";
import PokemonTeam from "../services/team.js";
import Pokemon from "../services/Pokemon.js";
import Notation from "../services/Notation.js";
import Sac from "../services/sac.js";

export default class PokemonDetail {
  async render() {
    let request = Utils.parseRequestURL();
    let isTeamView = request.index !== null && request.index !== undefined;
    
    if (isTeamView) {
      let teams = PokemonTeam.fetchTeam();
      if (request.index !== null && request.index >= 0 && request.index < teams.length) {
        let pokemonData = teams[request.index];
        let pokemon = new Pokemon(pokemonData);

        return this.renderTeamView(pokemon, request);
      } else {
        return this.renderNotFound("Équipe Pokemon", "Le Pokémon que vous cherchez n'est pas dans votre Équipe");
      }
    } else {
      try {
        let pokemon = await PokeProvider.fetchCharacterById(request.id);
        return this.renderGlobalView(pokemon);
      } catch (error) {
        return this.renderNotFound("Pokemon", "Le Pokémon que vous cherchez n'existe pas");
      }
    }
  }

renderTeamView(pokemon, request) {
  return `
    <section class="section">
      <div id="top">
        <h1 id="pokemon-name">${pokemon.name.french}</h1>
        <p id="id">#${pokemon.id}</p>
        <p id="level">Niveau ${pokemon.level}</p>

        <div id="sac-container">
          <button id="prev-item" class="carousel-button">◀</button>
          <div id="sac-items" class="carousel">
            <p>Chargement des items...</p>
          </div>
          <button id="next-item" class="carousel-button">▶</button>
        </div>
        <button class="use-item-button">Utiliser</button>
        <button id="remove-item-button">Vider</button>
      </div>

      <div class="featured-img">
        ${request.index > 0 ? `
          <a href="#/teams/${parseInt(pokemon.id)}/${parseInt(request.index) - 1}" class="arrow left-arrow" id="leftArrow">
            <img src="/img/chevron_left.svg" alt="back" />
          </a>` : ''}
        
          <img id="pokemon-image" src="${pokemon.image.hires}" alt="Image de ${pokemon.name.french}">
          
          ${request.index < PokemonTeam.fetchTeam().length - 1 ? `
            <a href="#/teams/${parseInt(pokemon.id)}/${parseInt(request.index) + 1}" class="arrow right-arrow" id="rightArrow">
              <img src="/img/chevron_right.svg" alt="forward" />
            </a>` : ''}
        </div>

        ${this.renderCommonDetails(pokemon)}
        ${this.renderNoteSection()}
        
        <button type="button" id="addPokemon">Ajouter un Pokémon</button>
        ${this.renderAddPokemonModal()}
      </section>
    `;
  }

  renderGlobalView(pokemon) {
    return `
      <section class="section">
        <div id="top">
          <h1 id="pokemon-name">${pokemon.name.french}</h1>
          <p id="id">#${pokemon.id}</p>
           <div id="sac-container">
          <button id="prev-item" class="carousel-button">◀</button>
          <div id="sac-items" class="carousel">
            <p>Chargement des items...</p>
          </div>
          <button id="next-item" class="carousel-button">▶</button>
        </div>
        <button class="use-item-button">Utiliser</button>
        <button id="remove-item-button">Vider</button>
            
        </div>

        <div class="featured-img">
          <a href="#/personnages/${parseInt(pokemon.id) - 1}" class="arrow left-arrow" id="leftArrow">
            <img src="/img/chevron_left.svg" alt="back" />
          </a>
          <img id="pokemon-image" src="${pokemon.image.hires}" alt="Image de ${pokemon.name.french}">
          <a href="#/personnages/${parseInt(pokemon.id) + 1}" class="arrow right-arrow" id="rightArrow">
            <img src="/img/chevron_right.svg" alt="forward"/>
          </a>
        </div>

        ${this.renderCommonDetails(pokemon)}
        ${this.renderNoteSection()}
        
        <button type="button" id="addPokemon">Ajouter un Pokemon</button>
        ${this.renderAddPokemonModal()}
      </section>
    `;
  }

  renderCommonDetails(pokemon) {
    return `
      <ul id="types">
        ${pokemon.type.map(typ => `<li><p id="type">${typ}</p></li>`).join("")}
      </ul>
      
      <section>
        <h2>À propos</h2>
        <div id="content">
          <div id="poids">
            <div id="poidsHead">
              <img src="/img/weight.svg" alt="weight" />
              <p>${pokemon.profile.weight}</p>
            </div>
            <p>Poids</p>
          </div>
          <div id="taille">
            <div id="tailleHead">
              <img src="/img/height.svg" alt="height" />
              <p>${pokemon.profile.height}</p>
            </div>
            <p>Taille</p>
          </div>
          <div id="capacite">
            <ul>
              ${pokemon.profile.ability.map(capacite => `
                <li><p id="capacite">${capacite[0]}</p></li>
              `).join("")}
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
    `;
  }

  renderNoteSection() {
    return `
      <section>
        <h3>Note</h3>
        <div id="note-section">
          <input type="number" id="note-input" min="0" max="10" placeholder="Donnez une note (0-10)" />
          <button type="button" id="submit-note">Soumettre</button>
          <p id="note-display">Note Moyenne : <span id="current-note">Aucune</span></p>
          <button type="button" id="edit-note">Modifier la note</button>
        </div>

        <div id="editNoteModal" class="modal">
          <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Modifier une note</h2>
            <ul id="note-list"></ul>
            <button type="button" id="submit-note-changes">Enregistrer les modifications</button>
          </div>
        </div>
      </section>
    `;
  }

  renderAddPokemonModal() {
    return `
      <div id="addPokemonModal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>Ajouter un Pokémon</h2>
          <section class="allbtn">
            <button type="button" id="addFavoris" class="buttonFavoris">Ajouter en favoris</button>
          </section>
          <section class="allbtn">
            <button id="open-remove-team-modal">Modifier l'équipe</button>
            ${this.renderRemoveFromTeamModal()}
          </section>
        </div>
      </div>
    `;
  }
  
  

  renderRemoveFromTeamModal() {
    return `
      <div id="removeFromTeamModal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>Supprimer un Pokémon de l'équipe</h2>
          <ul id="team-list">
          </ul>
        </div>
      </div>
    `;
  }
  

  renderNotFound(title, message) {
    return `
      <section class="section">
        <h1>${title}</h1>
        <p>${message}</p>
      </section>
    `;
  }


  async afterRender() {
    const request = Utils.parseRequestURL();
    const isTeamView = request.index !== null && request.index !== undefined;
    
    let pokemonObject;
    let allPokemons = [];
    
    if (isTeamView) {
      allPokemons = await PokeProvider.fetchCharacters();
      const teamPokemon = await PokemonTeam.fetchPokemonbyIndex(request.index);
      pokemonObject = new Pokemon(teamPokemon);
    } else {
      const pokemon = await PokeProvider.fetchCharacterById(request.id);
      pokemonObject = new Pokemon(pokemon);
    }

    const listePokemons = PokemonFavoris.fetchFavoris();
    const listePokemonsTeam = PokemonTeam.fetchTeam();
    
    const noteInput = document.getElementById("note-input");
    const submitNoteButton = document.getElementById("submit-note");
    const noteDisplay = document.getElementById("current-note");
    const noteList = document.getElementById("note-list");
    const editNoteButton = document.getElementById("edit-note");

  const teamList = document.getElementById("team-list");

    
    const averageNote = await Notation.noteMoyenne(pokemonObject.id);
    noteDisplay.textContent = averageNote ? averageNote.toFixed(2) : "Aucune note";
    
    const servicesNote = await Notation.fetchNotationById(pokemonObject.id);
    console.log("pokemonId", pokemonObject.id);
    if (servicesNote && noteList) {
      noteList.innerHTML = '';
      servicesNote.forEach(note => {
        noteList.appendChild(this.createNoteElement(note));
        console.log("note", note);
      });
    }

    submitNoteButton?.addEventListener("click", async () => {
      const noteValue = parseFloat(noteInput.value);
      if (isNaN(noteValue) || noteValue < 0 || noteValue > 10) {
        alert("Veuillez entrer une note valide entre 0 et 10.");
        return;
      }
      
      const newNote = await Notation.pushNotation(pokemonObject.id, noteValue);
      if (noteList) noteList.appendChild(this.createNoteElement(newNote));
      
      const updatedAverage = await Notation.noteMoyenne(pokemonObject.id);
      noteDisplay.textContent = updatedAverage.toFixed(2);
      noteInput.value = "";
    });

    const buttonFavoris = document.querySelector(".buttonFavoris") || document.getElementById("addFavoris");

    const updateButtonState = (button, condition, addText, deleteText, addId, deleteId) => {
      if (button) {
        button.id = condition ? deleteId : addId;
        button.textContent = condition ? deleteText : addText;
      }
    };

    updateButtonState(
      buttonFavoris,
      listePokemons.some(p => p.id === pokemonObject.id),
      "Ajouter en favoris",
      "Supprimer des Favoris",
      "addFavoris",
      "deleteFavoris"
    );


    const handleButtonClick = (button, addAction, removeAction, addId, deleteId, addText, deleteText, isTeam = false) => {
      button?.addEventListener("click", () => {
        if (button.id === addId) {
          if (isTeam && listePokemonsTeam.length >= 6) {
            alert("L'équipe est déjà pleine (max 6 Pokémon).");
            return;
          }
          addAction(pokemonObject);
          button.id = deleteId;
          button.textContent = deleteText;
        } else {
            removeAction(pokemonObject);
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

    

    const modals = {
      addPokemonModal: document.getElementById("addPokemonModal"),
      editNoteModal: document.getElementById("editNoteModal"),
      removeFromTeamModal: document.getElementById("removeFromTeamModal")
    };

    const buttons = {
      addPokemon: document.getElementById("addPokemon"),
      editNote: editNoteButton,
      submitNoteChanges: document.getElementById("submit-note-changes"),
      closeModal: document.querySelectorAll(".close"),
      deleteTeam: document.getElementById("deleteTeam"),
      openRemoveTeamModalBtn: document.getElementById("open-remove-team-modal"),
    };

    const toggleModal = (modal, show) => {
      if (modal) modal.style.display = show ? "block" : "none";
    };

    buttons.addPokemon?.addEventListener("click", () => toggleModal(modals.addPokemonModal, true));
    buttons.editNote?.addEventListener("click", () => toggleModal(modals.editNoteModal, true));
    buttons.deleteTeam?.addEventListener("click", () => toggleModal(modals.removeFromTeamModal, true));
    buttons.openRemoveTeamModalBtn?.addEventListener("click", () => toggleModal(modals.removeFromTeamModal, true));

    Array.from(buttons.closeModal || []).forEach(span => {
      span.addEventListener("click", () => {
        Object.values(modals).forEach(modal => toggleModal(modal, false));
      });
    });

    window.addEventListener("click", (event) => {
      Object.values(modals).forEach(modal => {
        if (event.target === modal) toggleModal(modal, false);
      });
    });

    teamList.innerHTML = listePokemonsTeam.map((pokemon, index) => `
      <li>
        <img src="${pokemon.image.hires}" alt="${pokemon.name.french}" width="50">
        <span>${pokemon.name.french} (Niv. ${pokemon.level})</span>
        <button class="remove-from-team-btn" data-index="${index}">Supprimer</button>
      </li>
    `).join('');

    
        const updateTeamList = () => {
            const team = PokemonTeam.fetchTeam();
            teamList.innerHTML = team.map((pokemon, index) => `
              <li>
                <img src="${pokemon.image.hires}" alt="${pokemon.name.french}" width="50">
                <span>${pokemon.name.french} (Niv. ${pokemon.level})</span>
                <button class="remove-from-team-btn" data-index="${index}">Supprimer</button>
              </li>
            `).join('');
          };
        
          buttons.openRemoveTeamModalBtn?.addEventListener("click", () => {
            updateTeamList();
            toggleModal(modals.removeFromTeamModal, true);
          });
        
          teamList.addEventListener("click", (e) => {
            if (e.target.classList.contains('remove-from-team-btn')) {
              const index = e.target.getAttribute('data-index');
              PokemonTeam.removeFromTeamByIndex(index);
              updateTeamList(); 
            }
          });
        
  
    

          buttons.submitNoteChanges?.addEventListener("click", async () => {
            const noteItems = document.querySelectorAll(".note-item input");
            let isValid = true;
        
            for (const input of noteItems) {
                const noteId = input.dataset.noteId;
                const newValue = parseFloat(input.value);
        
                if (!this.validateNoteInput(newValue)) {
                    isValid = false;
                    alert(`La note pour l'ID ${noteId} doit être un nombre entre 0 et 10.`);
                    break;
                }
            }

            if (!isValid) return; 
        
            for (const input of noteItems) {
                const noteId = input.dataset.noteId;
                const newValue = parseFloat(input.value);
        
                await Notation.updateNotation(noteId, { note: newValue });
            }
        
            const updatedAverage = await Notation.noteMoyenne(pokemonObject.id);
            noteDisplay.textContent = updatedAverage.toFixed(2);
        
            toggleModal(modals.editNoteModal, false);
        });

   
      const sacItemsContainer = document.getElementById("sac-items");
      const prevButton = document.getElementById("prev-item");
      const nextButton = document.getElementById("next-item");
      const useItemButton = document.querySelector(".use-item-button");
      const removeItemButton = document.getElementById("remove-item-button");
      
      let sacItems = Sac.fetchObjets();
      let currentIndex = 0;

      const updateCarousel = () => {
        if (sacItems.length === 0) {
          sacItemsContainer.innerHTML = "<p>Le sac est vide.</p>";
          if (prevButton) prevButton.style.display = "none";
          if (nextButton) nextButton.style.display = "none";
          if (useItemButton) useItemButton.style.display = "none";
          if (removeItemButton) removeItemButton.style.display = "none";
        } else {
          const { id, typeD , nom, quantite } = sacItems[currentIndex];
          console.log("sacItems", sacItems);
          

          sacItemsContainer.innerHTML = `
            <div class="carousel-item">
              <img src="/img/items/sprites/${id}.png" alt="${nom}">
              <p>${nom} (x${quantite})</p>
              <p>Type: ${typeD}</p>
            </div>
          `;
        }
      };

      const updateDisplaySac = () => {
        sacItems = Sac.fetchObjets();
        if (sacItems.length === 0) {
          updateCarousel();
        } else {
          if (currentIndex >= sacItems.length) {
            currentIndex = sacItems.length - 1;
          }
          updateCarousel();
        }
      };

      prevButton?.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      });

      nextButton?.addEventListener("click", () => {
        if (currentIndex < sacItems.length - 1) {
          currentIndex++;
          updateCarousel();
        }
      });

      useItemButton?.addEventListener("click", () => {
        const { id, typeD ,nom } = sacItems[currentIndex];
        
        this.handleObjet(typeD, nom, pokemonObject, request.index, allPokemons);
        Sac.removeObjet(id, 1);
        updateDisplaySac();
        }

        );
        removeItemButton?.addEventListener("click", () => {
          const { id, nom } = sacItems[currentIndex];
          Sac.viderSac(id);
          updateDisplaySac();
        });

        updateDisplaySac();
        
        
        
    }
    
    updateDisplayInfo(pokemon) {
        document.getElementById("pokemon-name").textContent = pokemon.name.french;
        document.getElementById("id").textContent = `#${pokemon.id}`;
        document.getElementById("level").textContent = `Niveau ${pokemon.level}`;
        document.getElementById("pokemon-image").src = pokemon.image.hires;
        document.getElementById("description").textContent = pokemon.description;
        document.getElementById("hp").textContent = pokemon.base.HP;
        document.getElementById("attack").textContent = pokemon.base.Attack;
        document.getElementById("defense").textContent = pokemon.base.Defense;
        document.getElementById("sp-attack").textContent = pokemon.base["Sp. Attack"];
        document.getElementById("sp-defense").textContent = pokemon.base["Sp. Defense"];
        document.getElementById("speed").textContent = pokemon.base.Speed;
        }
    
     

    createNoteElement(note) {
       const li = document.createElement("li");
           li.id = note.id;
           li.className = "note-item";
         
           const input = document.createElement("input");
           input.type = "number";
           input.value = note.note;
           input.min = 0;
           input.max = 10;
           input.dataset.noteId = note.id;
           li.appendChild(input);
       
           const deleteIcon = document.createElement("img");
           deleteIcon.src = "/img/poubelle.svg"; 
           deleteIcon.alt = "Supprimer";
           deleteIcon.className = "delete-icon";
           
           deleteIcon.addEventListener("click", async () => {
             await Notation.deleteNotation(note.id);
       
             li.remove();
           });
           li.appendChild(deleteIcon);
           
           return li;
         }


    validateNoteInput(value) {
        return !isNaN(value) && value >= 0 && value <= 10;
    }


    addButtonEventListener(button, callback) {
        if (button) {
            button.addEventListener("click", callback);
        }
    }

    handleObjet(type, nom, pokemon, indice, allPokemons){
        if(type){
            if(type === "Medicine"){
                this.handleMedicine(nom, pokemon, indice, allPokemons);
            }else if(type === "Pokeballs"){
                this.handlePokeballs(nom, pokemon, indice);
            } else if(type === "Battle items"){
                this.handleBattleItems(nom, pokemon, indice);
            } 
            else {
                alert("Vous avez utilisé l'objet " + nom );
            }
            
        }
    }

    handleMedicine(nom, pokemon, indice, allPokemons){
        if(nom === "Rare Candy"){
            pokemon.augmenterLevel();
            PokemonTeam.updateTeamByIndex(pokemon, indice);
            const evolutionResult = pokemon.tryEvolve(allPokemons);
            if (evolutionResult) {
                PokemonTeam.updateTeamByIndex(pokemon, indice);
            } else {
                console.log("Votre Pokémon ne peut pas évoluer pour le moment.");
            }
            this.updateDisplayInfo(pokemon);
        }
    }

    handlePokeballs(nom, pokemon){
        alert("Vous avez utilisé une " + nom + " !");
        PokemonTeam.addToTeam(pokemon);
    }



    handleBattleItems(nom, pokemon, indice){
        if(nom === "X Attack"){
            pokemon.ameliorerStat("Attack", 1.5);
        }else if(nom === "X Defense"){
            pokemon.ameliorerStat("Defense", 1.5);
        }else if(nom === "X Sp. Attack"){
            pokemon.ameliorerStat("Sp. Attack", 1.5);   
        }else if(nom === "X Sp. Defense"){
            pokemon.ameliorerStat("Sp. Defense", 1.5);  
        }else if(nom === "X Speed"){
            pokemon.ameliorerStat("Speed", 1.5);  
        }
        PokemonTeam.updateTeamByIndex(pokemon, indice);
        this.updateDisplayInfo(pokemon);
    }

}

  