package com.example.productservice.mapper;


import com.example.productservice.dto.request.Publisher.CreatePublisherRequest;
import com.example.productservice.dto.request.Publisher.UpdatePublisherRequest;
import com.example.productservice.dto.response.PublisherResponse;
import com.example.productservice.model.Publisher;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PublisherMapper {

    Publisher toPublisher(CreatePublisherRequest request);

    PublisherResponse toPublisherResponse(Publisher publisher);

    void updatePublisher(@MappingTarget Publisher publisher, UpdatePublisherRequest request);
}
