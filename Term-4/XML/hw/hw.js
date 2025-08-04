const prompt = require("prompt-sync")()

let buf = '';
var word = prompt("Введите слово: ");
word = word.toLowerCase();
word = word.replace(/[^a-zа-яё0-9]/g, '');

//Первый способ
for (let i = word.length-1; i > -1; i--) {
    buf += word[i];
}
if (buf == word){
    console.log("Введён палиндром");
} else {
    console.log("Введён не палиндром");
}

//Второй способ
let flag = true;
for (let i = 0; i < word.length/2; i++) {
    if (word[i] != word[word.length-1-i]) {
        flag = false;
        break;
    }
}
if (flag) {
    console.log("Введён палиндром");
}
else {
    console.log("Введён не палиндром");
}