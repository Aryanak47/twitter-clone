'use-strict'

$(document).ready(function(){
   axios.get("/api/chats")
   .then(res => {
      const chats = res.data.chats
      outputChat(chats,$(".resultsContainer"))

   }).catch(err => {
       
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
   let html = `<a href="/message/${chat._id}" class="resultContainerList">
      ${images}
      <div class="resultDetail elipsis">
         <span class="heading elipsis">${chatName}</span>
         <span class="subText elipsis">hello my friend how r u</span>
      </div>
   
   </a>`
   return html;
}

function getChatName(chat) {
   let chatName = chat.chatName;
   if(!chatName) {
      const users = getUsers(chat.users).map(user => user.firstName)
      chatName = users.join(", ")
     
   }
   return chatName;
}
function getChatImage(chat) {
   let  users =  getUsers(chat.users)
   let groupChatClass = ""
   let chatImage = `<img src=${users[0].profile} alt="chat profile">`
   if(users.length > 1){
      chatImage+=`<img src=${users[1].profile} alt="chat profile">`
      groupChatClass = "groupChat"
   }
   return `<div class="resultContainerProfile ${groupChatClass}">${chatImage}</div>`
}

function getUsers(user) {
   if(user.length == 1) {
      return user
   }
   const users = user.filter(user => user._id != signedUser._id)
   return users
}