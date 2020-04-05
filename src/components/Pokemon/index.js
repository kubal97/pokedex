import React from "react";
import './styles.scss';
import axios from "axios";

class  Pokemon extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pokemonInfo: []
        };
    }

    onLoadPokemonsInfo(pokemon) {
        console.log('Rusza pobieranie!');
        axios.get(`${pokemon.url}`)
            .then((response) => {
                this.setState({
                    pokemonInfo: response.data.results
                });
                console.log(this.state.pokemonInfo);
            })
    }

    render() {
        const {pokemon} = this.props;
        return (
            <div className='pokemon'>
                <p>{pokemon.name}</p>
            </div>
        )
    }
}

export default Pokemon;