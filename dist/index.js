(function () {
  'use strict';

  // @ts-check

  /**
   * Make a function chainable.
   * @param {function} fn The function.
   * @param {Record<string, function>} methods The methods that can be chained to
   * the function. Each entry in `methods` should actually be a method factory.
   * @returns
   */
  const chainable = (fn, methods) => {
    // Clone the function so we don't mutate the original.
    fn = fn.bind({});

    // Add methods that can be chained to the function. Each method gets a
    // reference to the function so it can call it and work with it's return
    // value.
    Object.entries(methods).forEach(([name, factory]) => (fn[name] = factory(fn)));

    return fn
  };

  // @ts-check

  /**
   * Expose variables to global window object.
   * @param {object} obj
   * @returns
   */
  const exposeToWindow = obj =>
    Object.entries(obj).forEach(([key, value]) => (window[key] = value));

  // @ts-check

  /**
   * Get the note number for the specified note name.
   * @example getNoteNumber('C3') // -> 60 (Note: uses C3 as middle C!)
   * @param {string|number} note
   * @returns {number}
   */
  const getNoteNumber = note => {
    if (typeof note !== 'string') return note

    const name = note.slice(0, -1).toLowerCase();
    const octave = parseInt(note.slice(-1));

    // prettier-ignore
    const offsets = {
      'c': 0, 'c#': 1, 'db': 1, 'd': 2, 'd#': 3, 'eb': 3,
      'e': 4, 'f': 5, 'f#': 6, 'gb': 6, 'g': 7, 'g#': 8,
      'ab': 8, 'a': 9, 'a#': 10, 'bb': 10, 'b': 11
    };

    return offsets[name.toLowerCase()] + (octave + 2) * 12
  };

  // @ts-check

  /**
   * @param {number} value
   * @param {number} from
   * @param {number} to
   */
  const linearRamp = (value, from, to) => value * (to - from) + from;

  // @ts-check

  /**
   * Map a value to another range.
   * @param {number} value
   * @param {number} inMin
   * @param {number} inMax
   * @param {number} outMin
   * @param {number} outMax
   * @returns
   */
  const map = (value, inMin, inMax, outMin, outMax) =>
    ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

  var state = {
    /** @type {Record<string, number>} */
    ccValues: {},

    /** @type {Set<string>} */
    playingNotes: new Set(),

    initialDefaults: {
      channel: 0,
      input: 0,
      adsr: [100, 100, 1, 100]
    },

    defaults: {
      channel: 0,
      input: 0,
      adsr: [100, 100, 1, 100]
    }
  };

  // @ts-check

  class Envelope {
    active = false
    noteOn = false
    /** @type {number|null} */
    gateDuration = null
    /** @type {number|null} */
    startTime = null

    constructor({ a, d, s, r }) {
      this.a = a;
      this.d = d;
      this.s = s;
      this.r = r;
    }

    trigger() {
      this.startTime = null;
      this.gateDuration = null;
      this.noteOn = true;
      this.active = true;
    }

    stop() {
      this.noteOn = false;
    }

    /**
     * @param {number} time
     * @returns {number}
     */
    value(time) {
      if (!this.active) return 0

      this.startTime ??= time;
      const elapsedTime = time - this.startTime;
      const { a, d, s, r } = this;

      if (elapsedTime < a) {
        // Attack
        const factor = elapsedTime / a;
        return linearRamp(factor, 0, 1)
      } else if (elapsedTime < a + d && s > 0) {
        // Decay (only if there is sustain)
        const factor = (elapsedTime - a) / d;
        return linearRamp(factor, 1, s)
      } else if (this.noteOn && s > 0) {
        // Sustain (if the note is still on and there is sustain)
        return s
      } else {
        // Release
        this.gateDuration ??= elapsedTime;
        const factor = Math.min(1, (elapsedTime - this.gateDuration) / r);

        // Envelope has finished.
        if (factor === 1) this.active = false;

        // If there was no sustain, there also was no decay so we can start the
        // release at 1.0
        const from = s || 1;
        return linearRamp(factor, from, 0)
      }
    }
  }

  // @ts-check

  /**
   * Generate a new transform that allows to modify the previous value in the
   * function chain.
   * @param {function} fn The previous function
   */
  const value = fn => modify =>
    chainable((...args) => modify(fn(...args)), { scale, range });

  // @ts-check

  /**
   * Generate a new transform that maps the previous value in the function chain
   * to a new range.
   * @param {function} fn The previous function
   */
  const range = fn => (min = 0, max = 1) =>
    chainable((...args) => map(fn(...args), 0, 1, min, max), { scale, value });

  // @ts-check

  /**
   * Generate a new transform that scales the previous value in the function
   * chain.
   * @param {function} fn The previous function
   */
  const scale = fn => factor =>
    chainable((...args) => fn(...args) * factor, { range, value });

  // @ts-check

  const envelopes = {};

  /**
   * Adsr is chainable to `note()`. It creates an envelope and returns a chainable
   * function, which in turn returns the envelope value at a given time.
   * @param {string} noteId
   */
  const adsr = noteId => () => (a, d, s, r) => {
  [a, d, s, r] = [a, d, s, r].map(
      (arg, i) => arg ?? state.defaults.adsr[i] ?? state.initialDefaults.adsr[i]
    );

    envelopes[noteId] = new Envelope({ a, d, s, r });
    const envelope = envelopes[noteId];

    return chainable(({ time }) => envelope.value(time * 1000), {
      scale,
      range,
      value
    })
  };

  // @ts-check

  class SimpleEventEmitter {
    /** @type {Record<any, function[]>} */
    listeners = {}

    /**
     * Add a new event handler.
     * @param {any} type
     * @param {function} handler
     */
    on(type, handler) {
      this.listeners[type] ??= [];
      this.listeners[type].push(handler);
    }

    /**
     * Remove an event handler.
     * @param {any} type
     * @param {function} handler
     */
    off(type, handler) {
      this.listeners[type]?.splice(this.listeners[type].indexOf(handler), 1);
    }

    /**
     * Emit an event.
     * @param {any} type
     * @param {any} payload
     */
    emit(type, payload) {
      this.listeners[type]?.forEach(handler => handler(payload));
    }
  }

  // @ts-check

  /**
   * A thin wrapper around Web Midi.
   */
  class MidiAccess extends SimpleEventEmitter {
    static TypeNoteOff = 0x80
    static TypeNoteOn = 0x90
    static TypeAfterTouchPoly = 0xa0
    static TypeControlChange = 0xb0
    static TypeProgramChange = 0xc0
    static TypeAfterTouchChannel = 0xd0
    static TypePitchBend = 0xe0
    static TypeSystemExclusive = 0xf0
    static TypeTimeCodeQuarterFrame = 0xf1
    static TypeSongPosition = 0xf2
    static TypeSongSelect = 0xf3
    static TypeTuneRequest = 0xf6
    static TypeClock = 0xf8
    static TypeStart = 0xfa
    static TypeContinue = 0xfb
    static TypeStop = 0xfc
    static TypeActiveSensing = 0xfe
    static TypeSystemReset = 0xff

    enabled = false
    isSetup = false
    /** @type {WebMidi.MIDIAccess} */
    access = null

    /**
     * @param {WebMidi.MIDIMessageEvent} message
     * @returns
     */
    static parseMessage(message) {
      const [status, data1, data2] = message.data;
      const type = status & 0xf0;
      const channel = status & 0x0f;
      return { type, channel, data: [data1, data2] }
    }

    async setup() {
      this.access = await navigator.requestMIDIAccess();

      for (const input of this.access.inputs.values()) {
        input.open();
      }
      const handleMessage = this.handleMessage.bind(this);

      this.access.addEventListener('statechange', ({ port }) => {
        if (port.state === 'connected') {
          const input = this.access.inputs.get(port.id);
          input?.addEventListener('midimessage', handleMessage);
        }
      });
      this.isSetup = true;
    }

    async start() {
      if (!this.isSetup) await this.setup();
      this.enabled = true;
    }

    pause() {
      this.enabled = false;
    }

    getInputByIndex(index) {
      return this.access && [...this.access.inputs.values()][index]
    }

    getInputByName(name) {
      return (
        this.access &&
        [...this.access.inputs.values()].find(input => input.name === name)
      )
    }

    /**
     * Get a midi input's id by index or name.
     * @param {number|string} indexOrName
     * @returns {string}
     */
    getInputId(indexOrName) {
      const input =
        typeof indexOrName === 'number'
          ? this.getInputByIndex(indexOrName)
          : this.getInputByName(indexOrName);

      return input?.id
    }

    handleMessage(message) {
      if (this.enabled) {
        const { type, data, channel } = MidiAccess.parseMessage(message);
        this.emit(type, { data, channel, input: message.target });
      }
    }
  }

  var css = ".hydra-midi-gui {\r\n  position: absolute;\r\n  /* Make space for hydra's audio monitor */\r\n  bottom: 80px;\r\n  right: 0;\r\n  margin-bottom: 20px;\r\n  margin-right: 20px;\r\n  padding: 0.3em 0.5em;\r\n  background-color: rgba(0, 0, 0, 0.6);\r\n  color: #cccccc;\r\n  font-family: monospace;\r\n  line-height: 1.2em;\r\n  pointer-events: none;\r\n\r\n  --color-midi-on: orange;\r\n  --color-midi-off: orange;\r\n  --color-midi-cc: dodgerblue;\r\n  --color-midi-bend: #00d86c;\r\n  --color-midi-aft: #e34040;\r\n}\r\n\r\n.hydra-midi-messages {\r\n  white-space: pre;\r\n  /* Reserve spaces for line-height * 10 */\r\n  height: 12em;\r\n  width: 15ch;\r\n}\r\n\r\n.hydra-midi-heading {\r\n  margin-bottom: 3px;\r\n}\r\n\r\n.hydra-midi-input {\r\n  display: flex;\r\n  white-space: pre;\r\n}\r\n\r\n.hydra-midi-input-name {\r\n  display: block;\r\n  max-width: 12ch;\r\n  text-overflow: ellipsis;\r\n  overflow: hidden;\r\n}\r\n";

  // @ts-check

  /** @type {HTMLElement|null} */
  let gui;
  /** @type {HTMLElement|null} */
  let inputs;
  /** @type {HTMLElement|null} */
  let messages;

  const maxMessages = 10;
  let isSetup = false;
  let isEnabled = false;

  const setup = () => {
    const style = document.createElement('style');
    style.innerText = css;
    document.head.append(style);

    gui = document.createElement('div');
    gui.classList.add('hydra-midi-gui');
    gui.innerHTML = `
    <div class="hydra-midi-inputs"></div>
    <span>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</span>
    <div class="hydra-midi-heading">Ch Type Values</div>
    <div class="hydra-midi-messages">${[...Array(maxMessages)]
      .map(() => `<div></div>`)
      .join('')}</div>
  `;

    document.body.append(gui);
    inputs = gui.querySelector('.hydra-midi-inputs');
    messages = gui.querySelector('.hydra-midi-messages');

    isSetup = true;
    isEnabled = true;
  };

  /**
   * Show the gui and set it up if necessary.
   */
  const show = () => {
    if (!isSetup) setup();
    gui.hidden = false;
    isEnabled = true;
  };

  /**
   * Hide the gui.
   */
  const hide = () => {
    gui.hidden = true;
    isEnabled = false;
  };

  /**
   * Render a list of all open midi inputs.
   * @param {WebMidi.MIDIInputMap} list
   */
  const showInputs = list => {
    if (!isEnabled) return

    const getInputName = input => input.name ?? input.id ?? 'n/a';
    const template = (input, index) =>
      `<div class="hydra-midi-input" style="color: var(--color-${input.id})">` +
      `#${index} ` +
      `<span class="hydra-midi-input-name">${getInputName(input)}</span>` +
      `</div>`;

    inputs.innerHTML = [...list.values()].map(template).join('');
  };

  /**
   * Log a midi message and highlight the corresponding input.
   * @param {{
   *  input: WebMidi.MIDIInput,
   *  channel: number,
   *  type: string,
   *  data: number[]
   * }} message
   */
  const logMidiMessage = message => {
    if (!isEnabled) return

    const pad = (value, length = 3) => String(value).padEnd(length, ' ');

    const { input } = message;
    const channel = pad(message.channel, 2);
    const type = pad(message.type, 4);
    const data1 = pad(message.data[0]);
    const data2 = message.data[1] ? pad(message.data[1]) : '';

    messages.removeChild(messages.firstChild);
    const el = document.createElement('div');
    el.style.color = `var(--color-midi-${type})`;
    el.innerHTML = [channel, type, data1, data2].join(' ');
    messages.append(el);

    highlightInput(input, message.type);
  };

  const highlightTimeouts = {};
  /**
   * Let the input flash for a short moment in the color of the received midi
   * message.
   * @param {*} input
   * @param {*} type
   */
  const highlightInput = (input, type) => {
    clearTimeout(highlightTimeouts[input.id]);

    const inputColorVariable = `--color-${input.id}`;
    gui.style.setProperty(inputColorVariable, `var(--color-midi-${type})`);

    highlightTimeouts[input.id] = setTimeout(() => {
      gui.style.setProperty(inputColorVariable, null);
    }, 100);
  };

  // @ts-check

  // Those properties will never change, only their content, so it's save to
  // destructure.
  const { ccValues, playingNotes } = state;

  // Expose the `MidiAccess` instance because we need it in other files too.
  const midiAccess = new MidiAccess();

  /**
   * Get an id for a midi message using an osc style address.
   * @example getMidiId(60, 0, 1) // -> '60/0/1'
   * @param {number|string} value
   * @param {number|string} channel
   * @param {number|string} input
   * @returns
   */
  const getMidiId = (value, channel, input) => {
    if (input !== undefined) {
      return `${value}/${channel}/${input ?? midiAccess.getInputId(0)}`
    }
  };

  /**
   * Get all possible wildcard combinations for a midi id ({@link getMidiId}).
   * If we have an id for a midi note like this: '60/0/1' we could use the
   * wildcard '60/0/*' (Note 60 on channel 0 on any input).
   * @param {number} value
   * @param {number} channel
   * @param {string} input
   * @returns
   */
  const getMidiWildcards = (value, channel, input) => [
    getMidiId('*', '*', '*'),
    getMidiId(value, '*', '*'),
    getMidiId('*', channel, '*'),
    getMidiId('*', '*', input),
    getMidiId(value, channel, '*'),
    getMidiId('*', channel, input),
    getMidiId(value, '*', input)
  ];

  const resolveInput = input =>
    input === '*' ? '*' : midiAccess.getInputId(input);

  const resolveNote = note => (note === '*' ? note : getNoteNumber(note));

  /**
   * For all received midi values we not only save the value for the exact midi id
   * (e.g.: ccValues['74/0/input-0'] = 127) but also all possible wildcards.
   * So for CC 74 this would be:
   * 74 / * / * (CC 74 on any channel and any input)
   * 74 / * / input-0 (CC 74 on any channel on input-0 )
   * ... and so on
   * This might seem a little verbose but this way we can easily poll for values
   * without having to do any additional logic.
   * Listening to CC 74 on channel 0 on any input in hydra: `cc(74, 0, '*')` will
   * internally just look up `ccValues['74/0/*']`, which is super fast.
   */

  midiAccess.on(MidiAccess.TypeControlChange, ({ data, channel, input }) => {
    const [index, value] = data;
    const ccId = getMidiId(index, channel, input.id);
    const normalizedValue = value / 127;

    ccValues[ccId] = normalizedValue;
    getMidiWildcards(index, channel, input.id).forEach(
      wildcard => (ccValues[wildcard] = normalizedValue)
    );

    logMidiMessage({ input, type: 'cc', channel, data });
  });

  midiAccess.on(MidiAccess.TypeNoteOn, ({ data, channel, input }) => {
    const [note] = data;
    const noteId = getMidiId(note, channel, input.id);
    playingNotes.add(noteId);
    envelopes[noteId]?.trigger();

    getMidiWildcards(note, channel, input.id).forEach(wildcard => {
      playingNotes.add(wildcard);
      envelopes[wildcard]?.trigger();
    });

    logMidiMessage({ input, type: 'on', channel, data });
  });

  midiAccess.on(MidiAccess.TypeNoteOff, ({ data, channel, input }) => {
    const [note] = data;
    const noteId = getMidiId(note, channel, input.id);
    playingNotes.delete(noteId);
    envelopes[noteId]?.stop();

    getMidiWildcards(note, channel, input.id).forEach(wildcard => {
      playingNotes.delete(wildcard);
      envelopes[wildcard]?.stop();
    });

    logMidiMessage({ input, type: 'off', channel, data });
  });

  midiAccess.on(MidiAccess.TypePitchBend, ({ input, data, channel }) => {
    const value = ((data[1] << 7) + data[0] - 8192) / 8192;
    const displayValue = +value.toFixed(2);
    logMidiMessage({ input, type: 'bend', channel, data: [displayValue] });
  });

  midiAccess.on(MidiAccess.TypeAfterTouchChannel, ({ input, data, channel }) => {
    logMidiMessage({ input, type: 'aft', channel, data });
  });

  midiAccess.on(MidiAccess.TypeAfterTouchPoly, ({ input, data, channel }) => {
    logMidiMessage({ input, type: 'aft', channel, data });
  });

  // @ts-check

  const noteIsPlaying = noteId => state.playingNotes.has(noteId);

  const getNoteId = (note, channel, input) =>
    getMidiId(
      resolveNote(note),
      channel ?? state.defaults.channel,
      resolveInput(input ?? state.defaults.input)
    );

  /**
   * returns 1 if the specified note is playing, and 0 otherwise. This is useful
   * if you want to use the value inside a parameter function. See also {@link note}.
   * @example solid(1, 0, () => _note(60) * 0.5).out() // Could also be achieved with solid(1, 0, note(60).value(v => v * 0.5)).out()
   * @param {number|string} note
   * @param {number|string} channel
   * @param {number|string} input
   * @returns
   */
  const _note = (note, channel, input) =>
    noteIsPlaying(getNoteId(note, channel, input)) ? 1 : 0;

  /**
   * Create a chainable function that returns 1 if the specified note is playing,
   * and 0 otherwise.
   * @example osc().invert(note(60)).out()
   * @param {number|string} note A note number or a name like 'C3' or '*' to listen
   * to any note.
   * @param {number|string} channel
   * @param {number|string} input
   */
  const note = (note, channel, input) => {
    const noteId = getNoteId(note, channel, input);
    const fn = () => (noteIsPlaying(noteId) ? 1 : 0);
    return chainable(fn, { scale, range, value, adsr: adsr(noteId) })
  };

  // @ts-check

  /**
   * Channel is chainable to `midi` and `input()` and provides a channel for all
   * the functions that are chained to it.
   * @example osc(midi.channel(4).note(60)).out()
   * @example osc(midi.input('my keyboard').channel('*').note(60)).out()
   * @param {number|string} channel
   * @param {number|string} input
   * @returns
   */
  const channel = (channel, input = null) => ({
    note: (_note, _channel, _input) =>
      note(_note, _channel ?? channel, _input ?? input),

    cc: (_index, _channel, _input) =>
      cc(_index, _channel ?? channel, _input ?? input)
  });

  // @ts-check

  /**
   * Input is chainable only to `midi` and provides an input for all the functions
   * that are chained to it.
   * @example osc(midi.input(3).cc(74)).out()
   * @example osc(midi.input('*').channel(15).cc(74)).out()
   * @param {number|string} input
   * @returns
   */
  const input = input => ({
    note: (_note, _channel, _input) => note(_note, _channel, _input ?? input),
    cc: (_index, _channel, _input) => cc(_index, _channel, _input ?? input),
    channel: _channel => channel(_channel, input)
  });

  // @ts-check

  const getCcId = (index, channel, input) =>
    getMidiId(
      index,
      channel ?? state.defaults.channel,
      resolveInput(input ?? state.defaults.input)
    );

  /**
   * Return a CC value. This is useful if you want to use the value inside a
   * parameter function. See also {@link _cc}.
   * @example osc(() => _cc(74) / 2).out() // Could also be achieved with osc(cc(74).value(v => v / 2)).out()
   * @param {number|string} index
   * @param {number|string} channel
   * @param {number|string} input
   * @returns
   */
  const _cc = (index, channel, input) =>
    state.ccValues[getCcId(index, channel, input)] ?? 0;

  /**
   * Generate a chainable function that returns the value for the specified CC
   * index.
   * @example osc(cc(74)).out() // CC 74 will modulate the osc in realtime.
   * @param {number|string} index A CC index or '*' for any CC.
   * @param {number|string} channel A channel or '*' for any channel.
   * @param {number|string} input An input index or an input name or '*' for any
   * input.
   * @returns
   */
  const cc = (index, channel, input) => {
    const ccId = getCcId(index, channel, input);
    const fn = () => state.ccValues[ccId] ?? 0;
    return chainable(fn, { scale, range, value })
  };

  // @ts-check

  const start = defaults => {
    state.defaults = { ...state.initialDefaults, ...defaults };

    midiAccess
      .start()
      .then(() =>
        midiAccess.access.addEventListener('statechange', () =>
          showInputs(midiAccess.access.inputs)
        )
      );

    // Allow `midi.start().show()` chaining.
    return { show }
  };

  const pause = () => midiAccess.pause();

  const midi = { start, pause, show, hide, input, channel };

  // @ts-check
  exposeToWindow({ midi, cc, _cc, note, _note, midiState: state });

})();
