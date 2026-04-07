import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    `${window.location.protocol}//${window.location.hostname}:3000`;

function Navbar() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const navigate = useNavigate();

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length < 2) {
            setResults([]);
            return;
        }

        try {
            const res = await fetch(
                `${API_BASE_URL}/search?query=${encodeURIComponent(value)}`
            );
            const data = await res.json();

            const filtered = data.results.filter(
                (item) =>
                    (item.media_type === "movie" || item.media_type === "tv") &&
                    item.poster_path
            );

            setResults(filtered.slice(0, 6));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelect = (item) => {
        setOpen(false);
        setQuery("");
        setResults([]);
        navigate(`/player/${item.media_type}/${item.id}`);
    };

    return (
        <div className="navbar">
            <h2 className="logo">PRMstream</h2>

            <div className="nav-center">
                {open && (
                    <div className="search-wrapper">
                        <input
                            type="text"
                            className="nav-search"
                            placeholder="Search titles..."
                            value={query}
                            onChange={handleSearch}
                            autoFocus
                        />

                        <div className="search-results">
                            {results.map((item) => (
                                <div
                                    key={item.id}
                                    className="search-item"
                                    onClick={() => handleSelect(item)}
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                        alt=""
                                    />
                                    <span>{item.title || item.name}</span>
                                </div>
                            ))}

                            {query.length >= 2 && (
                                <div
                                    className="show-all"
                                    onClick={() => {
                                        setOpen(false);
                                        navigate(`/search?q=${query}`);
                                    }}
                                >
                                    Show all results →
                                </div>
                            )}

                            {query.length >= 2 && results.length === 0 && (
                                <p className="no-results">No results</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="nav-right">
                <Link to="/">Home</Link>
                <Link to="/profile">Profile</Link>

                <span className="search-icon" onClick={() => setOpen(!open)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={open ? "icon-active" : ""}
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>
            </div>
        </div>
    );
}

export default Navbar;