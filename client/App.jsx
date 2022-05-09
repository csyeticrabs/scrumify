import React, { Component, useState, useEffect, Fragment } from 'react';
import MainContainer from './components/MainContainer.jsx';
import TaskModifier from './components/TaskModifier.jsx';
import MyNav from './components/MyNav.jsx';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Class/Constructor version
class App extends Component {
  constructor(props) {
    super(props);
    //should get data from all current users and tasks (as arrays of objects)
    this.state = {
      users: [],
      tasks: [],
      // currentTaskId: 0,
      currentTaskDescription: 'get this fucking app working',
      // currentTaskWorkerId: 0,
      // currentTaskStatus: false //put/patch update request status from
      currentUser: {name: 'Select User', id: 0},
      userReady: false,
      
    };
    this.getAllInfo = this.getAllInfo.bind(this);
    this.handleSetTask = this.handleSetTask.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    // this.editTask = this.editTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserTasks = this.getUserTasks.bind(this)
  }

  //wrap this in useEffect?
  //get all users/tasks info on initial render from db to update state
  componentDidMount() {
    this.getAllInfo();
    this.getAllUsers();
    
  }
  //get all users/task info every time a component updates? idk if this makes sense
  componentDidUpdate() {
    // this.getAllInfo();
  }

  //Get all users 
  // getAllUsers() {
  //   fetch('/users')
  //   .then(res => res.json())
  //   .then(data => console.log(data))
  // }

  getUserTasks() {
    console.log('USERS BEFORE SETTING STATE', this.state.users)
    const copyOfUsers = [...this.state.users]; 
    for(let i = 0; i < copyOfUsers.length; ++i) {
      const userTasks = [];
      for(let j = 0; j < this.state.tasks.length; ++j) {
        if(copyOfUsers[i]._id === Number(this.state.tasks[j].worker_id)) userTasks.push(this.state.tasks[j]);
        copyOfUsers[i].totalTasks = userTasks;
        }
      }
    this.setState(prevState => {
      return {
        ...prevState,
        users: copyOfUsers,
        userReady: true,
      }
    })
    console.log('after setting user tasks', this.state.users);
  }
  
  getAllUsers() {
    fetch('/users', )
    .then(res => res.json())
    .then((allUsers) => {
      this.setState(prevState => {
        return {
          ...prevState,
          users: allUsers,
      }})
    }).then(() => {
      this.getUserTasks();
    })
    .catch((err) => {
      console.log(`Error fetching user data! Error: ${err}`)
    })
  }

  // Get all tasks info from database
  getAllInfo() {
    fetch('/api', {
      method: 'GET',
    })
      .then((data) => data.json())
      .then((allTasks) => {
        this.setState({
          ...this.state,
          tasks: allTasks,
        });
      })
      .catch((err) => {
        console.log(`Error fetching all task and user data! Error: ${err}`);
      });
  }


  handleSetTask(e) {
    return this.setState({
      ...this.state,
      currentTaskDescription: e.target.value,
    });
  }

  handleSelect(e) {
    return this.setState({
      ...this.state,
      currentUser: JSON.parse(e),
    });
  }

  updateTask(id) {
    fetch('/api', {
      method: 'PUT',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify({ _id: id }),
    })
      .then((data) => data.json())
      .then(() => {
        this.setState((prevState) => {
          return {
            ...prevState,
            tasks: prevState.tasks.map(task => task._id === id ? {...task, completed: true} : {...task}
            )
            // tasks: prevState.tasks.reduce((acc, curr) => {
            //   if (curr._id === id) curr.completed = true;
            //   acc.push(curr);
            //   return acc;
            // }, []),
          };
        });
      })
      .catch((err) => {
        console.log(`Error fetching putting task! Error: ${err}`);
      });
  }

  // Method to add a task to our board.
  addTask(event) {
    event.preventDefault();

    const newTask = {
      description: this.state.currentTaskDescription,
      completed: false, //hardcoded default status
      worker_id: this.state.currentUser._id, //hardcoded default # "nice" - Tony
    };
    // sending the new task to the db
    // expecting to receive nothing back?
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify(newTask),
    })
      .then(() => {
        // if you use a callback inside setState the parameter or whatever you name it will always be the previousState.
        this.setState((prevState) => {
          return {
            ...prevState,
            tasks: [newTask, ...prevState.tasks],
          };
        });
      })
      .catch((err) => {
        console.log(`Error adding a new task!: ${err}`);
      });
  }
  
  //Delete task with the same ID as parameter
  deleteTask(id) {
    fetch('/api', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify({ _id: id }),
    })
      .then(() => {
        this.setState((prevState) => {
          return {
            ...this.state,
            tasks: prevState.tasks.filter((task) => task._id !== id),
          };
        });
      })
      .catch((err) => {
        console.log(`Error fetching deleting task! Error: ${err}`);
      });
  }

  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <MyNav />
          <div className="container">
            <Routes>
           {this.state.userReady && (
              <Route
                path="/"
                element={
                  <MainContainer
                    // getAllInfo={this.getAllInfo}
                    // editTask = {this.editTask}
                    // addTask={this.addTask}
                    // handleSetTask={this.handleSetTask}
                    // deleteTask={this.deleteTask}
                    data={this.state}
                    // users={this.getAllUsers}
                    
                  />
                }
              ></Route>
              )}
              {this.state.tasks.length > 0 && this.state.users.length > 0  && (
                <Route
                  path="/mytask"
                  element={
                    <TaskModifier
                      getAllInfo={this.getAllInfo}
                      //  editTask = {this.editTask}
                      addTask={this.addTask}
                      handleSetTask={this.handleSetTask}
                      deleteTask={this.deleteTask}
                      data={this.state}
                      updateTask={this.updateTask}
                      handleSelect={this.handleSelect}

                    />
                  }
                ></Route>
              )}
            </Routes>
          </div>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
