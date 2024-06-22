package com.example.productservice.service.Publisher;

import com.example.productservice.dto.request.Publisher.CreatePublisherRequest;
import com.example.productservice.dto.request.Publisher.UpdatePublisherRequest;
import com.example.productservice.dto.response.PublisherResponse;
import com.example.productservice.dto.response.Publisher_InventoryResponse;
import com.example.productservice.exception.AppException;
import com.example.productservice.exception.ErrorCode;
import com.example.productservice.mapper.PublisherMapper;
import com.example.productservice.model.Publisher;
import com.example.productservice.repo.Publisher.PublisherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PublisherService {
    @Autowired
    private PublisherRepository publisherRepository;

    @Autowired
    private PublisherMapper publisherMapper;

    public PublisherResponse create(CreatePublisherRequest request){
        if(publisherRepository.existsPublisherByName(request.getName())){
            throw new AppException(ErrorCode.PUBLISHER_EXISTED);
        }

        Publisher publisher = publisherMapper.toPublisher(request);
        publisherRepository.save(publisher);


        return publisherMapper.toPublisherResponse(publisher);
    }

    public List<PublisherResponse> getAll(){
        var publishers = publisherRepository.findAll();
        return publishers.stream().map(publisherMapper::toPublisherResponse).toList();
    }

    public List<Publisher_InventoryResponse> getPublisherName(){
        var publishers = publisherRepository.findAllIdAndName();
        List<Publisher_InventoryResponse> responses = publishers.stream()
                .map(publisher -> Publisher_InventoryResponse.builder()
                            .id(publisher.getId())
                            .name(publisher.getName())
                            .build())
                        .collect(Collectors.toList());
        return responses;
    }

    public PublisherResponse update(String id, UpdatePublisherRequest request){
        var publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PUBLISHER_NOT_FOUND));
        publisherMapper.updatePublisher(publisher, request);

        return publisherMapper.toPublisherResponse(publisherRepository.save(publisher));
    }

    public void delete(String id){
        publisherRepository.deleteById(id);
    }




}
