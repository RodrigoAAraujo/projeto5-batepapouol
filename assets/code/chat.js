const messagesBlock = document.querySelector("main ul")
const participantsBlock = document.querySelector("aside ul")
const sideBar = document.querySelector("aside")
let me = localStorage.getItem("me");


function getMessages(){
    const receive = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    receive.then(renderMessages)
    receive.catch(errorMessages)
}
function renderMessages(response){
    let info = response.data
    info.forEach(element => {
        if (element.type == "message"){
            messagesBlock.innerHTML += `
            <li class="${element.type}">
                <h2><em>(${element.time})</em><span><strong>${element.from}</strong> para <strong>${element.to}</strong>:</span>${element.text}</h2>
            </li>
            `
        }else if (element.type == "status"){
            messagesBlock.innerHTML += `
            <li class="${element.type}">
                <h2><em>(${element.time})</em><span><strong>${element.from}</strong></span>${element.text}</h2>
            </li>
            `
        }
        else if (element.type =="private_message" && element.to == me){
            messagesBlock.innerHTML += `
            <li class="${element.type}">
                <h2><em>(${element.time})</em><span><strong>${element.from}</strong> reservadamente para <strong>${element.to}</strong>:</span>${element.text}</h2>
            </li>
            `
        }
    });
    console.log(document.querySelector("main ul"))
    scroll()
}
function errorMessages(error){

}


function getParticipants(){
    const receive = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    receive.then(renderParticipants)
    receive.catch(errorParticipants)
}
function renderParticipants(response){
    participantsBlock.innerHTML = `
        <li>
            <ion-icon name="people"></ion-icon>
            <p>Todos</p>
        </li>
    `
    let info  = response.data
    console.log(info)
    info.forEach((element) => {
        participantsBlock.innerHTML += `
        <li>
            <ion-icon name="person-circle-outline"></ion-icon>
            <p>${element.name}</p>
        </li>`
    })
}
function errorParticipants(error){

}

function login(){
    let sendName = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: me})
    sendName.then(ok)
    sendName.catch(errorLogin)
}
function ok(response){
    console.log("ok")
}
function errorLogin(error){

}

function renderHeader(){
    const name = document.querySelector("header div h4")
    name.innerHTML = me
}
function showSidebar(){
    sideBar.classList.remove("hidden")
    sideBar.classList.add("aside-on")
}
function hideSidebar(){
    sideBar.classList.remove("aside-on")
    sideBar.classList.add("hidden")
}
function scroll(){
    let lastMessage = document.querySelector("main ul :nth-last-child(4)")
    console.log(lastMessage)
    lastMessage.scrollIntoView()
}


function keepOn(){
    setInterval(login, 4500)
    setInterval(getMessages, 3000)
    setInterval(getParticipants, 10000)
}


renderHeader()
getMessages()
getParticipants()
keepOn()
