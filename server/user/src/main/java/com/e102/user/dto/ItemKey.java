package com.e102.user.dto;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemKey implements Serializable {

    private int itemType;
    private int itemId;
    private String imageUrl;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ItemKey itemKey = (ItemKey) o;
        return Objects.equals(itemType, itemKey.itemType) &&
                Objects.equals(itemId, itemKey.itemId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(itemType, itemId);
    }
}
