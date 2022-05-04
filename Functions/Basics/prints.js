export function PrintBasics (loadedImage, font, race, clss, background, alignment) {
    loadedImage.print(font, 500, 63, race);
    loadedImage.print(font, 355, 63, clss);
    loadedImage.print(font, 500, 96, alignment);
    loadedImage.print(font, 640, 96, background);
    loadedImage.print(font, 130, 220, "+2"); //Proficiency bonus
}