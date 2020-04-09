import React from 'react';
import './styles.scss';

class Filters extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checkedTypes: new Map(),
        };
        this.handleChangeType = this.handleChangeType.bind(this);
    }

    handleChangeType(e) {
        const item = e.target.name;
        const isChecked = !e.target.checked;
        this.setState(prevState => ({ checkedTypes: prevState.checkedTypes.set(item, !isChecked) }));
    }

    render() {
        const {isFiltersVisible, types} = this.props;
        return (
            !isFiltersVisible ? null :
                <div className='listOfFilters'>
                    <p className='filterName'>Filter by type</p>
                    <div className="checkboxes">
                        {types.map((type, index) =>
                            <div className='type'>
                                <input
                                    name={type.name}
                                    key={index}
                                    checked={this.state.checkedTypes.get(type.name)}
                                    onChange={this.handleChangeType}
                                    type='checkbox'
                                    className='checkbox' />
                                <p className='typeName'>{type.name}</p>
                            </div>
                        )}
                    </div>
                    <div className="buttonsContainer">
                        <button className='buttonFilters filter' onClick={() => this.props.typesFilter(this.state.checkedTypes)}>Filter</button>
                        <button className='buttonFilters close' onClick={() => this.props.closeModal()}>Close</button>
                    </div>
                </div>
        )
    }
}

export default Filters;