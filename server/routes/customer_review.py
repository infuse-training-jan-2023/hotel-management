from flask import Blueprint, Response
from bson.objectid import ObjectId
import sys
sys.path.insert(0, './controller')
from bson import json_util
from review import ReviewController

review_bp=Blueprint('review_bp',__name__)
@review_bp.route("/api/review", methods = ['POST'])
def customer_review():
    review = ReviewController()
    data = {"rating":2,"feedback":"recommended","name":"rohan","_id":ObjectId('63e68ea543eefbbf88459d29')}
    customer = review.customer_review(data)        
    return Response(json_util.dumps(customer), status=201, mimetype="application/json")

@review_bp.route("/api/get_all_review", methods = ['GET'])
def get_all_review():
    review = ReviewController()
    all_review = review.get_all_reviews()
    return Response(json_util.dumps(all_review), status=200, mimetype="application/json")