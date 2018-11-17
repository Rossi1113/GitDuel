var React = require('react');
var PropTypes = require('prop-types');
var queryString = require('query-string');
var orgApi = require('../utils/orgApi');
var Link = require('react-router-dom').Link;
var OrganizationPreview = require('./OrganizationPreview');
var Loading = require('./Loading');

function Profile (props) {
  var info = props.info;

  return (
    <OrganizationPreview orgname={info.login} avatar={info.avatar_url}>
      <ul className='space-list-items'>
        {info.name && <li>{info.name}</li>}
        {info.location && <li>{info.location}</li>}
        <li>Public Repos: {info.public_repos}</li>
        {info.blog && <li><a href={info.blog}>{info.blog}</a></li>}
      </ul>
    </OrganizationPreview>
  )
}

Profile.propTypes = {
  info: PropTypes.object.isRequired,
}

function Organization (props) {
  return (
    <div>
      <h1 className='header'>{props.label}</h1>
      <h3 style={{textAlign: 'center'}}>Score: {props.score}</h3>
      <Profile info={props.profile} />
    </div>
  )
}

Organization.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  profile: PropTypes.object.isRequired,
}

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true,
    }
  }

  // call this to get the result during initialization
  componentDidMount() {
    var orgs = queryString.parse(this.props.location.search);

    orgApi.battle([
      orgs.orgOneName,
      orgs.orgTwoName
    ]).then(function (orgs) {
      if (orgs === null) {
        return this.setState(function () {
          return {
            error: 'Looks like there was an error. Check that both organization exist on Github.',
            loading: false,
          }
        });
      }

      this.setState(function () {
        return {
          error: null,
          winner: orgs[0],
          loser: orgs[1],
          loading: false,
        }
      });
    }.bind(this));
  }
  render() {
    var error = this.state.error;
    var winner = this.state.winner;
    var loser = this.state.loser;
    var loading = this.state.loading;

    if (loading === true) {
      return <Loading />
    }

    if (error) {
      return (
        <div>
          <p>{error}</p>
          <Link to='/battle'>Reset</Link>
        </div>
      )
    }

    return (
      <div className='row'>
        <Organization
          label='Winner'
          score={winner.score}
          profile={winner.orgInfo}
        />
        <Organization
          label='Loser'
          score={loser.score}
          profile={loser.orgInfo}
        />
      </div>
    )
  }
}

module.exports = Results;