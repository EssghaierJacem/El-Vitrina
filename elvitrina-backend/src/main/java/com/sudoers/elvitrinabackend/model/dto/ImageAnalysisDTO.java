package com.sudoers.elvitrinabackend.model.dto;

import java.util.List;

public class ImageAnalysisDTO {
    private String category;
    private List<String> tags;
    private String description;
    private boolean success;

    public ImageAnalysisDTO() {
        this.success = false;
    }

    public ImageAnalysisDTO(String category, List<String> tags, String description) {
        this.category = category;
        this.tags = tags;
        this.description = description;
        this.success = true;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
} 