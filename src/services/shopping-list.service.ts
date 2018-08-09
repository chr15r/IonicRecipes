import { Ingredient } from "../models/ingredient";

export class ShoppingListService {
    private ingredients: Ingredient[] = [];

    addItem(name: string, amount: number) {
        this.ingredients.push(new Ingredient(name, amount));
        console.log(this.ingredients);
    }

    addItems(items: Ingredient[]) {
        this.ingredients.push(...items); // "..." adds an array to an existing array
    }

    getItems() {
        return this.ingredients.slice(); // Returns copy of the array
    }

    removeItem(index: number) {
        this.ingredients.splice(index,1);
    }
}