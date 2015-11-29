(function(){
    var canvas      = null,
        ctx         = null,
        mouseDown   = false,
        pixelSize   = 2,
        last        = {x: -1, y: -1},
        bounds      = {x: -1, y: -1},
        clearbtn    = null,
        classifybtn = null,
        segmentbtn  = null,
        pixels      = [];

    function init() {
        initializeCanvas();
        addButtons();
        addMouseEvents();
    }

    function initializeCanvas() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.font = '100pt Lucida';
        var rect = canvas.getBoundingClientRect();
        bounds.x = rect.left;
        bounds.y = rect.top;
        // origin is in the top left corner
    }

    function addButtons() {
        clearbtn = $('#clearbtn');
        clearbtn.click(function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        classifybtn = $('#classifybtn');
        classifybtn.click(function() {
            getGesture(function(letter) {
                ctx.fillText(letter, 50, 50);
            });
        });

        segmentbtn = $('#segmentbtn');
        segmentbtn.click(function() {
            getBox(function(corners) {
                drawBox(corners);
            });
        });
    }

    function getGesture(callback) {
        console.log("Calling server: \n" + JSON.stringify(pixels));
        $.ajax({
            type: "POST",
            url: "/gesture/gesture",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({"points": pixels}),
            success: function (data, status, jqxhr) {
                getResult(data, 'symbol', callback);
            },
            error: function (e) {
                console.log("Error: " + JSON.stringify(e));
            }
        });
    }

    function getBox(callback) {
        console.log("Calling server: \n" + JSON.stringify(pixels));
        $.ajax({
            type: "POST",
            url: "/gesture/box",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({"points": pixels}),
            success: function (data, status, jqxhr) {
                getResult(data, 'corners', callback);
            },
            error: function (e) {
                console.log("Error: " + JSON.stringify(e));
            }
        });
    }

    function getResult(data, key, callback) {
        //console.log("Response: " + JSON.stringify(data));
        if (data.hasOwnProperty('error')) {
            console.log("API Error: " + JSON.stringify(data.error));
        } else if (data.hasOwnProperty(key)) {
            console.log(key + ": " + JSON.stringify(data[key]));
            callback(data[key]);
        } else {
            console.log("Unknown: " + JSON.stringify(data))
        }
    }

    function addMouseEvents() {
        canvas.addEventListener("mousedown", function(mEvent) {
            mouseDown = true;
        }, false);

        canvas.addEventListener("mouseup", function(mEvent) {
            mouseDown = false;
        }, false);

        canvas.addEventListener('mousemove', function(mEvent) {
            //var x = mEvent.clientX - bounds.x;
            //var y = mEvent.clientY - bounds.y;
            if (mouseDown === true) {
                var pos = getPosition(mEvent);
                setPixel(pos.x, pos.y);
            }
        }, false);
    }

    function setPixel(x, y) {
        if (last.x !== x || last.y !== y) {
            ctx.fillRect(x, y, pixelSize, pixelSize);
            last.x = x;
            last.y = y;
            pixels.push([x, y]);
        }
    }

    function drawSymbol(symbol) {
        ctx.fillText(symbol, 50, 200);
    }

    function drawBox(box) {
        var oldStyle = ctx.fillStyle;
        ctx.fillStyle = "red";
        box.forEach(function(corner, ind) {
            ctx.fillRect(corner[0], corner[1], pixelSize*2, pixelSize*2);
        });
        
        /* 1 2
           3 4
         *
        box.sort(function(a, b) {
            // y, then x
            if (a[1] < b[1]) {
                return -1;
            } else if (a[1] > b[1]) {
                return 1;
            } else {
                return a[0] - b[0];
            }
        });
        */
        if (box.length !== 4) {
            throw "Incorrect number of points in box";
        }

        var xthird = (box[1][0] - box[0][0])/3;
        var ythird = (box[2][1] - box[0][1])/3;
        lineSeg(box[0], box[1]);
        lineSeg(box[1], box[3]);
        lineSeg(box[3], box[2]);
        lineSeg(box[2], box[0]);

        lineSeg([box[0][0]+xthird, box[0][1]], [box[0][0]+xthird, box[2][1]]);
        lineSeg([box[1][0]-xthird, box[1][1]], [box[1][0]-xthird, box[3][1]]);
        lineSeg([box[0][0], box[0][1]+ythird], [box[1][0], box[0][1]+ythird]);
        lineSeg([box[2][0], box[2][1]-ythird], [box[3][0], box[2][1]-ythird]);
        ctx.fillStyle = oldStyle;
    }

    function lineSeg(pt1, pt2) {
        ctx.beginPath();
        ctx.moveTo(pt1[0], pt1[1]);
        ctx.lineTo(pt2[0], pt2[1]);
        ctx.stroke();
    }

    function getPosition(e) {
        //this section is from http://www.quirksmode.org/js/events_properties.html
        var targ;
        if (!e)
            e = window.event;
        if (e.target)
            targ = e.target;
        else if (e.srcElement)
            targ = e.srcElement;
        if (targ.nodeType == 3) // defeat Safari bug
            targ = targ.parentNode;

        // jQuery normalizes the pageX and pageY
        // pageX,Y are the mouse positions relative to the document
        // offset() returns the position of the element relative to the document
        var x = e.pageX - $(targ).offset().left;
        var y = e.pageY - $(targ).offset().top;

        return {"x": x, "y": y};
    };

    init();
})();
