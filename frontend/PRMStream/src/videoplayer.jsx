import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "./supabase";
import "./videoplayer.css";

function VideoPlayer() {
    const navigate = useNavigate();

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        `${window.location.protocol}//${window.location.hostname}:3000`;

    const { type, id, season, episode } = useParams();

    const [servers, setServers] = useState([]);
    const [src, setSrc] = useState(null);
    const [details, setDetails] = useState(null);

    const [selectedSeason, setSelectedSeason] = useState(season || 1);
    const [selectedEpisode, setSelectedEpisode] = useState(episode || 1);

    // 🔥 Save progress
    const saveProgress = async (payload) => {
        if (!payload.media_id) return;

        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;
        if (!user) return;

        await supabase.from("progress").upsert(
            {
                user_id: user.id,
                media_id: payload.media_id,
                type: payload.type,
                season: payload.season,
                episode: payload.episode,
                progress: payload.progress,
                updated_at: new Date()
            },
            { onConflict: "user_id,media_id" }
        );
    };

    // 🔥 Listen to player events (ALL servers)
    useEffect(() => {
        let lastSave = 0;

        const handler = (event) => {
            try {
                let data;

                // ✅ VidKing / VideoEasy (string JSON)
                if (typeof event.data === "string") {
                    data = JSON.parse(event.data);
                    data = data.data || data;
                }

                // ✅ VidLink
                else if (event.data?.type === "PLAYER_EVENT") {
                    data = event.data.data;
                }

                if (!data) return;

                const payload = {
                    media_id: data.id || data.tmdbId,
                    type: data.mediaType || data.type,
                    season: data.season ?? null,
                    episode: data.episode ?? null,
                    progress:
                        data.progress ||
                        (data.currentTime && data.duration
                            ? (data.currentTime / data.duration) * 100
                            : 0)
                };

                if (!payload.media_id) return;

                // ⏱ throttle
                if (Date.now() - lastSave < 5000) return;
                lastSave = Date.now();

                saveProgress(payload);

            } catch (err) {
                // ignore
            }
        };

        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, []);

    // 🔥 Fetch data
    useEffect(() => {
        const fetchSources = async () => {
            try {
                const url =
                    type === "tv"
                        ? `${API_BASE_URL}/tv/${id}/${selectedSeason}/${selectedEpisode}`
                        : `${API_BASE_URL}/movie/${id}`;

                const res = await axios.get(url);
                const data = res.data;

                setServers(data.servers || []);
                setDetails(data);

                // ✅ default = VidKing (first server)
                if (data.servers?.length > 0) {
                    setSrc(data.servers[0].link);
                }

            } catch (err) {
                console.error(err);
            }
        };

        fetchSources();
    }, [type, id, selectedSeason, selectedEpisode]);

    return (
        <div className="player">

            <button className="back-btn" onClick={() => navigate("/")}>
                ← Back
            </button>

            {/* ✅ SAFE iframe */}
            {src && (
                <iframe
                    key={src + selectedEpisode + selectedSeason}
                    className="video-player"
                    src={src}
                    width="100%"
                    height="600"
                    frameBorder="0"
                    allowFullScreen
                />
            )}

            {/* 🔥 Servers */}
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

            {/* 🔥 Info */}
            {details && (
                <div className="controls">

                    <div className="movie-info">
                        <h2>{details.info.title}</h2>
                        <p>{details.info.overview}</p>
                        <p className="meta">⭐ {details.info.rating}</p>
                    </div>

                    {/* 🎬 TV controls */}
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
            )}

        </div>
    );
}

export default VideoPlayer;