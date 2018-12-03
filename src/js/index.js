// Global app controller
import Search from './models/Search';
import { elements} from "./views/base";
import * as searchView from './views/searchView';

const search = new Search('pizza');
console.log(search);

/*
    - Global state of the app:
        - Search object
        - Current recipe object
        - Shopping list object
        - Liked recipes
 */
const state = {};

const controlSearch = async () => {
      // 1. Get query from the view
    const query = searchView.getInput();

    if (query) {
        // 2. Create new Search object and add it to state;
        state.search = new Search(query);

        // 3. Prepare UI for the results
        searchView.clearInput();
        searchView.clearResults();

        // 4. Search for recipes
        await state.search.getResult();

        // 5. Render results on UI.
        searchView.renderResults(state.search.result);
    }
};

elements.searchFrom.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});




