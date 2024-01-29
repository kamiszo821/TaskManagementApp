    package com.polsl.controllers;

    import com.polsl.models.Task;
    import com.polsl.models.Team;
    import com.polsl.repository.TaskRepository;
    import com.polsl.services.TaskService;
    import com.polsl.repository.TeamRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
    import java.util.NoSuchElementException;

    @CrossOrigin(origins = "*", maxAge = 3600)
    @RestController
    @RequestMapping("/api/tasks")
    public class TaskController {
        private final TaskService taskService;
        private final TeamRepository teamRepository;

        private final TaskRepository taskRepository;

        @Autowired
        public TaskController(TaskService taskService, TeamRepository teamRepository, TaskRepository taskRepository) {
            this.taskService = taskService;
            this.teamRepository = teamRepository;
            this.taskRepository = taskRepository;
        }

        @GetMapping("/{teamId}")
        public ResponseEntity<List<Task>> getTasksByTeamId(@PathVariable Long teamId) {
            List<Task> tasks = taskService.getTasksByTeamId(teamId);
            return ResponseEntity.ok(tasks);
        }

        @PostMapping("/{teamId}")
        public ResponseEntity<Task> createTask(@PathVariable Long teamId, @RequestBody Task task) {
            Team team = teamRepository.findById(teamId)
                    .orElseThrow(() -> new NoSuchElementException("Team not found with id: " + teamId));
            task.setTeam(team);
            Task createdTask = taskService.createTask(task);
            return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
        }

        @PutMapping("/{teamId}/{taskId}")
        public ResponseEntity<Task> updateTask(@PathVariable Long teamId, @PathVariable Long taskId, @RequestBody Task task) {
            try {
                Task updatedTask = taskService.updateTask(taskId, teamId, task);
                return new ResponseEntity<>(updatedTask, HttpStatus.OK);
            } catch (NoSuchElementException e) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
            if (!taskService.getTaskById(id).isPresent()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            taskService.deleteTask(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }


