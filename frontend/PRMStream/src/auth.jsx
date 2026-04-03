import { useState } from "react";
import { supabase } from "./supabase";

function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        console.log("signup:", data, error);
    };

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        console.log("login:", data, error);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Auth</h2>

            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={handleSignup}>Sign Up</button>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Auth;