import { Component } from "react";

export default class DocsParent extends Component {
  render() {
    return (
      <div>
        <h1>Docs Page</h1>
        <div>{this.props.children}</div>
      </div>
    )
  }
}
