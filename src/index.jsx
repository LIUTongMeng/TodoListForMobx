import {trace,toJS, spy, observe,observable, action, computed} from 'mobx'
import React, {Component, Fragment} from 'react'
import ReactDOM from 'react-dom'
import {observer, PropTypes as ObservablePropTypes} from 'mobx-react'
import PropTypes from 'prop-types'

// observe 监听器 只监听参数本身
// spy   监控所有 性能 ？ 
// spy (event => console.log(event))
class Item {
    id  = Math.random();                            
    @observable  title = ""
    @observable  finished = false

    constructor (title) {
        this.title = title
    }

    @action.bound toogle ()  {
        this.finished = !this.finished
    }
}

class Store {
    @observable list = [];
    constructor() {
        observe(this.list, change => {
            console.log(change)
        })
    }
    @action.bound 
    createTodo (title) {
      this.list.unshift(new Item(title))
    }

    @action.bound removeItem(todo)  {
        this.list.remove(todo)
    }

    @computed get left () {
        return this.list.filter(item => !item.finished).length
    }
}

const store = new Store();

@observer
class TodoFooter extends Component {
    render() {
        trace()
        const store = this.props.store;
        return <Fragment>
              {store.left} item(s) unfinished
        </Fragment>
    }
}

@observer
class TodoHeader extends Component {
    state = {inputValue:''}
    handleSubmit = (e) => {
        e.preventDefault();
        var store = this.props.store
        var inputValue = this.state.inputValue;
        store.createTodo(inputValue)
        this.setState({
            inputValue:''
        })

    }
    handleChange = (e) => {
      var inputValue = e.target.value;
      this.setState({
        inputValue
      })
    }
    render() {
        trace()
        const store = this.props.store;
        return <Fragment>
             <form onSubmit={this.handleSubmit}>
                <input className='input' type="text" 
                onChange={this.handleChange} value={this.state.inputValue}
                placeholder='What you want to  finished ?'
                />
                </form>
        </Fragment>
    }
}


@observer
class TodoItem extends Component {
    static propTypes = {
        item : PropTypes.shape({
            id:PropTypes.number.isRequired,
            title:PropTypes.string.isRequired,
            finished:PropTypes.bool.isRequired
        }).isRequired
    }
    handleChange=(e) => {
      this.props.item.toogle();
    }
    render()  {
        trace()
        const todo = this.props.item;
        return <Fragment>
            <input type='checkbox' onChange={this.handleChange } checked={todo.finished}/>
            <span className={[todo.finished ? 'remove' : '']}>{todo.title}</span>
        </Fragment>
    }
}

@observer class TodoView extends Component {
    handleClick = (todo, e) => {
        this.props.store.removeItem(todo)
    }
    render() {
        const store = this.props.store;
        return <ul>
        {
            store.list.map((item, index) => <li key={index}>
              <TodoItem item={item}/> <span onClick={this.handleClick.bind(this, item)}>del</span>
            </li>)
        }
    </ul>
    }
}

@observer 
class TodoList extends Component {
    static propTypes = {
        store:PropTypes.shape({
            list:ObservablePropTypes.observableArrayOf(ObservablePropTypes.observableObject).isRequired
        }).isRequired
    }
    render() {
       // 有助于调试
        // trace(true)

        trace()
        const store  = this.props.store
        return (<div className='todo-list'>
            <header>
                <TodoHeader store={store}/>
            </header>
            <section>
                <TodoView store={store} />
            </section>
            <footer>
                <TodoFooter store={store} />
            </footer>
        </div>)
    }
}

ReactDOM.render(<TodoList store={store}/>, document.querySelector('#app'))