const Utils = {
  parseRequestURL: () => {
    let url = location.hash.slice(1).toLowerCase() || "/";
    let r = url.split("/");

    let request = {
      resource: r[1] || null, // Extrait la ressource (par exemple, "items")
      type: r[2] || null,     // Extrait le type (par exemple, "healing")
      id: r[3] || null,       // Extrait l'id (par exemple, "50")
      index: r[4] ? parseInt(r[4], 10) : null, // Extrait l'index si présent
      verb: r[5] || null      // Extrait un éventuel verbe (par exemple, "edit")
    };

    return request;
  },

  sleep: (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  replaceURL: (url) => {
    document.location.replace(url);
  }
};

export default Utils;