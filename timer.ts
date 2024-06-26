/// <reference types="@workadventure/iframe-api-typings" />

const departMinutes = 1;
let temps = departMinutes * 5;

const timerElement = document.getElementById("timer");
console.log("timerElement", timerElement);
setInterval(() => {
  let minutes = parseInt(String(temps / 60), 10) as any;
  let secondes = parseInt(String(temps % 60), 10) as any;

  minutes = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
  secondes = secondes < 10 ? "0" + secondes.toString() : secondes.toString();

  if (timerElement !== null) {
    timerElement.innerText = `${minutes}:${secondes}`;
  }

  temps = temps <= 0 ? 0 : temps - 1;

  console.log(temps);
  }, 1000);

  var id = setInterval(() => {
    if (temps === 0) {
      console.log("Temps écoulé");
      clearInterval(id);
      WA.nav.goToRoom("#ejectZone");
    }
  }, 1000);