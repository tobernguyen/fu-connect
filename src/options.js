import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { Input, ButtonInput, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login_page/login_page.scss';

// $('#login-form').on('submit', (e) => {
//   e.preventDefault();
//   let username = $usernameInput.val();
//   let password = $passwordInput.val();
//   chrome.storage.sync.set({ "username": username, "password": password }, (items) => {
//     console.log('Account information saved');
//   });
// });

class OptionPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    }

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  componentDidMount() {
    chrome.storage.sync.get(["username", "password"], (items) => {
      let username = items.username;
      let password = items.password;
      this.setState({
        username: username,
        password: password
      })
    });
  }

  render() {
    return <div>
      <div className="header">
        <a href="#"><img src={require('./assets/images/logo.png')} width="200px" className="img-responsive"/></a>
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
          <ButtonInput type="submit" value="Save" />
        </form>
        <a href="login_page.html">Go to login page</a>
      </div>

      <div className="footer">
        Copyright Connect Team © 2016
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
}

ReactDOM.render(
  <OptionPage/>,
  document.getElementById('option_page')
);
