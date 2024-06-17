package com.example.inventoryservice.service;

import com.example.inventoryservice.dto.request.CreateInventoryRequest;
import com.example.inventoryservice.dto.request.UpdateInventoryRequest;
import com.example.inventoryservice.dto.response.InventoryResponse;
import com.example.inventoryservice.exception.AppException;
import com.example.inventoryservice.exception.ErrorCode;
import com.example.inventoryservice.mapper.InventoryMapper;
import com.example.inventoryservice.model.Inventory;
import com.example.inventoryservice.repo.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryMapper inventoryMapper;

    public InventoryResponse create(CreateInventoryRequest request){
        Inventory inventory = inventoryMapper.toInventory(request);

        inventory.setDateCreated(LocalDateTime.now());
        inventoryRepository.save(inventory);

        return inventoryMapper.toInventoryResponse(inventory);

    }
    public List<InventoryResponse> getAll(){
        var inventories = inventoryRepository.findAll();
        return inventories.stream().map(inventoryMapper::toInventoryResponse).toList();
    }

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
