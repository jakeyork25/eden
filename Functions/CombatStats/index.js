import fs from 'fs';

function GetInfoFromTextFile (fileName, text) {
    var textArray = fs.readFileSync(`dndTextFiles/${fileName}.txt`).toString().split('\r\n');
    var inSection = false;
    for(var i = 0; i < textArray.length; i++) {
        if(textArray[i].includes("Languages")) inSection = true;
        if(inSection && textArray[i].includes(text)) return textArray[i].split(" - ")[1].split(", ");
    }
}

function GetArmorClass(invArray, dex) {
    let acStat = 10 + dex;
    if(invArray.includes('leather armor')) acStat = 11 + dex;
    else if(invArray.includes('scale mail')) acStat = 14 + Math.min(dex, 2);
    else if(invArray.includes('chain mail')) acStat = 16;

    if(invArray.includes('shield')) acStat += 2;
    return acStat;
}

function GetSpeed(race) {
    var textArray = fs.readFileSync(`dndTextFiles/raceInfo.txt`).toString().split('\r\n');
    var inSection = false;
    for(var i = 0; i < textArray.length; i++) {
        if(textArray[i].includes("Speeds")) inSection = true;
        if(inSection && textArray[i].includes(race)) return textArray[i].split(" - ")[1];
    }
}

function GetHitDice(clss) {
    var textArray = fs.readFileSync(`dndTextFiles/classInfo.txt`).toString().split('\r\n');
    var inSection = false;
    for(var i = 0; i < textArray.length; i++) {
        if(textArray[i].includes("Hitdie")) inSection = true;
        if(inSection && textArray[i].includes(clss)) return textArray[i].split(" - ")[1];
    }
}

function GetHitPointMax(hitDice, constit) {
    let hitDiceValue = parseInt(hitDice.substring(1));
    return hitDiceValue + parseInt(constit);
}

function PrintCombatStats(loadedImage, fontSmall, fontMedium, armorClass, initiative, speed, hitDice, hitPointMax) {
    loadedImage.print(fontMedium, 310, 192, armorClass);
    loadedImage.print(fontMedium, 386, 195, initiative);
    loadedImage.print(fontMedium, 453, 195, speed);
    loadedImage.print(fontSmall, 322, 410, hitDice);
    loadedImage.print(fontSmall, 382, 252, hitPointMax);
    loadedImage.print(fontMedium, 380, 285, hitPointMax); //Current health
}

export { GetArmorClass, GetSpeed, GetHitDice, GetHitPointMax, PrintCombatStats };