package com.example.accountservice.service;
import com.example.accountservice.mapper.PermissionMapper;
import com.example.accountservice.repo.PermissionRepository;
import com.example.accountservice.dto.request.PermissionRequest;
import com.example.accountservice.dto.response.PermissionResponse;
import com.example.accountservice.model.Permission;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionService {
    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    PermissionMapper permissionMapper;

    public PermissionResponse create(PermissionRequest req){

        Permission permission = permissionMapper.toPermission(req);
        permission = permissionRepository.save(permission);

        return permissionMapper.toPermissionResponse(permission);

    }

    public List<PermissionResponse> getAll(){
        List<Permission> permissions = permissionRepository.findAll();
        return permissions.stream().map(permissionMapper::toPermissionResponse).toList();
    }

    public void delete(String permission){
        permissionRepository.deleteById(permission);
    }
}
