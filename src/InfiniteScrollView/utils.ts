export interface Triggers {
  onReachEnd: (direction: ScrollContainer) => void;
  onAboutToReachEnd: (direction: ScrollContainer) => void;
  onExceedElements: (direction: ScrollContainer) => void;
}
export enum ScrollDirection {
  UP = 1,
  DOWN
}
export enum ScrollContainer {
  TOP = 1,
  BOTTOM
}

export let TopIntersectionObs: IntersectionObserver;
export let BottomIntersectionObs: IntersectionObserver;

// Trigger limits
let maxAllowedElems: number;
let minRequiredElement: number;

// Trigger namespace
let allTriggers: Triggers;

// Scroll direction
let scrollDirection: ScrollDirection = ScrollDirection.UP;

// Elements on the edge of scroll window
let topMostElement: HTMLElement;
let bottomMostElement: HTMLElement;

// Sets containig all elements in respective intersection observers
let topContainerIntersectedElems = new Set<HTMLElement>();
let bottomContainerIntersectedElems = new Set<HTMLElement>();

export function initIntesectionObserver(
  containerRef: React.RefObject<HTMLElement>,
  maxAllowedElemsBeyondViewPort: number,
  minRequiredElementInViewPort: number,
  triggers: Triggers
) {
  maxAllowedElems = maxAllowedElemsBeyondViewPort;
  minRequiredElement = minRequiredElementInViewPort;
  allTriggers = triggers;

  const topIntersectionObserverOptions = {
    root: containerRef.current,
    threshold: [0, 1],
    rootMargin: "5000px 0px -99% 0px"
  };

  const bottomIntersectionObserverOptions = {
    root: containerRef.current,
    threshold: [0, 1],
    rootMargin: "-99% 0px 5000px 0px"
  };

  TopIntersectionObs = new IntersectionObserver(
    topIntersectionObsCallback,
    topIntersectionObserverOptions
  );

  BottomIntersectionObs = new IntersectionObserver(
    bottomIntersectionObsCallback,
    bottomIntersectionObserverOptions
  );
}

export function destroyIntersectionObserver() {
  // Stop all observations
  TopIntersectionObs.disconnect();
  BottomIntersectionObs.disconnect();

  // Nullify all variables
  topMostElement = (null as unknown) as HTMLElement;
  bottomMostElement = (null as unknown) as HTMLElement;
  topContainerIntersectedElems = (null as unknown) as Set<HTMLElement>;
  bottomContainerIntersectedElems = (null as unknown) as Set<HTMLElement>;
  TopIntersectionObs = (null as unknown) as IntersectionObserver;
  BottomIntersectionObs = (null as unknown) as IntersectionObserver;
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
    console.log("Intersectedddd ooo");
    const { target, isIntersecting } = entry;
    if (target) {
      const targetElem = target as HTMLElement;
      if (!isIntersecting) {
        topContainerIntersectedElems.delete(targetElem);
        if (topContainerIntersectedElems.size === 0) {
          topMostElement = targetElem;
        }
      } else {
        topContainerIntersectedElems.add(targetElem);
        setTopmostElem(targetElem);
      }
      triggers();
    }
  });
}

function bottomIntersectionObsCallback(entries: IntersectionObserverEntry[]) {
  entries.forEach(entry => {
    const { target, isIntersecting } = entry;
    if (target) {
      const targetElem = target as HTMLElement;
      if (!isIntersecting) {
        bottomContainerIntersectedElems.delete(targetElem);
        if (bottomContainerIntersectedElems.size === 0) {
          bottomMostElement = targetElem;
        }
      } else {
        bottomContainerIntersectedElems.add(targetElem);
        setBottommostElem(targetElem);
      }
      triggers();
    }
  });
}

function setTopmostElem(targetElem: HTMLElement) {
  if (topContainerIntersectedElems.has(topMostElement)) {
    topMostElement =
      targetElem.offsetTop > topMostElement.offsetTop
        ? targetElem
        : topMostElement;
  } else {
    topMostElement = targetElem;
  }
}

function setBottommostElem(targetElem: HTMLElement) {
  if (bottomContainerIntersectedElems.has(bottomMostElement)) {
    bottomMostElement =
      targetElem.offsetTop < bottomMostElement.offsetTop
        ? targetElem
        : bottomMostElement;
  } else {
    bottomMostElement = targetElem;
  }
}

function triggers() {
  additionTriggers();
  evictionTriggers();
  reachEndTriggers();
}

function additionTriggers() {
  if (
    scrollDirection === ScrollDirection.DOWN &&
    topContainerIntersectedElems.size <= minRequiredElement
  ) {
    allTriggers.onAboutToReachEnd(ScrollContainer.TOP);
  }
  if (
    scrollDirection === ScrollDirection.UP &&
    bottomContainerIntersectedElems.size <= minRequiredElement
  ) {
    allTriggers.onAboutToReachEnd(ScrollContainer.BOTTOM);
  }
}

function evictionTriggers() {
  if (
    scrollDirection === ScrollDirection.UP &&
    topContainerIntersectedElems.size >= maxAllowedElems
  ) {
    allTriggers.onExceedElements(ScrollContainer.TOP);
  }
  if (
    scrollDirection === ScrollDirection.DOWN &&
    bottomContainerIntersectedElems.size >= maxAllowedElems
  ) {
    allTriggers.onExceedElements(ScrollContainer.BOTTOM);
  }
}

function reachEndTriggers() {
  if (topContainerIntersectedElems.size === 0) {
    allTriggers.onReachEnd(ScrollContainer.TOP);
  }
  if (bottomContainerIntersectedElems.size === 0) {
    allTriggers.onReachEnd(ScrollContainer.BOTTOM);
  }
}
