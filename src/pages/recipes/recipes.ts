import { Component } from "@angular/core";
import {
  NavController,
  LoadingController,
  PopoverController,
  AlertController
} from "ionic-angular";
import { EditRecipePage } from "../edit-recipe/edit-recipe";
import { Recipe } from "../../models/recipe";
import { RecipesService } from "../../services/recipes.service";
import { RecipePage } from "../recipe/recipe";
import { PopoverPage } from "../popover/popover";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "page-recipes",
  templateUrl: "recipes.html"
})
export class RecipesPage {
  constructor(
    private navCtrl: NavController,
    private recipesService: RecipesService,
    private loadingCtrl: LoadingController,
    private popOverCtrl: PopoverController,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

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

  onShowOptions(event: MouseEvent) {
    const loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    const popover = this.popOverCtrl.create(PopoverPage);
    popover.present({ ev: event }); // Show popover where mouse is placed from MouseEvent
    popover.onDidDismiss(data => {
      if (data != null && data.action == "load") {
        loading.present();
        this.authService
          .getActiveUser()
          .getIdToken()
          .then((token: string) => {
            this.recipesService.fetchList(token).subscribe(
              (list: Recipe[]) => {
                loading.dismiss();
                if (list) {
                  this.recipes = list;
                } else {
                  this.recipes = [];
                }
              },
              error => {
                loading.dismiss();
                this.handleError(error.error);
              }
            );
          });
      } else if (data != null && data.action == "store") {
        loading.present();
        this.authService
          .getActiveUser()
          .getIdToken()
          .then((token: string) => {
            this.recipesService.storeList(token).subscribe(
              () => loading.dismiss(),
              error => {
                loading.dismiss();
                this.handleError(error.error);
              }
            );
          });
      }
    });
  }

  private handleError(errorMessage: string) {
    const alert = this.alertController.create({
      title: "An error occured",
      message: errorMessage,
      buttons: ["Ok"]
    });
  }
}
