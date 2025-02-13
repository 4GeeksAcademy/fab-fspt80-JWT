import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleChange = (e) => {
        console.log(`📝 Campo actualizado: ${e.target.name} -> ${e.target.value}`); 
        actions.setLoginForm({ [e.target.name]: e.target.value.trim() });
    };
    const handleHome = () => {
		navigate("/")
	}

    const handleSubmit = async (e) => {
        e.preventDefault();

       

        if (!store.loginForm.nombre || !store.loginForm.email || !store.loginForm.password) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const success = await actions.register();
        if (success) {
            alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
            navigate("/login"); 
        } else {
            alert("Error en el registro. Intenta nuevamente.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="btn btn-secondary" onClick={handleHome}>Home</div>
            <h1 className="text-center">Registro</h1>
            {store.error && <div className="alert alert-danger">{store.error}</div>}
            <form onSubmit={handleSubmit} className="form-control p-4">
                <input
                    type="text"
                    placeholder="Nombre"
                    name="nombre"
                    value={store.loginForm.nombre || ""} 
                    onChange={handleChange}
                    className="form-control mb-2"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={store.loginForm.email || ""}
                    onChange={handleChange}
                    className="form-control mb-2"
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    name="password"
                    value={store.loginForm.password || ""}
                    onChange={handleChange}
                    className="form-control mb-2"
                    required
                />

                <button type="submit" className="btn btn-primary w-100" disabled={store.loading}>
                    {store.loading ? "Registrando..." : "Registrarse"}
                </button>
            </form>
        </div>
    );
};
