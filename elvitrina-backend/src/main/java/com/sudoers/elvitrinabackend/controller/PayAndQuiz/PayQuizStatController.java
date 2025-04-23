package com.sudoers.elvitrinabackend.controller.PayAndQuiz;

import com.sudoers.elvitrinabackend.model.entity.Payment;
import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.model.enums.OrderStatusType;
import com.sudoers.elvitrinabackend.model.enums.PaymentMethodType;
import com.sudoers.elvitrinabackend.repository.CustomOrderRepository;
import com.sudoers.elvitrinabackend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:4200")
public class PayQuizStatController {

    @Autowired
    private CustomOrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/overview")
    public Map<String, Object> getOverview() {
        long totalOrders = orderRepository.count();
        long totalPayments = paymentRepository.count();
        double totalRevenue = paymentRepository.findAll()
                .stream().mapToDouble(Payment::getAmount).sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", totalOrders);
        stats.put("totalPayments", totalPayments);
        stats.put("totalRevenue", totalRevenue);

        return stats;
    }

    @GetMapping("/orders/by-status")
    public Map<OrderStatusType, Long> getOrdersByStatus(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        List<CustomOrder> orders;

        if (year != null && month != null) {
            LocalDate start = YearMonth.of(year, month).atDay(1);
            LocalDate end = YearMonth.of(year, month).atEndOfMonth();
            // Utiliser orderDate au lieu de createdAt
            orders = orderRepository.findByOrderDateBetween(start.atStartOfDay(), end.atTime(23, 59));
        } else {
            orders = orderRepository.findAll();
        }

        return orders.stream()
                .collect(Collectors.groupingBy(CustomOrder::getStatus, Collectors.counting()));
    }

    @GetMapping("/payments/by-method")
    public Map<PaymentMethodType, Long> getPaymentsByMethod(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        List<Payment> payments;

        if (year != null && month != null) {
            LocalDate start = YearMonth.of(year, month).atDay(1);
            LocalDate end = YearMonth.of(year, month).atEndOfMonth();
            payments = paymentRepository.findByTransactionDateBetween(start.atStartOfDay(), end.atTime(23, 59));
        } else {
            payments = paymentRepository.findAll();
        }

        return payments.stream()
                .collect(Collectors.groupingBy(Payment::getMethod, Collectors.counting()));
    }

    @GetMapping("/overview/by-month")
    public Map<String, Object> getOverviewByMonth(
            @RequestParam int year,
            @RequestParam int month
    ) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        List<CustomOrder> monthlyOrders = orderRepository.findByOrderDateBetween(start.atStartOfDay(), end.atTime(23, 59));
        List<Payment> monthlyPayments = paymentRepository.findByTransactionDateBetween(start.atStartOfDay(), end.atTime(23, 59));

        long totalOrders = monthlyOrders.size();
        long totalPayments = monthlyPayments.size();
        double totalRevenue = monthlyPayments.stream().mapToDouble(Payment::getAmount).sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", totalOrders);
        stats.put("totalPayments", totalPayments);
        stats.put("totalRevenue", totalRevenue);

        return stats;
    }

    @GetMapping("/orders/by-status/by-month")
    public Map<OrderStatusType, Long> getOrdersByStatusByMonth(
            @RequestParam int year,
            @RequestParam int month
    ) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        // Remplacer 'createdAt' par 'orderDate'
        List<CustomOrder> monthlyOrders = orderRepository.findByOrderDateBetween(start.atStartOfDay(), end.atTime(23, 59));

        return monthlyOrders.stream()
                .collect(Collectors.groupingBy(CustomOrder::getStatus, Collectors.counting()));
    }

    @GetMapping("/payments/by-method/by-month")
    public Map<PaymentMethodType, Long> getPaymentsByMethodByMonth(
            @RequestParam int year,
            @RequestParam int month
    ) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        List<Payment> monthlyPayments = paymentRepository.findByTransactionDateBetween(start.atStartOfDay(), end.atTime(23, 59));

        return monthlyPayments.stream()
                .collect(Collectors.groupingBy(Payment::getMethod, Collectors.counting()));
    }
}
