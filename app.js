"use strict";

// SVG elements must be created in the SVG namespace, not the HTML one.
const SVG_NS = "http://www.w3.org/2000/svg";

const MINUTES_PER_HALF_DAY = 12 * 60;

// Single source of truth: the selected time, in minutes since midnight
// (0 to 1439). Everything on screen is drawn from this one value.
let selectedMinutes = currentMinutes();

const minuteHand = document.getElementById("minute-hand");
const hourHand = document.getElementById("hour-hand");

function currentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

// Draw the 60 tick marks and the 12 numbers once at startup.
function buildFace() {
  const ticks = document.getElementById("ticks");
  for (let minute = 0; minute < 60; minute++) {
    const isMajor = minute % 5 === 0;
    const tick = document.createElementNS(SVG_NS, "line");
    tick.setAttribute("x1", 0);
    tick.setAttribute("y1", -92);
    tick.setAttribute("x2", 0);
    tick.setAttribute("y2", isMajor ? -82 : -87);
    tick.setAttribute("transform", `rotate(${minute * 6})`);
    tick.setAttribute("class", isMajor ? "tick major" : "tick");
    ticks.appendChild(tick);
  }

  const numbers = document.getElementById("numbers");
  const radius = 70;
  for (let hour = 1; hour <= 12; hour++) {
    const angle = (hour * 30 * Math.PI) / 180; // degrees to radians
    const label = document.createElementNS(SVG_NS, "text");
    label.setAttribute("x", radius * Math.sin(angle));
    label.setAttribute("y", -radius * Math.cos(angle)); // screen y grows downwards
    label.setAttribute("class", "number");
    label.textContent = hour;
    numbers.appendChild(label);
  }
}

// Update everything that depends on selectedMinutes.
function render() {
  const minuteAngle = (selectedMinutes % 60) * 6; // 6 degrees per minute
  const hourAngle = (selectedMinutes % MINUTES_PER_HALF_DAY) * 0.5; // 0.5 degrees per minute
  minuteHand.setAttribute("transform", `rotate(${minuteAngle})`);
  hourHand.setAttribute("transform", `rotate(${hourAngle})`);
}

buildFace();
render();
