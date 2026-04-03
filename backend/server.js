
const cors =require("cors");

const express = require('express');
const axios = require('axios');




const app = express();
app.use(cors());
const port = 3000
const host = '0.0.0.0'


const base_url = `https://api.themoviedb.org/3/`
const api = "425462a0267631f586507ff67e977c17"


const poster_url =`https://image.tmdb.org/t/p/w500/gRMalasZEzsZi4w2VFuYusfSfqf.jpg`
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
            return `${server.base}/movie/${id}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`;

        case "VideoEasy":
            return `${server.base}/movie/${id}?color=e50914`;

        case "VSEmbed":
            return `${server.base}/movie/${id}`;

        case "VidLink":
            return `${server.base}/movie/${id}?primaryColor=e50914&secondaryColor=a2a2a2&iconColor=eefdec&icons=vid&player=jw&title=true&poster=true`;

        default:
            return "";
    }
};


async function get_pop(){
    try {
        const result = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=425462a0267631f586507ff67e977c17`);
        return result.data;
    }
    catch(err){
        console.error(err);
        return "Error fetching!";
    }
}


async function get_search_results(query){
    try {
        //const result = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=425462a0267631f586507ff67e977c17&query=${query}`)
        const result = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=425462a0267631f586507ff67e977c17&query=${query}`)
        return result.data;
    }
    catch(err){
        console.error(err);
        return "Error fetching!";
    }
}





app.get('/', (req, res) => {

    res.send("Backend is working!");

})

app.get('/images/:id',(req, res) => {
    const id = req.params.id;
    res.send(`https://image.tmdb.org/t/p/w500/${id}`);
})


app.get('/popular',(req,res)=>{
    get_pop().then(data=>{
        res.send(data)
    })
})

// app.get('/search/:query',(req,res)=>{
//     const query = req.params.query;
//     get_search_results(query).then(data=>{
//         res.send(data)
//     })
// })


app.get("/search", async (req, res) => {

    const query = req.query.query;

    get_search_results(query).then(data=>{
        res.json(data)
    });

});

app.get('/movie/:id', (req, res) => {
    const { id } = req.params;

    const result = servers.map((server, index) => ({
        id: index + 1,
        name: server.name,
        link: buildMovieLink(server, id)
    }));

    res.json(result);
});
app.get('/tv/:show_id/:season/:episode', (req, res) => {
    const { show_id, season, episode } = req.params;

    const result = servers.map((server, index) => ({
        id: index + 1,
        name: server.name,
        link: buildTvLink(server, show_id, season, episode)
    }));

    res.json(result);
});


app.listen(port, host, ()=>{
    console.log("Server started");
    console.log(`http://${host}:${port}`);
}
)