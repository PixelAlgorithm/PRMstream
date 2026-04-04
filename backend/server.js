const cors = require("cors");
const express = require('express');
const axios = require('axios');

const app = express();
app.use(cors());

const port = 3000;
const host = '0.0.0.0';

const base_url = `https://api.themoviedb.org/3`;
const api = "425462a0267631f586507ff67e977c17";

const servers = [
    { name: "VidKing", base: "https://www.vidking.net/embed" },
    { name: "VideoEasy", base: "https://player.videasy.net" },
    { name: "VSEmbed", base: "https://vsembed.ru/embed" },
    { name: "VidLink", base: "https://vidlink.pro" }
];

const buildTvLink = (server, id, season, episode) => {
    switch (server.name) {
        case "VidKing":
            return `${server.base}/tv/${id}/${season}/${episode}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`;
        case "VideoEasy":
            return `${server.base}/tv/${id}/${season}/${episode}?nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true&color=e50914`;
        case "VSEmbed":
            return `${server.base}/tv/${id}/${season}/${episode}`;
        case "VidLink":
            return `${server.base}/tv/${id}/${season}/${episode}?primaryColor=e50914&secondaryColor=a2a2a2&iconColor=eefdec&icons=vid&player=jw&title=true&poster=true&autoplay=true&nextbutton=true`;
        default:
            return "";
    }
};

const buildMovieLink = (server, id) => {
    switch (server.name) {
        case "VidKing":
            return `${server.base}/movie/${id}?color=e50914&autoPlay=true`;
        case "VideoEasy":
            return `${server.base}/movie/${id}?color=e50914`;
        case "VSEmbed":
            return `${server.base}/movie/${id}`;
        case "VidLink":
            return `${server.base}/movie/${id}?primaryColor=e50914`;
        default:
            return "";
    }
};

async function get_pop() {
    try {
        const result = await axios.get(`${base_url}/movie/popular`, {
            params: { api_key: api }
        });
        return result.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function get_search_results(query) {
    try {
        const result = await axios.get(`${base_url}/search/multi`, {
            params: {
                api_key: api,
                query
            }
        });
        return result.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

app.get('/', (req, res) => {
    res.send("Backend is working!");
});

app.get('/popular', async (req, res) => {
    const data = await get_pop();
    res.json(data);
});

app.get("/search", async (req, res) => {
    const data = await get_search_results(req.query.query);
    res.json(data);
});

app.get('/movie/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await axios.get(`${base_url}/movie/${id}`, {
            params: {
                api_key: api,
                append_to_response: "credits"
            }
        });

        const serversData = servers.map((server, index) => ({
            id: index + 1,
            name: server.name,
            link: buildMovieLink(server, id)
        }));

        res.json({
            info: {
                title: movie.data.title,
                overview: movie.data.overview,
                poster: movie.data.poster_path,
                backdrop: movie.data.backdrop_path,
                rating: movie.data.vote_average
            },
            cast: movie.data.credits?.cast?.slice(0, 6) || [],
            crew: movie.data.credits?.crew?.slice(0, 6) || [],
            servers: serversData
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Movie fetch failed" });
    }
});

app.get('/tv/:show_id/:season/:episode', async (req, res) => {
    const { show_id, season, episode } = req.params;

    try {
        const tv = await axios.get(`${base_url}/tv/${show_id}`, {
            params: {
                api_key: api,
                append_to_response: "credits"
            }
        });

        const seasonData = await axios.get(`${base_url}/tv/${show_id}/season/${season}`, {
            params: { api_key: api }
        });

        const serversData = servers.map((server, index) => ({
            id: index + 1,
            name: server.name,
            link: buildTvLink(server, show_id, season, episode)
        }));

        res.json({
            info: {
                title: tv.data.name,
                overview: tv.data.overview,
                poster: tv.data.poster_path,
                backdrop: tv.data.backdrop_path,
                rating: tv.data.vote_average
            },
            cast: tv.data.credits?.cast?.slice(0, 6) || [],
            crew: tv.data.credits?.crew?.slice(0, 6) || [],
            seasons: tv.data.seasons || [],
            episodes: seasonData.data.episodes || [],
            servers: serversData
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "TV fetch failed" });
    }
});

app.get("/trending", async (req, res) => {
    try {
        const response = await axios.get(`${base_url}/trending/all/day`, {
            params: { api_key: api }
        });
        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch trending" });
    }
});

app.get("/discover/movie", async (req, res) => {
    try {
        const response = await axios.get(`${base_url}/discover/movie`, {
            params: {
                api_key: api,
                sort_by: "popularity.desc",
                ...req.query
            }
        });
        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Movie discover failed" });
    }
});

app.get("/discover/tv", async (req, res) => {
    try {
        const response = await axios.get(`${base_url}/discover/tv`, {
            params: {
                api_key: api,
                sort_by: "popularity.desc",
                ...req.query
            }
        });
        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "TV discover failed" });
    }
});

/* ✅ ONLY ONE ROUTE */
app.get("/discover/movie/genre/:id", async (req, res) => {
    try {
        const response = await axios.get(`${base_url}/discover/movie`, {
            params: {
                api_key: api,
                with_genres: req.params.id,
                sort_by: "popularity.desc"
            }
        });
        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Movie genre failed" });
    }
});

app.get("/top-rated", async (req, res) => {
    try {
        const response = await axios.get(`${base_url}/discover/movie`, {
            params: {
                api_key: api,
                sort_by: "vote_average.desc",
                vote_count_gte: 1000   // ✅ FIXED
            }
        });
        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Top rated failed" });
    }
});

app.listen(port, host, () => {
    console.log("Server started");
    console.log(`http://${host}:${port}`);
});