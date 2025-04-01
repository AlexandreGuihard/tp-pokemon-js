import Home from "./views/Home.js";
import Personnages from "./views/Personnages.js";
import Favorites from "./views/Favorites.js";
import Error404 from "./views/Error404.js";
import Utils from "./services/utils.js";
import TeamView from "./views/TeamView.js";
import ItemsView from "./views/Items.js";
import ItemsTypeView from "./views/ItemsTypeView.js";
import PokemonDetails from "./views/PokemonDetails.js";

const routes = {
  "/": Home,
  "/personnages": Personnages,
  "/personnages/:id": PokemonDetails,
  "/favorites": Favorites,
  "/teams": TeamView,
  "/teams/:id/:index": PokemonDetails,
  "/items": ItemsView,
  "/items/:type": ItemsTypeView,         
  "/error": Error404,
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


  console.log("Parsed URL:", parsedURL);
  let page = routes[parsedURL];
 
  page = page ? new page() : new Error404();

  content.innerHTML = await page.render();
  if (typeof page.afterRender === "function") {
    await page.afterRender();
  }
};

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

