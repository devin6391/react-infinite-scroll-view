export enum ScrollDirection {
  UP = 1,
  DOWN
}

export let TopIntersectionObs: IntersectionObserver;
export let BottomIntersectionObs: IntersectionObserver;

let bottomContained = new Set<HTMLElement>();

let scrollDirection: ScrollDirection = ScrollDirection.UP;
let topMostElement: HTMLElement;
let bottomMostElement: HTMLElement;

export function initIntesectionObserver(
  containerRef: React.RefObject<HTMLElement>
) {
  const topIntersectionObserverOptions = {
    root: containerRef.current,
    threshold: [0, 0.9],
    rootMargin: "100px 0px -100% 0px"
  };
  TopIntersectionObs = new IntersectionObserver(
    topIntersectionObsCallback,
    topIntersectionObserverOptions
  );

  const bottomIntersectionObserverOptions = {
    root: containerRef.current,
    threshold: [0, 0.9],
    rootMargin: "-100% 0px 100px 0px"
  };
  BottomIntersectionObs = new IntersectionObserver(
    bottomIntersectionObsCallback,
    bottomIntersectionObserverOptions
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

export function getBottomMostElement(): HTMLElement {
  return bottomMostElement;
}

function topIntersectionObsCallback(entries: IntersectionObserverEntry[]) {
  entries.forEach(entry => {
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

function bottomIntersectionObsCallback(entries: IntersectionObserverEntry[]) {
  entries.forEach(entry => {
    if (
      entry.isIntersecting &&
      scrollDirection === ScrollDirection.UP &&
      Math.round(entry.intersectionRatio) === 1
    ) {
      bottomMostElement = entry.target as HTMLElement;
    } else if (
      entry.isIntersecting &&
      scrollDirection === ScrollDirection.DOWN &&
      Math.round(entry.intersectionRatio) === 0
    ) {
      bottomMostElement = entry.target as HTMLElement;
    }
  })
}
