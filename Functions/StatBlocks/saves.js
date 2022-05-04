export function GetSaves (clss) {
    let index = GetTextFileIndex('classes', clss);
    let profArr = [];
    switch (index) {
        case 0: profArr = [1, 0, 1, 0, 0, 0]; break;
        case 1: profArr = [0, 1, 0, 0, 0, 1]; break;
        case 2: profArr = [0, 0, 0, 0, 1, 1]; break;
        case 3: profArr = [0, 0, 0, 1, 1, 0]; break;
        case 4: profArr = [1, 0, 1, 0, 0, 0]; break;
        case 5: profArr = [1, 1, 0, 0, 0, 0]; break;
        case 6: profArr = [0, 0, 0, 0, 1, 1]; break;
        case 7: profArr = [1, 1, 0, 0, 0, 0]; break;
        case 8: profArr = [0, 1, 0, 0, 1, 0]; break;
        case 9: profArr = [0, 0, 1, 0, 0, 1]; break;
        case 10: profArr = [0, 0, 0, 0, 1, 1]; break;
        case 11: profArr = [0, 0, 0, 1, 1, 0]; break;
    }
    return profArr;
}