import Video_card from "./video_card.jsx";
import ContinueWatching from "./ContinueWatching.jsx";
import './Homepage.css'
import axios from 'axios'
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    `${window.location.protocol}//${window.location.hostname}:3000`;

function Homepage() {
    const navigate = useNavigate();

    const [heroList, setHeroList] = useState([]);
    const [heroIndex, setHeroIndex] = useState(0);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);

    const continueRef = useRef();
    const popularRef = useRef();
    const topRatedRef = useRef();
    const actionRef = useRef();

    useEffect(() => {
        const load = async () => {
            try {
                const [popRes, topRes, actionRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/popular`),
                    axios.get(`${API_BASE_URL}/discover/movie?sort_by=vote_average.desc&vote_count.gte=1000`),
                    axios.get(`${API_BASE_URL}/discover/movie/genre/28`)
                ]);

                const popData = popRes.data.results;

                setHeroList(popData.slice(0, 5));
                setPopular(popData.slice(5));
                setTopRated(topRes.data.results);
                setActionMovies(actionRes.data.results);
            } catch (err) {
                console.error(err);
            }
        };

        load();
    }, []);

    useEffect(() => {
        if (heroList.length === 0) return;

        const interval = setInterval(() => {
            setHeroIndex(prev => (prev + 1) % heroList.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [heroList]);

    const hero = heroList[heroIndex];

    const scroll = (ref, dir) => {
        const width = ref.current.clientWidth;
        ref.current.scrollBy({
            left: dir === "left" ? -width : width,
            behavior: "smooth"
        });
    };

    return (
        <div className="Homepage">

            {hero && (
                <div
                    className="hero"
                    style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original${hero.backdrop_path})`
                    }}
                >
                    <div className="hero-overlay">
                        <h1>{hero.title || hero.name}</h1>
                        <p className="hero-desc">{hero.overview?.slice(0, 140)}...</p>
                        <button
                            className="watch-btn"
                            onClick={() =>
                                navigate(`/player/${hero.media_type || "movie"}/${hero.id}`)
                            }
                        >
                            ▶ Watch Now
                        </button>
                    </div>
                </div>
            )}

            <h2 className="section-title">Continue Watching</h2>
            <div className="row-wrapper">
                <button onClick={() => scroll(continueRef, "left")} className="scroll-btn left">‹</button>
                <ContinueWatching rowRef={continueRef} />
                <button onClick={() => scroll(continueRef, "right")} className="scroll-btn right">›</button>
            </div>

            <h2 className="section-title">Popular</h2>
            <div className="row-wrapper">
                <button onClick={() => scroll(popularRef, "left")} className="scroll-btn left">‹</button>
                <div className="popular-row" ref={popularRef}>
                    {popular.map(item => <Video_card key={item.id} item={item} />)}
                </div>
                <button onClick={() => scroll(popularRef, "right")} className="scroll-btn right">›</button>
            </div>

            <h2 className="section-title">Top Rated</h2>
            <div className="row-wrapper">
                <button onClick={() => scroll(topRatedRef, "left")} className="scroll-btn left">‹</button>
                <div className="popular-row" ref={topRatedRef}>
                    {topRated.map(item => <Video_card key={item.id} item={item} />)}
                </div>
                <button onClick={() => scroll(topRatedRef, "right")} className="scroll-btn right">›</button>
            </div>

            <h2 className="section-title">Action</h2>
            <div className="row-wrapper">
                <button onClick={() => scroll(actionRef, "left")} className="scroll-btn left">‹</button>
                <div className="popular-row" ref={actionRef}>
                    {actionMovies.map(item => <Video_card key={item.id} item={item} />)}
                </div>
                <button onClick={() => scroll(actionRef, "right")} className="scroll-btn right">›</button>
            </div>

        </div>
    );
}

export default Homepage;