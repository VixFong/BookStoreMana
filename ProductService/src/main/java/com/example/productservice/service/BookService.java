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
import com.example.productservice.service.Author.AuthorService;
import com.example.productservice.service.Category.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookDetailRepository bookDetailRepository;

    @Autowired
    private CategoryService categoryService;

//    @Autowired
//    private AuthorService authorService;

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
        }

//      Set price after discount
        double discountPrice = setPriceAfterDiscount(request.getPrice(), request.getDiscount());
        book.setPriceDiscount(discountPrice);

//      Set info
        System.out.println("Info " + request.getInfo());
        if(request.getInfo() != null || !request.getInfo().isEmpty()){

            bookDetail.setInfo(request.getCustomFieldsMap());
        }

        bookRepository.save(book);
        bookDetailRepository.save(bookDetail);


        updateBookCounts(bookDetail.getCategories());
//        updateBookPublishCounts(bookDetail.getAuthor());
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
        return bookPage.map(bookMapper::toBookResponseWithConditionalFields);
    }

    public BookInfoResponse getBookInfo(String id){
        var book = bookRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.BOOK_NOT_FOUND));
        var bookDetail = bookDetailRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.BOOK_NOT_FOUND));

        return bookMapper.toBookInfoResponse(book, bookDetail);
    }
    public BookInfoResponse update(String id, UpdateBookRequest request){
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        BookDetail bookDetail =bookDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        System.out.println("Update file " + request.getFiles());
//        if(request.getFiles() != null || !request.getFiles().isEmpty()){

//            setImageIfHavingFiles(book, request.getFiles());
//        }

//        Set Images
//        Check whether client send back old images if not having it will set list is null
        List<String> existingImageUrls = request.getImageUrls() != null ? request.getImageUrls() : Collections.emptyList();
        List<String> allImageUrls = existingImageUrls;

//        Check whether client send files or not
        if (request.getFiles() != null && !request.getFiles().isEmpty()) {
            ApiResponse<List<ImageResponse>> apiResponse = imageServiceClient.uploadBookImages(request.getFiles(), "books");
            if (apiResponse != null && apiResponse.getCode() == 100) {
                List<ImageResponse> images = apiResponse.getData();
                if (images != null && !images.isEmpty()) {
                    List<String> uploadedImageUrls = images.stream()
                            .map(ImageResponse::getUrl)
                            .collect(Collectors.toList());
                    allImageUrls.addAll(uploadedImageUrls);
                }
            } else {
                throw new AppException(ErrorCode.FAIL_UPLOAD_IMAGE);
            }
        }
        book.setImages(allImageUrls);

        //Set price after discount
        double discountPrice = setPriceAfterDiscount(request.getPrice(), request.getDiscount());
        book.setPriceDiscount(discountPrice);

//      Set info
        System.out.println("Info " + request.getInfo());
        if(request.getInfo() != null || !request.getInfo().isEmpty()){

            bookDetail.setInfo(request.getCustomFieldsMap());
        }


        bookMapper.updateBookFromRequest(book, request);
        bookMapper.updateBookDetailFromRequest(bookDetail, request);

        // Update book counts
        updateBookCounts(bookDetail.getCategories());
        return bookMapper.toBookInfoResponse(bookRepository.save(book), bookDetailRepository.save(bookDetail));
    }

    public void delete(String id){
        BookDetail bookDetail = bookDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        Set<String> categoryIds = bookDetail.getCategories();

        bookRepository.deleteById(id);
        bookDetailRepository.deleteById(id);

        // Update book counts
        updateBookCounts(categoryIds);
    }


    public void toggleBookLock(String id, boolean isLock){
        Book book = bookRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.BOOK_NOT_FOUND));
        book.setLock(isLock);
        System.out.println("lock: "+isLock);
        bookRepository.save(book);
    }

//    private void updateBookCounts(Set<String> categories) {
//        for (String category : categories) {
//            int count = bookDetailRepository.countByCategoriesContaining(category);
//            categoryService.updateBookCount(category, count);
//        }
//    }

    private double setPriceAfterDiscount(double price, int discount){
        var discountPrice = price - (price * discount / 100);
        return discountPrice;
    }

    private void updateBookCounts(Set<String> categoryIds) {
        for (String id : categoryIds) {
            int count = bookDetailRepository.countByCategoriesContaining(id);
            categoryService.updateBookCount(id, count);
        }
    }

//    private void updateBookPublishCounts(String authorIds) {
//        for (String id : authorIds) {
//            int count = bookDetailRepository.countByAuthorContaining(id);
//            authorService.updateBookPublishCountByAuthor(id, count);
//        }
//    }

    public void toggleFlashSale(String id, boolean flashSale) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        book.setFlashSale(flashSale);
        bookRepository.save(book);
    }
}
