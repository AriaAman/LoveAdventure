/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");

let currentPopup: any = undefined;
let formWebsite: any = undefined;
let timer: any = undefined;

WA.onInit()
  .then(async () => {
    console.log(WA.state.loadVariable("pretendantInfos" + 1));
    console.log(WA.state.loadVariable("pretendantInfos" + 2));
    console.log(WA.state.loadVariable("pretendantInfos" + 3));
    console.log(WA.state.loadVariable("pretendantInfos" + 4));

    //code pour toutes les zones de rencontre
    await WA.players.configureTracking();
    WA.event.on("teleport-event").subscribe(() => {
      WA.nav.goToRoom("#ejectZone");
    });

    WA.ui.onRemotePlayerClicked.subscribe((remotePlayer) => {
      remotePlayer.addAction("Kick", () => {
        remotePlayer.sendEvent("teleport-event", "my payload");
      });
    });

    WA.player.state.saveVariable("status", false);

    WA.event.on("showValidatedPlayer").subscribe((event) => {
      const eventData: any = event.data;
      const playerName: string = eventData.playerName;
      const salle: string = eventData.salle;

      WA.ui.openPopup("validatePlayerPopup", `${playerName}, on y va ${salle}!`, []);
    });

    //code pour zone 1
    zone("1");
    zone("2");

    //fonction pour les zones
    function zone(zone: string) {
      WA.room.area.onEnter("to-date" + zone).subscribe(() => {
        if (WA.state.loadVariable("validatedIndex" + zone) === WA.player.state.loadVariable("id")) {
          WA.nav.goToRoom("#from-queue" + zone);
        }
      });

      WA.room.area.onEnter("reset").subscribe(() => {
        WA.state.saveVariable("pretendantInfos" + zone, {});
      });

      WA.room.area.onEnter("displayPretendantInfosForPretendant" + zone).subscribe(() => {
        const pretendantInfos1 = WA.state.loadVariable("pretendantInfos" + zone);
        if (
          !WA.player.tags.includes("pretendant") ||
          (pretendantInfos1 && typeof pretendantInfos1 === "object" && Object.keys(pretendantInfos1).length !== 0)
        ) {
          return;
        }
        try {
          currentPopup = WA.ui.openPopup(
            "displayPretendantInfosPopup" + zone,
            displayNotes(WA.state.loadVariable("pretendantInfos" + zone) as any),
            []
          );
        } catch (e) {
          currentPopup = WA.ui.openPopup("displayPretendantInfosPopup" + zone, "Infos pas encore disponibles", [
            {
              label: "Inscription",
              className: "primary",
              callback: async () => {
                registration(zone);
              },
            },
          ]);
        }
      });

      WA.room.area.onLeave("displayPretendantInfosForPretendant" + zone).subscribe(closePopup);

      WA.room.area.onEnter("displayPretendantInfos" + zone).subscribe(() => {
        try {
          if (WA.player.state.status == false || WA.player.state.status == undefined) {
            currentPopup = WA.ui.openPopup(
              "displayPretendantInfosPopup" + zone,
              displayNotes(WA.state.loadVariable("pretendantInfos" + zone) as any),
              [
                {
                  label: "Inscription salle " + zone,
                  className: "primary",
                  callback: async () => {
                    registration(zone);
                  },
                },
              ]
            );
          } else {
            currentPopup = WA.ui.openPopup(
              "displayPretendantInfosPopup" + zone,
              displayNotes(WA.state.loadVariable("pretendantInfos" + zone) as any),
              []
            );
          }
        } catch (e) {
          currentPopup = WA.ui.openPopup("displayPretendantInfosPopup" + zone, "Infos pas encore disponibles", []);
        }
      });

      WA.room.area.onLeave("displayPretendantInfos" + zone).subscribe(closePopup);

      WA.room.area.onLeave("displayPretendantInfos" + zone).subscribe(() => {
        formWebsite.close();
      });

      WA.room.area.onLeave("displayPretendantInfos" + zone).subscribe(() => {
        formWebsite.close();
      });

      WA.room.area.onEnter("door-enter" + zone).subscribe(async () => {
        if (WA.player.tags.includes("pretendant")) {
          return;
        }
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
            top: "25vh",
            left: "15vw",
          },
          allowApi: true,
        });
      });

      WA.room.area.onLeave("door-enter" + zone).subscribe(() => {
        timer.close();
      });

      WA.room.area.onEnter("showPlayer" + zone).subscribe(() => {
        openPopup(zone);
      });

      WA.room.area.onLeave("showPlayer" + zone).subscribe(closePopup);
    }

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

function openPopup(zone: string) {
  if (!WA.player.tags.includes("pretendant")) {
    return;
  }
  try {
    const players = WA.state.loadVariable("players" + zone);
    const index = (WA.state.loadVariable("index" + zone) as number) ?? 0;

    currentPopup = WA.ui.openPopup(
      "playersPopup" + zone,

      displayNotes(players[index]),
      [
        {
          label: "Validation",
          className: "primary",
          callback: () => {
            WA.state.saveVariable("validatedIndex" + zone, index);
            const hasPlayers =
              typeof players === "object" && players !== null && Object.prototype.hasOwnProperty.call(players, index);

            if (hasPlayers) {
              const players = WA.state.loadVariable("players" + zone);
              const index = (WA.state.loadVariable("index" + zone) as number) ?? 0;
              const playerName = players[index].firstName + players[index].lastName;
              WA.event.broadcast("showValidatedPlayer", { playerName: playerName, salle: "salle " + zone });
            }
          },
        },
        {
          label: "Suivant",
          className: "primary",
          callback: () => {
            closePopup();
            if (index in (players as object)) {
              WA.state.saveVariable("index" + zone, Number(index) + 1);
            }
            openPopup(zone);
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
    " " +
    player.lastName +
    ", " +
    player.age +
    " ans\n" +
    player.gender.capitalize() +
    " cherche " +
    player.searching
  );
}

async function registration(zone: string) {
  if (WA.player.state.status == false || WA.player.state.status == undefined) {
    WA.controls.disablePlayerControls();
    WA.player.state.saveVariable("zone", zone);

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
