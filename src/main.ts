/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");

let currentPopup: any = undefined;
let formWebsite: any = undefined;
let timer: any = undefined;

WA.onInit()
  .then(async () => {
    await WA.players.configureTracking();
    console.log("tags= " + WA.player.tags);

    WA.event.on("teleport-event").subscribe((event) => {
      console.log("Event received", event.data);
      WA.nav.goToRoom("#ejectZone");
    });

    WA.ui.onRemotePlayerClicked.subscribe((remotePlayer) => {
      console.log("Le joueur distant a été cliqué:", remotePlayer);

      remotePlayer.addAction("Kick", () => {
        remotePlayer.sendEvent("teleport-event", "my payload");
      });
    });

    //WA.player.state.saveVariable("id", 2);
    WA.player.state.saveVariable("status", false);

    WA.room.area.onEnter("registrationArea").subscribe(async () => {
      registration();
    });

    WA.room.area.onEnter("to-date1").subscribe(() => {
      if (WA.state.loadVariable("validatedIndex1") === WA.player.state.loadVariable("id")) {
        WA.nav.goToRoom("#from-queue1");
      }
    });

    WA.room.area.onEnter("displayPretendantInfosForPretendant1").subscribe(() => {
      const pretendantInfos1 = WA.state.loadVariable("pretendantInfos1");
      if (
        !WA.player.tags.includes("pretendant") ||
        (pretendantInfos1 && typeof pretendantInfos1 === "object" && Object.keys(pretendantInfos1).length !== 0)
      ) {
        console.log("Not a pretendant or already registered");
        return;
      }
      try {
        currentPopup = WA.ui.openPopup(
          "displayPretendantInfosPopup1",
          displayNotes(WA.state.loadVariable("pretendantInfos1") as any),
          []
        );
      } catch (e) {
        currentPopup = WA.ui.openPopup("displayPretendantInfosPopup1", "Infos pas encore disponibles", [
          {
            label: "Inscription",
            className: "primary",
            callback: async () => {
              registration();
            },
          },
        ]);
      }
    });

    WA.room.area.onEnter("displayPretendantInfos1").subscribe(() => {
      console.log(WA.state.loadVariable("players1"));

      try {
        currentPopup = WA.ui.openPopup(
          "displayPretendantInfosPopup1",
          displayNotes(WA.state.loadVariable("pretendantInfos1") as any),
          []
        );
      } catch (e) {
        currentPopup = WA.ui.openPopup("displayPretendantInfosPopup1", "Infos pas encore disponibles", []);
      }
    });

    WA.room.area.onLeave("displayPretendantInfos1").subscribe(closePopup);

    WA.room.area.onLeave("registrationArea").subscribe(() => {
      formWebsite.close();
    });

    WA.room.area.onLeave("displayPretendantInfos1").subscribe(() => {
      formWebsite.close();
    });

    WA.room.area.onEnter("door-enter1").subscribe(async () => {
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

    WA.room.area.onLeave("door-enter1").subscribe(() => {
      timer.close();
    });

    WA.room.area.onEnter("showPlayer1").subscribe(() => {
      openPopup();
    });

    WA.room.area.onLeave("showPlayer1").subscribe(closePopup);

    bootstrapExtra()
      .then(() => {
        console.log("Scripting API Extra ready");
      })
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));

function closePopup() {
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
  console.log(
    WA.state.loadVariable("players1"),
    WA.state.loadVariable("index1"),
    WA.state.loadVariable("validatedIndex1"),
    WA.state.loadVariable("pretendantInfos1")
  );
  if (!WA.player.tags.includes("pretendant")) {
    return;
  }
  try {
    currentPopup = WA.ui.openPopup(
      "playersPopup1",

      displayNotes(WA.state.loadVariable("players1")[WA.state.loadVariable("index1") as any]),
      [
        {
          label: "Validation",
          className: "primary",
          callback: () => {
            WA.state.saveVariable("validatedIndex1", WA.state.loadVariable("index1"));

            const hasPlayers =
              typeof WA.state.loadVariable("players1") === "object" &&
              (WA.state.loadVariable("index1") as any) in (WA.state.players as any);

            if (hasPlayers) {
              const index = Number(WA.state.loadVariable("index1"));
              const playerName = WA.state.players[index].firstName + WA.state.players[index].lastName;
              WA.ui.openPopup("validatePlayerPopup1", `${playerName}, on y va !`, []);
            } else {
              WA.ui.openPopup("validatePlayerPopup1", "Il n'y a pas de prétendant(e)", []);
            }
          },
        },
        {
          label: "Suivant",
          className: "primary",
          callback: () => {
            closePopup();
            const index = WA.state.loadVariable("index1") as string | number;
            if (index in (WA.state.players as object)) {
              WA.state.saveVariable("index1", Number(index) + 1);
            }
            openPopup();
          },
        },
      ]
    );
  } catch (e) {
    currentPopup = WA.ui.openPopup("playersPopup1", "Il n'y a pas de prétendant(e)", []);
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

async function registration() {
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
  }
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export {};
