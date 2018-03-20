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

const fontSize = { fontSize: '16px' };
const redStyle = { backgroundColor: '#f04242' };
const blueStyle = { backgroundColor: '#241e4e' };
const greyStyle = { backgroundColor: '#efefef' };
const floatStyle = { bottom: '35px', right: '24px' };

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
        loanAmount,
        loanWithLmi,
        lvrPercent,
        stampDuty
      } = calc(config, propertyPrice, savings, userStampDuty);
      
      this.setState({
        transferFee, governmentFee, stampDuty,
        savings, depositAmount, propertyPrice,
        depositPercent, loanRatio, lmiPercent, loanAmount,
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
      loanAmount,
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
        
        <div className="container" style={{ padding: '0 10%', backgroundColor: 'white' }}>
        
        <br/>
        <Modal
          header='Enter your details'
          bottomSheet
          trigger={
            <div className="fixed-action-btn" style={floatStyle}>
              <a className="right absolute btn-floating btn-large waves-effect waves-light indigo darken-2"><i className="material-icons">add</i></a>
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

        <Table>        
          <tbody>
          <tr>
              <td>Property Price</td>
              <td>{propertyPrice}</td>
            </tr>
          </tbody>
        </Table>
                
        <Table>        
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

        <Row className="card-panel" style={redStyle}>
          <Col s={8}><span style={strong}>Available Deposit Amount</span></Col>
          <Col s={4}><span style={strong}>{depositAmount || 'Unavailable'}</span></Col>
        </Row>

        <Table>
          <tbody>
            {loanAmount &&
            <tr>
              <td>Loan Amount ({loanRatio}%)</td>
              <td>{loanAmount}</td>
            </tr>
            }

            {lmiAmount && 
            <tr>
              <td>LMI Amount ({lmiPercent}%)</td>
              <td>{lmiAmount}</td>
            </tr>
            }
            
            {lvrPercent &&
            <tr>
              <td>LVR %</td>
              <td>{lvrPercent}</td>
            </tr>
            }

          </tbody>
        </Table> 

        <Row className="card-panel" style={redStyle}>
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
