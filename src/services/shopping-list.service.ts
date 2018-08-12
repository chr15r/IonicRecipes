import { Ingredient } from "../models/ingredient";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { map } from "rxjs/operators";

@Injectable()
export class ShoppingListService {
  private ingredients: Ingredient[] = [];
  private fireBaseUrl: string = 'https://ionic2-recipebook-5e0a3.firebaseio.com/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  addItem(name: string, amount: number) {
    this.ingredients.push(new Ingredient(name, amount));
    console.log(this.ingredients);
  }

  addItems(items: Ingredient[]) {
    this.ingredients.push(...items); // "..." adds an array to an existing array
  }

  getItems() {
    return this.ingredients.slice(); // Returns copy of the array
  }

  removeItem(index: number) {
    this.ingredients.splice(index, 1);
  }

  storeList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    const httpUrl = this.fireBaseUrl + userId + "/shopping-list.json?auth=" + token;
    return this.http.put(httpUrl, this.ingredients);
  }

  fetchList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    const httpUrl = this.fireBaseUrl + userId + "/shopping-list.json?auth=" + token;
    return this.http.get<Ingredient[]>(httpUrl).pipe(
      map(data => {
        if(data) {
          this.ingredients = data;
        } else {
          this.ingredients = [];
        }        
        return data;
      })
    );
  }
}
