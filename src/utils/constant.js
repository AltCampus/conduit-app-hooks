const Root_url = 'https://mighty-oasis-08080.herokuapp.com/api/';

const articlesURL = Root_url + 'articles';
const singleArticleURL = Root_url + 'articles/';
const tagsURL = Root_url + 'tags';
const feedURL = articlesURL + '/feed';
const loginURL = Root_url + 'users/login';
const signUpURL = Root_url + 'users';
const localStorageKey = 'app_user';
const userVerifyURL = Root_url + 'user';
const getProfile = Root_url + '/profiles/';

export {
  Root_url,
  articlesURL,
  tagsURL,
  singleArticleURL,
  feedURL,
  localStorageKey,
  loginURL,
  signUpURL,
  userVerifyURL,
  getProfile,
};
