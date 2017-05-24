import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import WPAPI from 'wpapi';
import './App.css';

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

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
			<Router>
				<div className="App">
					<div className="App-header">
						<h2>Welcome to React</h2>
					</div>
					<div className="App-content">

					</div>
				</div>
			</Router>
		);
	}
}

export default App;
