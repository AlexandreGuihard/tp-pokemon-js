

export default class Home {
    
    async render () {
        let view = `
            <section class="section">
                <h1>Bienvenue sur notre page</h1>
                <p>Retrouvez ici tous les personnages de Pokemon, leurs techniques.</p>
            </section>

            <div class="search-bar">
      <input type="text" id="search-input" placeholder="Rechercher un pokemon" oninput="search()">
      </div>
            `;
        return view
    }
}