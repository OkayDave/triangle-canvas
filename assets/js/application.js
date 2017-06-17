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
    console.log(e.target.result);
    $(img).on('load', function() {
        console.log("img load")
        var canvas = $('#refCanvas')[0];
        var context = canvas.getContext('2d');
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        // canvas.height = this.height;
        context.drawImage(this, 0, 0, canvas.width, canvas.height);
        ;
    });

    img.src = e.target.result;
    $('#controls .btn').attr("disabled", false);
}

function addShapes(reps) {
    // console.log("adding", x);
    var refCanvas = $('#refCanvas')[0];
    var refContext = refCanvas.getContext('2d');

    var drawCanvas = $('#drawCanvas')[0];
    var drawContext = drawCanvas.getContext('2d');
    var img = refContext.getImageData(0, 0, refCanvas.width, refCanvas.height);

    for(i = 0; i < reps; i++) {
        // pick a pixel
        var x = Math.floor(Math.random() * refCanvas.width);
        var y = Math.floor(Math.random() * refCanvas.height);
        var key = Math.floor((y * refCanvas.width) + x) * 4;

        // console.log(i, "/", reps);
        var colour = colourHexFromKey(img, key);
        drawTriangleAtPoint(x, y, colour, drawContext)
    }

    if(window.initialHide) {
        $('#refCanvas').hide();
        $('#drawCanvas').show();
        window.initialHide = false;
    }
}

function drawTriangleAtPoint(x, y, colour, context) {
    context.fillStyle = colour;
    context.fillRect(x-1,y-1,3,3);
}

function colourHexFromKey(img, key) {
    var r = img.data[key];
    var g = img.data[key+1];
    var b = img.data[key+2];
    var a = Math.random();

    //var hex = "#" + r.toString(16) + g.toString(16) + b.toString(16) //+ a.toString(16);
    var hex = "rgba("+ r + "," + g + "," + b + "," + a + ")";
    // console.log(hex);
    return hex;
}

function switchCanvas() {
    $('#refCanvas').toggle();
    $('#drawCanvas').toggle();
}
