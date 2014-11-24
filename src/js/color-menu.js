/**
* @brief Called by the toolkit with point cloud data.
* This is because we set it up to be called when we go: Authority.request("KinectLowestPointCube", {...args...})
* @param pointList This is a list of points in the format: [[x,y,z],[x,y,z],[x,y,z]]
*/
function run_Likes(pointList)
{
// If we have more than 40 points.
	if (pointList.length > 40)
	{
	// If the points have been there for x frames.
		if (iFrameCount == 30) {
			$("#count").text(iFrameCount + "");
		}
                                        
		// Increase the frame count.
        iFrameCount++;
	}
	
	// We have less than 40 points, so reset the counter.
	else
    {
		// We do not have a hand in place.
		iFrameCount = 0;
	}
}
