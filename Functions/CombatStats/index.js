function GetArmorClass(invArray, dex) {
    let acStat = 10 + dex;
    if(invArray.includes('leather armor')) acStat = 11 + dex;
    else if(invArray.includes('scale mail')) acStat = 14 + Math.min(dex, 2);
    else if(invArray.includes('chain mail')) acStat = 16;

    if(invArray.includes('shield')) acStat += 2;
    return acStat;
}

function GetSpeed(race) {
    var raceSpeeds = fs.readFileSync(`dndTextFiles/raceSpeeds.txt`).toString();
    var raceSpeedArray = raceSpeeds.split('\r\n');
    for(var i = 0; i < raceSpeedArray.length; i++) {
        if(raceSpeedArray[i].includes(race)) {
            return raceSpeedArray[i].split(" - ")[1];
        }
    }
}

function GetHitDice(clss) {
    var text = fs.readFileSync(`dndTextFiles/classHitdie.txt`).toString();
    var classHitdie = text.split('\r\n');
    for(var i = 0; i < classHitdie.length; i++) {
        if(classHitdie[i].includes(clss)) {
            return '1' + classHitdie[i].split(" - ")[1];
        }
    }
}

function GetHitPointMax(hitDice, constit) {
    let hitDiceValue = hitDice.substring(2);
    return hitDiceValue + constit;
}

function PrintCombatStats(loadedImage, font, invArray, dex, constit, race, clss) {
    let armorClass = GetArmorClass(invArray, dex);
    let initiative = dex;
    let speed = GetSpeed(race);
    let hitDice = GetHitDice(clss);
    let hitPointMax = GetHitPointMax(hitDice, constit);

    loadedImage.print(font, 250, 200, armorClass);
    loadedImage.print(font, 280, 200, initiative);
    loadedImage.print(font, 310, 200, speed);
    loadedImage.print(font, 200, 200, hitDice);
    loadedImage.print(font, 200, 200, hitPointMax);
    loadedImage.print(font, 200, 200, hitPointMax); //Current health
}

export { GetArmorClass, GetSpeed, GetHitDice, GetHitPointMax, PrintCombatStats };