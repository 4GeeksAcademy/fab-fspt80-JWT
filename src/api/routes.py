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
        data = request.json 

        nombre = data.get("nombre")
        email = data.get("email")
        password = data.get("password")

        if not nombre or not email or not password:
            return jsonify({"error": "Todos los campos son obligatorios"}), 400

        nuevo_usuario = Users(nombre=nombre, email=email)
        nuevo_usuario.set_password(password)

        db.session.add(nuevo_usuario)
        db.session.commit()

        return jsonify({"msg": "Usuario registrado con éxito"}), 201
    except Exception as e:
        db.session.rollback()
        print("Error en registro:", str(e))
        return jsonify({"error": str(e)}), 500

@api.route('/login', methods=['POST'])
@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.json

        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Datos incompletos"}), 400

        user = Users.query.filter_by(email=data['email']).first()

        if not user or not user.check_password(data['password']):
            return jsonify({"error": "Credenciales inválidas"}), 401

 
        access_token = create_access_token(identity=str(user.id))

       
        return jsonify({
            "msg": "Inicio de sesión exitoso",
            "token": access_token,
            "user": user.serialize() 
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = Users.query.get(user_id)

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        return jsonify({
            "id": user.id,
            "email": user.email,
            "nombre": user.nombre,
            "is_active": user.is_active
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt_identity()
    listed_token = List_Tokens(token=jti, toklisted_on=datetime.now(timezone.utc))
    db.session.add(listed_token)
    db.session.commit()
    return jsonify({"msg": "Successfully logged out"}), 200

