$(document).ready( function (){  
    if(selected) {
        return loadReplies()
    }
    loadPosts()
})

const loadReplies = () => {
    axios.get(`http://127.0.0.1:8000/api/posts`,{params: {
        createdBy: userProfile,
        reply:true
      }})
    .then(response =>{
        const data = response.data.data
        outputPost($('.postsContainer'),data)
    }).catch(err => {
        console.log(err);
    })

}
const loadPosts = () => {
    axios.get(`http://127.0.0.1:8000/api/posts`,{params: {
        createdBy: userProfile,
        reply:false
      }})
    .then(response =>{
        const data = response.data.data
        outputPost($('.postsContainer'),data)
    }).catch(err => {
        console.log(err);
    })

}




