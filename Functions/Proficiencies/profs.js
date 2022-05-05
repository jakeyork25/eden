import fs from 'fs';

function randomInt (min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function GetExtraProfs (profText) {
    let title = '-' + profText.substring(2) + '-';
    var textArray = fs.readFileSync(`dndTextFiles/misc.txt`).toString().split('\r\n');
    let options = textArray[textArray.indexOf(title) + 1].split(', ');
    let extras = [];
    for(var i = 0; i < parseInt(profText[1]); i++) {
        var extra = options[randomInt(0, options.length - 1)];
        while(extras.includes(extra)) {
            extra = options[randomInt(0, options.length - 1)];
        }
        extras.push(extra);
    }
    return extras;
}

function GetProficiencyOptions (clss) {
    var textArray = fs.readFileSync(`dndTextFiles/classInfo.txt`).toString().split('\r\n');
    var inSection = false;
    for(var i = 0; i < textArray.length; i++) {
        if(textArray[i].includes("Proficiencies")) inSection = true;
        if(inSection && textArray[i].includes(clss)) return textArray[i].split(" - ")[1].split(", ");
    }
}

function CheckForProficiencyChoices (profArray) {
    let extraProfs = []
    for(var i = 0; i < profArray.length; i++) {
        var prof = profArray[i];
        if(prof.includes('/')){
            var extrasArr = prof.split('/');
            var extraText = extrasArr[randomInt(0, 1)];
            extraProfs = GetExtraProfs(extraText);
            profArray.splice(i, 1);
        } else if(prof.includes('x')) {
            extraProfs = GetExtraProfs(prof);
            profArray.splice(i, 1);
        }
    }
    return profArray;
}

export function GetProficiencies (clss) {
    let profs = GetProficiencyOptions(clss);
    profs = CheckForProficiencyChoices(profs);
    return profs;
}