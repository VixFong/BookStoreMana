package com.example.inventoryservice.mapper;

import com.example.inventoryservice.dto.request.CreateInventoryRequest;
import com.example.inventoryservice.dto.request.UpdateInventoryRequest;
import com.example.inventoryservice.dto.response.InventoryResponse;
import com.example.inventoryservice.model.Inventory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface InventoryMapper {

//    @Mapping(target = "orderedQuantity", ignore = true)
    Inventory toInventory(CreateInventoryRequest request);

    InventoryResponse toInventoryResponse(Inventory inventory);


    void updateInventory(@MappingTarget Inventory inventory, UpdateInventoryRequest request);
}
