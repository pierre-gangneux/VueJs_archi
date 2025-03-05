-- DROP TABLE IF EXISTS questionnaire;
-- DROP TABLE IF EXISTS question;

-- CREATE TABLE questionnaire (
--     id int PRIMARY KEY,
--     nomQuestionnaire VARCHAR(100)
-- );

-- CREATE TABLE question (
--     id int PRIMARY KEY,
--     title VARCHAR(120),
--     questionType VARCHAR(120),
--     questionnaire_id int,
--     FOREIGN KEY (questionnaire_id) REFERENCES QUESTIONNAIRE (id)
-- );

INSERT INTO questionnaire (id, name) VALUES (1, "test");
INSERT INTO question (id, title, questionType, questionnaire_id) VALUES (1, "intitulé", "text", 1);