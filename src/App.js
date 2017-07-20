import React, { Component } from 'react';
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
            key={post.id}
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
  changeOption(type, element) {
    const val = element.target.value;
    this.props.changeOption(val, type);
  }

  changeFilter(){
    this.props.changeFilter();
  }

  render() {
    return (
      <div>
        <label>City filter:
          <select
            onChange={this.changeOption.bind(this, 'city')}
            onClick={this.changeFilter.bind(this)}
          >
            {this.props.cityOptions.map((option, value) =>
              ( <option key={value} value={option}>{option}</option> )
            )}
          </select>
        </label>
        <label>Company filter:
          <select
            onChange={this.changeOption.bind(this, 'company')}
            onClick={this.changeFilter.bind(this)}
          >
            {this.props.companyOptions.map((option, value) =>
              ( <option key={value} value={option}>{option}</option> )
            )}
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
      users: users,
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

    const displayedPosts = postsArray.filter(el =>
      el.title.toLowerCase().indexOf(searchQuery) !== -1
    );

    this.setState({
      posts: displayedPosts
    });
  }

  checked(event) {
    this.setState({
      multiple: event.target.value
    });
  }

  filterItems(val, type) {
    switch(type) {
      case 'city':
        this.setState({city: val});
        break;
      case 'company':
        this.setState({company: val});
        break;
      default:
        break;
    }
  }

  filterPosts() {

    let filteredItems = this.state.users;
    const state = this.state,
          filterProperties = ['city', 'company'];

    filterProperties.forEach(function(filterBy) {
      const filterValue = state[filterBy];

      if (filterValue) {
        filteredItems = filteredItems.filter(element =>
          filterBy === 'city' ?
          element.address[filterBy] === filterValue :
          element[filterBy].name === filterValue
        )
      }
    });


    let showPosts;

    for (let i = 0; i < filteredItems.length; i++) {
      showPosts = this.state.posts.filter(item =>
        item.userId === filteredItems[i].id
      )

      showPosts = [...new Set([...showPosts])];
    }

    this.setState({
      posts: showPosts
    });

  }

  render() {
    const cityArray = users.map(item => item.address.city),
          companyArray = users.map(item => item.company.name),
          idArray = users.map(item => item.id);

    cityArray.unshift('');
    companyArray.unshift('');

    return (
      <div>
        <h1>Posts</h1>
        <nav>
          <Filter
            cityOptions={cityArray}
            companyOptions={companyArray}
            key={idArray}
            changeOption={this.filterItems.bind(this)}
            changeFilter={this.filterPosts.bind(this)}
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
