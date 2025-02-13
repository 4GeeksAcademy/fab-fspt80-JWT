import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleChange = (e) => {
        actions.setLoginForm({ [e.target.name]: e.target.value });
    };

    const handleHome = () => {
		navigate("/")
	}

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.login(store.loginForm.email, store.loginForm.password);
        if (success) {
            navigate("/perfil");
        }
    };

    return (
        <div className="container mt-5">
            <div className="btn btn-secondary" onClick={handleHome}>Home</div>
            <h2 className="text-center">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={store.loginForm.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={store.loginForm.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {store.error && <div className="alert alert-danger">{store.error}</div>}
                <button type="submit" className="btn btn-primary w-100" disabled={store.loading}>
                    {store.loading ? "Cargando..." : "Iniciar Sesión"}
                </button>
            </form>
        </div>
    );
};
