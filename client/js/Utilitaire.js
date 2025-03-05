class Utilitaire{
    static clearContent(element){
        while(element.firstChild){
            element.removeChild(element.firstChild);
        }
    }

    static showNotification(message, color, bold) {
        let container = document.getElementById("notification-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "notification-container";
            container.style.position = "fixed";
            container.style.top = "25px";
            container.style.left = "25px";
            container.style.zIndex = "1000";
            container.style.display = "flex";
            container.style.flexDirection = "column-reverse";
            container.style.gap = "5px";
            document.body.appendChild(container);
        }
    
        const notification = document.createElement("div");
        notification.textContent = message;
        if (color){
            notification.style.background = color;
        }
        else{
            notification.style.background = "#333";
        }
        if (bold){
            notification.style.fontWeight = "bold";
        }
        notification.style.color = "white";
        notification.style.padding = "10px";
        notification.style.borderRadius = "15px";
        notification.style.opacity = "0";
        notification.style.transition = "opacity 0.3s, transform 0.3s";
        notification.style.transform = "translateY(-10px)";
        notification.style.minWidth = "10em";
    
        container.appendChild(notification);
    
        for (let i = -10; i < 0; i += 2){
            setTimeout(() => {
                notification.style.transform = `translateY(${i})`;
            }, 2);
        }
        setTimeout(() => {
            notification.style.opacity = "1";
        }, 10);
    
        setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateY(-10px)";
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    static showMessage(err, msg, color, bold){
        if (msg != ''){
            Utilitaire.showNotification(msg, color, bold);
        }
        if (err != ''){
            let css = '';
            if (color){
                css += `color:${color};`;
            }
            if (bold){
                css += 'font-weight: bold;';
            }
            if (css.length){
                console.log(`%c ${err}`, css);
            }
            else{
                console.log(err);
            }
        }
    }
    
    static errorServeur(err, msg){
        if (err && !msg){
            Utilitaire.showMessage(err, '', 'red', true);
        }
        if (!err && msg){
            Utilitaire.showMessage('', msg, 'red', true);
        }
        if (err && msg){
            Utilitaire.showMessage(err, msg, 'red', true);
        }
    }

    static errorClient(msg){
        Utilitaire.showMessage(msg, msg, 'orange', true);
    }

    static successMessage(msg){
        Utilitaire.showMessage(msg, msg, 'green', true);
    }
}
