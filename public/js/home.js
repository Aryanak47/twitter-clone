$(document).ready( function (){  
    axios.get('http://127.0.0.1:8000/api/posts')
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


const outputPost = (container,results) => {
    container.html("")
    let html =""
    if(results){
        html = results.map(item => {
            return createPostHtml(item)
        })  
        html = html.join(" ")
    }
    container.html(html)
}
