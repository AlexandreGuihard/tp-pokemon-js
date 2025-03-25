import Home from "./views/Home.js";
import Personnages from "./views/Personnages.js";
import PersonnageDetail from "./views/PersonnageDetail.js";
import Favorites from "./views/Favorites.js";
import Error404 from "./views/Error404.js";
import Utils from "./services/utils.js";
import TeamView from "./views/TeamView.js";
import TeamViewDetail from "./views/TeamViewDetail.js";
import ItemsView from "./views/Items.js";
import ItemsTypeView from "./views/ItemsTypeView.js";
import ItemDetailView from "./views/ItemDetailView.js";


const routes = {
  "/": Home,
  "/personnages": Personnages,
  "/personnages/:id": PersonnageDetail,
  "/favorites": Favorites,
  "/teams": TeamView,
  "/teams/:id/:index": TeamViewDetail,
  "/items" : ItemsView,
  "/items/:type": ItemsTypeView, // Route pour les items par type
  "/items/:type/:id": ItemDetailView,      // Route pour un item spécifique
};

const router = async () => {
  console.log("router");
  const content = null || document.querySelector("#content");
  let request = Utils.parseRequestURL();
 let parsedURL =
  (request.resource ? "/" + request.resource : "/") +
  (request.type ? "/:type" : "") +
  (request.id ? "/:id" : "") +
  (request.resource === "teams" && request.index !== null ? "/:index" : "") +
  (request.verb ? "/" + request.verb : "");

  let page = routes[parsedURL];
  if (!page) {
    console.error(`Route non trouvée : ${parsedURL}`);
    page = Error404;
  } else {
    page = new page();
  }

  content.innerHTML = await page.render();
  if (typeof page.afterRender === "function") {
    await page.afterRender();
  }
};

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

