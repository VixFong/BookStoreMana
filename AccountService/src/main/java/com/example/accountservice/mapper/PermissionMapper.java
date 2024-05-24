package com.example.accountservice.mapper;

import com.example.accountservice.dto.request.PermissionRequest;
import com.example.accountservice.dto.response.PermissionResponse;
import com.example.accountservice.model.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);
    PermissionResponse toPermissionResponse(Permission permission);

}
