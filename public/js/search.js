
let timer;

$("#searchBox").on("keydown", function(e) {
    clearTimeout(timer);
    const textBox = $(e.target);
    const searchType = textBox.data("search")
    timer = setTimeout(function() {
        const val = textBox.val().trim();
        if(val === ""){
            $(".resultsContainer").html('');
            return
        }
        search(val,searchType);

    },1000)

})

const search = async (val,searchType) => {
    const url = searchType === "posts" ? "/api/posts" :"/api/users"
    try {
        const response = await axios.get(url,{params:{search:val}})
        const results = response.data.data
        if(searchType === "users"){
            outputUsers($('.resultsContainer'),results)
            return;
        }
        outputPost($(".resultsContainer"),results)
    } catch (error) {
        alertUser("Try again later!")
        
    }
    
}