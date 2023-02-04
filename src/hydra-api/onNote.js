// @ts-check

import state from "../state";
import { getNoteId } from "./note";

export const onNote = (note, channel, input, event) => {
    const noteId = getNoteId(note, channel, input);
    state.noteOnEvents[noteId] = event;
};
