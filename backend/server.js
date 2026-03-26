const express = require('express');
const axios = require('axios');


const app = express();

const port = 3000


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


app.listen(port,()=>{
    console.log("Server started");
    console.log(`http://localhost:${port}`);
}
)