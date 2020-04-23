import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class NotificationService {

    private notificationPanel: ElementRef;
    private display = false;


    setNotificationPanel(notificationPanel: ElementRef) {
        this.notificationPanel = notificationPanel;
    }

    notify(message: string) {
        if (this.notificationPanel) {
            this.notificationPanel.nativeElement.innerHTML = message;
            this.toggleDisplay();

            setTimeout(() => this.toggleDisplay(), 3000);
        }
    }

    private toggleDisplay() {
        const panel = (this.notificationPanel.nativeElement as Element);
        if (panel.classList.contains('hide')) {
            panel.classList.remove('hide');
            panel.classList.add('display');
        } else {
            panel.classList.add('hide');
            panel.classList.remove('display');
        }
    }

}
