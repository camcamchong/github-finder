import React, {Component, Fragment} from 'react'
import {BrowserRouter as Router,  Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Users from './components/users/Users'
import User from './components/users/User'
import Search from './components/users/Search'
import Alert from './components/layout/Alert'
import About from './components/pages/About'
import './App.css';
import axios from 'axios';


export class App  extends  Component{

  state =  {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert:  null
  } 

  // async componentDidMount(){
    
  //   console.log(process.env.REACT_APP_GITHUB_CLIENT_ID);

  //   this.setState({ loading: true});

  //   const res =  await axios.get('https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}');
  //   this.setState({users: res.data, loading: false});
  // }

searchUsers = async text => {
  this.setState( {loading:true});
  const res =  await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

  this.setState({users: res.data.items, loading:false});
};

getUser = async username =>{
  this.setState({loading:true});
  const res =  await axios.get(`https://api.github.com/users/${username}?&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
  this.setState({user: res.data, loading:false});

};

getUserRepos = async username =>{
  this.setState({loading:true});
  const res =  await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
  this.setState({repos: res.data, loading:false});

};

clearUsers = () =>   this.setState({loading: false, users: []});

setAlert = (message, type) => {
  this.setState({alert: {message:message , type: type} })
  setTimeout(() => this.setState({ alert: null}), 5000);
};

  render(){

    const {users, loading, user,repos} = this.state;

    return (
    <Router>
      <div className="App">
        {/* <Navbar/> */}
        <Navbar title="Github Finder" icon='fab fa-github' />
        <div className="container">

          <Alert alert={this.state.alert}/>
          <Switch>
            <Route exact path="/" render = {props =>(
              <Fragment>
                <Search searchUsers = {this.searchUsers} clearUsers= {this.clearUsers} showClear = { users.length > 0 ? true : false} setAlert ={this.setAlert}/> 
                <Users loading ={loading} users={users}/>
              </Fragment>
            )}>
            </Route>

            <Route exact path="/about" component={About}></Route>

            <Route exact path="/user/:login" 
              render={props => (
                  <User  { ...props } getUser={this.getUser} getUserRepos={this.getUserRepos} user={user} loading={loading} repos={repos}/>
              )} />
          

          </Switch>

         
        </div>

      </div>
    </Router>
    );
  }
}

export default App;
