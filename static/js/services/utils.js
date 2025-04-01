const Utils = {
  parseRequestURL: () => {
    let url = location.hash.slice(1).toLowerCase() || "/";
    let r = url.split("/");
    console.log("[Router] Parsed URL:", r);

    let request = {
      resource: r[1] || null, 
      type: r[1] === "items" ? r[2] || null : null, 
      id: r[1] === "personnages" || r[1] === "teams" ? r[2] || null : null,
      index: r[3] ? parseInt(r[3], 10) : null, 
      verb: r[4] || null 
    };

    return request;
  },

  sleep: (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};

export default Utils;