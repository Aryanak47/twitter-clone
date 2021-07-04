


// for image uploading
$(".imageUpload").click(function () {
    $("input[type='file']").trigger('click');
});
  
$('input[type="file"]').on('change', function(e) {
    const files = $(e.target.files)
    if (files) {
        removeOldImages()
        for (var i = 0; i < files.length; i++) {
            if (i > 3) {a
                checkImages()
                break; 
            }
            var f = URL.createObjectURL(files[i])
            $(".post-imgs").append(`
            <div class="post-img" >
                <i class="fas fa-times cross-btn"></i>
                <img src=${f} data-name=${files[i].name} alt="upload picture" >
            </div>
            `)
          }
       
        $(".cross-btn").click( function (e) {
            removeImage(e)
        })
        
    }
})
// remove image
const removeImage = (e) => {
    const btn = e.target
    const image = btn.parentNode 
    let img = $(btn).siblings('img').first()[0]
    img = $(img).attr("data-name")
    const dt = new DataTransfer()
    const  inp = document.getElementById('imgInp')
    const  files = inp.files
    for (var i = 0; i < files.length; i++) {
        if (files[i].name !== img) {
            dt.items.add(files[i])
        }
    }
    inp.files = dt.files
    // console.log("after",files)
    image.remove()
    checkImages()
}


const removeOldImages = () => {
    let images = $(".post-imgs")
    let len = $(".post-imgs").children().length
    if(len){
        images.empty()
    }
}
// check total number of imageUpload
const checkImages = () => {
    const totalImages = $(".post-imgs").children().length
    if(totalImages >3 ){
        $(".imageUpload").addClass("disabled");
        $('input[type="file"]').prop("disabled",true)
       return 
    }
    $(".imageUpload").removeClass("disabled");
    $('input[type="file"]').prop("disabled",false)


}


// handle emoji
$('.fa-smile').click(function (e) {
    const emoji = document.querySelector('#emojis') 
    if(emoji){
        $("#emojis").remove()
    }else{
        $(".items").append(`<div id="emojis"></div>`)
        $("#emojis").disMojiPicker();
        twemoji.parse(document.body);
        $("#emojis").picker(emoji => {
            let output = $("#postTextarea").val();
            output = output + " "+emoji
            $("#postTextarea").val(output)
});
    }
})

$("#postTextarea").keyup(function (e) {
    var textArea = $(e.target) 
    var text = textArea.val().trim()
    const btn = $("#submitPostButton")
    if(text){
        btn.prop('disabled', false)
        return
    }
    btn.prop('disabled', true) 
})
    const postForm = document.querySelector('form');
    if(postForm){
        postForm.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = document.getElementById('submitPostButton');
            var formData = new FormData(postForm);
            try {
                btn.textContent="Posting..."
                const result = await axios.post('http://127.0.0.1:8000/api/posts',formData);
                if(result.data.status ==="success"){ 
                    console.log(result.data.post) 
                    $(".postsContainer").prepend(createPostHtml(result.data.post))
                    removeOldImages()
                    document.getElementById('imgInp').value=""
                    document.getElementById('postTextarea').value=""
                    $("#submitPostButton").prop('disabled', true)
                } 
                btn.textContent = 'Post'           
            }catch (err) {
                // Todo show alert
                console.log(err)
                btn.textContent = 'Post'
            }
        })
    }
const createPostHtml = (postData) =>{
    const profilePic = postData.createdBy.profile
    const firstName = postData.createdBy.firstName
    const lastName = postData.createdBy.lastName
    const username = postData.createdBy.username
    const fullName = `${firstName} ${lastName}`
    const timestamp = timeDifference(new Date(),new Date(postData.createdAt))
    let html =`<div class="post">
        <div class="mainPostContainer">
            <div class="imgContainer">
                <img src=${profilePic} alt="user picture">
            </div>
            <div class="postContents">
                <div class="post__header">
                <a href="#" class="displayName">${fullName}</a>
                <span class="username">@${username}</span>
                <span class="date">${timestamp}</span>
                </div>
                <div class="post__body">
                    <span>${postData.content}</span>
                    <div class="post__photos">
                        ${getPhotos(postData.images)}
                    </div>
                </div>
                <div class="post__footer">
                    <div class="postButtonContainer">
                        <button>
                        <i class="far fa-comment"></i>
                        </button>
                    </div>
                    <div class="postButtonContainer heart_btn">
                        <button>
                        <i class="far fa-heart"></i>
                        </button>
                    </div>
                    <div class="postButtonContainer">
                        <button>
                        <i class="fas fa-retweet"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `
    return html
}

const getPhotos = (photos) =>{
    if(!photos){
        return ""
    }
    let html = photos.map(photo => {
        return `<div class="post__photo">
                    <img src=/img/posts/${photo}>
                </div>`
    })
    return  html.join(" ")
}


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if( elapsed/1000 < 30 ) return "Just now"
        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return  Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return  Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return  Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

