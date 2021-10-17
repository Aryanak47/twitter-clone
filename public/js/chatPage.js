
$(document).ready(function(){
    axios.get(`/api/chats/${chat_id}`)
    .then(({data}) =>{
        const {chat} = data
        const name = getChatName(chat)
        $("#chatName").text(name)
    }).catch(e =>{
        console.log(e.message)
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