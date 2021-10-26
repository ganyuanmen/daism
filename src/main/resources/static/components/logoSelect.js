function gene_logoSelect(parentDiv,viewDiv) {
    $('<input class="form-control" required type="file" accept="image/*"/>').on('change', function () {
        var file = this.files[0];
        var type = this.value.toLowerCase().split('.').splice(-1); //获取上传的文件的后缀名

        if (type[0] != 'svg') {
            this.value = '';
            makeBack('只能选择.svg的图片！', true, true)
            return;
        }
        if(file.size>10240)
        {
            this.value = '';
            makeBack('svg的图片不能大于10K！', true, true)
            return;
        }
        var reader = new FileReader();
        reader.onload = function () {
            if (reader.result) {
                //显示文件内容
                // viewDiv.html(reader.result);
                viewDiv.empty();
                $('<img>').height(32).width(32).attr('src', 'data:image/svg+xml;base64,' + window.btoa(reader.result)).appendTo(viewDiv);
                viewDiv.data('real_src',reader.result)
            }
        };
        reader.readAsText(file);
    })
        .appendTo(parentDiv);
}