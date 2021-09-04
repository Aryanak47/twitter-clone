$(document).ready( function () {
    if(selected === "following"){
        loadFollowings();
        return;
    }
    loadFollowers();
   
})
function loadFollowers () {
    console.log(userProfile)
    axios.get(`http://127.0.0.1:8000/api/users/${userProfile}/followers`)
    .then(response =>{
        const data =response.data.followers
        console.log(data);
        outputUsers($('.resultsContainer'),data)
    }).catch(err => {
        console.log(err);
    })
}
function loadFollowings () {
    console.log(userProfile)
    axios.get(`http://127.0.0.1:8000/api/users/${userProfile}/followings`)
    .then(response =>{
        const data = response.data.followings
        outputUsers($('.resultsContainer'),data)
    }).catch(err => {
        console.log(err);
    })
}

function outputUsers(container,data) {
    container.html("")
    if(data.length < 1){
        return container.html("<p>Nothing to show</p>")
    } 

    // <img src="${user.profile}" alt = "profile picture">
    let html = data.map(user => {
        const myProfile = user._id === signedUser._id
        const isFollowing = signedUser.following.includes(user._id)
        const text = isFollowing ? "Following" : "follow"
        const btnClass = isFollowing ? "followBtn following" : "followBtn"
        let followBtn = ` <button class=${btnClass} data-id=${user._id}>${text}</button>`
        return `<div class="user__header">
      
        <div class="user__info">  
            <div class="imgContainer">
                <img src=${user.profile}>
            </div>
            <div>
                <a href="/profile/${user.username}" class="displayName">${user.firstName} ${user.lastName}</a>
                <p class="username">@${user.username}</p>
            </div>
            ${myProfile ? "":followBtn}
        </div>
        </div>`
    })
    container.html(html)
    console.log(html)

}