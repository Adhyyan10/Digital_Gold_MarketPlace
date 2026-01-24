package com.example.goldmarket.controller;

import com.example.goldmarket.model.Transaction;
import com.example.goldmarket.model.Wallet;
import com.example.goldmarket.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trade")
public class TradeController {

    private final UserService userService;

    public TradeController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/wallet")
    public Wallet getWallet(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        return userService.getWallet(email);
    }

    @GetMapping("/history")
    public List<Transaction> getHistory(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        return userService.getHistory(email);
    }

    @PostMapping("/execute")
    public Transaction executeTrade(@AuthenticationPrincipal OAuth2User principal, @RequestBody Map<String, String> payload) {
        String email = principal.getAttribute("email");
        String type = payload.get("type");
        String symbol = payload.get("symbol");
        BigDecimal amount = new BigDecimal(payload.get("amount"));
        
        return userService.trade(email, type, symbol, amount);
    }
}
