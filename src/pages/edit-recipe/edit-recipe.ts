import { Component, OnInit } from "@angular/core";
import {
  NavParams,
  ActionSheetController,
  AlertController,
  ToastController,
  NavController
} from "ionic-angular";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { RecipesService } from "../../services/recipes.service";
import { Recipe } from "../../models/recipe";

@Component({
  selector: "page-edit-recipe",
  templateUrl: "edit-recipe.html"
})
export class EditRecipePage implements OnInit {
  mode = "New";
  selectOptions = ["Easy", "Medium", "Hard"];
  recipeForm: FormGroup;
  recipe: Recipe;
  index: number;

  constructor(
    private navParams: NavParams,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController,
    private recipesService: RecipesService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.mode = this.navParams.get("mode");
    if (this.mode == "Edit") {
      this.recipe = this.navParams.get("recipe");
      this.index = this.navParams.get("index");
    }
    this.initializeForm();
  }

  private initializeForm() {
    let title = null;
    let decsription = null;
    let difficulty = "Medium";
    let ingredients = [];

    if (this.mode.toLowerCase() == "edit") {
      title = this.recipe.title;
      decsription = this.recipe.description;
      difficulty = this.recipe.difficulty;
      for (let ingredient of this.recipe.ingredients) {
        ingredients.push(new FormControl(ingredient.name, Validators.required));
      }
    }

    this.recipeForm = new FormGroup({
      title: new FormControl(title, Validators.required),
      description: new FormControl(decsription, Validators.required),
      difficulty: new FormControl(difficulty, Validators.required),
      ingredients: new FormArray(ingredients)
    });
  }

  onSubmit() {
    console.log("submitting");
    const value = this.recipeForm.value;
    let ingredients = [];
    if (value.ingredients.length > 0) {
      ingredients = value.ingredients.map(name => {
        return { name: name, amount: 1 };
      });
    }

    if (this.mode.toLowerCase() == "edit") {
      this.recipesService.updateRecipe(
        this.index,
        value.title,
        value.description,
        value.difficulty,
        ingredients
      );
    }
    else {
      this.recipesService.addRecipe(
        value.title,
        value.description,
        value.difficulty,
        ingredients
      );
    }
    
    this.recipeForm.reset();
    this.navController.popToRoot();
  }

  onManageIngredients() {
    const actionSheet = this.actionSheetController.create({
      title: "What do you want to do?",
      buttons: [
        {
          text: "Add Ingredient",
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: "Remove all Ingredients",
          role: "destructive",
          handler: () => {
            const fArray: FormArray = <FormArray>(
              this.recipeForm.get("ingredients")
            );
            const len = fArray.length;
            if (len > 0) {
              for (let i = len - 1; i >= 0; i--) {
                fArray.removeAt(i);
              }
              this.getToast("Items removed").present();
            }
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    actionSheet.present();
  }

  createNewIngredientAlert() {
    return this.alertController.create({
      title: "Add Ingredient",
      inputs: [
        {
          name: "name",
          placeholder: "Name"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Add",
          handler: data => {
            if (data.name.trim() == "" || data.name == null) {
              this.getToast("Please enter a valid value").present();
            } else {
              (<FormArray>this.recipeForm.get("ingredients")).push(
                new FormControl(data.name, Validators.required)
              );
              this.getToast("Item Added").present();
            }
          }
        }
      ]
    });
  }

  getToast(_message: string) {
    return this.toastController.create({
      message: _message,
      duration: 1500,
      position: "bottom"
    });
  }
}
