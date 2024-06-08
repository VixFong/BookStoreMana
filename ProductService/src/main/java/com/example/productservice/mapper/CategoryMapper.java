package com.example.productservice.mapper;

import com.example.productservice.dto.request.CategoryRequest;
import com.example.productservice.model.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toCategory(CategoryRequest request);
}
