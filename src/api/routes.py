"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, List_Tokens
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime, timedelta, timezone

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/register', methods=['POST'])
def register():
    try:
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        
        if not email or not password:
            raise Exception('Missing email or password')
        
        if not Users.query.filter_by(email=email).first():

            new_user = Users(email=email, is_active=True)
            new_user.set_password(password)
            db.session.add(new_user)
            db.session.commit()
            acces_token = create_access_token(identity=str(new_user.id))
            return jsonify({"msg": "User registered successfully", 'token': acces_token}), 201
        return jsonify({"msg": "User already exists, try login"}), 400
    except Exception as error:   
        return jsonify({"error": str(error)}), 400


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = Users.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=1))
    return jsonify({"token": token}), 200

#Auth Validation
@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    user_id = get_jwt_identity()
    current_user = Users.query.get(int(user_id))
    if not current_user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify({"msg": f"Welcome {current_user.email}!"}), 200


@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt_identity()
    listed_token = List_Tokens(token=jti, toklisted_on=datetime.now(timezone.utc))
    db.session.add(listed_token)
    db.session.commit()
    return jsonify({"msg": "Successfully logged out"}), 200

