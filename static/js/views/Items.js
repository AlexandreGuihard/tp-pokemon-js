import ItemsProvider from "../services/ItemsProvider.js";

export default class ItemsView {
    async render() {
       
        let groupedItems = await ItemsProvider.fetchItemsGroupedByType();
        console.log(groupedItems);

        let view = `
            <section class="section">
                <h1>Items</h1>
                ${Object.keys(groupedItems).map((type) => {
                    return `
                    <section>
                        <h2>${type}</h2>
                        <a href="#/items/${type}">
                            <button>Voir tous les items de type ${type}</button>
                        </a>
                    </section>
                    `;
                }).join('')}
            </section>
        `;
        return view;
    }
}