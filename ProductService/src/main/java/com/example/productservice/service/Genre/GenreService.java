//package com.example.productservice.service.Genre;
//
//import com.example.productservice.dto.request.AuthorRequest;
//import com.example.productservice.dto.request.GenreRequest;
//import com.example.productservice.exception.AppException;
//import com.example.productservice.exception.ErrorCode;
//import com.example.productservice.mapper.GenreMapper;
//import com.example.productservice.model.Author;
//import com.example.productservice.model.Genre;
//import com.example.productservice.repo.Genre.GenreRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class GenreService {
//    @Autowired
//    private GenreRepository genreRepository;
//
//    @Autowired
//    private GenreMapper genreMapper;
//
//    public Genre create(GenreRequest request){
//        if(genreRepository.existsGenreByGenre(request.getGenre())){
//            throw new AppException(ErrorCode.GENRE_EXISTED);
//        }
//        return genreRepository.save(genreMapper.toGenre(request));
//    }
//
//    public List<Genre> getAll(){return  genreRepository.findAll();}
//
//    public Genre edit(String id, GenreRequest request){
//
//        var genreEdit = genreRepository.findById(id)
//                .orElseThrow(() -> new AppException(ErrorCode.GENRE_NOT_FOUND));
//        System.out.println("name " + request.getGenre());
//
//        genreEdit.setGenre(request.getGenre());
//
//        return genreRepository.save(genreEdit);
//    }
//
//    public void delete(String id){
//        genreRepository.deleteById(id);
//    }
//
//}
