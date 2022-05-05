export function PrintEquipment (loadedImage, fontSmall, fontMedium, equipment) {
    var y = 0;
    for(var i = 0; i < equipment.length; i++) {
        if(equipment[i].includes('gp')) {
            var gold = equipment[i].substring(0, 2);
            loadedImage.print(fontMedium, 305, 878, gold);
        } else {
            loadedImage.print(fontSmall, 350, 764.5 + (y * 14.2), equipment[i]);
            y += 1;
        }
    }
}