/*Script Javascript ce confera functionalitate animatiilor de pe pagina ce surprinde povestea mea in lumea programarii (fisier about.html)*/

const img = document.getElementById('wall');
const title = document.getElementById('title');

//Functie ce creste progresiv opacitatea unui element html
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

//Event listener ce se va executa la deschiderea paginii (manipulare animatie)
document.addEventListener('DOMContentLoaded', function () {
  IncreaseTheOppacity(img, 80);
  img.style.transform = 'translateX(-400px)';
  title.classList.add('block');
  title.classList.remove('none');
  IncreaseTheOppacity(title, 20);
}, false);

