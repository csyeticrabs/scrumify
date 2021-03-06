import { Component } from 'react';
import React from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';

// New Page for Add and Delete Task

const TaskModifier = (props) => {
  return (
    <section className="mt-5">
      <div class="input-group input-group-md">
        <input
          type="text"
          class="form-control"
          aria-label="Text input with dropdown button"
          name="description"
          aria-describedby="inputGroup-sizing-md"
          onChange={props.handleSetTask}
          placeholder="Create a New Task"
        />

        <Dropdown onSelect={props.handleSelectUser}>
          <Dropdown.Toggle variant="warning" id="dropdown-basic">
            {props.data.currentUser.name}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {props.data.users.map((user, index) => {
              return (
                <Dropdown.Item
                  href={`#action/action-${index}`}
                  eventKey={JSON.stringify(user)}
                >
                  {user.name}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Button
          variant="primary"
          type="submit"
          onClick={(e) => props.addTask(e)}
        >
          Add Me!
        </Button>
      </div>

      <div className="allTasks mt-5">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Description</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {props.data.tasks.map((task) => (
              <tr className="task">
                <td>{task.description}</td>
                <td>
                  Status:
                  {task.completed === false ? ' In Progress' : ' Completed'}
                </td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => props.updateTask(task._id)}
                  >
                    Mark as Complete
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => props.deleteTask(task._id)}
                  >
                    Delete this Task
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TaskModifier;
