import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import postsArray from './posts.json';
import users from './users.json';

class User extends Component {
  render() {
    const {
      author,
      company,
      city
    } = this.props;

    return (
      <div>
        <span>{author}</span> - <span>{company}</span> - <span>{city}</span>
      </div>
    )
  }
}

class Post extends Component {
  handleDelete() {
    this.props.onDelete(this.props.id);
  }

  render() {
    const {
      title,
      body,
      userId,
      key,
      onDelete
    } = this.props;

    return (
      <article>
        <h2>{title}</h2>
        {users.filter(user => user.id == userId).map(user => (
          <User
            key={user.id}
            author={user.name}
            city={user.address.city}
            company={user.company.name}
          />
        ))}
        <p>{body}</p>
        <button onClick={this.handleDelete.bind(this)}>X</button>
      </article>
    )
  }
}

class List extends Component {
  render() {
    const {
      posts,
      onPostDelete
    } = this.props;

    return (
      <div>
        {posts.map(post => (
          <Post
            id={post.id}
            userId={post.userId}
            title={post.title}
            body={post.body}
            onDelete={onPostDelete}
          />
        ))}
      </div>
    )
  }
}

class Filter extends Component {
  changeOption(type, e) {
    var val = e.target.value;
    this.props.changeOption(val, type);
  }

/* ToDo: ES6 */
  render() {
    return (
      <div>
        <label>City filter:
          <select onChange={this.changeOption.bind(this, 'city')}>
            {this.props.cityOptions.map(function(option) {
              return ( <option key={option} value={option}>{option}</option> )
            })}
          </select>
        </label>
        <label>Company filter:
          <select onChange={this.changeOption.bind(this, 'company')}>
            {this.props.companyOptions.map(function(option) {
              return ( <option key={option} value={option}>{option}</option> )
            })}
          </select>
        </label>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      posts: postsArray,
      city: '',
      company: ''
    };
  }

  handlePostDelete(postId) {
    this.setState({
      posts: this.state.posts.filter(post => post.id !== postId)
    });
  }

  handleSearch(event) {

    const searchQuery = event.target.value.toLowerCase();

    const displayedPosts = postsArray.filter(function(el) {
        const searchValue = el.title.toLowerCase();
      return searchValue.indexOf(searchQuery) !== -1;
    });

    this.setState({
      posts: displayedPosts
    });
  }

  filterItems(val, type) {
    switch(type) {
      case 'city':
        this.setState({city: val});
        console.info(this.state.city);
        break;
      case 'company':
        this.setState({company: val});
        break;
      default:
        break;
    }
  }

  render() {
    let filteredItems = this.state.posts;

    const state = this.state,
          filterProperties = ["city", "company"];

    filterProperties.forEach(function(filterBy) {
      const filterValue = state[filterBy];
      if (filterValue) {
        filteredItems = filteredItems.filter(function(item) {
          return item[filterBy] === filterValue;
        });
      }
    });

    /* ToDo: ES6*/
    const cityArray = users.map(item => item.address.city),
          companyArray = users.map(item => item.company.name);

    cityArray.unshift('');
    companyArray.unshift('');

    return (
      <div>
        <h1>Posts</h1>
        <nav>
          <Filter
            cityOptions={cityArray}
            companyOptions={companyArray}
            changeOption={this.filterItems.bind(this)}
          />
          <label>Quick search by post title <input type="text" onChange={this.handleSearch.bind(this)}/></label>
          <hr/>
          <label>Sort by: <select></select></label>
        </nav>
        <List
          posts={this.state.posts}
          onPostDelete={this.handlePostDelete}
        />
      </div>
    );
  }
}

export default App;
