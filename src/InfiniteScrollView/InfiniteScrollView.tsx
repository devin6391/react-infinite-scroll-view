import * as React from "react";
import throttle from "lodash.throttle";
import debounce from "lodash.debounce";
import {
  ScrollDirection,
  setScrollDirection,
  getScrollDirection,
  initIntesectionObserver,
  TopIntersectionObs,
  getTopmostElement,
  BottomIntersectionObs,
  getBottomMostElement
} from "./utils";
import "./InfiniteScrollView.css";

export interface InfiniteScrollViewProps {
  children: JSX.Element[];
  loadingComponentTop?: JSX.Element;
  loadingComponentBottom?: JSX.Element;
  pivotKeySelector?: string;
  onScrollReachEnd?: (direction: ScrollDirection) => void;
  onScrollAboutToReachEnd?: (direction: ScrollDirection) => void;
  onScroll?: (direction: ScrollDirection) => void;
  onscrollEnd?: (direction: ScrollDirection) => void;
  onTouch?: (direction: ScrollDirection) => void;
  onFirstRender?: () => void;
}

export default class InfiniteScrollView extends React.Component<
  InfiniteScrollViewProps
> {
  private scrollRef = React.createRef<HTMLDivElement>();
  private listRef = React.createRef<HTMLDivElement>();

  private touchPositionY = 0;

  private disableScrollHandler = false;

  componentDidMount() {
    const { pivotKeySelector } = this.props;
    initIntesectionObserver(this.scrollRef);
    this.observeIntersectionOnChildren();

    if (pivotKeySelector) {
      const pivotElem = document.querySelector(pivotKeySelector) as HTMLElement;
      setTimeout(() => {
        if (this.scrollRef.current && this.listRef.current && pivotElem) {
          const listRefOffsetTop = this.listRef.current.offsetTop;
          const pivotElemOffsetTop = pivotElem.offsetTop;
          this.scrollRef.current.scrollTop =
            listRefOffsetTop + pivotElemOffsetTop;
        }
      }, 0);

      setInterval(() => {
        console.log("Topmost element initially is: ", getTopmostElement());
        console.log("Bottommost element initially is: ", getBottomMostElement());
      }, 2000);
    }
  }

  shouldComponentUpdate(newProps: InfiniteScrollViewProps) {
    this.unObserveIntersectionOnChildren();
    return true;
  }

  componentDidUpdate() {
    this.observeIntersectionOnChildren();
  }

  render() {
    const {
      loadingComponentTop,
      loadingComponentBottom,
      children
    } = this.props;
    return (
      <div
        ref={this.scrollRef}
        className="infiniteScrollContainer"
        onScroll={this.throttleScroll}
        onTouchStart={this.touchStartHandler}
        onTouchMove={this.touchMoveHandler}
      >
        {loadingComponentTop && (
          <div className="loadingComponentTop">{loadingComponentTop}</div>
        )}
        <div ref={this.listRef} className="listContainer">
          {children}
        </div>
        {loadingComponentBottom && (
          <div className="loadingComponentBottom">{loadingComponentBottom}</div>
        )}
      </div>
    );
  }

  private touchStartHandler = (evt: React.SyntheticEvent<EventTarget>) => {
    const nativeEvent = evt.nativeEvent as TouchEvent;
    const touchPosition = nativeEvent.touches[0];
    this.touchPositionY = touchPosition.pageY;
  };

  private touchMoveHandler = (evt: React.SyntheticEvent<EventTarget>) => {
    const nativeEvent = evt.nativeEvent as TouchEvent;
    const touchPosition = nativeEvent.touches[0];
    const touchDirection =
      touchPosition.pageY - this.touchPositionY > 0
        ? ScrollDirection.DOWN
        : ScrollDirection.UP;
    setScrollDirection(touchDirection);
  };

  private scrollHandler = () => {
    const { onScroll } = this.props;
    if (this.disableScrollHandler) {
      return;
    }
    this.debouncedScroll();
    onScroll && onScroll(getScrollDirection());
  };

  private scrollEnd = () => {
    const { onscrollEnd } = this.props;
    if (this.disableScrollHandler) {
      return;
    }
    onscrollEnd && onscrollEnd(getScrollDirection());
  };

  private throttleScroll = throttle(this.scrollHandler, 50);
  private debouncedScroll = debounce(this.scrollEnd, 100);

  private observeIntersectionOnChildren = () => {
    if (!this.listRef.current) {
      throw new Error(
        "There must be list containing all children to apply intersection observer on"
      );
    }
    const children = this.listRef.current.children;
    for (let i = 0; i < children.length; i++) {
      TopIntersectionObs.observe(children[i]);
      BottomIntersectionObs.observe(children[i]);
    }
  };

  private unObserveIntersectionOnChildren = () => {
    if (!this.listRef.current) {
      throw new Error(
        "There must be list containing all children to apply intersection observer on"
      );
    }
    const children = this.listRef.current.children;
    for (let i = 0; i < children.length; i++) {
      TopIntersectionObs.unobserve(children[i]);
    }
  };
}
