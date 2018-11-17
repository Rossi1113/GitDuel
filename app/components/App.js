
var React = require('react');
var ReactRouter = require('react-router-dom');
var Router = ReactRouter.BrowserRouter;
var Route = ReactRouter.Route;
var Switch = ReactRouter.Switch;
var Nav = require('./Nav');
var Home = require('./Home');
var Battle = require('./Battle');
var OrganizationBattle = require('./OrganizationBattle');
var Popular = require('./Popular');
var Results = require('./Results');
var OrganizationResults = require('./OrganizationResults');

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className='container'>
          <Nav />

          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/battle' component={Battle} />
            <Route exact path='/orgbattle' component={OrganizationBattle} />
            <Route path='/battle/results' component={Results} />
            <Route path='/orgbattle/results' component={OrganizationResults} />
            <Route path='/popular' component={Popular} />
            <Route render={function () {
              return <p>Not Found</p>
            }} />
          </Switch>
        </div>
      </Router>
    )
  }
}

module.exports = App;