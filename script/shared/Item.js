export default class Item {
    constructor(type, quantity=1)
    {
        this.type = type;
        this.quantity = quantity;
        this.weight = 1;
    }
}
Item.TYPE_APPLE = 1;
Item.MATERIAL_WOOD = 2;
Item.TYPE_FOOD = 1;
Item.TYPE_MATERIAL = 2;
Item.meta = [];
Item.meta[Item.TYPE_APPLE] = {
    weight:1
};
