import ItemsProvider from "../services/ItemsProvider.js";
import Utils from "../services/utils.js";
export default class ItemsTypeView {
    async render() {
        let request = Utils.parseRequestURL(); // Récupère les paramètres de l'URL
        let type = decodeURIComponent(request.type); // Décoder le type depuis l'URL

        // Normaliser la casse pour correspondre aux clés de groupedItems
        type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        if(type === "Key items"){
            type = "Key Items";
        }

        let groupedItems = await ItemsProvider.fetchItemsGroupedByType(); // Récupère les items regroupés par type
        let filteredItems = groupedItems[type] || []; // Récupère les items du type demandé

        console.log(filteredItems);
        console.log(groupedItems);

        if (filteredItems.length === 0) {
            return `
                <section class="section">
                    <h1>Type introuvable</h1>
                    <p>Aucun item trouvé pour le type "${type}".</p>
                </section>
            `;
        }

        return `
            <h1>${type}</h1>
            <section class="section">
                <ul class="items-list">
                    ${filteredItems.map((item) => {
                        return `
                        <li>
                            <a href="#/items/${type}/${item.id}">
                                <img src="/img/items/sprites/${item.id}.png" alt="Image de ${item.name.english}">
                                <h3>${item.name.english}</h3>
                            </a>
                        </li>
                        `;
                    }).join("")}
                </ul>
            </section>
        `;
    }
}