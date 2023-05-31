# Action to create linear task

### Inputs

- `team_name` : Name of the team for which the task should be created
- `pr_name` : Name of the PR the task is being created for
- `key` : Api access key from linear

### Outputs

- `task_id` : The id of the task that was created

## Usage

```
 steps:
      - name: create task
        id: task
        uses: opera-gaming/linear-task-action@main
        with:
          team_name: "foo"
          title: "bar"
          key: ${{secrets.LINEAR_API_KEY}}
      - name: Get the task id
        run: echo "The task is ${{ steps.task.outputs.task_id }}"
```
