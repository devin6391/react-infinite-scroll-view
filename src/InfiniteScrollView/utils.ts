export enum ScrollDirection {
  UP = 1,
  DOWN
}

export let TopIntersectionObs: IntersectionObserver;

let scrollDirection: ScrollDirection = ScrollDirection.UP;
let topMostElement: HTMLElement;

export function initIntesectionObserver(
  containerRef: React.RefObject<HTMLElement>
) {
  const intersectionObserverOptions = {
    root: containerRef.current,
    threshold: [0, 0.9],
    rootMargin: "100px 0px -100% 0px"
  };
  TopIntersectionObs = new IntersectionObserver(
    intersectionObsCallback,
    intersectionObserverOptions
  );
}

export function setScrollDirection(direction: ScrollDirection) {
  scrollDirection = direction;
}

export function getScrollDirection(): ScrollDirection {
  return scrollDirection;
}

export function getTopmostElement(): HTMLElement {
  return topMostElement;
}

function intersectionObsCallback(entries: IntersectionObserverEntry[]) {
  entries.forEach(entry => {
    console.log("=====Intersection=====");
    console.log("Target: ", entry.target);
    console.log("Is intersection?: ", entry.isIntersecting);
    console.log("Intersection ratio: ", entry.intersectionRatio);
    console.log(
      "scroll direction: ",
      scrollDirection === ScrollDirection.DOWN ? "Down" : "Up"
    );
    if (
      entry.isIntersecting &&
      scrollDirection === ScrollDirection.UP &&
      Math.round(entry.intersectionRatio) === 0
    ) {
      topMostElement = entry.target as HTMLElement;
    } else if (
      entry.isIntersecting &&
      scrollDirection === ScrollDirection.DOWN &&
      Math.round(entry.intersectionRatio) === 1
    ) {
      topMostElement = entry.target as HTMLElement;
    }
  });
}
