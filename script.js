
let zitate = {
Goethe: [
"Was immer du tun kannst oder träumst zu können, beginne es!",
"Man reist ja nicht, um anzukommen, sondern um zu reisen.",
"Es hört doch jeder nur, was er versteht.",
"Das Leben gehört dem Lebendigen an, und wer lebt, muss auf Wechsel gefasst sein.",
"Der Worte sind genug gewechselt, nun lasst mich auch Taten sehen.",
"Die beste Bildung findet ein gescheiter Mensch auf Reisen.",
"Man muss das Unmögliche versuchen, um das Mögliche zu erreichen.",
"Gegenüber der Fähigkeit, die Arbeit eines einzigen Tages sinnvoll zu ordnen, ist alles andere ein Kinderspiel.",
"Die Kunst ist eine Vermittlerin des Unaussprechlichen.",
"Der Mensch ist dazu geboren, Großes zu leisten, wenn er sich selbst überwindet.",
"Was man nicht versteht, besitzt man nicht."
],
Schiller: [
"Die Freiheit ist das höchste Gut.",
"Der Mensch ist frei geschaffen, ist frei, und würd er in Ketten geboren.",
"Die Großen hören auf zu herrschen, wenn die Kleinen aufhören zu kriechen.",
"Wer nichts waget, der darf nichts hoffen.",
"Gegen die Dummheit kämpfen Götter selbst vergebens.",
"Es ist der Geist, der sich den Körper baut.",
"Die Stunde drängt, die Zeit flieht.",
"Der Mut wächst mit der Gefahr.",
"Die Weltgeschichte ist das Weltgericht.",
"Das Gesetz ist der Freund des Schwachen.",
"Ein starker Wille durchbricht jedes Schicksal."
],
Nietzsche: [
"Ohne Musik wäre das Leben ein Irrtum.",
"Was mich nicht umbringt, macht mich stärker.",
"Wer ein Warum zum Leben hat, erträgt fast jedes Wie.",
"Man muss noch Chaos in sich haben, um einen tanzenden Stern gebären zu können.",
"Die größten Ereignisse — das sind nicht unsere lautesten, sondern unsere stillsten Stunden.",
"Die Hoffnung ist der Regenbogen über dem herabstürzenden Bach des Lebens.",
"Alle Wahrheit ist einfach – ist das nicht doppelte Lüge?",
"Der Mensch ist etwas, das überwunden werden soll.",
"Man soll nicht mit Ungeheuern kämpfen, denn dabei wird man selbst zum Ungeheuer.",
"Glaube heißt, nicht wissen wollen, was wahr ist."
]
};
    
;

// Seite lädt → Zitatliste anzeigen
window.onload = () => {
    updateZitatListe();
};
// Autorwechsel → Liste und Zitat zurücksetzen
document.getElementById("autor").addEventListener("change", () => {
    updateZitatListe();
    document.getElementById("zitatText").innerText = "Hier erscheint dein Zitat...";
});

// Enter-Taste zum Hinzufügen
document.getElementById("neuesZitat").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        zitatHinzufuegen();
    }
});
//unsere Anzeige (funktionsbezogen)
function zeigeZitat() {
    let autor = document.getElementById("autor").value;
    let zitateDesAutors = zitate[autor];

    if (zitateDesAutors.length === 0) {
        document.getElementById("zitatText").innerText = "Keine Zitate vorhanden.";
        return;
    }

    let zufallsIndex = Math.floor(Math.random() * zitateDesAutors.length);
    document.getElementById("zitatText").innerText = zitateDesAutors[zufallsIndex];
}

function zitatHinzufuegen() {
    let autor = document.getElementById("autor").value;
    let neuesZitat = document.getElementById("neuesZitat").value.trim();
    if (neuesZitat) {
        zitate[autor].push(neuesZitat);
        document.getElementById("neuesZitat").value = "";
        updateZitatListe();
    }
}

function loescheZitat(autor, index) {
    zitate[autor].splice(index, 1);
    updateZitatListe();
}

function updateZitatListe() {
    let autor = document.getElementById("autor").value;
    let liste = document.getElementById("zitatListe");
    liste.innerHTML = "";

    zitate[autor].forEach((zitat, index) => {
        let item = document.createElement("div");
        item.className = "quote-item";
        item.innerHTML = `
            <span>${zitat}</span>
            <button onclick="loescheZitat('${autor}', ${index})">Löschen</button>
        `;
        liste.appendChild(item);
    });
}
