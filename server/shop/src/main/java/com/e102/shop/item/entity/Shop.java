package com.e102.shop.item.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name="shop")
public class Shop {

    @Id
    @Column(name="shop_item_type")
    private int type;
    // 1 : 색깔, 2 : 장비 3 : 백그라운드

    @Column(name="shop_item_name")
    private String name;
    //상점에 표시될 이름

    @Column(name="shop_item_price")
    private int price;
    // 통일된 가격

    @Column(name="shop_item_image")
    private String imageURL;
    // 상점 이미지 URL

    // List로 여러 Specification을 저장
    @ElementCollection
    @CollectionTable(name = "item", joinColumns = @JoinColumn(name = "item_type"))
    private List<Item> items = new ArrayList<>();
}
