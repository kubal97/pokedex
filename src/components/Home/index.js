import React from "react";
import './styles.scss';
import axios from 'axios';
import pokeball from '../../assets/pokemon.png';
import Pokemon from '../Pokemon';
import Search from '../Search';

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
            types: []
            //typesChecked: {}
        };
    }

    async onLoadPokemons() {
        const types = (await axios.get('https://pokeapi.co/api/v2/type')).data.results;
        const { count, results } = (await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`)).data;
        const pokemons = (await Promise.all(results.map(result => axios.get(result.url)))).map(result => result.data);
        this.setState({
            pokemonsCount: count,
            pokemons,
            types,
            filteredPokemons: pokemons,
            isLoading: false
        });
    }

    onNextPage() {
        let totalPages;
        if(this.state.filteredPokemons !== []) totalPages = Math.ceil(this.state.filteredPokemons.length / 20);
        else totalPages = Math.ceil(this.state.pokemonsCount / 20);
        if (this.state.currentPage < totalPages) {
            window.scroll({top: 0, behavior: 'smooth' });
            this.setState({
                currentPage: this.state.currentPage + 1,
            }, () => {
                //this.onLoadPokemons();
            });
            this.onCurrentPage();
        } else alert('There is no next page!');
    }

    onPrevPage() {
        if (this.state.currentPage > 1) {
            window.scroll({top: 0, behavior: 'smooth' });
            this.setState({
                currentPage: this.state.currentPage - 1,
            }, () => {
                //this.onLoadPokemons();
            });
            this.onCurrentPage();
        } else alert('There is no previous page!');
    }

    onCurrentPage() {
        let totalPages;
        if(this.state.filteredPokemons !== []) totalPages = Math.ceil(this.state.filteredPokemons.length / 20);
        else totalPages = Math.ceil(this.state.pokemonsCount / 20);
        const restPages = [];
        for (let i = 1; i <= totalPages; i++) {
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
                key={i}
                // eslint-disable-next-line react/no-direct-mutation-state
                className={this.state.currentPage === i ?
                    'singlePage active' :
                    'singlePage'}>{i}</a>);
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
            if (pokemon.name.includes(input.toLowerCase()) || input === '') filtered.push(pokemon);
        });
        this.setState({
            filteredPokemons: filtered
        });
    }

    componentDidMount() {
        this.onLoadPokemons();
    }

    render() {
        const pokemons = this.state.pokemons;
        const filteredPokemons = this.state.filteredPokemons;
        let pokemonsVisible = [];
        if(!this.state.isLoading) {
            for (let i = (((this.state.currentPage - 1) * 20)); i < ((this.state.currentPage) * 20); i++)
                if(filteredPokemons[i]) pokemonsVisible.push(filteredPokemons[i]);
        }


        return (
            <div className='mainContainer'>
                <Search pokemons={pokemons} searchFilter={(input) => this.searchFilter(input)} />
                <div className='info'>
                    <p className='results'>Pokemons found: {this.state.filteredPokemons.length}</p>
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
                    <p>Weight</p>
                    <p>Held items</p>
                </div>
                {this.state.isLoading ? <div><img src={pokeball} alt='Loading' className="loadingIcon"/><p className='loadingText'>Loading...</p></div> :
                pokemonsVisible.map((pokemon, index) =>
                     <Pokemon key={index} pokemon={pokemon} />
                )
                }
                {this.state.isLoading ? null :
                    <div className="pagination">
                        <button className='changePage' onClick={() => this.onPrevPage()}>Prev</button>
                        {this.onCurrentPage()}
                        <button className='changePage' onClick={() => this.onNextPage()}>Next</button>
                    </div>}
            </div>
        )
    }
}

export default Home;