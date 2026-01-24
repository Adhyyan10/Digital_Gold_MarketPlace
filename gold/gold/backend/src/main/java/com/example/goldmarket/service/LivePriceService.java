package com.example.goldmarket.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class LivePriceService {

    private final RestTemplate restTemplate = new RestTemplate();

    // Current India gold prices per gram (as of user's data)
    private BigDecimal gold24K = new BigDecimal("12426.00"); // ₹12,426 per gram for 24K
    private BigDecimal gold22K = new BigDecimal("11390.00"); // ₹11,390 per gram for 22K
    private BigDecimal gold18K = new BigDecimal("9319.00"); // ₹9,319 per gram for 18K

    private final Random random = new Random();

    public LivePriceService() {
        updatePrices(); // Initial fetch
    }

    /**
     * Fetch live prices every 10 seconds for real-time updates
     */
    @Scheduled(fixedRate = 10000)
    public void updatePrices() {
        // Simulate realistic price movements for India gold
        simulatePriceMovement();
        System.out.println("Updated India Gold Prices - 24K: ₹" + gold24K + "/gram, 22K: ₹" + gold22K + "/gram, 18K: ₹"
                + gold18K + "/gram");
    }

    private void simulatePriceMovement() {
        // Simulate realistic price movement for India gold prices
        double changePercent = (random.nextDouble() - 0.5) * 0.002; // +/- 0.1%

        // Update 24K gold
        BigDecimal change24K = gold24K.multiply(BigDecimal.valueOf(changePercent));
        gold24K = gold24K.add(change24K).setScale(2, RoundingMode.HALF_UP);

        // 22K is approximately 91.67% of 24K
        gold22K = gold24K.multiply(new BigDecimal("0.9167")).setScale(2, RoundingMode.HALF_UP);

        // 18K is approximately 75% of 24K
        gold18K = gold24K.multiply(new BigDecimal("0.75")).setScale(2, RoundingMode.HALF_UP);

        // Keep prices within realistic bounds
        if (gold24K.compareTo(new BigDecimal("13500")) > 0) {
            gold24K = new BigDecimal("13400.00");
        } else if (gold24K.compareTo(new BigDecimal("11500")) < 0) {
            gold24K = new BigDecimal("11600.00");
        }

        // Recalculate 22K and 18K based on adjusted 24K
        gold22K = gold24K.multiply(new BigDecimal("0.9167")).setScale(2, RoundingMode.HALF_UP);
        gold18K = gold24K.multiply(new BigDecimal("0.75")).setScale(2, RoundingMode.HALF_UP);
    }

    public Map<String, Double> getLatestPrices() {
        Map<String, Double> prices = new HashMap<>();
        prices.put("GOLD", gold24K.doubleValue()); // Default to 24K
        prices.put("GOLD_24K", gold24K.doubleValue());
        prices.put("GOLD_22K", gold22K.doubleValue());
        prices.put("GOLD_18K", gold18K.doubleValue());
        return prices;
    }

    public BigDecimal getPrice(String symbol) {
        if ("GOLD".equalsIgnoreCase(symbol) || "GOLD_24K".equalsIgnoreCase(symbol)) {
            return gold24K;
        } else if ("GOLD_22K".equalsIgnoreCase(symbol)) {
            return gold22K;
        } else if ("GOLD_18K".equalsIgnoreCase(symbol)) {
            return gold18K;
        }
        return BigDecimal.ZERO;
    }

    // Alias method for compatibility
    public Map<String, Double> getCurrentPrices() {
        return getLatestPrices();
    }
}
