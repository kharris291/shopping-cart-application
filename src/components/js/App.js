import React, {Component} from 'react';

import '../css/App.css';

import axios from 'axios';

import AvailableItems from './AvailableItems'
import ShoppingCart from './ShoppingCart'

import { Segment, Container, Form, Grid } from 'semantic-ui-react'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      shoppingCart:[],
      runningTotal:0,
      promoCodeInput: "",
      promotionApplied:[
      {
        name: "5QUIDOFF",
        content: "£5 pounds off your order",
        applyMe: false
      }
      ],
      loading: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.removeItemParent = this.removeItemParent.bind(this);
    this.addInState = this.addInState.bind(this);
    this.checkPromoCode = this.checkPromoCode.bind(this);
    this.inputPromoCode = this.inputPromoCode.bind(this);
  }

  async componentDidMount() {
    await axios.get('http://localhost:8080/api/items')
    .then((data) => {
      this.setState({ items: data.data, loading: false })
      console.log(this.state)
    })
    console.log(this.state)
  }


  handleChange(e, { name, value }){
    this.inputPromoCode({ name, value })
  }


  addInState = (attrs) => {

    var totalValue = parseFloat(this.state.runningTotal) + parseFloat(attrs.productPrice)
  /* update the item list and shopping cart lists to show stock */
  this.setState({
    items:this.state.items.map((item) => {
      if (item.name ===  attrs.name ) {
        return {
          id:item.id,
          name: attrs.name,
          productCategory: attrs.productCategory,
          productPrice: attrs.productPrice,
          productStock: (attrs.productStock - 1)
        };
      }
      else {
        return item;
      }
    }),
    runningTotal: parseFloat(totalValue).toFixed(2)
  });

    /* 
      1)if the shopping cart is empty then create a new block with the current item in it
      2)Otherwise loop through the

    */
  var itemList
if(this.state.shoppingCart.length === 0 ){
  itemList={
    id:attrs.id,
    name: attrs.name,
    productCategory: attrs.productCategory,
    productPrice: attrs.productPrice,
    productStock: 1
  }
  this.setState({ shoppingCart : [itemList] })
}else{
  var shoppingCartArray = this.state.shoppingCart
  var shoppingCartArrayCheck = false
  for (var i = shoppingCartArray.length - 1; i >= 0; i--) {
    if(shoppingCartArray[i].name === attrs.name){
      shoppingCartArrayCheck = true
      break;
    }
  }
  if(shoppingCartArrayCheck === false){
    itemList={
      id:attrs.id,
      name: attrs.name,
      productCategory: attrs.productCategory,
      productPrice: attrs.productPrice,
      productStock: 1
    }
    var shopingList = this.state.shoppingCart.concat(itemList);
    this.setState({ shoppingCart: shopingList })
  }else{
    this.setState({ shoppingCart : 
      this.state.shoppingCart.map((item) => {

        if (item.id === attrs.id) {
          return {
            id:attrs.id,
            name: attrs.name,
            productCategory: attrs.productCategory,
            productPrice: attrs.productPrice,
            productStock: (item.productStock + 1)
          }           
        } else {
          return item;
        }
      })
    })

  }
}

};


removeItemParent(attrs){
  var totalValue = parseFloat(this.state.runningTotal) - attrs.productPrice
  this.setState({
    items: this.state.items.map((item) => {
      console.log(item)
      console.log(item.id ===  attrs.id || (item.id === undefined && item.name === attrs.name ))

      if (item.id ===  attrs.id || (item.id === undefined && item.name === attrs.name )) {
        console.log(item)
        console.log(attrs.id)
        return {
          id: attrs.id,
          name: item.name,
          productCategory: item.productCategory,
          productPrice: item.productPrice,
          productStock: item.productStock  + 1,
        };
      } else {
        return item;
      }
    }),
    shoppingCart:
    this.state.shoppingCart.map((item) => {
      if (item.id ===  attrs.id) {
        return {
          id: item.id,
          name: item.name,
          productCategory: item.productCategory,
          productPrice: item.productPrice,
          productStock: item.productStock  -1 
        }           
      } else {
        return item;
      }
    }),
    runningTotal: parseFloat(totalValue).toFixed(2)
  });

}

/* take in an input for the promo code */
inputPromoCode(attrs){
  this.setState({ promoCodeInput: attrs.value })
}

    /*
     check to see if the promo code has been used already on this booking 
      1) ignore if it's already in use
      2) Otherwise update the item to say it's used
      finally add in the reduction to the total
      */
      checkPromoCode(){
        var promoCodeInput = this.state.promoCodeInput;
        var currentPromoCodeUsed = false

        this.setState({
          promotionApplied:this.state.promotionApplied.map((item) => {
            console.log(item.applyMe)
            if (item.name ===  promoCodeInput && item.applyMe === false ) {
              currentPromoCodeUsed = true
              return {
                name: item.name,
                content: item.content,
                applyMe: true
              };
            } else {
              return item;
            }
          })
        })

        if(currentPromoCodeUsed){
         var totalValue = parseFloat(this.state.runningTotal) - 5 
         this.setState({runningTotal: parseFloat(totalValue).toFixed(2)})
       }
     }
     /* render content */
     render() {
      if(!this.state.loading){
        return (
          [
          <Container className="paddingBetweenContainers">
            {/* Contatiner for both the Available items and the Shopping cart */}
            <Grid textAlign="center" centered  grid='true'  columns={2}>
              <Grid.Column className="shoppingcartContainer">
                <ShoppingCart state={this.state} updateState={this.updateState} handleRemoval={this.removeItemParent} 
                  key="1" /> 
              </Grid.Column>
              <Grid.Column className="itemListContainer">
                <AvailableItems state={this.state} addInStateParent={this.addInState} updateState={this.updateState} key="2" addInState={this.addInState} />  
              </Grid.Column>
            </Grid>
          </Container>,
          <Container>
            {/* Container for the Voucher form*/}
            <Grid textAlign="center" centered grid='true' columns={2}>
              <Grid.Column>
                <Form onSubmit={this.checkPromoCode}>
                  <Segment stacked>
                    <Form.Input
                      label="Apply Voucher Code?"
                      iconPosition="left"
                      name="promoCode"
                      placeholder="Voucher Code"
                      onChange={this.handleChange}
                    />
                    <Form.Button content="Apply Voucher" />
                  </Segment>
                </Form>
              </Grid.Column>
              <Grid.Column className="itemListContainer">
              </Grid.Column>
              </Grid>
            </Container>
          ]
          );
      }else{
        return(<div>loading</div>)
      }
    }
  }

  export default App;
