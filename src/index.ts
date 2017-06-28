let ArduinoFirmata = require('arduino-firmata');
import { SmoothieChart, TimeSeries } from 'smoothie'

let plotter = new SmoothieChart({
  responsive: true,
  minValue: -0.1,
  maxValue: 5.1
});

let canvasPlot = document.getElementById("plotA0");
plotter.streamTo(canvasPlot, 30);

var plotline = new TimeSeries();

plotter.addTimeSeries(plotline, {
  strokeStyle: 'rgba(0, 124, 0, 1)',
  lineWidth: 4
});


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

  setInterval( () => {
    let v = arduino.analogRead(0)*5.0/1023;
    let time = new Date().getTime();
    plotline.append(time, v);
  }, 30)
});
