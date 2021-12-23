import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService {
    private ingredients: Ingredient[] = [
        new Ingredient('Eggplant', 3),
        new Ingredient('Garlic Cloves', 12),
        new Ingredient('Tomatoes', 6),
        new Ingredient('Onions', 3),
        new Ingredient('Cilantro', 1),
        new Ingredient('Chili Powder', 3),
        new Ingredient('Salt', 3),
        new Ingredient('Vegetable Oil', 5),
    ];
    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();

    getIngredients() {
        return this.ingredients.slice();
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
        // Spread operator(...) is used for conversting [] to list
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    updateIngedient(index: number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}