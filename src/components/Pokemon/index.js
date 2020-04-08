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
            <div className="img">
                <img className='image' src={pokemon.sprites.front_default} alt={pokemon.name}/>
            </div>
            <p className='name'>{pokemon.name}</p>
            <div className='types'>
                {pokemon.types.map(type => <p className='type'>{type.type.name}</p>)}
            </div>
            <p className='height'>{pokemon.height}</p>
            <p className='weight'>{pokemon.weight}</p>
            <div className='heldItems'>
                {pokemon.held_items.length <=0 ? <p>---</p> :
                pokemon.held_items.map((item, index) => <p key={index} className='item'>{item.item.name}</p>)
                }
            </div>
            <p></p>
        </div>
    )
}

export default Pokemon;