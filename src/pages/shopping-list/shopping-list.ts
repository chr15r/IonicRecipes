import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ShoppingListService } from "../../services/shopping-list.service";

@Component({
  selector: "page-shopping-list",
  templateUrl: "shopping-list.html"
})
export class ShoppingListPage {
  constructor(private shoppingListService: ShoppingListService) {}

  onAddItem(form: NgForm) {
    console.log(form);
    this.shoppingListService.addItem(
      form.value.ingredientName,
      form.value.amount
    );
  }
}
