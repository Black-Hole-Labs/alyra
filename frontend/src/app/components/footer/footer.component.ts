import { Component } from '@angular/core';
import { BlockchainConnectComponent } from "../blockchain-connect/blockchain-connect.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [BlockchainConnectComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
