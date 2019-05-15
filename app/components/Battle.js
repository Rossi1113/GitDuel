var React = require('react');
var PropTypes = require('prop-types');
var Link = require('react-router-dom').Link;
var PlayerPreview = require('./PlayerPreview');
var api = require('../utils/api');

// ---------------- PlayerInput ----------------

class PlayerInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    var value = event.target.value;

    this.setState(function () {
      return {
        username: value
      }
    });
  }
  handleSubmit(event) {
    event.preventDefault();

    this.props.onSubmit(
      this.props.id,
      this.state.username
    );
  }
  render() {
    return (
      <form className='column' onSubmit={this.handleSubmit}>
        <label className='header' htmlFor='username'>{this.props.label}</label>
        <input
          id='username'
          placeholder='github username'
          type='text'
          value={this.state.username}
          autoComplete='off'
          onChange={this.handleChange}
        />
        <button
          className='button'
          type='submit'
          disabled={!this.state.username}>
            Submit
        </button>
      </form>
    )
  }
}

PlayerInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

PlayerInput.defaultProps = {
  label: 'Username',
}

// ---------------- PlayerInput end ----------------



// ---------------- Battle ----------------

class Battle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerOneName: '',
      playerTwoName: '',
      playerOneImage: null,
      playerTwoImage: null,
      playerOneRepo: null,
      playerTwoRepo: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(id, username) {
    api.getRepo(username)
    .then(function(repo){
        this.setState(function(){
            var newState = {};
            newState[id + 'Name'] = username;
            newState[id + 'Image'] = 'https://github.com/' + username + '.png?size=200'
            newState[id + 'Repo'] = repo
            return newState;
        });
    }.bind(this));
  }
  handleReset(id) {
    this.setState(function () {
      var newState = {};
      newState[id + 'Name'] = '';
      newState[id + 'Image'] = null;
      newState[id + 'Repo'] = null;
      return newState;
    })
  }
  render() {
    var match = this.props.match;
    var playerOneName = this.state.playerOneName;
    var playerOneImage = this.state.playerOneImage;
    var playerTwoName = this.state.playerTwoName;
    var playerTwoImage = this.state.playerTwoImage;
    var playerOneRepo = this.state.playerOneRepo;
    var playerTwoRepo = this.state.playerTwoRepo;

    return (
      <div>
        <div className='row'>
          {!playerOneName &&
            <PlayerInput
              id='playerOne'
              label='Player One'
              onSubmit={this.handleSubmit}
            />}

          {playerOneImage !== null &&
            <PlayerPreview
              avatar={playerOneImage}
              username={playerOneName}>
              <p>Recent 5 repositories:</p>
              <ul className='list-repo'>
                {playerOneRepo.map(function(repo, index){
                    return (
                        <li key={repo.name} className='recent-repo'>
                        <a href={repo.url} target="_blank">{repo.name}</a>
                        </li>
                    )
                })}
              </ul>

                <button
                  className='reset'
                  onClick={this.handleReset.bind(this, 'playerOne')}>
                    Reset
                </button>
            </PlayerPreview>}

          {!playerTwoName &&
            <PlayerInput
              id='playerTwo'
              label='Player Two'
              onSubmit={this.handleSubmit}
            />}

          {playerTwoImage !== null &&
            <PlayerPreview
              avatar={playerTwoImage}
              username={playerTwoName}>
              <p>Recent 5 repositories:</p>
              <ul className='list-repo'>
                {playerTwoRepo.map(function(repo, index){
                    return (
                        <li key={repo.name} className='recent-repo'>
                          <ul className='list-items'>
                            <li><a href={repo.url}>{repo.name}</a></li>
                          </ul>
                        </li>
                    )
                })}
              </ul>
                <button
                  className='reset'
                  onClick={this.handleReset.bind(this, 'playerTwo')}>
                    Reset
                </button>
            </PlayerPreview>}
        </div>

        {playerOneImage && playerTwoImage &&
          <Link
            className='button'
            to={{
              pathname: match.url + '/results',
              search: '?playerOneName=' + playerOneName + '&playerTwoName=' + playerTwoName
            }}>
              Battle
          </Link>}
      </div>
    )
  }
}

module.exports = Battle;
