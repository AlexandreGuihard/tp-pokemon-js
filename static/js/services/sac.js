export default class Sac {
    static fetchObjets() {
        return localStorage.getItem('sac') ? JSON.parse(localStorage.getItem('sac')) : [];
    }

    static sauvegarderObjets(objets) {
        localStorage.setItem('sac', JSON.stringify(objets));
    }

    static addObjet(id, type, nom, quantite = 1) {
        let objets = Sac.fetchObjets();
        let objetExistant = objets.find(objet => objet.id === id);
        if (objetExistant) {
            objetExistant.quantite += quantite;
        } else {
            let typeDecode = decodeURIComponent(type);

            let typeD = typeDecode.charAt(0).toUpperCase() + typeDecode.slice(1).toLowerCase();
            if(typeD === "Key items"){
                typeD = "Key Items";
            }    
            objets.push({ id, typeD, nom, quantite });
        }
        alert(`${nom} ajouté au sac. quantité: ${quantite}`);
        Sac.sauvegarderObjets(objets);
    }

    static removeObjet(id, quantite = 1) {
        let objets = Sac.fetchObjets();
        let objetExistant = objets.find(objet => objet.id === id);
        if (objetExistant) {
            if (objetExistant.quantite >= quantite) {
                objetExistant.quantite -= quantite;
                if (objetExistant.quantite === 0) {
                    objets = objets.filter(objet => objet.id !== id);
                }
                Sac.sauvegarderObjets(objets);
            } 
        }
    }
    

    static viderSac(id) {
        let objets = Sac.fetchObjets();
        objets = objets.filter(objet => objet.id !== id);
        Sac.sauvegarderObjets(objets);
    }
}