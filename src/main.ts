/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');
let currentPopup: any = undefined;
let formWebsite: any = undefined;
let timer: any = undefined;

let index: number = 0;
let players: any[] = [
    // {
    //     name: "WanHeda",
    //     age: "24",
    //     gender: "homme",
    //     searching: "femme",
    // },
    // {
    //     name: "John",
    //     age: "30",
    //     gender: "homme",
    //     searching: "femme",
    // },
    // {
    //     name: "Alice",
    //     age: "28",
    //     gender: "femme",
    //     searching: "homme",
    // },
    // {
    //     name: "Bob",
    //     age: "35",
    //     gender: "homme",
    //     searching: "femme",
    // },
    // {
    //     name: "Eve",
    //     age: "25",
    //     gender: "femme",
    //     searching: "homme",
    // },
    // {
    //     name: "Michael",
    //     age: "40",
    //     gender: "homme",
    //     searching: "femme",
    // },
    // {
    //     name: "Sophie",
    //     age: "22",
    //     gender: "femme",
    //     searching: "homme",
    // },
    // {
    //     name: "David",
    //     age: "27",
    //     gender: "homme",
    //     searching: "femme",
    // },
    // {
    //     name: "Emily",
    //     age: "32",
    //     gender: "femme",
    //     searching: "homme",
    // },
    {
        name: "Mark",
        age: "29",
        gender: "homme",
        searching: "femme",
    }
]

WA.onInit().then(() => {

    WA.room.area.onEnter("registrationArea").subscribe(async () => {        
        if(WA.player.state.status == false || WA.player.state.status == undefined){
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
                    if(WA.player.state.status){
                        formWebsite.close();
                        clearInterval(id);
                    }
                },1000);
        }
        else{
            console.log("Already registered");
        }
    });

    WA.room.area.onLeave("registrationArea").subscribe(() => {
        formWebsite.close();
    })

    WA.room.area.onEnter("door-enter").subscribe (async() => {
        console.log("Event received", WA.player.state.id + " " + WA.player.state.firstName + " " + WA.player.state.lastName + " " + WA.player.state.username + " " + WA.player.state.phone + " " + WA.player.state.email + " " + WA.player.state.password);
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
    })

    //code Nicolas
    WA.room.area.onEnter('showPlayer').subscribe(openPopup)
    WA.room.area.onEnter('validatePlayer').subscribe(() => {
        const hasPlayers = Array.isArray(players) && players.length > 0;
        const isValidIndex = index >= 0 && index < players.length;
        
        if (hasPlayers && isValidIndex) {
            const playerName = players[index].name;
            WA.ui.openPopup("validatePlayerPopup", `${playerName}, on y va !`, []);
        }
    })
    WA.room.area.onEnter('nextPlayer').subscribe(() => {
        closePopup()
        index = index + 1;
        openPopup()
    })

    WA.room.area.onLeave('showPlayer').subscribe(closePopup)
    //fin code nicolas
    
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
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

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

function openPopup() {
    try {
        currentPopup = WA.ui.openPopup("playersPopup", displayNotes(players[index]), []);
    } catch (e) {
        currentPopup = WA.ui.openPopup("playersPopup", "Il n'y a pas de prétendant(e)", []);
    }
}

function displayNotes(player: {name: string, age: string, gender: string, searching: string}){
    return player.name + ", " + player.age + " ans\n" + player.gender.capitalize() + " cherche " + player.searching
}




export {};
