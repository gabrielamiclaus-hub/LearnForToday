// Întrebările quizului: textul, cele 3 variante (Var 0, 1, 2) și indexul variantei corecte
const intrebari = [
    { text: 'Ce articol are substantivul „Haus”?',    variante: ['der', 'die', 'das'], corect: 2 },
    { text: 'Ce articol are substantivul „Mann”?',    variante: ['der', 'die', 'das'], corect: 0 },
    { text: 'Ce articol are substantivul „Mutter”?',  variante: ['der', 'die', 'das'], corect: 1 },
    { text: 'Ce articol are substantivul „Mädchen”?', variante: ['der', 'die', 'das'], corect: 2 },
    { text: 'Ce articol are substantivul „Frau”?',    variante: ['der', 'die', 'das'], corect: 1 },
    { text: 'Ce articol are substantivul „Vater”?',   variante: ['der', 'die', 'das'], corect: 0 }
];

const PUNCTE_CORECT = 10;
const PAUZA_MS = 1200;

// Elemente din pagină
const paginaStart = document.getElementById('pagina-start');
const quiz = document.getElementById('quiz');
const rezultat = document.getElementById('rezultat');
const elIntrebare = document.getElementById('intrebare');
const elVariante = document.getElementById('variante');
const elFeedback = document.getElementById('feedback');
const elScor = document.getElementById('scor');
const elProgres = document.getElementById('progres');

// Starea jocului
let coada = [];       // întrebările rămase (cele greșite se mută la final)
let scor = 0;
let rezolvate = 0;

function porneste() {
    coada = intrebari.map(q => ({ ...q, greseala: false }));
    scor = 0;
    rezolvate = 0;
    elScor.textContent = scor;
    paginaStart.hidden = true;
    rezultat.hidden = true;
    quiz.hidden = false;
    afiseazaIntrebare();
}

function afiseazaIntrebare() {
    const q = coada[0];
    elIntrebare.textContent = q.text;
    elFeedback.textContent = '';
    elFeedback.className = 'feedback';
    elVariante.innerHTML = '';

    q.variante.forEach((varianta, index) => {
        const buton = document.createElement('button');
        buton.className = 'option';
        buton.textContent = varianta;
        buton.addEventListener('click', () => raspunde(index, buton));
        elVariante.appendChild(buton);
    });

    const procent = Math.round(rezolvate / intrebari.length * 100);
    elProgres.style.width = procent + '%';
    elProgres.parentElement.setAttribute('aria-valuenow', procent);
}

function raspunde(index, buton) {
    const q = coada[0];
    const butoane = elVariante.querySelectorAll('button');
    butoane.forEach(b => b.disabled = true);   // un singur răspuns per întrebare

    if (index === q.corect) {
        if (!q.greseala) {
            scor += PUNCTE_CORECT;             // puncte doar dacă n-ai greșit-o înainte
        }
        rezolvate++;
        coada.shift();
        elScor.textContent = scor;
        buton.classList.add('option--ok');
        elFeedback.textContent = 'Correct!';
        elFeedback.className = 'feedback feedback--ok';
    } else {
        q.greseala = true;                     // la reluare nu mai aduce puncte
        coada.push(coada.shift());             // întrebarea se reia la final
        buton.classList.add('option--err');
        elFeedback.textContent = 'Greșit!';
        elFeedback.className = 'feedback feedback--err';
    }

    setTimeout(() => {
        if (coada.length > 0) {
            afiseazaIntrebare();
        } else {
            termina();
        }
    }, PAUZA_MS);
}

function termina() {
    elProgres.style.width = '100%';
    quiz.hidden = true;
    rezultat.hidden = false;
    document.getElementById('scor-final').textContent =
        'Scor final: ' + scor + ' din ' + intrebari.length * PUNCTE_CORECT + ' puncte.';
}

document.getElementById('start').addEventListener('click', porneste);
document.getElementById('restart').addEventListener('click', porneste);
