import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
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
    const bank = event.target.value;

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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Home Loan Calculator</h1>
        </header>
        
        <select name="config" onChange={this.configChange}>
          <option value="">Select</option>
          <option value="default">Default</option>
          <option value="westpac">Westpac</option>          
        </select>
        
        <p>Property price</p>
        <input id="number" type="number" onChange={this.priceChange}/>

        <p>Savings</p>
        <input id="number" type="number" onChange={this.savings}/>

        <p>Stamp duty</p>
        <input id="number" type="number" onChange={this.stampDuty}/>

        <br/>
        <button type="button"onClick={this.calculate}>Calculate</button>

        
        <p>Savings:           + {this.state.savings}</p>
        <p>Stamp duty:        - {this.state.stampDuty}</p>
        <p>Transfer fee:      - {this.state.transferFee}</p>
        <p>Government fee:    - {this.state.governmentFee}</p> 

        <p>Available deposit:    - {this.state.depositAmount}</p>               
        <p>Property price:    + {this.state.propertyPrice}</p>
        <p>Deposit ratio:         - {this.state.depositPercent}%</p>        
        <p>Loan ratio:        - {this.state.loanRatio}%</p>
        <p>LMI:       - {this.state.lmiPercent}%</p>
        <p>LMI amount:        - {this.state.lmiAmount}</p>
        <p>Loan amount:       - {this.state.loanAmount}</p>
      </div>
    );
  }
}

export default App;
