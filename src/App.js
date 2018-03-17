import React, { Component } from 'react';
import { 
  Button, Input, 
  Row, Dropdown, 
  NavItem, Navbar, 
  Col, Table
} from 'react-materialize';
import conf from './utils/config';
import calc from './utils/lmi-calc';

class App extends Component {
  constructor(props) {
    super(props);
    this.configChange = this.configChange.bind(this);
    this.priceChange = this.priceChange.bind(this);
    this.savings = this.savings.bind(this);
    this.stampDuty = this.stampDuty.bind(this);
    this.update = (method) => (event) => {
      this[method](event);
      this.calculate();
    };

    this.store = {
      config: conf('default'),
      config: conf('default'),
      stampDuty: 30000,
      savings: 0,
      depositAmount: 0,
      propertyPrice: 0
    };
    this.state = {};
  }

  configChange(event) {
    const bank = event.target.value;

    if (bank) {
      this.store.config = conf(bank);
    }
  }

  priceChange(event) {
    const propertyPrice = event.target.value;

    if (propertyPrice) {
      this.store.propertyPrice = propertyPrice;
    }
  }

  savings(event) {
    const savings = event.target.value;

    if (savings) {
      this.store.savings = savings;
    }
  }
  
  stampDuty(event) {
    const stampDuty = event.target.value;

    if (stampDuty) {
      this.store.stampDuty = stampDuty;
    }
  }

  calculate() {
    const { config, propertyPrice, savings, stampDuty } = this.store;
    
    try {
        const {
        transferFee,
        governmentFee,
        depositAmount,
        depositPercent,
        loanRatio, 
        lmiPercent,
        lmiAmount,
        loanAmount
      } = calc(config, propertyPrice, savings, stampDuty);
      
      this.setState({
        transferFee, governmentFee, stampDuty,
        savings, depositAmount, propertyPrice,
        depositPercent, loanRatio, lmiPercent, 
        lmiAmount, loanAmount
      });
    } catch (err) {
      console.log('Invalid input');
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar brand='Home Loan Calculator'/>

        <div className="container">
        
        <br/>
        <Row>
          <Input s={3} type='select' label="Pick LMI Rate" defaultValue="default" onChange={this.update('configChange')}>
            <option value='default'>Default</option>
            <option value='westpac'>Westpac</option>
          </Input>
        </Row>
      
        <Row>
          <Input type="number" onChange={this.update('priceChange')} label="Property Price" />
        </Row>

        <Row>
          <Input type="number" onChange={this.update('savings')} label="Savings" />
        </Row>

        <Row>        
          <Input type="number" onChange={this.update('stampDuty')} label="Stamp Duty" />
        </Row>      

        <Table className="bordered">        
          <tbody>
            <tr>
              <td>Savings</td>
              <td>+{this.state.savings}</td>
            </tr>

            <tr>
              <td>Stamp Duty</td>
              <td>-{this.state.stampDuty}</td>
            </tr>
            
            <tr>
              <td>Transfer Fee</td>
              <td>-{this.state.transferFee}</td>
            </tr>
            
            <tr>
              <td>Government Fee</td>
              <td>-{this.state.governmentFee}</td>
            </tr>

          </tbody>
        </Table>
        
        <Row className="teal">
          <Col s={8}>Available Deposit Amount</Col>
          <Col s={4}>{this.state.depositAmount}</Col>
        </Row>

        <Table className="bordered">
          <tbody>                    
            <tr>
              <td>Property Price</td>
              <td>{this.state.propertyPrice}</td>
            </tr>
            
            
            <tr>
              <td>Deposit Ratio</td>
              <td>{this.state.depositPercent}%</td>
            </tr>
            
            <tr>
              <td>Loan Ratio</td>
              <td>{this.state.loanRatio}%</td>
            </tr>
            
            <tr>
              <td>LMI</td>
              <td>{this.state.lmiPercent}%</td>
            </tr>
            
            <tr>
              <td>LMI Amount</td>
              <td>{this.state.lmiAmount}</td>
            </tr>          

          </tbody>
        </Table> 

        <Row className="teal">
          <Col s={8}>Loan Amount</Col>
          <Col s={4}>{this.state.loanAmount}</Col>
        </Row>
        </div>
      </div>
    );
  }
}

export default App;
