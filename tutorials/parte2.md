# Sviluppiamo un'app in Electron per controllare la scheda Arduino

In un mio [precedente post](http://www.ludusrusso.cc/posts/2017-06-04-primi-test-con-typescript-ed-electron) vi ho parlato di come creare una semplicissima applicazione sfruttando Electron e il nuovo linguaggio di programmazione TypeScript. In questo periodo, nel tempo libero, ho approfondito un po' queste tecnologie, ed oggi vi propongo qui un tutorial completo su come sviluppare un'applicazione in Electron per il controllo di una scheda Arduino connessa via USB al computer su cui gira l'applicazione.

Il tutorial sarà diviso in due parti:

 - Nella prima parte (questa), imposteremo ed entreremo nel dettaglio dell'utilizzo di Electron. Questa parte può quindi essere considerata una versione riveduta e corretta del mio [precedente post](http://www.ludusrusso.cc/posts/2017-06-04-primi-test-con-typescript-ed-electron).
 - Nella seconda parte, ci interfacceremo ad Aruduino da TypeScript.

Questo tutorial si basa sul protocollo **Firmata** e sulla libreria **arduino-firmata** in Node.js. Vedremo nel dettaglio in seguito di cosa parliamo.

In questo tutorial, useremo anche l'interessantissimo progetto [electron-compile](https://github.com/electron/electron-compile), che essenzialmente permette direttamente di utilizzare codice **TypeScritp** (ed altri linguaggi ad alto livello per web) senza doverlo prima compilare.

### Il protocollo Firmata
[**Firmata**](https://github.com/firmata/protocol) è un protocollo pensato per permettere la comunicazione tra un microcontrollore ed un software su un computer. Il protocollo è pensato in modo da poter essere implementato sul firmware di qualsiasi microcontrollore e sul software di un qualsiasi computer. Firmata è già implemetato in Arduino ed è talmente popolare che nelle ultime versioni dell'IDE lo troviamo già disponibile all'installazione. Inoltre, firmata è disponibile su tantissimi linguaggi di programmazione, come Python o javascript in Node.

#### Firmata su Arduino
Firmata in Arduino può essere usata in due modi diversi:

 - il modo più semplice, è di utilizzare uno sketch pre impostasto e general porpouse (**StandardFirmata**) che permette di interagire in modo semplice con la scheda Arduino dal computer principale, e permette (con delle API già impostate) di accedere alle varie funzionalità di Arduino, come accendi/spegni i led. Questo è il modo che utiilizzerò in questo tutorial.
 -  il secondo modo, più interessante, è quello di sviluppare uno schetch custom sfruttando le varie funzionalità di firmata, in modo da creare uno sketch più leggero e che faccia esattamente quello che serve fare.

#### Firmata e Node.js

Come sapete, Node.js è una piattaforma che permette di sviluppare applicaizoni in javascript che girano su un computer (invece che su un browser come normalmente avviene). 

Per node, troviamo implementazioni già pronte di Firmata, e tra queste, vi è anche la libreria [arduino-firmata](https://github.com/shokai/node-arduino-firmata) che è già pronta per comunicare con lo schetch **StandardFirmata**.

## Creazione del progetto e installazione delle librerie

Vediamo come inzializzare il progetto ed installare le librerie necessarie.

### Inizializzazione del progetto Node

Dopo aver scaricato **node.js**, come illustrato nel mio [precedente post](http://www.ludusrusso.cc/posts/2017-06-04-primi-test-con-typescript-ed-electron), creiamo un nuovo progetto chiamato `electron-arduino`:

```bash
$ mkdir electron-arduino
$ cd electron-arduino
$ npm init
```

Dopo aver eseguito il comando `npm init`, rispondiamo alle domande per creare il progetto node.

### Installazione delle dipendenze

Possiamo quindi iniziare ad installare le dipendenze di cui abbiamo bisogno. In particolare, installeremo le librerie `electron`, `electron-rebuild` (come dipendenze per lo sviluppo) e `arduino-firmata` (come dipendenza standard):

```bash
$ npm install --save-dev electron-prebuilt-compile electron-rebuild
$ npm install --save arduino-firmata
```


Alcune note: 

 - `electron-prebuilt-compile` è una versione precompilata di electron-compile, che ci permette di utilizzarlo esattamente come se fosse electron.
 - `electron-rebuild` è un progetto in grado di rimpilare automaticamente i vari pacchetti installati in base alla versione di Node.js che sta utilizzando electron. Serve in pratica per risolvere conflitti di dipendenze. Qui lo utilizziamo in quanto, almeno sul mio computer, si è verificato un conflitto tra electron e la libreria `serialport`, da cui dipende `arduino-firmata`.

Andiamo anche ad installare `typescript` in quanto useremo quelo linguaggio, invece che javascript, per lo sviluppo dell'applicazione

```bash
$ npm install --save-dev  typescript
```


## Iniziamo ad implementare l'applicazione

Siamo quindi pronti per iniziare a scrivere codice. Al momento svilupperemo lo scheletro dell'app, che si compone di due file principali:

 - Il file `app.ts` conterrà il codice per creare e lanciare l'applicazione electron.
 - Il file `index.html` conterrà un template html per gestire l'aspetto dell'applicazione.
 - Il file `index.ts`, che conterrà il codice TypeScript che verrà eseguito una volta renderizzata la finestra.

Creiamo quindi una cartella `src` in cui inserire tutti i sorgenti dell'app, e creiamo questi due file al suo interno:

```bash
$ mkdir src && cd src
$ touch app.ts  index.html index.ts
```

### Il file `app.ts`

Ad essere onesti, il file `app.ts` deve fare veramente poche operazioni: in particolare, deve creare una finestra grafica (di dimensioni specificate da noi) e renderizzare al suo interno il file `index.html`.

Vediamo quindi come implementare questo semplice codice. Apriamo questo file con un qualsiasi editor di test e iniziamo a scrivere.

Per prima cosa, importiamo gli oggetti `app` e `BrowserWindow` da `electron`:

```typescript
import {app, BrowserWindow} from 'electron'
```
`app` reppresenza l'istanza dell'applicazione che stiamo creando, mentre `BrowserWindow` è una classe necessaria per la creazione di finistre grafiche.

A questo punto, è necessario aspettare che l'applicazione venga correttamente caricata prima di fare qualsiasi operazione. Per farlo, possiamo usare la funzione `app.on`, che crea una callback in base ad alcuni eventi del ciclo vita dell'applicazione. A noi, in particolare, interessa l'evento `ready`, che viene eseguito quando l'app è stata correttamente caricata:
 
```typescript
app.on('ready', () => {
  // codice da implementare
});
```

Come vedete, il secondo argomento della funzione è un'altra funzione (callback), che verrà eseguita solo quando l'app sarà pronta.

All'interno della callback, creiamo la nostra finestra, usando l'oggetto `BrowserWindow`, dandogli una dimensione di 600x800:

```typescript
app.on('ready', () => {
  let mainWindow = new BrowserWindow({width: 800, height: 600});
  // codice da implementare
});
```
Per finire, carichiamo all'interno della finistra il file `index.html`:

```typescript
app.on('ready', () => {
  let mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
});
```
Si noti l'utilizzo della variabile `__dirname`, che contiene al suo interno il path globale della cartella all'interno della quale ci troviamo.

Ecco il codice completo sviluppato:

```typescript
import {app, BrowserWindow} from 'electron'

app.on('ready', () => {
  let mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
});
```

### Il file `index.html`
Mentre il file `app.ts` rimarrà invariato da qui alla fine del tutorial, il file `index.html` sarà un po' più complicato e ci lavoreremo molto. 
Per il momento, per arrivare il prima possibile a far girare l'applicazione, sviluppaimo un file più semplice possibile :D

Apriamo il file `index.html` e scriviamo questo codice:

```html
<html>
    <head>
        <title>Arduino Electron</title>
    </head>
    <body>
        <h1>Funziona</h1>
    </body>
</html>
```

In questo file, abbiamo implementato il titolo (*Arduino Electron*) e stampiamo nella finestra, con tag `h1` la stringa *Funziona*.

### Testiamo l'applicazione

Siamo quasi pronti per far partire l'applicazione, un ultimo sforzo è necessario per configurare il file `package.json` per dire ad `npm` cosa fare per avviare l'app.

Apriamo il file `package.json`, e modifichiamo il campo `main`, in modo da settarlo a `src/app.ts`.  In questo modo diremo all'applicazione che lo script principale è questo file.

Inoltre, all'interno del campo `scripts`, settiamo `start` ad `electron .`. In questo modo, informiamo npm, eseguendo il comando `npm start`, dovremmo lanciare electron!

Possiamo anche rimuovere lo script `test`. Il file dovrebbe apparire come segue:

```json
{
  ...
  "main": "src/app.ts",
  "scripts": {
    "start": "electron ."
  },
  ...
}
```

Una volta salvato il file, lanciamo il comando `npm start` per avviare l'applicazione. Se tutto va come deve, si aprira la finestra che vedete in figura. Si noti il titolo e il suo contenuto!

![Electron app base](https://github.com/ludusrusso/electron-arduino/blob/master/img/first.png?raw=true)

### Il file `index.ts`

A differenza del file `app.ts`, che serve semplicemente per far partire l'applicazione, il file `index.ts` conterrà l'*intelligenza* dell'applicazione stessa, cioè il codice che ne decide il comportamento. Questo file è separato dal primo in quanto è associato alla finestra della nostra app, e quindi al file `index.html` (non è un caso che entrambi i file abbiano lo stesso nome). 

In gergo, il file `main.ts` viene chiamato **main process**, mentre il file `index.ts` è detto **render process**.

Il fatto di avere due file può sembrare confusionario, ma questa scelta si comprende meglio se immaginiamo un'applicazione con più finestre. In questo caso, avremmo sempre un unico **main process**, ma tanti **render process** quante sono le finistre!

Capito (spero) questo concetto di Electron, iniziamo ad implementare un semplice  file `index.ts` che cambia il contenuto del tag `h1`, per vedere se tutto fuonziona correttamente. Apriamo il file  `index.ts` e sviluppaimo il seguente codice:

```typescript
let title_h1 = document.getElementById('title_id');
title_h1.innerHTML="Sono il processo di render";
```

La prima riga, serve per selezionare dal documento html (il file `index.html`) l'emento avente **id** pari a *title_id*.
La seconda riga, cambia il contenuto di tale elemento con la stringa *Sono il processo di render*.

Come è possibile immaginare, prima di testare l'applicazione, dobbiamo modificare il file `index.html`. Le modifiche sono due:

 - Aggiungere l'id *title_id* all'elemento `h1`, modificando la riga corrispondente come segue: `<h1 id="title_id">Funziona</h1>`;
 - Importare lo script `index.ts` alla fine del file, aggiungdo le seguenti linee prima della chiusura del tag `html`:
 
  ```html
    <script>
        require('./index.ts')
    </script>
  ```
  
Il file `index.html` dovrà quindi avere la seguente forma:

```html
<html>
    <head>
        <title>Arduino Electron</title>
    </head>
    <body>
        <h1 id="title_id">Funziona</h1>
    </body>
    <script>
        require('./index.ts')
    </script>
</html>
```

Salviamo i file, rilanciamo il programma digitando `npm start`, e dovrebbe apparire la finestra nell'immagine seguente:

![Render process funzionante](https://github.com/ludusrusso/electron-arduino/blob/master/img/render.png?raw=true)

Si noti come il processo di render modifica l'html della nostra applicazione.

L'applicazione sviluppata fino a questo punto è disponibile a [questo link](https://github.com/ludusrusso/electron-arduino/tree/55c979ed57b39dcbaf9efd3d8a2ebbfbdbdccf5d).
