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
      actions: [],
      actionStatuses: [],
      accountId: ''
    }
    this.onUp = this.onUp.bind(this);
    this.onDown = this.onDown.bind(this);
    this.pushAction = this.pushAction.bind(this);
    this.pushActionStatus = this.pushActionStatus.bind(this);
    this.changeLastActionStatus = this.changeLastActionStatus.bind(this);
    this.getActionForNwSt = this.getActionForNwSt.bind(this);
  }

  componentDidMount() {
    this.pushAction("Check network connectivity");
    checkNetworkStatus(this.onUp, this.onDown)
  }

  onUp() {
    this.pushActionStatus("Done");
    this.pushAction("Internet ready!");
    this.pushActionStatus("");
  }

  onDown(networkStatus) {
    this.pushActionStatus("Done");

    // Try login into Dormitory network if detect FU Dorm network
    if (networkStatus === NETWORK_STATUS.FU_NETWORK_NOT_LOGGED_IN) {
      let username, password;
      chrome.storage.sync.get(["username", "password"], (items) => {
        username = items.username;
        password = items.password;

        if (!(username.trim() && password.trim())) {
          alert("Please provide your Internet Account in option first!");
          window.location = chrome.extension.getURL("options.html");
        } else {
          this.setState({accountId: username});
          this.pushAction(this.getActionForNwSt(NETWORK_STATUS.FU_NETWORK_CONNECTING));

          LoginWithInfo(username, password).then(() => {
            this.pushActionStatus("Done");
            this.pushAction("Re-checking network connectivity");
            checkNetworkStatus(this.onUp, this.onDown);
          }, (failReason) => {
            this.pushActionStatus(failReason);
          });
        }
      });
    } else {
      this.pushAction(this.getActionForNwSt(networkStatus));
      this.pushActionStatus("");
    }
  }

  pushAction(actionName) {
    this.setState({
      actions: update(this.state.actions, {$push: [actionName]})
    });
  }

  pushActionStatus(actionStatus) {
    this.setState({
      actionStatuses: update(this.state.actionStatuses, {$push: [actionStatus]})
    });
  }

  changeLastActionStatus(actionStatus) {

  }

  render() {
    let connectionTableRows = this.state.actions.map((action, index) => {
      let actionStatus = this.state.actionStatuses[index] !== undefined ? this.state.actionStatuses[index] : '...';

      return <tr key={index}>
        <td>{action}</td>
        <td>{actionStatus}</td>
      </tr>
    });

    return <div>
      <Table className="login-process">
        <tbody>
          {connectionTableRows}
        </tbody>
      </Table>
    </div>
  }

  getActionForNwSt(networkStatus) {
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
        result = "=> Error: Please check your network connection";
        break;
      case NETWORK_STATUS.INTERNET_READY:
        result = "Internet Ready!";
        break;
      case NETWORK_STATUS.FU_NETWORK_LOGIN_FAILED:
        result = "Login failed";
        break;
      case NETWORK_STATUS.FU_NETWORK_LOGGED_IN_NO_INTERNET:
        result = "Logged in but no Internet access";
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
              <div className="option-links pull-right">
                <a href='#' className='retry' onClick={() => {location.reload()}}>Retry</a>
                <a href={chrome.extension.getURL("options.html")}>Change Internet Account</a>
              </div>
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
