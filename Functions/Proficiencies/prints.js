export function PrintProficiencies (loadedImage, font, profArray) {
    for(var i = 0; i < profArray.length; i++) {
        if(i < 12) {
            loadedImage.print(font, 48, 805.5 + (i * 14.2), profArray[i]);
        } else {
            loadedImage.print(font, 158, 805.5 + ((i - 12) * 14.2), profArray[i]);
        }
        
    } 
}