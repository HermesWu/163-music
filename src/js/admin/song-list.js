{
    let view = {
        el: '.page #songListContainer',
        template: `
            <ul class="songList">
            </ul>
        `,
        render(data){
            console.log(2,data.songs)
            this.$el = $(this.el)
            this.$el.html(this.template)
            let {songs, selectSongId} = data
            let liList = songs.map((song)=>{
                let $el = $('<li></li>').text(song.name).attr('data-song-id', song.id)
                if(song.id === selectSongId){
                    $el.addClass('active')
                }
                return $el
            })
            this.$el.find('ul').empty()
            liList.map((domLi) => {
                this.$el.find('ul').append(domLi)
            })
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        },
    }
    let model = {
        data: {
            songs:[],
            selectSongId: undefined
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
                let songId = e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectSongId = songId
                this.view.render(this.model.data)
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
            window.eventHub.on('update', (song)=>{
                console.log(song)
                console.log(1)
                let songs = this.model.data.songs
                for(let i = 0; i < songs.length; i++){
                    if(songs[i].id === song.id){
                        Object.assign(songs[i], song)
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}