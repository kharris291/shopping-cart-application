import React, { Component } from 'react';

import ItemDetails from './ItemDetails.js'
import {  Grid } from 'semantic-ui-react'
import {  Row, Col } from 'react-flexbox-grid';

class AvailableItems extends Component {
  constructor(props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this);
  }


  handleUpdate(args){
    this.props.addInState(args)
  }

  render() {
    var buildUpList = this.props.state.items.map((items, i) => (
        <ClothingItem state={items} key={i} handleUpdate={this.handleUpdate}/>
    ));

    return (
      <Grid textAlign="center" verticalAlign="middle" centered columns={1}>
        <Row>
          <Col xs={4} md={4}><h5>Name</h5></Col>
          <Col xs={2} md={2}><h5>Category</h5></Col>
          <Col xs={2} md={2}><h5>Price</h5></Col>
          <Col xs={4} md={4} />
        </Row>
        {buildUpList}
      </Grid>
      
    );
  }
}



class ClothingItem extends Component {
  constructor(props){
    super(props)
    this.handleUpdate= this.handleUpdate.bind(this)
  }

  handleUpdate(args){
    var itemList ={
      id:this.props.state.id,
      name: args.name,
      productCategory: args.productCategory,
      productPrice: args.productPrice,
      productStock: args.productStock
    }

    this.props.handleUpdate(itemList);

  }

  render(){
    if(this.props.state.productStock > 0){
      return(
        <Row>
          <ItemDetails state={this.props.state} handleUpdate={this.handleUpdate} key={this.props.state.name} type='add'/>
        </Row>
      )
    }else{
      return(<div style={{display:'none'}}></div>)
    }
  }
}




export default AvailableItems;
