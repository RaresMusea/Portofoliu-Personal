//Am adaugat un event Listener ce ne asigura faptul ca toate elementele Html vor fi randate inaintea incarcarii acestui fisier (Arrow function ce surprinde functionalitatea din spatele jocului). 
document.addEventListener('DOMContentLoaded', () => {


  //Adaugam toate elementele de tip HTML ce vor fi utilizate ulterior pentru asigurarea functionalitatii jocului.Acest lucru va permite si o manipulare mai usara a DOM-ului (Document Object Model).

  const GridUser = document.querySelector('.user-grid');
  const GridAI = document.querySelector('.ai-grid');
  const Fleet = document.querySelector('.grid-area');
  const Ships = document.querySelectorAll('.ships');
  const Destroyer = document.querySelector('.destroyer-container');
  const Submarine = document.querySelector('.sub-container');
  const Cruiser = document.querySelector('.crs-container');
  const Battleship = document.querySelector('.btl-container');
  const Aircraft = document.querySelector('.carr-container');

  //Butoanele ce confera jocului functionalitate:
  let StartButton = document.querySelector('#start');
  StartButton.disabled = true;
  const RotateButton = document.querySelector('#rot');

  //Textul informativ ce va aparea pe intreg parcursul jocului:
  const Turns = document.querySelector('#turns');
  const Infos = document.querySelector('#infos');

  //Dimensiunea grid-ului
  const dim = 10;

  //2 variabile de tip array in care vom stoca patratelele create in cele 2 grid-uri,respectiv id-ul lor,pentru o mai usoara identificare a acestora de-a lungul jocului

  let UserArr = []
  let AIArr = []

  //Variabile de tip boolean ce permit retinerea pozitiei curente a navelor jucatorului(vertical/orizontal)
  let vertical = false;
  let horizontal = true;

  //Variabila logica ce ne va permite sa testam daca jocul s-a sfarsit sau nu
  let FinishedGame = false;

  //Variabila ce ne va permite sa decidem cine va urma sa mute (calculatorul sau jucatorul):
  let player = 'user';

  //----------------------------------------------------------
  //Functie care manipuleaza DOM-ul si care insereaza intr-unul din gridurile specificate ca parametru de intrare cele 100 de patratele ce vor alcatui cele 2 grid-uri in care jocul se va desfasura (cel al jucatorului, respectiv cel al calculatorului).

  function CreateGameBoard(grid, array, dim) {
    for (let i = 0; i < dim * dim; i++) {
      //Generarea celor 100 de patratele
      const patratel = document.createElement('div');
      //Pentru identificare,fiecare din cele 100 de patratele va primi un dataset-id propriu in fisierul HTML
      patratel.dataset.id = i;
      //Adaugam fiecare div in cadrul div-ului parinte (acesta va fi la apel,fie div-ul cu clasa ai-grid,fie div-ul cu clasa user-grid).
      grid.appendChild(patratel);
      //Adaugam fiecare patratel in vectorul aferent tablei de joc in care patratelele se vor plasa.
      array.push(patratel);
    }
  }

  //Apelul functiei de mai sus pentru generarea tablelor de joc:
  CreateGameBoard(GridAI, AIArr, dim);
  CreateGameBoard(GridUser, UserArr, dim);


  //Pentru generarea aleatorie a navelor computer-ului,vom construi un array de obiecte care va permite stocarea numelui,respectiv a directiei de generare a fiecarei din cele 5 nave de lupta.Acest obiect va fi utilizat in functia de mai jos pentru generarea aleatoare a directiei,respectiv a pozitiei pe care fiecare nava o va avea pe grid la inceputul jocului:
  //Obiectul:

  const AIShips = [
    {
      nume: 'destroyer',
      directii: [
        [0, 1], //Orizontal
        [1, 0],//Orizonatl rotit 180 de grade
        [0, dim],//Vertical
        [dim, 0]//Vertical rotit 180 de grade
      ]
    },
    {
      nume: 'submarine',
      directii: [
        [0, 1, 2], //Orizontal
        [2, 1, 0],//Orizonatl rotit 180 de grade
        [0, dim, dim * 2],//Vertical
        [dim * 2, dim, 0]//Vertical rotit 180 de grade
      ]
    },
    {
      nume: 'cruiser',
      directii: [
        [0, 1, 2], //Orizontal
        [2, 1, 0],//Orizonatl rotit 180 de grade
        [0, dim, dim * 2],//Vertical
        [dim * 2, dim, 0]//Vertical rotit 180 de grade 
      ]
    },
    {
      nume: 'battleship',
      directii: [
        [0, 1, 2, 3], //Orizontal
        [3, 2, 1, 0],//Orizonatl rotit 180 de grade
        [0, dim, dim * 2, dim * 3],//Vertical
        [dim * 3, dim * 2, dim, 0]//Vertical rotit 180 de grade
      ]
    },
    {
      nume: 'carrier',
      directii: [
        [0, 1, 2, 3, 4], //Orizontal
        [4, 3, 2, 1, 0],//Orizonatl rotit 180 de grade
        [0, dim, dim * 2, dim * 3, dim * 4],//Vertical
        [dim * 4, dim * 3, dim * 2, dim, 0]//Vertical rotit 180 de grade
      ]
    },
  ]


  //Functie ce permite plasarea aleatorie a navelor calculatorului pe tabla sa de joc si randarea acestora in grid:
  function GenerateAIShips(warship, array) {
    let direction = 0;
    //Decidem daca directia in care nava va fi plasata pe grid va fi verticala sau orizontala
    let rand = Math.floor(Math.random() * warship.directii.length);
    //console.log(rand);
    //Pentru a putea stabili modul in care vom plasa navele pe grid,vom avea nevoie de index-ul aferent directiei aleatoare generate anterior:
    let current = warship.directii[rand];
    if (rand === 0 || rand === 1) direction = 1; //mod de pozitionare pentru pozitia orizonatala
    if (rand === 2 || rand === 3) direction = 10; //mod de pozitionare pentru pozitia verticala

    //Alegem aleator unul din cele 100 de patratele ale grid-ului in care navele se vor genera 
    let start = Math.abs(Math.floor(Math.random() * array.length - (warship.directii[0].length * direction)))

    //Ne asiguram ca niciunul dintre patratele in care dorim sa plasam aleator barca nu sunt deja ocupate de alte nave plasate anterior.Vom face acest lucru prin adaugarea unei clase fiecarui patrat ce va fi populat de o barca,la apelul functiei.Folosind variabila taken,verificam daca patratul in care se doreste randarea barcutei a fost cumva ocupat anterior de o alta barca,mai exact,variabila verifica daca div-ul al carui id este egal cu variabila start contine sau nu clasa 'taken' si va returna true sau false ,dupa caz.

    const taken = current.some(index => array[start + index].classList.contains('taken'))
    //Impiedicam navele din a fi plasate in coltul stang sau drept,astfel incat acestea sa nu iasa din grid
    const right = current.some(index => (start + index) % dim === dim - 1)
    const left = current.some(index => (start + index) % dim === 0)

    //Daca pozitia pe care nava urmeaza a fi plasata nu este ocupata,iar acea pozitie nu se gaseste in coltul stang sau drept al grid-ului,atunci vom plasa nava in zona respectiva.Daca acest lucru nu este posibil,functia se va reapela pana in momentul in care va putea plasa nava corespunzator

    if (!taken && !right && !left) {
      //Plasam nava pe grid si adaugam si clasa taken acelor patratele,semn ca nava noastra nu va putea fi 'acoperita' de alta nava,la urmatorul apel al acestei functii,dar si clasa aferenta barcii curente,astfel incat randarea sa plaseze in grid doar navele pe care si jucatorul le va poate plasa in grid-ul sau in meciul impotriva calculatorului.

      //Pentru a putea adauga ,,varful(puntea)" navei,ce va distruge integral nava in cazul in care unul din jucatori apasa pe un patratel ce contine un div cu acest element,vom adauga in varful fiecarui vapor generat o clasa ce va permite stilizarea puntii vaporului cu un element diferit
      if (rand === 0)
        array[start + (warship.directii[rand].length - 1)].classList.add('deck');
      else if (rand === 1)
        array[start].classList.add('deck');
      else if (rand === 2)
        array[start].classList.add('deck');
      else if (rand === 3)
        array[start + 10 * (warship.directii[rand].length - 1)].classList.add('deck');

      current.forEach(index => array[start + index].classList.add('taken', warship.nume, 'warship'));

      //Adaugarea unei borduri ce inconjoara fiecare nava,pentru o mai buna delimitare a vapoarelor,dar si pentru a impiedica ciocnirea/suprapunerea acestora.In momentul in care o nova va fi distrusa,atunci toata aceasta bordura va fi si ea vizibila,impiedicand jucatorul/computerul din a mai apasa pe acea regiune.

      //Cazul pozitiilor orizontale
      let shipname;
      if (warship.nume === 'destroyer') shipname = 'des';
      if (warship.nume === 'submarine') shipname = 'submar';
      if (warship.nume === 'cruiser') shipname = 'cruis';
      if (warship.nume === 'battleship') shipname = 'btlsh';
      if (warship.nume === 'carrier') shipname = 'aircarr';
      if (rand === 0 || rand === 1) {
        array[start].classList.add('horizontal', 'start');
        array[start + warship.directii[rand].length - 1].classList.add('horizontal', 'end');
        if (start > 1 && start < 9) {
          array[start - 1].classList.add('taken', 'border', shipname);
          array[start + warship.directii[rand].length].classList.add('taken', 'border', shipname);
          array[start + 9].classList.add('taken', 'border', shipname);
          array[start + warship.directii[rand].length + 10].classList.add('taken', 'border', shipname);
          for (let i = 0; i < warship.directii[rand].length; i++) {
            let j = 10 + i;
            array[start + j].classList.add('taken', 'border', shipname);
          }
        }
        if (start > 10 && start <= 89) {
          array[start - 1].classList.add('taken', 'border', shipname);
          array[start + warship.directii[0].length].classList.add('taken', 'border', shipname);
          array[start + warship.directii[rand].length - 10].classList.add('taken', 'border', shipname);
          array[start - 11].classList.add('taken', 'border', shipname);
          array[start + 9].classList.add('taken', 'border', shipname);
          array[start + warship.directii[rand].length + 10].classList.add('taken', 'border', shipname);
          array[start + warship.directii[rand].length - 11].classList.add('taken', 'border', shipname);
          for (let i = 0; i < warship.directii[rand].length; i++) {
            let j = 10 - i;
            array[start - j].classList.add('taken', 'border', shipname);
          }
          for (let i = 0; i < warship.directii[rand].length; i++) {
            let j = 10 + i;
            array[start + j].classList.add('taken', 'border', shipname);
          }

        }
        if (start > 90 && start < 99) {
          array[start - 1].classList.add('taken', 'border', shipname);
          array[start + warship.directii[rand].length].classList.add('taken', 'border', shipname);
          array[start + warship.directii[rand].length - 11].classList.add('taken', 'border', shipname);
          array[start + warship.directii[rand].length - 10].classList.add('taken', 'border', shipname);
          array[start - 11].classList.add('taken', 'border', shipname);
          for (let i = 0; i < warship.directii[rand].length; i++) {
            let j = 10 - i;
            array[start - j].classList.add('taken', 'border', shipname);

          }
        }
      }

      //Cazul pozitiilor verticale
      if (rand === 2 || rand === 3) {
        array[start].classList.add('vertical', 'start');
        array[start + 10 * (warship.directii[rand].length - 1)].classList.add('vertical', 'end');
        if (start >= 1 && start <= 8) {
          array[start + 10 * (warship.directii[rand].length)].classList.add('taken', 'border', shipname);
          array[start + 10 * (warship.directii[rand].length - 1) + 9].classList.add('taken', 'border', shipname);
          array[start + 10 * (warship.directii[rand].length - 1) + 11].classList.add('taken', 'border', shipname);
          array[start + 10 * (warship.directii[rand].length - 1) + 10].classList.add('taken', 'border', shipname);
          let shipstart = start;
          for (let i = 0; i < warship.directii[rand].length; i++) {
            let j = -1;
            let k = 1;
            array[shipstart + j].classList.add('taken', 'border', shipname);
            array[shipstart + k].classList.add('taken', 'border', shipname);
            shipstart += 10;
          }
        }
        let size = Math.floor(start / 10 + warship.directii[rand].length);

        if (start > 8 && size <= 10) {
          if (size < 10) {
            array[start + 10 * warship.directii[rand].length - 1].classList.add('taken', 'border', shipname);
            array[start + 10 * (warship.directii[rand].length - 1) + 9].classList.add('taken', 'border', shipname);
            array[start + 10 * (warship.directii[rand].length - 1) + 11].classList.add('taken', 'border', shipname);
            array[start + 10 * (warship.directii[rand].length - 1) + 10].classList.add('taken', 'border', shipname);
            array[start - 10].classList.add('taken', 'border', shipname);
            array[start - 9].classList.add('taken', 'border', shipname);
            array[start - 11].classList.add('taken', 'border', shipname);
            let shipstart = start;
            for (let i = 0; i < warship.directii[rand].length; i++) {
              let j = -1;
              let k = 1;
              array[shipstart + j].classList.add('taken', 'border', shipname);
              array[shipstart + k].classList.add('taken', 'border', shipname);
              shipstart += 10;
            }
          }
          if (size === 10) {
            array[start - 10].classList.add('taken', 'border', shipname);
            array[start - 9].classList.add('taken', 'border', shipname);
            array[start - 11].classList.add('taken', 'border', shipname);
            let shipstart = start;
            for (let i = 0; i < warship.directii[rand].length; i++) {
              let j = -1;
              let k = 1;
              array[shipstart + j].classList.add('taken', 'border', shipname);
              array[shipstart + k].classList.add('taken', 'border', shipname);
              shipstart += 10;
            }
          }
        }
      }

    }
    else GenerateAIShips(warship, array);
  }

  //Amplasarea navelor in grid-ul computer-ului:
  GenerateAIShips(AIShips[0], AIArr);
  GenerateAIShips(AIShips[1], AIArr);
  GenerateAIShips(AIShips[2], AIArr);
  GenerateAIShips(AIShips[3], AIArr);
  GenerateAIShips(AIShips[4], AIArr);


  //Functionalitatea butonului cu textul 'Auto Align Ships'-In acest caz,navele jucatorului se vor alinia aleator in gridul sau

  let autoButton = document.getElementById("auto");

  //In cazul in care jucatorul apasa pe acest buton,div-ul aferent flotei sale de nave,va disparea progresiv de pe ecran,conferind efectul unei animatii de tip fade-out.

  function lessTheOppacity() {
    let oppArray = ["0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1", "0"];
    let x = 0;
    (function next() {
      Fleet.style.opacity = oppArray[x];
      if (++x < oppArray.length) {
        setTimeout(next, 50); //depending on how fast you want to fade
      }
    })();
  }

  //Functia aceasta face apel la functia creata pentru generarea aleatoare a navelor pe grid in cazul computer-ului,numai ca de aceasta data genereaza navele pentru jucator.
  function GenerateComputerShips() {
    GenerateAIShips(AIShips[0], UserArr);
    GenerateAIShips(AIShips[1], UserArr);
    GenerateAIShips(AIShips[2], UserArr);
    GenerateAIShips(AIShips[3], UserArr);
    GenerateAIShips(AIShips[4], UserArr);
    lessTheOppacity(Fleet);
    let audio = new Audio('../audio/Bell.mp3');
    audio.play();

  }
  autoButton.onclick = function () {
    GenerateComputerShips();
    StartButton.disabled = false;
  }

  //Functionalitatea butonului rotate-Rotirea navelor jucatorului:
  function RotateShips() {
    //Daca nava este orizontala,aplicam stilizarea CSS pentru pozitionarea verticala
    if (horizontal) {
      Destroyer.classList.remove('destroyer-container');
      Submarine.classList.remove('sub-container');
      Cruiser.classList.remove('crs-container');
      Battleship.classList.remove('btl-container');
      Aircraft.classList.remove('carr-container');
      Destroyer.classList.toggle('destroyer-container-vertical');
      Submarine.classList.toggle('sub-container-vertical');
      Cruiser.classList.toggle('crs-container-vertical');
      Battleship.classList.toggle('btl-container-vertical');
      Aircraft.classList.toggle('carr-container-vertical');
      horizontal = false;
      return;
    }

    //In caz contrar,revenim la stilizarea standard
    if (!horizontal) {
      Destroyer.classList.remove('destroyer-container-vertical');
      Submarine.classList.remove('sub-container-vertical');
      Cruiser.classList.remove('crs-container-vertical');
      Battleship.classList.remove('btl-container-vertical');
      Aircraft.classList.remove('carr-container-vertical');
      Destroyer.classList.toggle('destroyer-container');
      Submarine.classList.toggle('sub-container');
      Cruiser.classList.toggle('crs-container');
      Battleship.classList.toggle('btl-container');
      Aircraft.classList.toggle('carr-container');
      horizontal = true;
      return;
    }
  }

  //Functionalitatea butonului ce permite rotirea navelor
  RotateButton.addEventListener('click', RotateShips);


  //Variabile folosite pentru schimbarea putntii (a deck-ului/al punctului critic specific fiecarei nave in parte)

  //butonul de swap
  let swap = document.getElementById('swap');

  //1.Destroyer
  let d1 = document.getElementById('destroyer1');
  let d0 = document.getElementById('destroyer0');

  //2.Submarin
  let sub0 = document.getElementById('sub0');
  let sub2 = document.getElementById('sub2');

  //3.Cruiser
  let crs0 = document.getElementById('crs0');
  let crs2 = document.getElementById('crs2');


  //4.Battleship
  let btl0 = document.getElementById('btl0');
  let btl3 = document.getElementById('btl3');

  //5.Aircraft Carrier
  let carr0 = document.getElementById('carr0');
  let carr4 = document.getElementById('carr4');

  //Variabile care retin 0,daca puntea este in partea stanga a navei (orizontal),sau in partea de jos(vertical) ,respectiv 1,daca puntea este situata in partea dreapta a navei(orizontal),sau in partea de sus (vertical)
  let horizontaldeck = 1;


  function SwapDecks() {

    if (d1.classList.contains('deck')) {
      let audio = new Audio('../audio/Whoosh-In.mp3');
      audio.play();
    }

    if (d1.classList.contains('deck')) {
      d1.classList.remove('deck');
      d0.classList.toggle('deck');
      horizontaldeck = 0;
    }
    else {
      d1.classList.toggle('deck');
      d0.classList.remove('deck');
      let audio2 = new Audio('../audio/Whoosh-Out.mp3');
      audio2.play();
      horizontaldeck = 1;
    }

    if (sub2.classList.contains('deck')) {
      sub2.classList.remove('deck');
      sub0.classList.toggle('deck');
      horizontaldeck = 0;
    }
    else {
      sub2.classList.toggle('deck');
      sub0.classList.remove('deck');
      horizontaldeck = 1;
    }

    if (crs2.classList.contains('deck')) {
      crs2.classList.remove('deck');
      crs0.classList.toggle('deck');
      horizontaldeck = 0;
    }
    else {
      crs2.classList.toggle('deck');
      crs0.classList.remove('deck');
      horizontaldeck = 1;
    }

    if (btl3.classList.contains('deck')) {
      btl3.classList.remove('deck');
      btl0.classList.toggle('deck');
      horizontaldeck = 0;
    }
    else {
      btl3.classList.toggle('deck');
      btl0.classList.remove('deck');
      horizontaldeck = 1;
    }

    if (carr4.classList.contains('deck')) {
      carr4.classList.remove('deck');
      carr0.classList.toggle('deck');
      horizontaldeck = 0;
    }
    else {
      carr4.classList.toggle('deck');
      carr0.classList.remove('deck');
      horizontaldeck = 1;
    }

  }
  //Event listener ce asigura functionalitatea butonului cu textul 'Swap Ship Decks'
  swap.addEventListener('click', SwapDecks);

  //Functionalitatea de Drag&Drop a navelor din zona Fleet in Grid-ul User-ului:

  //Pentru fiecare nava din flota,utilizatorul o va putea trage cu mouse-ul in grid-ul sau propriu.variabila ship este un index al iteratiei forEach,aceasta putand fi notata in orice alt fel.Aceasta iteratie va invoca si functia DragStart,ce va fi codata in randurile ce urmeaza.

  Ships.forEach(ship => ship.addEventListener('dragstart', DragStart));
  //Fiecare patratel aferent navei va apartine unui anume patrat din array-ul UserArr.
  UserArr.forEach(patrat => patrat.addEventListener('dragover', DragOver));

  //Dupa ce o nava este 'trasa' in patratelele din grid,ne asiguram ca aceasta a ajuns in acel loc.
  UserArr.forEach(patrat => patrat.addEventListener('dragenter', DragEnter));

  //Momentul in care nava ajunge cu succes in grid dupa plasare.
  UserArr.forEach(patrat => patrat.addEventListener('dragleave', DragLeave));

  //Momentul in care utilizatorul elibereaza mouse-click-ul si se hotaraste unde va dori ca nava respectiva sa fie pozitionata.
  UserArr.forEach(patrat => patrat.addEventListener('drop', DragDrop));

  //Mutarea completa
  UserArr.forEach(patrat => patrat.addEventListener('dragend', DragEnd));

  //Pentru a sti ce id/index al navei ce va urma a fi mutate am selectat,am adaugat acest eventListener care se initializeaza in momentul in care utilizatorul apasa click pe una din navele aflate in flota.

  //Pentru a stoca acest index,repsectiv nume al navei pe care utilizatorul tocmai ce a scos-o din flota,vom avea nevoie de o variabila,pe care o vom accesa din arrow function-ul de mai jos:

  let ShipNameWithIndex;
  let SelectedShip;
  let LungimeNava;

  Ships.forEach(ship => ship.addEventListener('mousedown', (e) => {

    ShipNameWithIndex = e.target.id;

  }))

  let draggedshipscount = 0;

  //functii/metode ce permit utilizarea eventListenerelor mentionate anterior in cod:
  //#1. Metoda care initializeaza mutarea navelor din flota pe grid.
  function DragStart(e) {
    SelectedShip = this;
    //Pentru a sti daca nava va putea fi sau nu plasata intr-o anumita regiune a grid-ului,vom retine lungimea navei selectate,in functie de numarul de elemente  HTML din parintele container (cel din HTML care contine clasa 'ships').Lungimea acelei nave va fi stocata in variabila LungimeNava.
    LungimeNava = parseInt(this.childNodes.length);
  }

  function DragOver(e) {
    e.preventDefault();
  }


  function DragEnter(e) {
    e.preventDefault();

  }


  function DragLeave() {
    console.log('drag-leave')

  }

  //Functia ce face posibila incarearea navei intr-o anume serie de patrate de pe grid in momentul in care utilizatorul elibereaza LMB(Left Mouse Button)

  function DragDrop() {

    //Se va retine in variabila de mai jos numele,respectiv id-ul ultimului patratel ce intra in compozitia unei nave selectate

    let ShipNameWithLastId = SelectedShip.lastChild.id;

    let Shipsclass = ShipNameWithLastId.slice(0, -1);
    if (Shipsclass === 'sub') {
      LungimeNava--;
    }

    //Retinem index-ul ultimului patratel din compozitia navei selectate si il castam spre int,intrucat,in elementul html,acest index este salvat ca si string.

    let lastshipindex = parseInt(ShipNameWithLastId.substr(-1));
    //Stocam index-ul ultimului patratel in dataset id-ul patratelelor ce alcatuiesc grid-ul jucatorului:

    let lastshipid = lastshipindex + parseInt(this.dataset.id);

    //Salvam in variabila de mai jos indicele patratelului ce intra in compozitia navei pe care utilizatorul il selecteaza
    let SelectedShipIndex;

    SelectedShipIndex = parseInt(ShipNameWithIndex.substr(-1));

    //Array ce retine patratelele in care navele nu vor putea fi plasate si manipuleaza ulterior aceste variabile in functia de mai jos,astfel incat navele plasate la extremitati,si nu numai sa nu poata face overflow in grid-ul utilizatorului.
    //Nu vor putea  fi aliniate pe orizontala navele  in patratelele cu urmatorul dataset-id:

    const notallowedhorizontally = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93];

    //Nu vor putea  fi aliniate pe verticala  navele in patratelele cu urmatorul dataset-id:
    const notallowedvertically = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60];

    //modificam array-ul in functie de lungimea navei ce urmeaza a fi plasata pe grid:
    let newnotallowedhorizontally = notallowedhorizontally.splice(0, 10 * lastshipindex);
    let newnotallowedvertically = notallowedvertically.splice(0, 10 * lastshipindex);

    //-----------------------------------------------------------------------------------------------------
    //Functia propriu-zisa:

    //Pentru a ne asigura de faptul ca indiferent din ce parte utilizatorul apuca barca cu mouse-ul,aceasta se va pozitiona de fiecare data in patratelul din grid cu acelasi id,este crucial sa executam aceasta prelucrare asupra variabilei lastshipId
    lastshipid = lastshipid - SelectedShipIndex;

    //Pozitionarea navei pe ecran
    //Situatia in care utilizatorul se decide sa plaseze nava orizontal,iar nava nu depaseste marginile orizontale ale grid-ului:

    UserArr[parseInt(this.dataset.id) - SelectedShipIndex];
    if (horizontal && !newnotallowedhorizontally.includes(lastshipid)) {
      //Impiedicarea programului din a permite jucatorului sa plaseze doua nave una langa cealalta in cazul in care acestea sunt plasate pe grid pe orizontala.Se va genera ulterior si o bordura care sa permita distantarea navelor intre ele.

      let taken = false;
      for (let i = 0; i < LungimeNava; i++) {
        if (UserArr[parseInt(this.dataset.id) - SelectedShipIndex + i].classList.contains('taken') === true) {
          taken = true;
          break;
        }
      }
      if (taken === false) {
        for (let i = 0; i < LungimeNava; i++) {
          let directionClass;
          if (i === 0) directionClass = 'start';
          if (i === LungimeNava - 1) directionClass = 'end';
          UserArr[parseInt(this.dataset.id) - SelectedShipIndex + i].classList.add('taken', 'warship', 'horizontal', directionClass, Shipsclass);
        }

        //Adaugarea unei borduri imaginare in jurul navei plasate:

        let shipstart = (parseInt(this.dataset.id) - SelectedShipIndex);
        console.log(shipstart);
        if (shipstart === 0) {
          UserArr[shipstart + LungimeNava].classList.add('taken', 'border');
          for (let i = 0; i < LungimeNava; i++) {
            let j = 10 + i;
            UserArr[shipstart + j].classList.add('taken', 'border');
          }
          UserArr[shipstart + LungimeNava + 10].classList.add('taken', 'border');
        }


        if (shipstart >= 1 && shipstart <= 8) {
          UserArr[shipstart - 1].classList.add('taken', 'border');
          console.log(UserArr[shipstart - 1]);
          UserArr[shipstart + LungimeNava].classList.add('taken', 'border');
          UserArr[shipstart + 9].classList.add('taken');
          UserArr[shipstart + LungimeNava + 10].classList.add('taken', 'border');
          for (let i = 0; i < LungimeNava; i++) {
            let j = 10 + i;
            UserArr[shipstart + j].classList.add('taken', 'border');
          }
        }

        if (shipstart === 9) {
          UserArr[shipstart - 1].classList.add('taken', 'border');
          for (let i = 0; i < LungimeNava; i++) {
            let j = 10 + i;
            UserArr[shipstart + j].classList.add('taken', 'border');
          }
        }

        if (shipstart > 0 && shipstart < 90 && shipstart % 10 === 0) {
          UserArr[shipstart + LungimeNava].classList.add('taken', 'border');
          for (let i = 0; i < LungimeNava + 1; i++) {
            UserArr[shipstart + i - 10].classList.add('taken', 'border');
          }
          for (let i = 0; i < LungimeNava + 1; i++) {
            let j = 10 + i;
            UserArr[shipstart + j].classList.add('taken', 'border');
          }
        }


        if (shipstart >= 10 && shipstart <= 89 && shipstart % 10 != 0) {
          UserArr[shipstart - 1].classList.add('taken', 'border');
          UserArr[shipstart + LungimeNava].classList.add('taken', 'border');
          UserArr[shipstart + LungimeNava - 10].classList.add('taken', 'border');
          UserArr[shipstart - 11].classList.add('taken', 'border');
          UserArr[shipstart + 9].classList.add('taken', 'border');
          UserArr[shipstart + LungimeNava + 10].classList.add('taken', 'border');
          UserArr[shipstart + LungimeNava - 11].classList.add('taken', 'border');
          for (let i = 0; i < LungimeNava; i++) {
            let j = 10 - i;
            UserArr[shipstart - j].classList.add('taken', 'border');
          }
          for (let i = 0; i < LungimeNava; i++) {
            let j = 10 + i;
            UserArr[shipstart + j].classList.add('taken', 'border');
          }
        }

        if (shipstart === 90) {
          UserArr[shipstart + LungimeNava].classList.add('taken', 'border');
          for (let i = 0; i < LungimeNava + 1; i++) {
            UserArr[shipstart + i - 10].classList.add('taken', 'border');
          }
        }

        if (shipstart >= 91 && shipstart <= 99) {
          UserArr[shipstart - 1].classList.add('taken', 'border');
          UserArr[shipstart - 11].classList.add('taken', 'border');
          for (let i = 0; i < LungimeNava; i++) {
            UserArr[shipstart + i - 10].classList.add('taken', 'border');
          }
        }
        console.log(LungimeNava);
        if (horizontaldeck === 0)
          UserArr[parseInt([this.dataset.id]) - SelectedShipIndex].classList.add('deck');
        else if (horizontaldeck === 1)
          UserArr[parseInt([this.dataset.id]) - SelectedShipIndex + LungimeNava - 1].classList.add('deck');
      }
      else return;
    }
    //Situatia in care utilizatorul se decide sa plaseze nava vertical,iar nava nu depaseste marginile verticale ale grid-ului:

    else if (!horizontal) {

      //Impiedicarea programului din a permite jucatorului sa plaseze doua nave una langa cealalta in cazul in care acestea sunt plasate pe grid pe verticala.Se va genera ulterior si o bordura care sa permita distantarea navelor intre ele.

      let taken = false;
      for (let i = 0; i < LungimeNava; i++) {
        if (UserArr[parseInt(this.dataset.id) - SelectedShipIndex + i].classList.contains('taken') === true) {
          taken = true;
          break;
        }

        console.log(LungimeNava);
        if (taken === false) {
          for (let i = 0; i < LungimeNava; i++) {
            let directionClass;
            if (i === 0) directionClass = 'start';
            if (i === LungimeNava - 1) directionClass = 'end';
            UserArr[parseInt(this.dataset.id) - SelectedShipIndex + dim * i].classList.add('taken', 'warship', 'vertical', directionClass, Shipsclass);
          }

          //Adaugarea unei borduri imaginare in jurul navei plasate:
          let shipstart = (parseInt(this.dataset.id) - SelectedShipIndex);
          if (shipstart === 0) {
            UserArr[shipstart + dim * LungimeNava].classList.add('taken', 'border');
            for (let i = 0; i < LungimeNava; i++) {
              UserArr[shipstart + dim * i + 1].classList.add('taken', 'border');
            }
            UserArr[shipstart + dim * LungimeNava + 1].classList.add('taken', 'border');
          }
          else if (shipstart != 0 && shipstart % 10 === 0 && shipstart + (dim * (LungimeNava - 1)) === 90) {
            UserArr[shipstart - 10].classList.add('taken', 'border');
            for (let i = 0; i < LungimeNava; i++) {
              UserArr[shipstart + dim * i + 1].classList.add('taken', 'border');
            }
            UserArr[shipstart - dim + 1].classList.add('taken', 'border');
          }

          else if (shipstart != 0 && shipstart % 10 === 0 && shipstart + (dim * (LungimeNava - 1)) != 90) {
            UserArr[shipstart - 10].classList.add('taken', 'border');
            for (let i = 0; i < LungimeNava; i++) {
              UserArr[shipstart + dim * i + 1].classList.add('taken', 'border');
            }
            UserArr[shipstart - dim + 1].classList.add('taken', 'border');
            UserArr[shipstart + dim * LungimeNava + 1].classList.add('taken', 'border');
            UserArr[shipstart + dim * LungimeNava].classList.add('taken', 'border');
          }

          else if (shipstart === 9) {
            for (let i = 0; i < LungimeNava; i++) {
              UserArr[shipstart + dim * i - 1].classList.add('taken', 'border');
            }
            UserArr[shipstart + dim * LungimeNava].classList.add('taken', 'border');
            UserArr[shipstart + dim * LungimeNava - 1].classList.add('taken', 'border');
          }

          else if (shipstart != 9 && shipstart % 10 === 9 && shipstart + (dim * (LungimeNava - 1)) === 99) {
            UserArr[shipstart - 10].classList.add('taken', 'border');
            for (let i = 0; i < LungimeNava; i++) {
              UserArr[shipstart + dim * i - 1].classList.add('taken', 'border');
            }
            UserArr[shipstart - dim - 1].classList.add('taken', 'border');
          }

          else if (shipstart != 9 && shipstart % 10 === 9 && shipstart + (dim * (LungimeNava - 1)) != 99) {
            UserArr[shipstart - 10].classList.add('taken', 'border');
            for (let i = 0; i < LungimeNava; i++) {
              UserArr[shipstart + dim * i - 1].classList.add('taken', 'border');
            }
            UserArr[shipstart - dim - 1].classList.add('taken', 'border');
            UserArr[shipstart + dim * LungimeNava - 1].classList.add('taken', 'border');
            UserArr[shipstart + dim * LungimeNava].classList.add('taken', 'border');
          }
          else if (shipstart + (dim * (LungimeNava - 1)) >= 91 && shipstart + (dim * (LungimeNava - 1)) <= 98) {
            UserArr[shipstart - dim + 1].classList.add('taken', 'border');
            UserArr[shipstart - dim - 1].classList.add('taken', 'border');
            for (let i = 0; i < LungimeNava; i++) {
              UserArr[shipstart + dim * i - 1].classList.add('taken', 'border');
              UserArr[shipstart + dim * i + 1].classList.add('taken', 'border');
            }
          }
          else if (shipstart >= 1 && shipstart <= 8) {
            UserArr[shipstart + dim * LungimeNava].classList.add('taken', 'border');
            UserArr[shipstart + dim * LungimeNava + 1].classList.add('taken', 'border');
            UserArr[shipstart + dim * LungimeNava - 1].classList.add('taken', 'border');
            for (let i = 0; i < LungimeNava; i++) {
              UserArr[shipstart + dim * i - 1].classList.add('taken'), 'border';
              UserArr[shipstart + dim * i + 1].classList.add('taken', 'border');
            }
          }
          else {
            UserArr[shipstart - dim].classList.add('taken', 'border');
            UserArr[shipstart - dim + 1].classList.add('taken', 'border');
            UserArr[shipstart - dim - 1].classList.add('taken', 'border');
            for (let i = 0; i < LungimeNava; i++) {
              UserArr[shipstart + dim * i - 1].classList.add('taken', 'border');
              UserArr[shipstart + dim * i + 1].classList.add('taken', 'border');
            }
            UserArr[shipstart + dim * LungimeNava].classList.add('taken', 'border');
            UserArr[shipstart + dim * LungimeNava + 1].classList.add('taken', 'border');
            UserArr[shipstart + dim * LungimeNava - 1].classList.add('taken', 'border');
          }

          if (horizontaldeck === 0)
            UserArr[parseInt([this.dataset.id]) - SelectedShipIndex].classList.add('deck');
          else if (horizontaldeck === 1)
            UserArr[parseInt([this.dataset.id]) - SelectedShipIndex + 10 * (LungimeNava - 1)].classList.add('deck');
        } else return;
      }
    }
    else return;

    Fleet.removeChild(SelectedShip);


    if (Fleet.childElementCount === 1)
      StartButton.disabled = false;


  }

  function DragEnd() {
    console.log('dragend');
  }





  //Programarea functionalitatii din spatele jocului


  //La fel ca si in cazul mutarilor jucatorului,vom avea nevoie de cateva variabile care sa tina cont daca anumite nave de pe grid-ul jucatorului au fost sau nu distruse de catre calculator.In acest caz,vom folosi exact aceleasi variabile,doar ca cu nume diferite,astfel incat aceste variabile sa nu interfereze cu cele create pentru utilizator si in care s-a retinut cate nave din toate cele de care calculatorul dispune au fost distruse de catre utilizator.

  let cpudestroyers = 0;
  let cpusubmarines = 0;
  let cpucruisers = 0;
  let cpuaircrafts = 0;
  let cpubattleships = 0;

  //Variabila ce retine cate nave a distrus computer-ul:
  let destroyedshipsbyai = 0;
  function ComputersTurn() {

    //Vom utiliza un randomizer ce va genera aleator un patratel din cele 100 ale grid-ului jucatorului,in care computer-ul va incerca sa 'atace' una din nave.

    let randomsquare = Math.floor(Math.random() * UserArr.length);
    if (!UserArr[randomsquare].classList.contains('explode')) {

      if (UserArr[randomsquare].classList.contains('destroyer')) {
        cpudestroyers++;
      }

      if (UserArr[randomsquare].classList.contains('sub')) {
        cpusubmarines++;
      }

      if (UserArr[randomsquare].classList.contains('crs')) {
        cpucruisers++;
      }

      if (UserArr[randomsquare].classList.contains('btl')) {
        cpubattleships++;
      }

      if (UserArr[randomsquare].classList.contains('carr')) {
        cpuaircrafts++;
      }
    }

    if (!UserArr[randomsquare].classList.contains('explode')) {
      if (UserArr[randomsquare].classList.contains('warship')) {
        let audio = new Audio('../audio/Explosion.mp3');
        audio.play();

        UserArr[randomsquare].classList.add('explode');
      }
      else {
        if (!UserArr[randomsquare].classList.contains('missed') && !UserArr[randomsquare].classList.contains('do-not-touch-borders-again')) {
          UserArr[randomsquare].classList.add('missed');
        }
      }
    }
    //Pentru a putea refolosi codul din functionalitatea jocului din cazul jucatorului si in cazul mutarilor computer-ului,vom atribui variabilei patrat valoarea din vectorul UserArr[randomsquare]

    if (UserArr[randomsquare].classList.contains('deck')) {
      let lastship = new Audio("../audio/You Are The Last Hope.mp3");
      if (UserArr[randomsquare].classList.contains('destroyer')) {
        cpudestroyers = 2;
        destroyedshipsbyai++;
        ShowBorders('destroyer', 'des', UserArr);
        FadeIn();
        if (5 - destroyedshipsbyai > 1) {
          Infos.innerHTML = "The Computer sunk your Destroyer!\n" + (5 - destroyedshipsbyuser) + " more warships left on your gameboard!";
          let audio = new Audio("../audio/Torpedo Tubes Destroyed.mp3");
          setTimeout(() => { audio.play(); }, 1100);
        }
        else if (5 - destroyedshipsbyai === 1) {
          Infos.innerHTML = "The Computer sunk your Destroyer!\n" + (5 - destroyedshipsbyuser) + " warship left on your gameboard!";
          setTimeout(() => { lastship.play(); }, 900);
        }
        setTimeout(() => { FadeOut(); }, 2200);
      }

      if (UserArr[randomsquare].classList.contains('submarine')) {
        cpusubmarines = 3;
        destroyedshipsbyai++;
        FadeIn();
        if (5 - destroyedshipsbyai > 1) {
          Infos.innerHTML = "The Computer Blown Out your Submarine!\n" + (5 - destroyedshipsbyuser) + " more warships left on your gameboard!";
          let destroyed = new Audio("../audio/Destroyed.mp3");
          setTimeout(() => { destroyed.play(); }, 1100);
        }
        else if (5 - destroyedshipsbyai === 1) {
          Infos.innerHTML = "The Computer Blown Out your Submarine!\n" + (5 - destroyedshipsbyuser) + "  more warship left on your gameboard!";
          setTimeout(() => { lastship.play(); }, 900);
        }
        setTimeout(() => { FadeOut(); }, 2200);
        ShowBorders('submarine', 'submar', UserArr);
      }

      if (UserArr[randomsquare].classList.contains('cruiser')) {
        cpucruisers = 3;
        destroyedshipsbyai++;
        FadeIn();
        if (5 - destroyedshipsbyai > 1) {
          Infos.innerHTML = "The Computer destroyed your Cruiser!\n" + (5 - destroyedshipsbyuser) + " more warships left on your gameboard!";
          let flood = new Audio("../audio/We're Flooding Quickly1.mp3");
          setTimeout(() => { flood.play(); }, 1100);
        }
        else if (5 - destroyedshipsbyai === 1) {
          Infos.innerHTML = "The Computer destroyed your Cruiser\n" + (5 - destroyedshipsbyuser) + " more warship left on your gameboard!";
          setTimeout(() => { lastship.play(); }, 900);
        }
        setTimeout(() => { FadeOut(); }, 2200);
        ShowBorders('cruiser', 'cruis', UserArr);
      }

      if (UserArr[randomsquare].classList.contains('battleship')) {
        cpubattleships = 4;
        destroyedshipsbyai++;
        FadeIn();
        if (5 - destroyedshipsbyai > 1) {
          Infos.innerHTML = "The Computer foundered your Battleship !\n" + (5 - destroyedshipsbyuser) + " more warships left on your gameboard!";
          let flooding = new Audio("../audio/We're Taking On Water Quickly.mp3");
          setTimeout(() => { flooding.play(); }, 1100);
        }
        else if (5 - destroyedshipsbyai === 1) {
          Infos.innerHTML = "The Computer foundered your Battleship!\n" + (5 - destroyedshipsbyuser) + " more warship left on your gameboard!";
          setTimeout(() => { lastship.play(); }, 900);
        }
        setTimeout(() => { FadeOut(); }, 2200);
        ShowBorders('battleship', 'btlsh', UserArr);
      }

      if (UserArr[randomsquare].classList.contains('carrier')) {
        cpuaircrafts = 5;
        destroyedshipsbyai++;
        FadeIn();
        if (5 - destroyedshipsbyai > 1) {
          Infos.innerHTML = "The Computer submerged your Aircraft Carrier!\n" + (5 - destroyedshipsbyuser) + " more warships left on your gameboard!";
          let audio = new Audio("../audio/The Ship Is On Fire.mp3");
          setTimeout(() => { audio.play(); }, 1500);
        }
        else if (5 - destroyedshipsbyai === 1) {
          Infos.innerHTML = "The Computer submerged your Aircraft Carrier!\n" + (5 - destroyedshipsbyuser) + " more warship left on your gameboard";
          setTimeout(() => { lastship.play(); }, 900);
        }
        setTimeout(() => { FadeOut(); }, 2200);
        ShowBorders('carrier', 'aircarr', UserArr);
      }
    }






    player = 'user';
    Turns.innerHTML = "Your Turn";
  }


  function Game() {
    CheckForWins();
    if (FinishedGame) return;
    if (player === 'user') {
      Turns.innerHTML = 'Your Turn';
      AIArr.forEach(square => square.addEventListener('click', function (e) {
        ShowSquares(square);
      }))
    }
    if (player === 'computer') {
      Turns.innerHTML = "Computer's Turn";
      //Instalam o durata de asteptare de maxim 2 secunde,pana in momentul in care computer-ul va muta si el la randul sau
      setTimeout(() => { ComputersTurn(); }, 3500);
    }
  }

  //Pornirea joocului in momentul in care utilizatorul apasa pe butonul de start
  StartButton.addEventListener('click', Game);

  //Facem zona de plasare sa dispara in momentul in care utilizatorul apasa butonul cu titlul Start Battle,si mai mult decat atat,adaugam si un efect sonor:


  StartButton.onclick = function () {
    lessTheOppacity();
    let battle = new Audio("../audio/Battle Starts.mp3");
    battle.play();
    StartButton.style.display = "none";
    RotateButton.style.display = "none";
    autoButton.style.display = "none";
    swap.style.display = "none";
    let fl = document.querySelector(".fleet");
    fl.style.display = "none";
  };

  //Variabile ce retin numarul de patratele din fiecare nava.In situatia in care utilizatorul sau computer-ul va ghici toate patratelele aferente uneia dintre nave,atunci,acea nava se va considera a fi distrusa,iar bordurile din jur vor primi o stilizare diferita

  let destroyers = 0;
  let submarines = 0;
  let cruisers = 0;
  let aircrafts = 0;
  let battleships = 0;



  //Variabila ce retine numarul de nave distruse de jucator
  let destroyedshipsbyuser = 0;

  //Functia responsabila de afisarea continutului din patrate,in situatia in care utilizatorul apasa pe unul din acestea:
  function ShowSquares(patrat) {
    if (!patrat.classList.contains('explode')) {
      if (patrat.classList.contains('destroyer')) {
        destroyers++;
      }

      if (patrat.classList.contains('sub')) {
        submarines++;
      }

      if (patrat.classList.contains('crs')) {
        cruisers++;
      }

      if (patrat.classList.contains('btl')) {
        battleships++;
      }

      if (patrat.classList.contains('carr')) {
        aircrafts++;
      }
    }


    //In momentul in care utilizatorul da click pe un patratel ce ascunde un spatiu ocupat de o nava,atunci,se presupune ca acea portiune a navei a fost distrusa si ca va exploda.In cazul unei explozii,zona respectiva va fi colorata intr-un mod diferit
    if (!patrat.classList.contains('explode')) {
      if (patrat.classList.contains('warship')) {
        let audio = new Audio('../audio/Explosion.mp3');
        patrat.classList.add('explode');
        audio.play();
      }
      else {
        if (!patrat.classList.contains('missed') && !patrat.classList.contains('do-not-touch-borders-again')) {
          patrat.classList.add('missed');
          let audio = new Audio("../audio/Missed Shot.mp3");
          audio.play();
        }
      }

    }


    //Afisarea bordurilor in momentul in care o nava este distrusa
    if (patrat.classList.contains('deck')) {

      if (patrat.classList.contains('destroyer')) {
        destroyers = 2;
        destroyedshipsbyuser++;
        ShowBorders('destroyer', 'des', AIArr);
        FadeIn();
        if (5 - destroyedshipsbyuser > 1)
          Infos.innerHTML = "Enemy Destroyer sunk!\n" + (5 - destroyedshipsbyuser) + " more ships left to destroy!";
        else if (5 - destroyedshipsbyuser === 1)
          Infos.innerHTML = "Enemy Destroyer sunk!\n" + (5 - destroyedshipsbyuser) + " more ship left to destroy!";
        setTimeout(() => { FadeOut(); }, 2200);
        let audio = new Audio("../audio/We've sunk an enemy destroyer.mp3");
        setTimeout(() => { audio.play(); }, 1500);
      }

      if (patrat.classList.contains('submarine')) {
        submarines = 3;
        destroyedshipsbyuser++;
        FadeIn();
        if (5 - destroyedshipsbyuser > 1)
          Infos.innerHTML = "Enemy Submarine Blown Out!\n" + (5 - destroyedshipsbyuser) + " more ships left to destroy!";
        else if (5 - destroyedshipsbyuser === 1)
          Infos.innerHTML = "Enemy Submarine Blown Out!\n" + (5 - destroyedshipsbyuser) + " more ship left to destroy!";
        setTimeout(() => { FadeOut(); }, 2200);
        ShowBorders('submarine', 'submar', AIArr);
        let audio = new Audio("../audio/Enemy Damaged.mp3");
        setTimeout(() => { audio.play(); }, 1500);
      }

      if (patrat.classList.contains('cruiser')) {
        cruisers = 3;
        destroyedshipsbyuser++;
        FadeIn();
        if (5 - destroyedshipsbyuser > 1)
          Infos.innerHTML = "Enemy Cruiser Blown Out!\n" + (5 - destroyedshipsbyuser) + " more ships left to destroy!";
        else if (5 - destroyedshipsbyuser === 1)
          Infos.innerHTML = "Enemy Cruiser Blown Out!\n" + (5 - destroyedshipsbyuser) + " more ship left to destroy!";
        setTimeout(() => { FadeOut(); }, 2200);
        ShowBorders('cruiser', 'cruis', AIArr);
        let audio = new Audio("../audio/Enemy Cruiser Sunk.mp3");
        setTimeout(() => { audio.play(); }, 1500);
      }

      if (patrat.classList.contains('battleship')) {
        battleships = 4;
        destroyedshipsbyuser++;
        FadeIn();
        if (5 - destroyedshipsbyuser > 1)
          Infos.innerHTML = "Enemy Battleship foundered!\n" + (5 - destroyedshipsbyuser) + " more ships left to destroy!";
        else if (5 - destroyedshipsbyuser === 1)
          Infos.innerHTML = "Enemy Battleship foundered\n" + (5 - destroyedshipsbyuser) + " more ship left to destroy!";
        setTimeout(() => { FadeOut(); }, 2200);
        ShowBorders('battleship', 'btlsh', AIArr);
        let audio = new Audio("../audio/Enemy Battleship Destroyed.mp3");
        setTimeout(() => { audio.play(); }, 1500);
      }

      if (patrat.classList.contains('carrier')) {
        aircrafts = 5;
        destroyedshipsbyuser++;
        FadeIn();
        if (5 - destroyedshipsbyuser > 1)
          Infos.innerHTML = "Enemy Aircraft Carrier submerged!\n" + (5 - destroyedshipsbyuser) + " more ships left to destroy!";
        else if (5 - destroyedshipsbyuser === 1)
          Infos.innerHTML = "Enemy Aircraft Carrier submerged\n" + (5 - destroyedshipsbyuser) + " more ship left to destroy!";
        setTimeout(() => { FadeOut(); }, 2200);
        ShowBorders('carrier', 'aircarr', AIArr);
        if (patrat.classList.contains('destroyed')) {
          let audio = new Audio("../audio/Enemy Aircraft Carrier Destroyed.mp3");
          setTimeout(() => { audio.play(); }, 1500);
        }
      }
    }

    player = 'computer';
    //Instantiem modul de joc pentru AI
    Game();
  }


  function ShowBorders(className, abbr, array) {
    let positions = [];
    for (let i = 0; i < 100; i++) {
      if (array[i].classList.contains(className))
        positions.push(parseInt(array[i].dataset.id));
    }

    for (let i = 0; i < dim * dim; i++) {
      if (array[i].classList.contains(abbr)) {
        array[i].classList.add('stripe');
        array[i].classList.add('do-not-touch-borders-again');
      }
    }
    console.log(positions);
    for (let i = 0; i < positions.length; i++) {
      array[positions[i]].classList.add('explode');
      array[positions[i]].classList.add('destroyed');
    }
  }





  //Functie ce permite disparitia label-ului de text ce confera informatii aditionale despre instanta curenta a jocului.Label-ul este  identificat prin variabila Infos,cu ajutorul unei animatii custom,de tip Fade-Out,creata in special doar prin scaderea opacitatii acelui element HTML

  function FadeOut() {
    let oppArray = ["0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1", "0"];
    let x = 0;
    (function next() {
      Infos.style.opacity = oppArray[x];
      if (++x < oppArray.length) {
        setTimeout(next, 100);
      }
    })();
  }


  //Functie opusa functiei scrise anterior,care are un rol invers,anume acela de a simula o animatie de tip Fade-In,creata in special prin manipularea opacitatii unui anume element din fisierul HTML,si anume label-ul de text care in acest fisier poate fi identificat prin intermediul variabilei Infos.

  function FadeIn() {

    let oppArray = ["0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0"];
    let x = 0;
    (function next() {
      Infos.style.opacity = oppArray[x];
      if (++x < oppArray.length) {
        setTimeout(next, 50);
      }
    })();

  }

  let win_message = document.getElementById('win-text');

  let restart = document.getElementById('restart');
  restart.style.display = "none";

  function CheckForWins() {
    console.log(destroyedshipsbyuser)
    if (destroyedshipsbyuser === 5) {
      win_message.innerHTML = "YOU WON!\n" + "You destroyed all enemy ships!" + "During this battle,you lost " + parseInt(destroyedshipsbyai) + " out of 5 warships from your fleet.";
      let audio = new Audio('../audio/Our Victory.mp3');
      setTimeout(() => { audio.play(); }, 3500);
      restart.style.display = "block";
      GameOver();
    }
    console.log(destroyedshipsbyai);
    if (destroyedshipsbyai === 5) {
      FadeIn();
      win_message.innerHTML = 'YOU LOST!\n' + 'All of your ships were destroyed this game...Captain goes down with the ship\n' + "During this battle,you have destroyed '+parseInt(destroyedshipsbyuser) +' of your enemy's warships.";
      let audio = new Audio('../audio/The Enemy Team is taking the lead.mp3');
      setTimeout(() => { audio.play(); }, 3500);
      restart.style.display = "block;";
      GameOver();
    }
  }

  let informations = document.querySelector('.info-hide');

  console.log(Infos);
  //Functie ce opreste instanta curenta a jocului
  function GameOver() {
    FinishedGame = true;
    informations.removeChild(Infos);
    informations.removeChild(Turns);
    StartButton.removeEventListener('click', Game());
    StartButton.disabled = true;
  }
})
