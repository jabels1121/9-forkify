// Global app controller
import Search from './models/Search';
import {elements, renderSpinner, clearSpinner} from "./views/base";
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Recipe from './models/Recipe';

/*
    - Global state of the app:
        - Search object
        - Current recipe object
        - Shopping list object
        - Liked recipes
 */
const state = {};

// SEARCH CONTROLLER
const controlSearch = async () => {
    // 1. Get query from the view
    const query = searchView.getInput();

    if (query) {
        // 2. Create new Search object and add it to state;
        state.search = new Search(query);

        // 3. Prepare UI for the results
        searchView.clearInput();
        searchView.clearResults();

        // 3.1 render spinner while fetching data form remote api
        renderSpinner(elements.searchRes);

        try {
            // 4. Search for recipes
            await state.search.getResult();

            // 5. Remove spinner from UI
            clearSpinner();
            // 5.1 Render results on UI.
            searchView.renderResults(state.search.result);
        } catch (e) {
            alert('Something wrong with the search...');
        }
    }
};

// RECIPE CONTROLLER
const controlRecipe = async () => {
    // 1 Get unique recipe ID from the URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // 2. Create Recipe object and add it to state
        state.recipe = new Recipe(id);

        // 3.0 Highlight selected search
        if (state.search) {
            searchView.highLightSelected(id);
        }

        // 3. Prepare UI for the showing single recipe (showing spinner while data is fetching)
        recipeView.clearRecipe();
        renderSpinner(elements.recipe);
        try {
            // 4. Get single recipe from public api and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // 4.1 Calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();

            // 5. Remove spinner and show single recipe
            clearSpinner();
            recipeView.renderRecipe(state.recipe);
        } catch (e) {
            console.log(e);
            alert('Error processing recipe.');
        }
    }
};

elements.searchFrom.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// Add eventListener to pagination buttons of result list using Event delegation technique
elements.pagePagination.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));