{
    let view = {
        el: '.page main',
        template: `
         <h2 class="title">新建歌曲</h2>
        <div class="editArea">
            <form>
                <div class="row">
                    <label >歌名
                        <input type="text" value="__key__">
                    </label>
                </div>
                <div class="row">
                    <label for="">歌手
                        <input type="text">
                    </label>
                </div>
                <div class="row">
                    <label for="">外链
                        <input type="text" value="__link__">
                    </label>
                </div>
                <div class="row save">
                    <button type="submit">保存</button>
                </div>
            </form>
        </div>
        `,
        render(data = {}) {
            let placeholders = ['key', 'link'] // 防止data是空的，所以事先定义好
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })

            $(this.el).html(html)
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload', (data)=>{
                console.log('--------- song form ---------')
                this.view.render(data)

            })
        },
        reset(){
          this.view.render(data)
        }
    }
    controller.init(view, model)
}