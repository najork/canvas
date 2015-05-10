~ Canvas ~
===============
Canvas is an interactive coloring "book" that utilizes data from a Microsoft
Kinect sensor to control a projected image on a flexible surface. Canvas
enables users to interact with and draw on the surface via their hands (and
other limbs). Front-end functionality is implemented through a dynamic web
application built using HTML, Javascript, and JQuery, while back-end support is
provided by Ubi Displays, an open-source package that provides an API which
converts the raw Kinect data into real-time events.

Made possible using Ubi Displays software (found at https://code.google.com/p/ubidisplays).

Icons from GLYPHICONS (found at https://glyphicons.com).

Compatible with Windows 7 and 8.


Abstract
---------------
Autism is a neurological disorder that debilitates a person’s ability to
communicate and interact in a social setting. People with autism have special
educational needs that can be satisfied with technology. It is important to
address the needs of people with autism to prevent them from struggling more
with tasks that people who aren’t diagnosed with ASD would normally take for
granted.

Canvas is designed to promote social interaction and alleviate proprioceptive
issues in children with ASD by allowing them to collaborate with their parents,
caretakers, and friends, and engage in artistic expression on an arbitrarily
large scale.


Set Up
---------------
1. Create a local clone of this repository
2. Download the Ubi Displays installer (found at https://code.google.com/p/ubidisplays/downloads)
3. Install Ubi Displays
4. Plug the Microsoft Kinect into your computer
5. Plug the projector into your computer
6. Launch Ubi Displays, and perform the following steps within its interface
7. Select the projector and Kinect as the devices to use
8. Follow the on-screen calibration instructions
9. Create a rectangular surface within the projected area
10. Drag and drop main.html from the top level of the code repository onto the newly created surface
11. Verify that a white border appears then slowly fades on the projected surface, signifying that the software has loaded correctly


Usage
---------------
* On startup, Canvas loads a blank canvas
* Draw on the canvas via interactions with the screen (hovering/pressing on a location)
* Click buttons to access menus and select options by hovering your hand over them for several seconds
* Access the color menu from the canvas by interacting with the circular icon with a paintbrush emblem in it
* Access the main menu from the canvas by interacting with the circular icon with a gear emblem in it
* Return to the canvas from either of the menus by interacting with the circular icon with a left-facing arrow in it

Debug
---------------
The debugging interface for Ubi can be accessed by pointing your web browser to
http://localhost:9222

Note that the debugger's functionality has only been tested with Google Chrome - other web browsers may not be supported.


Authors
---------------
Dustin Bui  
Maximilian Najork  
Zachary Nowicki  
Danyaal Rangwala  

Created for EECS 481 under Professor David Chesney  
University of Michigan College of Engineering
