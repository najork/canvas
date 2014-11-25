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

var debug = false;

var hexDigits = new Array
        ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

/* Current page being displayed */
var cur_page = "canvas";

/* Current color being used */
cur_color = '#000000';

/* Refresh rate of the Microsoft Kinect (30 Hz) */
var fps = 30;
/* Number of consecutive frames an interaction has occurred */
frame_count = 0;
/* Total distance between each consecutive point of interaction */
var total_distance = 0;

/* Average position of the current interaction */
var cur_x = -1;
var cur_y = -1;

/* Threshold number of adjacent points for valid interaction */
var min_adj = 40;

$(document).ready(function() {
    /* Canvas element */
    c = document.getElementById("myCanvas");
    context = c.getContext("2d");
    /* Width and height of the canvas */
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    fade_border();

    /* Wait for user interaction */
    Authority.request("KinectLowestPointCube", {
    relativeto      : Surface.Name,
    surface_zoffset : 0.038,             // Offset to begin accepting points (in meters)
    height          : 0.04,             // Offset to stop accepting points (in meters)
    callback        : "run",            // Function to pass return data from KinectLowestPointCube
    point_limit     : 50,               // Max points to accept
    sendemptyframes : true,             // Callback even if no inputs
    });

});

/* Draw on the canvas */
for(var i = 1; i < coords.length; ++i) {
    context = c.getContext("2d");
    context.moveTo(coords[i-1].x, coords[i-1].y);
    context.lineTo(coords[i].x,coords[i].y);
    context.stroke();
}

/** Run main canvas loop */
function run(pointList) {
    /* Print debug info if debug mode enabled */
    if (debug) {
        $('#debug').text("frame_count: " + frame_count + "\ncur_color: " + cur_color);
    }

    switch(cur_page) {
        case "canvas":
            run_canvas(pointList);
            break;
        case "color_menu":
            run_cmenu(pointList);
            break;
        case "main_menu":
            run_mmenu(pointList);
            break;
        default:
            break;
    }
}

/** Draw and fade border on page load */
function fade_border() {
    $("#border").show().delay(2000).fadeOut(500);
}

/** Compute average interaction position from set of interactions */
function comp_axis_avg(values, comp) {
    var cnt, tot, i;
    cnt = values.length;
    tot = i = 0;
    while (i < cnt) tot+= values[i++][comp];
    return tot / cnt;
}

/** Refresh current position of interation */
function refresh_pos(pointList) {
    cur_x = comp_axis_avg(pointList, 0).toPrecision(3);
    cur_y = comp_axis_avg(pointList, 1).toPrecision(3);
    cur_z = comp_axis_avg(pointList, 2).toPrecision(3);
}

/**
 * Convert seconds to frames based on the refresh rate of the Microsoft
 * Kinect (30 Hz)
 *
 * @param {number} seconds The number of seconds to convert to number of frames
 * @return {number} The number of frames equivalent to the seconds inputted
 */
function seconds_to_frames(seconds) {
    return seconds * fps;
}

/**
 * Convert seconds to frames based on the refresh rate of the Microsoft
 * Kinect (30 Hz)
 *
 * @param {number} pointList The set of interaction points returned by the
 * Kinect
 * @return {boolean} True if number of points registered together is greater
 * than min_adj
 */
function is_valid_interaction(pointList) {
    return pointList.length > min_adj;
}

/**
 * Generate a random color
 *
 * @return {string} A hexadecimal representation of a color
 */
function random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Execute a click event on the page at a given point of interaction
 *
 * @param {number} pointList The set of interaction points returned by the
 * Kinect
 */
function click_event(pointList) {
    /* Store last position */
    var last_x = cur_x;
    var last_y = cur_y;

    /* Get current position */
    refresh_pos(pointList);

    // TODO: fix distance logic

    /* Get distance between last and current position */
    var distance = Math.sqrt(Math.pow((last_x + cur_x), 2) +
        Math.pow((last_y + cur_y), 2));

    if (frame_count >= seconds_to_frames(2)) {
        pixel_x = cur_x * -1 * c.width;
        pixel_y = cur_y * c.height;

        // TODO: need to make this work with back button element that was added, evaluate overall logic

        // TODO: change to color menu
        /* Defines what clicking on colorMenuButton does */
        $('#colorMenuButton').click(function() {
            frame_count = 0;
            switch(cur_page) {
                case "canvas":
                    $('#myCanvas').hide();
                    $('#mainMenuButton').hide();
                    $('.menu').show();
                    cur_page = "color_menu";
                    break;
                case "color_menu":
                    $('.menu').hide();
                    $('#myCanvas').show();
                    $('#mainMenuButton').show();
                    cur_page = "canvas";
                    break;
                case "main_menu":
                    $('#mainMenu').hide();
                    $('#myCanvas').show();
                    $('#mainMenuButton').show();
                    cur_page = "canvas";
                    break;
                default:
                    break;
            }
        });

        /* Defines what clicking on mainMenuButton does */
        $('#mainMenuButton').click(function() {
            frame_count = 0;
            $('#myCanvas').hide();
            $('#mainMenu').show();
            $('#mainMenuButton').hide();
            cur_page = "main_menu";
        });

        /* Defines what clicking on backButton does */
        $('#backButton').click(function() {
            frame_count = 0;

            // TODO - IMPLEMENT

            cur_page = "canvas";
        });

        /* Defines what selecting a color does */
        $('.color').click(function() {
            var rgb = $(this).css('background');
            cur_color = $(this).attr('value');
            $('#colorMenuButton').css('background', rgb);
            frame_count = 0;
        });

        $(document.elementFromPoint(pixel_x, pixel_y)).click();
    }
}

/**
 * Block to execute main draw functionality of canvas
 *
 * @param {number} pointList The set of interaction points returned by the
 * Kinect
 */
function run_canvas(pointList) {
    if (is_valid_interaction(pointList)) {
        refresh_pos(pointList);

        pixel_x = cur_x * -1 * c.width;
        pixel_y = cur_y * c.height;

        click_event(pointList);

        context.beginPath();
        context.arc(pixel_x, pixel_y, 15, 0, 2*Math.PI);
        context.closePath();
        context.strokeStyle = cur_color;
        context.fillStyle = cur_color;
        context.fill();

        frame_count++;
    }
    else {
        frame_count = 0;
    }
}

/**
 * Block to execute color menu functionality of canvas
 *
 * @param {number} pointList The set of interaction points returned by the
 * Kinect
 */
function run_cmenu(pointList) {
    if (is_valid_interaction(pointList)) {
        refresh_pos(pointList);
        click_event(pointList);
        frame_count++;
    }   else {
        frame_count = 0;
    }
}
