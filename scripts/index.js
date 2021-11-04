/*Fisier index.js->Fisier de tip script utilizat la comun de toate paginile de pe site pentru colorarea diferita in meniul de navigare a paginii curente*/

let path = window.location.pathname;
var page = path.split("/").pop();

//Functionalitate:
console.log(page);
switch (page) {
  case ('index.html'):
    let acasa = document.querySelector('.acasa');
    acasa.style.color = '#0066FF';
    break;

  case ('contact.html'):
    section = document.querySelector('.contact');
    section.style.color = '#0066FF';
    break;

  case ('portofoliu.html'):
    let portofoliu = document.querySelector('.portofoliu');
    console.log(portofoliu);
    portofoliu.style.color = '#0066FF';
    break;

  case ('contact.html'):
    let contact = document.querySelector('.contact');
    contact.style.color = '#0066ff';

  case ('about.html'):
    let about = document.querySelector('.about');
    about.style.color = '#0066ff';
}