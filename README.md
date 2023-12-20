# Hydra Midi

A utility script for using midi with https://hydra.ojack.xyz.

## Usage

Start (and optionally show) midi and use midi inputs as parameters for hydra:

```js
// You can either use `@latest` or load a specific version with, for example, `@0.4.3`.
await loadScript('https://cdn.jsdelivr.net/npm/hydra-midi@latest/dist/index.js')

// Use midi messages from all channels of all inputs.
await midi.start({ channel: '*', input: '*' })
// Show a small midi monitor (similar to hydra's `a.show()`).
midi.show()

// Use any note to control the red amount of hydra's `solid()` function.
solid(note('*'), 0, 1).out()

// Or, if you are using a midi controller and not a keyboard:
// Use a control change value to control the red amount.
// solid(cc(74), 0, 1).out()
```

[Edit on hydra](https://hydra.ojack.xyz/?code=JTJGJTJGJTIwWW91JTIwY2FuJTIwZWl0aGVyJTIwdXNlJTIwJTYwJTQwbGF0ZXN0JTYwJTIwb3IlMjBsb2FkJTIwYSUyMHNwZWNpZmljJTIwdmVyc2lvbiUyMHdpdGglMkMlMjBmb3IlMjBleGFtcGxlJTJDJTIwJTYwJTQwMC40LjAlNjAuJTBBYXdhaXQlMjBsb2FkU2NyaXB0KCUwQSUyMCUyMCdodHRwcyUzQSUyRiUyRmNkbi5qc2RlbGl2ci5uZXQlMkZucG0lMkZoeWRyYS1taWRpJTQwbGF0ZXN0JTJGZGlzdCUyRmluZGV4LmpzJyUwQSklMEElMEElMkYlMkYlMjBVc2UlMjBtaWRpJTIwbWVzc2FnZXMlMjBmcm9tJTIwYWxsJTIwY2hhbm5lbHMlMjBvZiUyMGFsbCUyMGlucHV0cy4lMEFhd2FpdCUyMG1pZGkuc3RhcnQoJTdCJTIwY2hhbm5lbCUzQSUyMCcqJyUyQyUyMGlucHV0JTNBJTIwJyonJTIwJTdEKSUwQSUyRiUyRiUyMFNob3clMjBhJTIwc21hbGwlMjBtaWRpJTIwbW9uaXRvciUyMChzaW1pbGFyJTIwdG8lMjBoeWRyYSdzJTIwJTYwYS5zaG93KCklNjApLiUwQW1pZGkuc2hvdygpJTBBJTBBJTJGJTJGJTIwVXNlJTIwYW55JTIwbm90ZSUyMHRvJTIwY29udHJvbCUyMHRoZSUyMHJlZCUyMGFtb3VudCUyMG9mJTIwaHlkcmEncyUyMCU2MHNvbGlkKCklNjAlMjBmdW5jdGlvbi4lMEFzb2xpZChub3RlKCcqJyklMkMlMjAwJTJDJTIwMSkub3V0KCklMEElMEElMkYlMkYlMjBPciUyQyUyMGlmJTIweW91JTIwYXJlJTIwdXNpbmclMjBhJTIwbWlkaSUyMGNvbnRyb2xsZXIlMjBhbmQlMjBub3QlMjBhJTIwa2V5Ym9hcmQlM0ElMEElMkYlMkYlMjBVc2UlMjBhJTIwY29udHJvbCUyMGNoYW5nZSUyMHZhbHVlJTIwdG8lMjBjb250cm9sJTIwdGhlJTIwcmVkJTIwYW1vdW50LiUwQSUyRiUyRiUyMHNvbGlkKGNjKDc0KSUyQyUyMDAlMkMlMjAxKS5vdXQoKQ%3D%3D)

## CDN

All versions beginning from `0.4.0` can be loaded from npm:

```
https://cdn.jsdelivr.net/npm/hydra-midi@latest/dist/index.js
```

all previous versions are available directly from github:

```
https://cdn.jsdelivr.net/gh/arnoson/hydra-midi@0.3.1/dist/index.js

```

## Examples

### Use an envelope and scale it

```js
await loadScript('https://cdn.jsdelivr.net/npm/hydra-midi@latest/dist/index.js')

// Use midi messages from all channels of all inputs.
await midi.start({ input: '*', channel: '*' }).show()

// Trigger an ADSR envelope each time the note C3 is played and scale
// the value to a range between 20 and 50.
osc(note('C3').adsr(300, 200, 1, 300).range(20, 50), 0, 0).out()
```

[Edit on hydra](https://hydra.ojack.xyz/?code=YXdhaXQlMjBsb2FkU2NyaXB0KCUwQSUyMCUyMCdodHRwcyUzQSUyRiUyRmNkbi5qc2RlbGl2ci5uZXQlMkZucG0lMkZoeWRyYS1taWRpJTQwbGF0ZXN0JTJGZGlzdCUyRmluZGV4LmpzJyUwQSklMEElMEElMkYlMkYlMjBVc2UlMjBtaWRpJTIwbWVzc2FnZXMlMjBmcm9tJTIwYWxsJTIwY2hhbm5lbHMlMjBvZiUyMGFsbCUyMGlucHV0cy4lMEFhd2FpdCUyMG1pZGkuc3RhcnQoJTdCJTIwaW5wdXQlM0ElMjAnKiclMkMlMjBjaGFubmVsJTNBJTIwJyonJTIwJTdEKS5zaG93KCklMEElMEElMkYlMkYlMjBUcmlnZ2VyJTIwYW4lMjBBRFNSJTIwZW52ZWxvcGUlMjBlYWNoJTIwdGltZSUyMHRoZSUyMG5vdGUlMjBDMyUyMGlzJTIwcGxheWVkJTIwYW5kJTIwc2NhbGUlMEElMkYlMkYlMjB0aGUlMjB2YWx1ZSUyMHRvJTIwYSUyMHJhbmdlJTIwYmV0d2VlbiUyMDIwJTIwYW5kJTIwNTAuJTBBb3NjKG5vdGUoJ0MzJykuYWRzcigzMDAlMkMlMjAyMDAlMkMlMjAxJTJDJTIwMzAwKS5yYW5nZSgyMCUyQyUyMDUwKSUyQyUyMDAlMkMlMjAwKS5vdXQoKQ%3D%3D)

### Use multiple midi controllers

```js
await loadScript('https://cdn.jsdelivr.net/npm/hydra-midi@latest/dist/index.js')

await midi.start().show()

// Save input 0 (which in this is example could be a seaboard block) in a
// variable. As the seaboard is an MPE-keyboard it makes sense to listen to all
// channels by default.
seaboard = midi.input(0).channel('*')

// Save input 1 (for example a faderfox) in a variable. We don't specify the
// channel so it defaults to channel 0. To use another channel we have to select
// it explicitly in the `note()` or `cc()` functions.
faderfox = midi.input(1)

// Modulate the noise speed with the seaboard's CC74 values (of any channel).
noise(10, seaboard.cc(74))
  // Use any note on the seaboard to modulate the threshold.
  .thresh(seaboard.note('*').adsr().scale(0.6), 0.1)
  // Use the first 3 faders (which happen to be CC40–CC42 on channel 12) of the
  // faderfox to mix a color.
  .color(faderfox.cc(40, 12), faderfox.cc(41, 12), faderfox.cc(42, 12))
  .out()
```

[Edit on hydra](https://hydra.ojack.xyz/?code=YXdhaXQlMjBsb2FkU2NyaXB0KCUwQSUyMCUyMCdodHRwcyUzQSUyRiUyRmNkbi5qc2RlbGl2ci5uZXQlMkZucG0lMkZoeWRyYS1taWRpJTQwbGF0ZXN0JTJGZGlzdCUyRmluZGV4LmpzJyUwQSklMEElMEFhd2FpdCUyMG1pZGkuc3RhcnQoKS5zaG93KCklMEElMEElMkYlMkYlMjBTYXZlJTIwaW5wdXQlMjAwJTIwKHdoaWNoJTIwaW4lMjB0aGlzJTIwaXMlMjBleGFtcGxlJTIwY291bGQlMjBiZSUyMGElMjBzZWFib2FyZCUyMGJsb2NrKSUyMGluJTIwYSUwQSUyRiUyRiUyMHZhcmlhYmxlLiUyMEFzJTIwdGhlJTIwc2VhYm9hcmQlMjBpcyUyMGFuJTIwTVBFLWtleWJvYXJkJTIwaXQlMjBtYWtlcyUyMHNlbnNlJTIwdG8lMjBsaXN0ZW4lMjB0byUyMGFsbCUwQSUyRiUyRiUyMGNoYW5uZWxzJTIwYnklMjBkZWZhdWx0LiUwQXNlYWJvYXJkJTIwJTNEJTIwbWlkaS5pbnB1dCgwKS5jaGFubmVsKCcqJyklMEElMEElMkYlMkYlMjBTYXZlJTIwaW5wdXQlMjAxJTIwKGZvciUyMGV4YW1wbGUlMjBhJTIwZmFkZXJmb3gpJTIwaW4lMjBhJTIwdmFyaWFibGUuJTIwV2UlMjBkb24ndCUyMHNwZWNpZnklMjB0aGUlMEElMkYlMkYlMjBjaGFubmVsJTIwc28lMjBpdCUyMGRlZmF1bHRzJTIwdG8lMjBjaGFubmVsJTIwMC4lMjBUbyUyMHVzZSUyMGFub3RoZXIlMjBjaGFubmVsJTIwd2UlMjBoYXZlJTIwdG8lMjBzZWxlY3QlMEElMkYlMkYlMjBpdCUyMGV4cGxpY2l0bHklMjBpbiUyMHRoZSUyMCU2MG5vdGUoKSU2MCUyMG9yJTIwJTYwY2MoKSU2MCUyMGZ1bmN0aW9ucy4lMEFmYWRlcmZveCUyMCUzRCUyMG1pZGkuaW5wdXQoMSklMEElMEElMkYlMkYlMjBNb2R1bGF0ZSUyMHRoZSUyMG5vaXNlJTIwc3BlZWQlMjB3aXRoJTIwdGhlJTIwc2VhYm9hcmQncyUyMENDNzQlMjB2YWx1ZXMlMjAob2YlMjBhbnklMjBjaGFubmVsKS4lMEFub2lzZSgxMCUyQyUyMHNlYWJvYXJkLmNjKDc0KSklMEElMjAlMjAlMkYlMkYlMjBVc2UlMjBhbnklMjBub3RlJTIwb24lMjB0aGUlMjBzZWFib2FyZCUyMHRvJTIwbW9kdWxhdGUlMjB0aGUlMjB0aHJlc2hvbGQuJTBBJTIwJTIwLnRocmVzaChzZWFib2FyZC5ub3RlKCcqJykuYWRzcigpLnNjYWxlKDAuNiklMkMlMjAwLjEpJTBBJTIwJTIwJTJGJTJGJTIwVXNlJTIwdGhlJTIwZmlyc3QlMjAzJTIwZmFkZXJzJTIwKHdoaWNoJTIwaGFwcGVuJTIwdG8lMjBiZSUyMENDNDAlRTIlODAlOTNDQzQyJTIwb24lMjBjaGFubmVsJTIwMTIpJTIwb2YlMjB0aGUlMEElMjAlMjAlMkYlMkYlMjBmYWRlcmZveCUyMHRvJTIwbWl4JTIwYSUyMGNvbG9yLiUwQSUyMCUyMC5jb2xvcihmYWRlcmZveC5jYyg0MCUyQyUyMDEyKSUyQyUyMGZhZGVyZm94LmNjKDQxJTJDJTIwMTIpJTJDJTIwZmFkZXJmb3guY2MoNDIlMkMlMjAxMikpJTBBJTIwJTIwLm91dCgp)

## Documentation

### midi.start()

Start midi and optionally set default values. You have to call this function before using any midi functions.
Note: It is important to `wait` the function, otherwise midi access isn't ready and you may not be able to target a specific midi input.

```js
await midi.start({
  // Which input to use in `note()` and `cc()` by default.
  // Can be an input index, an input name or '*' to always listen to all inputs
  // by default.
  input: '*',

  // Which channel to use in `note()` and `cc()` by default.
  // Can be a channel index (0 -> midi channel 1, 1 -> midi channel 2, ...) or
  // '*' to always listen to all channels by default.
  channel: '*',

  // Default attack, decay, sustain and release values for the `adsr()` function
  // that can be chained to `note()`.
  adsr: [100, 100, 1, 100],
})
```

### midi.show() / midi.hide()

Show / hide the midi monitor.

### midi.input()

Use the specified input as default. (Doesn't change to global default input)

```js
myKeyboard = midi.input(3)
// Listen to note 60 on the global default channel (defined in `midi.start()`)
//on input #3.
myKeyboard.note(60)
```

```js
myController = midi.input(3).channel(15)
// Listen to CC74 on channel 15 on input #3.
myController.cc(74)
```

### midi.channel()

Use the specified channel as default. (Doesn't change to global default channel)

```js
ch16 = midi.channel(15)
// Listen to CC42 on midi channel 16 (-> channel index 15!).
ch16.cc(42)
```

### note()

Listen to a note. Returns 1 if the notes is currently playing, 0 otherwise.

```js
note(
  // Can be midi note number, a note name (like 'A3' or 'D#2') or '*' to listen
  // to any note.
  note,
  // A channel index between 0 and 15.
  channel?,
  // An input index or input name. (Show the midi monitor to see the indexes).
  input?
)
```

### adsr()

Trigger an envelope each time a note is played. `adsr()`can only be used together with note.

```js
// Attack, decay and release are specified in milliseconds, sustain is a factor
// between 0 and 1.
note('C3').adsr(attack, decay, sustain, release)
```

### velocity()

Retrieves the latest velocity played for the note in a range from 0 to 1.

```js
note('C3').velocity()
```

### cc()

Listen to (normalized) CC values.

```js
cc(
  // The CC index.
  index,
  // A channel index between 0 and 15.
  channel?,
  // An input index or input name. (Show the midi monitor to see the indexes).
  input?
)
```

### .onNote()

You can define an event to trigger when a particular note is played on a specific input or channel:

```js
myController = midi.input(3).channel(15)

myController.onNote('c1', () => osc().out())
```

Or listen to any note:

```js
myController = midi.input(3).channel('*')

scene1 = () => solid(1, 0, 0).out()
scene2 = () => solid(0, 1, 0).out()

myController.onNote('*', ({ note, velocity, channel }) => {
  switch (note) {
    case 36: { scene1(); break; }
    case 37: { scene2(); break; }
  }
})
```
### .onCC()

You can define an event to trigger when a particular CC is changing on a specific input or channel:

```js
myController = midi.input(3).channel(15)

myController.onCC('1', () => osc().out())
```

Or listen to any CC:

```js
myController = midi.input(3).channel('*')

myController.onCC("*", ({ index, value, channel }) => { 
  console.log("onCCevent")
  console.log(index) 
  console.log(value)
  console.log(channel)
});

### Transforms

Values from `note()`, `cc()` and `adsr()` can be transformed using the following functions:

#### scale()

Scale the value by a factor.

```js
note(60).adsr().scale(20)
cc(40).scale(3)
```

#### range()

Map the value to a different range.

```js
cc(41).velocity().range(-0.5, 0.5)
```

#### value()

Apply custom transformations to a value.

```js
note(60)
  .adsr()
  .value(v => Math.sin(v))
```

### Accessing midi values directly

`note()` and `cc()` do not directly return the corresponding values. Instead they return a function. This is useful for usage as a parameter as the values are updated automatically:

```js
// The color will get updated as soon as the value of CC40 changes.
solid(cc(40), 1, 1).out()
```

Together with the [transforms](#Transforms) this should be flexible enough. In same rare cases you might want to use the values directly. You can do so by prefixing the function with an underscore:

```js
osc(() => _cc(40) * 2, 0, 0).out() // This could also be achieved with `scale()` or `value()`.
```

```js
// This will only set the value when executing the script and won't update.
noteIsPlaying = _note(60)
solid(1, 0, 0).invert(noteIsPlaying).out()
```

## Contribute

Contributions to the script and it's documentation are welcome :~) Please make sure you:

- use prettier to format your code (should happen automatically if you work on this project in VSCode)
- use [conventional commits](https://www.conventionalcommits.or) (these are used to automatically generate release messages, including credits for your contributions)

To test this script in development, run `pnpm dev`, which will
- compile (and watch) `/src/index.ts`
- start a local server in `/dist` 
- tunnel it with [untun](https://github.com/unjs/untun)
- open a new tab in your browser with an empty hydra sketch using your local development version of hydra-midi

If you have e.g. Firefox as your default browser but still want to open it in Chrome (needed for WebMidi) run `pnpm dev:chrome`.

Note: there is no automatic browser-reloading when your code has changed. Instead simply re-evaluate your sketch in hydra with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd>