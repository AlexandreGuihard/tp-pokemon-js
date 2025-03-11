import Home from './views/Home.js';
import Personnages from './views/Personnages.js';
import PersonnageDetail from './views/PersonnageDetail.js';
import Favorites from './views/Favorites.js';
import Error404 from './views/Error404.js';
import Utils from './services/utils.js';



const routes = {
    '/' : Home,
    "/personnages" : Personnages,
    //"/personnages/:id" : PersonnageDetail
    "/favorites" : Favorites
}

const router = async () => {
    console.log("router")
    const content = null || document.querySelector('#content');
    let request = Utils.parseRequestURL()
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')
    let page = routes[parsedURL] ? new routes[parsedURL] : Error404
    content.innerHTML = await page.render();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);