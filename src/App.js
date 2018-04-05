import React, { Component } from 'react';
import { 
  Input, Row, Table, Modal
} from 'react-materialize';
import conf from './utils/config';
import calc from './utils/loan-calc';

const strong = {
  fontWeight: 800,
  // color: 'white'
};

const fontSize = { fontSize: '16px' };
const theme = {backgroundColor: '#1A8CFF'};
const redStyle = { backgroundColor: '#f04242' };
const blueStyle = { backgroundColor: '#241e4e' };
const greyStyle = { backgroundColor: '#efefef' };
const floatStyle = { bottom: '35px', right: '24px' };

class App extends Component {
  constructor(props) {
    super(props);
    this.configChange = this.configChange.bind(this);
    this.landPriceChange = this.landPriceChange.bind(this);
    this.housePriceChange = this.housePriceChange.bind(this);
    this.savings = this.savings.bind(this);
    this.stampDuty = this.stampDuty.bind(this);
    this.update = (method) => (event) => {
      this[method](event);
      this.calculate();
    };

    this.form = {
      config: conf('default'),
      userStampDuty: null,
      savings: 0,
      landPrice: 0,
      housePrice: 0,
      solicitorFees: 0,
      landDepositPercent: 0,
      houseDepositPercent: 0
    };

    this.state = {};
  }

  configChange(event) {
    const bank = event.target.value;

    if (bank) {
      this.form.config = conf(bank);
    }
  }

  landPriceChange(event) {
    const landPrice = event.target.value;

    if (landPrice) {
      this.form.landPrice = landPrice;
    }
  }

  landDepositPercentChange(event) {
    const landDepositPercent = event.target.value;

    if (landDepositPercent) {
      this.form.landDepositPercent = landDepositPercent;
    }
  }

  housePriceChange(event) {
    const housePrice = event.target.value;

    if (housePrice) {
      this.form.housePrice = housePrice;
    }
  }

  houseDepositPercentChange(event) {
    const houseDepositPercent = event.target.value;

    if (houseDepositPercent) {
      this.form.houseDepositPercent = houseDepositPercent;
    }
  }

  solicitorFees(event) {
    const solicitorFees = event.target.value;

    if (solicitorFees) {
      this.form.solicitorFees = solicitorFees;
    }
  }

  savings(event) {
    const savings = event.target.value;

    if (savings) {
      this.form.savings = savings;
    }
  }
  
  stampDuty(event) {
    const userStampDuty = event.target.value;

    if (userStampDuty) {
      this.form.userStampDuty = userStampDuty;
    }
  }

  calculate() {
    const { config, landPrice, landDepositPercent, houseDepositPercent, housePrice, savings, userStampDuty, solicitorFees } = this.form;
    
    try {
        const {
        transferFee,
        governmentFee,
        stampDuty,
        propertyPrice,
        depositAmount,
        depositPercent,
        loanRatio, 
        lmiPercent,
        lmiAmount,
        loanAmount,
        loanWithLmi,
        lvrPercent,
        upfrontLandBookingAmount,
        upfrontLandDepositAmount,
        upfrontHouseDepositAmount        
      } = calc(config, landPrice, housePrice, savings, solicitorFees, landDepositPercent, houseDepositPercent, userStampDuty);
      
      this.setState({
        transferFee, governmentFee, stampDuty,
        propertyPrice, savings, depositAmount, depositPercent,
        loanRatio, lmiPercent, lmiAmount,
        loanAmount, loanWithLmi, lvrPercent,
        upfrontLandBookingAmount, upfrontLandDepositAmount, upfrontHouseDepositAmount
      });
    } catch (err) {
      console.log('Invalid input', err);
    }
  }

  toggleView(el, plus, minus) {
    if (el.style.display === 'block') {
      el.style.display = 'none';
      plus.style.display = 'inline';
      minus.style.display = 'none';
      return;
    }
    
    el.style.display = 'block';
    plus.style.display = 'none';
    minus.style.display = 'inline';
    return;
  }

  render() {
    const { landPrice, landDepositPercent, houseDepositPercent, housePrice, savings, solicitorFees, userStampDuty } = this.form;
    
    const {
      propertyPrice,
      stampDuty,
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
      upfrontLandBookingAmount,
      upfrontLandDepositAmount,
      upfrontHouseDepositAmount
    } = this.state;


    const leftover = ((savings || 0) -
      (stampDuty || 0) -
      governmentFee -
      transferFee -
      solicitorFees -
      (upfrontLandBookingAmount || 0) -
      (upfrontLandDepositAmount || 0) -
      (upfrontHouseDepositAmount || 0));


    const combinedLeftoverDeposit = (
      leftover +
      (upfrontLandBookingAmount || 0) +
      (upfrontLandDepositAmount || 0) +
      (upfrontHouseDepositAmount || 0));

    return (
      <div className="App">
        <nav>
          <div className="nav-wrapper" style={theme}>
            <a className="brand-logo center">Loan Planner</a>
          </div>
        </nav>
        
        <div className="container" style={{ padding: '0 2%', marginTop: '1%', marginBottom: '1%', backgroundColor: 'white', color: '#828181' }}>
        
        <br/>
        <Modal
          header='Enter your details'
          bottomSheet
          trigger={
            <div className="fixed-action-btn" style={floatStyle}>
              <a className="right absolute btn-floating btn-large waves-effect waves-light" style={theme}><i className="material-icons tiny">tune</i></a>
            </div>
          }>
          <Row>
          <Input s={3} type='select' label="Pick LMI Rate" defaultValue="default" onChange={this.update('configChange')}>
            <option value='default'>Default</option>
            <option value='westpac'>Westpac</option>
          </Input>
        </Row>
      
        <Row>
          <Input type="number" step="1000" style={fontSize} onChange={this.update('landPriceChange')} label="Land Price" />
        </Row>

        <Row>
          <Input type="number" step="5" style={fontSize} onChange={this.update('landDepositPercentChange')} label="Land Deposit %" />
        </Row>
                
        <Row>
          <Input type="number" step="1000" style={fontSize} onChange={this.update('housePriceChange')} label="House Price" />
        </Row>

        <Row>
          <Input type="number" step="5" style={fontSize} onChange={this.update('houseDepositPercentChange')} label="House Deposit %" />
        </Row>

        <Row>
          <Input type="number" step="1000" style={fontSize} onChange={this.update('savings')} label="Savings" />
        </Row>

        <Row>        
          <Input type="number" step="1000" style={fontSize} onChange={this.update('stampDuty')} label="Stamp Duty (optional)" />
        </Row>
        
        <Row>        
          <Input type="number" step="1000" style={fontSize} onChange={this.update('solicitorFees')} label="Solicitor Fees" />
        </Row>
        </Modal>

        <Table className="highlight bordered">        
          <tbody>
          <tr>
              <td>Land Price</td>
              <td>{landPrice}</td>
            </tr>
            <tr>
              <td>House Price</td>
              <td>{housePrice}</td>
            </tr>

            <tr>
              <td>Stamp Duty</td>
              <td>{stampDuty}</td>
            </tr>
            
            <tr>
              <td>Transfer Fee</td>
              <td>{transferFee}</td>
            </tr>
            
            <tr>
              <td>Government Fee</td>
              <td>{governmentFee}</td>
            </tr>
            
            <tr>
              <td>Solicitor Fees</td>
              <td>{solicitorFees}</td>
            </tr>

            <tr>
              <td>Total property</td>
              <td>{propertyPrice}</td>
            </tr>

            <tr>
              <td>Savings</td>
              <td>{savings}</td>
            </tr>
            
            <tr onClick={() => this.toggleView(this.upfrontDepositTable, this.upfrontDepositTablePlus, this.upfrontDepositTableMinus)}>
              <td style={strong}>
                <i ref={(r) => this.upfrontDepositTablePlus = r } className="material-icons tiny">expand_more</i>
                <i ref={(r) => this.upfrontDepositTableMinus = r } className="material-icons tiny" style={{display: 'none'}}>expand_less</i>
                Land upfront deposit amount</td>
              <td>{(upfrontLandBookingAmount || 0) + (upfrontLandDepositAmount || 0)}</td>
            </tr>

            <tr ref={(o) => { this.upfrontDepositTable = o }} style={{ display: 'none' }}>
            {upfrontLandDepositAmount && <Table className="highlight bordered">
            <tbody>
                <tr>
                    <td>0.25% (-)</td>
                    <td>{upfrontLandBookingAmount}</td>
                </tr>
                <tr>
                    <td>{parseInt(landDepositPercent) - 0.25}% (-)</td>
                    <td>{upfrontLandDepositAmount}</td>
                </tr>
              </tbody>
            </Table>
            }
            </tr>

            <tr>
              <td>House upfront deposit amount</td>
              <td>{upfrontHouseDepositAmount}</td>
            </tr>            

            <tr onClick={() => this.toggleView(this.depositTable, this.depositTablePlus, this.depositTableMinus)}>
              <td style={strong}>
                <i ref={(r) => this.depositTablePlus = r } className="material-icons tiny">expand_more</i>
                <i ref={(r) => this.depositTableMinus = r } className="material-icons tiny" style={{display: 'none'}}>expand_less</i>
                Available Loan Deposit Amount<br/>
                (incl. 5 - 10 % deposit + any extras)
              </td>
              <td style={strong}>{depositAmount || 'Unavailable'}</td>              
            </tr>
            <tr ref={(o) => { this.depositTable = o }} style={{ display: 'none' }}>
            {depositAmount && <Table className="highlight bordered">
              <tbody>
                <tr>
                    <td>Savings (+)</td>
                    <td>{savings}</td>
                </tr>
                <tr>
                    <td>Stamp duty (-)</td>
                    <td>{stampDuty}</td>
                </tr>
                <tr>
                    <td>Fees (-)</td>
                    <td>{governmentFee + transferFee}</td>
                </tr>
                <tr>
                    <td>Solicitor Fees (-)</td>
                    <td>{solicitorFees}</td>
                </tr>                
                
                <tr>
                    <td>Upfront deposits (-)</td>
                    <td>{
                      (upfrontLandBookingAmount || 0) +
                      (upfrontLandDepositAmount || 0) +
                      (upfrontHouseDepositAmount || 0)
                    }</td>
                </tr>

                <tr>
                    <td>Leftover savings (+)</td>
                    <td>{leftover}</td>
                </tr>

                <tr style={strong}>
                    <td>Total deposit</td>
                    <td>{combinedLeftoverDeposit}</td>
                </tr>

              </tbody>
              </Table>
            }
            </tr>
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

            <tr onClick={() => this.toggleView(this.loanTable, this.loanTablePlus, this.loanTableMinus)}>
              <td style={strong}>
                <i ref={(r) => this.loanTablePlus = r } className="material-icons tiny">expand_more</i>
                <i ref={(r) => this.loanTableMinus = r } className="material-icons tiny" style={{display: 'none'}}>expand_less</i>
                Final Loan Amount</td>
              <td style={strong}>{loanWithLmi || 'Unavailable'}</td>
            </tr>
            <tr ref={(o) => { this.loanTable = o }} style={{ display: 'none' }}>
            {loanWithLmi && <Table className="highlight bordered">
              <tbody>
                <tr>
                    <td>Loan Amount (+)</td>
                    <td>{loanAmount}</td>
                </tr>
                <tr>
                    <td>LMI Amount (+)</td>
                    <td>{lmiAmount}</td>
                </tr>
              </tbody>
              </Table>
            }
            </tr>


          </tbody>
        </Table>      
        </div>
      </div>
    );
  }
}

export default App;
