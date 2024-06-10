package com.example.productservice.mapper;

import com.example.productservice.dto.request.CategoryRequest;
import com.example.productservice.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

//    @Mapping(target = "bookCount", ignore = true )
    Category toCategory(CategoryRequest request);
}
