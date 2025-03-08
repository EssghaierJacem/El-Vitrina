package com.sudoers.elvitrinabackend.service.store;

import com.sudoers.elvitrinabackend.model.entity.Store;
import com.sudoers.elvitrinabackend.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreService implements IStoreService{
    @Autowired
    private StoreRepository storeRepository;
    @Override
    public Store createStore(Store store) {
        return storeRepository.save(store);
    }

    @Override
    public Store getStoreById(Long id) {
        return storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + id));
    }

    @Override
    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }

    @Override
    public Store updateStore(Long id, Store storeDetails) {
        Store store = getStoreById(id);
        store.setStoreName(storeDetails.getStoreName());
        store.setDescription(storeDetails.getDescription());
        store.setCategory(storeDetails.getCategory());
        store.setStatus(storeDetails.isStatus());
        store.setAddress(storeDetails.getAddress());
        store.setImage(storeDetails.getImage());
        return storeRepository.save(store);
    }

    @Override
    public void deleteStore(Long id) {
        storeRepository.deleteById(id);
    }
}
