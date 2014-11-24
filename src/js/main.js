cur_page = "canvas";

$(document).ready(function()
{
	// Show the border.
	Surface_PropertiesChanged();
	
	// Request the lowest point cube.
	Authority.request("KinectLowestPointCube", {
	relativeto : Surface.Name,                      // The surface we want information relative too.
	surface_zoffset : 0.02, // 0.015        // The height from the surface we want to accept points from (in meters).
	height:0.10,                                            // The height from the surface+offset we want to no longer accept points from (in meters).
	callback : "run",       // The function we want to call back with information.
	point_limit : 50,                                       // The max number of points to accept.
	sendemptyframes : false,                        // Do we want callbacks when we have empty frames (i.e. when we have no points at all).
	});

});

// Little snippit which fades out the border when we are changing the surface properties.
//   This makes it a bit easier to see when we are dragging the corners.
function Surface_PropertiesChanged()
{
	$("#border").show().delay(2000).fadeOut(500);
}
                        
// The number of frames where the hand has been in place.
var iFrameCount = 0;

// The starting number of "likes".
var iLikeCount = 23;

function run(pointList){
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

