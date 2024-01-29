package com.polsl.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "task")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("Id")
    private Long id;

    @Column(nullable = true)
    @JsonProperty("Title")
    private String Title;

    @JsonProperty("Status")
    @Column(nullable = true)
    private String Status;

    @JsonProperty("Summary")
    @Column(nullable = true)
    private String Summary;

    @JsonProperty("Type")
    @Column(nullable = true)
    private String Type;

    @JsonProperty("Priority")
    @Column(nullable = true)
    private String Priority;

    @JsonProperty("Estimate")
    @Column(nullable = true)
    private Double Estimate;

    @JsonProperty("Assignee")
    @Column(nullable = true)
    private String Assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    @JsonBackReference
    private Team team;
}

