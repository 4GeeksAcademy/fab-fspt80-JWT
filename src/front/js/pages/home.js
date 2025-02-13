import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { SignUp } from "../component/signup.jsx";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleRegister = () => {
		navigate("/signup")
	}
	const handleLogin = () => {
		navigate("/login")
	}

	return (
		<>
			<div className="mt-5 d-flex justify-content-center">
				<div className="btn btn-info text-white pointer me-2" onClick={handleRegister}>Registro</div>
				<div className="btn btn-warning text-white pointer" onClick={handleLogin}>Login</div>
			</div>
		
		</>
		
	);
};
