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
@Table(name="item")
public class Item {

    @Id
    @Column(name="item_type")
    private int type;
    // 1 : 색깔, 2 : 장비 3 : 백그라운드

    @Column(name="item_name")
    private String name;
    //상점에 표시될 이름

    @Column(name="item_price")
    private int price;
    // 통일된 가격

    @Column(name="item_image")
    private String imageURL;
    // 상점 이미지 URL

    // List로 여러 Specification을 저장
    @ElementCollection
    @CollectionTable(name = "item_specifications", joinColumns = @JoinColumn(name = "item_type"))
    private List<Specification> specifications = new ArrayList<>();
}
