import React, { Component } from 'react'
import Search from 'Search'


export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      route: window.location.hash.substr(1)
    }
  }
  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: window.location.hash.substr(1)
      })
    })
  }
  render() {
    let Child

    switch (this.state.route) {
      case '/search': Child = Search; break;
      default: Child = Search;
    }

    return (
      <div className='container'>
        <h1>App</h1>
        <ul>
          <li><a href='#/Search'>Search</a></li>
        </ul>
        <Child />
      </div>
    )

  }
}
