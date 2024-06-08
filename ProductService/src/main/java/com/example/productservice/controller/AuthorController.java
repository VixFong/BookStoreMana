package com.example.productservice.controller;

import com.example.productservice.dto.request.AuthorRequest;
import com.example.productservice.dto.response.ApiResponse;
import com.example.productservice.model.Author;
import com.example.productservice.service.Author.AuthorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/authors")
public class AuthorController {

    @Autowired
    private AuthorService authorService;

    @PostMapping
    public ApiResponse<Author> create(@RequestBody AuthorRequest request){
        System.out.println("Controller");
        return ApiResponse.<Author>builder()
                .data(authorService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<Author>> getAll(){
        return ApiResponse.<List<Author>>builder()
                .data(authorService.getAll())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<Author> edit(@PathVariable String id,@RequestBody AuthorRequest request){
        return ApiResponse.<Author>builder()
                .data(authorService.edit(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id){
        authorService.delete(id);
        return ApiResponse.<Void>builder()
                .build();
    }
}
