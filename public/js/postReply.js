$(document).ready( function (){  

    axios.get(`/api/posts/${postId}`)
    .then(response =>{
       const data = response.data.data
        outputReply($('.postsContainer'),data)
        
      

    }).catch(err => {
        console.log(err);
    })
   
})



