/// <reference types="@workadventure/iframe-api-typings" />

console.log("Script started successfully");

const saveButton = document.getElementById("inscrire") as HTMLButtonElement;

const firstName = document.getElementById("firstName") as HTMLInputElement;
const lastName = document.getElementById("lastName") as HTMLInputElement;
const phone = document.getElementById("phone") as HTMLInputElement;
const email = document.getElementById("email") as HTMLInputElement;
const age = document.getElementById("age") as HTMLInputElement;
const gender = document.getElementById("gender") as HTMLInputElement;
const searching = document.getElementById("searching") as HTMLInputElement;
const zone = WA.player.state.loadVariable("zone");

const indexPlayers = (WA.state.loadVariable("indexPlayers" + zone) as number) ?? 0;

WA.onInit()
  .then(() => {
    console.log("Zone:" + zone);

    saveButton.addEventListener("click", (e) => {
      if (firstName.value === "" || lastName.value === "" || email.value === "") {
        alert("Veuillez remplir les champs obligatoires");
      } else {
        alert("Inscription réussie");
        if (WA.player.tags.includes("pretendant")) {
          WA.state.saveVariable("pretendantInfos" + zone, {
            firstName: firstName.value,
            lastName: lastName.value,
            age: phone.value,
            gender: gender.value,
            searching: searching.value,
          });
          WA.player.state.status = true;
        } else {
          WA.player.state.firstName = firstName.value;
          WA.player.state.status = true;
          WA.player.state.lastName = lastName.value;
          WA.player.state.phone = phone.value;
          WA.player.state.email = email.value;
          WA.player.state.age = age.value;
          WA.player.state.gender = gender.value;
          WA.player.state.searching = searching.value;
          WA.player.state.id = indexPlayers;

          WA.state.saveVariable("players" + zone, {
            ...(WA.state.loadVariable("players" + zone) as Record<string, any>),
            [indexPlayers]: {
              firstName: WA.player.state.firstName,
              lastName: WA.player.state.lastName,
              age: WA.player.state.age,
              gender: WA.player.state.gender,
              searching: WA.player.state.searching,
              email: WA.player.state.email,
              phone: WA.player.state.phone,
            },
          });

          WA.state.saveVariable("indexPlayers" + zone, indexPlayers + 1);
          console.log(WA.state.players);
        }

        WA.controls.restorePlayerControls();
        e.preventDefault();
      }
    });
  })
  .catch((e) => console.error(e));

export {};
