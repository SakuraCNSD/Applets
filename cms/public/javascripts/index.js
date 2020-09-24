var uploadBtn = document.getElementById("uploadBtn");
uploadBtn.onchange = function (e) {
    var file = e.target.files[0];
    var param = new FormData();
    param.append("file", file);
    var config = {
        headers: {
            'Content-type': "multipart/form-data"
        }
    }
    axios.post('uploadBannerImg', param, config).then(res => {
        console.log(res);
    });
}
