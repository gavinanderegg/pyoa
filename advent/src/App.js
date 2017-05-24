import React, { Component } from 'react';
import WPAPI from 'wpapi';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
		};

		// this._searchTextChange = this._searchTextChange.bind(this);
		// this._handleSearch = this._handleSearch.bind(this);
	}

	componentDidMount() {
		var wp = new WPAPI({
			endpoint: 'http://localhost:8000/wp-json',
			username: 'admin',
			password: 'Password!'
		});

		wp.posts().slug('index').then((response) => {
			console.log(response);
		})
	}

	render() {


		return (
			<div className="App">
				<div className="App-header">
					<h2>Welcome to React</h2>
				</div>
				<p className="App-content">

				</p>
			</div>
		);
	}
}

export default App;
