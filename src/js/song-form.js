{
    let view = {
        el: '.page main',
        init(){this.$el = $(this.el)},
        reset(){
            this.render({})
        },
        template: `
         
        <div class="editArea">
            <form>
                <div class="row">
                    <label >歌名
                        <input name="name" type="text" value="__name__">
                    </label>
                </div>
                <div class="row">
                    <label for="">歌手
                        <input name="singer" type="text" value="__singer__">
                    </label>
                </div>
                <div class="row">
                    <label for="">外链
                        <input name="url" type="text" value="__url__">
                    </label>
                </div>
                <div class="row save">
                    <button type="submit">保存</button>
                </div>
            </form>
        </div>
        `,
        render(data = {}) {
            let placeholders = ['name', 'url', 'id', 'singer'] // 防止data是空的，所以事先定义好
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })

            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<h2 class="title">编辑歌曲</h2>')
            }else{
                $(this.el).prepend('<h2 class="title">新建歌曲</h2>')
            }
        }
    }
    let model = {
        data: {name: '', singer: '', url: '', id: ''},
        create(data){
            var Song = AV.Object.extend('Song');
            var song = new Song();
            return song.save({ //返回一个promise对象
                name: data.name,
                singer: data.singer,
                url: data.url
            }).then((newSong) => {
                let {id, attributes} = newSong
                Object.assign(this.data, {id, ...attributes})
                return this.data // 需要有返回值
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.view.render(this.model.data)
            this.bindEvent()
            this.bindEventHub()

        },

        bindEvent(){
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data = {}
                needs.map((string) => {
                    data[string] =
                        this.view.$el.find(`[name = "${string}"]`).val()
                })
                this.model.create(data).then((data) => {
                    this.view.reset()
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)
                    window.eventHub.emit('created', object)
                })
            })
        },
        bindEventHub(){
            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data)=>{
                if(this.model.data.id){
                    this.model.data = {}
                }else{
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}