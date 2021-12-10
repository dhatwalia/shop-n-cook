import { EventEmitter } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";

export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe('Baingan Bharta', 'Baingan Bharta is a perfect local vegan dish. It originated in India but is also famous in Pakistan and Bangladesh. Baingan Bharta could be made at any time of the day but is generally preferred for Lunch and Dinner as a main course. It serves best with Roti (Flatbread). The history of this very old recipe is less known. The key ingredients used to make Baingan Bharta are: Eggplant, Garlic, Tomato, and Onion. The dish was named Baingan Bharta because Baingan means Eggplant and Bharta means mashed. Overall, the dish is made up of smoked and mashed eggplant.', 'http://dishesfromhome.uwaytbay.ca/images/recipes/baingan_bharta/final_dish.jpg', [
            new Ingredient('Eggplant', 3),
            new Ingredient('Garlic Cloves', 12),
            new Ingredient('Tomatoes', 6),
            new Ingredient('Onions', 3),
            new Ingredient('Cilantro', 1),
            new Ingredient('Chili Powder', 1),
            new Ingredient('Salt', 1),
            new Ingredient('Vegetable Oil', 1),
        ]),
        new Recipe('Sauteed Potato, Eggplant, and Pepper', 'Going to China a country that undoubtedly has diverse gastronomy. For this case, we bring you a vegetarian dish but without a doubt delicious and full of flavour! Sauteed Potato, eggplant, and pepper is a dish based on potato, eggplant, pepper, and lots of flavours. We are sure that you will love it for its excellent flavour. Dare to try something new and delicious.', 'http://dishesfromhome.uwaytbay.ca/images/recipes/sauteed_potato_eggplant_and_pepper/final_dish.jpg', [
            new Ingredient('Potatoes', 2),
            new Ingredient('Eggplant', 2),
            new Ingredient('Peppers', 2),
            new Ingredient('Garlic Cloves', 1),
            new Ingredient('Vegetable Oil', 1),
            new Ingredient('Soy sauce', 1),
            new Ingredient('Superior dark soy sauce', 1),
            new Ingredient('Oyster flavoured source', 1),
            new Ingredient('Salt', 1),
            new Ingredient('Sugar', 1),
            new Ingredient('Chicken essence', 1),
            new Ingredient('Corn starch', 1)
        ]),
        new Recipe('Shanghai Mixed Rice', 'From southeast China-Shanghai and its surrounding areas we have Shanghai Mixed Rice a homey dish but full of culture and flavour. This dish is based on a delicious combination of rice, vegetables and sausage that we are sure you will love, and the best part is that it is a simple and quick recipe to prepare. This dish comes from a time of scarcity in China and it is for this reason that this dish has a meaning of union and it is customary to eat it at home and usually with the family. If you are not from China, we invite you to try it and bring a little of this family tradition to your kitchen and if you are a Chinese citizen outside of your country, we have this perfect recipe to help you if you feel homesick.', 'http://dishesfromhome.uwaytbay.ca/images/recipes/shanghai_mixed_rice/final_dish.jpg', [
            new Ingredient('White Rice', 1),
            new Ingredient('Smoked sausage', 1),
            new Ingredient('Mushrooms', 1),
            new Ingredient('Carrot', 1),
            new Ingredient('Shanghai Bok choy', 1),
            new Ingredient('Snow Peas', 1),
        ]),
    ];

    getRecipes() {
        return this.recipes.slice();
    }
}