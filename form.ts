/// <reference types="@workadventure/iframe-api-typings" />

import { closeForm } from "./src/main.ts";

console.log('Script started successfully');

const saveButton = document.getElementById("inscrire") as HTMLButtonElement;

const firstName = document.getElementById("firstName") as HTMLInputElement;
const lastName = document.getElementById("lastName") as HTMLInputElement;
const username = document.getElementById("username") as HTMLInputElement;
const phone = document.getElementById("phone") as HTMLInputElement;
const email = document.getElementById("email") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;


WA.onInit().then(() => {
    console.log('Scripting API ready');

    saveButton.addEventListener("click", (e) => {

        if (firstName.value === "" || lastName.value === "" || email.value === "" || password.value === "") {
            alert("Veuillez remplir les champs obligatoires");
        } else {
            alert("Inscription réussie");
            
            WA.player.state.id = Date.now() + Math.random();
            WA.player.state.status = true;
            WA.player.state.firstName = firstName.value;
            WA.player.state.lastName = lastName.value;
            WA.player.state.username = username.value;
            WA.player.state.phone = phone.value;
            WA.player.state.email = email.value;
            WA.player.state.password = password.value;
            alert(WA.player.state.id + " " + WA.player.state.firstName + " " + WA.player.state.lastName + " " + WA.player.state.username + " " + WA.player.state.phone + " " + WA.player.state.email + " " + WA.player.state.password);
            WA.controls.restorePlayerControls();
            e.preventDefault();
        }
    });

}).catch(e => console.error(e));

export {};