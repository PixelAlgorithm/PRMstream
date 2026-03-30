import Video_card from "./video_card.jsx";
import './Homepage.css'
import axios from 'axios'
import {useState,useEffect} from "react";
import reactRefresh from "eslint-plugin-react-refresh";





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
                <h1>Welcome to PRMstream</h1>
                <div className={"search"}>
                    <h3> search</h3>
                    <input className={"query"} value ={query} onChange={
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