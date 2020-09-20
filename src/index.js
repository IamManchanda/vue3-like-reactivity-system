/**
 * Modern Reactivity System in Vanilla JavaScript
 * (With ES6+ JavaScript - Proxy & Reflect)
 * Vue.js version 3 like implementation
 */

/**
 * targetMap stores the effects that each
 * object should re-run when it's updated
 */
const targetMap = new WeakMap();

const track = (target, key) => {
  /**
   * We need to make sure this effect is being tracked
   * Get the current depsMap for this target.
   */
  let depsMap = targetMap.get(target);

  if (!depsMap) {
    /**
     * If there is no map, then create one
     */
    targetMap.set(target, (depsMap = new Map()));

    /**
     * Get the current dependencies (effects)
     * that need to be run when this is set
     */
    let dep = depsMap.get(key);

    if (!dep) {
      /**
       * If there is no dependencies (effects),
       * then Create a new Set
       */
      depsMap.set(key, (dep = new Set()));

      /**
       * Add the effect to dependency map
       */
      dep.add(effect);
    }
  }
};

const trigger = (target, key) => {
  /**
   * Does this object have any properties
   * that have dependencies (effects) ???
   */
  const depsMap = targetMap.get(target);

  if (!depsMap) {
    /**
     * If there is no map, then just return back!
     */
    return;
  }

  /**
   * Check if there are dependencies (effects)
   * associated with this ???
   */
  let dep = depsMap.get(key); // If there are dependencies (effects) associated with this
  if (dep) {
    /**
     * If dependencies (effects) exists,
     * then run them all
     */
    dep.forEach((effect) => {
      effect();
    });
  }
};

/**
 * Unleash the reactivity
 */

let state = {
  price: 5,
  quantity: 2,
};
let total = 0;
let effect = () => {
  total = state.price * state.quantity;
};

track(state, "quantity");
effect();
console.log("Total before update:", total);
// => Total before update: 10

state.quantity = 3;
trigger(state, "quantity");
console.log("Total after update:", total);
// => Total after update: 15
