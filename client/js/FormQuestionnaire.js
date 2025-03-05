class FormQuestionnaire extends HTMLDivElement {
    // Le formulaire du questionnaire
    constructor(isnew){
        super();

        // Création du nom du questionnaire
        let titreQuestionnaire = document.createElement('h1');
        titreQuestionnaire.textContent = 'Titre';
        titreQuestionnaire.id = 'titreQuestionnaire';
        this.append(titreQuestionnaire);

        titreQuestionnaire.style.display = "flex";
        titreQuestionnaire.style.alignItems = "center";
        titreQuestionnaire.style.padding = "0.3em";
        titreQuestionnaire.style.gap = "0.5em";

        // Création de l'input pour le nom du questionnaire
        let titreQuestionnaireInput = document.createElement('input');
        titreQuestionnaireInput.type = 'text';
        titreQuestionnaireInput.id = 'titreQuestionnaireInput';
        titreQuestionnaire.append(titreQuestionnaireInput);

        titreQuestionnaireInput.style.padding = "0.5em";
        titreQuestionnaireInput.style.borderRadius = "15px";
        titreQuestionnaireInput.style.border = "none";

        if (!isnew){
            let questionsQuestionnaire = document.createElement('ul');
            questionsQuestionnaire.id = 'listeQuestions';
            this.append(questionsQuestionnaire);
        }

        // Récupération de la bar d'outils
        let tools = document.getElementById('tools');

        // Gestion du bouton de suppression du questionnaire
        let del = tools.querySelector('#del');
        // Si le bouton n'existe pas
        if (!del){
            // Et que le questionnaire n'est pas nouveau
            if (!isnew){
                // On créer le bouton
                del = document.createElement('img');
                del.id = 'del';
                del.src = 'img/delete.png';
                del.onclick = () => this.deleteQuestionnaire();
                tools.append(del);
            }
            // Et que le questionnaire est nouveau, 
            // on ne fait rien car on n'a pas besoin du bouton
        }
        // Si le bouton existe
        else{
            // Si le questionnaire est nouveau
            if (isnew){
                // On supprime le bouton, 
                // il est inutile et pourrais même créer des problèmes
                del.remove();
            }
            // Si le questionnaire n'est pas nouveau
            else{
                // On change quel questionnaire doit être supprimer en appuyant sur le bouton
                del.onclick = () => this.deleteQuestionnaire();
            }
        }

        // Gestion du bouton de sauvegarde du questionnaire
        let save = tools.querySelector('#save');
        // Si le bouton n'existe pas, 
        // seulement quand l'éditeur de questionnaire est vide
        if (!save){
            // On le créer
            save = document.createElement('img');
            save.id = 'save';
            save.src = 'img/save.png';
            tools.append(save);
        }

        // Si le questionnaire est nouveau
        if (isnew){
            // On sauvegarde le questionnaire lorsque l'on clique sur le bouton
            save.alt = 'Enregistrer le questionnaire';
            save.onclick = () => this.saveNewQuestionnaire();
        }
        // Si le questionnaire n'est pas nouveau
        else{
            // On sauvegarde les changements lorsque l'on clique sur le bouton
            save.alt = 'Sauvegarder le changement';
            save.onclick = () => this.saveModifiedQuestionnaire();
        }
    }

    fillFormQuestionnaire(questionnaire){
        // Enregistrement du questionnaire
        this.questionnaire = questionnaire;
        this.querySelector('#titreQuestionnaireInput').value = this.questionnaire.name;
        this.questionnaire.questions.forEach(question => {
            new FormQuestion(this).fillFormQuestion(question);
        });
        let newQuestion = document.createElement('img');
        this.append(newQuestion);
        newQuestion.src = "img/new.png";
        newQuestion.onclick = () => new FormQuestion(this);
    }

    saveNewQuestionnaire(){
        // Récupération du nom du nouveau questionnaire
        let name = this.querySelector('#titreQuestionnaireInput').value;
        // Si le nom est vide, on déclenche une erreur client
        if (name == ''){
            Utilitaire.errorClient('Il est impossible de créer un questionnaire avec un titre vide');
        }
        // S'il ne l'est pas, on fait la requête à l'API
        else{
            // Création de la requête permettant de sauvegarder le nouveau questionnaire
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
                // On met à jour la liste des questionnaires
                await QuestionnaireListe.getQuestionnaireListe().refreshQuestionnaireList();
                // On affiche le questionnaire nouvellement créer
                QuestionnaireListe.getQuestionnaireListe().getQuestionnaire(dataQuestionnaire.id).details();
            })
            .catch(Utilitaire.errorServeur);
        }
    }

    saveModifiedQuestionnaire(){
        // Récupération du nouveau nom du questionnaire
        let name = this.querySelector('#titreQuestionnaireInput').value

        const errors = [];
        // Si le nom est vide, on déclenche une erreur client
        if (name == '') errors.push('Il est impossible de modifier un questionnaire avec un titre vide');
        // Si le nouveau nom n'est pas différent du nom actuel
        if (name == this.questionnaire.name) errors.push("Le titre du questionnaire n'a pas changé");
        // S'il y a des erreurs, on les affiches
        if (errors.length){
            errors.forEach(error => Utilitaire.errorClient(error));
        }
        // S'il n'y en a pas, on fait la requête à l'API
        else{
            // Création de la requête permettant de modifier le questionnaire
            fetch('http://localhost:5000/api/questionnaires',{
                headers: {'Content-Type': 'application/json'},
                method: 'PUT',
                body: JSON.stringify({"questionnaire_id":this.questionnaire.id,"name":name})
            })
            .then(response => {
                if (response.ok){
                    Utilitaire.successMessage('Update Success');
                    return response.json();
                }
                else throw new Error('Problème ajax: ' + response.status);
            })
            .then(async dataQuestionnaire => {
                // On met à jour la liste des questionnaires
                await QuestionnaireListe.getQuestionnaireListe().refreshQuestionnaireList();
                // On charge le questionnaire modifier dans le formulaire
                this.questionnaire = QuestionnaireListe.getQuestionnaireListe().getQuestionnaire(dataQuestionnaire.id)
            }
            )
            .catch(Utilitaire.errorServeur);
        }
    }

    deleteQuestionnaire(){
        // Création de la requête permettant de supprimer le questionnaire
        fetch('http://localhost:5000/api/questionnaires',{
            headers: {'Content-Type': 'application/json'},
            method: 'DELETE',
            body: JSON.stringify({"questionnaire_id":this.questionnaire.id})
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
            Utilitaire.successMessage(`Supression du questionnaire ${dataQuestionnaire.name}`);
            // On supprime le formulaire
            this.remove();
            // On supprime les boutons,
            // ils ne servent plus à rien et risquent de créer des problèmes s'ils restent présent
            document.getElementById('del').remove();
            document.getElementById('save').remove();
        })
        .catch(Utilitaire.errorServeur);
    }

    show(){
        let currentQuestionnaire = document.getElementById('currentQuestionnaire');
        Utilitaire.clearContent(currentQuestionnaire);
        currentQuestionnaire.append(this);
    }
    
    static newFormQuestionnaire(){return new FormQuestionnaire(true).show()}
}
customElements.define("form-questionnaire", FormQuestionnaire, { extends: "div" });
