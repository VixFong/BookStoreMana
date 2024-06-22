package com.example.productservice.dto.request;

import com.example.productservice.model.Category;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookRequest {

    private String bookId;
    private String bookDetailId;

    private String title;
    private Set<String> categories;
    private int discount;
    private boolean flashSale;
    private boolean lock;
    private List<MultipartFile> files;
    private List<String> imageUrls;
    private String status;

    private String author;
    private Set<String> publishers;
    private String description;
    private double price;

    private int quantity;
    private double totalPrice;

    private String info;  // Change this to String

    public HashMap<String, String> getCustomFieldsMap() {
        if (info == null || info.isEmpty()) {
            return new HashMap<>();
        }
        return parseCustomFields(info);
    }

    private HashMap<String, String> parseCustomFields(String customFields) {
        HashMap<String, String> map = new HashMap<>();
//       bỏ dấu " và {,}
        customFields = customFields.replace("{", "").replace("}", "").replace("\"","");
        String[] pairs = customFields.split(",");
        for (String pair : pairs) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                map.put(keyValue[0].trim(), keyValue[1].trim());
//                System.out.println("key "+keyValue[1]);

            }
        }
        return map;
    }

}
