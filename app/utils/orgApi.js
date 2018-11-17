var axios = require('axios');

var id = "YOUR_CLIENT_ID";
var sec = "YOUR_SECRET_ID";
var params = "?client_id=" + id + "&client_secret=" + sec;

function getOrgInfo(orgName) {
  return axios.get('https://api.github.com/orgs/' + orgName + params)
    .then(function (org) {
      debugger;
      return org.data;
    });
}

function getRepos(orgName) {
  return axios.get('https://api.github.com/orgs/' + orgName + '/repos')
    .then(function (org) {
      debugger;
      return org.data;
    });
}

function getMembers(orgName) {
  return axios.get('https://api.github.com/orgs/' + orgName + '/members' + params)
    .then(function (org) {
      debugger;
      return org.data;
    });
}

// function getProfile (username) {
//   return axios.get('https://api.github.com/users/' + username + params)
//     .then(function (user) {
//       return user.data;
//     });
// }

// function getRepos (username) {
//   return axios.get('https://api.github.com/users/' + username + '/repos' + params + '&per_page=100');
// }

// function getStarCount (repos) {
//   return repos.data.reduce(function (count, repo) {
//     return count + repo.stargazers_count
//   }, 0);
// }

// based on repos and members
function calculateScore (orgInfo, repos, members) {
  // var followers = profile.followers;
  // var totalStars = getStarCount(repos);

  debugger;
  return parseInt(orgInfo["public_repos"], 10) + (repos.length * 3) + members.length;
}

function handleError (error) {
  console.warn(error);
  return null;
}

function getOrgData (orgName) {
  // this will do two calls together
  return axios.all([
    getOrgInfo(orgName),
    getRepos(orgName),
    getMembers(orgName)
  ]).then(function (data) {   // Until all calls finishes, it will come here
    var orgInfo = data[0];
    var repos = data[1];
    var members = data[2];

    return {
      orgInfo: orgInfo,
      score: calculateScore(orgInfo, repos, members)
    }
  });
}

function sortOrgs (orgs) {
  return orgs.sort(function (a,b) {
    return b.score - a.score;
  });
}

module.exports = {
  // get org info
  getOrgInfo: function(orgName) {
    return getOrgInfo(orgName);
  },

  // orgs is an array with two orgs' names
  battle: function (orgs) {
    // each of the org will go through getOrgData one by one
    return axios.all(orgs.map(getOrgData))
      .then(sortOrgs)
      .catch(handleError);
  }
};