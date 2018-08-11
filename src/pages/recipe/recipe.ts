import { Component, OnInit } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { Recipe } from "../../models/recipe";
import { EditRecipePage } from "../edit-recipe/edit-recipe";
import { ShoppingListService } from "../../services/shopping-list.service";
import { RecipesService } from "../../services/recipes.service";

@Component({
  selector: "page-recipe",
  templateUrl: "recipe.html"
})
export class RecipePage implements OnInit {
  recipe: Recipe;
  index: number;

  constructor(
    private NavCtrl: NavController,
    private navParams: NavParams,
    private slService: ShoppingListService,
    private recipesService: RecipesService
  ) {}

  ngOnInit() {
    this.recipe = this.navParams.get("recipe");
    this.index = this.navParams.get("index");
  }

  onAddIngredients() {
    this.slService.addItems(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.NavCtrl.push(EditRecipePage, {
      mode: "Edit",
      recipe: this.recipe,
      index: this.index
    });
  }

  onDeleteRecipe() {
    this.recipesService.removeRecipe(this.index);
    this.NavCtrl.popToRoot();
  }
}
