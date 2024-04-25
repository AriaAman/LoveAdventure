/// <reference types="@workadventure/iframe-api-typings" />

const departMinutes = 1
let temps = departMinutes * 5

const timerElement = document.getElementById("timer")

setInterval(() => {
  let minutes = parseInt(temps / 60, 10)
  let secondes = parseInt(temps % 60, 10)

  minutes = minutes < 10 ? "0" + minutes : minutes
  secondes = secondes < 10 ? "0" + secondes : secondes

  timerElement.innerText = `${minutes}:${secondes}`
  temps = temps <= 0 ? 0 : temps - 1
  console.log(temps);
  if(temps === 0) {
    console.log("Temps écoulé")
      WA.nav.goToRoom("#ejectZone")
  }
}, 1000)


