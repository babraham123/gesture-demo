(function(){
    var canvas      = null,
        ctx         = null,
        mouseDown   = false,
        pixelSize   = 2,
        last        = {x: -1, y: -1},
        bounds      = {x: -1, y: -1},
        clearbtn    = null,
        classifybtn = null,
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
    }

    function addButtons() {
        clearbtn = $('#clearbtn');
        clearbtn.click(function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        classifybtn = $('#classifybtn');
        classifybtn.click(function() {
            console.log("Calling server: \n" + JSON.stringify(pixels));
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

    function displayResult() {
        ctx.fillText('J', 50, 50);
    }

    init();
})();
