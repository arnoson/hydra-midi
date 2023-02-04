# Hydra Midi

A utility script for using midi with https://hydra.ojack.xyz.

## Important

- Showing the GUI (`midi.show()`) is only working when you re-run the script, should be fixed soon.
- This extension uses C3 as middle C (midi note 60).

## Usage

Visit https://hydra.ojack.xyz. The Hydra Midi Extension will get activated automatically.

Start (and optionally show) midi and use midi inputs as parameters for hydra:

```js
await loadScript(
  'https://cdn.jsdelivr.net/gh/arnoson/hydra-midi@latest/dist/index.js'
)

// Use midi messages from all channels of all inputs.
midi.start({ channel: '*', input: '*' })
// Show a small midi monitor (similar to hydra's `a.show()`).
midi.show()

// Use any note to control the red amount of hydra's `solid()` function.
solid(note('*'), 0, 1).out()

// Or, if you are using a midi controller and not a keyboard:
// Use a control change value to control the red amount.
solid(cc(74), 0, 1).out()
```

[Edit on hydra](https://hydra.ojack.xyz/?code=YXdhaXQlMjBsb2FkU2NyaXB0KCUyMmh0dHBzJTNBJTJGJTJGY2RuLmpzZGVsaXZyLm5ldCUyRmdoJTJGYXJub3NvbiUyRmh5ZHJhLW1pZGklMkZkaXN0JTJGaW5kZXguanMlMjIpJTBBJTBBJTJGJTJGJTIwVXNlJTIwbWlkaSUyMG1lc3NhZ2VzJTIwZnJvbSUyMGFsbCUyMGNoYW5uZWxzJTIwb2YlMjBhbGwlMjBpbnB1dHMuJTBBbWlkaS5zdGFydCglN0IlMjBjaGFubmVsJTIwJTNBJTIwJyonJTJDJTIwaW5wdXQlM0ElMjAnKiclMjAlN0QpJTBBJTJGJTJGJTIwU2hvdyUyMGElMjBzbWFsbCUyMG1pZGklMjBtb25pdG9yJTIwKHNpbWlsYXIlMjB0byUyMGh5ZHJhJ3MlMjAlNjBhLnNob3coKSU2MCkuJTBBbWlkaS5zaG93KCklMEElMEElMkYlMkYlMjBVc2UlMjBhbnklMjBub3RlJTIwdG8lMjBjb250cm9sJTIwdGhlJTIwcmVkJTIwYW1vdW50JTIwb2YlMjBoeWRyYSdzJTIwJTYwc29saWQoKSU2MCUyMGZ1bmN0aW9uLiUwQXNvbGlkKG5vdGUoJyonKSUyQyUyMDAlMkMlMjAxKS5vdXQoKSUwQSUwQSUyRiUyRiUyME9yJTJDJTIwaWYlMjB5b3UlMjBhcmUlMjB1c2luZyUyMGElMjBtaWRpJTIwY29udHJvbGxlciUyMGFuZCUyMG5vdCUyMGElMjBrZXlib2FyZCUzQSUwQSUyRiUyRiUyMFVzZSUyMGElMjBjb250cm9sJTIwY2hhbmdlJTIwdmFsdWUlMjB0byUyMGNvbnRyb2wlMjB0aGUlMjByZWQlMjBhbW91bnQuJTBBc29saWQoY2MoNzQpJTJDJTIwMCUyQyUyMDEpLm91dCgp)

## Examples

### Use an envelope and scale it

```js
await loadScript(
  'https://cdn.jsdelivr.net/gh/arnoson/hydra-midi@latest/dist/index.js'
)

// Use midi messages from all channels of all inputs.
midi.start({ input: '*', channel: '*' })
midi.show()

// Trigger an ADSR envelope each time the note C3 is played and scale
// the value to a range between 20 and 50.
osc(note('C3').adsr(300, 200, 1, 300).range(20, 50), 0, 0).out()
```

[Edit on hydra](https://hydra.ojack.xyz/?code=YXdhaXQlMjBsb2FkU2NyaXB0KCUyMmh0dHBzJTNBJTJGJTJGY2RuLmpzZGVsaXZyLm5ldCUyRmdoJTJGYXJub3NvbiUyRmh5ZHJhLW1pZGklMkZkaXN0JTJGaW5kZXguanMlMjIpJTBBJTBBJTJGJTJGJTIwVXNlJTIwbWlkaSUyMG1lc3NhZ2VzJTIwZnJvbSUyMGFsbCUyMGNoYW5uZWxzJTIwb2YlMjBhbGwlMjBpbnB1dHMuJTBBbWlkaS5zdGFydCglN0IlMjBpbnB1dCUzQSUyMCcqJyUyQyUyMGNoYW5uZWwlM0ElMjAnKiclMjAlN0QpJTBBbWlkaS5zaG93KCklMEElMEElMkYlMkYlMjBUcmlnZ2VyJTIwYW4lMjBBRFNSJTIwZW52ZWxvcGUlMjBlYWNoJTIwdGltZSUyMHRoZSUyMG5vdGUlMjBDMyUyMGlzJTIwcGxheWVkJTIwYW5kJTIwc2NhbGUlMEElMkYlMkYlMjB0aGUlMjB2YWx1ZSUyMHRvJTIwYSUyMHJhbmdlJTIwYmV0d2VlbiUyMDIwJTIwYW5kJTIwNTAuJTBBb3NjKCUwQSUyMCUyMG5vdGUoJ0MzJyklMEElMjAlMjAlMjAlMjAuYWRzcigzMDAlMkMlMjAyMDAlMkMlMjAxJTJDJTIwMzAwKSUwQSUyMCUyMCUyMCUyMC5yYW5nZSgyMCUyQyUyMDUwKSUyQyUwQSUyMCUyMDAlMkMlMEElMjAlMjAwJTBBKS5vdXQoKQ%3D%3D)

### Use multiple midi controllers

```js
await loadScript(
  'https://cdn.jsdelivr.net/gh/arnoson/hydra-midi@latest/dist/index.js'
)

midi.start()
midi.show()

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

[Edit on hydra](https://hydra.ojack.xyz/?code=YXdhaXQlMjBsb2FkU2NyaXB0KCUyMmh0dHBzJTNBJTJGJTJGY2RuLmpzZGVsaXZyLm5ldCUyRmdoJTJGYXJub3NvbiUyRmh5ZHJhLW1pZGklMkZkaXN0JTJGaW5kZXguanMlMjIpJTBBJTBBbWlkaS5zdGFydCgpJTBBbWlkaS5zaG93KCklMEElMEElMkYlMkYlMjBTYXZlJTIwaW5wdXQlMjAwJTIwKHdoaWNoJTIwaW4lMjB0aGlzJTIwaXMlMjBleGFtcGxlJTIwY291bGQlMjBiZSUyMGElMjBzZWFib2FyZCUyMGJsb2NrKSUyMGluJTIwYSUwQSUyRiUyRiUyMHZhcmlhYmxlLiUyMEFzJTIwdGhlJTIwc2VhYm9hcmQlMjBpcyUyMGFuJTIwTVBFLWtleWJvYXJkJTIwaXQlMjBtYWtlcyUyMHNlbnNlJTIwdG8lMjBsaXN0ZW4lMjB0byUyMGFsbCUwQSUyRiUyRiUyMGNoYW5uZWxzJTIwYnklMjBkZWZhdWx0LiUwQXNlYWJvYXJkJTIwJTNEJTIwbWlkaS5pbnB1dCgwKS5jaGFubmVsKCcqJyklMEElMEElMkYlMkYlMjBTYXZlJTIwaW5wdXQlMjAxJTIwKGZvciUyMGV4YW1wbGUlMjBhJTIwZmFkZXJmb3gpJTIwaW4lMjBhJTIwdmFyaWFibGUuJTIwV2UlMjBkb24ndCUyMHNwZWNpZnklMjB0aGUlMEElMkYlMkYlMjBjaGFubmVsJTIwc28lMjBpdCUyMGRlZmF1bHRzJTIwdG8lMjBjaGFubmVsJTIwMC4lMjBUbyUyMHVzZSUyMGFub3RoZXIlMjBjaGFubmVsJTIwd2UlMjBoYXZlJTIwdG8lMjBzZWxlY3QlMEElMkYlMkYlMjBpdCUyMGV4cGxpY2l0bHklMjBpbiUyMHRoZSUyMCU2MG5vdGUoKSU2MCUyMG9yJTIwJTYwY2MoKSU2MCUyMGZ1bmN0aW9ucy4lMEFmYWRlcmZveCUyMCUzRCUyMG1pZGkuaW5wdXQoMSklMEElMEElMkYlMkYlMjBNb2R1bGF0ZSUyMHRoZSUyMG5vaXNlJTIwc3BlZWQlMjB3aXRoJTIwdGhlJTIwc2VhYm9hcmQncyUyMENDNzQlMjB2YWx1ZXMlMjAob2YlMjBhbnklMjBjaGFubmVsKS4lMEFub2lzZSgxMCUyQyUyMHNlYWJvYXJkLmNjKDc0KSklMEElMjAlMjAlMkYlMkYlMjBVc2UlMjBhbnklMjBub3RlJTIwb24lMjB0aGUlMjBzZWFib2FyZCUyMHRvJTIwbW9kdWxhdGUlMjB0aGUlMjB0aHJlc2hvbGQuJTBBJTIwJTIwLnRocmVzaCglMEElMjAlMjAlMjAlMjBzZWFib2FyZCUwQSUyMCUyMCUyMCUyMCUyMCUyMC5ub3RlKCcqJyklMEElMjAlMjAlMjAlMjAlMjAlMjAuYWRzcigpJTBBJTIwJTIwJTIwJTIwJTIwJTIwLnNjYWxlKDAuNiklMkMlMEElMjAlMjAlMjAlMjAwLjElMEElMjAlMjApJTBBJTIwJTIwJTJGJTJGJTIwVXNlJTIwdGhlJTIwZmlyc3QlMjAzJTIwZmFkZXJzJTIwKHdoaWNoJTIwaGFwcGVuJTIwdG8lMjBiZSUyMENDNDAlRTIlODAlOTNDQzQyJTIwb24lMjBjaGFubmVsJTIwMTIpJTIwb2YlMjB0aGUlMEElMjAlMjAlMkYlMkYlMjBmYWRlcmZveCUyMHRvJTIwbWl4JTIwYSUyMGNvbG9yLiUwQSUyMCUyMC5jb2xvcihmYWRlcmZveC5jYyg0MCUyQyUyMDEyKSUyQyUyMGZhZGVyZm94LmNjKDQxJTJDJTIwMTIpJTJDJTIwZmFkZXJmb3guY2MoNDIlMkMlMjAxMikpJTBBJTIwJTIwLm91dCgp)

## Documentation

### midi.start()

Start midi and optionally set default values. You have to call this function before using any midi functions.

```js
midi.start({
  // Which input to use in `note()` and `cc()` by default.
  // Can be an input index, an input name or '*' to always listen to all inputs
  // by default.
  input: 0,

  // Which channel to use in `note()` and `cc()` by default.
  // Can be a channel index (0 -> midi channel 1, 1 -> midi channel 2, ...) or
  // '*' to always listen to all channels by default.
  channel: 0,

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

myController.onNote('c1', () => {
  osc().out()
})
```

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
cc(41).range(-0.5, 0.5)
```

#### value()

Apply custom transformations to a value.

```js
note(60)
  .adsr()
  .value(v => Math.sin(v))
```

### Accessing midi values directly

`note()` and `cc()` do not directly return the corresponding values. Instead they return a function. This is useful for usage as a parameter as the the values are updated automatically:

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
