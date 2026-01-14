package com.example.goldmarket.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/hello")
    public Map<String, String> hello() {
        System.out.println("TEST CONTROLLER: /api/test/hello was called!");
        return Map.of("message", "Hello from Spring Boot!", "status", "working");
    }

    @GetMapping("/ping")
    public Map<String, String> ping() {
        System.out.println("TEST CONTROLLER: /api/test/ping was called!");
        return Map.of("status", "ok", "message", "Test controller is working");
    }
}
