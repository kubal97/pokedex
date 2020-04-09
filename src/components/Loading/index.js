import React from "react";
import './styles.scss';

const Loading = (props) => {

    const {pokeball} = props;

    return (
        <div className='containerLoading'>
            <img src={pokeball} alt='Loading' className="loadingIcon"/>
            <p className='loadingText'>Fetching some pokemons...</p>
        </div>
    )
};

export default Loading;