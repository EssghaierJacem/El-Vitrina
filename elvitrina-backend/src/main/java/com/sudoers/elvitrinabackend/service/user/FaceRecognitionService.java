package com.sudoers.elvitrinabackend.service.user;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class FaceRecognitionService {

    public String runFaceRecognition() {
        try {
            String pythonExecutable = "python";
            ClassPathResource resource = new ClassPathResource("python-scripts/face_check.py");
            String scriptPath = resource.getFile().getAbsolutePath();

            ProcessBuilder builder = new ProcessBuilder(pythonExecutable, scriptPath);
            builder.redirectErrorStream(true);

            Process process = builder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return output.toString().trim();
            } else {
                return "Face recognition script failed:\n" + output;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Error running face recognition script: " + e.getMessage();
        }
    }

}
