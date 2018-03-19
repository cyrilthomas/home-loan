import React, { Component } from 'react';
import { 
  Input, Row,
  Col, Table,
  Modal
} from 'react-materialize';
import conf from './utils/config';
import calc from './utils/lmi-calc';

const strong = {
  fontWeight: 800,
  color: 'white'
};

const fontSize = {
  fontSize: '16px'
}

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
      userStampDuty: 0,
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
    const userStampDuty = event.target.value;

    if (userStampDuty) {
      this.store.userStampDuty = userStampDuty;
    }
  }

  calculate() {
    const { config, propertyPrice, savings, userStampDuty } = this.store;
    
    try {
        const {
        transferFee,
        governmentFee,
        depositAmount,
        depositPercent,
        loanRatio, 
        lmiPercent,
        lmiAmount,
        loanWithLmi,
        lvrPercent,
        stampDuty
      } = calc(config, propertyPrice, savings, userStampDuty);
      
      this.setState({
        transferFee, governmentFee, stampDuty,
        savings, depositAmount, propertyPrice,
        depositPercent, loanRatio, lmiPercent, 
        lmiAmount, lvrPercent, loanWithLmi
      });
    } catch (err) {
      console.log('Invalid input', err);
    }
  }

  render() {
    const {
      savings,
      stampDuty,
      transferFee,
      governmentFee,
      depositAmount,
      propertyPrice,
      depositPercent,
      loanRatio,
      lmiPercent,
      lmiAmount,
      loanWithLmi,
      lvrPercent
    } = this.state;

    return (
      <div className="App">
        <nav>
          <div className="nav-wrapper indigo darken-2">
            <a className="brand-logo center">Loan Planner</a>
          </div>
        </nav>
        
        <div className="container" style={{ padding: '0 10% ' }}>
        
        <br/>
        <Modal
          header='Enter your details'
          bottomSheet
          trigger={
            <div className="fixed-action-btn" style={{ bottom: '35px', right: '24px' }}>
              <a className="right absolute btn-floating btn-large waves-effect waves-light red accent-3"><i className="material-icons">add</i></a>
            </div>
          }>
          <Row>
          <Input s={3} type='select' label="Pick LMI Rate" defaultValue="default" onChange={this.update('configChange')}>
            <option value='default'>Default</option>
            <option value='westpac'>Westpac</option>
          </Input>
        </Row>
      
        <Row>
          <Input type="number" step="1000" style={fontSize} onChange={this.update('priceChange')} label="Property Price" />
        </Row>

        <Row>
          <Input type="number" step="1000" style={fontSize} onChange={this.update('savings')} label="Savings" />
        </Row>

        <Row>        
          <Input type="number" step="1000" style={fontSize} onChange={this.update('stampDuty')} label="Stamp Duty" />
        </Row>
        </Modal>


        <Table className="bordered">        
          <tbody>
            <tr>
              <td>Savings</td>
              <td>+{savings}</td>
            </tr>

            <tr>
              <td>Stamp Duty</td>
              <td>-{stampDuty}</td>
            </tr>
            
            <tr>
              <td>Transfer Fee</td>
              <td>-{transferFee}</td>
            </tr>
            
            <tr>
              <td>Government Fee</td>
              <td>-{governmentFee}</td>
            </tr>

          </tbody>
        </Table>
        
        <Row className="card-panel teal lighten-2">
          <Col s={8}><span style={strong}>Available Deposit Amount</span></Col>
          <Col s={4}><span style={strong}>{depositAmount || 'Unavailable'}</span></Col>
        </Row>

        <Table className="bordered">
          <tbody>                    
            <tr>
              <td>Property Price</td>
              <td>{propertyPrice}</td>
            </tr>
            
            
            <tr>
              <td>Deposit Ratio</td>
              <td>{depositPercent}%</td>
            </tr>
            
            <tr>
              <td>Loan Ratio</td>
              <td>{loanRatio}%</td>
            </tr>
            
            <tr>
              <td>LMI</td>
              <td>{lmiPercent}%</td>
            </tr>
            
            <tr>
              <td>LMI Amount</td>
              <td>{lmiAmount}</td>
            </tr>          
            
            <tr>
              <td>LVR</td>
              <td>{lvrPercent}%</td>
            </tr>

          </tbody>
        </Table> 

        <Row className="card-panel teal lighten-2">
          <Col s={8}><span style={strong}>Loan Amount</span></Col>
          <Col s={4}><span style={strong}>{loanWithLmi || 'Unavailable'}</span></Col>
        </Row>
        <p>Not included - solicitor fees</p>
        </div>
      </div>
    );
  }
}

export default App;
