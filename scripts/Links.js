/*Fisier Links.js->Fisier de tip script ce confera functionalitatea meniului dropdown de link-uri, care va fi implementat pe fiecare pagina a website-ului.*/

let toggle = document.getElementById('toggle');
let flex1 = document.querySelector('.links_list');
let flex1Height = flex1.offsetHeight;
let icons = document.querySelector('#links');
let links = document.querySelectorAll('.link');

//Functie utilizata pentru incrementarea opacitatii unui element
function IncreaseTheOppacity(element, duration) {
  let oppArray = ["0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9"];
  let x = 0;
  (function next() {
    element.style.opacity = oppArray[x];
    if (x++ < oppArray.length) {
      setTimeout(next, duration);
    }
  })();
}

//Functie utilizata pentru decrementarea opacitatii unui element
function DecreaseTheOppacity(element, duration) {
  let opp2Array = ["0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1", "0"];
  let y = 0;
  (function next() {
    element.style.opacity = opp2Array[y];
    if (y++ < opp2Array.length) {
      setTimeout(next, duration);
    }
  })();
}


//Functia ce permite marirea inaltimii unui container
function IncreaseHeight(element) {
  let height = element.offsetHeight;
  console.log(height);
  newHeight = height + 200;
  element.style.height = newHeight + 'px';
}

//Functia ce permite scaderea inaltimii unui container
function DecreaseHeight(element) {
  let height = element.offsetHeight;
  console.log(height);
  element.style.height = flex1Height + 'px';
}


//Functie ce permite desfasurarea (derularea listei de link-uri) si retragerea (compactarea) acesteia
function ToggleLinks() {

  if (toggle.classList.contains('off')) {
    toggle.classList.add('on');
    toggle.classList.remove('off');
    icons.classList.remove('unseen');
    icons.classList.add('seen');

    for (let i = 0; i < links.length; i++)
      IncreaseTheOppacity(links[i]);
    IncreaseHeight(flex1);
    return 0;
  }

  if (toggle.classList.contains('on')) {
    toggle.classList.add('off');
    toggle.classList.remove('on');
    icons.classList.add('unseen');
    icons.classList.remove('seen');
    for (let i = 0; i < links.length; i++)
      DecreaseTheOppacity(links[i]);
    DecreaseHeight(flex1);
    return 0;
  }

}

//Adaugare event listener pentru functia de mai sus
toggle.addEventListener('click', ToggleLinks);