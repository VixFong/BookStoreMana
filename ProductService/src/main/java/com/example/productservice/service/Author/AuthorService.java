package com.example.productservice.service.Author;


import com.example.productservice.dto.request.AuthorRequest;
import com.example.productservice.exception.AppException;
import com.example.productservice.exception.ErrorCode;
import com.example.productservice.mapper.AuthorMapper;
import com.example.productservice.model.Author;
import com.example.productservice.repo.Author.AuthorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorService {
    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private AuthorMapper authorMapper;

    public Author create(AuthorRequest request){
        if(authorRepository.existsAuthorByAuthorName(request.getAuthorName())){
            throw new AppException(ErrorCode.AUTHOR_EXISTED);
        }
        return authorRepository.save(authorMapper.toAuthor(request));
    }

    public List<Author> getAll(){
        return authorRepository.findAll();
    }

    public Author edit(String id, AuthorRequest request){

        var editAuthor = authorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));
        System.out.println("name " + request.getAuthorName());

        editAuthor.setAuthorName(request.getAuthorName());

        return authorRepository.save(editAuthor);
    }

    public void delete(String id){
        authorRepository.deleteById(id);
    }

}
