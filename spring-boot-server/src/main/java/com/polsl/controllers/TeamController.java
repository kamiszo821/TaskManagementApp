package com.polsl.controllers;

import com.polsl.payload.request.AssignTeamRequest;
import com.polsl.dto.TeamDTO;
import com.polsl.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams")
public class TeamController {
    @Autowired
    private TeamService teamService;

    @GetMapping
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable Long id) {
        return ResponseEntity.of(teamService.getTeamById(id));
    }

    @PostMapping
    public ResponseEntity<TeamDTO> createTeam(@RequestBody TeamDTO teamDto) {
        if (teamDto.getUserNames() == null) {
            teamDto.setUserNames(new ArrayList<>());
        }
        return ResponseEntity.ok(teamService.createTeam(teamDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamDTO> updateTeam(@PathVariable Long id, @RequestBody TeamDTO teamDto) {
        teamDto.setId(id);
        return ResponseEntity.ok(teamService.updateTeam(teamDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/assign")
    public ResponseEntity<String> assignUserToTeam(@RequestBody AssignTeamRequest assignTeamRequest) {
        Long userId = assignTeamRequest.getUserId();
        Long teamId = assignTeamRequest.getTeamId();

        boolean isAssigned = teamService.assignUserToTeam(userId, teamId);

        if (isAssigned) {
            return ResponseEntity.ok("User has been assigned to the team successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to assign user to the team.");
        }
    }

    @GetMapping("/teams-with-users")
    public ResponseEntity<List<TeamDTO>> getAllTeamsWithUsers() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

}
