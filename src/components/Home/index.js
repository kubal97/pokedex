import React from 'react';
import './styles.scss';
import axios from 'axios';

import pokeball from '../../assets/pokemon.png';

import Pokemon from '../Pokemon';
import Search from '../Search';
import Loading from '../Loading';

const pokemonsPerPage = 20;

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            pokemonsCount: 0,
            pokemons: [],
            filteredPokemons: [],
            currentPage: 1,
            isFiltersVisible: false
        };
    }

    async onLoadPokemons() {
        const { count, results } = (await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`)).data;
        const pokemons = (await Promise.all(results.map(result => axios.get(result.url)))).map(result => result.data);
        this.setState({
            pokemonsCount: count,
            pokemons,
            filteredPokemons: pokemons,
            isLoading: false
        });
    }

    onNextPage() {
        let totalPages;
        if(this.state.filteredPokemons !== []) totalPages = Math.ceil(this.state.filteredPokemons.length / pokemonsPerPage);
        else totalPages = Math.ceil(this.state.pokemonsCount / pokemonsPerPage);
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
        if(this.state.filteredPokemons !== []) totalPages = Math.ceil(this.state.filteredPokemons.length / pokemonsPerPage);
        else totalPages = Math.ceil(this.state.pokemonsCount / pokemonsPerPage);
        const restPages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i - this.state.currentPage < 5 && this.state.currentPage - i < 5){
            restPages.push(
                <a
                    onClick={() => {
                        window.scroll({top: 0, behavior: 'smooth' });
                        this.setState({
                            currentPage: i,
                        }, () => {
                            this.onLoadPokemons();
                        });
                    }}
                    href="/#"
                    key={i}
                    className={this.state.currentPage === i ?
                        'singlePage active' :
                        'singlePage'}
                >
                    {i}
                </a>);
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
            filteredPokemons
        });
    }

    componentDidMount() {
        this.onLoadPokemons();
    }

    render() {
        const filteredPokemons = this.state.filteredPokemons;
        let pokemonsVisible = [];
        if(!this.state.isLoading) {
            for (let i = (((this.state.currentPage - 1) * pokemonsPerPage)); i < ((this.state.currentPage) * pokemonsPerPage); i++)
                if(filteredPokemons[i]) pokemonsVisible.push(filteredPokemons[i]);
        }

        return (
            <div className='mainContainer'>
                <Search
                    isLoading={this.state.isLoading}
                    searchFilter={(input) => this.searchFilter(input)}
                />
                <div className='info'>
                    <p className='results'>Pokemons found: {this.state.filteredPokemons.length}</p>
                    <button
                        onClick={() => this.setState({isFiltersVisible: !this.state.isFiltersVisible})}
                        className='filters'
                    >
                        <i className="fas fa-filter" />
                        <p className='filtersText'>Filters</p>
                    </button>
                    {!this.state.isFiltersVisible ? null :
                        <div className='listOfFilters'>
                            <p>Filter 1</p>
                        </div>
                    }
                </div>
                <div className="header">
                    <p>Image</p>
                    <p>Name</p>
                    <p>Types</p>
                    <p>Height</p>
                    <p>Weight</p>
                    <p>Held items</p>
                </div>
                {this.state.isLoading ?
                    <Loading pokeball={pokeball} /> :
                    pokemonsVisible.map((pokemon, index) =>
                        <Pokemon key={index} pokemon={pokemon} />
                    )
                }
                {this.state.isLoading ? null :
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