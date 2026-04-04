import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./videoplayer.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

function VideoPlayer() {
    const navigate = useNavigate();

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        `${window.location.protocol}//${window.location.hostname}:3000`;

    const { type, id, season, episode } = useParams();

    const [servers, setServers] = useState([]);
    const [src, setSrc] = useState("");
    const [details, setDetails] = useState(null);

    const [selectedSeason, setSelectedSeason] = useState(season || 1);
    const [selectedEpisode, setSelectedEpisode] = useState(episode || 1);

    const saveProgress = async (payload) => {
        if (!payload.media_id) return;
        try {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData.user;
            if (!user) return;

            const { error } = await supabase.from("progress").upsert({
                user_id: user.id,
                media_id: payload.media_id,
                type: payload.type,
                season: payload.season,
                episode: payload.episode,
                progress: payload.progress,
                updated_at: new Date()
            },  {
                onConflict: 'user_id,media_id',
                ignoreDuplicates: false});

            if (error) console.log("Supabase error:", error);
        } catch (err) {
            console.log("Save crash:", err);
        }
    };

    useEffect(() => {
        let lastSave = 0;
        const handler = async (event) => {
            try {
                let data;

                if (typeof event.data === "string") {
                    const raw = JSON.parse(event.data);
                    data = raw.data || raw;
                } else if (event.data?.type === "PLAYER_EVENT") {
                    data = event.data.data;
                }

                if (!data) return;
                if (!data.currentTime && !data.progress) return;

                const payload = {
                    media_id: data.id || data.tmdbId,
                    type: data.mediaType || data.type,
                    season: data.season ?? null,
                    episode: data.episode ?? null,
                    progress: data.progress ??
                        (data.currentTime && data.duration
                            ? (data.currentTime / data.duration) * 100
                            : 0),
                };

                if (!payload.media_id) return;

                if (Date.now() - lastSave < 5000) return;
                lastSave = Date.now();

                saveProgress(payload);

            } catch (err) {
                // ignore bad messages
            }
        };

        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, []);

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const url = type === "tv"
                    ? `${API_BASE_URL}/tv/${id}/${selectedSeason}/${selectedEpisode}`
                    : `${API_BASE_URL}/movie/${id}`;

                const res = await axios.get(url);
                const data = res.data;

                setServers(data.servers);
                setDetails(data);

                if (data.servers?.length > 0) {
                    setSrc(data.servers[0].link);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchSources();
    }, [type, id, selectedSeason, selectedEpisode]);

    const handleEpisodeChange = (ep) => {
        setSelectedEpisode(ep);
    };

    return (
        <div className="player">

            <button className="back-btn" onClick={() => navigate("/")}>
                ← Back
            </button>

            <iframe
                className="video-player"
                src={src}
                frameBorder="0"
                allowFullScreen
            ></iframe>

            <div className="server-buttons">
                {servers.map((server) => (
                    <button
                        key={server.id}
                        onClick={() => setSrc(server.link)}
                        className={src === server.link ? "active" : ""}
                    >
                        {server.name}
                    </button>
                ))}
            </div>

            <div className="controls">
                {details && (
                    <div className="movie-info">
                        <h2>{details.info.title}</h2>
                        <p>{details.info.overview}</p>
                        <p className="meta">⭐ {details.info.rating}</p>
                    </div>
                )}

                <div className="dropdowns">
                    {details?.seasons && (
                        <select
                            value={selectedSeason}
                            onChange={(e) => setSelectedSeason(e.target.value)}
                        >
                            {details.seasons
                                .filter(s => s.season_number > 0)
                                .map((s) => (
                                    <option key={s.id} value={s.season_number}>
                                        Season {s.season_number}
                                    </option>
                                ))}
                        </select>
                    )}

                    {details?.episodes && (
                        <select
                            value={selectedEpisode}
                            onChange={(e) => handleEpisodeChange(e.target.value)}
                        >
                            {details.episodes.map((ep) => (
                                <option key={ep.id} value={ep.episode_number}>
                                    Ep {ep.episode_number} - {ep.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

        </div>
    );
}

export default VideoPlayer;