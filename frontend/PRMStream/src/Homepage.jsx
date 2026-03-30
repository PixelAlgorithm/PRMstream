import Video_card from "./video_card.jsx";
import './Homepage.css'
import axios from 'axios'
import {useState,useEffect} from "react";





function Homepage()
{
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(()=> {
        popular_movies()
    },[])

    useEffect(() => {
        const delay = setTimeout(() => {

            if (query === "") {
                popular_movies();
            } else {
                search_movies();
            }

        }, 400);

        return () => clearTimeout(delay);

    }, [query]);



    async function popular_movies()
    {
        setMovies([]);
        const data = await axios.get(`http://localhost:3000/popular`)
        const response = data.data.results
        setMovies(response)
    }

    function get_movies(e){
        setQuery(e.target.value);
    }

    async function search_movies()
    {
        setMovies([]);
        const data = await axios.get(
            `http://localhost:3000/search?query=${query}`
        );

        if (data.data.total_results == 0){
            alert('Movie not found!')
            popular_movies();
            setQuery("");
            return;
        }

        const response = data.data.results
        setMovies(response)
    }




    return(
        <>
        <div className={"Homepage"}>
            <div className={"Nav"}>
                <div className="nav-inner">
                    <div className="brand">
                        <div className="brand-logo" aria-hidden="true"></div>
                        <h1>PRMstream</h1>
                    </div>
                    <div className="nav-links">
                        <a href="#">Home</a>
                        <a href="#">Browse</a>
                        <button type="button" aria-label="Search">⌕</button>
                        <button type="button" aria-label="Account">◯</button>
                    </div>
                </div>
                <div className={"search"}>
                    <input
                        className={"query"}
                        placeholder="Search movies or series"
                        value ={query}
                        onChange={
                    (e)=>get_movies(e)}/>

                </div>
            </div>

            <div className="Videos">
                {movies.length === 0 &&
                    Array(20).fill(0).map((_, i) => (
                        <div className="video-card skeleton-card" key={i}></div>
                    ))
                }
                {/*<Video_card title={"Peaky Blinders: The Immortal Man"} poster={"gRMalasZEzsZi4w2VFuYusfSfqf.jpg"} backdrop={"1fkuBPid72KGS6WmtkEXMftZtkE.jpg"} id={"875828"} rating={"7.4"}/>*/}
                {movies.map(item => (
                        <Video_card key={item.id} item={item} />
                    ))
                }



            </div>

        </div>

        </>

    )
}

export default Homepage;