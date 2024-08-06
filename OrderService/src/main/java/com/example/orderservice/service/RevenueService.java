package com.example.orderservice.service;

import com.example.orderservice.dto.response.MonthlyRevenueResponse;
import com.example.orderservice.dto.response.SaleDateResponse;
import com.example.orderservice.repo.OrderCustomerRepository;
import com.example.orderservice.repo.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RevenueService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderCustomerRepository orderCustomerRepository;

    public SaleDateResponse getMonthlyRevenue(int year) {
        List<MonthlyRevenueResponse> orderRevenue = orderRepository.findMonthlyRevenueByYear(year);
        List<MonthlyRevenueResponse> orderCustomerRevenue = orderCustomerRepository.findMonthlyRevenueByYear(year);

        System.out.println("order "+ orderRevenue.toString());
        System.out.println("order customer "+ orderCustomerRevenue.toString());


        return SaleDateResponse.builder()
                .orderRevenue(orderRevenue)
                .orderCustomerRevenue(orderCustomerRevenue)
                .build();
    }
}
