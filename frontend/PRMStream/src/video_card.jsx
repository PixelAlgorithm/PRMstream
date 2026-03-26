import { useNavigate } from "react-router-dom";
import './video_card.css'
import axios from 'axios'

function Video_card({ title, poster, backdrop, id, rating }) {

    const navigate = useNavigate();

    return (
        <div
            className="video_card"
            onClick={() => navigate(`/player/${id}`)}
        >
            <picture>
                <source
                    media="(min-width: 768px)"
                    srcSet={`https://image.tmdb.org/t/p/w780/${backdrop}`}
                />
                <img
                    className="movie-poster"
                    src={`https://image.tmdb.org/t/p/w342/${poster}`}
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
