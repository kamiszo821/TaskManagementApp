package com.polsl.services;


import com.polsl.models.Task;
import com.polsl.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Optional<Task> getTaskByIdAndTeamId(Long taskId, Long teamId) {
        return taskRepository.findByIdAndTeamId(taskId, teamId);
    }

    public List<Task> getTasksByTeamId(Long teamId) {
        return taskRepository.findByTeamId(teamId);
    }
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Long taskId, Long teamId, Task updatedTask) {
        Optional<Task> existingTaskOpt = taskRepository.findByIdAndTeamId(taskId, teamId);
        if (existingTaskOpt.isPresent()) {
            Task existingTask = existingTaskOpt.get();

            existingTask.setTitle(updatedTask.getTitle());
            existingTask.setStatus(updatedTask.getStatus());
            existingTask.setSummary(updatedTask.getSummary());
            existingTask.setType(updatedTask.getType());
            existingTask.setPriority(updatedTask.getPriority());
            existingTask.setEstimate(updatedTask.getEstimate());
            existingTask.setAssignee(updatedTask.getAssignee());

            return taskRepository.save(existingTask);
        } else {
            throw new NoSuchElementException("Task not found with id: " + taskId + " and teamId: " + teamId);
        }
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}


