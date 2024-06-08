package com.example.productservice.controller;

import com.example.productservice.dto.request.CategoryRequest;
import com.example.productservice.dto.request.GenreRequest;
import com.example.productservice.dto.response.ApiResponse;
import com.example.productservice.model.Category;
import com.example.productservice.model.Genre;
import com.example.productservice.service.Category.CategoryService;
import com.example.productservice.service.Genre.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/genres")
public class GenreController {
    @Autowired
    private GenreService genreService;


    @PostMapping
    public ApiResponse<Genre> create(@RequestBody GenreRequest request){
        return ApiResponse.<Genre>builder()
                .data(genreService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<Genre>> getAll(){
        return ApiResponse.<List<Genre>>builder()
                .data(genreService.getAll())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<Genre> edit(@PathVariable String id,@RequestBody GenreRequest request){
        return ApiResponse.<Genre>builder()
                .data(genreService.edit(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id){
        genreService.delete(id);
        return ApiResponse.<Void>builder()
                .build();
    }

}
