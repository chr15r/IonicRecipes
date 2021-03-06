import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ShoppingListService } from "../../services/shopping-list.service";
import { Ingredient } from "../../models/ingredient";
import {
  PopoverController,
  LoadingController,
  AlertController
} from "ionic-angular";
import { AuthService } from "../../services/auth.service";
import { PopoverPage } from "../popover/popover";

@Component({
  selector: "page-shopping-list",
  templateUrl: "shopping-list.html"
})
export class ShoppingListPage {
  listItems: Ingredient[];

  constructor(
    private shoppingListService: ShoppingListService,
    private popOverCtrl: PopoverController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.loadItems();
  }

  onAddItem(form: NgForm) {
    this.shoppingListService.addItem(
      form.value.ingredientName,
      form.value.amount
    );
    form.reset();
    this.loadItems();
    console.log(this.listItems);
  }

  private loadItems() {
    this.listItems = this.shoppingListService.getItems();
  }

  onCheckItem(index: number) {
    this.shoppingListService.removeItem(index);
    this.loadItems();
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
            this.shoppingListService.fetchList(token).subscribe(
              (list: Ingredient[]) => {
                loading.dismiss();
                if (list) {
                  this.listItems = list;
                } else {
                  this.listItems = [];
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
            this.shoppingListService.storeList(token).subscribe(
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
