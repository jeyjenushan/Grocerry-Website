package org.ai.server.service;

import org.ai.server.dto.Response;
import org.springframework.stereotype.Service;

@Service
public interface DashBoardService {
    Response getDashBoard();
}
