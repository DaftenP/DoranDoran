package com.e102.shop.item.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Item {

    @Column(name ="item_id")
    private int id;

    @Column(name="item_name")
    private String name;

    @Column(name="image_url")
    private String imageURL;
    // 상품 이미지 URL

}
