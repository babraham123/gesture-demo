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

    // TODO: implement and test
    function getGesture(callback) {
        console.log("Calling server: \n" + JSON.stringify(pixels));
        var url = "" + document.location.origin + "/gesture/gesture";
        $.ajax({
            type: "POST",
            url: url,
            data: {'points': pixels},
            success: function (data, status, jqxhr) {
                console.log(data.toString());
                console.log(status);
                callback(data.symbol);
            },
            dataType: 'json'
        });
    }

    // TODO: implement and test
    function getBox(callback) {
        console.log("Calling server: \n" + JSON.stringify(pixels));
        var url = "" + document.location.origin + "/gesture/box";
        $.ajax({
            type: "POST",
            url: url,
            data: {'points': pixels},
            success: function (data, status, jqxhr) {
                console.log(data.toString());
                console.log(status);
                callback(data.corners);
            },
            dataType: 'json'
        });
    }

    function addMouseEvents() {
        canvas.addEventListener("mousedown", function(mEvent) {
            mouseDown = true;
        }, false);

        canvas.addEventListener("mouseup", function(mEvent) {
            mouseDown = false;
        }, false);

        canvas.addEventListener('mousemove', function(mEvent) {
            var x = mEvent.clientX - bounds.x;
            var y = mEvent.clientY - bounds.y;
            if (mouseDown === true) {
                setPixel(x, y);
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
        ctx.fillText(symbol, 50, 50);
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

    init();
})();
