import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./videoplayer.css";
import { useNavigate } from "react-router-dom";



function VideoPlayer() {
    const navigate = useNavigate();

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL ||
        `${window.location.protocol}//${window.location.hostname}:3000`;

    const { type, id, season, episode } = useParams();

    const [servers, setServers] = useState([]);
    const [src, setSrc] = useState("");

    useEffect(() => {
        const fetchSources = async () => {
            try {
                let url;

                if (type === "tv") {
                    const s = season || 1;
                    const e = episode || 1;
                    url = `${API_BASE_URL}/tv/${id}/${s}/${e}`;
                } else {
                    url = `${API_BASE_URL}/movie/${id}`;
                }

                const res = await axios.get(url);
                const data = res.data.data || res.data;

                setServers(data);

                if (data.length > 0) {
                    setSrc(data[0].link);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchSources();
    }, [type, id, season, episode]);

    const handleServerChange = (link) => {
        setSrc(link);
    };

    return (
        <div className="player">
            <button className="back-btn" onClick={() => navigate("/")}>
                ← Back
            </button>
            <iframe
                className="video-player"
                src={src}
                width="50%"
                height="40%"
                frameBorder="0"
                allowFullScreen
            ></iframe>
            <div className="server-buttons">

                {servers.map((server) => (

                    <button
                        key={server.id}
                        onClick={() => handleServerChange(server.link)}
                        className={src === server.link ? "active" : ""}
                    >
                        Server {server.id}
                    </button>
                ))}
            </div>


        </div>
    );
}

export default VideoPlayer;