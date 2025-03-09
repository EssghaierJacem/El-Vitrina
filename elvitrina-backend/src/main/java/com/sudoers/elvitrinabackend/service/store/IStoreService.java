package com.sudoers.elvitrinabackend.service.store;

import com.sudoers.elvitrinabackend.model.entity.Store;

import java.util.List;

public interface IStoreService {
    Store createStore(Store store);
    Store getStoreById(Long id);
    List<Store> getAllStores();
    Store updateStore(Long id, Store store);
    void deleteStore(Long id);
}
