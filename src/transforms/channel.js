// @ts-check

import { cc } from "../hydra-api/cc";
import { note } from "../hydra-api/note";
import { onNote } from "../hydra-api/onNote";

/**
 * Channel is chainable to `midi` and `input()` and provides a channel for all
 * the functions that are chained to it.
 * @example osc(midi.channel(4).note(60)).out()
 * @example osc(midi.input('my keyboard').channel('*').note(60)).out()
 * @param {number|string} channel
 * @param {number|string} input
 * @returns
 */
export const channel = (channel, input = null) => ({
    note: (_note, _channel, _input) =>
        note(_note, _channel ?? channel, _input ?? input),

    cc: (_index, _channel, _input) =>
        cc(_index, _channel ?? channel, _input ?? input),

    onNote: (_note, _event) => onNote(_note, channel, input, _event),
});
