import React, { Component } from 'react';
import axios from 'axios';

// first we will make a new context
const MyContext = React.createContext();

// Then create a provider Component
class MyProvider extends Component {
  state = {
    name: 'Wes',
    age: 100,
    cool: true
  }
  render() {
    return (
      <MyContext.Provider value={{
        state: this.state,
        growAYearOlder: () => this.setState({
          age: this.state.age + 1
        }),
        changeName: (props) => this.setState({
          name: props
        })
      }}>
        {this.props.children}
      </MyContext.Provider>
    )
  }
}

const Family = (props) => (
  <div className="family">
    <Person />
  </div>
)

class Person extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: ''
    }
  }
  
  render() {
    return (
      <div className="person">
        <MyContext.Consumer>
          {(context) => (
            <React.Fragment>
              <p>Age: {context.state.age}</p>
              <p>Name: {context.state.name}</p>
              <button onClick={context.growAYearOlder}>more</button>
              <input type='text' value={this.state.name} onChange={(event)=>{this.setState({name: event.target.value})}}/>
              <button onClick={ () => context.changeName(this.state.name)}>name</button>
            </React.Fragment>
          )}
        </MyContext.Consumer>
      </div>
    )
  }
}

const TableCustom = (props) => {
  // console.log(props.props)
  return (
  <tr>
    <th>{props.props.name}</th>
    <th>{props.props.paradigm}</th>
    <th><button onClick={() => props.delete(props.props.id)}>apagar</button></th>
  </tr>
  )
}


class App extends Component {
  constructor(){
    super()
    this.state = {
      load: true,
      languagem: []
    }
  }

  async componentDidMount (){
    try {
      let data = await axios.get('http://127.0.0.1:8000/languagem')
      this.setState({
        languagem: data.data,
        load: false
      })
    }
    catch (err) {
      console.log(err)
    }
  }

  async sendData() {
    try {
      let response = await axios.post('http://127.0.0.1:8000/languagem/', {
        name: this.state.name,
        paradigm: this.state.paradigm
      })
      console.log(response)
    }
    catch(err) {
      console.log(err)
    }
  }

  async deleteData(value) {
    console.log('http://127.0.0.1:8000/languagem/'+value)
    try {
      let response = await axios.delete('http://127.0.0.1:8000/languagem/'+value)
      console.log(response)
    }
    catch(err) {
      console.log(err)
    }
  }

  render() {
    return (
      <MyProvider>
        <div>
          <p>I am the app</p>
          <Family />
          <div>
            <p>
            <label>Linguagem: </label>
            <input type='text' onChange={(event) => this.setState({name: event.target.value})}/> </p>
            <p>
            <label>paradigma: </label>
            <input type='text' onChange={(event) => this.setState({paradigm: event.target.value})}/> </p>
            <button onClick={() => this.sendData()}>Enviar</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Paradigma</th>
              </tr>
            </thead>
            <tbody>
              {this.state.load ? 
              null :
              this.state.languagem.map( (v) => <TableCustom props={v} delete={this.deleteData} key={v.id} />)
              }
            </tbody>
          </table>
        </div>
      </MyProvider>
    );
  }
}


export default App;
