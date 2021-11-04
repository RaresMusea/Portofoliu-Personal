/*Fisier contact.js->Fisier ce asigura functionalitatea animatiilor si a controalelor de pe pagina de contact a website-ului (fisier contact.html)*/

const title = document.getElementById('title');
const image = document.getElementById('banner');
const displayButton = document.getElementById('showbutton');
const flexDiv = document.getElementById('flex');
const extraContent = document.getElementById('extra-content');
const extraContent2 = document.getElementById('extra-content2');

const showbutton2 = document.getElementById('showbutton2');
const flexDiv2 = document.getElementById('flex2');
const form = document.getElementById('display_form');

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

let newHeight;

//Functie ce creste progresiv inaltimea unui element
function CresteInaltimea(element, dimensiune) {
  let height1 = element.offsetHeight;
  console.log(height1);
  newHeight = height1 + dimensiune;
  element.style.height = newHeight + 'px';
}


//Functie ce scade progresiv inaltimea unui element
function ScadeInaltimea(element, dimensiune) {
  let height2 = element.offsetHeight;
  console.log(height2);
  newHeight = height2 - dimensiune;
  element.style.height = newHeight + 'px';
}

//Animatia de pe pagina de contact ce se va produce la incarcarea completa a website-ului

document.addEventListener('DOMContentLoaded', () => {
  IncreaseTheOppacity(title, 40)
  title.style.transform = 'translateY(-40px)';
  title.classList.add('visible');
  title.classList.remove('invisible');
  IncreaseTheOppacity(image, 80);
  image.style.transform = 'translateX(200px)';

}, false);

//Functie de event handleing ce realizeaza animatia de afisare a continutului cardului din stanga de pe pagina de contact (sectiunea 2)
function ToggleParagraph() {
  if (extraContent.classList.contains('disabled')) {
    extraContent.classList.add('enabled')
    IncreaseTheOppacity(extraContent, 200);
    extraContent.classList.remove('disabled');
    displayButton.innerHTML = "Ascunde conținut";
    CresteInaltimea(flexDiv, 400);
    flexDiv.style.overflowY = 'scroll';
    displayButton.style.transform = 'translateY(1000px)';
    DecreaseTheOppacity(form, 1);
    return 0;
  }

  if (extraContent.classList.contains('enabled')) {
    DecreaseTheOppacity(extraContent, 70);
    extraContent.classList.add('disabled');
    extraContent.classList.remove('enabled');
    ScadeInaltimea(flexDiv, 400);
    displayButton.innerHTML = "Afișează conținut";
    flexDiv.style.overflowY = 'hidden';
    displayButton.style.transform = 'translateY(0)';
    if (extraContent2.classList.contains('deactivated'))
      IncreaseTheOppacity(form, 1);
    return 0;
  }

}


//Event listener ce realizeaza animatia de afisare a continutului cardului din dreapta de pe pagina de contact (sectiunea 2)
displayButton.addEventListener('click', ToggleParagraph);

showbutton2.addEventListener('click', () => {
  if (extraContent2.classList.contains('deactivated')) {
    extraContent2.classList.add('activated');
    IncreaseTheOppacity(extraContent2, 200);
    extraContent2.classList.remove('deactivated');
    showbutton2.innerHTML = 'Ascunde';
    CresteInaltimea(flexDiv2, 400);
    flexDiv2.style.overflowY = 'scroll';
    showbutton2.style.transform = 'translateY(1100px)';
    DecreaseTheOppacity(form, 1);
    return;
  }
  if (extraContent2.classList.contains('activated')) {
    extraContent2.classList.add('deactivated');
    DecreaseTheOppacity(extraContent2, 200);
    extraContent2.classList.remove('activated');
    showbutton2.innerHTML = 'Află acum';
    ScadeInaltimea(flexDiv2, 400);
    flexDiv2.style.overflowY = 'hidden';
    showbutton2.style.transform = 'translateY(0)';
    if (extraContent.classList.contains('disabled'))
      IncreaseTheOppacity(form, 1);
    return;
  }
}, false);


//Functionalitatea formularului:
const reset1 = document.getElementById('reset1');
const submit1 = document.getElementById('send1');
const close1 = document.getElementById('close1');
const form_cont = document.querySelector('.form-container');

//butonul ce declanseaza pop-up-ul formularului
form.addEventListener('click', () => {
  form_cont.classList.add('show');


});

//butonul ce inchide formularul
close1.addEventListener('click', () => {
  form_cont.classList.remove('show');
});


//butonul ce reseteaza campurile formularului
reset1.addEventListener('click', () => {
  document.getElementById('nume').value = "";
  document.getElementById('prenume').value = "";
  document.getElementById('email').value = "";
  document.getElementById('varsta').value = "12";
  document.getElementById('dropdown').selectedIndex = 0;
  let radio = document.querySelectorAll('input[type=radio]');
  for (let i = 0; i < radio.length; i++)
    radio[i].checked = false;


  let checkboxes = document.querySelectorAll('input[type=checkbox]');
  for (let i = 0; i < checkboxes.length; i++)
    checkboxes[i].checked = false;

  let textarea = document.getElementById('story');
  textarea.value = "";
});

//butonul de submisie
submit1.addEventListener('click', () => {
  let audio = new Audio('../audio/sound.mp3');
  audio.play();
  alert('Datele dumneavoastra au fost preluate.Veți primi în curând un răspuns!');
  form_cont.classList.remove('show');
})

