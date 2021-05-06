App = {
    contracts: {},
    load: async () => {
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

    loadAccount: async () => {
        window.ethereum.enable().then(accounts => {
            console.log(accounts);
            App.account = accounts[0]
        })
    },

    loadContract: async () => {
        const todoList = await (await fetch('TodoList.json')).text()
        App.contracts.TodoList = TruffleContract(JSON.parse(todoList))
        App.contracts.TodoList.setProvider(App.web3Provider)

        App.todoList = await App.contracts.TodoList.deployed()
    },

    addTask: async () => {
        const content = document.getElementById('inputField').value
        await App.todoList.createTask(content, { from: App.account })
        console.log(App.todoList.createTask);
        window.location.reload()
    },

    render: async () => {
        if (App.loading) {
            return
        }
        await App.renderTask()
    },

    renderTask: async () => {
        const taskCount = await App.todoList.taskCount()
        const icTasks = document.getElementById('ic-list')
        const cTasks = document.getElementById('c-list')

        for (var i = 1; i <= taskCount.words[0]; i++) {
            const task = await App.todoList.tasks(i)
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]
            const taskDeleted = task[3]
            
            console.log(taskDeleted, task)
            var ctaskEl = document.createElement('li');
            var ictaskEl = document.createElement('li');
            ctaskEl.innerHTML = `<div class="task-container">
                                <input type="checkbox" id=${taskId} ${taskCompleted ? 'checked' : '!checked'} 
                                onchange="App.markCompleted(event)"/>
                                <p id="content">${taskContent}</p>
                                <div id="dlt-con"><button id=${taskId} onclick={App.deleteTask(event)}>Delete</button></div>
                            </div>`
            ictaskEl.innerHTML = `<div class="task-container">
                            <input type="checkbox" id=${taskId} ${taskCompleted ? 'checked' : '!checked'} 
                            onchange="App.markCompleted(event)"/>
                            <p id="content">${taskContent}</p>
                        </div>`
            if (taskCompleted && !taskDeleted) {
                cTasks.appendChild(ctaskEl)
            }
            else if(!taskCompleted && !taskDeleted) {
                icTasks.appendChild(ictaskEl)
            }
        }
    },

    markCompleted: async (e) => {
        const taskId = e.target.id
        await App.todoList.toggleCompleted(taskId, { from: App.account })
        window.location.reload()
    },

    deleteTask: async(e) => {
        const taskId = e.target.id
        await App.todoList.toggleDeleted(taskId, { from: App.account })
        window.location.reload()
    }
}

window.addEventListener('load', () => {
    App.load()
})