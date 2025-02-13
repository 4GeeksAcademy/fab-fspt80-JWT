const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            user: null,
            token: localStorage.getItem("token") || null,
            error: null,
            loading: false,
            loginForm: {  nombre: "", email: "", password: "" }
        },

        actions: {
            register: async () => {
                try {
                    const store = getStore();
                    const { nombre, email, password } = store.loginForm;
                    
                    
                    if (!nombre || !email || !password) {
                        console.error("Error: Falta completar todos los campos:", { nombre, email, password });
                        throw new Error("Todos los campos son obligatorios");
                    }
            
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/register`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ nombre, email, password })
                    });
            
                    if (!resp.ok) {
                        const errorResponse = await resp.json();
                        throw new Error(errorResponse.error || "Error en el registro");
                    }
            
                    console.log("Registro exitoso");
                    setStore({ loading: false, loginForm: { nombre: "", email: "", password: "" } });
                    return true;
                } catch (error) {
                    console.error("Error en el registro:", error);
                    setStore({ error: error.message, loading: false });
                    return false;
                }
            },
            
            
            setLoginForm: (update) => {
                const store = getStore();
                setStore({ loginForm: { ...store.loginForm, ...update } });
               
            },

            login: async (email, password) => {
                try {
                    setStore({ loading: true, error: null });

                    const resp = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password })
                    });

                    if (!resp.ok) {
                        const errorResponse = await resp.json();
                        throw new Error(errorResponse.error || "Error en el login");
                    }

                    const data = await resp.json();
                    localStorage.setItem("token", data.token);
                    setStore({ token: data.token, user: data.user, loading: false, loginForm: { email: "", password: "" } });

                    console.log("Inicio de sesión exitoso:", data);
                    await getActions().getProfileData();

                    return true;
                } catch (error) {
                    console.error("Error al iniciar sesión:", error);
                    setStore({ error: error.message, loading: false });
                    return false;
                }
            },
            getProfileData: async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        console.error("Usuario no autenticado.");
                        return;
                    }
            
                    
            
                    const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    });
            
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Error en perfil: ${errorText}`);
                    }
            
                    const data = await response.json();
                    
            
                    setStore({ user: data.user });
                } catch (error) {
                    console.error("Error cargando perfil:", error);
                }
            },            
            logout: () => {
                localStorage.removeItem("token");
                setStore({ token: null, user: null, loginForm: {nombre: "", email: "", password: "" } });
                console.log("Cierre de sesión exitoso");
            }

        }
    };
};

export default getState;
