import { ENDPOINT, ENDPOINT2 } from "../config.js";

export default class Evolution {
    static fetchPokemon() {
        return localStorage.getItem("pokemons")
            ? JSON.parse(localStorage.getItem("pokemons"))
            : [];
    }

    static processPokemonData(jsonData) {
        const teams = [];

        for (let pokemon of jsonData) {
            let Pokemon = {
                id: pokemon.id,
                evolution: pokemon.evolution,
                level: 1,
                nextEvolutions: []
            };

            if (Pokemon.evolution.prev) {
                const prevEvolution = Pokemon.evolution.prev;
                const levelRequirement = parseInt(prevEvolution[1].replace(/\D/g, ''), 10);
                Pokemon.level = levelRequirement || 1;
            }

            if (Pokemon.evolution.next) {
                Pokemon.nextEvolutions = Pokemon.evolution.next.map(([id, condition]) => {
                    const requiresItem = condition.toLowerCase().includes("use") || condition.toLowerCase().includes("holding");
                    return {
                        id: parseInt(id, 10),
                        condition,
                        requiresItem
                    };
                });
            }

            teams.push(Pokemon);
        }

        localStorage.setItem("pokemons", JSON.stringify(teams));
    }
}
