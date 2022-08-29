let me = ""
const image = document.querySelector(".gif")
const button = document.querySelector("button")
const input = document.querySelector("input")

function login(){
    const enterName = document.querySelector("#name")
    localStorage.setItem("me",enterName.value)
    me = enterName.value
    let sendName = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: me})
    image.classList.remove("hidden")
    button.classList.add("hidden")
    input.classList.add("hidden")
    sendName.then(goChat)
    sendName.catch(goWrong)
}

function goChat(){
    window.location.replace("./assets/code/chat.html");
}

function goWrong(error){
    if (error.response.status === "400"){
        alert("Esse nome já está sendo usado, por favor, escolha outro!")
        window.location.reload()
    }else{
        alert("O sistema deu um erro, tente novamente!!")
        window.location.reload()
    }
}



