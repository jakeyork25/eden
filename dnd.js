import fs from 'fs';
import Jimp from 'jimp';
// import puppeteerExtra from 'puppeteer-extra';
// import stealthPluggin from 'puppeteer-extra-plugin-stealth';

import { ChooseRandomText, PrintBasics } from './Functions/Basics/index.js';
import { GetScores, GetModifiers, GetSaves, GetSkills } from './Functions/StatBlocks/index.js';
import { GetArmorClass, GetSpeed, GetHitDice, GetHitPointMax, PrintCombatStats } from './Functions/CombatStats/index.js';

const randomInt = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
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

const RemoveValueFromArray = (value, arr) => {
    var index = arr.indexOf(value); 
    return arr.filter((_, i) => i !== index);
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

function Write16Font (race, clss, alignment, background, skills, abilityModArray, scoreArray, invArray) {
    var loadedImage;
    Jimp.read('images/32font.png')
        .then(function (image) {
            loadedImage = image;
            return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
        })
        .then(function (font) {
            PrintScores(loadedImage, font, scoreArray);
            PrintPassivePerception(loadedImage, font, skills[11], abilityModArray);
            PrintCombatStats(loadedImage, font, invArray, abilityModArray[1], abilityModArray[2], race, clss)
            loadedImage.write('images/16font.png');
        })
        .catch(function (err) {
            console.error(err);
        });
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

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function Main() {
    // let race = ChooseRandomText('races');
    // let clss = ChooseRandomText('classes');
    // let background = ChooseRandomText('background');
    // let alignment = ChooseRandomText('alignments');
    // let scoreArray = GetScoreArray(clss, race);
    // let abilityModArray = GetAbilityModArray(scoreArray); 
    // let saves = GetSavingProf(clss);
    //let skills = GetSkills(clss, background);
    let invArray = GetInventoryArray(clss, background);
    Write32Font(abilityModArray);
    await sleep(200);
    Write16Font(race, clss, alignment, background, skills, abilityModArray, scoreArray, invArray);
    await sleep(200);
    Write12Font(race, clss, background, saves, skills, abilityModArray, invArray);
}

function Test() {
    let race = ChooseRandomText('raceInfo');
    let clss = ChooseRandomText('classInfo');
    let background = ChooseRandomText('backgroundInfo');
    let scores = GetScores(clss, race);
    let modifiers = GetModifiers(scores);
    let skills = GetSkills(clss, background);
    console.log(skills);
}

Test();