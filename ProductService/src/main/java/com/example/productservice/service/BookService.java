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
import com.example.productservice.repo.Author.AuthorRepository;
import com.example.productservice.repo.BookDetailRepository;
import com.example.productservice.repo.BookRepository;
import com.example.productservice.repo.Category.CategoryRepository;
import com.example.productservice.repo.ServiceClient.ImageServiceClient;
import com.example.productservice.service.Author.AuthorService;
import com.example.productservice.service.Category.CategoryService;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookDetailRepository bookDetailRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AuthorRepository authorRepository;
//    @Autowired
//    private AuthorService authorService;

    @Autowired
    private ImageServiceClient imageServiceClient;

    @Autowired
    private BookMapper bookMapper;
    public BookInfoResponse addBook(CreateBookRequest request){

        System.out.println("add Req " + request.getBookDetailId());

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


    public List<BookInfoResponse> importBooksFromExcel(MultipartFile file) {
        List<BookInfoResponse> responses = new ArrayList<>();
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(inputStream)) {


            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    // Skip header row
                    continue;
                }

                CreateBookRequest request = new CreateBookRequest();
                request.setTitle(getCellValue(row.getCell(0)));


                // Lấy danh sách các category từ ô trong Excel
                String[] categoriesFromExcel = getCellValue(row.getCell(1)).split(",");
                Set<String> categoryIds = new HashSet<>();

                for(String category : categoriesFromExcel){
                    var cate = categoryRepository.findByCategory(category.trim())
                            .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
                    categoryIds.add(cate.getId());

                }
//                List<String> categoryIds = List.of(getCellValue(row.getCell(1)).split(",")).stream().allMatch(ca);
                request.setCategories(categoryIds);

//                System.out.println(2);
                String discountStr = getCellValue(row.getCell(2));
                if (!discountStr.isEmpty()) {
                    String[] parts = discountStr.split("\\.");
                    System.out.println(parts[0]);
                    request.setDiscount(Integer.parseInt(parts[0]));
                }
//                System.out.println("author " + getCellValue(row.getCell(3)).trim());

//                request.setStatus(getCellValue(row.getCell(5)));
                var author = authorRepository.findByAuthorName(getCellValue(row.getCell(3)).trim())
                        .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));
                request.setAuthor(author.getId());
                request.setPublisher(getCellValue(row.getCell(4)));
                request.setDescription(getCellValue(row.getCell(5)));
                request.setPrice(Double.parseDouble(getCellValue(row.getCell(6))));
                request.setInfo(getCellValue(row.getCell(7)));

                // Assume files will not be included in Excel import for simplicity
                request.setFiles(null);
//                System.out.println(request.getCategories());
//                System.out.println(request.getAuthor());
//                System.out.println(request.getPrice());
//                System.out.println(request.getDiscount());
//                System.out.println(request.getCustomFieldsMap());
                System.out.println(request.getInfo());
                responses.add(addBook(request));

//                System.out.println("resp = "+responses.get(0));
            }
        } catch (IOException e) {
            throw new AppException(ErrorCode.FAIL_PARSE_EXCEL);
        }
        return responses;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
//                    System.out.println("numeric " + cell.getNumericCellValue());
                    return String.valueOf(cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            case BLANK:
                return "";
            default:
                return "";
        }
    }
}
