/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { connect } = require("react-redux");
const { Component, createFactory } = require("react");
const dom = require("react-dom-factories");
const PropTypes = require("prop-types");

const AnimationTarget = createFactory(
  require("devtools/client/inspector/animation/components/AnimationTarget")
);
const SummaryGraph = createFactory(
  require("devtools/client/inspector/animation/components/graph/SummaryGraph")
);

class AnimationItem extends Component {
  static get propTypes() {
    return {
      animation: PropTypes.object.isRequired,
      emitEventForTest: PropTypes.func.isRequired,
      getAnimatedPropertyMap: PropTypes.func.isRequired,
      getNodeFromActor: PropTypes.func.isRequired,
      onHideBoxModelHighlighter: PropTypes.func.isRequired,
      onShowBoxModelHighlighterForNode: PropTypes.func.isRequired,
      selectAnimation: PropTypes.func.isRequired,
      selectedAnimation: PropTypes.object.isRequired,
      setHighlightedNode: PropTypes.func.isRequired,
      setSelectedNode: PropTypes.func.isRequired,
      simulateAnimation: PropTypes.func.isRequired,
      timeScale: PropTypes.object.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      isSelected: this.isSelected(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isSelected: this.isSelected(nextProps),
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.isSelected !== nextState.isSelected ||
      this.props.animation !== nextProps.animation ||
      this.props.timeScale !== nextProps.timeScale
    );
  }

  isSelected(props) {
    return props.selectedAnimation && props.animation.actorID === props.selectedAnimation.actorID;
  }

  render() {
    const {
      animation,
      emitEventForTest,
      getAnimatedPropertyMap,
      getNodeFromActor,
      onHideBoxModelHighlighter,
      onShowBoxModelHighlighterForNode,
      selectAnimation,
      setHighlightedNode,
      setSelectedNode,
      simulateAnimation,
      timeScale,
    } = this.props;
    const { isSelected } = this.state;

    return dom.li(
      {
        className: `animation-item ${animation.state.type} ` + (isSelected ? "selected" : ""),
      },
      AnimationTarget({
        animation,
        emitEventForTest,
        getNodeFromActor,
        onHideBoxModelHighlighter,
        onShowBoxModelHighlighterForNode,
        setHighlightedNode,
        setSelectedNode,
      }),
      SummaryGraph({
        animation,
        emitEventForTest,
        getAnimatedPropertyMap,
        selectAnimation,
        simulateAnimation,
        timeScale,
      })
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedAnimation: state.animations.selectedAnimation,
  };
};

module.exports = connect(mapStateToProps)(AnimationItem);
