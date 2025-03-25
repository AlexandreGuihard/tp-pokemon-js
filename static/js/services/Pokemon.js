export default class Pokemon {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
      this.type = data.type;
      this.base = data.base;
      this.species = data.species;
      this.description = data.description;
      this.evolution = data.evolution;
      this.profile = data.profile;
      this.image = data.image;
      this.level = data.level || 1; 
      this.heldItem = null; 
    }
  
    augmenterLevel() {
      this.level++;
      console.log(`${this.name.french} est maintenant niveau ${this.level}.`);
    }
  
    holdItem(item) {
      this.heldItem = item;
      console.log(`${this.name.french} tient maintenant ${item}.`);
    }
  
    checkConditionEvolve() {
      if (!this.evolution || !this.evolution.next) return null;
  
      for (const [nextEvolutionId, condition] of this.evolution.next) {
        const conditionLower = condition.toLowerCase();
  
        if (conditionLower.includes("level")) {
          const levelRequis = parseInt(condition.replace(/\D/g, ""), 10);
          if (this.level >= levelRequis) {
            return { id: nextEvolutionId, condition: condition };
          }
        }
  
        if (conditionLower.includes("use") || conditionLower.includes("holding")) {
          if (this.heldItem && conditionLower.includes(this.heldItem.toLowerCase())) {
            return { id: nextEvolutionId, condition: condition };
          }
        }
      }
  
      return null; 
    }
  
    tryEvolve(pokemonData) {
      const evolution = this.checkConditionEvolve();
      if (!evolution) {
        console.log(`${this.name.french} ne peut pas évoluer pour le moment.`);
        return false;
      }
  
      alert("Votre Pokémon va évoluer !");
      const res = confirm("Voulez-vous continuer ?");
  
      if (res) {
        console.log("Vous avez accepté l'évolution.");
        this.evolve(evolution.id, pokemonData);
        return true;
      } else {
        console.log("Vous avez refusé l'évolution.");
        return false;
      }
    }
  
   
    evolve(nextEvolutionId, pokemonData) {
      const evolvedPokemon = pokemonData.find((p) => p.id === nextEvolutionId);
      if (!evolvedPokemon) {
        console.error(`Évolution non trouvée pour l'ID ${nextEvolutionId}.`);
        return;
      }
  
      console.log(`${this.name.french} a évolué en ${evolvedPokemon.name.french} !`);
      Object.assign(this, evolvedPokemon); 
      this.heldItem = null; 
    }
  }