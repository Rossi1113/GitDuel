var React = require('react');
var PropTypes = require('prop-types');

function OrganizationPreview (props) {
  return (
    <div>
      <div className='column'>
        <img
          className='avatar'
          src={props.avatar}
          alt={'Avatar for ' + props.orgname}
        />
        <h2 className='orgname'>@{props.orgname}</h2>
      </div>
      {props.children}
    </div>
  )
}

OrganizationPreview.propTypes = {
  avatar: PropTypes.string.isRequired,
  orgname: PropTypes.string.isRequired,
};

module.exports = OrganizationPreview;