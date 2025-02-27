import { Component } from '@angular/core';
import { BlockchainConnectComponent } from "../blockchain-connect/blockchain-connect.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [BlockchainConnectComponent, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
