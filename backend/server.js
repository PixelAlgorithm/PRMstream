
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


app.listen(port, host, ()=>{
    console.log("Server started");
    console.log(`http://${host}:${port}`);
}
)