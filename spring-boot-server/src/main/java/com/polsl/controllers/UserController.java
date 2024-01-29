package com.polsl.controllers;

import com.polsl.payload.response.MessageResponse;
import com.polsl.dto.UserDTO;
import com.polsl.models.User;
import com.polsl.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class UserController {
    @Autowired
    private UserService userService;
    @GetMapping("/users")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public List<UserDTO> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    @GetMapping("/current-user")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public UserDTO getCurrentUser() {
        Optional<User> optionalUser = userService.getCurrentUser();

        if (optionalUser.isPresent()) {
            return convertToDTO(optionalUser.get());
        } else {
            return null;
        }
    }
    @PutMapping("/change-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> changeUserRoles(@RequestBody Map<String, Object> request) {
        Long userId = Long.parseLong(request.get("userId").toString());
        List<String> newRoles = (List<String>) request.get("newRole");

        boolean isChanged = userService.changeUserRoles(userId, newRoles);

        if (isChanged) {
            return ResponseEntity.ok(new MessageResponse("User roles changed successfully!"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Cannot change user roles!"));
        }
    }
    @GetMapping("/users/{teamId}")
    public ResponseEntity<List<UserDTO>> getUsersByTeamId(@PathVariable Long teamId) {
        List<User> users = userService.getUsersByTeamId(teamId);
        if (users.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<UserDTO> userDTOs = users.stream()
                .collect(Collectors.collectingAndThen(
                        Collectors.toMap(User::getId, Function.identity(), (existing, replacement) -> existing),
                        map -> new ArrayList<>(map.values())
                ))
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new ResponseEntity<>(userDTOs, HttpStatus.OK);
    }
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRoles().stream().map(role -> role.getName().name()).collect(Collectors.toSet())
        );
    }
}


