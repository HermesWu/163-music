{
    let view = {
        el: '.page #songListContainer',
        template: `
            <ul class="songList">
            </ul>
        `,
        render(data){
            this.$el = $(this.el)
            this.$el.html(this.template)
            let {songs} = data
            let liList = songs.map((song)=>$('<li></li>').text(song.name))
            this.$el.find('ul').empty()
            liList.map((domLi) => {
                this.$el.find('ul').append(domLi)
            })
        }
    }
    let model = {
        data: {
            songs:[]
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload',()=>{
                this.clearActive()
            })
            window.eventHub.on('created', (data)=>{
                console.log('songList,created后拿到的',data)
                this.model.data.songs.push(data)
                console.log(this.model.data)
                this.view.render(this.model.data)
            })
        },
        clearActive(){
            $(this.view.el).find('.active').removeClass('active')
        },
    }
    controller.init(view, model)
}