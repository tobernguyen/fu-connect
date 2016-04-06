import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login_page.scss';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import { FAIL_STATUS, LoginWithInfo } from '../lib/login_utils';
import { NETWORK_STATUS, checkNetworkStatus } from '../lib/connectivity_utils';

class ContentCenter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      failReason: null,
      passedStates: [],
      currentState: NETWORK_STATUS.CHECKING
    }
    this.onUp = this.onUp.bind(this);
    this.onDown = this.onDown.bind(this);
    this.changeToState = this.changeToState.bind(this);
    this.getStepText = this.getStepText.bind(this);
  }

  componentDidMount() {
    checkNetworkStatus(this.onUp, this.onDown)
  }

  onUp() {
    this.changeToState(NETWORK_STATUS.INTERNET_READY);
  }

  onDown(networkStatus) {
    // Try login into Dormitory network if detect FU Dorm network
    if (networkStatus === NETWORK_STATUS.FU_NETWORK_NOT_LOGGED_IN) {
      this.changeToState(NETWORK_STATUS.FU_NETWORK_CONNECTING);
      let username, password;
      chrome.storage.sync.get(["username", "password"], (items) => {
        username = items.username;
        password = items.password;

        if (!(username.trim() && password.trim())) {
          alert("Please provide your Internet Account in option first!");
          window.location = chrome.extension.getURL("options.html");
        } else {
          this.setState({accountId: username});

          LoginWithInfo(username, password).then(() => {
            checkNetworkStatus(this.onUp, this.onDown);
          }, (failReason) => {
            this.setState({failReason: failReason});
            this.changeToState(NETWORK_STATUS.FU_NETWORK_LOGIN_FAILED);
          });
        }
      });
    }
  }

  changeToState(nextState) {
    let currentState, passedStatesToPush;

    if (
      nextState === NETWORK_STATUS.FU_NETWORK_LOGIN_FAILED ||
      nextState === NETWORK_STATUS.INTERNET_READY
    ) {
      currentState = null;
      passedStatesToPush = [this.state.currentState, nextState];
    } else {
      currentState = nextState;
      passedStatesToPush =  [this.state.currentState];
    }

    this.setState({
      passedStates: update(this.state.passedStates, {$push: passedStatesToPush}),
      currentState: currentState
    });
  }

  render() {
    let informationText
    let connectionTableRows = this.state.passedStates.map((passedState, index) => {
      let informationText = this.getStepText(passedState),
          statusElement = "Done";

      if (passedState === NETWORK_STATUS.FU_NETWORK_LOGIN_FAILED) {
        statusElement = this.state.failReason;
      }

      return <tr key={index}>
        <td>{informationText}</td>
        <td>{statusElement}</td>
      </tr>
    });

    if (this.state.currentState) {
      connectionTableRows[connectionTableRows.length] = <tr>
        <td>{this.getStepText(this.state.currentState)}</td>
        <td>...</td>
      </tr>
    }

    return <div>
      <Table className="login-process">
        <tbody>
          {connectionTableRows}
        </tbody>
      </Table>
    </div>
  }

  getStepText(networkStatus) {
    let result;
    switch(networkStatus) {
      case NETWORK_STATUS.CHECKING:
        result = "Check network connectivity";
        break;
      case NETWORK_STATUS.FU_NETWORK_NOT_LOGGED_IN:
        result = "FU Dormitory Network found";
        break;
      case NETWORK_STATUS.FU_NETWORK_CONNECTING:
        result = `Login with account ${this.state.accountId}`;
        break;
      case NETWORK_STATUS.NETWORK_PROBLEM:
        result = "Please check your network connection";
        break;
      case NETWORK_STATUS.INTERNET_READY:
        result = "Internet Ready!";
        break;
      case NETWORK_STATUS.FU_NETWORK_LOGIN_FAILED:
        result = "Login failed";
        break;
    }

    return result;
  }
}

class App extends React.Component {
  render() {
    return <div>
      <div className="header">
        <a href="#"><img src={require('../assets/images/logo.png')} width="200px" className="img-responsive"/></a>
      </div>

      <div className="main-content">
        <Grid>
          <Row>
            <Col md={3}>
            </Col>
            <Col md={5}>
              <ContentCenter/>
              <div className="option-links pull-right"><a href={chrome.extension.getURL("options.html")}>Change Internet Account</a></div>
            </Col>
            <Col md={4}>
            </Col>
          </Row>
        </Grid>
      </div>

      <div className="footer">
        Copyright Connect Team © 2016
      </div>
    </div>
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);
