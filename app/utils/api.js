var axios = require('axios');

var id = "YOUR_CLIENT_ID";
var sec = "YOUR_SECRET_ID";
var params = "?client_id=" + id + "&client_secret=" + sec;

function getProfile (username) {
  return axios.get('https://api.github.com/users/' + username + params)
    .then(function (user) {
      return user.data;
    });
}

function getRepos (username) {
  return axios.get('https://api.github.com/users/' + username + '/repos' + params + '&per_page=100');
}



function getStarCount (repos) {
  return repos.data.reduce(function (count, repo) {
    return count + repo.stargazers_count
  }, 0);
}

// based on followers and total stars
function calculateScore (profile, repos) {
  var followers = profile.followers;
  var totalStars = getStarCount(repos);

  // Simple rule to calculate scores
  return (followers * 3) + totalStars;
}

function handleError (error) {
  console.warn(error);
  return null;
}

function getUserData (player) {
  // this will do two calls together
  return axios.all([
    getProfile(player),
    getRepos(player)
  ]).then(function (data) {   // Until both calls finishes, it will come here
    var profile = data[0];
    var repos = data[1];

    return {
      profile: profile,
      score: calculateScore(profile, repos)
    }
  });
}

function sortPlayers (players) {
  return players.sort(function (a,b) {
    return b.score - a.score;
  });
}

module.exports = {
  // players is an array with two players' names
  battle: function (players) {
    // each of the play will go through getUserData one by one
    return axios.all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError);
  },
  fetchPopularRepos: function (language) {
    var encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:'+ language + '&sort=stars&order=desc&type=Repositories');

    return axios.get(encodedURI)
      .then(function (response) {
        return response.data.items;
      });
  },
  getRepo: function(username) {
      return axios.get('https://api.github.com/users/' + username + '/repos?per_page=5&sort=updated')
             .then(function(response) {
                 const info = response.data.map(repo => {
                     return{
                         name: repo.name,
                         url: repo.html_url
                     };
                 });
                 return info;
                 console.log(info);
             });

   },

};
