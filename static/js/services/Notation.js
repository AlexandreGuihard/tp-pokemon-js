import { ENDPOINT5 } from "../config.js";

export default class Notation {


    static fetchNotation = async () => {
        try {
            const rep = await fetch(ENDPOINT5);

            if (!rep.ok) throw new Error('Erreur fetchNotation');
            const data = await rep.json();
            return data;
        } catch (error) {
            console.error('Erreur fetchNotation', error);
            throw error;
        }
    }
    static fetchNotationById = async (id) => {
        try {
            const rep = await fetch(`${ENDPOINT5}?idPokemon=${id}`);
            if (!rep.ok) {
                if (rep.status === 404) {
                    console.warn(`Notation avec l'id ${id} introuvable.`);
                    return null; 
                }
                throw new Error("Erreur fetchNotationById");
            }
            const data = await rep.json();
            return data;
        } catch (error) {
            console.error('Erreur fetchNotationById', error);
            throw error;
        }
    };

    static pushNotation = async (idPokemon, note) => {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idPokemon, note })
            };
            const response = await fetch(ENDPOINT5, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            return json;

        } catch (error) {
            console.error('Erreur pushNotation', error);
            throw error;
        }
    }

    static updateNotation = async (noteId, newNotes) => {
        const options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newNotes),
        };
      
        try {
          const response = await fetch(`${ENDPOINT5}/${noteId}`, options);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const json = await response.json();
          return json;
        } catch (err) {
          console.error("Erreur lors de la mise à jour de la note", err);
          throw err;
        }
      };

    static deleteNotation = async (noteId) => {
        try {
            const response = await fetch(`${ENDPOINT5}/${noteId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Erreur lors de la suppression de la note: ${response.status}`);
            }
            return true; 
        } catch (error) {
            console.error('Erreur deleteNotation', error);
            throw error; 
        }
    }

    static noteMoyenne = async (id) => {
        try {
            const notes = await Notation.fetchNotationById(id);
            console.log("ici", notes);
            if (!notes || notes.length === 0) {
                console.warn(`Aucune notation trouvée pour l'ID ${id}`);
                return 0; 
            }
            const sum = notes.reduce((acc, note) => acc + note.note, 0);
            return sum / notes.length;
        } catch (error) {
            console.error(`Erreur lors du calcul de la note moyenne pour l'ID ${id}`, error);
            throw error; 
        }
    };
    
}