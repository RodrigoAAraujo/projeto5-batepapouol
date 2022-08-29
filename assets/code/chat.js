const messagesBlock = document.querySelector("main ul")
const participantsBlock = document.querySelector("aside .person")
const sideBar = document.querySelector("aside")
const fogger = document.querySelector(".fogger")
const textInsert = document.querySelector("footer input")
const textTowho = document.querySelector("footer h5")
const button = document.querySelector("footer button")
let counter = 0


let me = localStorage.getItem("me");

/*------Get Info----- */

function getMessages(){
    const receive = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    receive.then(renderMessages)
    receive.catch(errorMessages)
}
function renderMessages(response){
    let info = response.data
    messagesBlock.innerHTML = ""
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
        else if (element.type =="private_message" && (element.to == me || element.from == me)){
            messagesBlock.innerHTML += `
            <li class="${element.type}">
                <h2><em>(${element.time})</em><span><strong>${element.from}</strong> reservadamente para <strong>${element.to}</strong>:</span>${element.text}</h2>
            </li>
            `
        }
    });
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
    if(counter === 0){
        participantsBlock.innerHTML = `
            <li class="selected" onclick="selectPerson(this)">
                <div>
                    <ion-icon name="people"></ion-icon>
                    <p>Todos</p>
                </div>
                <ion-icon name="checkmark"></ion-icon>
            </li>
            `
        let info  = response.data
        info.forEach((element) => {
            participantsBlock.innerHTML += `
                <li data-identifier="participant" onclick="selectPerson(this)" >
                    <div>
                        <ion-icon name="person-circle-outline"></ion-icon>
                        <p>${element.name}</p>
                    </div>
                    <ion-icon name="checkmark"></ion-icon>
                </li>`
        })
    }

    if(counter > 0 ){
        let person = document.querySelector("aside .person .selected p")

        if (person === null || person.innerHTML == "Todos"){
        participantsBlock.innerHTML = `
        <li class="selected" onclick="selectPerson(this)">
            <div>
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
            </div>
            <ion-icon name="checkmark"></ion-icon>
        </li>
        `
        let info  = response.data
        info.forEach((element) => {
            participantsBlock.innerHTML += `
            <li data-identifier="participant" onclick="selectPerson(this)" >
                <div>
                    <ion-icon name="person-circle-outline"></ion-icon>
                    <p>${element.name}</p>
                </div>
                <ion-icon name="checkmark"></ion-icon>
            </li>`

        })}else {
            participantsBlock.innerHTML = `
            <li onclick="selectPerson(this)">
                <div>
                    <ion-icon name="people"></ion-icon>
                    <p>Todos</p>
                </div>
                <ion-icon name="checkmark"></ion-icon>
            </li>
            `
            let info  = response.data
            info.forEach((element) => {
            if (person.innerHTML === element.name){
            participantsBlock.innerHTML += `
            <li data-identifier="participant" class="selected" onclick="selectPerson(this)" >
                <div>
                    <ion-icon name="person-circle-outline"></ion-icon>
                    <p>${element.name}</p>
                </div>
                <ion-icon name="checkmark"></ion-icon>
            </li>`
            }else{
                participantsBlock.innerHTML += `
                <li data-identifier="participant" onclick="selectPerson(this)" >
                    <div>
                        <ion-icon name="person-circle-outline"></ion-icon>
                        <p>${element.name}</p>
                    </div>
                    <ion-icon name="checkmark"></ion-icon>
                </li>`
            }})
        }
    }

    counter = 1
    sendToWho()
}
function errorParticipants(error){
}

/*----Keep On--- */

function login(){
    let sendName = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: me})
    sendName.then(ok)
    sendName.catch(errorLogin)
}
function ok(response){
}
function errorLogin(error){
    alert("O serviço deu problema:" + error.response.status)
    window.location.replace("../../index.html")
}

function keepOn(){
    setInterval(login, 4000)
    setInterval(getMessages, 3000)
    setInterval(getParticipants, 10000)

}

/*----Front End Funcionalities---- */

function renderHeader(){
    const name = document.querySelector("header div h4")
    name.innerHTML = me
}
function showSidebar(){
    sideBar.classList.remove("noSee")
    setTimeout(animationShow, 10)
    fogger.classList.remove("hidden")
}
function animationShow(){
    sideBar.classList.add("aside-on")
}
function hideSidebar(){
    sideBar.classList.remove("aside-on")
    setTimeout(animationHide,600)
    fogger.classList.add("hidden")
}
function animationHide(){
    sideBar.classList.add("noSee")
}
function scroll(){
    let lastMessage = document.querySelector("main ul :nth-last-child(3)")
    lastMessage.scrollIntoView()
}
function selectPerson(person){
    const selectedPerson = document.querySelector(".person .selected");
    selectedPerson.classList.remove("selected")
    person.classList.add("selected");
    sendToWho()
}
function selectStyle(style){
    const selectedStyle = document.querySelector(".style .selected");
    selectedStyle.classList.remove("selected")
    style.classList.add("selected");
    sendToWho()
}
function sendToWho(){
    let styleSelectedInMoment = document.querySelector("aside .style .selected p")
    let PersonSelected = document.querySelector("aside .person .selected p")

    textTowho.innerHTML = `
        Enviando para ${PersonSelected.innerHTML} (${styleSelectedInMoment.innerHTML})
    `
}

/*Send Messages */

document.addEventListener("keypress", function(e){
    if(e.key=== "Enter"){
        button.click()
    }
})

function sendMessage(){
    if(textInsert.value !== ""){
        let styleSelectedInMoment = document.querySelector("aside .style .selected p")
        let PersonSelected = participantsBlock.querySelector(".selected p")
        let style = ""
        if(styleSelectedInMoment.innerHTML === "Público"){
            style = "message"
        }else if((styleSelectedInMoment.innerHTML === "Reservadamente")){
            style = "private_message"
        }
        let message = {
            from : me,
            to: PersonSelected.innerHTML,
            text : textInsert.value,
            type : style
        }
        let messageSent = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", message)
        textInsert.value = ""
        messageSent.then(MessageSuccess)
        messageSent.catch(MessageUnsuccessfull)
    }
}
function MessageSuccess(response){
}
function MessageUnsuccessfull(error){
    alert("A mensagem não foi enviada, tente novamante!!")
}



getMessages()
getParticipants()
renderHeader()
keepOn()
