function klik() {
    document.getElementById('tlacitko').innerHTML = 'Baf!';
}

function generovat() {
    const text = document.getElementById('text').value;
    const cislo = document.getElementById('cislo').value;

    let vysledek = '';

    for(let i = 0; i < cislo; i++) {
        vysledek += text;
    }

    document.getElementById('vysledek').innerHTML = vysledek;
}

function darkMode() {
    document.getElementById('lorem').style.color = 'white';
    document.getElementById('lorem').style.backgroundColor = 'black';
}

function lightMode() {
    document.getElementById('lorem').style.color = 'black';
    document.getElementById('lorem').style.backgroundColor = 'white';
}

function ajaj() {
    fetch('/hello')
    .then(odpoved => odpoved.json())
    .then(data => {
        document.getElementById('hello').innerHTML = data.hello;
    });
}

function odeslat() {
    const data = document.getElementById('vstup').value;

    fetch('/prijem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
    });
}
