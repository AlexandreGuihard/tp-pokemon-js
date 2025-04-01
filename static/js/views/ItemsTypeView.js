import ItemsProvider from "../services/ItemsProvider.js";
import Sac from "../services/sac.js";
import Utils from "../services/utils.js";

export default class ItemsTypeView {
    async render() {
        let request = Utils.parseRequestURL(); 
        console.log("Request"+request); 
        console.log("Request object in ItemsTypeView:", request.type); 
        let type = decodeURIComponent(request.type);

        type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        if(type === "Key items"){
            type = "Key Items";
        }

        let groupedItems = await ItemsProvider.fetchItemsGroupedByType(); 
        let filteredItems = groupedItems[type] || [];

        if (filteredItems.length === 0) {
            return `
                <section class="section">
                    <h1>Type introuvable</h1>
                    <p>Aucun item trouvé pour le type "${type}".</p>
                </section>
            `;
        }

        return `
        <div class="section-container">
          <section class="section items-list-section">
            <h1>${type}</h1>
            <ul class="items-list">
              ${filteredItems.map((item) => {
                return `
                <li class="item-card">
                  <a href="#/items/${encodeURIComponent(type)}/${item.id}">
                    <img src="/img/items/sprites/${item.id}.png" alt="Image de ${item.name.english}">
                    <h3>${item.name.english ? item.name.english : item.name}</h3>
                  </a>
                </li>
                `;
              }).join("")}
            </ul>
          </section>
      
          <section class="section2 item-detail-section">
            <h2>Détails de l'item</h2>
            <div id="item-detail-content">
              <p>Sélectionnez un item pour voir les détails.</p>
            </div>
          </section>
        </div>
      `;
    }

    async afterRender() {
        let request = Utils.parseRequestURL(); 
        let id = request.index; 
        if (!id) {
            return;
        }
        let serviceItem = await ItemsProvider.fetchItemById(id); 
        let itemDetailContent = document.getElementById("item-detail-content");
        console.log("serviceItem", serviceItem);
        let itemDetail = `
            <h3>${serviceItem.name.english ? serviceItem.name.english : serviceItem.name}</h3>
            <img src="/img/items/sprites/${serviceItem.id}.png" alt="Image de ${serviceItem.name.english}">
            <p>${serviceItem.description || "Aucune description disponible."}</p>
            <button id="addToTeam" class="add-to-team-button">Ajouter dans le sac</button>
            <input type="number" id="quantity" min="1" value="1" class="quantity-input" placeholder="Quantité" />
        `;
        itemDetailContent.innerHTML = itemDetail; 
        let addToTeamButton = document.getElementById("addToTeam");
        if (addToTeamButton) {
            addToTeamButton.addEventListener("click", async () => {
                let quantityInput = document.getElementById("quantity").value;
                if (isNaN(quantityInput) || quantityInput <= 0 ) {
                    alert("Veuillez entrer une quantité valide.");
                    return;
                }
                let nomObjet = serviceItem.name.english ? serviceItem.name.english : serviceItem.name;
                Sac.addObjet(serviceItem.id, serviceItem.type, nomObjet, parseInt(quantityInput));
            });
        }
    }
}

