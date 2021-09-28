$(document).ready( function () {
    if(selected === "following"){
        loadFollowings();
        return;
    }
    loadFollowers();
   
})
function loadFollowers () {
    console.log(userProfile)
    axios.get(`/api/users/${userProfile}/followers`)
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
    axios.get(`/api/users/${userProfile}/followings`)
    .then(response =>{
        const data = response.data.followings
        outputUsers($('.resultsContainer'),data)
    }).catch(err => {
        console.log(err);
    })
}

