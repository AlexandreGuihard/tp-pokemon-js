import Pokemon from "../services/Pokemon.js";
import PokeProvider from "../services/PokeProvider.js";

export default class Personnages {



async render() {
  let page = parseInt(localStorage.getItem("currentPage")) || 1;
  let limit = 10;

  let characters = await PokeProvider.fetchPaginatedCharacters(page, limit);
  let poks = [];
  characters.data.forEach(element => {
    poks.push(new Pokemon(element));
  });

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
          <button id="prevPage" type="button" ${page === 1 ? "disabled" : ""}>Précédent</button>
          <button id="nextPage" type="button">Suivant</button>
      </div>
     </section>
  `;
  return view;
}

async renderRecherche(recherche) {
  let page = parseInt(localStorage.getItem("currentSearchPage")) || 1;
  let limit = 10;

  const characters = await PokeProvider.fetchPaginedPokemonRecherche(recherche, page, limit);

  let poks = [];
  characters.data.forEach(element => {
    poks.push(new Pokemon(element));
  });

  let view = `
      <section class="section">
          <h1>Pokedex</h1>
          <input type="text" id="searchInput" placeholder="Rechercher un Pokémon" value="${recherche}" />
          <p>Recherche pour : ${recherche}</p>
          <p>${characters.total} résultat(s) trouvé(s)</p>
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
              <button id="prevPageRecherche" type="button" ${page === 1 ? "disabled" : ""}>Précédent</button>
              <button id="nextPageRecherche" type="button" ${page * limit >= characters.total ? "disabled" : ""}>Suivant</button>
          </div>
      </section>
  `;
  return view;
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