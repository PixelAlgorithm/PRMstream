import Video_card from "./video_card.jsx";
import './Homepage.css'
import axios from 'axios'
import {useState,useEffect} from "react";





function Homepage()
{



    async function popular_movies()
    {
        const data = await axios.get(`http://localhost:3000/popular`)
        const response = data.data.results
        setMovies(response)
    }

    const [movies, setMovies] = useState([]);

    useEffect(()=> {
        popular_movies()
    },[])

    return(
        <>
        <div className={"Homepage"}>
            <div className={"Nav"}>
                <h1>Welcome tp PRMstream</h1>
            </div>

            <div className="Videos">
                {/*<Video_card title={"Peaky Blinders: The Immortal Man"} poster={"gRMalasZEzsZi4w2VFuYusfSfqf.jpg"} backdrop={"1fkuBPid72KGS6WmtkEXMftZtkE.jpg"} id={"875828"} rating={"7.4"}/>*/}
                {movies.map(movie=>(
                    <Video_card key = {movie.id} title= {movie.title} poster={movie.poster_path} backdrop={movie.backdrop_path} id={movie.id}
                                rating={movie.vote_average}/>

                ))}



            </div>

        </div>

        </>

    )
}

export default Homepage;