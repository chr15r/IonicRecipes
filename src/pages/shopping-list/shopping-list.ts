import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ShoppingListService } from "../../services/shopping-list.service";
import { Ingredient } from "../../models/ingredient";

@Component({
  selector: "page-shopping-list",
  templateUrl: "shopping-list.html"
})
export class ShoppingListPage {
  listItems: Ingredient[];

  constructor(private shoppingListService: ShoppingListService) {}

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
}
