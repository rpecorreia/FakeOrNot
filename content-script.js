function count(str) {
    var obj = {};

    str.split(/[ ,.]+/).forEach(function(el) {
        obj[el] = obj[el] ? ++obj[el] : 1;
    });

    return obj;
}

console.log("1");

chrome.runtime.onMessage.addListener(function(request) {
    console.log("listening");
    //se botão de thumbs up clicado
    if (request.action == 'executeCode') {
        var sel = window.getSelection().toString();
        if(sel.length)
            chrome.extension.sendRequest({'message':'setTextTumbsUp','data': sel},function(response){console.log(response.resp)})
        arrThumbsUp.push(sel);
        console.log(count(arrThumbsUp.toString()));
        console.log("thumbs up: ", arrThumbsUp);
        console.log("2");
        highlightSelection();
        console.log("7");

        return;
    }
    //se botão de thumbs down clicado
    else if (request.action == 'executeCode2') {
        var sel = window.getSelection().toString();
        if(sel.length)
            chrome.extension.sendRequest({'message':'setTextTumbsDown','data': sel},function(response){console.log(response.resp)})
        arrThumbsDown.push(sel);
        console.log(count(arrThumbsDown.toString()));
        console.log("thumbs down: ", arrThumbsDown);
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
    //arrTexto.push(safeRanges);
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
}

// função que vai buscar a seleção e corre a função para a sublinhar a branco (transparente não funciona...)
function highlightSelection3() {
    var safeRanges = getSafeRanges(window.getSelection().getRangeAt(0));
    for (var i = 0; i < safeRanges.length; i++) {
        highlightRange3(safeRanges[i]);
    }
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
        "background-color: #ff8585; display: inline;"
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