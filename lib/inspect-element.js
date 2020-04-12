'use babel';

import { CompositeDisposable } from 'atom';
import { remote } from 'electron';

var subscriptions = null;

// Reference to the current app window to be set
// upon activation.
let win = null;

function inspect(el) {
  if (!win || !el) return;

  // Get the target element's position on  in the window
  // using its rect.
  const { left, top } = el.getBoundingClientRect();
  const x = parseInt(left);
  const y = parseInt(top);

  // Atom does not have a public API for triggering
  // element inspection, so electron's native
  // inspect-element functionality must be used instead.
  win.inspectElement(x, y);

  // If the app window's DevTools pane is already open,
  // focus it instead.
  if (win.isDevToolsOpened()) {
    win.devToolsWebContents.focus();
  }
}

function activate() {
  // This functionality already exists in Dev Mode, so
  // do not continue if Dev Mode is active.
  if (atom.inDevMode()) return;

  win = remote.getCurrentWindow();

  subscriptions = new CompositeDisposable();

  subscriptions.add(
    // Command
    atom.commands.add(
      'atom-workspace',
      'inspect-element:inspect',
      ({ target }) => inspect(target)
    ),
    // Context menu item
    atom.contextMenu.add({
      'atom-workspace': [
        { label: 'Inspect Element', command: 'inspect-element:inspect' }
      ]
    })
  );
}

function deactivate() {
  if (subscriptions) {
    subscriptions.dispose();
    subscriptions = null;
  }

  win = null;
}

export default {
  activate,
  deactivate
};
