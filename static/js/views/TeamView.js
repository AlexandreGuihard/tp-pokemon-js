
import PokemonTeam from "../services/team.js";

export default class TeamView {

    async render() {

        let teams = PokemonTeam.fetchTeam()
        let view = `
            <section class="section">
                <h1>Équipe Pokemon</h1>
                <ul class="personnage">
                    ${teams.map(pokemon => {
                        return `
                        <li> 
                        <a href="#/teams/${pokemon.id}">
                            <section class="container">
                                <img src="${pokemon.image.sprite}" alt="image de ${pokemon.name.french}" />
                                <h3>${pokemon.name.french}</h3>
                            </section>
                        </a>
                        </li>
                        `;
                     }).join('')}
                </ul>
            </section>
        `;
        return view;
    }
}