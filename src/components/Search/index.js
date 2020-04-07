import React from "react";
import './styles.scss';

class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            searchInput: ''
        };
    }

    searchInput(e) {
        this.setState({searchInput: e.target.value});
    }



    render() {
        return (
            <div className='search'>
                <input onChange={(e) => this.searchInput(e)} placeholder='Find a pokemon' type="text"/>
                <button onClick={() => this.props.searchFilter(this.state.searchInput)} className='searchButton'>Search</button>
            </div>
        )
    }
}

export default Search;