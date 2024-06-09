package com.example.productservice.service;

import com.example.productservice.dto.request.CreateBookRequest;
import com.example.productservice.dto.request.UpdateBookRequest;
import com.example.productservice.dto.response.ApiResponse;
import com.example.productservice.dto.response.BookInfoResponse;
import com.example.productservice.dto.response.BookResponse;
import com.example.productservice.dto.response.ImageResponse;
import com.example.productservice.exception.AppException;
import com.example.productservice.exception.ErrorCode;
import com.example.productservice.mapper.BookMapper;
import com.example.productservice.model.Book;
import com.example.productservice.model.BookDetail;
import com.example.productservice.repo.BookDetailRepository;
import com.example.productservice.repo.BookRepository;
import com.example.productservice.repo.ServiceClient.ImageServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookDetailRepository bookDetailRepository;

    @Autowired
    private ImageServiceClient imageServiceClient;

    @Autowired
    private BookMapper bookMapper;
    public BookInfoResponse addBook(CreateBookRequest request){

        Book book = bookMapper.toBook(request);
        BookDetail bookDetail = bookMapper.toBookDetail(request);

//      Set Id
        String id = UUID.randomUUID().toString();
        book.setBookId(id);
        bookDetail.setBookDetailId(id);

//      Set lock
        book.setLock(true);

//      Set Flash Sale
        book.setFlashSale(false);

        //Set Image
        if(request.getFiles() == null) {
            book.setImages(Collections.singletonList("https://res.cloudinary.com/dmdddwb1j/image/upload/v1717739669/books/xbamzlpkzsspmmkvjuda.jpg"));
        }
        else{
            setImageIfHavingFiles(book, request.getFiles());
//            var apiResponse = imageServiceClient.uploadImage(request.getFile(),"books");
//
//
//            // Check if the response is successful and not null
//            if (apiResponse != null && apiResponse.getCode() == 100) {
//                var image = apiResponse.getData().getUrl();
//                // Process the images as needed, for example, store their URLs in the book details
//                book.setImage(image);
//            } else {
//                // Handle the case where the image upload fails
//                throw new AppException(ErrorCode.FAIL_UPLOAD_IMAGE);
//            }
        }


        bookRepository.save(book);
        bookDetailRepository.save(bookDetail);


        return bookMapper.toBookInfoResponse(book, bookDetail);
    }


    private void setImageIfHavingFiles(Book book, List<MultipartFile> files){
        ApiResponse<List<ImageResponse>> apiResponse = imageServiceClient.uploadBookImages(files, "books");

        if (apiResponse != null && apiResponse.getCode() == 100) {
            List<ImageResponse> images = apiResponse.getData();
            if (images != null && !images.isEmpty()) {
                // Collect all image URLs into a list
                List<String> imageUrls = images.stream()
                        .map(ImageResponse::getUrl)
                        .collect(Collectors.toList());
                book.setImages(imageUrls);
            }
        } else {
            throw new AppException(ErrorCode.FAIL_UPLOAD_IMAGE);
        }
    }
//    @PreAuthorize("hasRole('Admin')")
    public Page<BookResponse> searchBook(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        Page<Book> bookPage = bookRepository.findBookByTitle(keyword, pageable);
        return bookPage.map(bookMapper::toBookResponse);
    }

    public BookInfoResponse update(String id, UpdateBookRequest request){
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        BookDetail bookDetail =bookDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));


        if(request.getFiles() != null){

            setImageIfHavingFiles(book, request.getFiles());
        }


        bookMapper.updateBookFromRequest(book, request);
        bookMapper.updateBookDetailFromRequest(bookDetail, request);

     ;
        return bookMapper.toBookInfoResponse(bookRepository.save(book), bookDetailRepository.save(bookDetail));
    }

    public void delete(String id){
        bookRepository.deleteById(id);
        bookDetailRepository.deleteById(id);

    }


    public void toggleBookLock(String id, boolean isLock){
        Book book = bookRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.BOOK_NOT_FOUND));
        book.setLock(isLock);
        System.out.println("lock: "+isLock);
        bookRepository.save(book);
    }
}
