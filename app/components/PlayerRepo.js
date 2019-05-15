var React = require('react');
var PropTypes = require('prop-types');

function PlayerPreview (props) {
  return (
    <div>
      {props.children}
    </div>
  )
}


//PlayerPreview.propTypes = {
  name : PropTypes.string.isRequired,
};



module.exports = PlayerRepo;
