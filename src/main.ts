/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");

let currentPopup: any = undefined;
let formWebsite: any = undefined;
let timer: any = undefined;

console.log("on vient de load !!!!!!!!!!!");

WA.onInit()
  .then(() => {
    WA.player.state.saveVariable("id", 1);
    WA.player.state.saveVariable("status", false);

    WA.room.area.onEnter("registrationArea").subscribe(async () => {
      console.log(WA.player.state.status);

      if (WA.player.state.status == false || WA.player.state.status == undefined) {
        WA.controls.disablePlayerControls();
        console.log("Entering visibleNote layer");

        formWebsite = await WA.ui.website.open({
          url: "./form.html",
          position: {
            vertical: "top",
            horizontal: "middle",
          },
          size: {
            height: "60vh",
            width: "50vw",
          },
          margin: {
            top: "10vh",
          },
          allowApi: true,
        });

        var id = setInterval(() => {
          if (WA.player.state.status) {
            formWebsite.close();
            clearInterval(id);
          }
        }, 1000);
      } else {
        console.log("Already registered");
      }
    });

    WA.room.area.onEnter("to-date").subscribe(() => {
      if (WA.state.loadVariable("validatedIndex") === WA.player.state.loadVariable("id")) {
        WA.nav.goToRoom("#from-queue");
      }
    });

    WA.room.area.onLeave("registrationArea").subscribe(() => {
      formWebsite.close();
    });

    WA.room.area.onEnter("door-enter").subscribe(async () => {
      console.log(
        "Event received",
        WA.player.state.id +
          " " +
          WA.player.state.firstName +
          " " +
          WA.player.state.lastName +
          " " +
          WA.player.state.username +
          " " +
          WA.player.state.phone +
          " " +
          WA.player.state.email +
          " " +
          WA.player.state.password
      );
      console.log("Entering dateZone layer");
      timer = await WA.ui.website.open({
        url: "./timer.html",
        position: {
          vertical: "top",
          horizontal: "middle",
        },
        size: {
          height: "5vh",
          width: "10vw",
        },
        margin: {
          top: "8vh",
          left: "15vw",
        },
        allowApi: true,
      });
    });

    WA.room.area.onLeave("door-enter").subscribe(() => {
      timer.close();
    });

    WA.room.area.onEnter("showPlayer").subscribe(openPopup);
    WA.room.area.onLeave("showPlayer").subscribe(closePopup);

    bootstrapExtra()
      .then(() => {
        console.log("Scripting API Extra ready");
      })
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));

function closePopup() {
  console.log(WA.player.state.loadVariable("id"), WA.state.loadVariable("validatedIndex"));

  if (currentPopup !== undefined) {
    currentPopup.close();
    currentPopup = undefined;
  }
}

declare global {
  interface String {
    capitalize(): string;
  }
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function openPopup() {
  try {
    currentPopup = WA.ui.openPopup(
      "playersPopup",
      displayNotes(WA.state.loadVariable("players")[WA.state.loadVariable("index")]),
      [
        {
          label: "Validation",
          className: "primary",
          callback: () => {
            WA.state.saveVariable("validatedIndex", WA.state.loadVariable("index"));

            const hasPlayers =
              typeof WA.state.loadVariable("players") === "object" &&
              WA.state.loadVariable("index") in WA.state.players;

            if (hasPlayers) {
              const playerName =
                WA.state.players[WA.state.loadVariable("index")].firstName +
                WA.state.players[WA.state.loadVariable("index")].lastName;
              WA.ui.openPopup("validatePlayerPopup", `${playerName}, on y va !`, []);
            } else {
              WA.ui.openPopup("validatePlayerPopup", "Il n'y a pas de prétendant(e)", []);
            }
          },
        },
        {
          label: "Suivant",
          className: "primary",
          callback: () => {
            closePopup();
            if (WA.state.loadVariable("index") in WA.state.players) {
              WA.state.saveVariable("index", WA.state.loadVariable("index") + 1);
            }
            openPopup();
          },
        },
      ]
    );
  } catch (e) {
    currentPopup = WA.ui.openPopup("playersPopup", "Il n'y a pas de prétendant(e)", []);
  }
}

function displayNotes(player: { firstName: string; lastName: string; age: string; gender: string; searching: string }) {
  return (
    player.firstName +
    player.lastName +
    ", " +
    player.age +
    " ans\n" +
    player.gender.capitalize() +
    " cherche " +
    player.searching
  );
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export {};
