export default class Evolution {
  static findPrevEvolution(pokemon, pokedex) {
    if (!pokemon.evolution || !pokemon.evolution.prev) {
      return null;
    }
    const prevId = parseInt(pokemon.evolution.prev[0], 10);
    return pokedex.find((p) => p.id === prevId);
  }

  static findNextEvolution(pokemon, pokedex) {
    if (!pokemon.evolution || !pokemon.evolution.next) {
      return null;
    }
    for (let i = 0; i < pokemon.evolution.next.length; i++) {
      const nextId = parseInt(pokemon.evolution.next[i], 10);
      const nextPokemon = pokedex.find((p) => p.id === nextId);
      if (nextPokemon) {
        return nextPokemon;
      }
    }
  }


}
