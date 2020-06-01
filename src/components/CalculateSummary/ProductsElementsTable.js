import React from 'react';
import { Table, Label } from 'reactstrap';
import { summaryTranslation } from '../../mainTranslations';
import '../../containers/CalculateSummary/CalculateSummary.css';

const ProductsElementsTable = (props) => {
    if(props && props.products && props.products.length > 0){
        return (
            <>
            <Label><strong><h4>{props.header}</h4></strong></Label>
            <div className="ProductsElementsTable">
                <Table bordered className="Table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{props.columnName}</th>
                            {props.countVisible ? <th>{summaryTranslation.count}</th>: null}
                            {props.thVisible ? <th>{summaryTranslation.thickness}</th>: null}
                            {props.descrVisible ? <th>{summaryTranslation.description}</th>: null}
                            {props.sizeVisible ? <th>{summaryTranslation.dimension}</th>: null}
                            {props.priceVisible ? <th>{summaryTranslation.price}</th>: null}
                        </tr>
                    </thead>
                    <tbody>
                    {props && props.products && props.products.map((item, i) => {
                    return (
                        <tr key={item.id}>
                            <th scope="row">{i + 1}</th>
                            <td>{item.name}</td>
                            {props.countVisible ? <td>{item.count}</td> : null}
                            {props.thVisible ?  <td>{item.value}</td>: null}
                            {props.descrVisible ?  <td className="DescriptionColumn">{item.description}</td>: null}
                            {props.sizeVisible ? <td>{item.size}</td>: null}
                            {props.priceVisible ? <td>{item.sum ? item.sum : 0} zł</td>: null}         
                        </tr>
                    )
                    })}
                    {props.summaryPriceVisible ? 
                        <tr>
                            <td colSpan={props.columnCount} className="Summary"></td>
                            <td><strong>{summaryTranslation.total} {props.price} zł</strong></td>
                        </tr>:null
                    }
                    </tbody>
                </Table>
            </div>
            </>
        )
    }else {
        return null;
    }
}

export default ProductsElementsTable;

