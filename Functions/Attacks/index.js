import fs from 'fs';

function GetWeaponList () {
    let weaponList = [];
    var textArray = fs.readFileSync(`dndTextFiles/weapons.txt`).toString().split('\r\n');
    for(var i = 0; i < textArray.length; i++) {
        weaponList.push(textArray[i].split(' - ')[0]);
    }
    return weaponList;
}

function GetWeapons () {
    let equippedWeapons = [];
    let equipment = ['a pouch', 'two shortswords', 'common clothes', 'a longbow'];
    let weaponList = GetWeaponList();
    for(var i = 0; i < weaponList.length; i++) {
        var weapon = weaponList[i];
        for(var j = 0; j < equipment.length; j++) {
            if(equipment[j].includes(weapon.toLowerCase())) equippedWeapons.push(weapon);
        }
    }
    return equippedWeapons;
}

function GetWeaponInfo (weapon) {
    var textArray = fs.readFileSync(`dndTextFiles/weapons.txt`).toString().split('\r\n');
    for(var i = 0; i < textArray.length; i++) {
        if(textArray[i].includes(weapon)) return textArray[i].split(' - ')[1].split(', ');
    }
}

function CheckProficiency (weapon) {
    let profArray = ['Simple Weapons', 'Common'];
    var textArray = fs.readFileSync(`dndTextFiles/misc.txt`).toString().split('\r\n');
    for(var i = 0; i < profArray.length; i++) {
        var typeIndex = textArray.indexOf('-' + profArray[i] + '-');
        if(typeIndex > -1) {
            var profWeapons = textArray[typeIndex + 1].split(', ');
            if(profWeapons.includes(weapon)) return true;
        }
    }
    return false;
}

function GetAttackModifier (weaponType, strength, dex, proficiency) {
    let modifier = 0;
    if(weaponType == 'melee') modifier = strength;
    else if(weaponType == 'ranged') modifier = dex;
    else if(weaponType == 'finesse') {
        if(strength > dex) modifier = strength
        else modifier = dex;
    }
    if(proficiency) modifier += 2;
    return modifier;
}

function PrintAttackStats (loadedImage, font, weapons) {
    for(var i = 0; i < weapons.length; i++) {
        loadedImage.print(font, 100, 100 + (i * 30), weapons[i]);
    }
}

//find damage based on dice in weapon table

let weapons = GetWeapons();
let weaponType = GetWeaponType(weapons[1]);
let modifier = GetAttackModifier(weaponType, 2, -2, true);
console.log(CheckProficiency('dagger'))