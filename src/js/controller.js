import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC2 } from './config.js';

// console.log(SimplyIcons);

// const recipeContainer = document.querySelector('.recipe');
// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

// https://forkify-api.herokuapp.com/v2

if (module.hot) {
  module.hot.accept();
}

///////////////////////////////////////

const ControlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    // const recipeView = new recipeView(model.state.recipe);

    if (!id) return;

    resultsView.update(model.getSearchResultsPage());

    recipeView.renderSpinner();
    await model.loadRecipe(id);
    
    recipeView.render(model.state.recipe);
    bookmarkView.update(model.state.bookmarks)
  } catch (err) {
    recipeView.renderError();
  }
};
// ControlRecipe();

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
controlSearchResults();

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
  recipeView.update(model.state.recipe);
  
};

const controlBookmark = async function () {
  try {
    bookmarkView.render(model.state.bookmarks);

  } catch (err) {
    console.error('💥', err); 
  }
};

const controlAddRecipe = async function (newRecipe) {
  try {

    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderSuccess();

    bookmarkView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC2 * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  console.log(
    `%c${'Welcome to Forkify!'}`,
    'color: #ffc107; font-size: 2.1rem; padding-left: 40rem;'
  );
  setTimeout(() => {
    console.log(
      `%c${'Our App Is Initializing'}`,
      'color: grey; font-size: 1.4rem; padding-left: 41rem;'
    );
  }, 1000);
  setTimeout(() => {
    console.log(
      `%c${'Initialized Successfully'}`,
      `color: #07e207; font-size: 2.1rem; font-weight: bold; padding-left: 38rem;`
    );
  }, 2000);
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(ControlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
// window.addEventListener('hashchange', ControlRecipe);
// window.addEventListener('load', ControlRecipe);

