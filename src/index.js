import {observable, autorun} from 'mobx'
class Store {
    @observable title = ''
}


const store = new Store();


autorun(() => {
    console.log(store.title)
})