function PrintWeaponNames (loadedImage, font, weapons) {
    for(var i = 0; i < weapons.length; i++) {
        loadedImage.print(font, 100, 100 + (i * 30), weapons[i]);
    }
}

function PrintAttackModifiers (loadedImage, font, modifiers) {
    for(var i = 0; i < modifiers.length; i++) {
        loadedImage.print(font, 130, 100 + (i * 30), modifiers[i]);
    }
}

function PrintDamage (loadedImage, font, weaponInfoList, abilityModifierList) {
    for(var i = 0; i < weaponInfoList.length; i++) {
        var info = weaponInfoList.split(', ');
        var dice = info[1];
        var damageType = info[2];
        loadedImage.print(font, 160, 100 + (i * 30), dice + abilityModifierList[i] + damageType);
    }
}

export function PrintAttackStats (loadedImage, font, weapons) {
    PrintWeaponNames(loadedImage, font, weapons);
    PrintAttackModifiers(loadedImage, font, modifiers);
    PrintDamage(loadedImage, font, weaponInfoList, abilityModifierList);
    //PrintSpecialActions(loadedImage, font);
}