/**
 * ~ Canvas ~
 *
 * An interactive coloring "book" web application that utilizes data from a
 * Microsoft Kinect to enable users to draw on a projected surface with their
 * body
 *
 * Run using Ubi Displays software (found at https://code.google.com/p/ubidisplays)
 *
 * @author Dustin Bui, Maximilian Najork, Zachary Nowicki, Danyaal Rangwala
 */

/* Current page being displayed */
var cur_page = "canvas";

/* Refresh rate of the Microsoft Kinect (30 Hz) */
var fps = 30;
/* Number of consecutive frames an interaction has occurred */
var frame_count = 0;
/* Total distance between each consecutive point of interaction */
var total_distance = 0;

/* Average position of the current interaction */
var cur_x = 0;
var cur_y = 0;

$(document).ready(function() {
    fade_border();

    /* Wait for user interaction */
    Authority.request("KinectLowestPointCube", {
    relativeto      : Surface.Name,
    surface_zoffset : 0.02,             // Offset to begin accepting points (in meters)
    height          : 0.10,             // Offset to stop accepting points (in meters)
    callback        : "run",            // Function to pass return data from KinectLowestPointCube
    point_limit     : 50,               // Max points to accept
    sendemptyframes : true,             // Callback even if no inputs
    });

});

/** Run main canvas loop */
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

/** Draw and fade border on page load */
function fade_border() {
    $("#border").show().delay(2000).fadeOut(500);
}

/** Compute average interaction position from set of interactions */
function comp_avg(values, comp) {
    var cnt, tot, i;
    cnt = values.length;
    tot = i = 0;
    while (i < cnt) tot+= values[i++][comp];
    return tot / cnt;
}

/**
 * Convert seconds to frames based on the refresh rate of the Microsoft
 * Kinect (30 Hz)
 *
 * @param {number} seconds The number of seconds to convert to number of frames
 */
function seconds_to_frames(seconds) {
    return seconds * fps;
}

/**
 * Execute a click event on the page at a given point of interaction
 *
 * @param {number} pointList The set of interaction points returned by the
 * Kinect
 */
function click_event(pointList) {
    /* More than 40 points registered together */
    if (pointList.length > 40) {
        /* Store last position */
        var last_x = cur_x;
        var last_y = cur_y;

        /* Get current position */
        cur_x = comp_avg(pointList, 0).toPrecision(3);
        cur_y = comp_avg(pointList, 1).toPrecision(3);

        /* Get distance between last and current position */
        var distance = Math.sqrt(Math.pow((last_x + cur_x), 2) +
            Math.pow((last_y + cur_y), 2));

        /* If distance is less than 0.1 (position changed by less than 10%) */
        if (distance < 0.1) {
            /* If frame_count is one second of frames and average_distance is
             * less than 0.1 (average position changed by less than 10%) */
            if (frame_count == seconds_to_frames(1)
                && total_distance/frame_count < 0.1) {
                /* Execute click event at current position */
                $(document.elementFromPoint(cur_x, cur_y)).click();
            }
            /* Increment total_distance and frame_count */
            total_distance += distance;
            frame_count++;
        } else {
            total_distance = 0;
            frame_count = 0;
        }
    } else {
        total_distance = 0;
        frame_count = 0;
    }
}
