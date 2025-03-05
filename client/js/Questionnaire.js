class Questionnaire extends HTMLLIElement {
    // Les datas du questionnaire
    constructor(data){
        super();
        this.id = data.id;
        this.name = data.name;
        this.uri = data.uri;
        this.textContent = this.name;
        this.onclick = this.details;
        
        this.style.listStyle = "none";
        this.style.fontWeight = "bold";
        this.style.textDecoration = "underline";
    }

    async getQuestions(){
        await fetch('http://127.0.0.1:5000' + this.uri)
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestions => {
            this.questions = []
            dataQuestions.forEach(dataQuestion => this.questions.push(new Question(dataQuestion)));
        })
        .catch(Utilitaire.errorServeur);
    }

    async details(){
        if (!this.questions){
            await this.getQuestions();
        }
        if (!this.formQuestionnaire){
            this.formQuestionnaire = new FormQuestionnaire();
            this.formQuestionnaire.fillFormQuestionnaire(this);
        }
        this.formQuestionnaire.show();
    }

    getQuestion(questionId){for(let question of this.questions){if(question.id == questionId){return question}}}
}
customElements.define("questionnaire-li", Questionnaire, { extends: "li" });
