// API_KEY para la RESTful API APOD de la NASA (Astronomy Picture of the Day)
const API_KEY = "HIU23riVdjnjeNGnlQBKeysma7cR1wmoceBui03G";

// Variables para la selección de elementos del DOM
const dateInput = document.getElementById("dateInput");
const apodCard = document.getElementById("apodCard");
const bgContainer = document.getElementById("bgContainer");
const loader = document.getElementById("loader");
const minimizeBtn = document.getElementById("minimizeBtn");
const restoreBtn = document.getElementById("restoreBtn");
const titleEl = document.getElementById("imageTitle");
const dateEl = document.getElementById("imageDate");
const descEl = document.getElementById("imageDescription");
const copyEl = document.getElementById("imageCopyright");

// Función para hacer fetch de la API
async function fetchApod(date = "") {
    const dateParam = date ? `&date=${date}` : "";
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}${dateParam}`;

    loader.style.display = "block";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        updateDisplay(data);
    } catch (err) {
        alert("Could not fetch space data.");
    } finally {
        loader.style.display = "none";
    }
}

// Actualizar el DOM con la imagen y el texto que extraemos de la API
function updateDisplay(data) {
    bgContainer.innerHTML = "";

    if (data.media_type === "image") {
        const img = document.createElement("img");
        img.src = data.hdurl || data.url;

        img.alt = `NASA Astronomy Picture of the Day: ${data.title}`;
        img.title = data.title;

        bgContainer.appendChild(img);
    } else {
        const iframe = document.createElement("iframe");
        iframe.src = data.url + "&autoplay=1&mute=1&loop=1";

        iframe.title = `NASA Astronomy Video of the Day: ${data.title}`;

        bgContainer.appendChild(iframe);
    }

    titleEl.textContent = data.title;
    dateEl.textContent = new Date(data.date).toLocaleDateString("en-GB");
    descEl.textContent = data.explanation;
    copyEl.textContent = data.copyright
        ? `© ${data.copyright}`
        : "Public Domain";

    apodCard.style.display = "flex";
    restoreBtn.style.display = "none";
}

// Event Listeners para minimizar o maximizar la card
minimizeBtn.addEventListener("click", () => {
    apodCard.style.display = "none";
    restoreBtn.style.display = "block";
});

restoreBtn.addEventListener("click", () => {
    restoreBtn.style.display = "none";
    apodCard.style.display = "flex";
});

// Event Listener para extraer la selección de la fecha y mandárselo a la función de hacer fetch
dateInput.addEventListener("change", (e) => {
    if (e.target.value) fetchApod(e.target.value);
});

// Event Listener para extraer la fecha del usuario que la visita
window.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0];
    dateInput.max = today;
    dateInput.value = today;
    fetchApod(today);
});

// Event Listener para adjuntar el Service Worker (sw.js), para la PWA
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("sw.js")
            .then((reg) => console.log("Service Worker Registered!"))
            .catch((err) => console.log("Registration Failed", err));
    });
}
