import React, { Component } from 'react';
import ColFormGroupInput from './ColFormGroupInput'

class ColSelect extends Component {

    render(){
        const {option, md, selId, type, title, name, valueSel, onChangeSel} = this.props;

        let thickness;
        if(option){
            thickness = option.map((element, i) => {
                return (
                    <option key={i}>{element}</option>
                )
            });
        }

        return(
            <ColFormGroupInput 
                md={md} 
                id={selId} 
                type={type} 
                title={title} 
                inputName={name} 
                elements={thickness}
                value={valueSel}
                onChange={onChangeSel}
            />
        )
    }
}

export default ColSelect;