
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
2. You will also need to register a new app with Google Maps API and with Yelp API. **NOTE: take note of your ID and Secret in the Yelp API.**
	- Google Maps API: <a href="https://developers.google.com/maps/web/">Register Here</a>
		+ Click on the "GET A KEY" button and follow the directions.
		+ Open index.html, in the head tag, in the google maps api script tag, replace the current key in the url with your key.
	- Yelp API: <a href="https://www.yelp.com/developers/v2/manage_api_keys">Register Here</a>
		+ When you have your app_id and your app_secret, create a new file in the root folder call "yelpSecrets.json"
		+ Open "yelpSecrets.json" and create the following json object:
```json
{
	"yelp": {
		"grant_type": "client_credentials",
		"client_id": "YOUR APP_ID",
		"client_secret": "YOUR APP_SECRET"
	}
}
```
3. If you have git install you can use "git clone https://github.com/jakegornall/NeighborhoodMapProject" to download the repository.
	- NOTE: if you don't have git, you can just download it.
4. If you are already using port 5000, open server.py in the root directory and change the following code:
```python
if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=YOUR_DESIRED_PORT)
```
5. cd into the root folder and run the command "python server.py"
6. open your browser and type "http://localhost:5000 (or your own port#)" into the address bar and hit enter.
7. the app should now be running!
