let me = ""

function login(){
    const enterName = document.querySelector("#name")
    localStorage.setItem("me",enterName.value)
    me = enterName.value
    let sendName = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: me})
    sendName.then(goChat)
    sendName.catch()
}

function goChat(){
    window.location.replace("./chat.html");
}




