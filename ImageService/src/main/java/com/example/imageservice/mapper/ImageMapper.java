package com.example.imageservice.mapper;

import com.example.imageservice.dto.ImageDTO;
import com.example.imageservice.model.Image;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImageMapper {

    ImageDTO toImageDTO(Image image);
}
