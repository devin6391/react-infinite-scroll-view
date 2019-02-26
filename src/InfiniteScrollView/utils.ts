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

let elemsContainerRef: React.RefObject<HTMLElement>;
let scrollDirection: ScrollDirection = ScrollDirection.UP;
let topMostElement: HTMLElement;
let bottomMostElement: HTMLElement;
let topContainerIntersectedElems = new Set<HTMLElement>();
let bottomContainerIntersectedElems = new Set<HTMLElement>();

export function initIntesectionObserver(
  containerRef: React.RefObject<HTMLElement>,
  listRef: React.RefObject<HTMLElement>
) {
  elemsContainerRef = listRef;
  const topIntersectionObserverOptions = {
    root: containerRef.current,
    threshold: [0, 0.5, 0.9],
    rootMargin: "500px 0px -99.9% 0px"
  };
  TopIntersectionObs = new IntersectionObserver(
    topIntersectionObsCallback,
    topIntersectionObserverOptions
  );

  const bottomIntersectionObserverOptions = {
    root: containerRef.current,
    threshold: [0, 0.25, 0.5, 0.9],
    rootMargin: "-99.9% 0px 500px 0px"
  };
  BottomIntersectionObs = new IntersectionObserver(
    bottomIntersectionObsCallback,
    bottomIntersectionObserverOptions
  );

  TopIntersectionObs.observe(elemsContainerRef.current as HTMLElement);
  BottomIntersectionObs.observe(elemsContainerRef.current as HTMLElement);
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
    const {target, isIntersecting, intersectionRatio} = entry;
    const roundedIntersectionRatio = Math.round(intersectionRatio * 100);

    if(target === elemsContainerRef.current) {
      listObservation(isIntersecting, roundedIntersectionRatio, ContainerPosition.TOP);
    } else if(target) {
      const targetElem = target as HTMLElement;

      if(!isIntersecting) {
        // If the element is intersecting out then remove it from the set containing all the elements present in scroll view
        // And if after removing the set becomes empty then it means that is the topmost element
        topContainerIntersectedElems.delete(targetElem);
        if(topContainerIntersectedElems.size === 0) {
          topMostElement = targetElem;
        }
      } else {
        // If element is intersecting in then add it to set
        topContainerIntersectedElems.add(targetElem);
        if (
          scrollDirection === ScrollDirection.UP &&
          roundedIntersectionRatio <= 15
        ) {
          // If scroll direction is UP and element has just intersected in or intersecting out with ratio around 20%
          setTopmostElem(targetElem);
        } else if (
          scrollDirection === ScrollDirection.DOWN &&
          roundedIntersectionRatio >= 85
        ) {
          setTopmostElem(targetElem);
        } 
      }
    }
  });
}

function bottomIntersectionObsCallback(entries: IntersectionObserverEntry[]) {
  entries.forEach(entry => {
    const {target, isIntersecting, intersectionRatio} = entry;
    const roundedIntersectionRatio = Math.round(intersectionRatio * 10);
    if(target === elemsContainerRef.current) {
      console.log("Observing whole list");
    } else if(target) {
      const targetElem = target as HTMLElement;

      if(!isIntersecting) {
        bottomContainerIntersectedElems.delete(targetElem);
        if(bottomContainerIntersectedElems.size === 0) {
          bottomMostElement = targetElem;
        }
      } else {
        bottomContainerIntersectedElems.add(targetElem);
        if (
          scrollDirection === ScrollDirection.UP &&
          roundedIntersectionRatio >= 8
        ) {
          setBottommostElem(targetElem);
        } else if (
          scrollDirection === ScrollDirection.DOWN &&
          roundedIntersectionRatio <= 2
        ) {
          setBottommostElem(targetElem);
        }
      }
    }
  })
}

function setTopmostElem(targetElem: HTMLElement) {
  if(topContainerIntersectedElems.has(topMostElement)) {
    topMostElement = targetElem.offsetTop > topMostElement.offsetTop ? targetElem : topMostElement;
  } else {
    topMostElement = targetElem;
  }
}

function setBottommostElem(targetElem: HTMLElement) {
  if(bottomContainerIntersectedElems.has(bottomMostElement)) {
    bottomMostElement = targetElem.offsetTop < bottomMostElement.offsetTop ? targetElem : bottomMostElement;
  } else {
    bottomMostElement = targetElem;
  }
}

function listObservation(isIntersecting: boolean, intersectionRatio: number, intersectionContainer: ContainerPosition) {
  console.log("====List observing====");
  console.log("is intersecting?: ", isIntersecting);
  console.log("intersection ratio: ", intersectionRatio);
  console.log("scroll direction: ", scrollDirection === ScrollDirection.UP ? "UP" : "DOWN");
  if(intersectionContainer === ContainerPosition.TOP) {
    if(scrollDirection === ScrollDirection.DOWN && isIntersecting) {
      console.log("Scroll about to reach Top end");
    } else if(scrollDirection === ScrollDirection.DOWN && !isIntersecting) {
      console.log("Scroll reached Top end");
    } else if(scrollDirection === ScrollDirection.UP && isIntersecting && Math.round(intersectionRatio) === 1) {
      console.log("Scroll length exceeding at top");
    }
  }
}
