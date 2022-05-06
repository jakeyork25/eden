import Jimp from 'jimp';
// import puppeteerExtra from 'puppeteer-extra';
// import stealthPluggin from 'puppeteer-extra-plugin-stealth';

import { ChooseRandomText, PrintBasics } from './Functions/Basics/index.js';
import { GetScores, GetModifiers, GetSaves, GetSkills, PrintStatBlock } from './Functions/StatBlocks/index.js';
import { GetLanguages, GetProficiencies, PrintProficiencies } from './Functions/Proficiencies/index.js'; 
import { GetEquipment, PrintEquipment } from './Functions/Equipment/index.js';
import { GetArmorClass, GetSpeed, GetHitDice, GetHitPointMax, PrintCombatStats } from './Functions/CombatStats/index.js';
import { GetWeapons, GetWeaponInfo, CheckProficiency, GetAttackModifier, PrintAttackStats } from './Functions/Attacks/index.js';

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

async function Main() {
    let loadedImage = await Jimp.read('images/dnd.png');
    let fontSmall = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK);
    let fontMedium = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    let fontLarge = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

    let race = ChooseRandomText('raceInfo');
    let clss = ChooseRandomText('classInfo');
    let background = ChooseRandomText('backgroundInfo');
    let alignment = ChooseRandomText('misc');
    PrintBasics(loadedImage, fontMedium, race, clss, background, alignment);

    let scores = GetScores(clss, race);
    let modifiers = GetModifiers(scores);
    let saves = GetSaves(clss);
    let skills = GetSkills(clss, background);
    PrintStatBlock(loadedImage, fontSmall, fontMedium, fontLarge, saves, skills, modifiers, scores);

    let languages = GetLanguages(race, background);
    let proficiencies = GetProficiencies(clss);
    PrintProficiencies(loadedImage, fontSmall, proficiencies.concat(languages));

    let equipment = GetEquipment(clss, background);
    PrintEquipment(loadedImage, fontSmall, fontMedium, equipment);

    let armorClass = GetArmorClass(equipment, modifiers[1]);
    let speed = GetSpeed(race);
    let hitDice = GetHitDice(clss);
    let hitPointMax = GetHitPointMax(hitDice, modifiers[2]);
    PrintCombatStats(loadedImage, fontSmall, fontMedium, armorClass, modifiers[1], speed, hitDice, hitPointMax);

    let weapons = GetWeapons(equipment);
    let weaponInfoList = GetWeaponInfo(weapons);
    let profBools = CheckProficiency(weapons, proficiencies);
    let attackModifiers = GetAttackModifier(weaponInfoList, modifiers[0], modifiers[1], profBools);
    console.log(attackModifiers);
    
    loadedImage.write('images/final.png');
}

Main();