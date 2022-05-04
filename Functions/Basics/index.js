import fs from 'fs';
import { PrintBasics } from './prints.js';

function randomInt (min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function ChooseRandomText (fileName) {
    var options = fs.readFileSync(`dndTextFiles/${fileName}.txt`).toString();
    let optionArray = options.split("\n")[0].split(", ");
    return optionArray[randomInt(0, optionArray.length - 1)]
}

export { ChooseRandomText, PrintBasics };