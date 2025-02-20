function loadScript(src) {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(`Script chargé : ${src}`);
        script.onerror = () => reject(`Erreur de chargement du script : ${src}`);
        document.head.append(script);
    });
}

function init(){
    // Ajoute le bouton permettant de récupérer les questionnaires
    document.getElementById('button').onclick = () => QuestionnaireListe.getQuestionnaireListe().refreshQuestionnaireList();
    // Ajoute le bouton permettant de créer un nouveau questionnaire
    document.querySelector('#tools #add').onclick = () => FormQuestionnaire.newFormQuestionnaire();
}

loadScript("js/Utilitaire.js")
    .then(() => loadScript("js/QuestionnaireListe.js"))
    .then(() => loadScript("js/Questionnaire.js"))
    .then(() => loadScript("js/FormQuestionnaire.js"))
    .then(() => loadScript("js/Question.js"))
    .then(() => loadScript("js/FormQuestion.js"))
    .then(() => init())
    .catch(error => console.error(error));
