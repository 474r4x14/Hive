
import Building from "./Building";
import LifeForm from "./LifeForm";

export default class Hive {
    // Is there enough storage
    static checkStorage()
    {
        var available = 0, i;
        for (i = 0; i < Building.available.warehouse.length; i++ ) {
            var b = Building.available.warehouse[i];
            available = b.capacity-b.used;
        }
        if (available < 10) {
            // There's not enough storage, build another warehouse
        }
    }

    static findIdle()
    {
        var i;
        for (i = 0; i < Hive.lifeForms.length; i++) {
            if (Hive.lifeForms[i].action === LifeForm.ACTION_IDLE) {
                return Hive.lifeForms[i];
            }
        }
        return null;
    }

    static action(action, type = null)
    {
        console.log();
    }

    static notify()
    {

    }

    // Upgrade an object with swarm functionality
    static upgrade(object)
    {
        console.log('doing hive upgrade');
        if (object instanceof LifeForm) {
            LifeForm.swarmify(object);
        }
    }
}
Hive.lifeForms = [];
Hive.known = {items:[]};
