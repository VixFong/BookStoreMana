package com.example.accountservice.mapper;

import com.example.accountservice.dto.request.RoleRequest;
import com.example.accountservice.dto.response.RoleResponse;
import com.example.accountservice.model.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "string")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);
    RoleResponse toRoleResponse(Role role);

}
