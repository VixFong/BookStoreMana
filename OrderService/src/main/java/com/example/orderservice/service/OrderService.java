package com.example.orderservice.service;

import com.example.orderservice.dto.request.CreateOrderRequest;
import com.example.orderservice.dto.request.SendOrder_NotificationRequest;
import com.example.orderservice.dto.request.UpdateOrderRequest;
import com.example.orderservice.dto.request.UpdateReceiveQtyRequest;
import com.example.orderservice.dto.response.OrderResponse;
import com.example.orderservice.exception.AppException;
import com.example.orderservice.exception.ErrorCode;
import com.example.orderservice.mapper.OrderMapper;
import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderItem;
import com.example.orderservice.repo.OrderItemRepository;
import com.example.orderservice.repo.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
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

import static com.example.orderservice.config.RabbitMQConfig.ORDER_QUEUE;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderEventProducer orderEventProducer;

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private RabbitTemplate rabbitTemplate;


    public OrderResponse create(CreateOrderRequest request){
        Order order = orderMapper.toOrder(request);

        order.setDateCreated(LocalDateTime.now());

        order.setOrderCode(generateOrderCode());

        order.setStatus(Order.STATUS_PROCESSING);

        System.out.println("item req" + request.getOrderItems());

        SendOrder_NotificationRequest sendOrderNotificationRequest = SendOrder_NotificationRequest.builder()
                .orderCode(order.getOrderCode())
                .numItems(order.getNumItems())
                .dateCreated(order.getDateCreated())
                .build();
//        orderEventProducer.sendOrderCreatedEvent(sendOrderNotificationRequest);
        System.out.println(sendOrderNotificationRequest.getDateCreated());
        rabbitTemplate.convertAndSend(ORDER_QUEUE, sendOrderNotificationRequest);

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
        System.out.println("status : " + status);

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

        order.setDateUpdated(LocalDateTime.now());

        orderMapper.updateOrder(order, request);
        System.out.println("item req" + request.getOrderItems());
        System.out.println("item order" + order.getOrderItems());

        if (request.getOrderItems() != null) {
            order.getOrderItems().clear();
            for (OrderItem item : request.getOrderItems()) {
                order.addOrderItem(item); // Assuming addOrderItem handles the relationship
            }
        }
        return orderMapper.toOrderResponse(orderRepository.save(order));


    }

    public void updateStatusOrder(List<String> ids){
        List<Order> orders = findOrdersByIds(ids);

        for(Order order : orders){

            System.out.println("order: " + order.getOrderCode());
            order.setStatus(Order.STATUS_DELIVERING);
            order.setDateUpdated(LocalDateTime.now());
            orderRepository.save(order);
        }
    }

    public void updateReceivedQuantity(String orderId, List<UpdateReceiveQtyRequest> requests){
        System.out.println("update item");

        boolean allItemsFullyReceived = true;
        for(UpdateReceiveQtyRequest update : requests){
            var orderItem = orderItemRepository.findById(update.getItemId())
                       .orElseThrow(()-> new AppException(ErrorCode.ORDER_NOT_FOUND));
            orderItem.setReceiveQty(update.getReceiveQty());
            if(update.getReceiveQty() != orderItem.getPurchaseQty()){
                allItemsFullyReceived = false;
            }

           System.out.println("item " + orderItem.getReceiveQty());


           orderItemRepository.save(orderItem);
       }
        var order = orderRepository.findById(orderId)
                .orElseThrow(()-> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if(allItemsFullyReceived){
            order.setStatus(Order.STATUS_COMPLETE);
        }
        else{
            order.setStatus(Order.STATUS_INCOMPLETE);
        }
        orderRepository.save(order);
    }


    public List<Order> findOrdersByIds(List<String> ids) {
        List<Order> orders = orderRepository.findAllById(ids);
        return orders;
    }

    public void delete(String id){
        orderRepository.deleteById(id);
    }


}
