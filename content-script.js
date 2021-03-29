/*While content scripts are the one's that actually interacts with the webpage */

//para mostrar o texto da selação no popup, vai buscar a seleção em string e manda um request para o background com essa seleção
//var selectedText = window.getSelection().toString();
//chrome.extension.sendRequest(selectedText);   

/*
chrome.runtime.sendMessage({seltext: selectedText}, function(response) {
    console.log(response.response);
  });*/

//array que vai conter todos os excertos selecionados
//arrTexto.push(selectedText);

//chrome.extension.sendRequest(arrTexto);         

//console.log(countDuplicates(arrTexto));

// conta o número de ocorrências de uma palavra quando estas ocorrem MAIS QUE 1X
/*
function countDuplicates(arr) {
    // O mapa (objeto vazio):
    const map = Object.create(null);

    for (const str of arr) {
        map[str] = (map[str] || 0) + 1;
    }

    const repeatedMap = Object.create(null);
    for (const prop in map) {
        if (map[prop] > 1) {
            repeatedMap[prop] = map[prop];
        }
    }
    return repeatedMap;
}*/

// conta o número de ocorrências de uma palavra 
/*
function countDuplicates(arrTexto) {
    const map = Object.create(null);

    for (const str of arrTexto) {
        if (map[str]) {
            // Se já tiver contabilizado, soma '1' ao contador:
            map[str] += 1;
        } else {
            // Caso contrário, iniciamos o contador como '1':
            map[str] = 1;
        }
    }

    return map;
}
*/

function count(str) {
    var obj = {};

    str.split(/[ ,.]+/).forEach(function(el) {
        obj[el] = obj[el] ? ++obj[el] : 1;
    });

    return obj;
}


/*
var parsedObject;
parsedObject = count(arrTexto.toString());

console.log(parsedObject[5]);

*/

for (var i = 0; i < arrTexto.length; i++) {
    console.log("arr " + i + " " + arrTexto[i]);
}

console.log("1");

chrome.runtime.onMessage.addListener(function(request) {
    console.log("listening");
    //se botão de thumbs up clicado
    if (request.action == 'executeCode') {
        var sel = window.getSelection().toString();
        if(sel.length)
            chrome.extension.sendRequest({'message':'setText','data': sel},function(response){})
        arrTexto.push(sel);
        console.log(count(arrTexto.toString()));
        console.log("thumbs up: ", sel);
        console.log("2");
        highlightSelection();
        console.log("7");

        return;
    }
    //se botão de thumbs down clicado
    else if (request.action == 'executeCode2') {
        highlightSelection2();
        return;
    }
    //se botão de clear clicado
    else if (request.action == 'executeCode3') {
        highlightSelection3();
        return;
    }

});

// função que vai buscar a seleção e corre a função para a sublinhar a verde
function highlightSelection() {
    console.log("3");
    var safeRanges = getSafeRanges(window.getSelection().getRangeAt(0));
    console.log("4");
    arrTexto.push(safeRanges);
    //console.log("saferange: " + safeRanges);
    //console.log("arr: " + arrTexto);

    for (var i = 0; i < safeRanges.length; i++) {
        highlightRange(safeRanges[i]);
    }

    console.log("6");

}

// função que vai buscar a seleção e corre a função para a sublinhar a vermelho
function highlightSelection2() {
    var safeRanges = getSafeRanges(window.getSelection().getRangeAt(0));
    for (var i = 0; i < safeRanges.length; i++) {
        highlightRange2(safeRanges[i]);
    }

    /*     var userSelection = window.getSelection().getRangeAt(0);
     */

}

// função que vai buscar a seleção e corre a função para a sublinhar a branco (transparente não funciona...)
function highlightSelection3() {
    var safeRanges = getSafeRanges(window.getSelection().getRangeAt(0));
    for (var i = 0; i < safeRanges.length; i++) {
        highlightRange3(safeRanges[i]);
    }

    /*     var userSelection = window.getSelection().getRangeAt(0);
     */

}

/* para conseguir atravessar as tags html todas */

function getSafeRanges(dangerous) {
    var a = dangerous.commonAncestorContainer;
    // Starts -- Work inward from the start, selecting the largest safe range
    var s = new Array(0),
        rs = new Array(0);
    if (dangerous.startContainer != a)
        for (var i = dangerous.startContainer; i != a; i = i.parentNode)
            s.push(i);
    if (0 < s.length)
        for (var i = 0; i < s.length; i++) {
            var xs = document.createRange();
            if (i) {
                xs.setStartAfter(s[i - 1]);
                xs.setEndAfter(s[i].lastChild);
            } else {
                xs.setStart(s[i], dangerous.startOffset);
                xs.setEndAfter(
                    (s[i].nodeType == Node.TEXT_NODE) ?
                    s[i] : s[i].lastChild
                );
            }
            rs.push(xs);
        }

    // Ends -- basically the same code reversed
    var e = new Array(0),
        re = new Array(0);
    if (dangerous.endContainer != a)
        for (var i = dangerous.endContainer; i != a; i = i.parentNode)
            e.push(i);
    if (0 < e.length)
        for (var i = 0; i < e.length; i++) {
            var xe = document.createRange();
            if (i) {
                xe.setStartBefore(e[i].firstChild);
                xe.setEndBefore(e[i - 1]);
            } else {
                xe.setStartBefore(
                    (e[i].nodeType == Node.TEXT_NODE) ?
                    e[i] : e[i].firstChild
                );
                xe.setEnd(e[i], dangerous.endOffset);
            }
            re.unshift(xe);
        }

    // Middle -- the uncaptured middle
    if ((0 < s.length) && (0 < e.length)) {
        var xm = document.createRange();
        xm.setStartAfter(s[s.length - 1]);
        xm.setEndBefore(e[e.length - 1]);
    } else {
        return [dangerous];
    }

    // Concat
    rs.push(xm);
    let response = rs.concat(re);

    // Send to Console
    return response;
}


//função que sublinha a verde na página web
function highlightRange(range) {
    console.log("5");
    var newNode = document.createElement("div");
    newNode.setAttribute(
        "style",
        "background-color: greenyellow; display: inline;"
    );
    range.surroundContents(newNode);
}

//função que sublinha a vermelho na página web
function highlightRange2(range) {
    var newNode = document.createElement("div");
    newNode.setAttribute(
        "style",
        "background-color: red; display: inline;"
    );
    range.surroundContents(newNode);

}

//função que sublinha a branco (o transparente não funciona)
function highlightRange3(range) {
    var newNode = document.createElement("div");
    newNode.setAttribute(
        "style",
        "background-color: white; display: inline;"
    );
    range.surroundContents(newNode);

}