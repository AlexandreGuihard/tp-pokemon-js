
export class PokemonFavoris {

    static fetchFavoris() {
        return localStorage.getItem('favoris') ? JSON.parse(localStorage.getItem('favoris')) : [];
    }
    
    static addFavoris(pokemon) {
        let favorites = PokemonFavoris.fetchFavoris();
        for(let i = 0; i < favorites.length; i++) {
            if (favorites[i].id === pokemon.id) {
                alert("Ce pokemon est déjà dans les favoris");
                return;
            }
        }
        alert("Ce pokemon a été ajouté dans les favoris");
        favorites.push(pokemon);
        localStorage.setItem('favoris', JSON.stringify(favorites));
    }

    static removeFavoris(pokemon){
        let favorites = PokemonFavoris.fetchFavoris();
        for (let i = 0; i < favorites.length; i++) {
            if (favorites[i].id === pokemon.id) {
                favorites.splice(i, 1);
            }
        }
        return localStorage.setItem('favoris', JSON.stringify(favorites));
    }

    static isFavorite(id){

        let favorites = PokemonFavoris.fetchFavoris();
        for (let i = 0; i < favorites.length; i++) {
            if (favorites[i].id === id) {
                return true;
            }
        }
        return false;
    }

    static updateFavoris(pokemon, id){

        let favorites = PokemonFavoris.fetchFavoris();
        for (let i = 0; i < favorites.length; i++) {
            if (favorites[i].id === id) {
                favorites[i] = pokemon;
            }
        }
        localStorage.setItem('favoris', JSON.stringify(favorites));
    }
}
