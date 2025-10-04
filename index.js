document.getElementById("input").focus();
let data = [];

fetch("data.json").then(response => response.json()).then(json => data = json);
function toVers(ref) {
  ref = ref.trim().replace(/\s+/g, " ");
  const match = ref.match(/^(\d\.?\s*)?(\p{L}+)\s*(\d+)?[,.:;]?\s*(\d+)?$/u);
  if(!match) throw ref;
  let [_, prefix, book, chapter, verse] = match;
  prefix = prefix ? prefix.replace(/\D/g, "") : "";
  book = (prefix ? prefix + " " : "") + book;
  return [book,chapter!==undefined?parseInt(chapter):undefined,verse!==undefined?parseInt(verse):undefined];
}
function updateTable(rows){
  document.getElementById("table").innerHTML = `
    <tr>
        <th>Start</th>
        <th>Ende</th>
        <th>Buch</th>
        <th>Seite</th>
        <th>Kreis</th>
        <th>Datum</th>
    </tr>
    ${rows.join("")}
    `;
}
function zeileHinzufuegen(neueEntry,rows){
      const row = `
        <tr>
            <td>${neueEntry.start}</td>
            <td>${neueEntry.ende}</td>
            <td>${neueEntry.buch}</td>
            <td>${neueEntry.seite}</td>
            <td>${neueEntry.kreis}</td>
            <td>${new Date(neueEntry.datum).toLocaleDateString()}</td>
        </tr>
        `;
        rows.push(row);
    }
function update() {
    const input = document.getElementById("input").value;
    if(input===""){
      let rows = [];
      data.forEach(entry =>  zeileHinzufuegen(entry,rows))
      updateTable(rows)
      return
    }
    let verse = toVers(input)
    if(verse===null)return
    const [buch, kapitel, vers] = verse
    let rows = [];
    
    data.forEach(entry => {
        const [startBuch, startKapitel, startVers] = toVers(entry.start);
        const [endeBuch, endeKapitel, endeVers] = toVers(entry.ende);
        if(buch !== startBuch) return;
        if(kapitel !== undefined||!isNaN(kapitel)){
            if(kapitel<startKapitel || kapitel>endeKapitel) return;
            if(vers !== undefined||!isNaN(vers)){
                console.log(vers,startVers,endeVers);
                if(kapitel===startKapitel&&vers<startVers)return;
                if(kapitel===endeKapitel&&vers>endeVers)return;
            }
        }
        zeileHinzufuegen(entry,rows)
    });
    updateTable(rows)
}



