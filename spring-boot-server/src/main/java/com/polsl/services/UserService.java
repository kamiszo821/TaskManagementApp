package com.polsl.services;

import com.polsl.models.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getCurrentUser();
    public boolean changeUserRoles(Long userId, List<String> newRoles);
    public List<User> getUsersByTeamId(Long teamId);
}

