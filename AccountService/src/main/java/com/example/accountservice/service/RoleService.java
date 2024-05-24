package com.example.accountservice.service;

import com.example.accountservice.mapper.RoleMapper;
import com.example.accountservice.model.Role;
import com.example.accountservice.repo.PermissionRepository;
import com.example.accountservice.repo.RoleRepository;
import com.example.accountservice.dto.request.RoleRequest;
import com.example.accountservice.dto.response.RoleResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private RoleMapper roleMapper;

    public RoleResponse create(RoleRequest req){


        Role role = roleMapper.toRole(req);
        var permissions =  permissionRepository.findAllById(req.getPermissions());

        role.setPermissions(new HashSet<>(permissions));
        role = roleRepository.save(role);

        return roleMapper.toRoleResponse(role);

    }

    public List<RoleResponse> getAll(){
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();

    }

    public void delete(String role){
        roleRepository.deleteById(role);
    }
}
