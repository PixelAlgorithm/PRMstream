import Video_card from "./video_card.jsx";
import ContinueWatching from "./ContinueWatching.jsx";
import "./Homepage.css";
import axios from "axios";
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

    const [trendingMovies, setTrendingMovies] = useState([]);
    const [trendingTV, setTrendingTV] = useState([]);
    const [topRatedTV, setTopRatedTV] = useState([]);

    const continueRef = useRef();
    const popularRef = useRef();
    const topRatedRef = useRef();
    const actionRef = useRef();
    const trendMovieRef = useRef();
    const trendTvRef = useRef();
    const topTvRef = useRef();

    useEffect(() => {
        const load = async () => {
            try {
                const [
                    popRes,
                    topRes,
                    actionRes,
                    trendMovieRes,
                    trendTvRes,
                    topTvRes
                ] = await Promise.all([
                    axios.get(`${API_BASE_URL}/popular`),
                    axios.get(`${API_BASE_URL}/discover/movie?sort_by=vote_average.desc&vote_count.gte=1000`),
                    axios.get(`${API_BASE_URL}/discover/movie/genre/28`),
                    axios.get(`${API_BASE_URL}/trending/movie`),
                    axios.get(`${API_BASE_URL}/trending/tv`),
                    axios.get(`${API_BASE_URL}/top-rated/tv`)
                ]);

                const popData = popRes.data.results;

                setHeroList(popData.slice(0, 5));
                setPopular(popData.slice(5));
                setTopRated(topRes.data.results);
                setActionMovies(actionRes.data.results);

                setTrendingMovies(trendMovieRes.data.results);
                setTrendingTV(trendTvRes.data.results);
                setTopRatedTV(topTvRes.data.results);

            } catch (err) {
                console.error(err);
            }
        };

        load();
    }, []);

    useEffect(() => {
        if (!heroList.length) return;

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

    const Row = ({ title, data, refObj }) => (
        <>
            <h2 className="section-title">{title}</h2>
            <div className="row-wrapper">
                <button onClick={() => scroll(refObj, "left")} className="scroll-btn left">‹</button>

                <div className="popular-row" ref={refObj}>
                    {data.map(item => (
                        <Video_card key={item.id} item={item} />
                    ))}
                </div>

                <button onClick={() => scroll(refObj, "right")} className="scroll-btn right">›</button>
            </div>
        </>
    );

    return (
        <div className="Homepage">

            {/* 🎬 HERO */}
            {hero && (
                <div
                    className="hero"
                    style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original${hero.backdrop_path})`
                    }}
                >
                    <div className="hero-overlay">
                        <h1>{hero.title || hero.name}</h1>
                        <p className="hero-desc">
                            {hero.overview?.slice(0, 140)}...
                        </p>

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

            {/* 🔥 CONTINUE */}
            <h2 className="section-title">Continue Watching</h2>
            <div className="row-wrapper">
                <button onClick={() => scroll(continueRef, "left")} className="scroll-btn left">‹</button>
                <ContinueWatching rowRef={continueRef} />
                <button onClick={() => scroll(continueRef, "right")} className="scroll-btn right">›</button>
            </div>

            {/* 🎬 ROWS */}
            <Row title="Popular" data={popular} refObj={popularRef} />
            <Row title="Top Rated" data={topRated} refObj={topRatedRef} />
            <Row title="Action" data={actionMovies} refObj={actionRef} />
            <Row title="Trending Movies" data={trendingMovies} refObj={trendMovieRef} />
            <Row title="Trending TV" data={trendingTV} refObj={trendTvRef} />
            <Row title="Top Rated TV" data={topRatedTV} refObj={topTvRef} />

        </div>
    );
}

export default Homepage;