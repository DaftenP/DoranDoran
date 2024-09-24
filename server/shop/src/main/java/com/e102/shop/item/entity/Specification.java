package com.e102.shop.item.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Specification {


    @Column(name ="sitem_id")
    private int id;

    @Column(name="sitem_name")
    private String name;

    @Column(name="simage_url")
    private String imageURL;
    // 상품 이미지 URL

}
