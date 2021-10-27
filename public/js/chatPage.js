
$(document).ready(function(){
    axios.get(`/api/chats/${chat_id}`)
    .then(({data}) =>{
        const {chat} = data
        const name = getChatName(chat)
        $("#chatName").text(name)
    })
    axios.get(`/api/chats/${chat_id}/messages`)
    .then(({data}) =>{
        let messages = []
        let lastSenderId = ""
        data.forEach((message,i) =>{
            const html = createHtml(message,lastSenderId,data[i+1])
            messages.push(html)
            lastSenderId = message.sendBy._id
        })
        addMessagesHtmlToPage(messages.join(""))
        $(".loadingSpinnerContainer").remove();
        $(".chatContainer").css("visibility", "visible");
       
       
    })
})


$("#chatNameBtn").click( async (e)=>{
    let name = $("#chatNameTextBox").val().trim();
    axios.put(`/api/chats/${chat_id}`,{
        chatName:name
    }).then( (data)=>{
       location.reload()
    }).catch(e =>alertUser("Failed to update name,please try again later."))
})
$(".textInputBox").keydown(event =>{
    if (event.keyCode === 13) {
        console.log("Enter key pressed!!!!!");
        submitMessage()
        return false;
     }
})

$("#SendMsgButton").click((event) => {
    submitMessage()

})
function submitMessage() {
    const content = $(".textInputBox").val().trim()
    if(content != ""){
        sendMessage(content)
        $(".textInputBox").val("")
    }

}
function sendMessage(message){
    axios.post("/api/messages",{
        content:message,
        chat:chat_id
    }).then(response =>{
        const message = response.data;
        addChatMessageHtml(message)
    }).catch(err=>{
        $(".textInputBox").val(message)
    })
}
function addChatMessageHtml(message){
    if(!message || !message._id ){
        alert("message is not valid")
        return;
    }
    const html = createHtml(message,"",null)
    addMessagesHtmlToPage(html)

}
function createHtml(data,lastSenderId,nextSender){
    const currentSenderId = data.sendBy._id
    const nextSenderId = nextSender != null ? nextSender.sendBy._id :""
    const isFirst = currentSenderId != lastSenderId
    const isLast = currentSenderId != nextSenderId
    const myMsg = signedUser._id == data.sendBy._id
    let className = myMsg ? "myMsg" : "otherMsg"
    let senderNameElement = ""
    let profileElement = ""
    if(isFirst){
        className +=" first"
        if(!myMsg){
            const name = data.sendBy.firstName + " " + data.sendBy.lastName
            senderNameElement = `<span class="sender">${name}</span>`
        }
    }
    if(isLast){
        className +=" last"
        if(!myMsg){
            const name = data.sendBy.firstName + " " + data.sendBy.lastName
            profileElement = `<img src=${data.sendBy.profile}>`
        }
    }
    let profileContainer = `<div class="imgContainer">${profileElement}</div>`
    const html = `<li class = "msg ${className}">
        ${profileContainer}
    <div class="msgContainer">
        ${senderNameElement}
        <span class = "msgBody">${data.content}</span>
    </div>
    </li>`
    return html;

}

function addMessagesHtmlToPage(html){
    $(".chatMessages").append(html)
}

