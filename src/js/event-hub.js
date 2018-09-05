window.eventHub = {
    // 初始化，hash
    events: {
        // '嵩山少林寺': [吃斋念佛],
        // '太行武当山': [太极八卦]
    },
    emit(eventName, data) { // 发布
        for(let key in this.events){
            if(key === eventName){
                let fnList = this.events[key]
                fnList.map((fn)=>{
                    fn.call(undefined, data)
                })
            }
        }
    },
    on(eventName, fn) { //订阅
        if(this.events[eventName] === undefined){
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    }
}