$(document).ready( function (){  
    axios.get('/api/posts')
    .then(response =>{
        const r =  response['data']
        if(r.status === 'success'){
            const posts = r.data.reverse()
            outputPost($(".postsContainer"),posts)

        }

    }).catch(err => {
        console.log(err);
    })
   
})


