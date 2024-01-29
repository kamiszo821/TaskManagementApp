package com.polsl.controllers;

import com.polsl.models.GanttTask;
import com.polsl.models.Team;
import com.polsl.repository.GanttTaskRepository;
import com.polsl.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/gantt")
public class GanttTaskController {
    @Autowired
    private GanttTaskRepository ganttTaskRepository;
    @Autowired
    private TeamRepository teamRepository;
    @GetMapping("/{teamId}")
    public List<GanttTask> findAllGanttTasksByTeamId(@PathVariable Long teamId) {
        return ganttTaskRepository.findByTeamId(teamId);
    }
    @PostMapping("/{id}")
    public GanttTask createTask(@PathVariable Long id, @RequestParam(required = false) Long teamId, @RequestBody GanttTask ganttTask) {
        ganttTask.setId(id);

        if (teamId != null) {
            Team team = teamRepository.findById(teamId)
                    .orElseThrow(() -> new NoSuchElementException("Team not found with id: " + teamId));
            ganttTask.setTeam(team);
        }

        return ganttTaskRepository.save(ganttTask);
    }
    @PutMapping("/{taskId}/{teamId}")
    public ResponseEntity<GanttTask> updateTask(@PathVariable Long taskId, @PathVariable Long teamId, @RequestBody GanttTask updatedTask) {
        Optional<GanttTask> existingTaskOptional = ganttTaskRepository.findByIdAndTeam_Id(taskId, teamId);
        if (existingTaskOptional.isPresent()) {
            GanttTask existingTask = existingTaskOptional.get();
            existingTask.setData(updatedTask.getData());
            GanttTask savedTask = ganttTaskRepository.save(existingTask);
            return new ResponseEntity<>(savedTask, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/{id}/{teamId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, @PathVariable Long teamId) {
        Optional<GanttTask> taskOptional = ganttTaskRepository.findByIdAndTeam_Id(id, teamId);
        if (taskOptional.isPresent()) {
            ganttTaskRepository.delete(taskOptional.get());
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Task not found with id: " + id + " and teamId: " + teamId, HttpStatus.NOT_FOUND);
        }
    }
}
