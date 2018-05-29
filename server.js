var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var includes = require('array-includes');

var app = express();
// создаем парсер для данных в формате json
var jsonParser = bodyParser.json();
//в словарике не все слова
var fileContent = fs.readFileSync(__dirname + "/words.txt", "utf8"); 
var wordMassive = fileContent.split(" ");

app.set("view engine", "html");

app.post("/select", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    var letters = request.body.letters;
    var mask = request.body.mask;
    var maxLength = request.body.maxLength;
    response.send(solve(letters, mask, maxLength));
});

//главная страница
app.get("/", function(request, response){
    response.send(fs.readFileSync(__dirname + "/index.html", "utf8"));
});

//если интересно посмотреть код сервера
app.get("/server", function(request, response){
    response.send(fs.readFileSync(__dirname + "/server.js", "utf8"));
});

app.listen(551);

//функция для подбора слов
function solve(letters, mask, maxLength) {
    var liters  = letters+mask;//все буквы
    var result = "";
    var i=0;
    while (i<wordMassive.length-1){
        var word = wordMassive[i];
        var A = [];
        var l = 0;
        for(var p=0; p<word.length; p++)
            for(var q=0; q<liters.length; q++) {
                if (includes(A,q)) continue;
                if(liters.charAt(q)==word.charAt(p)){
                    A.push(q);
                    l++;
                    break;
                }
            }
        i++;

        if(l==word.length &&
            (word.length<=maxLength || maxLength=="")){
            if(mask!=""){
                if(word.includes(mask)) result += word+"@";//\n
            } else {result += word+"@";}
        }
    }
    return result;

}