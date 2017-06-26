# Sviluppiamo un'app in Electron per controllare la scheda Arduino - parte 2

Ecco qui la seconda parte del mio tutorial sull'utilizzo di Electron per sviluppare un'applicazione Desktop in grado di interfacciarsi con Arduino.

Mentre nella prima [parte abbiamo](http://www.ludusrusso.cc/posts/2017-06-26-sviluppiamo-un-app-in-electron-per-controllare-la-scheda-arduino-parte-1) abbiamo visto come creare la nostra applicazione ed impostare la grafica, in questo parte entremo nel dettaglio su come utilizzare **arduino-firmata** per far comunicare la nostra applicazione con Arduino.

Ma prima di tutto, cerchiamo di capire cosa è **Firmata**.

### Il protocollo Firmata
[**Firmata**](https://github.com/firmata/protocol) è un protocollo pensato per permettere la comunicazione tra un microcontrollore ed un software su un computer. Il protocollo è pensato in modo da poter essere implementato sul firmware di qualsiasi microcontrollore e sul software di un qualsiasi computer. Firmata è già implemetato in Arduino ed è talmente popolare che nelle ultime versioni dell'IDE lo troviamo già disponibile all'installazione. Inoltre, firmata è disponibile su tantissimi linguaggi di programmazione, come Python o javascript in Node.

#### Firmata su Arduino
Firmata in Arduino può essere usata in due modi diversi:

 - il modo più semplice, è di utilizzare uno sketch preimpostato e general porpouse (**StandardFirmata**) che permette di interagire in modo semplice con la scheda Arduino dal computer principale, e permette (con delle API già impostate) di accedere alle varie funzionalità di Arduino, come accendi/spegni i led. Questo è il modo che utilizzerò in questo tutorial.
 -  il secondo modo, più interessante, è quello di sviluppare uno schetch custom sfruttando le varie funzionalità di firmata, in modo da creare uno sketch più leggero e che faccia esattamente quello che serve fare.

#### Firmata e Node.js

Come sapete, Node.js è una piattaforma che permette di sviluppare applicazioni in javascript che girano su un computer (invece che su un browser come normalmente avviene).

Per node, troviamo implementazioni già pronte di Firmata, e tra queste, vi è anche la libreria [arduino-firmata](https://github.com/shokai/node-arduino-firmata) che è già pronta per comunicare con lo schetch **StandardFirmata**.

## Installare Firmata su Arduino

L'installazione di Firmata su Arduino risulta essere molta facile. Infatti, lo Sketch **StandardFirmata** è già disponibile in Arduino accendendo da menu *File* ad *Esempi* > *Firmata* > *StandardFirmata*.

!()[]
!()[]

Una volta aperto lo Sketch, non ci resta che uploadarlo su un Arduino collegato via USB al computer. Dato che ci siamo, ricordiamo di segnare la porta seriale dell'Arduino, in quanto dovrà essere utilizzata nel nostro progetto!
