import { useNavigate } from "react-router-dom";
import './video_card.css'
import axios from 'axios'

function Video_card({ item}) {

    const navigate = useNavigate();
    const title = item.title || item.name;
    const poster = item.poster_path;
    const backdrop = item.backdrop_path;
    const rating = item.vote_average;
    const id = item.id;
    const type = item.media_type || "movie";


    const posterUrl = poster
        ? `https://image.tmdb.org/t/p/w342/${poster}`
        : "https://via.placeholder.com/342x513?text=No+Image";

    const backdropUrl = backdrop
        ? `https://image.tmdb.org/t/p/w780/${backdrop}`
        : posterUrl;


    return (
        <div
            className="video_card"
            onClick={() => navigate(`/player/${type}/${id}`)}
        >
            <picture>
                <source
                    media="(min-width: 768px)"
                    srcSet={backdropUrl}
                />
                <img
                    className="movie-poster"
                    src={posterUrl}
                    alt={title}
                />
            </picture>
            <div className="details">
                <h3>{title}</h3>
                <p>rating: {rating}</p>
            </div>

        </div>
    );
}


export default Video_card;
