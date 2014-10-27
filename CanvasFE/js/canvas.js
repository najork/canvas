var c = document.getElementById("myCanvas");

for(var i = 1; i < coords.length; ++i) {
    var ctx = c.getContext("2d");

    ctx.moveTo(coords[i-1].x, coords[i-1].y);
    ctx.lineTo(coords[i].x,coords[i].y);

    ctx.stroke();
}