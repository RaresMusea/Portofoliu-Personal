//Fisier ce asigura declansarea modal-ului in urma apasarii butonului cu textul Aboneaza-te la Newsletter plasat in subsolul fiecareia din cele 4 pagini aferente site-ului.*/

const open = document.getElementById('newsletter');
const close = document.getElementById('close');
const modal = document.getElementById('modal_container');
const subscribe = document.querySelector('.submit');
const reset = document.querySelector('.close');
var nume = document.getElementById('name');
var email = document.getElementById('email');

//Butonul de deschidere
open.addEventListener('click', () => {
  modal.classList.add('show');
}, false);

//Butonul de inchidere
close.addEventListener('click', () => {
  modal.classList.remove('show');
}, false);

//Butonul de abonare
subscribe.addEventListener('click', () => {
  alert('Te-ai abonat cu succes la Newsletter!');
  modal.classList.remove('show');
}, false)

//Butonul de inchidere a pop-up-ului
close.addEventListener('click', () => {
  nume.value = "";
  email.value = "";

})