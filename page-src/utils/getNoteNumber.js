// @ts-check

/**
 * Get the note number for the specified note name.
 * @example getNoteNumber('C3') // -> 60 (Note: uses C3 as middle C!)
 * @param {string|number} note
 * @returns {number|null}
 */
export const getNoteNumber = note => {
  if (typeof note !== 'string') return note

  const name = note.slice(0, -1).toLowerCase()
  const octave = parseInt(note.slice(-1))

  // prettier-ignore
  const offsets = {
    'c': 0, 'c#': 1, 'db': 1, 'd': 2, 'd#': 3, 'eb': 3,
    'e': 4, 'f': 5, 'f#': 6, 'gb': 6, 'g': 7, 'g#': 8,
    'ab': 8, 'a': 9, 'a#': 10, 'bb': 10, 'b': 11
  }

  return offsets[name.toLowerCase()] + (octave + 2) * 12
}
