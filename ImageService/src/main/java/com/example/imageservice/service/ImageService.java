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
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

        return imageMapper.toImageDTO(savedImage);
    }

    public ImageDTO uploadImageFromUrl(String imageUrl, String folder) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(new URL(imageUrl), ObjectUtils.asMap("folder",folder ));
        System.out.println("url " + imageUrl);
        String uploadedImageUrl = uploadResult.get("url").toString();

        Image image = new Image();
        image.setName(imageUrl.substring(imageUrl.lastIndexOf("/") + 1));
        image.setUrl(uploadedImageUrl);
        Image savedImage = imageRepository.save(image);

        return imageMapper.toImageDTO(savedImage);
    }

    public ImageDTO getImage(String id) {
        Optional<Image> imageOptional = imageRepository.findById(id);
        if (imageOptional.isPresent()) {
            return imageMapper.toImageDTO(imageOptional.get());
        } else {
            throw new AppException(ErrorCode.IMAGE_NOT_FOUND);
        }
    }
}
