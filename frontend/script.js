const API_BASE_URL = "http://localhost:3000/zitate";

// Seite lädt → Zitatliste und erstes Zitat anzeigen
window.onload = async () => {
    await updateZitatListe();
    await zeigeZitat();
};
// Autorwechsel → Liste und Zitat aktualisieren
document.getElementById("autor").addEventListener("change", async () => {
    await updateZitatListe();
    await zeigeZitat();
});
// Enter-Taste zum Hinzufügen
document.getElementById("neuesZitat").addEventListener("keypress", async function(event) {
    if (event.key === "Enter") {
        await zitatHinzufuegen();
        await zeigeZitat();
    }
});

async function ladeZitateVomServer(autor) {
  const response = await fetch(`${API_BASE_URL}?autor=${encodeURIComponent(autor)}`);
  return await response.json();
}

async function neuesZitatZumServerHinzufuegen(autor, zitat) {
  await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ autor, zitat })
  });
}

async function zitatLoeschenVomServer(id) {
  await fetch(`${API_BASE_URL}?id=${id}`, { method: 'DELETE' });
}

async function zeigeZitat() {
  const autor = document.getElementById('autor').value;
  const zitate = await ladeZitateVomServer(autor);
  if (zitate.length === 0) {
    document.getElementById("zitatText").innerText = "Keine Zitate vorhanden.";
    return;
  }
  const zufallsIndex = Math.floor(Math.random() * zitate.length);
  document.getElementById("zitatText").innerText = zitate[zufallsIndex].zitat;
}

async function zitatHinzufuegen() {
  const autor = document.getElementById("autor").value;
  const neuesZitat = document.getElementById("neuesZitat").value.trim();
  if (!neuesZitat) return;

  await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ autor, zitat: neuesZitat })
  });

  document.getElementById("neuesZitat").value = "";
  await updateZitatListe();
}

async function loescheZitat(id) {
  await zitatLoeschenVomServer(id);
  await updateZitatListe();
}

async function updateZitatListe() {
  const autor = document.getElementById("autor").value;
  const liste = document.getElementById("zitatListe");
  liste.innerHTML = "";

  const zitate = await ladeZitateVomServer(autor);
  zitate.forEach(e => {
    let item = document.createElement("div");
    item.className = "quote-item";

    let html = `<span>${e.zitat}</span>`;
    if (e.id !== undefined) {
      html += ` <button onclick="loescheZitat(${e.id})">Löschen</button>`;
    }

    item.innerHTML = html;
    liste.appendChild(item);
  });
}