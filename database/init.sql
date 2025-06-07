CREATE DATABASE IF NOT EXISTS chatbot_db;
USE chatbot_db;

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    sender VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_sender (sender)
);

-- Insert some sample data
INSERT INTO messages (message, sender) VALUES 
    ('Hello! How can I help you today?', 'bot'),
    ('Welcome to the chatbot!', 'bot');