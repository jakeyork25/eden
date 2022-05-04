export function GetModifiers (scoreArr) {
    let abilityModArray = [];
    for(var i = 0; i < scoreArr.length; i++) {
        var score = scoreArr[i];
        var mod = Math.round((score - 10)/2 - .1);
        if(mod == -0) mod = 0;
        abilityModArray.push(mod)
    }
    return abilityModArray;
}