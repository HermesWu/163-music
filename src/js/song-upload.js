{
    let view = {
        el: '.page .uploadArea',
        find(selector) {
            return $(this.el).find(selector)[0]
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.initQiniu()
        },
        initQiniu(){
            var uploader = Qiniu.uploader({
                runtimes: 'html5',      // 上传模式，依次退化
                browse_button: this.view.find('#pickfiles'),         // 上传选择的点选按钮 id，必需
                uptoken_url: 'http://127.0.0.1:8888/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
                domain: 'pegr14rv7.bkt.clouddn.com',     // bucket域名，下载资源时用到，必需
                container: this.view.find('#container'),             // 上传区域DOM ID，默认是browser_button的父元素
                max_file_size: '40mb',             // 最大文件体积限制
                dragdrop: true,                     // 开启可拖曳上传
                drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function(up, files) {
                        plupload.each(files, function(file) {
                        });
                    },
                    'BeforeUpload': function(up, file) {
                        window.eventHub.emit('beforeUpload')
                    },
                    'UploadProgress': function(up, file) {
                        uploadStatus.textContent = '上传中。。。'
                    },
                    'FileUploaded': function(up, file, info) {
                        window.eventHub.emit('afterUpload')
                        uploadStatus.textContent = "上传完毕"
                        var domain = up.getOption('domain');
                        var response = JSON.parse(info.response);
                        var sourceLink = "http://" + domain +"/"+ encodeURIComponent(response.key); //获取上传成功后的文件的Url
                        window.eventHub.emit('new', {
                            url: sourceLink,
                            name: response.key
                        })
                    },
                    'Error': function(up, err, errTip) {
                        //上传出错时，处理相关的事情
                    },
                    'UploadComplete': function() {
                        //队列文件处理完毕后，处理相关的事情
                    }
                }
            });
        }
    }
    controller.init(view, model)
}