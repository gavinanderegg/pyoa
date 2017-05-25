import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import WPAPI from 'wpapi';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		var wp = new WPAPI({
			endpoint: 'http://localhost:8000/wp-json',
			username: 'admin',
			password: 'Password!'
		});

		this.state = {
			page: '',
			content: '',
			wp: wp,
		};

		this._addChoice = this._addChoice.bind(this);
	}

	componentDidMount() {


		var lastSlug;

		// We're on the index page, show the index post.
		if (window.location.pathname === '/') {
			console.log('here somehow');

			// Obvs, but: don't do this in production.
			this.state.wp.posts().slug('index').then((response) => {
				this.setState({
					page: 'index',
					content: response[0].content.rendered
				});
			});
		} else if (window.location.pathname.startsWith('/add/')) {
			lastSlug = window.location.pathname.slice(1).split('/').pop();

			this.setState({
				page: '--add--',
				content: lastSlug,
			});
		} else if (window.location.pathname.startsWith('/save/')) {
			lastSlug = window.location.pathname.slice(1).split('/').pop();

			this.setState({
				page: '--save--',
				content: lastSlug,
			});
		} else {
			lastSlug = window.location.pathname.slice(1).split('/').pop();

			this.state.wp.posts().slug(lastSlug).then((response) => {
				this.setState({
					page: lastSlug,
					content: response[0].content.rendered,
				});
			});
		}
	}

	_addChoice(e) {
		e.preventDefault();

		console.log('upy!');

		var elements = findDOMNode(this.refs.form).elements;

		console.log(elements.content.value + ' ' + elements.title.value);

		this.state.wp.posts().create({
			title: elements.title.value,
			content: elements.content.value,
			status: 'publish',
			excerpt: 'yoyoyoyoyo',
		}).then((response) => {
			console.log(response.id);
		});


		debugger;
	}

	render() {
		var addURL;

		if (this.state.page  && this.state.page !== '--add--' && this.state.page !== '--save--') {
			addURL = '/add/' + this.state.page;

			return (
				<div className="App">
					<div className="App-header">
						<h2>Welcome to React</h2>
					</div>
					<div className="App-content">
						<div className="App-text" dangerouslySetInnerHTML={{__html: this.state.content}}></div>
						<div className="App-choices">
							choices here
						</div>
						<div>
							<a href={addURL}>Add a choice</a>
						</div>
					</div>
				</div>
			);
		} else if (this.state.page === '--add--') {
			addURL = '/save/' + this.state.content;

			return (
				<div className="App">
					<div className="App-header">
						<h2>Add a new choice</h2>
					</div>
					<div className="App-content">
						<form onSubmit={this._addChoice} ref="form">
							<div>
								<input name="title" ref="formTitle" type="text"/>
							</div>
							<div>
								<textarea name="content" ref="formContent"></textarea>
							</div>
							<div>
								<input type="submit" />
							</div>
						</form>
					</div>
				</div>
			);
		} else if (this.state.page === '--save--') {
			console.log('Saving');

		} else {
			return null;
		}
	}
}

export default App;
