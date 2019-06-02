import React, { Component } from 'react';
import ItemDetails from './ItemDetails.js'
import {  Grid } from 'semantic-ui-react'

import { Row, Col } from 'react-flexbox-grid';

class ShoppingCart extends Component {
  constructor(props) {
    super(props)
    this.handleRemoval = this.handleRemoval.bind(this); 
  }

  handleRemoval(args){
    this.props.handleRemoval(args);
  }

  render() {
    var shoppingCartList = this.props.state.shoppingCart.map((itemsOnList, index) => (
        <Row  key={index}>
          <ShoppingItemList state={itemsOnList}  key={index} handleRemoval={this.handleRemoval}/>
        </Row>
    ));
    
    return (
      <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
        <Row>
          <Col xs={4} md={4}><h5>Name</h5></Col>
          <Col xs={2} md={2}><h5>Price</h5></Col>
          <Col xs={2} md={2}><h5>Quantity</h5></Col>
          <Col xs={1} md={1}><h5>Total</h5></Col>
          <Col xs={2} md={2}></Col>
        </Row>
        {shoppingCartList}
        <Row>
          <Col xs={4} md={4}>Running Total</Col>
          <Col xs={2} md={2}>£{parseFloat(this.props.state.runningTotal).toFixed(2)}</Col>
        </Row>
      </Grid>
        
    );
  }
}



class ShoppingItemList extends Component {
  constructor(props){
    super(props)
    this.state = this.props.state
    this.handleRemoval= this.handleRemoval.bind(this)
  }

  handleRemoval(args){
    var itemList ={
      id: this.props.state.id,
      name: this.state.name,
      productCategory: this.state.productCategory,
      productPrice: this.state.productPrice,
      productStock: this.state.productStock
    }
    this.props.handleRemoval(itemList);
  }

  render(){
    if(this.props.state.productStock > 0){
      return(
        <ItemDetails state={this.props.state} handleUpdate={this.handleUpdate}
          handleRemoval={this.handleRemoval} keys={this.props.state.id} type='Remove'/>
        
      )
    }else{
      return(
        <div style={{display:'none'}}></div>
      )
    }
  }
}



export default ShoppingCart;