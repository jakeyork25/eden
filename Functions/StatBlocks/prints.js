function PrintModifiers (loadedImage, font, modifiedArray) {
    var modString;
    for(var i = 0; i < modifiedArray.length; i++) {
        modString = modifiedArray[i].toString();
        if(modifiedArray[i] > -1) modString = "+" + modString;
        loadedImage.print(font, 52, 200 + (i * 92), modString);
    }
}

function PrintSavings (loadedImage, font, arr, abilityModArray) {
    var startingY = 263;
    for(var i = 0; i < arr.length; i++) {
        var modValue = abilityModArray[i];
        var modString;
        if(arr[i] == 0) {
            modString = modValue.toString();
            if(modValue > -1) modString = "+" + modString;
            loadedImage.print(font, 149, startingY + (i * 18), modString);
        }
        else {
            modValue = modValue + 2;
            modString = modValue.toString();
            if(modValue > -1) modString = "+" + modString;
            loadedImage.print(font, 148, startingY + (i * 17.4), (modString).toString());
        }
    }
}

function PrintSkills (loadedImage, font, arr, modArr) {
    var startingY = 413;
    var yDiff = 17.4;
    var xPos = 147;
    var modValue;
    for(var i = 0; i < arr.length; i++) {      
        switch (i) {
            case 0: modValue = modArr[1]; break;
            case 1: modValue = modArr[4]; break;
            case 2: modValue = modArr[3]; break;
            case 3: modValue = modArr[0]; break;
            case 4: modValue = modArr[5]; break;
            case 5: modValue = modArr[3]; break;
            case 6: modValue = modArr[4]; break;
            case 7: modValue = modArr[5]; break;
            case 8: modValue = modArr[3]; break;
            case 9: modValue = modArr[4]; break;
            case 10: modValue = modArr[3]; break;
            case 11: modValue = modArr[4]; break;
            case 12: modValue = modArr[5]; break;
            case 13: modValue = modArr[5]; break;
            case 14: modValue = modArr[3]; break;
            case 15: modValue = modArr[1]; break;
            case 16: modValue = modArr[1]; break;
            case 17: modValue = modArr[4]; break;
        }
        var modString;
        if(arr[i] == 0) {
            modString = modValue.toString();
            if(modValue > -1) modString = "+" + modString;
            loadedImage.print(font, xPos, startingY + (i * yDiff), modString);
        }
        else {
            modValue = modValue + 2;
            modString = modValue.toString();
            if(modValue > -1) modString = "+" + modString;
            loadedImage.print(font, xPos, startingY + (i * yDiff), (modString).toString());
        }
    }
}

function PrintPassivePerception(loadedImage, font, perception) {
    var passivePer = 10 + parseInt(perception);
    loadedImage.print(font, 49, 766, passivePer.toString());
}

function PrintScores(loadedImage, font, scoreArray) {
    for(var i = 0; i < scoreArray.length; i++) {
        var x = 64;
        if(scoreArray[i] < 10) x = 69;
        loadedImage.print(font, x, 242 + (i * 92), scoreArray[i].toString());
    }
}

function PrintProficiencyBonus (loadedImage, font) {
    loadedImage.print(font, 130, 170, "+2");
}

export function PrintStatBlock (loadedImage, fontSmall, fontMedium, fontLarge, saves, skills, modifiedArray, scoreArray) {
    PrintModifiers(loadedImage, fontLarge, modifiedArray);
    PrintScores(loadedImage, fontMedium, scoreArray);
    PrintSavings(loadedImage, fontSmall, saves, modifiedArray);
    PrintSkills(loadedImage, fontSmall, skills, modifiedArray);
    PrintProficiencyBonus(loadedImage, fontMedium);
    PrintPassivePerception(loadedImage, fontMedium, skills[11]);
}