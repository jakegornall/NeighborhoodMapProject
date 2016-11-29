from flask import Flask, render_template, url_for
from flask import jsonify, request
from flask_jsglue import JSGlue
import httplib2
import urllib
import requests
import json


app = Flask(__name__)
jsglue = JSGlue(app)


def getYelpAccessToken():
    '''Retrieves access token from Yelp and returns the response'''
    yelpSecrets = json.loads(open('yelpSecrets.json', 'r').read())['yelp']
    url = 'https://api.yelp.com/oauth2/token'
    body = urllib.urlencode(yelpSecrets)

    h = httplib2.Http()
    response = h.request(url, method='POST', body=body)[1]
    return json.loads(response)


@app.route('/', methods=["GET"])
def main():
    return render_template('index.html')


@app.route('/yelpCallAPI', methods=['GET'])
def yelpCallAPI():
    try:
        YelpResponseObject = getYelpAccessToken()
    except:
        return jsonify(status='false', message='Unable to get access token...')

    try:
        name = request.args.get('name')
        address = request.args.get('address')
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')
    except:
        return jsonify(status='false', message='Error unpacking client data...')

    url = 'https://api.yelp.com/v3/businesses/search?term={name}&location={address}&latitude={latitude}&longitude={longitude}&limit=1'
    url = url.format(name=name, address=address, latitude=latitude, longitude=longitude)

    try:
        response = requests.get(
            url,
            headers={'Authorization': 'bearer %s' % YelpResponseObject['access_token']}
            )
    except:
        return jsonify(status='false', message='Error requesting data from Yelp...')
    
    return jsonify(status='true', content=json.loads(response.text))


if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)