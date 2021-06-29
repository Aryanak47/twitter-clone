


// for image uploading
$(".imageUpload").click(function () {
    $("input[type='file']").trigger('click');
});
  
$('input[type="file"]').on('change', function(e) {
    const files = $(e.target.files)
    if (files) {
        removeOldImages()
        for (var i = 0; i < files.length; i++) {
            if (i > 3) {
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
                    removeOldImages()
                    document.getElementById('imgInp').value=""
                    document.getElementById('postTextarea').value=""
                } 
                btn.textContent = 'Post'           
            }catch (err) {
                console.log(err)
                btn.textContent = 'Post'
            }
        })
    }



// get all the images which are to be uploaded 
const getImages = () => {

}



