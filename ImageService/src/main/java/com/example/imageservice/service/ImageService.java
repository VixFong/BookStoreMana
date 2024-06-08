package com.example.imageservice.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.imageservice.dto.ImageDTO;
import com.example.imageservice.exception.AppException;
import com.example.imageservice.exception.ErrorCode;
import com.example.imageservice.mapper.ImageMapper;
import com.example.imageservice.model.Image;
import com.example.imageservice.repo.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.*;

@Service
public class ImageService {

    private static final List<String> SUPPORTED_IMAGE_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ImageMapper imageMapper;

    public List<ImageDTO> uploadBookImages(List<MultipartFile> files, String folder) throws IOException {
        List<ImageDTO> imageDTOList = new ArrayList<>();

        for (MultipartFile file : files) {
            // Check file type
            if (!SUPPORTED_IMAGE_TYPES.contains(file.getContentType())) {
                throw new AppException(ErrorCode.IMAGE_TYPE_INVALID);
            }

            // Check file size
            if (file.getSize() > MAX_FILE_SIZE) {
                throw new AppException(ErrorCode.IMAGE_SIZE_INVALID);
            }

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", folder));
            String imageUrl = uploadResult.get("url").toString();


            String originalFileName = file.getOriginalFilename();
            ImageDTO imageDTO = updateOrSaveImage(originalFileName, imageUrl);
            imageDTOList.add(imageDTO);
        }

        return imageDTOList;
    }

    private ImageDTO updateOrSaveImage(String name, String url) {
        Optional<Image> imageOptional = imageRepository.findByName(name);
        Image image;
        if (imageOptional.isPresent()) {
            image = imageOptional.get();
            System.out.println("Image Service: " + image.getUrl());
//            image.setUrl(url);
        } else {
            image = new Image();
            image.setName(name);
            image.setUrl(url);
        }
        Image savedImage = imageRepository.save(image);
        return imageMapper.toImageDTO(savedImage);
    }


    public ImageDTO uploadImage(MultipartFile file, String folder) throws IOException {
        // Check file type
        if (!SUPPORTED_IMAGE_TYPES.contains(file.getContentType())) {
            throw new AppException(ErrorCode.IMAGE_TYPE_INVALID);
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new AppException(ErrorCode.IMAGE_SIZE_INVALID);

        }

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder",folder ));
        String imageUrl = uploadResult.get("url").toString();

        Image image = new Image();
        image.setName(file.getOriginalFilename());
        image.setUrl(imageUrl);
        Image savedImage = imageRepository.save(image);
//        String originalFileName = file.getOriginalFilename();



        return imageMapper.toImageDTO(savedImage);
    }



//    public ImageDTO getImage(String id) {
//        Optional<Image> imageOptional = imageRepository.findById(id);
//        if (imageOptional.isPresent()) {
//            return imageMapper.toImageDTO(imageOptional.get());
//        } else {
//            throw new AppException(ErrorCode.IMAGE_NOT_FOUND);
//        }
//    }
}
