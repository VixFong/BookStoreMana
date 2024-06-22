package com.example.productservice.service.Category;

import com.example.productservice.dto.request.AuthorRequest;
import com.example.productservice.dto.request.CategoryRequest;
import com.example.productservice.exception.AppException;
import com.example.productservice.exception.ErrorCode;
import com.example.productservice.mapper.CategoryMapper;
import com.example.productservice.model.Author;
import com.example.productservice.model.Category;
import com.example.productservice.repo.BookDetailRepository;
import com.example.productservice.repo.BookRepository;
import com.example.productservice.repo.Category.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BookDetailRepository bookDetailRepository;

    @Autowired
    public CategoryMapper categoryMapper;


    public Category create(CategoryRequest request){
        if(categoryRepository.existsCategoriesByCategory(request.getCategory())){
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }
        return categoryRepository.save(categoryMapper.toCategory(request));
    }

    public List<Category> getAll(){
        return categoryRepository.findAll();
    }


    public Category edit(String id, CategoryRequest request){

        var editCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        System.out.println("name " + request.getCategory());

        editCategory.setCategory(request.getCategory());

        return categoryRepository.save(editCategory);
    }

    public void delete(String id){

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        System.out.println("cate id" + id);
        // Kiểm tra xem có sách nào chứa thông tin category đó không
        boolean categoryUsed = bookDetailRepository.existsByCategoriesContains(category.getId());

        if (categoryUsed) {
            throw new AppException(ErrorCode.CATEGORY_CONTAINS_BOOKS);
        }


        categoryRepository.deleteById(id);
    }




    public void updateBookCount(String categoryId, int bookCount) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        category.setBookCount(bookCount);
        categoryRepository.save(category);
    }


}
