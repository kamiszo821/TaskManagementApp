package com.polsl.services;

import com.polsl.models.ERole;
import com.polsl.models.Role;
import com.polsl.models.User;
import com.polsl.repository.RoleRepository;
import com.polsl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    @Override
    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        return userRepository.findByUsername(currentUserName);
    }
    @Override
    public boolean changeUserRoles(Long userId, List<String> newRoles) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Set<Role> roles = new HashSet<>();

            for (String newRole : newRoles) {
                Optional<Role> optionalRole = roleRepository.findByName(ERole.valueOf(newRole));
                if (optionalRole.isPresent()) {
                    roles.add(optionalRole.get());
                } else {
                    return false; // Role does not exist
                }
            }
            user.setRoles(roles);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public List<User> getUsersByTeamId(Long teamId) {
        return userRepository.findByTeamsId(teamId);
    }

}

