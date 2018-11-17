// @TOOD Extract common logic between Battle.js

var React = require('react');
var PropTypes = require('prop-types');
var Link = require('react-router-dom').Link;
var OrganizationPreview = require('./OrganizationPreview');
var orgApi = require('../utils/orgApi');

// ---------------- OrganizationInput ----------------
// @TODO Extract common logic between PlayerInput.js

class OrganizationInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgname: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    var value = event.target.value;

    this.setState(function () {
      return {
        orgname: value
      }
    });
  }
  handleSubmit(event) {
    event.preventDefault();

    this.props.onSubmit(
      this.props.id,
      this.state.orgname
    );
  }
  render() {
    return (
      <form className='column' onSubmit={this.handleSubmit}>
        <label className='header' htmlFor='orgname'>{this.props.label}</label>
        <input
          id='orgname'
          placeholder='github organization name'
          type='text'
          value={this.state.orgname}
          autoComplete='off'
          onChange={this.handleChange}
        />
        <button
          className='button'
          type='submit'
          disabled={!this.state.orgname}>
            Submit
        </button>
      </form>
    )
  }
}

OrganizationInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

OrganizationInput.defaultProps = {
  label: 'Organization Name',
}

// ---------------- OrganizationInput end ----------------


// ---------------- Battle ----------------

class OrganizationBattle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgOneName: '',
      orgTwoName: '',
      orgOneImage: null,
      orgTwoImage: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(id, orgname) {
    var newState = {};
    newState[id + 'Name'] = orgname;
    // @TODO Modify the url
    // For orgs, there is no way to get the avater from orgName
    // due to the avater url contains the orgId. 
    // So we have to do an api call to get this
    // Note : here we use lambda since we need this works
    orgApi.getOrgInfo(orgname).then(orgResult => {
        newState[id + 'Image'] = orgResult["avatar_url"];
        
        this.setState(newState);
    });
  }

  handleReset(id) {
    this.setState(function () {
      var newState = {};
      newState[id + 'Name'] = '';
      newState[id + 'Image'] = null;
      return newState;
    })
  }

  render() {
    var match = this.props.match;
    var orgOneName = this.state.orgOneName;
    var orgOneImage = this.state.orgOneImage;
    var orgTwoName = this.state.orgTwoName;
    var orgTwoImage = this.state.orgTwoImage;

    return (
      <div>
        <div className='row'>
          {!orgOneName &&
            <OrganizationInput
              id='orgOne'
              label='Organization One'
              onSubmit={this.handleSubmit}
            />}

          {orgOneImage !== null &&
            <OrganizationPreview
              avatar={orgOneImage}
              orgname={orgOneName}>
                <button
                  className='reset'
                  onClick={this.handleReset.bind(this, 'orgOne')}>
                    Reset
                </button>
            </OrganizationPreview>}

          {!orgTwoName &&
            <OrganizationInput
              id='orgTwo'
              label='Organization Two'
              onSubmit={this.handleSubmit}
            />}

          {orgTwoImage !== null &&
            <OrganizationPreview
              avatar={orgTwoImage}
              orgname={orgTwoName}>
                <button
                  className='reset'
                  onClick={this.handleReset.bind(this, 'orgTwo')}>
                    Reset
                </button>
            </OrganizationPreview>}
        </div>

        {orgOneImage && orgTwoImage &&
          <Link
            className='button'
            to={{
              pathname: match.url + '/results',
              search: '?orgOneName=' + orgOneName + '&orgTwoName=' + orgTwoName
            }}>
              Battle
          </Link>}
      </div>
    )
  }
}

module.exports = OrganizationBattle;