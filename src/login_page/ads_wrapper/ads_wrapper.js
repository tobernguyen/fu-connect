import React from 'react';

export default class AdsWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false
    };
    this.handleAdsClick = this.handleAdsClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.internetUp && this.state.clicked) {
      this.setState({clicked: false});
      chrome.tabs.create({url: this.props.linkUrl});
    }
  }

	render() {
    let wrapperStyle = {cursor: 'pointer', width: this.props.width, height: this.props.height, position: 'relative', 'backgroundColor': 'white'};
    let adsOverlay;
    let imgStyle = {
      width: this.props.width,
      height: this.props.height
    }

    if(this.state.clicked && !this.props.internetUp) {
      imgStyle = Object.assign(imgStyle, {
          opacity: 0.3
      });
      adsOverlay = <div className="adsOverlay">
        <div className="loader"/>
        Waiting for Internet
      </div>;
    }

    return <div onClick={this.handleAdsClick} style={wrapperStyle}>
      <img src={this.props.imgUrl} className="img-responsive" style={imgStyle}/>
      {adsOverlay}
    </div>
  }

  handleAdsClick() {
    if (this.props.internetUp) {
      chrome.tabs.create({url: this.props.linkUrl});
    } else {
      this.setState({clicked: true});
    }
  }
}
