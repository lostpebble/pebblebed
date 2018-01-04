import { Component } from "react";
import { Colors } from "../fela/Colors";
import { createComponent } from "react-fela";

const AppStyles = createComponent(() => ({
  background: Colors.BrightRed,
  "& img": {
    width: 100,
    maxWidth: "100%",
  }
}), "div");

export default class AppParent extends Component {
  render() {
    return (
      <div>
        <h1>Main App Parent</h1>
        <div>{this.props.children}</div>
      </div>
    )
  }
}
