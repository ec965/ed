import { InputRule } from "prosemirror-inputrules";
import { Component, Match, Switch } from "solid-js";
import { SolidNodeViewProps } from "../solidNodeView";
import { NodePlugin } from "../plugin";
import { createSolidNodeView } from "../solidNodeView";

export const Heading: Component<SolidNodeViewProps<HTMLHeadingElement>> = (
  props
) => {
  return (
    <Switch>
      <Match when={props.node.attrs.size === 1}>
        <h1 ref={props.ref} />
      </Match>
      <Match when={props.node.attrs.size === 2}>
        <h2 ref={props.ref} />
      </Match>
      <Match when={props.node.attrs.size === 3}>
        <h3 ref={props.ref} />
      </Match>
    </Switch>
  );
};

export const headingPlugin = new NodePlugin({
  name: "heading",
  nodeSpec: {
    group: "block",
    content: "text*",
    attrs: {
      size: { default: 1 },
    },
    toDOM(node) {
      let tag = "h" + node.attrs.size;

      return [tag, 0];
    },
    parseDOM: [{ tag: "h1" }, { tag: "h2" }, { tag: "h3" }],
  },
  nodeView: createSolidNodeView(Heading),
  inputRules: [
    new InputRule(/^#{1,3} $/, (state, match, start, end) => {
      let size = match[0].length - 1;
      return state.tr.replaceRangeWith(
        start,
        end,
        state.schema.nodes.heading.create({ size })
      );
    }),
  ],
});
