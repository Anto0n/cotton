package com.bionic.baglab.dto;


import com.bionic.baglab.dto.enums.ModelStatusEnum;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class ModelDtoCreate {
    @NotNull(message = "error.uid.notnull")
    private long userId;
    @NotNull(message = "error.bagTypeId.notnull")
    private long bagTypeId;
    @NotNull(message = "error.materialId.notnull")
    private long materialId;
    @NotNull(message = "error.mname.notnull")
    @Size(min = 1, max = 45, message = "error.mname.size")
    private String mname;
    @NotNull(message = "error.approved.notnull")
    private ModelStatusEnum approved;

    private String config;
    private String config2d;

    public ModelDtoCreate(long userId, long bagTypeId, long materialId, String mname, ModelStatusEnum approved, String config, String config2d) {
        this.userId = userId;
        this.bagTypeId = bagTypeId;
        this.materialId = materialId;
        this.mname = mname;
        this.approved = approved;
        this.config = config;
        this.config2d = config2d;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getBagTypeId() {
        return bagTypeId;
    }

    public void setBagTypeId(long bagTypeId) {
        this.bagTypeId = bagTypeId;
    }

    public long getMaterialId() {
        return materialId;
    }

    public void setMaterialId(long materialId) {
        this.materialId = materialId;
    }

    public String getMname() {
        return mname;
    }

    public void setMname(String mname) {
        this.mname = mname;
    }

    public ModelStatusEnum getApproved() {
        return approved;
    }

    public void setApproved(ModelStatusEnum approved) {
        this.approved = approved;
    }

    public String getConfig() {
        return config;
    }

    public void setConfig(String config) {
        this.config = config;
    }

    public String getConfig2d() {
        return config2d;
    }

    public void setConfig2d(String config2d) {
        this.config2d = config2d;
    }

    public ModelDtoCreate() {
    }
}
