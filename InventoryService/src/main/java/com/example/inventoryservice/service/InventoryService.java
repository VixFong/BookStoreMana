package com.example.inventoryservice.service;

import com.example.inventoryservice.dto.request.CreateInventoryRequest;
import com.example.inventoryservice.dto.request.SearchInventoryByBookIdRequest;
import com.example.inventoryservice.dto.request.UpdateInventoryRequest;
import com.example.inventoryservice.dto.request.UpdateReceivedQuantityRequest;
import com.example.inventoryservice.dto.response.InventoryResponse;
import com.example.inventoryservice.dto.response.InventoryStatusResponse;
import com.example.inventoryservice.dto.response.SearchInventoryByBookIdResponse;
import com.example.inventoryservice.exception.AppException;
import com.example.inventoryservice.exception.ErrorCode;
import com.example.inventoryservice.mapper.InventoryMapper;
import com.example.inventoryservice.model.Inventory;
import com.example.inventoryservice.repo.InventoryRepository;
import com.example.inventoryservice.repo.ProductServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import static com.example.inventoryservice.config.RabbitMQConfig.BOOK_QUEUE;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryMapper inventoryMapper;

    @Autowired
    private ProductServiceClient productServiceClient;

    public InventoryResponse create(CreateInventoryRequest request){
        System.out.println("Inventory " + request.getBookId());
        Inventory inventory = inventoryMapper.toInventory(request);

        inventory.setDateCreated(LocalDateTime.now());
        inventory.setStatus(Inventory.STATUS_NEW);
        inventoryRepository.save(inventory);


        return inventoryMapper.toInventoryResponse(inventory);

    }
    public List<InventoryResponse> getAll(){
        var inventories = inventoryRepository.findAll();
        return inventories.stream().map(inventoryMapper::toInventoryResponse).toList();
    }

//    public Page<InventoryResponse> searchBook(String keyword, int page, int size) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by("title").ascending());
////        Page<Inventory> inventoryPage = inventoryRepository.findBookByTitle(keyword, pageable);
//        return bookPage.map(bookMapper::toBookResponseWithConditionalFields);
//    }

    public Page<InventoryResponse> getAllInventories(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateUpdated"));
        Page<Inventory> inventoryPage = inventoryRepository.findAll(pageRequest);

        return inventoryPage.map(inventoryMapper::toInventoryResponse);
    }

//    public Page<InventoryResponse> searchInventory(List<SearchInventoryByBookIdRequest> request, int page, int size) {
//        List<String> bookIds = request.stream()
//                .map(SearchInventoryByBookIdRequest::getBookId)
//                .collect(Collectors.toList());
////        System.out.println(request);
//        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateUpdated"));
//        Page<Inventory> inventoryPage = inventoryRepository.findByBookIdIn(bookIds, pageRequest);
//
//        return inventoryPage.map(inventoryMapper::toInventoryResponse);
//    }

    public Page<InventoryResponse> searchInventory(String keyword, int page, int size) {
        var apiResponse = productServiceClient.searchIdsBook(keyword);

        List<String> bookIds = apiResponse.getData().stream()
                .map(SearchInventoryByBookIdResponse::getBookId)
                .collect(Collectors.toList());
//        System.out.println(request);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateUpdated"));
        Page<Inventory> inventoryPage = inventoryRepository.findByBookIdIn(bookIds, pageRequest);

        return inventoryPage.map(inventoryMapper::toInventoryResponse);
    }

    public InventoryResponse update(String id, UpdateInventoryRequest request){
        var inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_NOT_FOUND));
        inventoryMapper.updateInventory(inventory, request);
//        System.out.println(inventory.getDateUpdated());

//      Set status of inventory
        updateStatus(inventory,request.getReceivedQuantity());

        inventory.setDateUpdated(LocalDateTime.now());
        System.out.println("After "+ inventory.getDateUpdated());

        return inventoryMapper.toInventoryResponse(inventoryRepository.save(inventory));
    }


    public List<InventoryStatusResponse> getBookIdAndStatusByBookIds(List<String> bookIds) {
        return inventoryRepository.findBookIdAndStatusByBookIds(bookIds);
    }

    private void updateStatus(Inventory inventory, int receivedQuantity){
        if(receivedQuantity == 0){
            inventory.setStatus(Inventory.STATUS_OUT_OF_STOCK);
        }
        else if ( receivedQuantity <= inventory.getOrderedQuantity() * 10 / 100  ) {
            inventory.setStatus(Inventory.STATUS_NEED_REORDER);
        }
        else{
            inventory.setStatus(Inventory.STATUS_IN_STOCK);
        }
    }

    public InventoryResponse updateQuantity(String id, UpdateReceivedQuantityRequest request){
        var inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_NOT_FOUND));

        inventory.setReceivedQuantity(request.getReceivedQuantity());

//      Set status of inventory
        updateStatus(inventory, request.getReceivedQuantity());

        inventory.setDateUpdated(LocalDateTime.now());

        return inventoryMapper.toInventoryResponse(inventoryRepository.save(inventory));
    }

    public String delete(String bookId){
        var inventory = inventoryRepository.findInventoriesByBookId(bookId)
                .orElseThrow(() ->new AppException(ErrorCode.INVENTORY_NOT_FOUND));

        System.out.println(bookId);
        if(inventory.getReceivedQuantity() == 0){
            inventoryRepository.deleteInventoriesByBookId(bookId);
            return "Delete success";
        }
        if(inventory.getReceivedQuantity() > 0){
            System.out.println("can not delete");
            return "Can not delete. Because Received quantity greater than 0";
        }
        return "Delete Fail";

//        inventoryRepository.deletById(id);

    }





}
