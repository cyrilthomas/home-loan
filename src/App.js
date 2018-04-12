import React, { Component } from 'react';
import { 
  Input, Row, Table, Modal, Toast
} from 'react-materialize';
import conf from './utils/config';
import calc from './utils/savings-calc';

const strong = {
  fontWeight: 800,
  // color: 'white'
};

const greyColor = '#828181';
const fontSize = { fontSize: '16px' };
const theme = { backgroundColor: '#1A8CFF' };
const redStyle = { backgroundColor: '#f04242' };
const whiteText = { color: 'white' };
const blueStyle = { backgroundColor: '#241e4e' };
const greyStyle = { backgroundColor: greyColor };
const floatStyle = { bottom: '35px', right: '24px' };
const expandables = { position: 'absolute', marginLeft: '-20px', color: greyColor };
const errorStyle = {
  height: '50px', 
  color: 'white', 
  textAlign: 'center', 
  verticalAlign: 'middle', 
  lineHeight: '50px'
};

class App extends Component {
  constructor(props) {
    super(props);
    const bank = 'default';    
    
    this.configChange = this.configChange.bind(this);
    this.landPriceChange = this.landPriceChange.bind(this);
    this.housePriceChange = this.housePriceChange.bind(this);
    this.loanAmount = this.loanAmount.bind(this);
    this.stampDuty = this.stampDuty.bind(this);
    this.userSavingsChange = this.userSavingsChange.bind(this);
    this.update = (method) => (event) => {
      this[method](event);
      this.calculate();
    };
    this.reset();

    this.state = {};
  }

  reset(bank = 'default') {
    this.form = {
      bank,
      config: conf(bank),
      userSavings: null,
      userStampDuty: null,
      loanAmount: 0,
      landPrice: 0,
      housePrice: 0,
      solicitorFees: 0,
      depositAmount: null,
      landDepositPercent: 0,
      houseDepositPercent: 0
    };
  }

  userSavingsChange(event) {
    const userSavings = event.target.value;

    if (userSavings) {
      this.form.userSavings = parseInt(userSavings);
    }
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

  loanAmount(event) {
    const loanAmount = event.target.value;

    if (loanAmount) {
      this.form.loanAmount = loanAmount;
    }
  }
  
  stampDuty(event) {
    const userStampDuty = event.target.value;

    if (userStampDuty) {
      this.form.userStampDuty = userStampDuty;
    }
  }

  calculate() {
    const { config, landPrice, landDepositPercent, houseDepositPercent, housePrice, loanAmount, userStampDuty, solicitorFees } = this.form;
    
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
        loanWithLmi,
        lvrPercent,
        upfrontLandBookingAmount,
        upfrontLandDepositAmount,
        upfrontHouseDepositAmount,
        upfrontDeposits,
        savings,
        additionalCapital,
        lmiPosition
      } = calc(config, landPrice, housePrice, loanAmount, solicitorFees, landDepositPercent, houseDepositPercent, userStampDuty);

      const projections = [lmiPosition - 1, lmiPosition - 2, lmiPosition - 3];
      const projected = projections.map((projection, idx) => {
        const [first] = config.LVR_RANGES[projection];        
        const newLoanAmount = Math.round((first + 0.01) / 100 * propertyPrice);        
        const extraSavings = (loanAmount - newLoanAmount);
        
        return [
          extraSavings, newLoanAmount, calc(
            config, landPrice, housePrice, newLoanAmount, 
            solicitorFees, landDepositPercent, 
            houseDepositPercent, userStampDuty
          )
        ];
      });
      // const projected = [];
      
      this.setState({
        errMessage: null,
        transferFee, governmentFee, stampDuty,
        propertyPrice, depositAmount, depositPercent,
        loanRatio, lmiPercent, lmiAmount,
        loanAmount, loanWithLmi, lvrPercent,
        upfrontLandBookingAmount, upfrontLandDepositAmount, upfrontHouseDepositAmount,
        upfrontDeposits, savings, additionalCapital, projected
      });
    } catch (err) {
      this.setState({ errMessage: err.message });
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
    const { bank, userSavings, landPrice, landDepositPercent, houseDepositPercent, housePrice, loanAmount, solicitorFees, userStampDuty } = this.form;    
    
    const {
      errMessage,
      propertyPrice,
      stampDuty,
      transferFee,
      governmentFee,
      depositAmount,
      depositPercent,
      loanRatio,
      lmiPercent,
      lmiAmount,
      loanWithLmi,
      lvrPercent,
      upfrontLandBookingAmount,
      upfrontLandDepositAmount,
      upfrontHouseDepositAmount,
      upfrontDeposits,
      savings,
      additionalCapital,
      projected
    } = this.state;
    const savingsStyle = (userSavings && (savings > userSavings)) ? { ...strong, ...redStyle, ...whiteText } : strong;

    return (
      <div className="App">
        <nav>
          <div className="nav-wrapper" style={theme}>
            <a className="brand-logo center">LOAN PLANNER</a>
          </div>
        </nav>
                
        <div className="container" style={{ padding: '0 2%', marginTop: '1%', marginBottom: '1%', backgroundColor: 'white', color: greyColor }}>
        <br/>
        
        {errMessage && <div className="red accent-3" style={errorStyle}>
            <p>Ooops! {errMessage}</p>
          </div>
        }

        <Modal
          header='Enter your details'
          bottomSheet
          trigger={
            <div className="fixed-action-btn" style={floatStyle}>
              <a className="right absolute btn-floating btn-large waves-effect waves-light" style={theme}><i className="material-icons tiny">tune</i></a>
            </div>
          }>
          <Row>
          <Input s={3} type='select' label="Pick LMI rate" defaultValue={bank} onChange={this.update('configChange')}>
            <option value='default'>Default</option>
            <option value='westpac'>Westpac</option>
          </Input>
        </Row>
      
        <Row>
          <Input type="number" step="1000" style={fontSize} onChange={this.update('landPriceChange')} label="Land price" />
        </Row>

        <Row>
          <Input type="number" step="5" style={fontSize} onChange={this.update('landDepositPercentChange')} label="Land deposit %" />
        </Row>
                
        <Row>
          <Input type="number" step="1000" style={fontSize} onChange={this.update('housePriceChange')} label="House Price" />
        </Row>

        <Row>
          <Input type="number" step="5" style={fontSize} onChange={this.update('houseDepositPercentChange')} label="House deposit %" />
        </Row>

        <Row>
          <Input type="number" step="1000" style={fontSize} onChange={this.update('loanAmount')} label="Loan amount" />
        </Row>

        <Row>        
          <Input type="number" step="1000" style={fontSize} onChange={this.update('solicitorFees')} label="Solicitor fees" />
        </Row>

        <Row>        
          <Input type="number" step="1000" style={fontSize} onChange={this.update('userSavingsChange')} label="Your savings (optional)" />
        </Row>
        
        <Row>        
          <Input type="number" step="1000" style={fontSize} onChange={this.update('stampDuty')} label="Stamp duty (optional)" />
        </Row>
        
        
        </Modal>

        <Table className="highlight bordered">        
          <tbody>
          <tr>
              <td>Land price</td>
              <td>{landPrice}</td>
            </tr>
            <tr>
              <td>House price</td>
              <td>{housePrice}</td>
            </tr>

            <tr>
              <td>Stamp duty</td>
              <td>{stampDuty}</td>
            </tr>
            
            <tr>
              <td>Transfer fee</td>
              <td>{transferFee}</td>
            </tr>
            
            <tr>
              <td>Government fee</td>
              <td>{governmentFee}</td>
            </tr>
            
            <tr>
              <td>Solicitor fees</td>
              <td>{solicitorFees}</td>
            </tr>

            <tr>
              <td>Total property</td>
              <td>{propertyPrice}</td>
            </tr>

            <tr style={strong}>
              <td>Loan amount</td>
              <td>{loanAmount}</td>
            </tr>            
            
            <tr style={strong} onClick={() => this.toggleView(this.upfrontDepositTable, this.upfrontDepositTablePlus, this.upfrontDepositTableMinus)}>
              <td>
                <i ref={(r) => this.upfrontDepositTablePlus = r } className="material-icons tiny" style={expandables}>expand_more</i>
                <i ref={(r) => this.upfrontDepositTableMinus = r } className="material-icons tiny" style={{display: 'none', ...expandables}}>expand_less</i>
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

            <tr style={savingsStyle} onClick={() => this.toggleView(this.depositTable, this.depositTablePlus, this.depositTableMinus)}>
              <td>
                <i ref={(r) => this.depositTablePlus = r } className="material-icons tiny" style={expandables}>expand_more</i>
                <i ref={(r) => this.depositTableMinus = r } className="material-icons tiny" style={{display: 'none', ...expandables}}>expand_less</i>
                Total savings<br/>
              </td>
              <td>
                {savings || 'Unavailable'}
              </td>
            </tr>
            <tr ref={(o) => { this.depositTable = o }} style={{ display: 'none' }}>
            {depositAmount ? <Table className="highlight bordered">
              <tbody>                
                <th>
                  <div>Out of hand expenses</div>
                </th>
                
                <tr>
                    <td>Stamp duty (-)</td>
                    <td>{stampDuty}</td>
                </tr>
                
                <tr>
                    <td>Fees (-)</td>
                    <td>{governmentFee + transferFee}</td>
                </tr>
                <tr>
                    <td>Solicitor fees (-)</td>
                    <td>{solicitorFees}</td>
                </tr>
                
                <th>
                  <div>Property contributions</div>
                </th>

                <tr>
                    <td>Upfront deposits</td>
                    <td>{upfrontDeposits}</td>
                </tr>
                <tr>
                    <td>Additional capital</td>
                    <td>{additionalCapital}</td>
                </tr>
              </tbody>
              </Table>
            : null}
            </tr>

            {lmiAmount ? 
            <tr>
              <td>LMI amount ({lmiPercent}%)</td>
              <td>{lmiAmount}</td>
            </tr>
            : null}

            {loanWithLmi ? <tr>
              <td style={strong}>
                Final loan Amount ({lvrPercent}%)</td>
              <td style={strong}>{loanWithLmi || 'Unavailable'}</td>
            </tr>
            : null}

            <tr style={strong} onClick={() => this.toggleView(this.projectionTable, this.projectionTablePlus, this.projectionTableMinus)}>
              <td>
                <i ref={(r) => this.projectionTablePlus = r } className="material-icons tiny" style={expandables}>expand_more</i>
                <i ref={(r) => this.projectionTableMinus = r } className="material-icons tiny" style={{display: 'none', ...expandables}}>expand_less</i>
                Lower loan repayment options
              </td>
              <td> - </td>
            </tr>

            <tr ref={(o) => { this.projectionTable = o }} style={{ display: 'none' }}>
            <Table className="highlight bordered">              
              {projected && projected.map(([extra, loan, projection], key) =>
                <tbody key={key}>
                  <th>
                    <div>Additional savings - ${extra}</div>
                  </th>
                  <tr>
                    <td>Total savings</td>
                    <td>{projection.savings}</td>
                  </tr>
                  <tr>
                    <td>Loan</td>
                    <td>{loan}</td>
                  </tr>
                  <tr>
                    <td>LMI</td>
                    <td>{projection.lmiAmount}</td>
                  </tr>
                  <tr>
                    <td>Final loan amount ({projection.lvrPercent}%)</td>
                    <td>{projection.loanWithLmi}</td>
                  </tr>
                </tbody>
              )}
            </Table>
            </tr>

          </tbody>
        </Table>      
        </div>
      </div>
    );
  }
}

export default App;
