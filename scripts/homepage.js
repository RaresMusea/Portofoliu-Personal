/*Fisier homepage.js->Script ce asigura interactivitatea de pe pagina de start a site-ului (fisier index.html)*/

let title = document.getElementById('title');
let avatar = document.getElementById('avatar');
let root = window.location.pathname;
let doc = root.split("/").pop();

//Functie ce creste progresiv opacitatea unui element

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

//Functie ce scade progresiv opacitatea unui element
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

//Animatia de la deschiderea paginii

if (doc === 'index.html') {
  setTimeout(() => {
    title.classList.add('visible');
    title.classList.remove('invisible');
    IncreaseTheOppacity(title, 80);
    title.classList.add('up');
    IncreaseTheOppacity(avatar, 80);
    avatar.classList.add('shown');
  }, 4000);
}

var newHeight;
let flex = document.querySelector('.links_list');
let flexHeight = flex.offsetHeight;
function IncreaseHeight(element) {
  let height = element.offsetHeight;
  console.log(height);
  newHeight = height + 200;
  element.style.height = newHeight + 'px';
}

//Functie ce scade progresiv inaltimea in pixeli a unui container
function DecreaseHeight(element) {
  let height = element.offsetHeight;
  console.log(height);
  element.style.height = flexHeight + 'px';
}












