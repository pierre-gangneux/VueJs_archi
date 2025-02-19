
class FormQuestionnaire extends HTMLDivElement {
    // Le formulaire du questionnaire
    constructor(isnew){
        super();
        let currentQuestionnaire = document.getElementById('currentQuestionnaire');
        Utilitaire.clearContent(currentQuestionnaire);
        currentQuestionnaire.append(this);

        let titreQuestionnaire = document.createElement('h1');
        titreQuestionnaire.textContent = 'Titre';
        titreQuestionnaire.id = 'titreQuestionnaire';
        this.append(titreQuestionnaire);

        let titreQuestionnaireInput = document.createElement('input');
        titreQuestionnaireInput.type = 'text';
        titreQuestionnaireInput.id = 'titreQuestionnaireInput';
        titreQuestionnaire.append(titreQuestionnaireInput);
        
        let questionsQuestionnaire = document.createElement('ul');
        questionsQuestionnaire.id = 'listeQuestions';
        this.append(questionsQuestionnaire);

        let tools = document.getElementById('tools');

        let del = tools.querySelector('#del');
        if (!del){
            if (!isnew){
                del = document.createElement('img');
                del.id = 'del';
                del.src = 'img/delete.png';
                del.onclick = () => this.deleteQuestionnaire();
                tools.append(del);
            }
        }
        else{
            if (isnew){
                del.remove();
            }
            else{
                del.onclick = () => this.deleteQuestionnaire();
            }
        }

        let save = tools.querySelector('#save');
        if (!save){
            save = document.createElement('img');
            save.id = 'save';
            save.src = 'img/save.png';
            tools.append(save);
        }

        if (isnew){
            save.alt = 'Enregistrer le questionnaire';
            save.onclick = () => this.saveNewQuestionnaire();
        }
        else{
            save.alt = 'Sauvegarder le changement';
            save.onclick = () => this.saveModifiedQuestionnaire();
        }
    }

    fillFormQuestionnaire(questionnaire){
        // modifier l'emplacement de l'id ou du questionnaire
        this.querySelector('#titreQuestionnaire').setAttribute('questionnaireId', questionnaire.id);
        this.querySelector('#titreQuestionnaireInput').value = questionnaire.name;
        questionnaire.questions.forEach(question => {
            new FormQuestion(this).fillFormQuestion(question);
        });
        let newQuestion = document.createElement('img');
        this.append(newQuestion);
        newQuestion.src = "img/new.png";
        newQuestion.onclick = () => new FormQuestion(this);
    }

    saveNewQuestionnaire(){
        let name = this.querySelector('#titreQuestionnaireInput').value;
        if (name == ''){
            Utilitaire.errorClient('Il est impossible de créer un questionnaire avec un titre vide');
        }
        else{
            // Création de la requête permettant de modifier le questionnaire
            fetch('http://localhost:5000/api/questionnaires',{
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({"name":name})
            })
            .then(response => {
                if (response.ok){
                    Utilitaire.successMessage('Insert Success');
                    return response.json();
                }
                else throw new Error('Problème ajax: ' + response.status);
            })
            .then(async dataQuestionnaire => {
                await QuestionnaireListe.getQuestionnaireListe().refreshQuestionnaireList();
                QuestionnaireListe.getQuestionnaireListe().getQuestionnaire(dataQuestionnaire.id).details();
                document.getElementById('save').remove();
            })
            .catch(Utilitaire.errorServeur);
        }
    }

    saveModifiedQuestionnaire(){
        let name = this.querySelector('#titreQuestionnaireInput').value
        if (name == ''){
            Utilitaire.errorClient('Il est impossible de modifier un questionnaire avec un titre vide');
        }
        else{
            // Création de la requête permettant de modifier le questionnaire
            fetch('http://localhost:5000/api/questionnaires',{
                headers: {'Content-Type': 'application/json'},
                method: 'PUT',
                body: JSON.stringify({"questionnaire_id":this.querySelector('#titreQuestionnaire').getAttribute('questionnaireId'),"name":name})
            })
            .then(response => {
                if (response.ok){
                    Utilitaire.successMessage('Update Success');
                    QuestionnaireListe.getQuestionnaireListe().refreshQuestionnaireList();
                }
                else throw new Error('Problème ajax: ' + response.status);
            })
            .catch(Utilitaire.errorServeur);
        }
    }

    deleteQuestionnaire(){
        // Création de la requête permettant de modifier le questionnaire
        fetch('http://localhost:5000/api/questionnaires',{
            headers: {'Content-Type': 'application/json'},
            method: 'DELETE',
            body: JSON.stringify({"questionnaire_id":this.querySelector('#titreQuestionnaire').getAttribute('questionnaireId')})
        })
        .then(response => {
            if (response.ok){
                Utilitaire.successMessage('Delete Success');
                QuestionnaireListe.getQuestionnaireListe().refreshQuestionnaireList();
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestionnaire => {
            Utilitaire.successMessage('Supression du questionnaire ' + dataQuestionnaire.name);
            this.remove();
            document.getElementById('del').remove();
            document.getElementById('save').remove();
        })
        .catch(Utilitaire.errorServeur);
    }
}
customElements.define("form-questionnaire", FormQuestionnaire, { extends: "div" });
