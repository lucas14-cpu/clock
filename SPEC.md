# Backwards Clock — Specification

Last updated: 2026-11-26

## Purpose

A phone app (personal use, Android) for planning a sequence of steps
around a fixed time. Typical use: start from the time you must be
somewhere (e.g. practice at 18:30) and drag the minute hand backwards
to find out when earlier steps must happen (e.g. leave the office,
start cooking). Steps can also be placed forwards in time.

## Decisions made

| # | Topic | Decision |
|---|---|---|
| 1 | Reminders / notifications | Out of scope for now. Planned as the next step after the first version. |
| 2 | Interaction focus | The draggable analogue clock is the core of the app and gets the most attention. |
| 3 | Saved plans / templates | Discarded. Every plan is built from scratch each time. |
| 4 | Learning mode | On for this project. Concepts are explained as they are implemented. |
| 5 | Technology | Web app: HTML, CSS, JavaScript, installable as a PWA. Clock drawn in SVG. |
| 6 | Hosting | GitHub Pages. Git will be learned as part of this project. |
| 7 | Step overview | A list of steps under the clocks, sorted by time (see interaction flow). |

Known consequence of decision 5: a web app cannot reliably fire
notifications at an exact time while closed. When reminders become a
priority, a port to native Android (Kotlin) may be needed.

## Screen layout

1. **Analogue clock face** (top).
2. **Digital clock** (below the clock face).
3. **Step list** (below the digital clock): existing steps sorted by
   time, followed by one empty "new step" field.

## Interaction flow

1. **On launch** both clocks show the current time.
2. **Two-way sync:** dragging the minute hand updates the digital
   clock; typing a time into the digital clock moves the hands. Both
   always show the same selected time.
3. **Creating a step:** typing a name into the empty step field
   creates a step at the currently selected time. A new empty step
   field appears.
4. **Placing the next step:** drag the minute hand backwards (earlier
   step) or forwards (later step), then type that step's name into the
   new empty field.
5. **Selecting a step:** tapping an existing step selects it and moves
   both clocks to that step's time.
6. **Changing a step's time** (both ways work):
   - With a step selected, dragging the minute hand moves the step.
   - Editing the time field inside the step entry.
   The list re-sorts by time afterwards.
7. **Deleting a step:** a small "x" appears on the selected step;
   tapping it deletes the step.
8. **Step display:** each step shows only its name and its time. No
   durations between steps.

9. **Deselecting a step:** tapping anywhere outside the step list
   deselects the step. Dragging the hand then browses time again for
   the next new step.

## Open questions

- **Hour rollover display:** should the digital clock show the date or
  day if a plan crosses midnight? (Probably rare; likely ignore.)

## Ideas to consider (not committed)

- Snap to 5 minutes while dragging, with an option for 1-minute
  precision.
- Coloured arcs on the clock face showing each segment between steps
  (only readable for plans shorter than one hour).
- Markers on the clock face at each step's minute.

## Technical notes

- Angle of the minute hand from 12 o'clock, clockwise:
  $\theta = 6^\circ \cdot m$, where $m$ is the minute (0–59).
- Hour hand angle: $\theta_h = 30^\circ \cdot h + 0.5^\circ \cdot m$.
- Converting a touch point $(x, y)$ relative to the clock centre into
  an angle: $\theta = \operatorname{atan2}(x, -y)$ (screen $y$ grows
  downwards).
- Hour rollover is detected when the angle wraps between 0° and 360°
  during a drag; tracking the cumulative angle avoids jumps.
- **Single source of truth:** the app keeps one value, the selected
  time (e.g. minutes since midnight). Both clocks are drawn from that
  value; neither clock updates the other directly. This keeps the
  two-way sync simple and bug-free.
- Steps are stored as a list of `{ name, time }` objects and sorted by
  `time` whenever one changes.

## Git setup

Git is installed and the everyday commands are familiar; setting up a
repository from scratch is new. One-time steps:

1. Check identity: `git config --global user.name` and
   `git config --global user.email` (set them if empty).
2. `git init` in the project folder.
3. Add a `.gitignore` (e.g. `.venv/`, editor files).
4. First commit.
5. Create an empty repository on GitHub (public is required for free
   GitHub Pages).
6. Connect and push: `git remote add origin <url>`, then
   `git push -u origin main`.
7. On GitHub: Settings > Pages > deploy from branch `main`.

**Location:** the project lives in `C:\Users\lucas\Documents\clock`,
outside OneDrive, because OneDrive syncing a `.git` folder can lock or
corrupt files. GitHub serves as the backup.

## Next steps

1. Set up git and a GitHub repository; enable GitHub Pages (see
   "Git setup").
2. Build a static SVG clock face that shows a given time.
3. Make the minute hand draggable with touch, including hour rollover.
4. Add the digital clock with two-way sync.
5. Add the step list: create, tap to jump, re-sort on time change.
6. Resolve the open questions above as they come up.
7. Install the app on the phone from GitHub Pages (PWA).
8. Later: reminders / notifications at each step.
