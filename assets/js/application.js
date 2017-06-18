$(function() {
    window.initialHide = true;
    $('#file-upload').change(function(e) {
        var file = e.target.files[0];
        var imageType = /image.*/;

        if(!file.type.match(imageType)) {
            return;
        }

        var reader = new FileReader();
        reader.onload = loadImageToCanvas;
        reader.readAsDataURL(file);

        $(this).remove();
    });
});

function loadImageToCanvas(e) {
    var img = $('<img />', {src: e.target.result});
    $(img).on('load', function() {
        var canvas = $('#refCanvas')[0];
        var context = canvas.getContext('2d');
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        context.drawImage(this, 0, 0, canvas.width, canvas.height);
        ;
    });

    img.src = e.target.result;
    $('#controls .btn').attr("disabled", false);
}

function addShapes(reps) {
    var refCanvas = $('#refCanvas')[0];
    var refContext = refCanvas.getContext('2d');

    var drawCanvas = $('#drawCanvas')[0];
    var drawContext = drawCanvas.getContext('2d');
    var img = refContext.getImageData(0, 0, refCanvas.width, refCanvas.height);

    if(window.initialHide) {
        $('#refCanvas').hide();
        $('#drawCanvas').show();
        window.initialHide = false;
        blankCanvas(drawContext, drawCanvas);
    }

    for(i = 0; i < reps; i++) {
        var x = Math.floor(Math.random() * refCanvas.width);
        var y = Math.floor(Math.random() * refCanvas.height);
        var key = Math.floor((y * refCanvas.width) + x) * 4;

        var colour = colourHexFromKey(img, key);
        // if(Math.random() < 0.5) {
        //     drawRectangleAtPoint(x, y, colour, drawContext);
        // } else {
            drawTriangleAtPoint(x, y, colour, drawContext);
        // }
    }

    console.log("done")
}

function drawRectangleAtPoint(x, y, colour, context) {
    var h = Math.floor(Math.random() * 6);
    var w = Math.floor(Math.random() * 6);
    context.fillStyle = colour;
    context.fillRect(x-(w/2),y-(h/2),w,h);
}

function drawTriangleAtPoint(x, y, colour, context) {
    var h = Math.floor(Math.random() * 6);
    var w = Math.floor(Math.random() * 6);
    var wobble = Math.round(Math.random() * 3);
    context.fillStyle = colour;
    context.beginPath();
    context.lineTo(x-wobble, y-h);
    context.lineTo(x+w,y+wobble);
    context.lineTo(x, y);
    context.closePath();
    context.fill();
}

function colourHexFromKey(img, key) {
    var r = img.data[key];
    var g = img.data[key+1];
    var b = img.data[key+2];
    var a = Math.random() * 0.75;

    var hex = "rgba("+ r + "," + g + "," + b + "," + a + ")";
    return hex;
}

function switchCanvas() {
    $('#refCanvas').toggle();
    $('#drawCanvas').toggle();
}

function blankCanvas(context, canvas) {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
}
