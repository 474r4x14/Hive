
import Building from "./Building";
import LifeForm from "./LifeForm";
import Task from "./Task";
import Item from "./Item";

export default class Hive {
    // Is there enough storage
    static checkStorage()
    {
        var available = 0, i;
        for (i = 0; i < Building.available.warehouse.length; i++ ) {
            var b = Building.available.warehouse[i];
            available += (b.capacity-b.used);
        }
        if (available < 10) {
            // There's not enough storage, build another warehouse
            Hive.tasks.push(new Task(Task.TYPE_BUILD, Building.TYPE_WAREHOUSE));
        }
        if (available > 0) {
            return true;
        }
        return false;
    }

    static findIdle()
    {
        var i;
        for (i = 0; i < Hive.lifeForms.length; i++) {
            if (Hive.lifeForms[i].isIdle) {
                return Hive.lifeForms[i];
            }
        }
        return null;
    }


    static issueTasks()
    {
        if (Hive.tasks.length > 0) {
            console.log('there are tasks to do');
        }
    }

    // Check if tasks have requirements
    static checkTasks()
    {

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
Hive.tasks = [];