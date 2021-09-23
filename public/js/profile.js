$(document).ready( function (){  
    if(selected) {
        return loadReplies()
    }
    loadPosts()
})

const loadReplies = () => {
    axios.get(`/api/posts`,{params: {
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
    axios.get(`/api/posts`,{params: {
        pinned: true,
      }}).then(response =>{
        const data = response.data.data
        outputPinnedPost($('.pinnedPostContainer'),data)
    }).catch(err => {
        console.log(err);
    })

    axios.get(`/api/posts`,{params: {
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

const outputPinnedPost = (container,results) => {
    container.html("")
    let html =""
    if(results.length < 1){ 
        container.hide()
        return 
    }
    html = results.map(item => {
        return createPostHtml(item)
    })  
    html = html.join(" ")
    container.html(html)
}





