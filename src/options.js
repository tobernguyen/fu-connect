import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { Input, ButtonInput, Row, Col } from 'react-bootstrap';
import { Notification } from 'react-notification';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login_page/login_page.scss';

class OptionPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      autoRelogin: "",
      monitorNetwork: "",
      formSaveStatus: "",
      autoRelogin: false,
      monitorNetwork: false,
      notificationIsActive: false
    }

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleOnSave = this.handleOnSave.bind(this);
    this.handleChangeAutoRelogin = this.handleChangeAutoRelogin.bind(this);
    this.handleChangeNetworkMonitor = this.handleChangeNetworkMonitor.bind(this);
  }

  componentDidMount() {
    chrome.storage.local.get(["username", "password" , "autoRelogin", "monitorNetwork"], (items) => {
      this.setState({
        username: items.username,
        password: items.password,
        autoRelogin: items.autoRelogin,
        monitorNetwork: items.monitorNetwork
      });
    });
  }

  render() {
    return <div>
      <div className="header">
        <a href="#"><img src={require('./assets/images/logo.png')} className="img-responsive"/></a>
      </div>

      <div className="main-content center-div">
        <form>
          <Input
            type="text"
            value={this.state.username}
            label="Username"
            help="Please provide your Internet account, usually start with HNDSL-XXXXX-XXX"
            ref="username"
            onChange={this.handleChangeUsername} />

          <Input 
            type="password"
            value={this.state.password}
            label="Password"
            ref="password"
            onChange={this.handleChangePassword} />
          <Input type="checkbox" label="Monitor network & Prevent auto disconnecting (Green when have internet otherwise red on App icon)" checked={this.state.monitorNetwork} onChange={this.handleChangeNetworkMonitor} />
          <Input type="checkbox" label="Auto re-login when disconnected (Must enable monitor network)" checked={this.state.autoRelogin} onChange={this.handleChangeAutoRelogin} />
          <ButtonInput type="submit" value="Save" onClick={this.handleOnSave}/>
        </form>
        <a href="login_page.html">Go to login page</a>
        <Notification
          isActive={this.state.notificationIsActive}
          message={this.state.formSaveStatus}
        />
      </div>

      <div className="footer">
        Copyright Connect Team (c) 2016
      </div>
    </div>
  }

  handleChangeUsername() {
    this.setState({
      username: this.refs.username.getValue()
    });
  }

  handleChangePassword() {
    this.setState({
      password: this.refs.password.getValue()
    });
  }

  handleChangeAutoRelogin() {
    this.setState({
      autoRelogin: !this.state.autoRelogin
    });
  }

  handleChangeNetworkMonitor() {
    this.setState({
      monitorNetwork: !this.state.monitorNetwork
    });
  }

  handleOnSave(e) {
    e.preventDefault();
    chrome.storage.local.set({
      "username": this.state.username, 
      "password": this.state.password,
      "autoRelogin": this.state.autoRelogin,
      "monitorNetwork": this.state.monitorNetwork
    }, (items) => {
      this.setState({formSaveStatus: "Configuration saved!", notificationIsActive: true});
      setTimeout(() => this.setState({notificationIsActive: false}), 3000);
    });
  }
}

ReactDOM.render(
  <OptionPage/>,
  document.getElementById('option_page')
);
