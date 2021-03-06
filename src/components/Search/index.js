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

    enterPressed(e) {
        const code = e.keyCode || e.which;
        if(code === 13) {
            this.props.searchFilter(this.state.searchInput);
        }
    }

    render() {
        const {isLoading} = this.props;
        return (
            <div className='search'>
                <input
                    onChange={(e) => this.searchInput(e)}
                    onKeyPress={this.enterPressed.bind(this)}
                    placeholder='Find a pokemon by name'
                    type="text"/>
                <button
                    disabled={isLoading}
                    onClick={() => this.props.searchFilter(this.state.searchInput)}
                    className='searchButton'>
                    Search
                </button>
            </div>
        )
    }
}

export default Search;