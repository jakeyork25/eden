import fs from 'fs';
import { PrintEquipment } from './prints.js';

function randomInt (min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function GetDefaultEquipment (fileName, text) {
    var textArray = fs.readFileSync(`dndTextFiles/${fileName}.txt`).toString().split('\r\n');
    var inSection = false;
    for(var i = 0; i < textArray.length; i++) {
        if(textArray[i].includes("Equipment")) inSection = true;
        if(inSection && textArray[i].includes(text)) return textArray[i].split(" - ")[1].split(", ");
    }
}

function ChooseRandomEquipment (title) {
    var options = fs.readFileSync(`dndTextFiles/misc.txt`).toString().split('\r\n');
    let textIndex = options.indexOf('-' + title + '-') + 1;
    let optionArray = options[textIndex].split(", ");
    return optionArray[randomInt(0, optionArray.length - 1)]
}

function RemoveValueFromArray (value, arr) {
    arr = arr.filter(function(item) {
        return item !== value
    })
    return arr;
}

function FilterEquipment(equipment) {
    let removeArray = [];
    let gold;
    let equipmentLength = equipment.length;
    for(var i = 0; i < equipmentLength; i++) {
        var invenText = equipment[i];
        if(invenText.includes("$")) {
            var amount = invenText[1];
            removeArray.push(invenText);
            var title = invenText.substring(2);
            for(var j = 0; j < amount; j++) {
                var option = ChooseRandomEquipment(title);
                while(equipment.includes(option)) {
                    option = ChooseRandomEquipment(title);
                }  
                equipment.push(option);
            }
        }
    }    
    for(var i = 0; i < removeArray.length; i++) {
        equipment = RemoveValueFromArray(removeArray[i], equipment);
    }
    return equipment;
}

function ChooseEquipmentOptions (equipment) {
    for(var i = 0; i < equipment.length; i++) {
        var invenOptions = equipment[i];
        if(invenOptions.includes("/")) {
            var optionArray = invenOptions.split("/");
            var option = optionArray[randomInt(0, optionArray.length - 1)];
            equipment[i] = option;
        }
    }
    return equipment;
}

function GetEquipment(clss, background) {
    let equipment = GetDefaultEquipment('classInfo', clss);
    let bgEquipment = GetDefaultEquipment('backgroundInfo', background);
    equipment = equipment.concat(bgEquipment);
    equipment = ChooseEquipmentOptions(equipment);
    equipment = FilterEquipment(equipment);
    return equipment;
}

export { GetEquipment, PrintEquipment };