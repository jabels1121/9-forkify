import axios from "axios";
import {apiKey} from "../config";

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult() {
        try {
            const result = await axios(`https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`);
            this.result = result.data.recipes;
            console.log(result);
        } catch (e) {
            console.log(e);
        }
    }
}