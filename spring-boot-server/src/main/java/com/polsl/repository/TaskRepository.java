package com.polsl.repository;

import com.polsl.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface TaskRepository extends JpaRepository<Task, Long> {
    Optional<Task> findById(Long id);
    List<Task> findByTeamId(Long teamId);
    Optional<Task> findByIdAndTeamId(Long taskId, Long teamId);
}




