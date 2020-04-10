import React from 'react';
import './styles.scss';

class Filters extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checkedTypes: new Map(),
            checkedHoldItems: new Map()
        };
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleChangeHolding = this.handleChangeHolding.bind(this);
    }

    handleChangeType(e) {
        const item = e.target.name;
        const isChecked = !e.target.checked;
        this.setState(prevState => ({ checkedTypes: prevState.checkedTypes.set(item, !isChecked) }));
    }

    handleChangeHolding(e) {
        const item = e.target.name;
        const isChecked = !e.target.checked;
        this.setState(prevState => ({ checkedHoldItems: prevState.checkedHoldItems.set(item, !isChecked) }));
    }

    render() {
        const {isFiltersVisible, types} = this.props;
        return (
            !isFiltersVisible ? null :
                <div className='listOfFilters'>
                    <p className='filterName'>Filter by type</p>
                    <div className="checkboxes">
                        {types.map((type, index) =>
                            <div key={index} className='type'>
                                <input
                                    name={type.name}
                                    checked={this.state.checkedTypes.get(type.name)}
                                    onChange={this.handleChangeType}
                                    type='checkbox'
                                    className='checkbox' />
                                <label className='typeName'>{type.name}</label>
                            </div>
                        )}
                    </div>
                    <p className="filterName">Filter by held items</p>
                    <div className="checkboxes">
                        <div className='type wider'>
                            <input
                                name='holding'
                                checked={this.state.checkedHoldItems.get('holding')}
                                onChange={this.handleChangeHolding}
                                type='checkbox'
                                className='checkbox' />
                            <label className='typeName'>Holding item(s)</label>
                        </div>
                        <div className="type wider">
                            <input
                                name='notHolding'
                                checked={this.state.checkedHoldItems.get('notHolding')}
                                onChange={this.handleChangeHolding}
                                type='checkbox'
                                className='checkbox' />
                            <label className='typeName'>Not holding item(s)</label>
                        </div>
                    </div>
                    <div className="buttonsContainer">
                        <button className='buttonFilters filter' onClick={() => {
                            this.props.filters(this.state.checkedTypes, this.state.checkedHoldItems);
                            this.props.closeModal();
                        }}>Filter</button>
                        <button className='buttonFilters close' onClick={() => this.props.closeModal()}>Close</button>
                    </div>
                </div>
        )
    }
}

export default Filters;