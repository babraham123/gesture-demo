from flask import Flask, request
import json
from gesture_control import getGesture, getBox
app = Flask(__name__)

@app.route('/')
def top():
    return json.dumps({"message":"Gesture Control API"})

@app.route('/gesture', methods=['POST', 'GET'])
def gesture_api():
    msg = {'service':'gesture'}
    try:
        result = getGesture(request.form['points'])
    except Exception as ex:
        msg['error'] = str(ex)
    else:
        msg['symbol'] = result
    return json.dumps(msg)

@app.route('/box', methods=['POST', 'GET'])
def box_api():
    msg = {'service':'box'}
    try:
        result = getBox(request.form['points'])
    except Exception as ex:
        msg['error'] = str(ex)
    else:
        msg['corners'] = result
    return json.dumps(msg)

# static content
#@app.route('/<path:path>')
#def static_proxy(path):
#  return app.send_static_file(path)

if __name__ == '__main__':
    app.run(port=8005)

