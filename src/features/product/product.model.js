export default class ProductModel {
  constructor(name, desc, price, imageUrl, category, size, instock, id) {
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.imageUrl = imageUrl;
    this.category = category;
    this.size = size;
    this.instock = instock;
    this._id = id;
  }
}
