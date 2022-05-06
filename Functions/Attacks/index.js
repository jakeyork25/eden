import fs from 'fs';
import { PrintAttackStats } from './prints.js'; 

function GetWeaponList () {
    let weaponList = [];
    var textArray = fs.readFileSync(`dndTextFiles/weapons.txt`).toString().split('\r\n');
    for(var i = 0; i < textArray.length; i++) {
        weaponList.push(textArray[i].split(' - ')[0]);
    }
    return weaponList;
}

function GetWeapons (equipment) {
    let equippedWeapons = [];
    let weaponList = GetWeaponList();
    for(var i = 0; i < weaponList.length; i++) {
        var weapon = weaponList[i];
        for(var j = 0; j < equipment.length; j++) {
            if(equipment[j].includes(weapon.toLowerCase())) equippedWeapons.push(weapon);
        }
    }
    return equippedWeapons;
}

function GetWeaponInfo (weapons) {
    let infoList = [];
    var textArray = fs.readFileSync(`dndTextFiles/weapons.txt`).toString().split('\r\n');
    for(var i = 0; i < weapons.length; i++) {
        for(var j = 0; j < textArray.length; j++) {
            if(textArray[j].includes(weapons[i])) infoList.push(textArray[j].split(' - ')[1].split(', '));
        }
    }
    return infoList;
    }

function CheckProficiency (weapons, profArray) {
    let profBools = [];
    var textArray = fs.readFileSync(`dndTextFiles/misc.txt`).toString().split('\r\n');
    for(var i = 0; i < weapons.length; i++) {
        for(var j = 0; j < profArray.length; j++) {
            if(profArray[j].includes(weapons[i])) profBools.push(true);
            var typeIndex = textArray.indexOf('-' + profArray[j] + '-');
            if(typeIndex > -1) {
                var profWeapons = textArray[typeIndex + 1].split(', ');
                if(profWeapons.includes(weapons[i].toLowerCase())) profBools.push(true);
            }
        }
        if(profBools.length < i + 1) profBools.push(false);
    }
    return profBools;
}

function GetAttackModifier (weaponInfo, strength, dex, profBools) {
    let weaponTypes = [];
    for(var i = 0; i < weaponInfo.length; i++) {
        weaponTypes.push(weaponInfo[i][0]);
    }
    let modifiers = [];
    for(var i = 0; i < weaponTypes.length; i++) {
        var modifier = 0;
        if(weaponTypes[i] == 'melee') modifier = strength;
        else if(weaponTypes[i] == 'ranged') modifier = dex;
        else if(weaponTypes[i] == 'finesse') {
            if(strength > dex) modifier = strength
            else modifier = dex;
        }
        if(profBools[i]) modifier += 2;
        modifiers.push(modifier);
    }
    return modifiers;
}

export { GetWeapons, GetWeaponInfo, CheckProficiency, GetAttackModifier, PrintAttackStats }