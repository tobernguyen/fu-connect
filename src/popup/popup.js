import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { Input } from 'react-bootstrap';
import './popup.scss';

class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      networkMonitor: true,
      autoRelogin: true,
      internetAccess: false
    }

    this.handleDisableNetworkMonitor = this.handleDisableNetworkMonitor.bind(this);
    this.handleDisableAutoRelogin = this.handleDisableAutoRelogin.bind(this);
    this.onStorageChanged = this.onStorageChanged.bind(this);
  }

  componentDidMount() {
    chrome.storage.local.get(["autoRelogin", "monitorNetwork", "internetAccess"], (items) => {
      this.setState({
        monitorNetwork: items.monitorNetwork,
        autoRelogin: items.autoRelogin,
        internetAccess: items.internetAccess
      });
    });

    chrome.storage.onChanged.addListener(this.onStorageChanged);
  }

  componentWillUnmount() {
    chrome.storage.onChanged.removeListener(this.onStorageChanged);
  }

  onStorageChanged(changes) {
    for (var key in changes) {
      if (key === "internetAccess") {
        this.setState({internetAccess: changes[key].newValue});
      }
    }
  }

  render() {
    let internetStatus;

    if (this.state.internetAccess) {
      internetStatus = <div className="online">
        <i className="fa fa-smile-o"/>
        <span>You are online!</span>
      </div>
    } else {
      internetStatus = <div className="offline">
        <i className="fa fa-frown-o"/>
        <span>No internet access</span>
      </div>
    }

    return <div>
      <div id="header">
        {internetStatus}
      </div>
      <div className="group actions">
        <div className="menuOption" id="connectNow" onClick={() => {chrome.tabs.create({ url: "login_page.html" })}}>
          <i className="fa fa-sign-in"/>
          <span className="optionText">Connect</span>
        </div>
      </div>

      <div className="group quickSettings">
        <div className="menuOption" id="disable-network-monitor" onClick={this.handleDisableNetworkMonitor}>
          <input type="checkbox" checked={!this.state.monitorNetwork} readOnly/>
          <span className="optionText">Disable network monitor</span>
        </div>
        <div className="menuOption" id="disable-auto-login" onClick={this.handleDisableAutoRelogin}>
          <input type="checkbox" checked={!this.state.autoRelogin} readOnly/>
          <span className="optionText">Disable auto re-connect</span>
        </div>
      </div>

      <div className="group optsSetting" onClick={() => {chrome.tabs.create({ url: "options.html" })}}>
        <div className="menuOption" id="setting">
          <i className="fa fa-wrench"/>
          <span className="optionText">Setting</span>
        </div>
      </div>
    </div>
  }

  handleDisableNetworkMonitor() {
    let monitorNetwork = !this.state.monitorNetwork;
    chrome.storage.local.set({
      "monitorNetwork": monitorNetwork
    }, (items) => {
      this.setState({
        monitorNetwork: monitorNetwork
      });
    });
  }

  handleDisableAutoRelogin() {
    let autoRelogin = !this.state.autoRelogin;
    chrome.storage.local.set({
      "autoRelogin": autoRelogin
    }, (items) => {
      this.setState({
        autoRelogin: autoRelogin
      });
    });
  }
}

ReactDOM.render(
  <Popup/>,
  document.getElementById('app')
);
