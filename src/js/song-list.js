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
            let liList = songs.map((song)=>$('<li></li>').text(song.name).attr('data-song-id', song.id))
            this.$el.find('ul').empty()
            liList.map((domLi) => {
                this.$el.find('ul').append(domLi)
            })
        },
        activeItem(li){
            $(li).addClass('active')
                .siblings('.active').removeClass('active')
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        },
    }
    let model = {
        data: {
            songs:[]
        },
        find(){
            var query = new AV.Query('Song');
            return query.find().then((songList) => {
                this.data.songs = songList.map((song)=>{
                    return {id: song.id, ...song.attributes}
                })
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.getAllSongs()
            this.view.render(this.model.data)
            this.bindEventHub()
            this.bindEvent()

        },
        getAllSongs(){
            return this.model.find().then(()=>{
                this.view.render(this.model.data)})
        },
        bindEvent(){
            $(this.view.el).on('click', 'li', (e) => {
                e.preventDefault()
                this.view.activeItem(e.currentTarget)
                let songId = e.currentTarget.getAttribute('data-song-id')
                console.log(songId)
                let songs = this.model.data.songs
                let data = ''
                for(let i = 0; i < songs.length; i++){
                    if(songs[i].id === songId){
                        console.log('song', songs[i])
                        data = songs[i]
                        break
                    }
                }
                window.eventHub.emit('select', JSON.parse(JSON.stringify(data)) )
            })
        },
        bindEventHub(){
            window.eventHub.on('new',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('created', (data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}