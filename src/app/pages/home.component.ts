import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})
export class HomeComponent {
    activeTab: number = 0;

    setActiveTab(tabIndex: number): void {
        this.activeTab = tabIndex;
    }
}
