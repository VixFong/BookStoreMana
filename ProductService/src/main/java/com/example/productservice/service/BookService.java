package com.example.productservice.service;

import com.example.productservice.dto.request.CreateBookRequest;
import com.example.productservice.dto.request.CreateInventoryRequest;
import com.example.productservice.dto.request.ListBookClientRequest;
import com.example.productservice.dto.request.UpdateBookRequest;
import com.example.productservice.dto.response.*;
import com.example.productservice.exception.AppException;
import com.example.productservice.exception.ErrorCode;
import com.example.productservice.mapper.BookMapper;
import com.example.productservice.model.Book;
import com.example.productservice.model.BookDetail;
import com.example.productservice.repo.Author.AuthorRepository;
import com.example.productservice.repo.BookDetailRepository;
import com.example.productservice.repo.BookRepository;
import com.example.productservice.repo.Category.CategoryRepository;
import com.example.productservice.repo.Publisher.PublisherRepository;
import com.example.productservice.repo.ServiceClient.ImageServiceClient;
import com.example.productservice.repo.ServiceClient.InventoryServiceClient;
import com.example.productservice.service.Category.CategoryService;
import org.apache.poi.ss.usermodel.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import static com.example.productservice.config.RabbitMQConfig.BOOK_QUEUE;

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
    private PublisherRepository publisherRepository;

    @Autowired
    private AuthorRepository authorRepository;
//    @Autowired
//    private AuthorService authorService;

    @Autowired
    private ImageServiceClient imageServiceClient;

    @Autowired
    private InventoryServiceClient inventoryServiceClient;

    @Autowired
    private BookMapper bookMapper;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @PreAuthorize("hasRole('Admin')")
    public BookInfoResponse addBook(CreateBookRequest request){


        Book book = bookMapper.toBook(request);
        BookDetail bookDetail = bookMapper.toBookDetail(request);

//      Set Id
        String id = UUID.randomUUID().toString();
        book.setBookId(id);
        bookDetail.setBookDetailId(id);
//        System.out.println("add Req " + id);

//      Set lock
        book.setLock(true);

//      Set Flash Sale
        book.setFlashSale(false);

        //Set Image
        if(request.getFiles() == null && (request.getImageUrls() == null || request.getImageUrls().isEmpty() )) {
            book.setImages(Collections.singletonList("https://res.cloudinary.com/dmdddwb1j/image/upload/v1717739669/books/xbamzlpkzsspmmkvjuda.jpg"));
        }
        else if(request.getImageUrls() != null){
            book.setImages(request.getImageUrls());
            System.out.println(book.getImages());
        }
        else {
            setImageIfHavingFiles(book, request.getFiles());
        }

//      Set price after discount
        double discountPrice = setPriceAfterDiscount(request.getPrice(), request.getDiscount());
        book.setPriceDiscount(discountPrice);

//      Set info
//        System.out.println("Info " + request.getInfo());
        if(request.getInfo() != null || !request.getInfo().isEmpty()){

            bookDetail.setInfo(request.getCustomFieldsMap());
        }

        bookRepository.save(book);
        bookDetailRepository.save(bookDetail);


        // Send message to RabbitMQ

//        System.out.println("order quan " +request.getQuantity());
        CreateInventoryRequest message = CreateInventoryRequest.builder()
                .bookId(id)
                .orderedQuantity(request.getQuantity())
                .totalPrice(request.getTotalPrice())
                .build();
//        message.setBookId(id);
        rabbitTemplate.convertAndSend(BOOK_QUEUE, message);
//        System.out.println("Books id " + message.getBookId());


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
    @PreAuthorize("hasRole('Admin')")
    public Page<BookResponse> searchBook(String keyword, int page, int size) {

        System.out.println("keyword"+ keyword);
        Pageable pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        Page<Book> bookPage = bookRepository.findBookByTitle(keyword, pageable);


        return bookPage.map(bookMapper::toBookResponseWithConditionalFields);
    }

//    public Page<BookClientResponse> searchBookClient(String keyword, int page,int size){
//        Pageable pageable = PageRequest.of(page, size, Sort.by("title").ascending());
//        Page<Book> bookPage = bookRepository.findBookByTitle(keyword, pageable);
//        return bookPage.map(bookMapper::toBookResponseWithConditionalFieldsClient);
//    }


//    public Page<BookClientResponse> searchBookClient(String keyword, int page,int size,  String sortField, String sortDirection){
//        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);
////        Sort sort;
////        if ("price".equals(sortField)) {
////            System.out.println("sort price");
////            sort = Sort.by(Sort.Direction.fromString(sortDirection), "price", "priceDiscount");
////        } else {
////            System.out.println("sort title");
////            sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);
////        }
//
//        Pageable pageable = PageRequest.of(page, size, sort);
//        Page<Book> bookPage = bookRepository.findBookByTitle(keyword, pageable);
//        return bookPage.map(bookMapper::toBookResponseWithConditionalFieldsClient);
//    }

    public Page<BookClientResponse> searchBookClient(String keyword, int page,int size,  String sortField, String sortDirection, Set<String> categories, Set<String> authors, Set<String> publishers, Double maxPrice){


        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);


        // Using keyword to find list of bookId
        List<SearchBook_InventoryResponse> bookIdsByTitle = bookRepository.findBookIdsByTitle(keyword);
        Set<String> bookIds = bookIdsByTitle.stream().map(SearchBook_InventoryResponse::getBookId).collect(Collectors.toSet());

        // Filter out locked books
        bookIds.removeIf(bookId -> isBookLocked(bookId));

        if (!categories.isEmpty()) {
            System.out.println("category " + categories);
            List<BookIdsFromFilterResponse> bookDetailIdsByCategories = bookDetailRepository.findBookDetailIdsByCategories(categories);
            Set<String> bookDetailIds = bookDetailIdsByCategories.stream().map(BookIdsFromFilterResponse::getBookDetailId).collect(Collectors.toSet());
            bookIds.retainAll(bookDetailIds);
        }

        if (!authors.isEmpty()) {
            System.out.println("author " + authors);

            List<BookIdsFromFilterResponse> bookDetailIdsByAuthors = bookDetailRepository.findBookDetailIdsByAuthors(authors);
            Set<String> bookDetailIds = bookDetailIdsByAuthors.stream().map(BookIdsFromFilterResponse::getBookDetailId).collect(Collectors.toSet());
            System.out.println(bookDetailIds.toString());
            bookIds.retainAll(bookDetailIds);
        }

        if (!publishers.isEmpty()) {
            System.out.println("publisher " + publishers);

            List<BookIdsFromFilterResponse> bookDetailIdsByPublishers = bookDetailRepository.findBookDetailIdsByPublishers(publishers);
            Set<String> bookDetailIds = bookDetailIdsByPublishers.stream().map(BookIdsFromFilterResponse::getBookDetailId).collect(Collectors.toSet());
            bookIds.retainAll(bookDetailIds);
        }

        if(maxPrice != null){

            List<SearchBook_InventoryResponse> bookIdByPriceRange = bookRepository.findByIdsAndPriceRange(bookIds, 0, maxPrice);
//            System.out.println(bookIdByPriceRange.stream().toList());

            Set<String> bookIdsByPrice = bookIdByPriceRange.stream().map(SearchBook_InventoryResponse::getBookId).collect(Collectors.toSet());
//            System.out.println("price: " + bookIdsByPrice);

            bookIds.retainAll(bookIdsByPrice);
        }


        Page<Book> bookPage = bookRepository.findBooksByIdIn(bookIds, pageable);

        return bookPage.map(bookMapper::toBookResponseWithConditionalFieldsClient);
    }

    public List<BookClientResponse> getBookCart(ListBookClientRequest request){
        List<Book> books = bookRepository.findByBookIdIn(request.getBookId());
        return books.stream()
                .map(bookMapper::toBookResponseWithConditionalFieldsClient)
//                .map(this::convertToBookClientResponse)
                .collect(Collectors.toList());

    }

//    private BookClientResponse convertToBookClientResponse(Book book) {
//        var bookClientResponse =  BookClientResponse.builder()
//                .bookId(book.getBookId())
//                .title(book.getTitle())
//                .discount(book.getDiscount())
//                .image(book.getImages().get(0))
//                .price(book.getPrice())
//                .priceDiscount(book.getPriceDiscount())
//                .build();
//        return bookMapper.toBookResponseWithConditionalFieldsClient(bookClientResponse);
//    }

    private boolean isBookLocked(String bookId){
        Book book = bookRepository.findById(bookId)
                .orElseThrow(()-> new AppException(ErrorCode.BOOK_NOT_FOUND));
        return book.isLock();
    }


    public List<SearchBook_InventoryResponse> searchIdsBook(String keyword){
        var bookIds = bookRepository.findBookIdsByTitle(keyword);
//        System.out.println("ids book "+bookIds.get(0));
        return bookIds.stream()
                .map(bookId -> SearchBook_InventoryResponse.builder()
                        .bookId(bookId.getBookId())
                        .build())
                .collect(Collectors.toList());

    }


    public BookInfoResponse getBookInfo(String id){
        var book = bookRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.BOOK_NOT_FOUND));
        var bookDetail = bookDetailRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.BOOK_NOT_FOUND));

        return bookMapper.toBookInfoResponse(book, bookDetail);
    }

    public Book_InventoryResponse getBookData(String id){
        var book = bookRepository.findBookById(id);
        var bookDetail = bookDetailRepository.findBookDetailById(id);
//        var publihsers = publisherRepository.findAll();

        Book_InventoryResponse bookInventoryResponse = Book_InventoryResponse.builder()
                .title(book.getTitle())
                .image(book.getImages().get(0))
                .publishers(bookDetail.getPublishers())
                .build();

        return bookInventoryResponse;

    }


    public Book_OrderResponse getBookDataForOrder(String id){
        var book = bookRepository.findBookById2(id);
//        var bookDetail = bookDetailRepository.findBookDetailById(id);
//        var publihsers = publisherRepository.findAll();

        System.out.println("book " + book.getPrice());
        Book_OrderResponse bookOrderResponse = Book_OrderResponse.builder()
                .title(book.getTitle())
                .image(book.getImages().get(0))
                .price(book.getPrice())
                .build();
        System.out.println("order book "+ bookOrderResponse.getPrice());
        return bookOrderResponse;

    }

    public BookInfoResponse update(String id, UpdateBookRequest request){
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        BookDetail bookDetail =bookDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

//        System.out.println("Update file " + request.getFiles());
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
//        System.out.println("Info " + request.getInfo());
        if(request.getInfo() != null || !request.getInfo().isEmpty()){

            bookDetail.setInfo(request.getCustomFieldsMap());
        }


        bookMapper.updateBookFromRequest(book, request);
        bookMapper.updateBookDetailFromRequest(bookDetail, request);

        // Update book counts
        updateBookCounts(bookDetail.getCategories());
        return bookMapper.toBookInfoResponse(bookRepository.save(book), bookDetailRepository.save(bookDetail));
    }

    public String delete(String id){
        BookDetail bookDetail = bookDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));


        Set<String> categoryIds = bookDetail.getCategories();
        ApiResponse<String> apiResponse = inventoryServiceClient.delete(id);


//        System.out.println("Delete" + apiResponse.getCode());
//        System.out.println("Delete" + apiResponse.getMessage());
//        System.out.println("Delete" + apiResponse.getData());
//        check the received quantity = 0 or not in inventory service
        if(apiResponse.getCode() == 200 && apiResponse.getData().equals("Delete success")){

            bookRepository.deleteById(id);
            bookDetailRepository.deleteById(id);

            // Update book counts
            updateBookCounts(categoryIds);
//            System.out.println("Delete Success");
            return "Delete success";
        }
        else if(apiResponse.getData().equals("Can not delete. Because Received quantity greater than 0")){
//            System.out.println("Can not delete");

            return "Can not delete";
        }

        return "Delete fail";

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

                if ((row.getCell(0) == null) || (row.getCell(0).getCellType() == CellType.BLANK) || (getCellValue(row.getCell(0)).isEmpty() )) {
                    break; // Exit the loop if the first cell is empty
                }


                CreateBookRequest request = new CreateBookRequest();
                request.setTitle(getCellValue(row.getCell(0)));


                // Lấy danh sách các category từ ô trong Excel
                String[] categoriesFromExcel = getCellValue(row.getCell(1)).split(",");
                if(categoriesFromExcel.length != 0){

                    Set<String> categoryIds = new HashSet<>();

                    for(String category : categoriesFromExcel){
                        var cate = categoryRepository.findByCategory(category.trim())
                                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
                        categoryIds.add(cate.getId());

                    }
                    request.setCategories(categoryIds);
                }


                String discountStr = getCellValue(row.getCell(2));
                if (!discountStr.isEmpty()) {
                    String[] parts = discountStr.split("\\.");
//                    System.out.println(parts[0]);
                    request.setDiscount(Integer.parseInt(parts[0]));
                }

//                request.setStatus(getCellValue(row.getCell(5)));
                var author = authorRepository.findByAuthorName(getCellValue(row.getCell(3)).trim())
                        .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));
                request.setAuthor(author.getId());


//                request.setPublishers(getCellValue(row.getCell(4)));

                // Lấy danh sách các publishers từ ô trong Excel
                String[] publishersFromExcel = getCellValue(row.getCell(4)).split(",");
                Set<String> publisherIds = new HashSet<>();

                for(String publisher : publishersFromExcel){
//                    System.out.println("publisher " + publisher);

                    var pub = publisherRepository.findByName(publisher.trim())
                            .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));
                    publisherIds.add(pub.getId());

                }
                request.setPublishers(publisherIds);


                request.setDescription(getCellValue(row.getCell(5)));

                request.setPrice(Double.parseDouble(getCellValue(row.getCell(6))));
                String quantityStr = getCellValue(row.getCell(7));
                if (!quantityStr.isEmpty()) {
                    String[] parts = quantityStr.split("\\.");
//                    System.out.println(parts[0]);
                    request.setQuantity(Integer.parseInt(parts[0]));
                }

                request.setTotalPrice(Double.parseDouble(getCellValue(row.getCell(8))));

                request.setInfo(getCellValue(row.getCell(9)));

                // Extract image URLs from the 11th column (index 10)
                List<String> imageUrls = getImageUrls(getCellValue(row.getCell(10)));
                request.setImageUrls(imageUrls);

                // Assume files will not be included in Excel import for simplicity
                request.setFiles(null);

//                System.out.println("quantity "+request.getQuantity());
//                System.out.println("TOtal price "+request.getTotalPrice());

//                System.out.println(request.getCategories());
//                System.out.println(request.getAuthor());
//                System.out.println(request.getPrice());
//                System.out.println(request.getDiscount());
//                System.out.println(request.getCustomFieldsMap());
//                System.out.println(request.getInfo());
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

    private List<String> getImageUrls(String cellValue) {
        if (cellValue.isEmpty()) {
            return Collections.emptyList();
        }
        String[] urls = cellValue.split(",");
        return Arrays.stream(urls).map(String::trim).collect(Collectors.toList());
    }
}
