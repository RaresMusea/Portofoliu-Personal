/*Fisier carousel.js->Asigura functionalitatea slideshow-ului de imagini de tip carusel de pe pagina de portofoliu (portofoliu.html)*/

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

//Functie ce decrementeaza progresiv opacitatea unui element
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

const carouselImages = document.querySelector('.carousel_images');
const carouselButtons = document.querySelectorAll('.carousel_button');

const numberOfImages = document.querySelectorAll('.carousel_images img').length;
console.log(numberOfImages);
let index = 1;
let translateX = 0;

const title = document.querySelectorAll('.title');

//Animatie text la deschiderea paginii
document.addEventListener('DOMContentLoaded', function () {
  title.forEach(t => {
    t.classList.add('show');
    t.classList.remove('hide');
    IncreaseTheOppacity(t, 100);
  })
}, false);


const buttonLeft = document.getElementById('previous');
const buttonRight = document.getElementById('next');

//functionalitatea butoanelor de pe carusel
//butoanele de stanga si dreapta
buttonLeft.addEventListener('click', event => {
  if (index === 1) {
    translateX -= (numberOfImages - 1) * 800;
    index = numberOfImages;
  }

  else {
    translateX += 800;
    index--;
  }

  carouselImages.style.transform = `translateX(${translateX}px)`;
})

buttonRight.addEventListener('click', event => {
  if (index < numberOfImages) {
    translateX -= 800;
    index++;
  }

  else {
    translateX += (numberOfImages - 1) * 800;
    index = 1;
  }

  carouselImages.style.transform = `translateX(${translateX}px)`;
})