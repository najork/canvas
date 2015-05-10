/*
 * Copyright (c) 2014 Dustin Bui, Maximilian Najork, Zachary Nowicki, Danyaal Rangwala
 * All rights reserved. Licensed under the MIT License. See LICENSE.txt for more information.
 */

/**
 * ~ Canvas ~
 *
 * An interactive coloring book web application that utilizes data from a
 * Microsoft Kinect to enable users to draw on a projected surface with their
 * body
 *
 * Run using Ubi Displays software (found at https://code.google.com/p/ubidisplays)
 *
 * @author Dustin Bui, Maximilian Najork, Zachary Nowicki, Danyaal Rangwala
 */


////////////////////////////////
/* -- CANVAS STATE GLOBALS -- */
////////////////////////////////

/* Current page being displayed */
CUR_PAGE = 'canvas';
/* Current color being used */
CUR_COLOR = '#000000';
/* Brush erase state */
IS_ERASE = false;


///////////////////////////////
/* -- INTERACTION GLOBALS -- */
///////////////////////////////

/* Consecutive frames of current interaction */
FRAME_COUNT = 0;
/* Average x-coord of current interaction */
CUR_X = -1;
/* Average y-coord of current interaction */
CUR_Y = -1;


/////////////////////////
/* -- USAGE GLOBALS -- */
/////////////////////////

/* Minimum adjacent points of valid interaction */
MIN_ADJ = 40;
/* Refresh rate of Microsoft Kinect (30 Hz) */
FPS = 30;
/* Seconds to trigger click event */
SECONDS_TO_CLICK = 1;


/////////////////////////
/* -- CANVAS DRIVER -- */
/////////////////////////

$(document).ready(function() {
    /* Canvas element */
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    /* Width and height of the canvas */
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    /* Defines mainMenuButton click event */
    $('#mainMenuButton').click(function() {
        CUR_PAGE = 'main_menu';
        FRAME_COUNT = 0;
        $('#myCanvas').hide();
        $('#colorMenuButton').hide();
        $('#backButton').show();
        $('#mainMenu').show();
        $('#mainMenuButton').hide();
    });

    /* Defines backButton click event */
    $('#backButton').click(function() {
        FRAME_COUNT = 0;
        $('#colorMenuButton').trigger('click');
        $('#colorMenuButton').show();
    });

    /* Defines saveButton click event */
    $('#saveButton').click(function() {
        CUR_PAGE = 'canvas';
        FRAME_COUNT = 0;
        var dataURL = canvas.toDataURL('image/png');
        this.href = dataURL;
    });

    /* Defines clearButton click event */
    $('#clearButton').click(function() {
        CUR_COLOR = '#000000';
        $('#colorMenuButton').css('background', CUR_COLOR);
        context.clearRect(0, 0, canvas.width, canvas.height);
        $('#colorMenuButton').trigger('click');
    });

    /* Defines eraseButton click event */
    $('#eraserButton').click(function() {
        IS_ERASE = true;
        FRAME_COUNT = 0;
        $('#colorMenuButton').trigger('click');
        $('#colorMenuButton img').attr("src", "icons/eraser.png");
        $('#colorMenuButton').css('background', '#fefefe');
    });

    /* Defines color selection event */
    $('.color').click(function() {
        CUR_COLOR = $(this).attr('value');
        IS_ERASE = false;
        FRAME_COUNT = 0;
        var rgb = $(this).css('background');
        $('#colorMenuButton').css('background', rgb);
        $('#colorMenuButton img').attr("src", "icons/back.png");
    });

    /* Defines colorMenuButton click event */
    $('#colorMenuButton').click(function() {
        FRAME_COUNT = 0;
        switch(CUR_PAGE) {
            case 'canvas':
                CUR_PAGE = 'color_menu';
                $('#myCanvas').hide();
                $('#mainMenuButton').hide();
                $('#eraserButton').show();
                $('.menu').show();
                break;
            case 'color_menu':
                CUR_PAGE = 'canvas';
                $('.menu').hide();
                $('#myCanvas').show();
                $('#colorMenuButton img').attr("src", "icons/brush.png");
                $('#eraserButton').hide();
                $('#mainMenuButton').show();
                break;
            case 'main_menu':
                CUR_PAGE = 'canvas';
                $('#mainMenu').hide();
                $('#myCanvas').show();
                $('#mainMenuButton').show();
                $('#backButton').hide();
                $('#colorMenuButton').show();
                $('#eraserButton').hide();
                break;
            default:
                // Should never reach
                break;
        }
    });

    /* Fade border effect informs user js loaded correctly */
    fade_border();

    /* Wait for user interaction */
    Authority.request('KinectLowestPointCube', {
    relativeto      : Surface.Name,
    surface_zoffset : 0.042,            // Offset to begin accepting points (in meters)
    height          : 0.045,            // Offset to stop accepting points (in meters)
    callback        : 'run',            // Function to pass return data from KinectLowestPointCube
    point_limit     : 50,               // Max points to accept
    sendemptyframes : true,             // Callback even if no inputs
    });

});

/** Run main canvas loop */
function run(pointList) {
    switch(CUR_PAGE) {
        case 'canvas':
            run_canvas(pointList);
            break;
        case 'color_menu':
            run_menu(pointList);
            break;
        case 'main_menu':
            run_menu(pointList);
            break;
        default:
            // Should never reach
            break;
    }
}

/** Draw and fade border on page load */
function fade_border() {
    $('#border').show().delay(2000).fadeOut(500);
}

/** Compute average interaction position from set of interactions */
function comp_axis_avg(values, comp) {
    var total = 0;
    for (var i = 0; i < values.length; ++i)
        total += values[i][comp];
    return total / values.length;
}

/** Refresh current position of interation */
function refresh_pos(pointList) {
    CUR_X = comp_axis_avg(pointList, 0).toPrecision(3);
    CUR_Y = comp_axis_avg(pointList, 1).toPrecision(3);
}

/** Save the current canvas as a PNG */
function saveImage() {
    var dataURL = canvas.toDataURL('image/png');
    canvas.src = dataURL;
    localStorage.setItem('img', dataURL);
}

/**
 * Convert seconds to frames based on the refresh rate of the Microsoft
 * Kinect (30 Hz)
 *
 * @param {number} seconds The number of seconds to convert to number of frames
 * @return {number} The number of frames equivalent to the seconds inputted
 */
function seconds_to_frames(seconds) {
    return seconds * FPS;
}

/**
 * Convert seconds to frames based on the refresh rate of the Microsoft
 * Kinect (30 Hz)
 *
 * @param {number} pointList The set of interaction points returned by the
 * Kinect
 * @return {boolean} True if number of points registered together is greater
 * than MIN_ADJ
 */
function is_valid_interaction(pointList) {
    return pointList.length > MIN_ADJ;
}

/**
 * Generate a random color
 *
 * @return {string} A hexadecimal representation of a color
 */
function random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; ++i)
        color += letters[Math.floor(Math.random() * 16)];
    return color;
}

/**
 * Generate a random size
 *
 * @param {number} Scalar multiple for the random number
 * @return {number} A random number in the range [0, num)
 */
function random_size(num) {
    var size = Math.random() * num;
    return size;
}

/**
 * Execute a click event on the page at a given point of interaction
 *
 * @param {number} pointList The set of interaction points returned by the
 * Kinect
 */
function click_event(pointList) {
    /* Store last position */
    var last_x = CUR_X;
    var last_y = CUR_Y;

    /* Get current position */
    refresh_pos(pointList);

    if (FRAME_COUNT >= seconds_to_frames(SECONDS_TO_CLICK)) {
        var pixel_x = CUR_X * -1 * canvas.width;
        var pixel_y = CUR_Y * canvas.height;
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
        click_event(pointList);

        var size = random_size(30) + 5;
        var arc = 2*Math.PI;

        if (!IS_ERASE) {
            context.globalAlpha = random_size(1);
        } else {
            CUR_COLOR = '#ffffff';
            context.globalAlpha = 1.0;
            size = 30;
        }

        var pixel_x = CUR_X * -1 * canvas.width;
        var pixel_y = CUR_Y * canvas.height;

        context.beginPath();
        context.arc(pixel_x, pixel_y, size, 0, arc);
        context.closePath();
        context.strokeStyle = CUR_COLOR;
        context.fillStyle = CUR_COLOR;
        context.fill();

        ++FRAME_COUNT;
    } else {
        FRAME_COUNT = 0;
    }
}

/**
 * Block to execute menu functionality of canvas
 *
 * @param {number} pointList The set of interaction points returned by the
 * Kinect
 */
function run_menu(pointList) {
    if (is_valid_interaction(pointList)) {
        refresh_pos(pointList);
        click_event(pointList);
        ++FRAME_COUNT;
    } else {
        FRAME_COUNT = 0;
    }
}
