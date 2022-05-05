import fs from 'fs';

function randomInt (min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function GetTextFileIndex (fileName, text) {
    var options = fs.readFileSync(`dndTextFiles/${fileName}.txt`).toString().split('\r\n')[0].split(', ');
    return options.indexOf(text);
}

function GetSkillIndexes (arr, amount) {
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

function FilterArray (mainArr, subArr) {
    for(var i = 0; i < subArr.length; i++) {
        mainArr = mainArr.filter(function(item) {
            return item !== subArr[i]
        })
    }
    return mainArr;
}

export function GetSkills (clss, background) {
    let classIndex = GetTextFileIndex('classInfo', clss);
    let bgIndex = GetTextFileIndex('backgroundInfo', background);
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

    skillIndexes = skillIndexes.concat(bgSkills);

    let skillArray = [];
    for(var i = 0; i < 18; i++) {
        if(skillIndexes.includes(i)) skillArray.push(1);
        else skillArray.push(0);
    }
    return skillArray;
}