// @ts-check

import { cc, note, onNote } from "../hydra-api";
import { channel } from "./channel";

/**
 * Input is chainable only to `midi` and provides an input for all the functions
 * that are chained to it.
 * @example osc(midi.input(3).cc(74)).out()
 * @example osc(midi.input('*').channel(15).cc(74)).out()
 * @param {number|string} input
 * @returns
 */
export const input = (input) => ({
    note: (_note, _channel, _input) => note(_note, _channel, _input ?? input),
    cc: (_index, _channel, _input) => cc(_index, _channel, _input ?? input),
    onNote: (_note, _event) => onNote(_note, "*", input, _event),
    channel: (_channel) => channel(_channel, input),
});
