
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

$("#postTextarea, #replyTextarea").keyup(function (e) {
    var textArea = $(e.target) 
    var text = textArea.val().trim()
    const isModal = textArea.parents(".modal").length == 1;
    const btn = isModal ? $("#replyBtn") : $("#submitPostButton")
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
    if(postData == null) return alert("post is an null objec")
    const isRetweet = postData.retweetData != undefined

    const retweetedBy = isRetweet ? postData.createdBy.username : null
    postData = isRetweet ? postData.retweetData : postData
    let retweetText = ""
    if(isRetweet){
        retweetText = `<span>  
        <i class="fas fa-retweet"></i> 
        <a href="/profile/${retweetedBy}">Retweeted by ${retweetedBy}</a>
        </span>`
    }
    let replyText = ""
    if(postData.replyTo && postData.replyTo._id) {
        const user = postData.replyTo.createdBy.username
        replyText = `<div>
            <span class="replyText">Replying to <a href="/profile/${user}">@${user}</a></span>
        </div>`
    }
    
    const profilePic = postData.createdBy.profile
    const firstName = postData.createdBy.firstName
    const lastName = postData.createdBy.lastName
    const username = postData.createdBy.username
    const fullName = `${firstName} ${lastName}`
    const timestamp = timeDifference(new Date(),new Date(postData.createdAt))
    const isLiked = postData.likes.includes(signedUser._id)
    const isTweeted= postData.retweetUsers.includes(signedUser._id)
    let html =`<div class="post" data-id="${postData._id}">
                <div class="postContainerAction">
                ${retweetText}
            </div>
        <div class="mainPostContainer">
            <div class="imgContainer">
                <img src=${profilePic} alt="user picture">
            </div>
            <div class="postContents">
                <div class="post__header">
                <a href="/profile/${username}" class="displayName">${fullName}</a>
                <span class="username">@${username}</span>
                <span class="date">${timestamp}</span>
                <div class="optionMenu" tabindex="-1">
                    <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                    <div class="postMenus toggle" data-createdBy=${postData.createdBy._id}></div>
                </div>
                </div>
                <div class="post__body">
                    ${replyText}
                    <span>${DOMPurify.sanitize(postData.content)}</span>
                    <div class="post__photos">
                        ${getPhotos(postData.images)}
                    </div>
                </div>
                <div class="post__footer">
                    <div class="postButtonContainer">
                        <button  data-toggle="modal" data-target="#replyModal">
                        <i class="far fa-comment"></i>
                        </button>
                    </div>
                    <div class="postButtonContainer red heart_btn likeBtn">
                        <button class=${isLiked ?  "active" : ""}>
                        <i class="far fa-heart"></i>
                        <span>${postData.likes.length || ""}</span>
                        </button>
                    </div>
                    <div class="postButtonContainer green">
                        <button class="retweetBtn ${isTweeted ?  "active" : ""}">
                        <i class="fas fa-retweet"></i>
                        <span>${postData.retweetUsers.length || ""}</span>
                        </button>
                    </div>
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

// reply button
$("#replyModal").on('show.bs.modal',async function (event) {
    const btn = $(event.relatedTarget)
    const postId = getPostId(btn)
    if (postId == undefined) return 
    $("#replyBtn").attr('data-id',postId)
    const res = await axios.get(`http://127.0.0.1:8000/api/posts/${postId}`);
    const html = createPostHtml(res.data.data.postData)
    const body =  $(".modal-body .post")
    body.html("")
    body.html(html)

    
})
// reply button
$("#replyModal").on('hidden.bs.modal',async function (event) {
    $(".modal-body .post").html("")
})

$("#replyBtn").on("click",async function (event) {
    const id = $("#replyBtn").attr('data-id')
   
    try {
        const formData = new FormData()
        const reply = DOMPurify.sanitize( $("#replyTextarea").val() );
        formData.append("content", reply )
        formData.append("replyTo",id )
        const result = await axios.post('http://127.0.0.1:8000/api/posts',formData);
        if(result.data.status ==="success"){ 
            location.reload("/")
           
        }            
    }catch (err) {
        // Todo show alert
        console.log(err)
    }

})
// like button
$(document).on('click', ".likeBtn",async function (event) {
    const btn = $(event.target) 
    parent = getPostId(btn)
    if (parent == undefined) return 
    const res = await axios.put(`http://127.0.0.1:8000/api/posts/${parent}/like`);
    const post =res.data.post
    btn.find("span").text(post.likes.length || "")
    if(post.likes.includes(signedUser._id)){
        btn.addClass("active")
        return
    }
    btn.removeClass("active")
})
// retweet button
$(document).on('click', ".retweetBtn",async function (event) {
    const btn = $(event.target)
    parent = getPostId(btn)
    if (parent === undefined) return 
    const res = await axios.put(`http://127.0.0.1:8000/api/posts/${parent}/retweet`);
    const post =res.data.post
    btn.find("span").text(post.retweetUsers.length || "")
    if(post.retweetUsers.includes(signedUser._id)){
        btn.addClass("active")
        return
    }
    btn.removeClass("active")
})


$(document).on('click', ".post__body",async function (event) {
    const post = $(event.target)
    parent = getPostId(post)
    if (parent === undefined || post.is("button") || post.is("i")) return 
  console.log(post)
    window.location.href = `http://127.0.0.1:8000/posts/${parent}`

})

const getPostId = (element) => {
    const isRoot = element.hasClass("post")
    const parentElement = isRoot ? element : element.closest(".post")
    const id = parentElement.data().id
    if (id === undefined) return alert('id not found')
    return id
}

const outputReply = (container,results) => {
    if(!results) return
    container.html("")
    if(results.replyTo && results.replyTo._id){
       $(container).append(createPostHtml(results.replyTo))
    }
    $(container).append(createPostHtml(results.postData))
    let html =""
    if(results.replies){ 
        html = results.replies.map(item => {
            return createPostHtml(item)
        })  
        html = html.join(" ")
    }
    $(container).append(html)
}

$(document).on('click','.optionMenu',(event) => {
    const btn = $(event.target)
    const optionMenu = btn.hasClass("optionMenu")
    if(!optionMenu) return
    const menu = btn.find(".postMenus")
    const hasMenus = (menu).children().length
    if(hasMenus) return
    const mypost = signedUser._id.toString() === menu.data().createdby.toString()
    const options = mypost ? ['Edit','Delete','Pin'] : ['Pin']
    const optionsIcon = mypost ? ['fa-pencil','fa-trash-o','fa-thumb-tack']:['fa-thumb-tack']
    let html = options.map((item, i) =>{
        return `<div class="postMenu post${item}">
            <div class="postMenu__icon">
            <i class="fa ${optionsIcon[i]}" aria-hidden="true"></i>
            </div>
            <div class="postMenu__item">
                <span>${item} the post </span>

            </div>
        </div>`} )
        html = html.join(" ")
    menu.html(html)
   
  
})
$(document).on('click','.postDelete',async (event) => {
    console.log("delting.............")
    const dltBtn = $(event.target)
    const postId = getPostId(dltBtn)
    if (postId == undefined) alert("undefined postid")
    try{
        const response = await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}`) 
        if(response.status == 204){
          return location.reload()
        }
        alert("Could not delete please try again later")       
    }catch (err) {
        // Todo show alert
        console.log(err)
    }
})


