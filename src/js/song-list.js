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
        },
        find(){
            var query = new AV.Query('Song');
            return query.find().then((songList) => {
                this.data.songs = songList.map((song)=>{
                    // let {id, attributes} = song
                    // this.data.songs.push({id, ...attributes})
                    return {id: song.id, ...song.attributes}
                })
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEventHub()
            this.getAllSongs()

        },
        clearActive(){
            $(this.view.el).find('.active').removeClass('active')
        },
        getAllSongs(){
            this.model.find().then(()=>{
                this.view.render(this.model.data)})
        },
        bindEventHub(){
            window.eventHub.on('upload',()=>{
                this.clearActive()
            })
            window.eventHub.on('created', (data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}