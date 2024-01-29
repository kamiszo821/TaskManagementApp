package com.polsl.repository;

import com.polsl.models.GanttTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GanttTaskRepository extends JpaRepository<GanttTask, Long> {
    List<GanttTask> findByTeamId(Long teamId);
    Optional<GanttTask> findByIdAndTeam_Id(Long id, Long teamId);
    void deleteById(Long id);
}
