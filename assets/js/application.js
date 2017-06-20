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
        $('#settings').show();
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
}

function addShapes(reps) {
    loadSettings();

    if(!validSettings()) {
        return;
    }

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

        var colour = chooseColour(img, key);
        drawShapeAtPoint(x, y, colour, drawContext);
    }
}

function drawShapeAtPoint(x, y, colour, context) {
    var shape = window.shapes[Math.floor(Math.random()*window.shapes.length)];

    if(shape == 't') {
        drawTriangleAtPoint(x, y, colour, context);
    } else if(shape == 'r') {
        drawRectangleAtPoint(x, y, colour, context);
    } else if(shape == 'c') {
        drawCircleAtPoint(x, y, colour, context);
    }
}

function drawRectangleAtPoint(x, y, colour, context) {
    var h = Math.floor(Math.random() * window.settings['maxHeight']);
    var w = Math.floor(Math.random() * window.settings['maxWidth']);
    context.fillStyle = colour;
    context.fillRect(x-(w/2),y-(h/2),w,h);
}

function drawTriangleAtPoint(x, y, colour, context) {
    var h = Math.floor(Math.random() * (window.settings['maxHeight']/2));
    var w = Math.floor(Math.random() * (window.settings['maxWidth'])/2);
    var wobble = Math.round(Math.random() * 3);
    context.fillStyle = colour;
    context.beginPath();
    context.lineTo(x-wobble, y-h);
    context.lineTo(x+w,y+wobble);
    context.lineTo(x, y);
    context.closePath();
    context.fill();
}

function drawCircleAtPoint(x, y, colour, context) {
    var h = Math.floor(Math.random() * (window.settings['maxHeight']));
    var w = Math.floor(Math.random() * (window.settings['maxWidth']));

    context.beginPath();
    context.arc(x, y, (h+w)/2, 0, 2*Math.PI);
    context.fillStyle = colour;
    context.fill();
}

function chooseColour(img, key) {
    var r = img.data[key];
    var g = img.data[key+1];
    var b = img.data[key+2];
    var a = Math.random() * window.settings['maxOpacity'];

    if(window.settings['colourTransform']=='invert') {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
    } else if(window.settings['colourTransform']=='grey'){
        var grey = Math.round((r * 0.299) + (g * 0.587) + (b * 0.114));
        r = grey;
        g = grey;
        b = grey;
    }

    return "rgba("+ r + "," + g + "," + b + "," + a + ")";
}

function switchCanvas() {
    $('#refCanvas').toggle();
    $('#drawCanvas').toggle();
}

function blankCanvas(context, canvas) {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function loadSettings() {
    window.settings = {
        'triangles': $('#settingTriangles').prop('checked') ? true : false,
        'rectangles': $('#settingRectangles').prop('checked') ? true : false,
        'circles': $('#settingCircles').prop('checked') ? true : false,
        'maxHeight': $('#settingHeight').val() || 6,
        'maxWidth': $('#settingWidth').val() || 6,
        'colourTransform': $('#settingColourTransform').val() || 'none',
        'maxOpacity': $('#settingMaxOpacity').val() || 0.5
    };

    window.shapes = [];

    if(window.settings['triangles']) {
        window.shapes.push('t');
    }

    if(window.settings['rectangles']) {
        window.shapes.push('r');
    }

    if(window.settings['circles']) {
        window.shapes.push('c');
    }
}

function validSettings() {
    if(window.shapes.length==0) {
        alert("You need to have shapes");
        return false;
    }

    return true;
}
