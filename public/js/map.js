//bootstrap loader configured with our API key

((g) => {
  var h,
    a,
    k,
    p = "The Google Maps JavaScript API",
    c = "google",
    l = "importLibrary",
    q = "__ib__",
    m = document,
    b = window;
  b = b[c] || (b[c] = {});
  var d = b.maps || (b.maps = {}),
    r = new Set(),
    e = new URLSearchParams(),
    u = () =>
      h ||
      (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g)
          e.set(
            k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
            g[k]
          );
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => (h = n(Error(p + " could not load.")));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a);
      }));
  d[l]
    ? console.warn(p + " only loads once. Ignoring:", g)
    : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
  key: mapToken,
  v: "weekly",
  // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
  // Add other bootstrap parameters as needed, using camel case.
});

// a function to load the maps library and initialize the map.

let map;

async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { Marker } = await google.maps.importLibrary("marker");

  const mapCenter = {
    lat: coordinates[1], // Convert GeoJSON to Google format
    lng: coordinates[0],
  };

  map = new Map(document.getElementById("map"), {
    center: mapCenter,
    zoom: 12,
    styles: snazzyMapStyle,
  });

  const marker = new Marker({
    position: mapCenter,
    map: map,
    title: "Listing Location",
  });

  const popup = new InfoWindow({
    content: `<p>Exact location provided after booking</p>`,
  });

  // Show popup on marker click
  marker.addListener("click", () => {
    popup.open(map, marker);
  });
}

initMap();
