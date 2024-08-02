package com.example.orderservice.service;

import com.example.orderservice.dto.request.*;
import com.example.orderservice.dto.response.OrderCustomerResponse;
import com.example.orderservice.dto.response.OrderResponse;
import com.example.orderservice.exception.AppException;
import com.example.orderservice.exception.ErrorCode;
import com.example.orderservice.mapper.OrderMapper;
import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderCustomer;
import com.example.orderservice.model.OrderItem;
import com.example.orderservice.repo.OrderCustomerRepository;
import com.example.orderservice.repo.OrderItemRepository;
import com.example.orderservice.repo.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;

import static com.example.orderservice.config.rabbitMQ.RabbitMQConfig.*;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderCustomerRepository orderCustomerRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private RabbitTemplate rabbitTemplate;


    public OrderResponse create(CreateOrderRequest request){
        Order order = orderMapper.toOrder(request);

        order.setDateCreated(LocalDateTime.now());

        order.setOrderCode(generateOrderCode());

        order.setStatus(Order.STATUS_PROCESSING);

//        System.out.println("item req" + request.getOrderItems());


        SendOrder_NotificationRequest sendOrderNotificationRequest = SendOrder_NotificationRequest.builder()
                .orderCode(order.getOrderCode())
                .numItems(order.getNumItems())
                .dateCreated(order.getDateCreated())
                .messageType("NEW_ORDER")
                .build();
//        orderEventProducer.sendOrderCreatedEvent(sendOrderNotificationRequest);
        System.out.println(sendOrderNotificationRequest.getDateCreated());
        rabbitTemplate.convertAndSend(ORDER_QUEUE, sendOrderNotificationRequest);

        return orderMapper.toOrderResponse(orderRepository.save(order));

    }

    public OrderCustomerResponse createOrderCustomer(CreateOrderCustomerRequest request){
        var context = SecurityContextHolder.getContext();
        String email = context.getAuthentication().getName();

        System.out.println("note " + request.getNote());
        OrderCustomer order = orderMapper.toOrderCustomer(request);


        order.setDateCreated(LocalDateTime.now());

        order.setEmail(email);
        order.setOrderCode(generateOrderCode());

        order.setStatus(Order.STATUS_PROCESSING);

        SendOrder_NotificationCustomerRequest sendOrderNotificationCustomerRequest = SendOrder_NotificationCustomerRequest.builder()
                .orderCode(order.getOrderCode())
                .email(email)
                .numItems(order.getNumItems())
                .dateCreated(order.getDateCreated())
                .messageType("NEW_ORDER_CUSTOMER")
                .build();
        System.out.println(sendOrderNotificationCustomerRequest.getDateCreated());
        rabbitTemplate.convertAndSend(ORDER_CUSTOMER_QUEUE, sendOrderNotificationCustomerRequest);

        return orderMapper.toOrderCustomerResponse(orderCustomerRepository.save(order));

    }

    private String generateOrderCode(){
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

    
//    public Page<OrderResponse> searchOrders(String keyword, String status, int page, int size){
//        Pageable pageable = PageRequest.of(page, size);
//
//        Page<Order> ordersPage = orderRepository.findByOrderCodeOrPublisherAndStatus(keyword, status, pageable);
//
//        return ordersPage.map(orderMapper::toOrderResponse);
//    }

    public Page<OrderResponse> searchOrders(String keyword, String status, String timeFilter, String dateRange, int page, int size) {
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



        Page<Order> ordersPage;
        if ("All".equalsIgnoreCase(dateRange)) {
            ordersPage = orderRepository.findByOrderCodeOrPublisherAndStatus(keyword, status, pageable);
        } else {
            ordersPage = orderRepository.findByFilters(keyword, status, timeFilter, startDate, endDate, pageable);
        }
        return ordersPage.map(orderMapper::toOrderResponse);
    }


    public Page<OrderCustomerResponse> searchOrderCustomer(String keyword, String status, int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateCreated"));

        Page<OrderCustomer> orderCustomerPage = orderCustomerRepository.findByOrderCode(keyword, status, pageable);

        return orderCustomerPage.map(orderMapper::toOrderCustomerResponse);

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


        if (request.getOrderItems() != null) {
            order.getOrderItems().clear();
            for (OrderItem item : request.getOrderItems()) {
                order.addOrderItem(item);
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

            SendOrder_NotificationRequest sendOrderNotificationRequest = SendOrder_NotificationRequest.builder()
                    .orderCode(order.getOrderCode())
                    .numItems(order.getNumItems())
                    .dateCreated(order.getDateUpdated())
                    .messageType("UPDATE_STATUS")
                    .build();

            System.out.println(sendOrderNotificationRequest.getDateCreated());
            rabbitTemplate.convertAndSend(ORDER_QUEUE, sendOrderNotificationRequest);
        }
    }

//    public void updateStatusOrderCustomer(String id, String status, String email){
//        var orderCustomer = orderCustomerRepository.findById(id)
//                .orElseThrow(()-> new AppException(ErrorCode.ORDER_NOT_FOUND));
//
//        orderCustomer.setStatus(status);
//
//        SendOrder_NotificationCustomerRequest sendOrderNotificationCustomerRequest = SendOrder_NotificationCustomerRequest.builder()
//                .orderCode(orderCustomer.getOrderCode())
//                .email(email)
//                .numItems(orderCustomer.getNumItems())
//                .dateCreated(orderCustomer.getDateUpdated())
//                .messageType("UPDATE_STATUS")
//                .build();
//
//        System.out.println(sendOrderNotificationCustomerRequest.getDateCreated());
//        rabbitTemplate.convertAndSend(ORDER_CUSTOMER_QUEUE, sendOrderNotificationCustomerRequest);
//
//        orderCustomerRepository.save(orderCustomer);
//
//    }



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

    public void updateStatusOrderCustomer(String id, String status, List<UpdateStockRequest> request){
        var order = orderCustomerRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.ORDER_NOT_FOUND));


        order.setStatus(status);
        order.setDateUpdated(LocalDateTime.now());
        if(status.equals(OrderCustomer.STATUS_DELIVERING)){
            rabbitTemplate.convertAndSend(UPDATE_STOCK_QUEUE, request);
        }
        orderCustomerRepository.save(order);
    }


    public List<Order> findOrdersByIds(List<String> ids) {
        List<Order> orders = orderRepository.findAllById(ids);
        return orders;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void checkAndNotifyArrivalDateOrders() {
        LocalDate today = LocalDate.now();
        List<Order> orders = orderRepository.findByEstimatedArrivalDate(today);

        for (Order order : orders) {
            SendOrder_NotificationRequest sendOrderNotificationRequest = SendOrder_NotificationRequest.builder()
                    .orderCode(order.getOrderCode())
                    .numItems(order.getNumItems())
                    .dateCreated(order.getDateCreated())
                    .messageType("ARRIVAL_DATE_REACHED")
                    .build();

            rabbitTemplate.convertAndSend(ORDER_QUEUE, sendOrderNotificationRequest);
        }
    }


    public void delete(String id){
        var order = orderRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.ORDER_NOT_FOUND));

        orderRepository.deleteById(id);
        SendOrder_NotificationRequest sendOrderNotificationRequest = SendOrder_NotificationRequest.builder()
                .orderCode(order.getOrderCode())
                .numItems(order.getNumItems())
                .dateCreated(order.getDateUpdated())
                .messageType("DELETE_ORDER")
                .build();

        System.out.println(sendOrderNotificationRequest.getDateCreated());
        rabbitTemplate.convertAndSend(ORDER_QUEUE, sendOrderNotificationRequest);
    }


}
