function randomInt (min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function SetScoreArray (arr, largest, largestIndex, next, nextIndex) {
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

function RemoveValueFromArray (value, arr) {
    var index = arr.indexOf(value); 
    return arr.filter((_, i) => i !== index);
}

function FindLargestValue (arr) {
    var largest = 0;
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] > largest) largest = arr[i];
    }
    return largest;
}

function UpdateScoreArray (scoreArr, increaseArr) {
    for(var i = 0; i < scoreArr.length; i++) {
        scoreArr[i] = scoreArr[i] + increaseArr[i];
    }
    return scoreArr;
}

function CreateHalfElfArray () {
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

export function GetScores (clss, race) {
    let scoreArray = [];
    let randArray = [];
    let largest = 0;
    let nextLargest = 0;
    for(var i = 0; i < 6; i++) {
        var rollArray = [];
        for(var j = 0; j < 4; j++) {
            rollArray.push(randomInt(1, 6));
        }
        rollArray = RemoveValueFromArray(Math.min(...rollArray), rollArray);
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
        default: console.log("Unexpected class type " + clss); break;
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
        default: console.log("Unexpected race type " + clss); break;
    }
    return scoreArray
}