{
    let view = {
        el: '.page main',
        template: `
         <h2 class="title">新建歌曲</h2>
        <div class="editArea">
            <form>
                <div class="row">
                    <label >歌名
                        <input type="text">
                    </label>
                </div>
                <div class="row">
                    <label for="">歌手
                        <input type="text">
                    </label>
                </div>
                <div class="row">
                    <label for="">外链
                        <input type="text">
                    </label>
                </div>
                <div class="row save">
                    <button type="submit">保存</button>
                </div>
            </form>
        </div>
        `,
        render(data) {
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
        }
    }
    controller.init(view, model)
}