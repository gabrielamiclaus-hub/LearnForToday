// Întrebările quizului: textul, variantele și indexul variantei corecte
const intrebari = [
    { text: 'Ce articol are substantivul „Haus”?', variante: ['der', 'die', 'das'], corect: 2 },
    { text: 'Ce articol are substantivul „Mann”?', variante: ['der', 'die', 'das'], corect: 0 },
    { text: 'Ce articol are substantivul „Mutter”?', variante: ['der', 'die', 'das'], corect: 1 },
    { text: 'Ce articol are substantivul „Mädchen”?', variante: ['der', 'die', 'das'], corect: 2 },
    { text: 'Ce articol are substantivul „Frau”?', variante: ['der', 'die', 'das'], corect: 1 },
    { text: 'Ce articol are substantivul „Vater”?', variante: ['der', 'die', 'das'], corect: 0 },
    { text: 'Care este articolul substantivului „Ball”?', variante: ['der', 'die', 'das'], corect: 0 },
    { text: 'Care este articolul substantivului „Frühling”?', variante: ['der', 'die', 'das'], corect: 0 },
    { text: 'Care este articolul substantivului „Stuhl”?', variante: ['der', 'die', 'das'], corect: 0 },
    { text: 'Care este articolul substantivului „Fenster”?', variante: ['der', 'die', 'das'], corect: 2 }
];

const PUNCTE_CORECT = 10;
const TIMP_INTREBARE = 15;

// Elemente din pagină
const paginaStart = document.getElementById('pagina-start');
const quiz = document.getElementById('quiz');
const rezultat = document.getElementById('rezultat');
const elIntrebare = document.getElementById('intrebare');
const elVariante = document.getElementById('variante');
const elFeedback = document.getElementById('feedback');
const elScor = document.getElementById('scor');
const elProgres = document.getElementById('progres');
const elCronometru = document.getElementById('cronometru');
const elNumarIntrebare = document.getElementById('numar-intrebare');
const butonUrmator = document.getElementById('urmator');

// Starea jocului
let indexIntrebare = 0;
let scor = 0;
let timpRamas = TIMP_INTREBARE;
let intervalCronometru = null;
let raspunsDat = false;

function opresteCronometrul() {
    if (intervalCronometru !== null) {
        clearInterval(intervalCronometru);
        intervalCronometru = null;
    }
}

function porneste() {
    opresteCronometrul();

    indexIntrebare = 0;
    scor = 0;

    elScor.textContent = scor;

    paginaStart.hidden = true;
    rezultat.hidden = true;
    quiz.hidden = false;

    afiseazaIntrebare();
}

function afiseazaIntrebare() {
    opresteCronometrul();

    const q = intrebari[indexIntrebare];

    raspunsDat = false;
    timpRamas = TIMP_INTREBARE;

    elIntrebare.textContent = q.text;
    elFeedback.textContent = '';
    elFeedback.className = 'feedback';
    elVariante.innerHTML = '';

    butonUrmator.hidden = true;

    butonUrmator.textContent =
        indexIntrebare === intrebari.length - 1
        ? 'Vezi rezultatul'
        : 'Următoarea întrebare';

    elNumarIntrebare.textContent =
        `Întrebarea ${indexIntrebare + 1} din ${intrebari.length}`;

    actualizeazaCronometrul();

    // Crearea variantelor de răspuns
    q.variante.forEach((varianta, index) => {
        const buton = document.createElement('button');

        buton.className = 'option';
        buton.textContent = varianta;

        buton.addEventListener('click', () => {
            raspunde(index, buton);
        });

        elVariante.appendChild(buton);
    });

    // Actualizarea progresului
    const procent = Math.round(
        indexIntrebare / intrebari.length * 100
    );

    elProgres.style.width = procent + '%';

    elProgres.parentElement.setAttribute(
        'aria-valuenow',
        procent
    );

    // Pornirea cronometrului
    intervalCronometru = setInterval(() => {
        timpRamas--;

        actualizeazaCronometrul();

        if (timpRamas <= 0) {
            expiraTimpul();
        }
    }, 1000);
}

function actualizeazaCronometrul() {
    elCronometru.textContent = timpRamas;

    elCronometru.classList.toggle(
        'timer__value--warning',
        timpRamas <= 5
    );
}

function blocheazaRaspunsurile() {
    elVariante.querySelectorAll('button').forEach(b => {
        b.disabled = true;
    });

    opresteCronometrul();

    raspunsDat = true;

    butonUrmator.hidden = false;
}

function raspunde(index, buton) {
    if (raspunsDat) return;

    const q = intrebari[indexIntrebare];

    blocheazaRaspunsurile();

    if (index === q.corect) {
        scor += PUNCTE_CORECT;

        elScor.textContent = scor;

        buton.classList.add('option--ok');

        elFeedback.textContent = 'Corect! +10 puncte';

        elFeedback.className =
            'feedback feedback--ok';

    } else {
        buton.classList.add('option--err');

        elVariante.querySelectorAll('button')[q.corect]
            .classList.add('option--ok');

        elFeedback.textContent = 'Greșit!';

        elFeedback.className =
            'feedback feedback--err';
    }
}

function expiraTimpul() {
    if (raspunsDat) return;

    const q = intrebari[indexIntrebare];

    blocheazaRaspunsurile();

    // Evidențierea răspunsului corect
    elVariante.querySelectorAll('button')[q.corect]
        .classList.add('option--ok');

    elFeedback.textContent =
        'Timp expirat! Răspuns considerat greșit.';

    elFeedback.className =
        'feedback feedback--err';
}

function urmatoareaIntrebare() {
    if (!raspunsDat) return;

    // Dacă este ultima întrebare, afișăm rezultatul
    if (indexIntrebare === intrebari.length - 1) {
        termina();
        return;
    }

    indexIntrebare++;

    afiseazaIntrebare();
}

function termina() {
    opresteCronometrul();

    elProgres.style.width = '100%';

    elProgres.parentElement.setAttribute(
        'aria-valuenow',
        100
    );

    quiz.hidden = true;
    rezultat.hidden = false;

    document.getElementById('scor-final').textContent =
        `Scor final: ${scor} din ${intrebari.length * PUNCTE_CORECT} puncte.`;
}

// Butoanele START, URMĂTOAREA ÎNTREBARE și RESTART
document.getElementById('start')
    .addEventListener('click', porneste);

butonUrmator
    .addEventListener('click', urmatoareaIntrebare);

document.getElementById('restart')
    .addEventListener('click', porneste);
