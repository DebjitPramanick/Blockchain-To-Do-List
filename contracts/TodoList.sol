pragma solidity >=0.4.22 <0.9.0;

contract TodoList{
    uint public taskCount = 0;


    // Creating structure of task object
    struct Task{
        uint id;
        string content;
        bool completed;
    }

    // Mapping key value pair
    // Key -> integer, Value -> Task
    mapping(uint => Task) public tasks;

    constructor() public {
        createTask("Checkout my DApp");
    }

    // Create task
    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
    }
}