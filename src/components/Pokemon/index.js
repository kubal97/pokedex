import React from "react";
import './styles.scss';

const Pokemon = (props) => {

    const {pokemon} = props;
    const bcgColors = {
        bug: 'green',
        grass: 'green',
        fire: 'red',
        electric: 'red',
        fighting: 'red',
        water: 'blue',
        flying: 'blue',
        dragon: 'blue',
        ice: 'blue',
        poison: 'purple',
        psychic: 'purple',
        fairy: 'purple',
        ghost: 'gray',
        dark: 'gray',
        ground: 'brown',
        steel: 'brown',
        rock: 'brown',
        normal: 'default',
        unknown: 'default',
        shadow: 'default',
    };

    return (
        <div className={'pokemon ' + bcgColors[pokemon.types[0].type.name]}>
            <div className="responsiveMain">
                <div className="img">
                    {pokemon.sprites.front_default ?
                        <img
                            className='image'
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                        /> :
                        <p className='noImage'>No picture</p>
                    }
                </div>
                {pokemon.name.length <= 0 ? <p className='name'>---</p> : <p className="name">{pokemon.name}</p>}
            </div>
            <div className="responsive">
                <div className='types'>
                    <span className='labelResponsive'>Types:</span>
                    {pokemon.types.length <= 0 ? <p className="type">---</p> :
                        pokemon.types.map((type, index) =>
                            <p key={index} className='type'>{type.type.name}</p>
                        )}
                </div>
                <p className='height'>
                    <span className='labelResponsive'>Height:</span>
                    {!pokemon.height ? '---' : pokemon.height}
                </p>
                <p className='weight'>
                    <span className='labelResponsive'>Weight:</span>
                    {!pokemon.weight ? '---' : pokemon.weight}
                </p>
                <div className='heldItems'>
                    <span className='labelResponsive'>Held items:</span>
                    {pokemon.held_items.length <=0 ? <p className='dots'>---</p> :
                    pokemon.held_items.map((item, index) =>
                        <p key={index} className='item'>{item.item.name}</p>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Pokemon;