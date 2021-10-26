package com.example.newdaism.entity;

import lombok.Data;

@Data
public class RequetDao extends  BasePageQuery {
    private String title;

    private String order;
    private String orderType;
}
