package com.example.orderservice.service;

import com.example.orderservice.dto.request.CreateOrderRequest;
import com.example.orderservice.dto.request.UpdateOrderRequest;
import com.example.orderservice.dto.response.OrderResponse;
import com.example.orderservice.exception.AppException;
import com.example.orderservice.exception.ErrorCode;
import com.example.orderservice.mapper.OrderMapper;
import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderItem;
import com.example.orderservice.repo.OrderItemRepository;
import com.example.orderservice.repo.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemService orderItemService;


    @Autowired
    private OrderMapper orderMapper;


    public OrderResponse create(CreateOrderRequest request){
        Order order = orderMapper.toOrder(request);

        order.setDateCreated(LocalDateTime.now());

        order.setOrderCode(generateOrderCode());

        order.setStatus(Order.STATUS_PENDING);
        return orderMapper.toOrderResponse(orderRepository.save(order));

    }

    private String generateOrderCode(){
//        long timestamp = System.currentTimeMillis() % 1000000;
        Random random = new Random();
        int number = random.nextInt(900000) + 100000; // Generates a 6-digit number

        // Generate 3 random characters (lowercase and uppercase)
        StringBuilder randomChars = new StringBuilder(3);
        for (int i = 0; i < 3; i++) {
            int rand = random.nextInt(52); // 26 lowercase + 26 uppercase = 52
            char randomChar = (char) (rand < 26 ? 'a' + rand : 'A' + (rand - 26));
            randomChars.append(randomChar);
        }

        return String.format("ORD-%s%d",randomChars,number);
    }

    
    public Page<OrderResponse> searchOrders(String keyword, String status, int page, int size){
        Pageable pageable = PageRequest.of(page, size);

        Page<Order> ordersPage = orderRepository.findByOrderCodeOrPublisherAndStatus(keyword, status, pageable);

        return ordersPage.map(orderMapper::toOrderResponse);
    }

    public Page<OrderResponse> searchOrders2(String keyword, String status, String timeFilter, String dateRange, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        LocalDateTime startDate = LocalDateTime.MIN;
        LocalDateTime endDate = LocalDateTime.MAX;
        if (!"All".equalsIgnoreCase(dateRange)) {
            switch (dateRange) {
                case "Today":
                    startDate = LocalDate.now().atStartOfDay();
                    endDate = LocalDate.now().atTime(LocalTime.MAX);
                    break;
                case "Yesterday":
                    startDate = LocalDate.now().minusDays(1).atStartOfDay();
                    endDate = LocalDate.now().minusDays(1).atTime(LocalTime.MAX);
                    break;
                case "Last 7 days":
                    startDate = LocalDate.now().minusDays(7).atStartOfDay();
                    endDate = LocalDate.now().atTime(LocalTime.MAX);
                    break;
                case "Last 30 days":
                    startDate = LocalDate.now().minusDays(30).atStartOfDay();
                    endDate = LocalDate.now().atTime(LocalTime.MAX);
                    break;
                case "Custom Dates":
                    // Implement custom date range logic based on additional parameters, if needed
                    break;

                default:
                    startDate = LocalDateTime.MIN;
                    endDate = LocalDateTime.MAX;
                    break;


            }
        }

        System.out.println("date range " + dateRange);
        System.out.println("time " + timeFilter);
        System.out.println("start date: " + startDate);
        System.out.println("end date: " + endDate);

//        Page<Order> ordersPage = orderRepository.findByFilters(keyword, status, timeFilter, startDate, endDate, pageable);

        Page<Order> ordersPage;
        if ("All".equalsIgnoreCase(dateRange)) {
            ordersPage = orderRepository.findByOrderCodeOrPublisherAndStatus(keyword, status, pageable);
        } else {
            ordersPage = orderRepository.findByFilters(keyword, status, timeFilter, startDate, endDate, pageable);
        }
        return ordersPage.map(orderMapper::toOrderResponse);
    }

    public OrderResponse getOrder(String id){
        var order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        return orderMapper.toOrderResponse(order);
    }


    @Transactional
    public OrderResponse edit(String id, UpdateOrderRequest request){
        var order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        orderMapper.updateOrder(order, request);
        System.out.println("item req" + request.getOrderItems());
        System.out.println("item order" + order.getOrderItems());

//        order.getOrderItems().clear();
//        if (request.getOrderItems() != null) {
//            for (OrderItem item : request.getOrderItems()) {
//                order.addOrderItem(item); // Assuming addOrderItem handles the relationship
//            }
//        }

//        var orderItemsReq = request.getOrderItems();
//        var existOrderItem = order.getOrderItems();
//
//        // Remove items not in the update request
//        List<OrderItem> itemsToRemove = existOrderItem.stream()
//                .filter(item -> orderItemsReq.stream()
//                        .noneMatch(itemReq -> itemReq.getItemId().equals(item.getItemId())))
//                .collect(Collectors.toList());
//
//        existOrderItem.removeAll(itemsToRemove);
//        orderRepository.deleteAll(itemsToRemove);
//
//
//        for(OrderItem newItem : orderItemsReq){
//
//        }
        return orderMapper.toOrderResponse(orderRepository.save(order));


    }



    public List<Order> findOrdersByIds(List<String> ids) {
        List<Order> orders = orderRepository.findAllById(ids);
        return orders;
    }


}
