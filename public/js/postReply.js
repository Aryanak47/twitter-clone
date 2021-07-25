$(document).ready( function (){  

    axios.get(`http://127.0.0.1:8000/api/posts/${postId}`)
    .then(response =>{
       const data = response.data.data
        outputReply($('.postsContainer'),data)
        
      

    }).catch(err => {
        console.log(err);
    })
   
})



