import axios from "axios";

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult() {
        const apiKey = '594b12cf1d334436786ef0368504b715';
        try {
            const result = await axios(`https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`);
            this.result = result.data.recipes;
            // console.log(this.result);
        } catch (e) {
            console.log(e);
        }
    }
}