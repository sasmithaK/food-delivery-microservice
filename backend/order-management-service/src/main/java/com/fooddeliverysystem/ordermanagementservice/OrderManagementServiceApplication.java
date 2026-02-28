package com.fooddeliverysystem.ordermanagementservice;

import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.fooddeliverysystem"})
public class OrderManagementServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderManagementServiceApplication.class, args);
    }

}
