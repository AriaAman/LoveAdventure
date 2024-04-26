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
const indexPlayers1 = WA.state.loadVariable("indexPlayers1") ?? 0;

WA.onInit()
  .then(() => {
    console.log("Scripting API ready");
    console.log(WA.state.players);

    saveButton.addEventListener("click", (e) => {
      if (firstName.value === "" || lastName.value === "" || email.value === "") {
        alert("Veuillez remplir les champs obligatoires");
      } else {
        alert("Inscription réussie");
        if (WA.player.tags.includes("pretendant")) {
          WA.state.saveVariable("pretendantInfos1", {
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

          WA.state.saveVariable("players1", {
            ...(WA.state.loadVariable("players1") as Record<string, any>),
            [indexPlayers1]: {
              firstName: WA.player.state.firstName,
              lastName: WA.player.state.lastName,
              age: WA.player.state.age,
              gender: WA.player.state.gender,
              searching: WA.player.state.searching,
              email: WA.player.state.email,
              phone: WA.player.state.phone,
            },
          });

          WA.state.saveVariable("indexPlayers1", indexPlayers1 + 1);
          console.log(WA.state.players);
        }

        WA.controls.restorePlayerControls();
        e.preventDefault();
      }
    });
  })
  .catch((e) => console.error(e));

export {};
