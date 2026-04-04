import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Video_card from "./video_card.jsx";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    `${window.location.protocol}//${window.location.hostname}:3000`;

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!query) return;

        const fetch_ = async () => {
            const res = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
            const data = await res.json();
            const filtered = data.results.filter(
                item => (item.media_type === "movie" || item.media_type === "tv") && item.poster_path
            );
            setResults(filtered);
        };

        fetch_();
    }, [query]);

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ color: "white", marginBottom: "20px" }}>Results for "{query}"</h2>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "16px"
            }}>
                {results.map(item => <Video_card key={item.id} item={item} />)}
            </div>
        </div>
    );
}

export default SearchPage;