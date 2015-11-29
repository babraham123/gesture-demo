from flask import Flask, request, jsonify
import json
from gesture_control import getGesture, getBox
app = Flask(__name__)

@app.route('/')
def top():
    return jsonify({"message":"Gesture Control API"})

@app.route('/gesture', methods=['POST', 'GET'])
def gesture_api():
    msg = {'service':'gesture'}
    try:
        data = request.get_json(force=True)
        result = getGesture(data['points'])
    except Exception as ex:
        msg['error'] = str(ex)
    else:
        msg['symbol'] = result
    return jsonify(msg)

@app.route('/box', methods=['POST', 'GET'])
def box_api():
    msg = {'service':'box'}
    try:
        data = request.get_json(force=True)
        result = getBox(data['points'])
    except Exception as ex:
        msg['error'] = str(ex)
    else:
        msg['corners'] = result
    return jsonify(msg)

# static content
#@app.route('/<path:path>')
#def static_proxy(path):
#  return app.send_static_file(path)

if __name__ == '__main__':
    app.run(port=8005)

