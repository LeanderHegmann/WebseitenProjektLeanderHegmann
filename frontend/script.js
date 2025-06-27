if (typeof API_BASE_URL === 'undefined') {
  const API_BASE_URL = `${window.location.origin}/zitate`;
}

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
  await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
}

async function zeigeZitat() {
  const autor = document.getElementById('autor').value;
  if (!autor) {
    document.getElementById("zitatText").innerText = "Kein Autor ausgewählt.";
    return;
  }

  try {
    const alleZitate = await ladeZitateVomServer(autor);
    const gefilterteZitate = alleZitate.filter(z => z.autor === autor);

    if (gefilterteZitate.length === 0) {
      document.getElementById("zitatText").innerText = "Kein Zitat gefunden.";
      return;
    }

    const zufall = Math.floor(Math.random() * gefilterteZitate.length);
    const zitatObj = gefilterteZitate[zufall];
    document.getElementById("zitatText").innerText = zitatObj.zitat;
  } catch (error) {
    console.error("Fehler beim Abrufen des Zitats:", error);
    document.getElementById("zitatText").innerText = "Fehler beim Laden des Zitats.";
  }
}

async function zitatHinzufuegen() {
  const autor = document.getElementById("autor").value;
  const neuesZitat = document.getElementById("neuesZitat").value.trim();
  if (!neuesZitat) return;
  try {
    await neuesZitatZumServerHinzufuegen(autor, neuesZitat);
  } catch (error) {
    console.error("Fehler beim Hinzufügen:", error);
  }
  document.getElementById("neuesZitat").value = "";
  await updateZitatListe();
}

async function loescheZitat(id) {
  if (!id) return;
  try {
    await zitatLoeschenVomServer(id);
    await updateZitatListe();
    await zeigeZitat();
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
  }
}

async function updateZitatListe() {
  const autor = document.getElementById("autor").value;
  const liste = document.getElementById("zitatListe");
  liste.innerHTML = "";

  if (!autor) {
    return;
  }

  const zitate = await ladeZitateVomServer(autor);
  const gefiltert = zitate.filter(z => z.autor === autor);

  gefiltert.forEach(e => {
    let item = document.createElement("div");
    item.className = "quote-item";

    let html = `<span>${e.zitat}</span>`;
    if (e.id !== undefined && e.id !== null) {
      html += ` <button data-id="${e.id}" class="loesch-button">Löschen</button>`;
    }

    item.innerHTML = html;
    liste.appendChild(item);
  });

  document.querySelectorAll(".loesch-button").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      await loescheZitat(id);
      await zeigeZitat();
    });
  });
}

window.zitatHinzufuegen = zitatHinzufuegen;
window.zeigeZitatVomServer = zeigeZitat;