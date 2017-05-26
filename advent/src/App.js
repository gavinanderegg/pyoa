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
			id: '',
			page: '',
			title: '',
			excerpt: '',
			content: '',
			wp: wp,
		};

		this._addChoice = this._addChoice.bind(this);
	}

	componentDidMount() {
		var id, slug;

		// We're on the index page, show the index post.
		if (window.location.pathname === '/') {
			// Obvs, but: don't do this in production.
			this.state.wp.posts().slug('index').then((response) => {
				this.setState({
					page: 'index',
					id: response[0].id,
					title: response[0].title.rendered,
					excerpt: response[0].excerpt.rendered,
					content: response[0].content.rendered,
				});
			});
		} else if (window.location.pathname.startsWith('/add/')) {
			id = window.location.pathname.slice(1).split('/')[1];
			slug = window.location.pathname.slice(1).split('/')[2];

			this.state.wp.posts().slug(slug).then((response) => {
				this.setState({
					id: id,
					page: '--add--',
					excerpt: response[0].excerpt.rendered,
					content: slug,
				});
			});
		} else {
			slug = window.location.pathname.slice(1).split('/')[0];

			this.state.wp.posts().slug(slug).then((response) => {
				this.setState({
					id: response[0].id,
					page: slug,
					title: response[0].title.rendered,
					excerpt: response[0].excerpt.rendered,
					content: response[0].content.rendered,
				});
			});
		}
	}

	_addChoice(e) {
		e.preventDefault();

		var elements = findDOMNode(this.refs.form).elements;

		this.state.wp.posts().create({
			title: elements.title.value,
			excerpt: '---',
			content: elements.content.value,
			status: 'publish',
		}).then((response) => {
			var excerpt;

			if (this.state.excerpt === '---') {
				excerpt = elements.title.value + ' | ' + elements.path.value + ' | ' + response.slug;
			} else {
				excerpt = this.state.excerpt + "\n" + elements.title.value + ' | ' + elements.path.value + ' | ' + response.slug;
			}

			this.state.wp.posts().id(this.state.id).update({
				excerpt: excerpt,
			}).then((response) => {
				window.location = window.location.origin + '/' + this.state.content
			});
		});
	}

	_getChoices(excerpt) {
		var choiceLines = excerpt.split("\n");

		var choices = choiceLines.map((line, index) => {
			if (line === '---') {
				return false;
			}

			var choiceItems = line.split(' | ');
			var choiceHref = '/' + choiceItems[2];

			return <div key={index}><a href={choiceHref}>{choiceItems[1]}</a></div>;
		});

		return choices;
	}

	render() {
		var addURL;
		var choices;

		if (this.state.page && this.state.page !== '--add--') {
			addURL = '/add/' + this.state.id + '/' + this.state.page;

			choices = this._getChoices(this.state.excerpt);

			return (
				<div className="App">
					<div className="App-header">
						<h2>{this.state.title}</h2>
					</div>
					<div className="App-content">
						<div className="App-text" dangerouslySetInnerHTML={{__html: this.state.content}}></div>
						<div className="App-choices">
							{choices}
						</div>
						<div className="App-add">
							<a href={addURL} className="App-addButton">Add a choice</a>
						</div>
					</div>
				</div>
			);
		} else if (this.state.page === '--add--') {
			return (
				<div className="App">
					<div className="App-header">
						<h2>Add a new choice</h2>
					</div>
					<div className="App-content">
						<div className="App-addform">
							<form onSubmit={this._addChoice} ref="form">
								<div>
									<label htmlFor="formTitle">Title</label> <input id="formTitle" name="title" ref="formTitle" type="text"/>
								</div>
								<div>
									<label htmlFor="formPath">Path</label> <input id="formPath" name="path" ref="formPath" type="text"/>
								</div>
								<div>
									<label htmlFor="formContent">Content</label> <textarea id="formContent" name="content" ref="formContent"></textarea>
								</div>
								<div>
									<input type="submit" />
								</div>
							</form>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default App;
