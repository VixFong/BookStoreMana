package com.example.productservice.controller;

import com.example.productservice.dto.request.CreateBookRequest;
import com.example.productservice.dto.request.UpdateBookRequest;
import com.example.productservice.dto.response.*;
import com.example.productservice.service.BookService;
import jakarta.validation.Valid;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
    @PostMapping("/import")
    public ApiResponse<List<BookInfoResponse>> importBooksFromExcel(@RequestParam("file") MultipartFile file) {
        List<BookInfoResponse> responses = bookService.importBooksFromExcel(file);
        System.out.println("Import");
        return ApiResponse.<List<BookInfoResponse>>builder()
                .data(responses)
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<Page<BookResponse>> searchBook(@RequestParam String keyword, @RequestParam int page, @RequestParam int size){
//        System.out.println("Controller");
        return ApiResponse.<Page<BookResponse>>builder()
                .data(bookService.searchBook(keyword, page, size))
                .build();
    }

    @GetMapping("/bookIds")
    public ApiResponse<List<SearchBook_InventoryResponse>> searchIdsBook(@RequestParam String keyword){
        return ApiResponse.<List<SearchBook_InventoryResponse>>builder()
                .data(bookService.searchIdsBook(keyword))
                .build();
    }

    @GetMapping("{id}")
    public ApiResponse<BookInfoResponse> getBookInfo(@PathVariable String id){
        System.out.println("Controller getBookInfo");
        return ApiResponse.<BookInfoResponse>builder()
                .data(bookService.getBookInfo(id))
                .build();
    }

    @GetMapping("{id}/bookData")
    public ApiResponse<Book_InventoryResponse> getBookData(@PathVariable String id){
//        System.out.println("Controller getBookData");

        return ApiResponse.<Book_InventoryResponse>builder()
                .data(bookService.getBookData(id))
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
        System.out.println(id);
        return ApiResponse.<String>builder()
                .data(bookService.delete(id))
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


    @PutMapping("/{id}/flashSale")
    public ApiResponse<String> toggleFlashSale(@PathVariable String id, @RequestParam boolean flashSale) {
        System.out.println("Flash sale" + flashSale);
        bookService.toggleFlashSale(id, flashSale);
        return ApiResponse.<String>builder()
                .data(flashSale ? "User flash sale successfully" : "User unlocked successfully")
                .build();
    }
}
