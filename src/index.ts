let ArduinoFirmata = require('arduino-firmata');

let arduino_port = '/dev/cu.usbmodem1461';
let arduino = new ArduinoFirmata();
arduino.connect(arduino_port);
arduino.on('connect', () => {
  console.log("board version"+arduino.boardVersion);

  arduino.pinMode(13, ArduinoFirmata.OUTPUT);

  let status = true;
  setInterval(() => {
    status = !status;
    arduino.digitalWrite(13, status);
    if (status == true) console.log('stato led: acceso');
    else console.log('stato led: spento');
  }, 1000);
});
