/*While content scripts are the one's that actually interacts with the webpage */


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
    response = rs.concat(re);

    // Send to Console
    return response;
}

function highlightRange(range) {
    var newNode = document.createElement("div");
    newNode.setAttribute(
        "style",
        "background-color: greenyellow; display: inline;"
    );
    range.surroundContents(newNode);

}

function highlightRange2(range) {
    var newNode = document.createElement("div");
    newNode.setAttribute(
        "style",
        "background-color: red; display: inline;"
    );
    range.surroundContents(newNode);

}

function highlightRange3(range) {
    var newNode = document.createElement("div");
    newNode.setAttribute(
        "style",
        "background-color: white; display: inline;"
    );
    range.surroundContents(newNode);

}

function highlightSelection() {
    var safeRanges = getSafeRanges(window.getSelection().getRangeAt(0));
    for (var i = 0; i < safeRanges.length; i++) {
        highlightRange(safeRanges[i]);
    }

    /*     var userSelection = window.getSelection().getRangeAt(0);
     */

}

function highlightSelection2() {
    var safeRanges = getSafeRanges(window.getSelection().getRangeAt(0));
    for (var i = 0; i < safeRanges.length; i++) {
        highlightRange2(safeRanges[i]);
    }

    /*     var userSelection = window.getSelection().getRangeAt(0);
     */

}

function highlightSelection3() {
    var safeRanges = getSafeRanges(window.getSelection().getRangeAt(0));
    for (var i = 0; i < safeRanges.length; i++) {
        highlightRange3(safeRanges[i]);
    }

    /*     var userSelection = window.getSelection().getRangeAt(0);
     */

}

chrome.runtime.onMessage.addListener(function(request) {
    if (request.action === 'executeCode') {
        //alert("wtf");
        highlightSelection();

    }
});

chrome.runtime.onMessage.addListener(function(request) {
    if (request.action === 'executeCode2') {
        //alert("wtf");
        highlightSelection2();

    }
});

chrome.runtime.onMessage.addListener(function(request) {
    if (request.action === 'executeCode3') {
        //alert("wtf");
        highlightSelection3();

    }
});


//highlightSelection();

var selectedText = window.getSelection().toString()
chrome.extension.sendRequest(selectedText);