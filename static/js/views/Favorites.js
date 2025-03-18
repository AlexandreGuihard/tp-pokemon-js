import { PokemonFavoris } from "../services/favoris.js";

export default class Favorites {

    async render() {

        let favoris = PokemonFavoris.fetchFavoris()
        let view = `
            <section class="section">
                <h1>Pokemon Favoris</h1>
                <ul class="personnage">
                    ${favoris.map(pokemon => {
                        return `
                        <li> 
                        <a href="#/personnages/${pokemon.id}">
                            <section class="container">
                                <img src="${pokemon.image.sprite}" alt="image de ${pokemon.name.french}" />
                                <h3>${pokemon.name.french}</h3>
                            </section>
                        </a>
                        </li>
                        `;
                     }).join('')}
                </ul>
        `;
        return view;
    }
}