export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchFrom: document.querySelector('.search'),
    searchResList: document.querySelector('.results__list'),
    searchRes: document.querySelector('.results')
};

export const elementStrings = {
    spinner: 'loader'
};

export const renderSpinner = parent => {
    const spinner = `
        <div class="${elementStrings.spinner}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>`;
    parent.insertAdjacentHTML('afterbegin', spinner);
};

export const clearSpinner = () => {
    const spinner = document.querySelector(`.${elementStrings.spinner}`);
    if (spinner) {
        console.log(spinner.parentElement);
        spinner.parentElement.removeChild(spinner);
    }
};