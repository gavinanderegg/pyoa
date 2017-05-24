import React, { Component } from 'react';
import WPAPI from 'wpapi';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			content: '',
		};

		// this._searchTextChange = this._searchTextChange.bind(this);
		// this._handleSearch = this._handleSearch.bind(this);
	}


	componentDidMount() {
		if (window.location.pathname === '/') {
			var wp = new WPAPI({
				endpoint: 'http://localhost:8000/wp-json',
				username: 'admin',
				password: 'Password!'
			});

			wp.posts().slug('index').then((response) => {
				this.setState({
					content: response[0].content.rendered
				})
			});
		} else {
			// window.location.pathname.slice(1).split('/').pop()
		}
	}


	render() {


		return (
			<div className="App">
				<div className="App-header">
					<h2>Welcome to React</h2>
				</div>
				<div className="App-content" dangerouslySetInnerHTML={{__html: this.state.content}}></div>
			</div>
		);
	}
}

export default App;
