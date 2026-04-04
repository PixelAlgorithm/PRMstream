import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";
import './Profile.css'
import ContinueWatching from "./ContinueWatching.jsx";

function Profile() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [progress, setProgress] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const loadData = async () => {
            const { data } = await supabase.auth.getUser();
            const currentUser = data.user;

            setUser(currentUser);

            if (!currentUser) return;
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", currentUser.id)
                .single();

            setProfile(profileData);

            // get continue watching
            const { data: progressData } = await supabase
                .from("progress")
                .select("*")
                .eq("user_id", currentUser.id)
                .order("updated_at", { ascending: false });

            setProgress(progressData || []);
        };

        loadData();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (



    <div className="profile-container">
        <button className="back-btn" onClick={() => navigate("/")}>
            ← Back
        </button>
        <div className="profile-header">
            <h2>My Profile</h2>
        </div>

        <div className="profile-card">
            <div className="profile-info">
                <p><strong>Username:</strong> {profile?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>
        </div>

        <h3 className="section-title">Continue Watching</h3>

        <div className="continue-grid">
            <ContinueWatching/>
        </div>

    </div>
    );
}

export default Profile;