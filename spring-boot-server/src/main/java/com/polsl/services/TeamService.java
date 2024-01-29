package com.polsl.services;

import java.util.List;
import java.util.stream.Collectors;

import com.polsl.dto.TeamDTO;
import com.polsl.models.Team;
import com.polsl.models.User;
import com.polsl.repository.TeamRepository;
import com.polsl.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    public boolean assignUserToTeam(Long userId, Long teamId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Team> teamOptional = teamRepository.findById(teamId);

        if (userOptional.isPresent() && teamOptional.isPresent()) {
            User user = userOptional.get();
            Team team = teamOptional.get();

            team.getUsers().add(user);
            user.getTeams().add(team);

            teamRepository.save(team);
            userRepository.save(user);

            return true;
        }
        return false;
    }

    public List<TeamDTO> getAllTeams() {
        List<Team> teams = teamRepository.findAll();
        return teams.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public Optional<TeamDTO> getTeamById(Long id) {
        return teamRepository.findById(id).map(this::convertToDto);
    }

    public TeamDTO createTeam(TeamDTO teamDto) {
        Team team = convertToEntity(teamDto);
        Team savedTeam = teamRepository.save(team);
        return convertToDto(savedTeam);
    }

    public TeamDTO updateTeam(TeamDTO teamDto) {
        Team existingTeam = teamRepository.findById(teamDto.getId())
                .orElseThrow(() -> new RuntimeException("Team not found"));
        existingTeam.setName(teamDto.getName());
        Team updatedTeam = teamRepository.save(existingTeam);
        return convertToDto(updatedTeam);
    }


    //public void deleteTeam(Long id) {
        //teamRepository.deleteById(id);
    //}


    public void deleteTeam(Long id) {
        Optional<Team> optionalTeam = teamRepository.findById(id);
        if (optionalTeam.isPresent()) {
            Team team = optionalTeam.get();
            team.getTasks().clear();
            team.getGanttTasks().clear();
            teamRepository.save(team);
            teamRepository.delete(team);
        } else {
            throw new RuntimeException();
        }
    }



    private TeamDTO convertToDto(Team team) {
        TeamDTO teamDto = new TeamDTO();
        teamDto.setId(team.getId());
        teamDto.setName(team.getName());
        teamDto.setUserNames(team.getUsers().stream().map(User::getUsername).distinct().collect(Collectors.toList()));
        return teamDto;
    }
    private Team convertToEntity(TeamDTO teamDto) {
        Team team = new Team();
        team.setId(teamDto.getId());
        team.setName(teamDto.getName());
        return team;
    }

 }



