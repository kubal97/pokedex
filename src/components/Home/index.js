import React from "react";
import './styles.scss';
import axios from 'axios';
import Pokemon from '../Pokemon';
import Search from '../Search';

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pokemonsCount: 0,
            pokemons: [],
            currentPage: 0,
            isFiltersVisible: false,
            types: []
            //typesChecked: {}
        };
    }

    async onLoadPokemons() {
        const types = (await axios.get('https://pokeapi.co/api/v2/type')).data.results;
        const { count, results } = (await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${this.state.currentPage * 20}`)).data;
        const pokemons = (await Promise.all(results.map(result => axios.get(result.url)))).map(result => result.data);
        this.setState({
            pokemonsCount: count,
            pokemons,
            types
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
                onClick={() => {
                    window.scroll({top: 0, behavior: 'smooth' });
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

    /*checkType(e, name) {
        let typesChecked = this.state.typesChecked;
        typesChecked[name] = e.target.checked;
        this.setState({typesChecked: this.state.typesChecked});
        console.log(this.state.typesChecked);
    }*/

    searchFilter(input) {
        let filteredPokemons = this.state.pokemons;
        let filtered = [];
        filteredPokemons.filter(pokemon => {
            if (pokemon.name.includes(input) || input === '') filtered.push(pokemon);
        });
        this.setState({
            pokemons: filtered,
        })
        console.log('input: ' + input);
        console.log(filtered);
    }

    componentDidMount() {
        this.onLoadPokemons();
    }

    render() {
        const pokemons = this.state.pokemons;
        return (
            <div className='mainContainer'>
                <Search pokemons={pokemons} searchFilter={(input) => this.searchFilter(input)} />
                <div className='info'>
                    <p className='results'>Pokemons found: {this.state.pokemonsCount}</p>
                    <button onClick={() => this.setState({isFiltersVisible: !this.state.isFiltersVisible})} className='filters'>
                        <i className="fas fa-filter" />
                        <p className='filtersText'>Filters</p>
                    </button>
                    {!this.state.isFiltersVisible ? null :
                        <div className='listOfFilters'>
                            {/*<p>Filter by types</p>
                            <div className='checkboxes'>
                                {this.state.types.map((type, index) =>
                                        <div className='type'>
                                            <input onChange={(e) => this.checkType(e, type.name)} id={type.name} type='checkbox' className='checkbox' />
                                            <p className='typeName'>{type.name}</p>
                                        </div>
                                    )}
                            </div>*/}
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
                {pokemons.map((pokemon, index) =>
                        <Pokemon key={index} pokemon={pokemon} />
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