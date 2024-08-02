package com.example.inventoryservice.listener;


import com.example.inventoryservice.dto.request.CreateInventoryRequest;
import com.example.inventoryservice.dto.request.UpdateStockRequest;
import com.example.inventoryservice.service.InventoryService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.example.inventoryservice.config.RabbitMQConfig.BOOK_QUEUE;
import static com.example.inventoryservice.config.RabbitMQConfig.UPDATE_STOCK_QUEUE;

@Component
public class InventoryListener {
    @Autowired
    private InventoryService inventoryService;

    @RabbitListener(queues = BOOK_QUEUE)
    public void handleNewBook(CreateInventoryRequest request) {
        inventoryService.create(request);
    }

    @RabbitListener(queues = UPDATE_STOCK_QUEUE)
    public void handleUpdateStock(List<UpdateStockRequest> requests) {
        inventoryService.updateStockAfterPurchasing(requests);
    }
}
