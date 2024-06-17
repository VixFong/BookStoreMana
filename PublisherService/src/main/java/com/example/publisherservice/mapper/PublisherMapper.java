package com.example.publisherservice.mapper;


import com.example.publisherservice.dto.request.CreatePublisherRequest;
import com.example.publisherservice.dto.request.UpdatePublisherRequest;
import com.example.publisherservice.dto.response.PublisherResponse;
import com.example.publisherservice.model.Publisher;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PublisherMapper {

    Publisher toPublisher(CreatePublisherRequest request);

    PublisherResponse toPublisherResponse(Publisher publisher);

    void updatePublisher(@MappingTarget Publisher publisher, UpdatePublisherRequest request);
}
