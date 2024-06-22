package com.example.inventoryservice.service;

import com.example.inventoryservice.dto.request.CreateInventoryRequest;
import com.example.inventoryservice.dto.request.UpdateInventoryRequest;
import com.example.inventoryservice.dto.response.InventoryResponse;
import com.example.inventoryservice.exception.AppException;
import com.example.inventoryservice.exception.ErrorCode;
import com.example.inventoryservice.mapper.InventoryMapper;
import com.example.inventoryservice.model.Inventory;
import com.example.inventoryservice.repo.InventoryRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import static com.example.inventoryservice.config.RabbitMQConfig.BOOK_QUEUE;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryMapper inventoryMapper;

    public InventoryResponse create(CreateInventoryRequest request){
        System.out.println("Inventory " + request.getBookId());
        Inventory inventory = inventoryMapper.toInventory(request);

        inventory.setDateCreated(LocalDateTime.now());
//        inventory.setOrderedQuantity();
        inventoryRepository.save(inventory);


        return inventoryMapper.toInventoryResponse(inventory);

    }
    public List<InventoryResponse> getAll(){
        var inventories = inventoryRepository.findAll();
        return inventories.stream().map(inventoryMapper::toInventoryResponse).toList();
    }

//    public Page<InventoryResponse> searchBook(String keyword, int page, int size) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by("title").ascending());
//        Page<Inventory> inventoryPage = inventoryRepository.findBookByTitle(keyword, pageable);
//        return bookPage.map(bookMapper::toBookResponseWithConditionalFields);
//    }


    public InventoryResponse update(String id, UpdateInventoryRequest request){
        var inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_NOT_FOUND));
        inventoryMapper.updateInventory(inventory, request);
        System.out.println(inventory.getDateUpdated());
        inventory.setDateUpdated(LocalDateTime.now());
        System.out.println("After "+ inventory.getDateUpdated());

        return inventoryMapper.toInventoryResponse(inventoryRepository.save(inventory));
    }

    public void delete(String id){
        inventoryRepository.deleteById(id);
    }



}
