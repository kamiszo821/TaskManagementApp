package com.polsl.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.*;

@Entity
@Table(name = "gantt_task",uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id", "team_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GanttTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uniqueId;

    private Long id;
    @Column(name = "json")
    private String data;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id",updatable = false)
    @JsonIgnore
    private Team team;
}



