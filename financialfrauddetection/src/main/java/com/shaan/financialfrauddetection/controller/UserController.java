package com.shaan.financialfrauddetection.controller;

import com.shaan.financialfrauddetection.model.User;
import com.shaan.financialfrauddetection.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public String loginUser(@RequestParam String username, @RequestParam String password) {
        User user = userService.loginUser(username, password);
        if(user != null) {
            return user.getUserId();
        }
        return null;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{userId}")
    public User getUserById(@PathVariable("userId") String userId) {
        return userService.getUserById(userId).get();
    }
}
