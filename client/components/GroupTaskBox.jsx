import React, {Fragment} from 'react';

const GroupTaskBox = (props) => {
  const taskList = props.data.tasks.filter(task => {
    return task.completed === false
  })
  return (
    <Fragment>
        <table class="table table-hover my-2">
          <thead>
            <tr>
              <th scope="col">Description</th>
              <th scope="col">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {taskList.map((task) => 
              (
                <tr className="task">
                  <td>{task.description}</td>
                  {/* <td>
                    Status:
                    {task.completed === false ? ' In Progress' : ' Completed'}
                  </td> */}
                  <td>{task.name === null ? 'Unassigned' : task.name}</td>
                  
                </tr>
              )
            )}
          </tbody>
        </table>
    </Fragment>
  )
}

export default GroupTaskBox;