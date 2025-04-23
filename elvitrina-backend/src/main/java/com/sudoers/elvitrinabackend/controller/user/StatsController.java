package com.sudoers.elvitrinabackend.controller.user;

import com.sudoers.elvitrinabackend.model.dto.ProductCardDTO;
import com.sudoers.elvitrinabackend.model.dto.RecentActivityDTO;
import com.sudoers.elvitrinabackend.model.dto.TopUserDTO;
import com.sudoers.elvitrinabackend.repository.DonationRepository;
import com.sudoers.elvitrinabackend.repository.ProductRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import com.sudoers.elvitrinabackend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final DonationRepository donationRepository;
    private final UserService userService;

    @GetMapping("/top-products")
    public List<ProductCardDTO> getTopProducts() {
        return productRepository.findTop4ByOrderByCreatedAtDesc()
                .stream()
                .map(product -> new ProductCardDTO(
                        product.getProductId(),
                        product.getProductName(),
                        product.getPrice(),
                        (product.getImages() != null && !product.getImages().isEmpty()) ? product.getImages().get(0) : ""
                ))
                .toList();
    }

    @GetMapping("/monthly-new-users")
    public Map<Integer, Long> getMonthlyNewUsers() {
        List<Object[]> results = userRepository.countNewUsersPerMonth();
        Map<Integer, Long> monthlyData = new HashMap<>();

        for (Object[] result : results) {
            Integer month = (Integer) result[0];
            Long count = (Long) result[1];
            monthlyData.put(month, count);
        }

        return monthlyData;
    }

    @GetMapping("/yearly-donations")
    public Map<Integer, Double> getYearlyDonations() {
        List<Object[]> results = donationRepository.sumDonationsPerYear();
        Map<Integer, Double> yearlyData = new HashMap<>();

        for (Object[] result : results) {
            Integer year = (Integer) result[0];
            Double total = (Double) result[1];
            yearlyData.put(year, total);
        }

        return yearlyData;
    }

    @GetMapping("/products-added-monthly")
    public Map<Integer, Long> getProductsAddedMonthly() {
        List<Object[]> results = productRepository.countProductsAddedPerMonth();
        Map<Integer, Long> monthlyData = new HashMap<>();

        for (Object[] result : results) {
            Integer month = (Integer) result[0];
            Long count = (Long) result[1];
            monthlyData.put(month, count);
        }

        return monthlyData;
    }

    @GetMapping("/top-users")
    public List<TopUserDTO> getTopUsers() {
        return userRepository.findTopUsersByPoints()
                .stream()
                .map(user -> TopUserDTO.builder()
                        .id(user.getId())
                        .firstname(user.getFirstname())
                        .lastname(user.getLastname())
                        .email(user.getEmail())
                        .points(user.getPoints())
                        .image(user.getImage())
                        .build())
                .collect(Collectors.toList());
    }

    @GetMapping("/recent")
    public List<RecentActivityDTO> getRecentActivities() {
        return userService.getRecentActivities();
    }

}
