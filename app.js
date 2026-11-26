"use strict";

// SVG elements must be created in the SVG namespace, not the HTML one.
const SVG_NS = "http://www.w3.org/2000/svg";

const MINUTES_PER_HALF_DAY = 12 * 60;
const MINUTES_PER_DAY = 24 * 60;
const DEGREES_PER_MINUTE = 6;

// Single source of truth: the selected time, in minutes since midnight
// (0 to 1439). Everything on screen is drawn from this one value.
let selectedMinutes = currentMinutes();

const clock = document.getElementById("clock");
const minuteHand = document.getElementById("minute-hand");
const hourHand = document.getElementById("hour-hand");

function currentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

// The only place selectedMinutes is changed. Wraps around midnight in
// both directions, then redraws.
function setSelectedMinutes(minutes) {
  // In JavaScript, -10 % 1440 is -10, not 1430. Adding 1440 and taking
  // the remainder again turns any whole number into the range 0..1439.
  selectedMinutes = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  render();
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

// ---------------------------------------------------------------------
// Dragging
//
// The drag is relative: you can grab the clock anywhere, and the hand
// turns by the same angle your finger turns around the centre. The hand
// does not jump to the finger, so a finger covering the hand is no
// problem. Because only the change in angle is used, crossing 12 needs
// no special case: it simply adds or removes minutes, and the hour hand
// follows.
// ---------------------------------------------------------------------

let lastPointerAngle = null; // null means "not dragging"
let pendingDegrees = 0; // rotation not yet turned into whole minutes

// Angle of the pointer around the clock centre, in degrees,
// clockwise from 12 o'clock (range -180 to 180).
function pointerAngle(event) {
  const box = clock.getBoundingClientRect();
  const x = event.clientX - (box.left + box.width / 2);
  const y = event.clientY - (box.top + box.height / 2);
  return (Math.atan2(x, -y) * 180) / Math.PI; // -y: screen y grows downwards
}

function startDrag(event) {
  // Keep receiving move events even if the finger leaves the clock.
  clock.setPointerCapture(event.pointerId);
  lastPointerAngle = pointerAngle(event);
  pendingDegrees = 0;
}

function moveDrag(event) {
  if (lastPointerAngle === null) {
    return;
  }
  const angle = pointerAngle(event);
  let delta = angle - lastPointerAngle;
  // Going from 179 to -179 degrees is a 2 degree step, not -358.
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  lastPointerAngle = angle;

  pendingDegrees += delta;
  const wholeMinutes = Math.trunc(pendingDegrees / DEGREES_PER_MINUTE);
  if (wholeMinutes !== 0) {
    pendingDegrees -= wholeMinutes * DEGREES_PER_MINUTE;
    setSelectedMinutes(selectedMinutes + wholeMinutes);
  }
}

function endDrag() {
  lastPointerAngle = null;
}

clock.addEventListener("pointerdown", startDrag);
clock.addEventListener("pointermove", moveDrag);
clock.addEventListener("pointerup", endDrag);
clock.addEventListener("pointercancel", endDrag);

buildFace();
render();
