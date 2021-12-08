import { EventEmitter } from "@angular/core";
import { Recipe } from "./recipe.model";

export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe('Baingan Bharta', 'Baingan Bharta is a perfect local vegan dish. It originated in India but is also famous in Pakistan and Bangladesh. Baingan Bharta could be made at any time of the day but is generally preferred for Lunch and Dinner as a main course. It serves best with Roti (Flatbread). The history of this very old recipe is less known. The key ingredients used to make Baingan Bharta are: Eggplant, Garlic, Tomato, and Onion. The dish was named Baingan Bharta because Baingan means Eggplant and Bharta means mashed. Overall, the dish is made up of smoked and mashed eggplant.', 'http://dishesfromhome.uwaytbay.ca/images/recipes/baingan_bharta/final_dish.jpg'),
    ];

    getRecipes() {
        return this.recipes.slice();
    }
}