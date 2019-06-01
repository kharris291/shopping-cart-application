import React, { Component } from 'react';
import {  Button } from 'semantic-ui-react'
import { Col } from 'react-flexbox-grid';

class ItemDetails extends Component{
  constructor(props){
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)    
  }

  handleSubmit(){

    if(this.props.type === 'add'){
       var item = {
        id: this.props.state.id,
        name: this.props.state.name,
        productCategory: this.props.state.productCategory,
        productPrice: this.props.state.productPrice,
        productStock: this.props.state.productStock
      }
      this.props.handleUpdate(item);
    }else{
      this.props.handleRemoval();
    }
  }

  render(){
    // console.log(this.props)
    return(
      [
        <Col xs={4} md={4}>
          {this.props.state.name}
        </Col>,
        <ProductRowType state={this.props.state} type={this.props.type} key={this.props.state.id} />
        ,
        <Col xs={2} md={2}>
          {this.props.type==='add' ? <Button onClick={this.handleSubmit} >Add</Button> 
          : 
          <Button onClick={this.handleSubmit} >Remove</Button> 
        }
        </Col>
      ]
    )
  }
}


class ProductRowType extends Component{
  render(){
    console.log(this.props.type)
    if(this.props.type ==="add"){
      return(
        [
          <Col xs={2} md={2}>
            {this.props.state.productCategory}
          </Col>,
          <Col xs={2} md={2}>
            £{this.props.state.productPrice}
          </Col>,
          <Col xs={1} md={1}>
            {this.props.state.productStock}
          </Col>
        ]
      )
    }else{

      const total = parseFloat(this.props.state.productStock * this.props.state.productPrice).toFixed(2);
      return(
        [
          <Col xs={2} md={2}>
            £{this.props.state.productPrice}
          </Col>,
          <Col xs={2} md={2}>
            {this.props.state.productStock}
          </Col>,
          <Col xs={2} md={2}>
            {total}
          </Col>
        ]
      )
    }
  }
}


export default ItemDetails;