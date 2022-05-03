import fs, { readlink } from 'fs';
import Jimp from 'jimp';
import puppeteerExtra from 'puppeteer-extra';
import stealthPluggin from 'puppeteer-extra-plugin-stealth';

const randomInt = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const ChooseRandomText = (fileName) => {
    var options = fs.readFileSync(`dndTextFiles/${fileName}.txt`).toString();
    let optionArray = options.split("\n");
    let index = randomInt(0, optionArray.length - 1);
    return optionArray[index];
}

function ChooseRandomTextWithTitles (fileName, title) {
    var text = fs.readFileSync(`dndTextFiles/${fileName}.txt`).toString();
    let textArray = text.split("\n");
    let titleArray = [];
    var startIndex;
    var endIndex;
    for(var i = 0; i < textArray.length; i++) {
        var textLine = textArray[i];
        if(textLine.includes("-")) titleArray.push(textLine);
    }
    for(var i = 0; i < titleArray.length; i++) {
        if(titleArray[i].includes(title)) {
            startIndex = textArray.indexOf(titleArray[i]) + 1;
            endIndex = textArray.indexOf(titleArray[i + 1]);
        }
    }
    return textArray[randomInt(startIndex, endIndex)];
}

const RemoveMinFromArray = (arr) => {
    const min = Math.min(...arr);
    const index = arr.indexOf(min);
    
    return arr.filter((_, i) => i !== index);
}

const RemoveValueFromArray = (value, arr) => {
    var index = arr.indexOf(value); 
    return arr.filter((_, i) => i !== index);
}

const FindLargestValue = (arr) => {
    var largest = 0;
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] > largest) largest = arr[i];
    }
    return largest;
}

const SetScoreArray = (arr, largest, largestIndex, next, nextIndex) => {
    var finalArr = [];
    var loopLength = arr.length + 2;
    for(var i = 0; i < loopLength; i++) {
        if(i == largestIndex) {
            finalArr.push(largest)
        } else if(i == nextIndex) {
            finalArr.push(next);
        } else {
            var randomIndex = randomInt(0, arr.length - 1);
            var randomValue = arr[randomIndex];
            arr = RemoveValueFromArray(randomValue, arr);
            finalArr.push(randomValue);
        }
    }
    return finalArr;
}

const UpdateScoreArray = (scoreArr, increaseArr) => {
    for(var i = 0; i < scoreArr.length; i++) {
        scoreArr[i] = scoreArr[i] + increaseArr[i];
    }
    return scoreArr;
}

const CreateHalfElfArray = () => {
    var arr = [0, 0, 0, 0, 0, 2];
    var index1 = randomInt(0, 4);
    var index2 = randomInt(0, 4);
    while(index2 == index1) {
        index2 = randomInt(0, 4);
    }
    arr[index1] = 1;
    arr[index2] = 1;
    return arr;
}

const GetScoreArray = (clss, race) => {
    let scoreArray = [];
    let randArray = [];
    let largest = 0;
    let nextLargest = 0;
    for(var i = 0; i < 6; i++) {
        var rollArray = [];
        for(var j = 0; j < 4; j++) {
            rollArray.push(randomInt(1, 6));
        }
        rollArray = RemoveMinFromArray(rollArray);  
        var rollSum = rollArray.reduce((partialSum, a) => partialSum + a, 0);
        randArray.push(rollSum);
    }
    largest = FindLargestValue(randArray);
    randArray = RemoveValueFromArray(largest, randArray);
    nextLargest = FindLargestValue(randArray);
    randArray = RemoveValueFromArray(nextLargest, randArray);
    switch (clss) {
        case "Barbarian": scoreArray = SetScoreArray(randArray, largest, 0, nextLargest, 2); break;
        case "Bard": scoreArray = SetScoreArray(randArray, largest, 5, nextLargest, 1); break;
        case "Cleric": scoreArray = SetScoreArray(randArray, largest, 4, nextLargest, 0); break;
        case "Druid": scoreArray = SetScoreArray(randArray, largest, 4, nextLargest, 2); break;
        case "Fighter": scoreArray = SetScoreArray(randArray, largest, 1, nextLargest, 3); break;
        case "Monk": scoreArray = SetScoreArray(randArray, largest, 1, nextLargest, 4); break;
        case "Paladin": scoreArray = SetScoreArray(randArray, largest, 0, nextLargest, 5); break;
        case "Ranger": scoreArray = SetScoreArray(randArray, largest, 1, nextLargest, 4); break;
        case "Rogue": scoreArray = SetScoreArray(randArray, largest, 1, nextLargest, 3); break;
        case "Sorcerer": scoreArray = SetScoreArray(randArray, largest, 5, nextLargest, 2); break;
        case "Warlock": scoreArray = SetScoreArray(randArray, largest, 5, nextLargest, 2); break;
        case "Wizard": scoreArray = SetScoreArray(randArray, largest, 2, nextLargest, 5); break;
        default: console.log("Unexpected class type " + clss);
            break;
    }



    switch (race) {
        case "Dragonborn": scoreArray = UpdateScoreArray(scoreArray, [2, 0, 0, 0, 0, 1]); break;
        case "Dwarf": scoreArray = UpdateScoreArray(scoreArray, [0, 0, 2, 0, 0, 0]); break;
        case "Elf": scoreArray = UpdateScoreArray(scoreArray, [0, 2, 0, 0, 0, 0]); break;
        case "Gnome": scoreArray = UpdateScoreArray(scoreArray, [0, 0, 0, 2, 0, 0]); break;
        case "Half-elf": scoreArray = UpdateScoreArray(scoreArray, CreateHalfElfArray()); break;
        case "Halfling": scoreArray = UpdateScoreArray(scoreArray, [0, 2, 0, 0, 0, 0]); break;
        case "Half-orc": scoreArray = UpdateScoreArray(scoreArray, [2, 0, 1, 0, 0, 0]); break;
        case "Human": scoreArray = UpdateScoreArray(scoreArray, [1, 1, 1, 1, 1, 1]); break;
        case "Tiefling": scoreArray = UpdateScoreArray(scoreArray, [0, 0, 0, 1, 0, 2]); break;
        default: console.log("Unexpected race type " + clss);
            break;
    }
    return scoreArray
}

const GetAbilityModArray = (scoreArr) => {
    let abilityModArray = [];
    for(var i = 0; i < scoreArr.length; i++) {
        var score = scoreArr[i];
        var mod = Math.round((score - 10)/2 - .1);
        if(mod == -0) mod = 0;
        abilityModArray.push(mod)
    }
    return abilityModArray;
}

const GetTextFileIndex = (fileName, text) => {
    var options = fs.readFileSync(`dndTextFiles/${fileName}.txt`).toString();
    let optionArray = options.split("\n");
    return optionArray.indexOf(text);
}

const GetSavingProf = (clss) => {
    let index = GetTextFileIndex('classes', clss);
    let profArr = [];
    switch (index) {
        case 0: profArr = [1, 0, 1, 0, 0, 0]; break;
        case 1: profArr = [0, 1, 0, 0, 0, 1]; break;
        case 2: profArr = [0, 0, 0, 0, 1, 1]; break;
        case 3: profArr = [0, 0, 0, 1, 1, 0]; break;
        case 4: profArr = [1, 0, 1, 0, 0, 0]; break;
        case 5: profArr = [1, 1, 0, 0, 0, 0]; break;
        case 6: profArr = [0, 0, 0, 0, 1, 1]; break;
        case 7: profArr = [1, 1, 0, 0, 0, 0]; break;
        case 8: profArr = [0, 1, 0, 0, 1, 0]; break;
        case 9: profArr = [0, 0, 1, 0, 0, 1]; break;
        case 10: profArr = [0, 0, 0, 0, 1, 1]; break;
        case 11: profArr = [0, 0, 0, 1, 1, 0]; break;
    }
    return profArr;
}

const GetSkillIndexes = (arr, amount) => {
    var indexArr = [];
    for(var i = 0; i < amount; i++) {
        var option = randomInt(0, arr.length - 1);
        while(indexArr.includes(option)) {
            option = randomInt(0, arr.length - 1);
        }
        indexArr.push(option);
    }
    return indexArr;
}

const MergeArrays = (mainArr, addArr) => {
    for(var i = 0; i < addArr.length; i++) {
        mainArr.push(addArr[i]);
    }
    return mainArr;
}

const FilterArray = (mainArr, subArr) => {
    for(var i = 0; i < subArr.length; i++) {
        mainArr = mainArr.filter(function(item) {
            return item !== subArr[i]
        })
    }
    return mainArr;
}

const GetSkills = (clss, background) => {
    let classIndex = GetTextFileIndex('classes', clss);
    let bgIndex = GetTextFileIndex('background', background);
    let bgSkills;
    let skillIndexes = [];
    switch (bgIndex) {
        case 0: bgSkills = [6, 14]; break;
        case 1: bgSkills = [4, 15]; break;
        case 2: bgSkills = [4, 16]; break;
        case 3: bgSkills = [0, 12]; break;
        case 4: bgSkills = [1, 17]; break;
        case 5: bgSkills = [6, 13]; break;
        case 6: bgSkills = [9, 14]; break;
        case 7: bgSkills = [5, 13]; break;
        case 8: bgSkills = [3, 17]; break;
        case 9: bgSkills = [2, 5]; break;
        case 10: bgSkills = [3, 11]; break;
        case 11: bgSkills = [3, 7]; break;
        case 12: bgSkills = [15, 16]; break;
    }
    switch (classIndex) {
        case 0: skillIndexes = GetSkillIndexes(FilterArray([1, 3, 7, 10, 11, 17], bgSkills), 2); break;
        case 1: skillIndexes = GetSkillIndexes(FilterArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], bgSkills), 3); break;
        case 2: skillIndexes = GetSkillIndexes(FilterArray([5, 6, 9, 13, 14], bgSkills), 2); break;
        case 3: skillIndexes = GetSkillIndexes(FilterArray([1, 2, 6, 9, 10, 11, 14, 17], bgSkills), 2); break;
        case 4: skillIndexes = GetSkillIndexes(FilterArray([0, 1, 3, 5, 6, 7, 11, 17], bgSkills), 2); break;
        case 5: skillIndexes = GetSkillIndexes(FilterArray([0, 3, 5, 6, 14, 16], bgSkills), 2); break;
        case 6: skillIndexes = GetSkillIndexes(FilterArray([3, 6, 7, 9, 13, 14], bgSkills), 2); break;
        case 7: skillIndexes = GetSkillIndexes(FilterArray([1, 3, 6, 8, 10, 11, 16, 17], bgSkills), 3); break;
        case 8: skillIndexes = GetSkillIndexes(FilterArray([0, 3, 4, 6, 7, 8, 11, 12, 13, 15, 16], bgSkills), 4); break;
        case 9: skillIndexes = GetSkillIndexes(FilterArray([2, 4, 6, 7, 13, 14], bgSkills), 2); break;
        case 10: skillIndexes = GetSkillIndexes(FilterArray([2, 4, 5, 7, 8, 10, 14], bgSkills), 2); break;
        case 11: skillIndexes = GetSkillIndexes(FilterArray([2, 5, 6, 8, 9, 14], bgSkills), 2); break;
    }

    skillIndexes = MergeArrays(skillIndexes, bgSkills);

    let skillArray = [];
    for(var i = 0; i < 18; i++) {
        if(skillIndexes.includes(i)) skillArray.push(1);
        else skillArray.push(0);
    }
    return skillArray;
}

const GenerateName = async () => {
    puppeteerExtra.use(stealthPluggin());
    const browser = await puppeteerExtra.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto('https://www.behindthename.com/random/');
    const mythButton = await page.$('input[id="usage-myth"]');
    await mythButton.click();
    const anciButton = await page.$('input[id="usage-anci"]');
    await anciButton.click();
    const fntsyButton = await page.$('input[id="usage-fntsy"]');
    await fntsyButton.click();
    const [submitButton] = await page.$x('//center/form/div[1]/input');
    await submitButton.click();
    await page.waitForXPath('//div[@class="random-results"]/a');
    var [nameDiv] = await page.$x('//div[@class="random-results"]/a');
    var name = await nameDiv.evaluate(el => el.textContent);
    browser.close();
    return name;
}

function Write32Font (abilityModArray) {
    var loadedImage;
    Jimp.read('images/dnd.png')
        .then(function (image) {
            loadedImage = image;
            return Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        })
        .then(function (font) {
            var modString;
            for(var i = 0; i < abilityModArray.length; i++) {
                modString = abilityModArray[i].toString();
                if(abilityModArray[i] > -1) modString = "+" + modString;
                loadedImage.print(font, 52, 200 + (i * 92), modString);
            }
            loadedImage.write('images/32font.png');
        })
        .catch(function (err) {
            console.error(err);
        });
}

function Write16Font (race, clss, alignment, background, skills, abilityModArray, scoreArray) {
    var loadedImage;
    Jimp.read('images/32font.png')
        .then(function (image) {
            loadedImage = image;
            return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
        })
        .then(function (font) {
            loadedImage.print(font, 500, 63, race);
            loadedImage.print(font, 355, 63, clss);
            loadedImage.print(font, 500, 96, alignment);
            loadedImage.print(font, 640, 96, background);
            loadedImage.print(font, 130, 220, "+2"); //Proficiency bonus
            PrintScores(loadedImage, font, scoreArray);
            PrintPassivePerception(loadedImage, font, skills[11], abilityModArray);
            loadedImage.write('images/16font.png');
        })
        .catch(function (err) {
            console.error(err);
        });
}

function PrintSavings (loadedImage, font, startingY, arr, abilityModArray) {
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

function PrintPassivePerception(loadedImage, font, perception, modArr) {
    var modValue = modArr[4];
    if(perception == 1) modValue = modValue + 2;
    loadedImage.print(font, 49, 766, modValue.toString());
}

const GetExtraProfs = (profText) => {
    var extraArr = [];
    let fileName = profText.substring(2);
    let extra = ChooseRandomText(fileName);
    for(var i = 0; i < parseInt(profText[1]); i++) {
        while(extraArr.includes(extra)) {
            extra = ChooseRandomText(fileName);
        }
        extraArr.push(extra);
    }
    return extraArr;
}

const PullTextLineAsArray = (fileName, text) => {
    var options = fs.readFileSync(`dndTextFiles/${fileName}.txt`).toString();
    let optionArray = options.split("\n");
    var lineString;
    for(var i = 0; i < optionArray.length; i++) {
        if(optionArray[i].includes(text)) {
            lineString = optionArray[i + 1];
        }
    }
    return lineString.split(", ");
}

function PrintProficiencies (loadedImage, font, clss, race, background) {
    let profArray = PullTextLineAsArray('classProfs', clss);
    let extraProfs = [];
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
    profArray = profArray.concat(extraProfs);
    let langArray = GetLanguages(race, background);
    profArray = profArray.concat(langArray);
    for(var i = 0; i < profArray.length; i++) {
        loadedImage.print(font, 48, 805.5 + (i * 14.2), profArray[i]);
    }
    
}

const GetLanguages = (race, background) => {
    let raceLangs = PullTextLineAsArray('raceLanguages', race);
    let bgLangs = PullTextLineAsArray('backgroundLanguages', background);
    let languageArray = raceLangs.concat(bgLangs);
    languageArray = ArrayRemove(languageArray, "None");
    for(var i = 0; i < languageArray.length; i++) {
        if(languageArray[i] == "Extra") {
            var lang = ChooseRandomText('languages');
            while(languageArray.includes(lang)) {
                lang = ChooseRandomText('languages');
            }
            languageArray[i] = lang;
        }
    }
    return languageArray;
}

const ArrayRemove = (arr, value) => {   
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

function GetInventoryArray(clss, background) {
    let invArray = PullTextLineAsArray('classEquipment', clss);
    let bgInvArray = PullTextLineAsArray('backgroundEquipment', background);
    invArray = MergeArrays(invArray, bgInvArray);
    console.log(invArray);
    for(var i = 0; i < invArray.length; i++) {
        var invenOptions = invArray[i];
        if(invenOptions.includes("/")) {
            var optionArray = invenOptions.split("/");
            var option = optionArray[randomInt(0, optionArray.length - 1)];
            invArray[i] = option;
        }
    }
    return invArray;
}


function PrintInventory(loadedImage, font, invArray) {
    let gold;
    let removeArray = [];
    let invArrayLength = invArray.length;
    for(var i = 0; i < invArrayLength; i++) {
        var invenText = invArray[i];
        if(invenText.includes("$")) {
            var amount = invenText[1];
            removeArray.push(invenText);
            var equipmentType = invenText.substring(2);
            for(var j = 0; j < amount; j++) {
                var equipment = ChooseRandomTextWithTitles('equipment', equipmentType);
                while(invArray.includes(equipment)) {
                    equipment = ChooseRandomTextWithTitles('equipment', equipmentType);
                }
                //console.log(equipment)
                if(equipment.includes('\r')) equipment = equipment.replace('\r', '');  
                
                if(equipment.includes('gp')) {
                    gold = equipment.substring(0, 2);
                    console.log("GPGPGPGPGPGP");
                }
                else invArray.push(equipment);
            }
        }
    }    
    for(var i = 0; i < removeArray.length; i++) {
        invArray = RemoveValueFromArray(removeArray[i], invArray);
    }
    for(var i = 0; i < invArray.length; i++) {
        loadedImage.print(font, 350, 764.5 + (i * 14.2), invArray[i]);
    }
}

function PrintScores(loadedImage, font, scoreArray) {
    for(var i = 0; i < scoreArray.length; i++) {
        var x = 64;
        if(scoreArray[i] < 10) x = 69;
        loadedImage.print(font, x, 242 + (i * 92), scoreArray[i].toString());
    }
}

const Write12Font = (race, clss, background, saves, skills, abilityModArray, invArray) => {
    var loadedImage;
    Jimp.read('images/16font.png')
        .then(function (image) {
            loadedImage = image;
            return Jimp.loadFont(Jimp.FONT_SANS_12_BLACK);
        })
        .then(function (font) {
            PrintSavings(loadedImage, font, 263, saves, abilityModArray);
            PrintSkills(loadedImage, font, skills, abilityModArray);
            PrintProficiencies(loadedImage, font, clss, race, background);
            PrintInventory(loadedImage, font, invArray);
            loadedImage.write('images/final.png');
        })
        .catch(function (err) {
            console.error(err);
        });
}

function GetArmorClass(invArray, dex) {
    let acStat = 10 + dex;
    if(invArray.includes('leather armor')) acStat = 11 + dex;
    else if(invArray.includes('scale mail')) acStat = 14 + Math.min(dex, 2);
    else if(invArray.includes('chain mail')) acStat = 16;

    if(invArray.includes('shield')) acStat += 2;
    return acStat;
}

function PrintCombatStats(invArray, dex) {

}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function Main() {
    let race = ChooseRandomText('races');
    let clss = ChooseRandomText('classes');
    let background = ChooseRandomText('background');
    let alignment = ChooseRandomText('alignments');
    let scoreArray = GetScoreArray(clss, race);
    let abilityModArray = GetAbilityModArray(scoreArray); 
    let saves = GetSavingProf(clss);
    let skills = GetSkills(clss, background);
    let invArray = GetInventoryArray(clss, background);
    Write32Font(abilityModArray);
    await sleep(200);
    Write16Font(race, clss, alignment, background, skills, abilityModArray, scoreArray);
    await sleep(200);
    Write12Font(race, clss, background, saves, skills, abilityModArray, invArray);
}

function Test() {
    let race = ChooseRandomText('races');
    let clss = ChooseRandomText('classes');
    let background = ChooseRandomText('background');
    let scoreArray = GetScoreArray(clss, race);
    let abilityModArray = GetAbilityModArray(scoreArray); 
    let invArray = GetInventoryArray(clss, background);
    let acStat = GetArmorClass(invArray, abilityModArray[1]);
    console.log(acStat)
}

Test();

