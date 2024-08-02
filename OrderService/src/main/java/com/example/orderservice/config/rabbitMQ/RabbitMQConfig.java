package com.example.orderservice.config.rabbitMQ;


import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String ORDER_QUEUE = "orderQueue";

    public static final String ORDER_CUSTOMER_QUEUE = "orderCustomerQueue";

    public static final String UPDATE_STOCK_QUEUE = "updateStockQueue";

    @Bean
    public Queue orderQueue() {
        return new Queue(ORDER_QUEUE, false);
    }

    @Bean
    public Queue orderCustomerQueue() {
        return new Queue(ORDER_CUSTOMER_QUEUE, false);
    }

    @Bean
    public Queue updateStockQueue() {
        return new Queue(UPDATE_STOCK_QUEUE, false);
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(final ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
