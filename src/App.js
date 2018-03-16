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
    this.calculate = this.calculate.bind(this);
    this.state = {};
  }

  configChange(event) {
    const bank = event.target.value;;

    if (bank) {
      this.setState({ config: conf(bank) });
    }
  }

  priceChange(event) {
    const propertyPrice = event.target.value;

    if (propertyPrice) {
      this.setState({propertyPrice});
    }
  }

  savings(event) {
    const savings = event.target.value;

    if (savings) {
      this.setState({savings});
    }
  }
  
  stampDuty(event) {
    const stampDuty = event.target.value;

    if (stampDuty) {
      this.setState({stampDuty});
    }
  }

  calculate() {
    const { config, propertyPrice, savings, stampDuty } = this.state;
    
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
      transferFee, governmentFee,
      depositAmount, depositPercent, propertyPrice, loanRatio, lmiPercent, lmiAmount, loanAmount
    });
  }

  render() {
    return (
      <div className="App">
        <Navbar brand='Home Loan Calculator' />        

        <div className="container">
        
        <br/>
        <Row>
          <Input s={2} type='select' label="Pick LMI Rate" onChange={this.configChange}>
            <option value=''></option>
            <option value='default'>Default</option>
            <option value='westpac'>Westpac</option>
          </Input>
        </Row>
      
        <Row>
          <Input type="number" onChange={this.priceChange} label="Property Price" />
        </Row>

        <Row>
          <Input type="number" onChange={this.savings} label="Savings" />
        </Row>

        <Row>        
          <Input type="number" onChange={this.stampDuty} label="Stamp Duty" />
        </Row>
        
        <Button type="button"onClick={this.calculate}>Calculate</Button>

        <Table>        
          <tbody>
            <tr>
              <td>Savings</td>
              <td>+{this.state.savings}</td>
            </tr>

            <tr>
              <td>Stamp Duty</td>
              <td>+{this.state.stampDuty}</td>
            </tr>
            
            <tr>
              <td>Transfer Fee</td>
              <td>+{this.state.transferFee}</td>
            </tr>
            
            <tr>
              <td>Government Fee</td>
              <td>+{this.state.governmentFee}</td>
            </tr>

            <tr>
              <td>Deposit Amount</td>
              <td>+{this.state.depositAmount}</td>
            </tr>
            
            
            <tr>
              <td>Property Price</td>
              <td>+{this.state.propertyPrice}</td>
            </tr>
            
            
            <tr>
              <td>Deposit Ratio</td>
              <td>+{this.state.depositPercent}%</td>
            </tr>
            
            <tr>
              <td>Loan Ratio</td>
              <td>-{this.state.loanRatio}%</td>
            </tr>
            
            <tr>
              <td>LMI</td>
              <td>-{this.state.lmiPercent}%</td>
            </tr>
            
            <tr>
              <td>LMI Amount</td>
              <td>-{this.state.lmiAmount}%</td>
            </tr>
            
            <tr>
              <td>Loan Amount</td>
              <td>-{this.state.loanAmount}%</td>
            </tr>

          </tbody>
        </Table>    
        </div>
      </div>
    );
  }
}

export default App;
