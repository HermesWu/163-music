{
    let view = {
        el: '.page .newSong',
        init(){
            this.$el = $(this.el)
        },
        template: `
             新建歌曲
        `,
        render(data) {
            $(this.el).html(this.template)
        },
        active(){
            $(this.el).addClass('active')
        },
        deActive(){
            $(this.el).removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.view.render(this.model.data)
            this.view.active()
            this.bindEvent()
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('select', (data) => {
                this.view.deActive()
            })
            window.eventHub.on('new', (data) => {
                this.view.active()
            })
        },
        bindEvent(){
            this.view.$el.on('click', (e) => {
                this.view.active()
                window.eventHub.emit('new', {})
            })
        }
    }
    controller.init(view, model)
}