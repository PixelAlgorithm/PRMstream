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

    /* =========================
       SAVE PROGRESS
    ========================= */
    const saveProgress = async (payload) => {
        try {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData.user;
            if (!user) return;

            await supabase.from("progress").upsert({
                user_id: user.id,
                media_id: payload.media_id,
                type: payload.type,
                season: payload.season,
                episode: payload.episode,
                progress: payload.progress,
                updated_at: new Date()
            }, {
                onConflict: "user_id,media_id"
            });

        } catch (err) {
            console.log("Save error:", err);
        }
    };

    /* =========================
       PLAYER EVENTS (ALL SERVERS)
    ========================= */
    useEffect(() => {
        let lastSave = 0;

        const handler = async (event) => {
            try {
                let data;

                // VidKing / VidEasy (string)
                if (typeof event.data === "string") {
                    try {
                        const parsed = JSON.parse(event.data);
                        if (parsed?.type === "PLAYER_EVENT") {
                            data = parsed.data;
                        }
                    } catch {
                        return;
                    }
                }

                // VidLink (object)
                else if (event.data?.type === "PLAYER_EVENT") {
                    data = event.data.data;
                }

                if (!data) return;
                if (!data.currentTime || !data.duration) return;

                const progress =
                    data.progress ??
                    (data.currentTime / data.duration) * 100;

                if (Date.now() - lastSave < 5000) return;
                lastSave = Date.now();

                saveProgress({
                    media_id: data.id || data.tmdbId || id,
                    type: data.mediaType || data.type || type,
                    season: data.season ?? selectedSeason ?? null,
                    episode: data.episode ?? selectedEpisode ?? null,
                    progress
                });

            } catch {}
        };

        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);

    }, [id, type, selectedSeason, selectedEpisode]);

    /* =========================
       FETCH SOURCES
    ========================= */
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

                // ✅ Default = VidKing
                const vidking = data.servers.find(s => s.name === "VidKing");
                const defaultServer = vidking || data.servers[0];

                setSrc(defaultServer?.link || "");

            } catch (err) {
                console.error(err);
            }
        };

        fetchSources();
    }, [type, id, selectedSeason, selectedEpisode]);

    /* =========================
       UI
    ========================= */
    return (
        <div className="player">

            <button className="back-btn" onClick={() => navigate("/")}>
                ← Back
            </button>

            <iframe
                key={src}
                className="video-player"
                src={src}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
            ></iframe>

            {/* 🔌 SERVERS */}
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

                {/* 🎬 INFO */}
                {details && (
                    <div className="movie-info">
                        <h2>{details.info.title}</h2>
                        <p>{details.info.overview}</p>
                        <p className="meta">⭐ {details.info.rating}</p>
                    </div>
                )}

                {/* 🎬 SELECTORS */}
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
                            onChange={(e) => setSelectedEpisode(e.target.value)}
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