'use strict';
/*global $*/

function formatParamsAuth(params){
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

function generateUsernameString(responseJson){
  // fetch user 'login' and 'html_url' from first repo in responseJson object
  console.log(responseJson);
  console.log(responseJson[0].owner.login);
  console.log(responseJson[0].owner.html_url);

  $('#js-user-profile').html(`
  <h3 class="user-name">Username: ${responseJson[0].owner.login}</h3>
  <a href="${responseJson[0].owner.html_url}">View Profile</a>
  `);
}

function generateRepoString(responseJson){
  //  loop over response and generate HTML string for each repo
  const repoList = [];
  for (let i=0; i<responseJson.length; i++){
    repoList.push(`<li><a href="${responseJson[i].html_url}" target="_top">${responseJson[i].name}</a></li>`);
  }
  $('#js-list-repos').html(repoList.join(''));
}

function getUserInfo(username){

  const searchURL = `https://api.github.com/users/${username}/repos`;

  const params = {
    sort: 'stars',
    per_page: 10,
    clientID: '5b0f60b6b63c67869c29',
    clientSecret: 'd579d76bef372edac74657d1d02c38d398ff14f8'
  };
    
  const queryString = formatParamsAuth(params);
  const url = `${searchURL}?${queryString}`;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      generateUsernameString(responseJson);
      generateRepoString(responseJson);
      $('#js-result').removeClass('hidden');
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}


$(function watchSearchForm(){
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const username = $('.js-search-name').val();
    $('.js-search-name').val('');
    getUserInfo(username);
  });
});

