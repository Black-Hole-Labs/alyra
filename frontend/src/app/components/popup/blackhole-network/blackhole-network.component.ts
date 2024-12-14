import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-blackhole-network',
  standalone: true,
  templateUrl: './blackhole-network.component.html',
  styleUrls: ['./blackhole-network.component.css']
})
export class BlackholeNetworkComponent {
  @Output() networkSelected = new EventEmitter<string>(); // Создаем событие для передачи выбранной сети
	@Output() close = new EventEmitter<void>();

  selectNetwork(network: string) {
    console.log(`Selected network: ${network}`); // Лог для проверки
    this.networkSelected.emit(network); // Генерируем событие с выбранной сетью
		this.networkSelected.emit(network);  // Отправляем выбранную сеть
    this.close.emit();
  }
}
