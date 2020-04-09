import React from "react";
import './styles.scss';
import pokeball from '../../assets/pokemon.png';

const Nav = () => {
    return (
        <div className='container'>
            <img className='pokeball' src={pokeball} alt="Pokeball"/>
            <h1 className='textLogo'>Pokedex</h1>
        </div>
    )
};

export default Nav;