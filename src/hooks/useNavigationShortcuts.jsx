import { useRef, useState } from 'react';

function useNavigationShortcuts({
  sequence,
  defaultFocused,
  lastAction = () => {},
}) {
  const references = [];
  let currentSequenceNo = getSequenceNo(sequence, defaultFocused);
  for (let i = 0; i < sequence.length; i++) {
    references.push({
      name: sequence[i],
      ref: useRef(),
    });
  }

  function dispatchNavigationShortcut({ type, direction, name }) {
    // console.log({ type, currentSequenceNo, direction, name });
    switch (type) {
      case 'ENTER':
        if (currentSequenceNo + direction >= sequence.length) {
          lastAction();
          return;
        }
        currentSequenceNo += direction;
        setTimeout(() => {
          references[currentSequenceNo].ref.current.focus();
        }, 100);
        break;
      case 'CLICK':
        const indexNo = sequence.indexOf(name);
        currentSequenceNo = indexNo >= 0 ? indexNo : currentSequenceNo;
        break;
    }
  }

  return [references, dispatchNavigationShortcut];
}

function getSequenceNo(sequence, name) {
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] === name) {
      return i;
    }
  }
  return -1;
}

export default useNavigationShortcuts;
