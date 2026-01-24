package com.example.goldmarket.controller;

import com.example.goldmarket.service.LivePriceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/market")
public class MarketController {

    private final LivePriceService livePriceService;

    public MarketController(LivePriceService livePriceService) {
        this.livePriceService = livePriceService;
    }

    @GetMapping("/prices")
    public Map<String, Double> getPrices() {
        return livePriceService.getCurrentPrices();
    }
}
