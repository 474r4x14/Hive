export default class Item {
    constructor(type, quantity=1)
    {
        this.type = type;
        this.quantity = quantity;
        this.weight = 1;
    }
}
Item.TYPE_APPLE = 1;
Item.meta = [];
Item.meta[Item.TYPE_APPLE] = {
    weight:1
};