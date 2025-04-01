import Pokemon from "../services/Pokemon.js";
import PokeProvider from "../services/PokeProvider.js";

export default class Personnages {



  async render() {
    let page = parseInt(localStorage.getItem("currentPage")) || 1;
    let limit = 10;
  
    let characters = await PokeProvider.fetchPaginatedCharacters(page, limit);
    console.log("characters", characters);

    const poks = characters.data.map(pokemon => new Pokemon(pokemon));
  
    let view = `
       <section class="section">
        <h1>Pokedex</h1>
        <input type="text" id="searchInput" placeholder="Rechercher un Pokémon" />
        <ul class="personnage">
          ${poks
            .map((character) => `
          <li class="pokemon-item">
            <p id="pokeId">${character.id}<p>
            <a href="#/personnages/${character.id}">
            <img src="${character.image.thumbnail}" alt="Image de ${character.name.french}">
            <div id='pokeName'>
              <h2>${character.name.french}</h2>
            </div>
          </li> 
          `)
            .join("")}
        </ul>
        <div class="pagination">
            <button id="prevPage" type="button" ${characters.prev === null ? "disabled" : ""}>Précédent</button>
            <button id="nextPage" type="button" ${characters.next === null ? "disabled" : ""}>Suivant</button>
        </div>
       </section>
    `;
    return view;
  }
  async renderRecherche(recherche) {
    if (!recherche || typeof recherche !== "string" || recherche.trim() === "") {
      throw new Error("Le paramètre 'recherche' doit être une chaîne non vide.");
    }
  
    let page = parseInt(localStorage.getItem("currentSearchPage")) || 1;
    let limit = 10;
  
    try {
      const characters = await PokeProvider.fetchPaginedPokemonRecherche(recherche, page, limit);
  
      if (characters.total === 0) {
        return `
          <section class="section">
            <h1>Pokedex</h1>
            <input type="text" id="searchInput" placeholder="Rechercher un Pokémon" value="${recherche}" />
            <p>Aucun résultat trouvé pour : "${recherche}"</p>
          </section>
        `;
      }
  
      const poks = characters.data.map(pokemon => new Pokemon(pokemon));
  
      let view = `
        <section class="section">
            <h1>Pokedex</h1>
            <input type="text" id="searchInput" placeholder="Rechercher un Pokémon" value="${recherche}" />
            <p>Recherche pour : "${recherche}"</p>
            <p>${characters.total} résultat(s) trouvé(s)</p>
            <ul class="personnage">
                ${poks
                  .map((character) => `
                    <li class="pokemon-item">
                        <p id="pokeId">${character.id}</p>
                        <a href="#/personnages/${character.id}">
                        <img src="${character.image.thumbnail}" alt="Image de ${character.name.french}">
                        <div id='pokeName'>
                            <h2>${character.name.french}</h2>
                        </div>
                    </li> 
                  `)
                  .join("")}
            </ul>
            <div class="pagination">
                <button id="prevPageRecherche" type="button" ${!characters.hasPrevPage ? "disabled" : ""}>Précédent</button>
                <button id="nextPageRecherche" type="button" ${!characters.hasNextPage ? "disabled" : ""}>Suivant</button>
            </div>
        </section>
      `;
      return view;
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      return `
        <section class="section">
          <h1>Pokedex</h1>
          <p>Une erreur est survenue lors de la recherche. Veuillez réessayer plus tard.</p>
        </section>
      `;
    }
  }


    
async afterRender() {
  const searchInput = document.getElementById("searchInput");
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");
  const prevButtonRecherche = document.getElementById("prevPageRecherche");
  const nextButtonRecherche = document.getElementById("nextPageRecherche");

  let currentPage = parseInt(localStorage.getItem("currentPage")) || 1; 
  

  prevButton?.addEventListener("click", async (event) => {
      event.preventDefault();
      if (currentPage > 1) {
          currentPage--; 
          localStorage.setItem("currentPage", currentPage); 
          const content = document.querySelector("#content");
          content.innerHTML = await this.render(); 
          this.afterRender(); 
      }
  });

  nextButton?.addEventListener("click", async (event) => {
      event.preventDefault();
      currentPage++;
      localStorage.setItem("currentPage", currentPage); 
      const content = document.querySelector("#content");
      content.innerHTML = await this.render(); 
      this.afterRender(); 
  });

  prevButtonRecherche?.addEventListener("click", async (event) => {
      event.preventDefault();
      if (currentSearchPage > 1) {
          currentSearchPage--;
          localStorage.setItem("currentSearchPage", currentSearchPage);
          const content = document.querySelector("#content");
          content.innerHTML = await this.renderRecherche(searchInput.value.trim());
          this.afterRender();
      }
  });

  nextButtonRecherche?.addEventListener("click", async (event) => {
      event.preventDefault();
      currentSearchPage++;
      localStorage.setItem("currentSearchPage", currentSearchPage);
      const content = document.querySelector("#content");
      content.innerHTML = await this.renderRecherche(searchInput.value.trim());
      this.afterRender();
  });

  searchInput?.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
          const recherche = searchInput.value.trim();
          if(recherche == "") {
              const content = document.querySelector("#content");
              content.innerHTML = await this.render();
              this.afterRender();
          } else
          if (recherche) {
              localStorage.setItem("currentSearchPage", 1);
              const content = document.querySelector("#content");
              content.innerHTML = await this.renderRecherche(recherche);
              this.afterRender();
          }
      }
  });
}
}