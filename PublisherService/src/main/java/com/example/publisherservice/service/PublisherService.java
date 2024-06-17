package com.example.publisherservice.service;

import com.example.publisherservice.dto.request.CreatePublisherRequest;
import com.example.publisherservice.dto.request.UpdatePublisherRequest;
import com.example.publisherservice.dto.response.PublisherResponse;
import com.example.publisherservice.exception.AppException;
import com.example.publisherservice.exception.ErrorCode;
import com.example.publisherservice.mapper.PublisherMapper;
import com.example.publisherservice.model.Publisher;
import com.example.publisherservice.repo.PublisherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
