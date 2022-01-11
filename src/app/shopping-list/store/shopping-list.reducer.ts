import { Ingredient } from "../../shared/ingredient.model";

import * as ShoppingListActions from "./shopping-list.actions";

export interface AppState {
    shoppingList: State;
}

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

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
    ],
    editedIngredient: null,
    editedIngredientIndex: -1,
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT: return { ...state, ingredients: [...state.ingredients, action.payload] };
        case ShoppingListActions.ADD_INGREDIENTS: return {
            ...state, ingredients: [...state.ingredients, ...action.payload]
        };
        case ShoppingListActions.UPDATE_INGREDIENT: const ingredient = state.ingredients[action.payload.index];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload.ingredient
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[action.payload.index] = updatedIngredient;

            return {
                ...state, ingredients: updatedIngredients
            };
        case ShoppingListActions.DELETE_INGREDIENT: return {
            ...state,
            ingredients: state.ingredients.filter((ig, igIndex) => {
                return igIndex != action.payload;
            })
        };
        default: return state;
    }
}
