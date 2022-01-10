import { Ingredient } from "../../shared/ingredient.model";

import * as ShoppingListActions from "./shopping-list.actions";

const initialState = {
    ingredients: [
        new Ingredient('Eggplant', 3),
        new Ingredient('Garlic Cloves', 12),
        new Ingredient('Tomatoes', 6),
        new Ingredient('Onions', 3),
        new Ingredient('Cilantro', 1),
        new Ingredient('Chili Powder', 3),
        new Ingredient('Salt', 3),
        new Ingredient('Vegetable Oil', 5),
    ]
};

export function shoppingListReducer(state = initialState, action: ShoppingListActions.AddIngredient) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT: return { ...state, ingredients: [...state.ingredients, action.payload] };
        default: return state;
    }
}
