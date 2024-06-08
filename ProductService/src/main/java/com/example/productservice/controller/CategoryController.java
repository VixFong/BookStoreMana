package com.example.productservice.controller;

import com.example.productservice.dto.request.AuthorRequest;
import com.example.productservice.dto.request.CategoryRequest;
import com.example.productservice.dto.response.ApiResponse;
import com.example.productservice.model.Author;
import com.example.productservice.model.Category;
import com.example.productservice.repo.Category.CategoryRepository;
import com.example.productservice.service.Category.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;


    @PostMapping
    public ApiResponse<Category> create(@RequestBody CategoryRequest request){
        return ApiResponse.<Category>builder()
                .data(categoryService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<Category>> getAll(){
        return ApiResponse.<List<Category>>builder()
                .data(categoryService.getAll())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<Category> edit(@PathVariable String id,@RequestBody CategoryRequest request){
        return ApiResponse.<Category>builder()
                .data(categoryService.edit(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id){
        categoryService.delete(id);
        return ApiResponse.<Void>builder()
                .build();
    }

}
