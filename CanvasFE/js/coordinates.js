var coords = [{x:0, y:0}];

for(var i = 0; i < 600; ++i) {
    var newX = Math.floor((Math.random() * 600));
    var newY = Math.floor((Math.random() * 600));

    newCoord = {x: newX, y: newY};
    coords.push(newCoord);
}

