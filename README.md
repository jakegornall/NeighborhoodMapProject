
# NEIGHBORHOOD MAP PROJECT  
<p>WRITTEN BY: JAKE GORNALL</p>
<p>WRITTEN FOR: UDACITY - FULL STACK WEB DEVELOPMENT NANODEGREE</p>
 
#### DESCRIPTION:  
<p>At runtime, this application attempts to find the user's current location. 
once found, the user is able to search and save nearby places as well as
access a variety of information about each location via Google and Yelp APIs.
This project uses a Python Flask server</p>

#### FRAMEWORKS:  
- Flask (python server)  
- Bootstrap (CSS and Javascript) => Modal
- Knockout.js => MVVM

#### JAVASCRIPT LIBRARIES:  
- jQuery 3.1.1
- Flask-JSGlue (extends flask functions to modularized javascript)

#### PYTHON DEPENDENCIES:  
- Python 2.7+
- Flask-JSGlue
- Flask

#### APIs:  
- Google Maps
- Google PlacesService
- Yelp API

#### THE JAVASCRIPT CODE IS BROKEN INTO THE FOLLOWING SECTION (IN THIS ORDER AND HIERARCHY):  
+ Cache Repeatedly Accessed Objects/Elements  
+ Global Function Definitions  
+ Model Definitions  
+ Google Map Function (Contains the viewModel and runs the app)  
	- Knockout.js ViewModel  
	- ViewModel Extended Functions  
	- Google placesService API supporting functions

## HOW TO RUN THIS PROJECT:  
1. If you haven't already, install all above listed dependencies.
	- Python: <a href="https://www.python.org/downloads/">Install Here</a>
	- Flask: <a href="http://flask.pocoo.org/docs/0.11/installation/">Install Here</a>
	- Flask-JSGlue: <a href="http://stewartjpark.com/Flask-JSGlue/">Install Here</a>