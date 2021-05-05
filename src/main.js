App = {
    contracts: {},
    load: async()=>{
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async() => {
        window.ethereum.enable().then(accounts => {
            App.account = accounts[0]
        })
    },

    loadContract: async() => {
        const todoList = await (await fetch('TodoList.json')).text()
        App.contracts.TodoList = TruffleContract(JSON.parse(todoList))
        App.contracts.TodoList.setProvider(App.web3Provider)

        App.todoList = await App.contracts.TodoList.deployed()
    },

    render: async()=>{
        if(App.loading){
            return
        }
        await App.renderTask()
    },

    renderTask: async () => {
        const taskCount = await App.todoList.taskCount()
        console.log(taskCount)
        const taskTemp = document.getElementById('tasklist')
        
        for (var i=1; i<= taskCount; i++){
            const task = await App.todoList.tasks(i)
            console.log(task);
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2] 
            var taskEl = document.createElement('li');
            taskEl.innerHTML = `<div class="task-container">
                                <input type="checkbox" id="checkbox" ${taskCompleted ? 'checked' : '!checked'}/>
                                <p id="content">${taskContent}</p>
                            </div>`
            taskTemp.appendChild(taskEl)
        }
    }
}

window.addEventListener('load', () => {
    App.load()
})