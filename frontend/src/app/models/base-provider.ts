// export abstract class BaseProvider {
//     protected networks: Record<string, any> = {};
  
//     constructor() {
//       this.loadNetworks();
//     }
  
//     protected async loadNetworks(): Promise<void> {
//       try {
//         const response = await fetch('/data/networks.json');
//         const networks = await response.json();
  
//         // Преобразуем массив сетей в объект для быстрого доступа
//         this.networks = networks.reduce((map: Record<string, any>, network: any) => {
//           map[network.id] = network;
//           return map;
//         }, {});
//       } catch (error) {
//         console.error('Failed to load networks:', error);
//       }
//     }
//   }
  