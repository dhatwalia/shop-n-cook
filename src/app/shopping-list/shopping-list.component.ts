import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[] = [
    new Ingredient('Eggplant', 3),
    new Ingredient('Garlic Cloves', 12),
    new Ingredient('Tomatoes', 6),
    new Ingredient('Onions', 3),
    new Ingredient('Cilantro', 1),
    new Ingredient('Chili Powder', 3),
    new Ingredient('Salt', 3),
    new Ingredient('Vegetable Oil', 5),
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
