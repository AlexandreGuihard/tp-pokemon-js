

export default class PokemonTeam {
  static fetchTeam() {
    return localStorage.getItem("team")
      ? JSON.parse(localStorage.getItem("team"))
      : [];
  }

  static addToTeam(pokemon) {
    let teams = PokemonTeam.fetchTeam();
    if (teams.length >= 6) {
        alert("L'équipe est déjà pleine. Supprimer un pokemon de l'équipe pour en ajouter");
        return false; 
    }
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id === pokemon.id) {
            alert("Ce pokemon est déjà dans l'équipe");
            return false; 
        }
    }
    alert("Ce pokemon a été ajouté dans l'équipe");
    teams.push(pokemon);
    localStorage.setItem("team", JSON.stringify(teams));
    return true; 
}

  static removeFromTeam(pokemon) {
    let teams = PokemonTeam.fetchTeam();
    for (let i = 0; i < teams.length; i++) {
      if (teams[i].id === pokemon.id) {
        teams.splice(i, 1);
      }
    }
    return localStorage.setItem("team", JSON.stringify(teams));
  }

  static fetchPokemonbyId(id) {
    let teams = PokemonTeam.fetchTeam();
    
    for (let i = 0; i < teams.length; i++) {
      console.log(teams[i].id);
      console.log(id);
      if (teams[i].id == id) {
        console.log(teams[i]);
        
        return teams[i];
      }
    }
    return null;
  }

  static fetchPokemonbyIndex(position){
    console.log("POSITION "+position);
    let teams = PokemonTeam.fetchTeam();
    return teams[position];
  }

  static updateTeamByIndex(pokemon, index) {
    let teams = PokemonTeam.fetchTeam();

    if (index >= 0 && index < teams.length) {
        teams[index] = pokemon; // Mettre à jour le Pokémon à l'index donné
        localStorage.setItem("team", JSON.stringify(teams));
        console.log(`Pokémon à l'index ${index} mis à jour :`, pokemon);
    } else {
        console.error("Index invalide :", index);
    }
}
 
}
