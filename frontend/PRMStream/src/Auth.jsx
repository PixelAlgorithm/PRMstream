import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import "./auth.css";

function Auth() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isSignup, setIsSignup] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 🔐 Get user + profile
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            const currentUser = data.user;
            setUser(currentUser);

            if (currentUser) {
                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", currentUser.id)
                    .single();

                setProfile(profileData);
            }
        };

        getUser();

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                const currentUser = session?.user || null;
                setUser(currentUser);

                if (currentUser) {
                    const { data: profileData } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", currentUser.id)
                        .single();

                    setProfile(profileData);
                } else {
                    setProfile(null);
                }
            }
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    // ✅ Signup
    const handleSignup = async () => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            alert(error.message);
            return;
        }

        await supabase.from("profiles").insert({
            id: data.user.id,
            username,
            email
        });

        alert("Signup successful!");
    };

    // ✅ Login (EMAIL ONLY)
    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) alert(error.message);
    };

    // ✅ Logout
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-box">

                {user ? (
                    <>
                        <h2>Welcome</h2>
                        <p><strong>{profile?.username || "User"}</strong></p>
                        <p>{user.email}</p>

                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <h2>{isSignup ? "Sign Up" : "Login"}</h2>

                        {isSignup && (
                            <input
                                type="text"
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        )}

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

                        <button onClick={isSignup ? handleSignup : handleLogin}>
                            {isSignup ? "Sign Up" : "Login"}
                        </button>

                        <p
                            className="switch"
                            onClick={() => setIsSignup(!isSignup)}
                        >
                            {isSignup
                                ? "Already have an account? Login"
                                : "Don't have an account? Sign Up"}
                        </p>
                    </>
                )}

            </div>
        </div>
    );
}

export default Auth;