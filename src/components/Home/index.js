import React from 'react';
import './styles.scss';
import axios from 'axios';

import pokeball from '../../assets/pokemon.png';

import Pokemon from '../Pokemon';
import Search from '../Search';
import Loading from '../Loading';
import Filters from '../Filters';


class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            pokemonsCount: 0,
            pokemons: [],
            filteredPokemons: [],
            currentPage: 1,
            isFiltersVisible: false,
            pokemonTypes: [],
            alphabeticalSortDown : false,
            pokemonsPerPage: 20
        };
    }

    async onLoadPokemons() {
        const types = (await axios.get('https://pokeapi.co/api/v2/type')).data.results;
        const { count, results } = (await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`)).data;
        const pokemons = (await Promise.all(results.map(result => axios.get(result.url)))).map(result => result.data);
        this.setState({
            pokemonsCount: count,
            pokemons,
            filteredPokemons: pokemons,
            isLoading: false,
            pokemonTypes: types
        });
    }

    onNextPage() {
        let totalPages;
        if(this.state.filteredPokemons !== []) totalPages = Math.ceil(this.state.filteredPokemons.length / this.state.pokemonsPerPage);
        else totalPages = Math.ceil(this.state.pokemonsCount / this.state.pokemonsPerPage);
        if (this.state.currentPage < totalPages) {
            window.scroll({top: 0, behavior: 'smooth' });
            this.setState({
                currentPage: this.state.currentPage + 1,
            }, () => {
                this.onCurrentPage();
            });
        } else alert('There is no next page!');
    }

    onPrevPage() {
        if (this.state.currentPage > 1) {
            window.scroll({top: 0, behavior: 'smooth' });
            this.setState({
                currentPage: this.state.currentPage - 1,
            }, () => {
                this.onCurrentPage();
            });
        } else alert('There is no previous page!');
    }

    onCurrentPage() {
        let totalPages = 1;
        if(this.state.filteredPokemons !== []) totalPages = Math.ceil(this.state.filteredPokemons.length / this.state.pokemonsPerPage);
        else totalPages = Math.ceil(this.state.pokemonsCount / this.state.pokemonsPerPage);
        const restPages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i - this.state.currentPage < 5 && this.state.currentPage - i < 5){
                restPages.push(<a
                        onClick={() => {window.scroll({top: 0, behavior: 'smooth' });this.setState({
                                currentPage: i,
                            });
                        }}
                        href="/#"
                        key={i}
                        className={this.state.currentPage === i ? 'singlePage active' : 'singlePage'}>
                        {i}
                        </a>
                );
            }
        }
        return restPages;
    }

    searchFilter(input) {
        let pokemons = this.state.pokemons;
        let filteredPokemons = [];
        pokemons.filter(pokemon => {
            if (pokemon.name.includes(input.toLowerCase()) || input === '') filteredPokemons.push(pokemon);
            return null
        });
        this.setState({
            filteredPokemons,
            currentPage: 1
        });
    }

    filters(checkedTypes, checkedHoldingItems){
        let pokemons = this.state.pokemons;
        const selectedTypes = [];
        const selectedHoldingItems = [];
        let filteredPokemons = [];

        checkedTypes.forEach((val, key)  => {
            if( val === true) return selectedTypes.push(key);
        });
        checkedHoldingItems.forEach((val, key)  => {
            if( val === true) return selectedHoldingItems.push(key);
        });

        if(selectedTypes.length <= 0 && selectedHoldingItems.length <= 0) filteredPokemons = pokemons;

        else if(selectedHoldingItems[0] === 'notHolding')
            pokemons.map(pokemon => {
                if(selectedTypes.length <= 0) return (pokemon.held_items.length <= 0 ? filteredPokemons.push(pokemon) : null);
                pokemon.types.map(type => {
                    return (selectedTypes.includes(type.type.name) && pokemon.held_items.length <= 0 ? filteredPokemons.push(pokemon) : null)
                })
            });

        else if(selectedHoldingItems[0] === 'holding')
            pokemons.map(pokemon => {
                if(selectedTypes.length <= 0) return (pokemon.held_items.length > 0 ? filteredPokemons.push(pokemon) : null);
                pokemon.types.map(type => {
                    return (selectedTypes.includes(type.type.name) && pokemon.held_items.length > 0 ?  filteredPokemons.push(pokemon) : null)
                })
            });

        else if (selectedHoldingItems.length <= 0 || selectedHoldingItems.length > 1)
            pokemons.map(pokemon => {
                pokemon.types.map(type => {
                    return (selectedTypes.includes(type.type.name) ? filteredPokemons.push(pokemon) : null)
                })
            });

        filteredPokemons = this.removeDuplicates(filteredPokemons, 'id');
        this.setState({filteredPokemons});
    }

    removeDuplicates(array, key) {
        return array
            .map(e => e[key])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(e => array[e]).map(e => array[e]);
    }

    closeModal() {
        this.setState({
            isFiltersVisible: false
        })
    }

    sortAlphabetical(){
        this.setState({alphabeticalSortDown : !this.state.alphabeticalSortDown});
        const filteredPokemons = this.state.filteredPokemons;
        this.state.alphabeticalSortDown ?
            (
                filteredPokemons.sort((firstPokemon,secondPokemon) => {
                    if (firstPokemon.name > secondPokemon.name) return -1;
                    else if (firstPokemon.name < secondPokemon.name) return 1;
                    return 0;
                })
            ) :
            (
                filteredPokemons.sort((firstPokemon,secondPokemon) => {
                    if (firstPokemon.name < secondPokemon.name) return -1;
                    else if (firstPokemon.name  > secondPokemon.name) return 1;
                    return 0;
                })
            );
        this.setState({filteredPokemons})
    }

    componentDidMount() {
        this.onLoadPokemons();
    }

    render() {
        const filteredPokemons = this.state.filteredPokemons;
        let pokemonsVisible = [];
        if(!this.state.isLoading) {
            for (let i = (((this.state.currentPage - 1) * this.state.pokemonsPerPage)); i < ((this.state.currentPage) * this.state.pokemonsPerPage); i++)
                if(filteredPokemons[i]) pokemonsVisible.push(filteredPokemons[i]);
        }

        return (
            <div className='mainContainer'>
                <Search
                    isLoading={this.state.isLoading}
                    searchFilter={(input) => this.searchFilter(input)}
                />
                <div className='pokemonsPerPage'>
                    <label className='labelPerPage'>Number of pokemons per page:</label>
                    <input
                        className='inputPerPage'
                        type="number"
                        value={this.state.pokemonsPerPage}
                        placeholder='20'
                        onChange={(e) => this.setState({pokemonsPerPage: e.target.value})}
                    />
                </div>
                <div className='info'>
                    <p className='results'>Pokemons found: {this.state.filteredPokemons.length}</p>
                    <button
                        disabled={this.state.isLoading}
                        onClick={() => this.setState({isFiltersVisible: !this.state.isFiltersVisible})}
                        className='filters'
                    >
                        <i className="fas fa-filter" />
                        <p className='filtersText'>Filters</p>
                    </button>
                    <Filters
                        filters={(checkedTypes, checkedHoldingItems) => this.filters(checkedTypes, checkedHoldingItems)}
                        types={this.state.pokemonTypes}
                        closeModal={() => this.closeModal()}
                        isFiltersVisible={this.state.isFiltersVisible}
                    />
                </div>
                <div className="header">
                    <p>Image</p>
                    <p className='sorting'><i onClick={() => this.sortAlphabetical()} className="fas fa-sort-alpha-down" />Name</p>
                    <p>Types</p>
                    <p>Height</p>
                    <p>Weight</p>
                    <p>Held items</p>
                </div>
                {this.state.isLoading ?
                    <Loading pokeball={pokeball} /> :
                    (pokemonsVisible.length <= 0 ?
                        <p className='noResults'>No results found</p> :
                        pokemonsVisible.map((pokemon, index) =>
                            <Pokemon key={index} pokemon={pokemon} />
                        ))
                }
                {this.state.isLoading || pokemonsVisible.length <= 0 ? null :
                    <div className="pagination">
                        <button className='changePage' onClick={() => this.onPrevPage()}>Prev</button>
                        {this.onCurrentPage()}
                        <button className='changePage' onClick={() => this.onNextPage()}>Next</button>
                    </div>
                }
            </div>
        )
    }
}

export default Home;