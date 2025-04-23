package com.sudoers.elvitrinabackend.service.ActionHistory;

import com.sudoers.elvitrinabackend.model.entity.ActionHistory;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.ActionHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActionHistoryService {

    @Autowired
    private ActionHistoryRepository historyRepo;

    public void logAction(String entityType, Long entityId, String actionType, String description, User user) {
        ActionHistory history = new ActionHistory();
        history.setEntityType(entityType);
        history.setEntityId(entityId);
        history.setActionType(actionType);
        history.setDescription(description);
        history.setTimestamp(LocalDateTime.now());
        history.setUser(user);
        historyRepo.save(history);
    }

    public List<ActionHistory> getAllActions() {
        return historyRepo.findAllByOrderByTimestampDesc();
    }
}
