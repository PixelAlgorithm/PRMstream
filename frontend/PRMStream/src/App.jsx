import Video_card from './video_card.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoPlayer from './videoplayer.jsx';
import Homepage from './Homepage.jsx';
import Auth from './Auth.jsx';
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Profile from "./Profile";
import Navbar from "./Navbar.jsx";
import SearchPage from "./SearchPage.jsx";

function App()
{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            setLoading(false);
        };

        getUser();

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user || null);
            }
        );

        return () => listener.subscription.unsubscribe();
    }, []);
    if (loading) return <p>Loading...</p>;

    if (!user) return <Auth />;

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route
                    path="/player/:type/:id/:season?/:episode?"
                    element={<VideoPlayer />}
                />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );

}

export default App;