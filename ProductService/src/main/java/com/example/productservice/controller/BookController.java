package com.example.productservice.controller;

import com.example.productservice.dto.request.CreateBookRequest;
import com.example.productservice.dto.request.UpdateBookRequest;
import com.example.productservice.dto.response.ApiResponse;
import com.example.productservice.dto.response.BookInfoResponse;
import com.example.productservice.dto.response.BookResponse;
import com.example.productservice.service.BookService;
import jakarta.validation.Valid;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books")
public class BookController {
    @Autowired
    private BookService bookService;


    @PostMapping
    public ApiResponse<BookInfoResponse> addBook(@ModelAttribute CreateBookRequest request){
        return ApiResponse.<BookInfoResponse>builder()
                .data(bookService.addBook(request))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<Page<BookResponse>> searchBook(@RequestParam String keyword, @RequestParam int page, @RequestParam int size){
        System.out.println("Controller");
        return ApiResponse.<Page<BookResponse>>builder()
                .data(bookService.searchBook(keyword, page, size))
                .build();
    }

    @PutMapping("{id}")
    public ApiResponse<BookInfoResponse> updateBook(@PathVariable String id, @ModelAttribute UpdateBookRequest request){
        System.out.println("Update");
        return ApiResponse.<BookInfoResponse>builder()
                .data(bookService.update(id, request))
                .build();
    }

    @DeleteMapping("{id}")
    public ApiResponse<String> delete(@PathVariable String id){
        bookService.delete(id);
        return ApiResponse.<String>builder()
                .data("Delete book success")
                .build();
    }


    @PutMapping("{id}/lock")
    public ApiResponse<String> toggleBookLock(@PathVariable String id, @RequestParam boolean isLock){
        System.out.println("Controller lock: "+isLock);

        bookService.toggleBookLock(id, isLock);
        return ApiResponse.<String>builder()
                .data(isLock ? "Book locked successfully" : "Book unlocked successfully")
                .build();
    }
}
