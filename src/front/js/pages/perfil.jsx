import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.token) {
            navigate("/login");
        } else {
            actions.getProfileData(); 
        }
    }, [store.token]);
    const handleLogout = () =>{
        actions.logout()
        navigate("/login")
    }

    if (!store.user) {
        return (
            <div className="container mt-5">
                <h2 className="text-center">No has iniciado sesión</h2>
                <p className="text-center">Por favor, inicia sesión para ver tu perfil.</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center">Perfil de Usuario</h1>

            <div className="card p-4 shadow-sm">
                <h3>👤 {store.user.nombre}</h3>
                <p>📧 {store.user.email}</p>
                
                <button className="btn btn-primary mt-3" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};
