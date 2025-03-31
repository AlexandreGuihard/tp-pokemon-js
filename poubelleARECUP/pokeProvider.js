import { ENDPOINT, ENDPOINT2, ENDPOINT3, ENDPOINT4 } from "../config.js";

export default class PokeProvider{

    //static fetchPokemon() {
    //    return localStorage.getItem("pokemons")
    //      ? JSON.parse(localStorage.getItem("pokemons"))
    //      : [];
    //  }

      static fetchCharacters = async () => {
        try {
            const rep = await fetch(ENDPOINT);
    
            if (!rep.ok) throw new Error('Erreur fetchCharacters');
            const data = await rep.text();
            try {
                const jsonData = JSON.parse(data);
                //let teams = PokeProvider.fetchPokemon();
    //
                //for (let pokemon of jsonData) {
                //   
                //    let Pokemon = {
                //        id: pokemon.id,
                //        evolution: pokemon.evolution,
                //        level: 1,
                //        nextEvolutions: []
                //    };
    //
                //if (Pokemon.evolution.prev) {
                //    const prevEvolution = Pokemon.evolution.prev;
                //    const levelRequirement = parseInt(prevEvolution[1].replace(/\D/g, ''), 10);
                //    Pokemon.level = levelRequirement || 1;
                //}
//
                //if (Pokemon.evolution.next) {
                //    Pokemon.nextEvolutions = Pokemon.evolution.next.map(([id, condition]) => {
                //        const requiresItem = condition.toLowerCase().includes("use") || condition.toLowerCase().includes("holding");
                //        return {
                //            id: parseInt(id, 10),
                //            condition,
                //            requiresItem 
                //        };
                //    });
                //}
    //
                //  
                //    teams.push(Pokemon);
                //}
    //
              //
                //localStorage.setItem("pokemons", JSON.stringify(teams));
    //
                return jsonData;
            } catch {
                console.error('Reponse JSON invalide:', data);
                throw new Error('Reponse JSON invalide');
            }
        } catch (error) {
            console.error('Erreur fetchCharacters', error);
            throw error;
        }
    };

    static fetchCharacterById = async (id) => {
        try {
            const rep = await fetch(`${ENDPOINT}/${id}`)
            if(!rep.ok) throw new Error("Erreur fetchCharacterById")
            const data = await rep.text();
            try {
                const jsonData = JSON.parse(data);
                return jsonData;
            } catch {
                console.error("Reponse JSON invalide", data);
                throw new Error("Reponse JSON invalide");
            }
        } catch (error) {
            console.error('Erreur fetchCharacterById', error);
            throw error;
        }
    }
}