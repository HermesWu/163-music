{
    let view = {
        el: '#siteTab'
    }
    let model ={

    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.bindEvent()

        },
        bindEvent(){
            let $el = $(this.view.el)
            $el.on('click', 'li', (e)=>{
                let $li = $(e.currentTarget)
                $li.addClass('active').
                    siblings('.active').removeClass('active')
                let tabName = $li.attr('data-tab-name')
                console.log(tabName)
                window.eventHub.emit('selectTab', tabName)
            })
        }
    }
    controller.init(view, model)
}