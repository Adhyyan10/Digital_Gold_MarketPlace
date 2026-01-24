package com.example.goldmarket.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" }, allowCredentials = "true")
public class ChatController {

    @GetMapping("/recommendation")
    public ResponseEntity<?> getRecommendation() {
        return ResponseEntity.ok(Map.of(
            "recommendation", "Based on current market trends, it's a good time to accumulate gold. The price is stable with a bullish outlook.",
            "action", "BUY",
            "confidence", "High"
        ));
    }
}
