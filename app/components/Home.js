var React = require('react');
var Link = require('react-router-dom').Link;
var Popular = require('./Popular');
// import logo from '../images/battle_logo.jpg';

class Home extends React.Component {
  render() {
    return (
      <div className='home-container'>
          <div className='home-battle-container'>
            <div className="title">
                <h1>Github Duel</h1>
                <img src={require('../images/battle_logo.png')} className="logo"/>
            </div>
            <h3>Battle your friends or other organization.</h3>
            <Link className='button' to='/battle'>Single Battle</Link>
            <Link className='button' to='/orgbattle'>Team Battle</Link>
          </div>
          <div className="trend">
            <div className="trend-title">
                <h2>Check what's hot on Github</h2>
                <img src={require('../images/hot.png')} className="smallLogo"/>
            </div>
            <Popular />
          </div>
      </div>
    )
  }
}

module.exports = Home;