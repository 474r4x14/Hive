export default class Task {
    constructor(type,subType, repetitions = 1, worker = null)
    {
        this.type = type;
        this.subType = subType;
        this.workers = [];
        this.repetitions = repetitions;
        if (worker !== null) {
            this.addWorker(worker);
        }
    }

    // Adds an additional
    addWorker(worker)
    {
        this.workers.push(worker);
    }
}
Task.TYPE_GATHER = 1;
Task.TYPE_BUILD = 2;
