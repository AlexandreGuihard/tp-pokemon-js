import { ENDPOINT, ENDPOINT2, ENDPOINT3, ENDPOINT4 } from "../config.js";

export default class PokeProvider{

    static fetchCharacters = async () => {
        try {
            const rep = await fetch(ENDPOINT);
            if (!rep.ok) throw new Error('Erreur fetchCharacters');
            const data = await rep.text();
            try {
                const jsonData = JSON.parse(data);
                return jsonData;
            } catch {
                console.error('Reponse JSON invalide:', data);
                throw new Error('Reponse JSON invalide');
            }
        } catch (error) {
            console.error('Erreur fetchCharacters', error);
            throw error;
        }
    }

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
}