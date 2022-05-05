import fs from 'fs';

function randomInt (min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function GetLangOptions (fileName, text) {
    var textArray = fs.readFileSync(`dndTextFiles/${fileName}.txt`).toString().split('\r\n');
    var inSection = false;
    for(var i = 0; i < textArray.length; i++) {
        if(textArray[i].includes("Languages")) inSection = true;
        if(inSection && textArray[i].includes(text)) return textArray[i].split(" - ")[1].split(", ");
    }
}

function ChooseRandomLanguage () {
    var options = fs.readFileSync(`dndTextFiles/misc.txt`).toString();
    let optionArray = options.split("\r\n")[2].split(", ");
    return optionArray[randomInt(0, optionArray.length - 1)]
}

export function GetLanguages (race, background) {
    let languageArray = GetLangOptions('raceInfo', race);
    let bgLangs = GetLangOptions('backgroundInfo', background);
    for(var i = 0; i < parseInt(bgLangs); i++) {
        languageArray.push("Extra")
    }
    for(var i = 0; i < languageArray.length; i++) {
        if(languageArray[i] == "Extra") {
            var lang = ChooseRandomLanguage('languages');
            while(languageArray.includes(lang)) {
                lang = ChooseRandomLanguage('languages');
            }
            languageArray[i] = lang;
        }
    }
    return languageArray;
}