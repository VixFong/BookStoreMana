package com.example.productservice.mapper;

import com.example.productservice.dto.request.AuthorRequest;
import com.example.productservice.model.Author;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")

public interface AuthorMapper {

    Author toAuthor(AuthorRequest request);
}
