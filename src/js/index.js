// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import {elements, renderSpinner, clearSpinner} from "./views/base";
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

const state = {
    /*
    - Global state of the app:
        - Search object
        - Current recipe object
        - Shopping list object
        - Liked recipes
 */
};
window.state = state;

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

// LIST CONTROLLER
const controlList = () => {
    // Create new shopping List object based on current recipe IF in none yet
    if (!state.list) state.list = new List();

    // Fill the shoppingList object with items received from current recipe ingredients array and showing them in UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItemsList(item);
    })
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
        // Handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});

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

// Handling recipe buttonClicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn-add, recipe__btn-add *')) {
        controlList();
    }
});



























