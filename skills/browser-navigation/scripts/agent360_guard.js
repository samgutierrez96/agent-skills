// Trusted skill helper for functions.exec; no imports, I/O, retries or browser calls.
(() => {
  function unpack(response) {
    if (!response || typeof response !== "object" || response.isError === true) {
      throw new Error("Browser tool failed; inspect current state before continuing.");
    }
    const blocks = response.content;
    if (!Array.isArray(blocks) || blocks.length !== 1 || blocks[0]?.type !== "text") {
      throw new Error("Unknown browser response; stop dependent actions.");
    }
    let value;
    try { value = JSON.parse(blocks[0].text); } catch {
      throw new Error("Unreadable browser response; stop dependent actions.");
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Unknown browser payload; stop dependent actions.");
    }
    return value;
  }

  function read(response) {
    const value = unpack(response);
    if (value.ok === false || value.found === false || value.error || value.maybe_landed === true
        || value.landed === false) {
      throw new Error("Browser read not verified; stop dependent actions.");
    }
    return value;
  }

  async function step(action, observe) {
    if (typeof action !== "function" || typeof observe !== "function") {
      throw new Error("A browser step needs an action and read-only postcondition before execution.");
    }
    const value = unpack(await action()); // Exactly one attempt, including mutations.
    const uncertain = value.maybe_landed === true;
    const failed = value.ok === false || value.found === false || value.error || value.landed === false;
    const acknowledged = value.ok === true || value.landed === true || value.found === true;
    if ((failed && !uncertain) || (!acknowledged && !uncertain)) {
      throw new Error("Browser action failed; inspect state without retrying the action.");
    }
    // A background click can report failure after its fallback actually landed.
    // Only a fresh, caller-supplied, read-only postcondition resolves that outcome.
    if (await observe() !== true) {
      throw new Error("Browser action outcome unresolved; stop without replaying it.");
    }
    return { verified: true, uncertain_response: uncertain };
  }

  async function steps(sequence) {
    if (!Array.isArray(sequence) || sequence.some(value => !value
        || typeof value.action !== "function" || typeof value.observe !== "function")) {
      throw new Error("Invalid browser batch; no action was executed.");
    }
    const results = [];
    for (const { action, observe } of sequence) results.push(await step(action, observe));
    return results;
  }

  return Object.freeze({ read, step, steps });
})()
