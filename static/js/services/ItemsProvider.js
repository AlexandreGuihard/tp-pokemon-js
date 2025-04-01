import { ENDPOINT3 } from "../config.js";

export default class ItemsProvider {

    static fetchItems = async () => {
        try {
            const rep = await fetch(ENDPOINT3);
            if (!rep.ok) throw new Error('Erreur fetchItems');
            const data = await rep.json();
            return data;
        } catch (error) {
            console.error('Erreur fetchItems', error);
            throw error;
        }
    }

    static fetchItemById = async (id) => {
        try {
            const rep = await fetch(`${ENDPOINT3}/${id}`)
            if(!rep.ok) throw new Error("Erreur fetchItemById")
            const data = await rep.json()
            return data
        } catch (error) {
            console.error('Erreur fetchItemById', error);
            throw error;
        }
    }

    static fetchItemsGroupedByType = async () => {
        try {
            const rep = await fetch(ENDPOINT3);
            if (!rep.ok) throw new Error("Erreur fetchItemsGroupedByType");
                const jsonData = await rep.json();
                const groupedItems = jsonData.reduce((acc, item) => {
                    const { type } = item;
                    if (!acc[type]) {
                        acc[type] = [];
                    }
                    acc[type].push(item);
                    return acc;
                }, {});
                return groupedItems;
        } catch (error) {
            console.error("Erreur fetchItemsGroupedByType", error);
            throw error;
        }
    }
}