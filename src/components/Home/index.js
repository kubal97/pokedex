import React from "react";
import './styles.scss';
import axios from 'axios';
import Pokemon from '../Pokemon';

class  Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pokemonsCount: 0,
            pokemons: [],
            currentPage: 0,
            isFiltersVisible: false,
            types: []
        };
    }

    async onLoadPokemons() {
        const types = (await axios.get('https://pokeapi.co/api/v2/type')).data.results;
        const { count, results } = (await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${this.state.currentPage * 20}`)).data;
        const pokemons = (await Promise.all(results.map(result => axios.get(result.url)))).map(result => result.data);
        this.setState({
            pokemonsCount: count,
            pokemons: pokemons,
            types: types
        });
    }

    onNextPage() {
        const totalPages = Math.ceil(this.state.pokemonsCount / 20);
        if (this.state.currentPage < totalPages) {
            this.setState({
                currentPage: this.state.currentPage + 1,
            }, () => {
                this.onLoadPokemons();
            });
            this.onCurrentPage();
        } else alert('There is no next page!');
    }

    onPrevPage() {
        if (this.state.currentPage > 0) {
            this.setState({
                currentPage: this.state.currentPage - 1,
            }, () => {
                this.onLoadPokemons();
            });
            this.onCurrentPage();
        } else alert('There is no previous page!');
    }

    onCurrentPage() {
        const totalPages = Math.ceil(this.state.pokemonsCount / 20);
        const restPages = [];
        for (let i = 0; i < totalPages; i++) {
            if (i - this.state.currentPage < 5 && this.state.currentPage - i < 5){
            restPages.push(<a
                href='#'
                onClick={() => {
                    this.setState({
                        currentPage: i,
                    }, () => {
                        this.onLoadPokemons();
                    });
                }}
                id={i}
                // eslint-disable-next-line react/no-direct-mutation-state
                className={this.state.currentPage === i ?
                    'singlePage active' :
                    'singlePage'}>{i+1}</a>);
            }
        }
        return restPages;
    }

    componentDidMount() {
        this.onLoadPokemons();
    }

    render() {
        const pokemons = this.state.pokemons;
        return (
            <div className='mainContainer'>
                <div className='info'>
                    <p className='results'>Pokemons found: {this.state.pokemonsCount}</p>
                    <button onClick={() => this.setState({isFiltersVisible: !this.state.isFiltersVisible})} className='filters'>
                        <i className="fas fa-filter" />
                        <p className='filtersText'>Filters</p>
                    </button>
                    {!this.state.isFiltersVisible ? null :
                        <div className='listOfFilters'>
                            <p>Filter by types</p>
                            <div className='checkboxes'>
                                {this.state.types.map(type =>
                                        <div className='type'>
                                            <input value={false} id={type.name} type='checkbox' className='checkbox' />
                                            <p className='typeName'>{type.name}</p>
                                        </div>
                                    )}
                            </div>
                        </div>
                    }
                </div>
                <div className="header">
                    <p>Image</p>
                    <p>Name</p>
                    <p>Types</p>
                    <p>Height</p>
                    <p>Held items</p>
                </div>
                {pokemons.map((pokemon) =>
                    <Pokemon key={pokemon.id} pokemon={pokemon} />
                )}
                <div className="pagination">
                    <button className='changePage' onClick={() => this.onPrevPage()}>Prev</button>
                    {this.onCurrentPage()}
                    <button className='changePage' onClick={() => this.onNextPage()}>Next</button>
                </div>
            </div>
        )
    }
}

export default Home;