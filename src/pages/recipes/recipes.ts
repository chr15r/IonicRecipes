import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { EditRecipePage } from "../edit-recipe/edit-recipe";
import { Recipe } from "../../models/recipe";
import { RecipesService } from "../../services/recipes.service";

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

  onLoadRecipe() {

  }

}
