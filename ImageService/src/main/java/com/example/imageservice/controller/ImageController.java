package com.example.imageservice.controller;

import com.example.imageservice.dto.ImageDTO;
import com.example.imageservice.exception.ApiResponse;
import com.example.imageservice.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/images")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @PostMapping("/upload")
    public ApiResponse<ImageDTO> uploadImage(@RequestParam("file") MultipartFile file, @RequestParam("folder") String folder) throws IOException {

        System.out.println("cont");
        ImageDTO imageDTO = imageService.uploadImage(file, folder);
        return ApiResponse.<ImageDTO>builder()
                .data(imageDTO)
                .build();

    }

    @PostMapping("/uploads")
    public ApiResponse<List<ImageDTO>> uploadImages(@RequestParam("files")  List<MultipartFile> files, @RequestParam("folder") String folder) throws IOException {

        System.out.println("cont");
        List<ImageDTO> imageDTOs = imageService.uploadBookImages(files, folder);
        return ApiResponse.<List<ImageDTO>>builder()
                .data(imageDTOs)
                .build();

    }

//    @PostMapping("/upload-url")
//    public ResponseEntity<ImageDTO> uploadImageFromUrl(@RequestParam("url") String url, @RequestParam("folder") String folder) {
//        try {
//            ImageDTO imageDTO = imageService.uploadImageFromUrl(url, folder);
//            return ResponseEntity.ok(imageDTO);
//        } catch (IOException e) {
//            return ResponseEntity.status(500).body(null);
//        }
//    }

//    @GetMapping("/{id}")
//    public ApiResponse<ImageDTO> getImageByName(@PathVariable String id) {
//        return ApiResponse.<ImageDTO>builder()
//                .data(imageService.getImage(id))
//                .build();
//    }
}

