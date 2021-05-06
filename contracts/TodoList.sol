pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
    uint public taskCount = 0;

    // Creating structure of task object
    struct Task {
        uint id;
        string content;
        bool completed;
        bool deleted;
    }

    // Mapping key value pair
    // Key -> integer, Value -> Task
    mapping(uint => Task) public tasks;

    event TaskCreated(uint id, string content, bool completed, bool deleted);
    event TaskCompleted(uint id, bool completed);
    event TaskDeleted(uint id, bool deleted);

    constructor() public {
        createTask("Checkout my DApp");
    }

    // Create task
    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false, false);
        // Broadcast event that task is added
        emit TaskCreated(taskCount, _content, false, false);
    }

    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }

    function toggleDeleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.deleted = true;
        tasks[_id] = _task;
        emit TaskDeleted(_id, _task.deleted);
    }
}
