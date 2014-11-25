/**
 * ~ Canvas ~
 *
 * Description: An interactive coloring "book" web application that utilizes
 * data from a Microsoft Kinect to enable users to draw on a projected surface
 * with their body
 *
 * Run using Ubi Displays software (found at https://code.google.com/p/ubidisplays)
 *
 * Authors: Dustin Bui, Maximilian Najork, Zachary Nowicki, Danyaal Rangwala
 *
 */

// The current page being displayed
var cur_page = "canvas";
// The number of consecutive frames an interaction has occurred
var frame_count = 0;

$(document).ready(function() {
    Fade_Border();

    // Wait for user interaction
    Authority.request("KinectLowestPointCube", {
    relativeto      : Surface.Name,
    surface_zoffset : 0.02,             // Offset to begin accepting points (in meters)
    height          : 0.10,             // Offset to stop accepting points (in meters)
    callback        : "run",            // Function to pass return data from KinectLowestPointCube
    point_limit     : 50,               // Max points to accept
    sendemptyframes : true,             // Callback even if no inputs
    });

});

// Draw and fade border on page load
function Fade_Border() {
    $("#border").show().delay(2000).fadeOut(500);
}

function run(pointList) {
    switch(cur_page):
        case "canvas":
            run_canvas(pointList);
            break;
        case "color_menu":
            run_Cmenu(pointList);
            break;
        case "main_menu":
            run_Mmenu(pointList);
            break;
        case default:
            break;
}

function comp_avg(values, comp) {
    var cnt, tot, i;
    cnt = values.length;
    tot = i = 0;
    while (i < cnt) tot+= values[i++][comp];
    return tot / cnt;
}

function clickEvent(pointList) {
    // If more than 40 points registered together
    if (pointList.length > 40) {
        var last_x =
        avg_pos_x = comp_avg(pointList,0).toPrecision(3);
        avg_pos_y = comp_avg(pointList,1).toPrecision(3);

        // If points have been in frame for 1 second
        if (frame_count == 30) {
            avg_pos_x = comp_avg(pointList,0).toPrecision(3);
            avg_pos_y = comp_avg(pointList,1).toPrecision(3);

            $(document.elementFromPoint(avg_pos_x, avg_pos_y)).click();
        }
        frame_count++;
    } else {
        frame_count = 0;
    }
}

