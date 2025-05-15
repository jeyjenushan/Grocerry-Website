package org.ai.server.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CloudinaryService {
    String uploadFile(MultipartFile file) throws IOException;
    void deleteFile(String publicId);
    String getFileUrl(String publicId);
}
