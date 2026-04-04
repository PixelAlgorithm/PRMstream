import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './ContinueWatching.css'

function ContinueWatching({ rowRef }) {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        `${window.location.protocol}//${window.location.hostname}:3000`;

    useEffect(() => {
        const load = async () => {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData.user;

            if (!user) return;

            const { data } = await supabase
                .from("progress")
                .select("*")
                .eq("user_id", user.id)
                .order("updated_at", { ascending: false });

            if (!data) return;

            const unique = {};
            data.forEach(item => {
                const key = `${item.media_id}-${item.season}-${item.episode}`;
                if (!unique[key]) unique[key] = item;
            });

            const list = Object.values(unique);

            const enriched = await Promise.all(
                list.map(async (item) => {
                    try {
                        const url =
                            item.type === "tv"
                                ? `${API_BASE_URL}/tv/${item.media_id}/${item.season || 1}/${item.episode || 1}`
                                : `${API_BASE_URL}/movie/${item.media_id}`;

                        const res = await axios.get(url);

                        return {
                            ...item,
                            title: res.data.info.title,
                            poster: res.data.info.poster
                        };
                    } catch (err) {
                        console.log("API ERROR:", err);
                        return item;
                    }
                })
            );

            setItems(enriched);
        };

        load();
    }, []);

    if (items.length === 0) return null;

    return (
        <div className="continue-section">
            <div className="continue-row" ref={rowRef}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="video_card continue-card"
                        onClick={() =>
                            navigate(
                                `/player/${item.type}/${item.media_id}/${item.season || 1}/${item.episode || 1}`
                            )
                        }
                    >
                        <picture>
                            <img
                                className="movie-poster"
                                src={
                                    item.poster
                                        ? `https://image.tmdb.org/t/p/w500${item.poster}`
                                        : "https://via.placeholder.com/500x300?text=No+Image"
                                }
                                alt={item.title}
                            />
                        </picture>

                        <div className="details">
                            <h3>{item.title}</h3>
                            {item.season && (
                                <p>S{item.season} • E{item.episode}</p>
                            )}
                        </div>

                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${item.progress || 5}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ContinueWatching;