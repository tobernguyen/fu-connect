import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login_page.scss';
import { Grid, Row, Col } from 'react-bootstrap';

class ContentCenter extends React.Component {
  render() {
    return <div>
      <iframe src="http://www.w3schools.com"/>
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
            <Col md={10}><img src="http://lorempixel.com/728/90/food" className="pull-right"/></Col>
          </Row>
        </Grid>
      </div>

      <div className="main-content">
        <Grid>
          <Row>
            <Col md={3}><img src="http://lorempixel.com/160/600/food"/></Col>
            <Col md={5}>
              <ContentCenter/>
            </Col>
            <Col md={4}><img src="http://lorempixel.com/300/250/food" className="pull-right"/></Col>
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
