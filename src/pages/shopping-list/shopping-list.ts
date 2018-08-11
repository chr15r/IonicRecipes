import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ShoppingListService } from "../../services/shopping-list.service";
import { Ingredient } from "../../models/ingredient";
import { PopoverController } from "ionic-angular";
import { SLOptionsPage } from "./sl-options/sl-options";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "page-shopping-list",
  templateUrl: "shopping-list.html"
})
export class ShoppingListPage {
  listItems: Ingredient[];

  constructor(
    private shoppingListService: ShoppingListService,
    private popOverCtrl: PopoverController,
    private authService: AuthService
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
    const popover = this.popOverCtrl.create(SLOptionsPage);
    popover.present({ ev: event }); // Show popover where mouse is placed from MouseEvent
    popover.onDidDismiss(data => {
      if (data.action == "load") {
        this.authService.getActiveUser().getIdToken()
        .then(
          (token: string) => {
            this.shoppingListService.fetchList(token).subscribe(
              (list: any) => {
                  if (list) {
                    this.listItems = list;
                  } else {
                    this.listItems = [];
                  }
              },
              error => console.log(error)
            );
          }
        )
      } else {
        this.authService.getActiveUser().getIdToken()
        .then(
          (token: string) => {
            this.shoppingListService.storeList(token).subscribe(
              () => console.log('Success'),
              error => console.log(error)
            );
          }
        )
      }
    });
  }
}
