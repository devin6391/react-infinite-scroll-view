export enum ScrollDirection {
  UP = 1,
  DOWN
}

export enum ContainerPosition {
  TOP = 1,
  Bottom
}

export let TopIntersectionObs: IntersectionObserver;
export let BottomIntersectionObs: IntersectionObserver;

const maxAllowedElemsBeyondViewPort = 10;
const minRequiredElementBeyondViewPort = 5;

let scrollDirection: ScrollDirection = ScrollDirection.UP;
let topMostElement: HTMLElement;
let bottomMostElement: HTMLElement;
let topContainerIntersectedElems = new Set<HTMLElement>();
let bottomContainerIntersectedElems = new Set<HTMLElement>();

export function initIntesectionObserver(
  containerRef: React.RefObject<HTMLElement>
) {
  const topIntersectionObserverOptions = {
    root: containerRef.current,
    threshold: [0, 1],
    rootMargin: "5000px 0px -99% 0px"
  };
  TopIntersectionObs = new IntersectionObserver(
    topIntersectionObsCallback,
    topIntersectionObserverOptions
  );

  const bottomIntersectionObserverOptions = {
    root: containerRef.current,
    threshold: [0, 1],
    rootMargin: "-99% 0px 5000px 0px"
  };
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
}

function additionTriggers() {
  if (
    scrollDirection === ScrollDirection.DOWN &&
    topContainerIntersectedElems.size <= minRequiredElementBeyondViewPort
  ) {
    console.warn("Please add more elements at top");
  }
  if (
    scrollDirection === ScrollDirection.UP &&
    bottomContainerIntersectedElems.size <= minRequiredElementBeyondViewPort
  ) {
    console.warn("Please add more elements at bottom");
  }
}

function evictionTriggers() {
  if (
    scrollDirection === ScrollDirection.UP &&
    topContainerIntersectedElems.size >= maxAllowedElemsBeyondViewPort
  ) {
    console.warn("Please remove elements from top");
  }
  if (
    scrollDirection === ScrollDirection.DOWN &&
    bottomContainerIntersectedElems.size >= maxAllowedElemsBeyondViewPort
  ) {
    console.warn("Please remove elements from bottom");
  }
}
