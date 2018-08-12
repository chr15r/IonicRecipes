import { Recipe } from "../models/recipe";
import { Ingredient } from "../models/ingredient";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class RecipesService {
  private recipes: Recipe[] = [];
  private fireBaseUrl: string =
    "https://ionic2-recipebook-5e0a3.firebaseio.com/";

  constructor(private http: HttpClient, private authService: AuthService) {}

  addRecipe(
    title: string,
    description: string,
    difficulty: string,
    ingredients: Ingredient[]
  ) {
    this.recipes.push(new Recipe(title, description, difficulty, ingredients));
    console.log(this.recipes);
  }

  getRecipes() {
    return this.recipes.slice();
  }

  updateRecipe(
    index: number,
    title: string,
    description: string,
    difficulty: string,
    ingredients: Ingredient[]
  ) {
    this.recipes[index] = new Recipe(
      title,
      description,
      difficulty,
      ingredients
    );
  }

  removeRecipe(index: number) {
    this.recipes.splice(index, 1);
  }

  storeList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    const httpUrl = this.fireBaseUrl + userId + "/recipes.json?auth=" + token;
    return this.http.put(httpUrl, this.recipes);
  }

  fetchList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    const httpUrl = this.fireBaseUrl + userId + "/recipes.json?auth=" + token;
    return this.http.get<Recipe[]>(httpUrl).pipe(
      map(data => {

        const recipes: Recipe[] = data ? data : [];
        for (let item of recipes) {
          if (!item.hasOwnProperty('ingredients')) {
            item.ingredients = [];
          }
        }
        return data;
      })
    );
  }
}
