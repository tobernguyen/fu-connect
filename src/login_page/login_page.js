import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login_page.scss';
import { Grid, Row, Col } from 'react-bootstrap';
import { FAIL_STATUS, LoginWithInfo } from '../lib/login_utils';
import { NETWORK_STATUS, checkNetworkStatus } from '../lib/connectivity_utils';

class ContentCenter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      networkStatus: NETWORK_STATUS.CHECKING,
      failReason: null
    }
    this.onUp = this.onUp.bind(this);
    this.onDown = this.onDown.bind(this);
  }

  componentDidMount() {
    checkNetworkStatus(this.onUp, this.onDown)
  }

  onUp() {
    this.setState({networkStatus: NETWORK_STATUS.INTERNET_READY})
  }

  onDown(networkStatus) {
    this.setState({networkStatus: networkStatus});

    // Try login into Dormitory network
    if (networkStatus === NETWORK_STATUS.FU_NETWORK_NOT_LOGGED_IN) {
      let username, password;
      chrome.storage.sync.get(["username", "password"], (items) => {
        username = items.username;
        password = items.password;

        if (!(username.trim() && password.trim())) {
          window.location = chrome.extension.getURL("options.html");
        } else {
          this.setState({networkStatus: NETWORK_STATUS.FU_NETWORK_CONNECTING});

          LoginWithInfo(username, password).then(() => {
            checkNetworkStatus(this.onUp, this.onDown);
          }, (failReason) => {
            this.setState({failReason: failReason});
            this.onDown(NETWORK_STATUS.FU_NETWORK_LOGIN_FAILED);
          });
        }
      });
    }
  }

  render() {
    let informationText;

    switch(this.state.networkStatus) {
      case NETWORK_STATUS.CHECKING:
        informationText = "Checking network connectivity...";
        break;
      case NETWORK_STATUS.FU_NETWORK_NOT_LOGGED_IN:
        informationText = "Found FU Dormitory network!";
        break;
      case NETWORK_STATUS.FU_NETWORK_CONNECTING:
        informationText = "Connecting to FU Dormitory network...";
        break;
      case NETWORK_STATUS.NETWORK_PROBLEM:
        informationText = "Please check your network connection";
        break;
      case NETWORK_STATUS.INTERNET_READY:
        informationText = "Internet Ready!";
        break;
      case NETWORK_STATUS.FU_NETWORK_LOGIN_FAILED:
        informationText = "Login failed with reason: " + this.state.failReason;
        break;
    }
    return <div>
      {informationText}
    </div>
  }
}

class App extends React.Component {
  render() {
    return <div>
      <div className="header">
        <Grid >
          <Row>
            <Col md={2}><img src="http://st.f1.vnecdn.net/responsive/i/v27/graphics/img_logo_vne_web.gif" className="img-responsive"/></Col>
            <Col md={10}><img src={require('../assets/images/728x90.png')} className="pull-right"/></Col>
          </Row>
        </Grid>
      </div>

      <div className="main-content">
        <Grid>
          <Row>
            <Col md={3}><img src={require('../assets/images/160x600.png')}/></Col>
            <Col md={5}>
              <ContentCenter/>
            </Col>
            <Col md={4}><img src={require('../assets/images/300x250.png')} className="pull-right"/></Col>
          </Row>
        </Grid>
      </div>
    </div>
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);
