'use-strict'

$(document).ready(function(){
   axios.get("/api/chats")
   .then(res => {
      const chats = res.data.chats
      outputChat(chats,$(".resultsContainer"))
   })
})

function outputChat (chats,container){
  
   container.html("")
   if(chats.length < 1){
      container.append("<span>Nothing to show</span>")
      return;
   }
   chats.forEach((chat) => {
      const content = createChatHtml(chat);
      container.append(content)
   })
}

function createChatHtml(chat){
   let images = getChatImage(chat)
   let chatName = getChatName(chat)
   let lastMessage = getLastMessage(chat.lastMessage)
  
   let html = `<a href="/message/${chat._id}" class="resultContainerList">
      ${images}
      <div class="resultDetail elipsis">
         <span class="heading elipsis">${chatName}</span>
         <span class="subText elipsis">${lastMessage}</span>
      </div>
   
   </a>`
   return html;
}
function getLastMessage(lastMessage) {
   if(lastMessage != null) {
      return `${lastMessage.sendBy.firstName} ${lastMessage.sendBy.lastName} : ${lastMessage.content}`
   }
   return 'new chat';
}

function getChatImage(chat) {
   let  users =  getChatUsers(chat.users)
   let groupChatClass = ""
   let chatImage = `<img src=${users[0].profile} alt="chat profile">`
   if(users.length > 1){
      chatImage+=`<img src=${users[1].profile} alt="chat profile">`
      groupChatClass = "groupChat"
   }
   return `<div class="resultContainerProfile ${groupChatClass}">${chatImage}</div>`
}

