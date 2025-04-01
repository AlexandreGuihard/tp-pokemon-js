import { ENDPOINT } from "../config.js";


export default class PokeProvider{

    static fetchCharacters = async () => {
        try {
            const rep = await fetch(ENDPOINT);
            if (!rep.ok) throw new Error('Erreur fetchCharacters');
            const data = await rep.json();
            return data;
        } catch (error) {
            console.error('Erreur fetchCharacters', error);
            throw error;
        }
    }

    static fetchCharacterById = async (id) => {
        try {
            console.log("fetchCharacterById", id)
            const rep = await fetch(`${ENDPOINT}/${id}`)
            if(!rep.ok) throw new Error("Erreur fetchCharacterById")
            const data = await rep.json()
            return data
        } catch (error) {
            
            console.error('Erreur fetchCharacterById', error);
          
            throw error;
        }
    }

    static updateCharacter = async (character, id) =>{
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(character)
        };
        try {
            const response = await fetch(`${ENDPOINT}/${id}`, options)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            return json
        } catch (err) {
            console.log('Error updating character level', err)
        }
    }

    static fetchPaginatedCharacters = async (page, limit) => {
        try {
            const rep = await fetch(`${ENDPOINT}?_page=${page}&per_page=${limit}`);
            if (!rep.ok) throw new Error('Erreur fetchPaginatedCharacters');
            const data = await rep.json();
            return data;
        } catch (error) {
            console.error('Erreur fetchPaginatedCharacters', error);
            throw error;
        }
    }

    static fetchPokemonRecherche = async (recherche) => {
        try {
            const rep = await fetch(`${ENDPOINT}`);
            if (!rep.ok) throw new Error('Erreur fetchPokemonRecherche');
            jsonData = await rep.json();
            if(recherche === ""){
                return jsonData;
            }
            const filteredData = jsonData.filter((pokemon) =>
                pokemon.name.french.toLowerCase().includes(recherche.toLowerCase())
            );
            return filteredData;
        } catch (error) {
            console.error('Erreur fetchPokemonRecherche', error);
            throw error;
        }
    }

    static fetchPaginedPokemonRecherche = async (recherche, page, limit) => {    
        try {
            const rep = await fetch(`${ENDPOINT}`);
            if (!rep.ok) {
                throw new Error(`Erreur fetchPaginedPokemonRecherche: ${rep.status} ${rep.statusText}`);
            }
    
            const jsonData = await rep.json();
            if (recherche === "") {
                return jsonData;
            }

            const filteredData = jsonData.filter((pokemon) =>
                pokemon.name.french.toLowerCase().includes(recherche.toLowerCase())
            );
    
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedData = filteredData.slice(startIndex, endIndex);
    
            return {
                data: paginatedData,
                total: filteredData.length,
                currentPage: page,
                hasNextPage: endIndex < filteredData.length,
                hasPrevPage: startIndex > 0,
            };
        } catch (error) {
            console.error('Erreur fetchPaginedPokemonRecherche', error);
            throw error;
        }
    };
}