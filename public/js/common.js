


// for image uploading
$(".imageUpload").click(function () {
    $("input[type='file']").trigger('click');
});
  
$('input[type="file"]').on('change', function(e) {
    const [file] = $(e.target.files)
    if (file) {
        var f = URL.createObjectURL(file)
        $(".post-imgs").append(`
        <div class="post-img" >
            <i class="fas fa-times cross-btn"></i>
            <img src=${f} alt="upload picture" >
        </div>
        `)
       checkImages()
        $(".cross-btn").click( function (e) {
            removeImage(e)
        })
        
    }
})
// remove image
const removeImage = (e) => {
    const btn = e.target
    const image = btn.parentNode
    image.remove()
    checkImages()
}
// check total number of imageUpload
const checkImages = () => {
    const totalImages = $(".post-imgs").children().length; 
    if(totalImages >=4 ){
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






