import { Action } from "../services/product.service";

export class Product {
    id: string = "";
    name: string = "";
    description: string = "";
    actions!: Action[]
}