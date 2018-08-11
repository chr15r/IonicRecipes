import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { EditRecipePage } from "../edit-recipe/edit-recipe";
import { Recipe } from "../../models/recipe";
import { RecipesService } from "../../services/recipes.service";
import { RecipePage } from "../recipe/recipe";

@Component({
  selector: "page-recipes",
  templateUrl: "recipes.html"
})
export class RecipesPage {
  constructor(private navCtrl: NavController, private recipesService: RecipesService) {}

  recipes: Recipe[];

  ionViewWillEnter() {
    this.recipes = this.recipesService.getRecipes();
  }

  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, { mode: "New" });
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, { recipe: recipe, index: index });
  }

}
