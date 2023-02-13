from flask import Blueprint, Response, request
import json
import sys
sys.path.insert(0, './controller')
from room_controller import RoomController
room_bp = Blueprint('room_bp', __name__)

@room_bp.route('/api/room/<int:room_no>',methods=['GET'])
def get_room(room_no):
    room_controller=RoomController()
    room_data=room_controller.get_room_details(room_no)
    print(room_data)
    return Response(json.dumps(room_data), mimetype='application/json', status=200)


