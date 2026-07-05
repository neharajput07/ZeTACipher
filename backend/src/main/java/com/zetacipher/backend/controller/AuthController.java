package com.zetacipher.backend.controller;

import com.zetacipher.backend.model.User;
import com.zetacipher.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null || username.isEmpty() || password.isEmpty()) {
            return Map.of("status", "error", "message", "Username and password are required");
        }

        if (userRepository.findByUsername(username).isPresent()) {
            return Map.of("status", "error", "message", "Username already exists");
        }

        userRepository.save(new User(username, password));
        return Map.of("status", "success", "message", "Account created successfully");
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        Optional<User> user = userRepository.findByUsername(username);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return Map.of("status", "success", "message", "Login successful", "username", username);
        }

        return Map.of("status", "error", "message", "Invalid username or password");
    }
}