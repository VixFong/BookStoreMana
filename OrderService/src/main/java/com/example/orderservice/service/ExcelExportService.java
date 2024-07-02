package com.example.orderservice.service;

import com.example.orderservice.dto.request.CreateOrderRequest;
import com.example.orderservice.exception.AppException;
import com.example.orderservice.exception.ErrorCode;
import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderItem;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExcelExportService {

    @Autowired
    private OrderService orderService;
//    public ByteArrayInputStream exportOrdersToExcel(List<OrderResponse> orders) throws IOException {

    public ByteArrayInputStream exportOrdersToExcel(List<String> ids) throws IOException {

        if(ids != null){

            System.out.println("ids" + ids);
            List<Order> orders = orderService.findOrdersByIds(ids);

            System.out.println("orders " + orders);

            try (Workbook workbook = new XSSFWorkbook()) {
                Sheet sheet = workbook.createSheet("Orders");

                Row headerRow = sheet.createRow(0);
                String[] headers = {"ID", "Order Code", "Estimated Arrival Date", "Publisher", "Num Items", "Ship Fee", "Tax Fee", "Other Fee",  "Note", "Status", "Order Items"};
                for (int i = 0; i < headers.length; i++) {
                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(headers[i]);
                }

                int rowNum = 1;
                for (Order order : orders) {
                    Row row = sheet.createRow(rowNum++);
                    row.createCell(0).setCellValue(order.getId());
                    row.createCell(1).setCellValue(order.getOrderCode());
                    row.createCell(2).setCellValue(order.getEstimatedArrivalDate().toString());
                    row.createCell(3).setCellValue(order.getPublisher());
                    row.createCell(4).setCellValue(order.getNumItems());
                    row.createCell(5).setCellValue(order.getShipFee());
                    row.createCell(6).setCellValue(order.getTaxFee());
                    row.createCell(7).setCellValue(order.getOtherFee());
                    row.createCell(8).setCellValue(order.getNote());
                    row.createCell(9).setCellValue(order.getStatus());

                    String orderItems = order.getOrderItems().stream()
                            .map(item -> String.format("Image: %s,Title: %s, Qty: %d, Price: %.2f", item.getImage(),item.getTitle(), item.getPurchaseQty(), item.getPrice()))
                            .collect(Collectors.joining("; "));
                    row.createCell(10).setCellValue(orderItems);
                }

                ByteArrayOutputStream out = new ByteArrayOutputStream();
                workbook.write(out);

//                ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());
//                HttpHeaders httpHeaders = new HttpHeaders();
//                httpHeaders.add("Content-Disposition", "attachment; filename=orders.xlsx");

//                byte[] fileContent = in.readAllBytes();
//                return in.readAllBytes();
                return new ByteArrayInputStream(out.toByteArray());
            }
            catch (IOException e) {
                throw  new AppException(ErrorCode.FAIL_READING_EXCEL);
            }
        }
        throw  new AppException(ErrorCode.NO_DATA);
    }


    public void importOrdersFromExcel(MultipartFile file) {
        List<Order> orders = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(inputStream)) {


            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    // Skip header row
                    continue;
                }

//                Order order = new Order();

                CreateOrderRequest order = new CreateOrderRequest();
//                order.setId((long) row.getCell(0).getNumericCellValue());
//                order.setOrderCode(row.getCell(1).getStringCellValue());
                order.setEstimatedArrivalDate(LocalDate.parse(row.getCell(2).getStringCellValue(), formatter));
                order.setPublisher(row.getCell(3).getStringCellValue());
                order.setNumItems((int) row.getCell(4).getNumericCellValue());
                order.setShipFee(row.getCell(5).getNumericCellValue());
                order.setTaxFee((int)row.getCell(6).getNumericCellValue());
                order.setOtherFee(row.getCell(7).getNumericCellValue());
                order.setNote(row.getCell(8).getStringCellValue());
//                order.setStatus(row.getCell(9).getStringCellValue());

                String orderItemsString = row.getCell(10).getStringCellValue();
                List<OrderItem> orderItems = parseOrderItems(orderItemsString);
                order.setOrderItems(orderItems);


                orderService.create(order);
//                orders.add(order);
            }
        } catch (IOException e) {
            throw new AppException(ErrorCode.FAIL_PARSE_EXCEL);
        }
    }

    private List<OrderItem> parseOrderItems(String orderItemsString) {
        List<OrderItem> orderItems = new ArrayList<>();
        String[] items = orderItemsString.split("; ");
        for (String item : items) {
            String[] details = item.split(", ");
            OrderItem orderItem = new OrderItem();
            for (String detail : details) {
                String[] keyValue = detail.split(": ");
                switch (keyValue[0]) {
                    case "Image":
                        orderItem.setImage(keyValue[1]);
                        break;
                    case "Title":
                        orderItem.setTitle(keyValue[1]);
                        break;
                    case "Qty":
                        orderItem.setPurchaseQty(Integer.parseInt(keyValue[1]));
                        break;
                    case "Price":
                        orderItem.setPrice(Double.parseDouble(keyValue[1]));
                        break;
                }
            }
            orderItems.add(orderItem);
        }
        return orderItems;
    }
}
