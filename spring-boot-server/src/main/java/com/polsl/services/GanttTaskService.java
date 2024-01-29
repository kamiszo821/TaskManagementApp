package com.polsl.services;

import com.polsl.models.GanttTask;
import com.polsl.repository.GanttTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GanttTaskService {
    @Autowired
    private GanttTaskRepository ganttTaskRepository;

    public List<GanttTask> findAllGanttTasks() {
        return ganttTaskRepository.findAll();
    }

    public List<GanttTask> findAllGanttTasksByTeamId(Long teamId) {
        return ganttTaskRepository.findByTeamId(teamId);
    }
    public Optional<GanttTask> findGanttTaskById(Long id) {
        return ganttTaskRepository.findById(id);
    }

    public GanttTask saveGanttTask(GanttTask ganttTask) {
        return ganttTaskRepository.save(ganttTask);
    }

    public void deleteGanttTask(Long id) {
        ganttTaskRepository.deleteById(id);
    }

    public List<GanttTask> findGanttTasksByTeamId(Long teamId) {
        return ganttTaskRepository.findByTeamId(teamId);
    }
}
