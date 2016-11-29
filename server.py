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
    YelpResponseObject = getYelpAccessToken()
    name = request.args.get('name')
    address = request.args.get('address')
    YelpAPIaddress = 'https://api.yelp.com/v3/businesses/search?term={{name}}&location={{address}}'  # noqa

    url = YelpAPIaddress.format(name=name, address=address)

    response = requests.get(url, headers={'Authorization': YelpResponseObject['access_token']})
    
    return jsonify(status='true', content=response)


if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)