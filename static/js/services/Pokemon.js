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
    this.Generation = this.getGeneration(this.id);
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

      if (
        conditionLower.includes("use") ||
        conditionLower.includes("holding")
      ) {
        if (
          this.heldItem &&
          conditionLower.includes(this.heldItem.toLowerCase())
        ) {
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

    console.log(
      `${this.name.french} a évolué en ${evolvedPokemon.name.french} !`
    );
    Object.assign(this, evolvedPokemon);
    this.heldItem = null;
  }

  getGeneration(id) {
    if (id <= 151) {
      return 1;
    } else if (id <= 251) {
      return 2;
    } else if (id <= 386) {
      return 3;
    } else if (id <= 493) {
      return 4;
    } else if (id <= 649) {
      return 5;
    } else if (id <= 721) {
      return 6;
    } else if (id <= 809) {
      return 7;
    } else if (id <= 898) {
      return 8;
    } else {
      return 1;
    }
  }

  ameliorerStat(stat, value) {
    if (this.base[stat] !== undefined) {
      this.base[stat] += value;
      console.log(
        `${this.name.french} a amélioré sa stat ${stat} de ${value}. Nouvelle valeur : ${this.base[stat]}`
      );
    } else {
      console.error(`Stat ${stat} non trouvée pour ${this.name.french}.`);
    }
  }
}
